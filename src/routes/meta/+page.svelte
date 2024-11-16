<svelte:head>
  <title>Meta</title>
</svelte:head>
<h2>Meta</h2>

<script>   
import * as d3 from 'd3';
import { onMount } from 'svelte';
import Stats from '$lib/stats.svelte';

let data = [];
let commits = [];

let totalLOC = 0;
let numberOfFiles = 0;
let maxFileLength = 0;
let averageFileLength = 0;
let workByPeriod = [];
let maxPeriod = null;


let width = 1000,
    height = 600;

let margin = { top: 10, right: 10, bottom: 30, left: 20 };

let usableArea = {
  top: margin.top,
  right: width - margin.right,
  bottom: height - margin.bottom,
  left: margin.left,
};
usableArea.width = usableArea.right - usableArea.left;
usableArea.height = usableArea.bottom - usableArea.top;

let xScale, yScale;
let xAxis, yAxis;

onMount(async () => {
    data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: Number(row.line), // or just +row.line
    depth: Number(row.depth),
    length: Number(row.length),
    date: new Date(row.date + 'T00:00' + row.timezone),
    datetime: new Date(row.datetime),
    language: row.type || 'Unknown',
}));

    commits = d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
    let first = lines[0];
    let { author, date, time, timezone, datetime } = first;

    let ret = {
      id: commit,
      url: 'https://github.com/vis-society/lab-7/commit/' + commit,
      author,
      date,
      time,
      timezone,
      datetime,
      hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
      totalLines: lines.length,
    };

    // Like ret.lines = lines
    // but non-enumerable so it doesn’t show up in JSON.stringify
    Object.defineProperty(ret, 'lines', {
      value: lines,
      configurable: true,
      writable: true,
      enumerable: false,
    });

    return ret;
    });
});



$: totalLOC = d3.sum(data, (d) => d.line);
$: numberOfFiles = d3.groups(data, d => d.file).length;  
$: fileLengths = d3.rollups(
    data,
    (v) => d3.max(v, (v) => v.line),
    (d) => d.file,
    );
$: maxFileLength = d3.max(fileLengths, (d) => d[1])||0;
$: averageFileLength = d3.mean(fileLengths, (d) => d[1])|| 0;  
$: workByPeriod = d3.rollups(
        data,
        (v) => v.length,
        (d) => d.datetime.toLocaleString('en', { dayPeriod: 'short' }),
        );
$: maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];


$: stats = [
    { label: 'Total LOC', value: totalLOC },
    { label: 'Number of Files', value: numberOfFiles },
    { label: 'Maximum File Length', value: maxFileLength },
    { label: 'Average File Length', value: averageFileLength.toFixed(2) },
    { label: 'Period With Most Work', value: maxPeriod },
  ];


$: if (data.length>0){
    const dataExtent = d3.extent(data, (d) => d.datetime);

    xScale = d3
        .scaleTime()
        .domain(dataExtent)
        .range([usableArea.left, usableArea.right])
        .nice();
        
    yScale = d3
        .scaleLinear()
        .domain([0,24])
        .range([usableArea.bottom,usableArea.top])
    }

$: if (xScale && yScale) {
  d3.select(xAxis).call(d3.axisBottom(xScale));
}

let yAxisGridlines;
$: if (yScale) {
  d3.select(yAxisGridlines).call(
    d3.axisLeft(yScale)
    .tickFormat((d) => String(d % 24).padStart(2, '0') + ':00')
    .tickSize(-usableArea.width),
  );
}

let hoveredIndex = -1;
$: hoveredCommit = commits[hoveredIndex] ?? hoveredCommit ?? {};


let cursor = { x: 0, y: 0 };


let svg;
$: {
    if (svg){
        d3.select(svg).call(d3.brush().on('start brush end', brushed));
        d3.select(svg).selectAll('.dots, .overlay ~ *').raise();
    }
}

let brushSelection = null;

function brushed(evt) {
  const selection = evt.selection;
  if (selection) {
    brushSelection = selection;
  } else {
    brushSelection = null;

  }
}

function isCommitSelected(commit) {
  if (!brushSelection) {
    return false;
  }
    const min = { x: brushSelection[0][0], y: brushSelection[0][1] };
    const max = { x: brushSelection[1][0], y: brushSelection[1][1] };

    const x = xScale(commit.datetime);
    const y = yScale(commit.hourFrac);
    return x >= min.x && x <= max.x && y >= min.y && y <= max.y;
    
  }

  $: {
  if (brushSelection) {
    selectedCommits = commits.filter(isCommitSelected);
  } else {
    selectedCommits = [];
  }
}

$: console.log("Selected commits:", selectedCommits);


$: selectedCommits = brushSelection ? commits.filter(isCommitSelected) : [];
$: hasSelection = brushSelection && selectedCommits.length > 0;

let selectedLines = [];
  $: selectedLines = (hasSelection ? selectedCommits : commits).flatMap(
    (d) => d.lines
  );

  console.log("Selected lines:", selectedLines);

let languageBreakdown;
$: if (selectedLines.length > 0) {
    
    const rawBreakdown = d3.rollups(
        selectedLines,
        (v) => v.length,
        (d) => d.language || 'Unknown'
    );

    console.log("Raw breakdown:", rawBreakdown);

    languageBreakdown = rawBreakdown.map(([language,count]) => ({
        language, 
        proportion: count / selectedLines.length,

    }));
    console.log("Formatted language breakdown:", languageBreakdown);

} else {
    languageBreakdown = [];
}

</script>
<Stats {stats}/>


<h3> Commits by Time of Day </h3>
<svg viewBox="0 0 {width} {height}" bind:this={svg}>
    <g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this="{yAxisGridlines}"></g>
    <g transform="translate(0, {height - margin.bottom})" bind:this={xAxis}></g>
    <g transform="translate({margin.left}, 0)" bind:this={yAxis}></g>
    <g class="dots">
        {#if xScale && yScale}
          {#each commits as commit, index}
            <circle
              cx={xScale(commit.datetime)}
              cy={yScale(commit.hourFrac)}
              r="5"
              fill="steelblue"
              stroke="white"
              stroke-width="1"
              on:mouseenter={evt => hoveredIndex = index} 
              on:mouseleave={evt => hoveredIndex = -1}
              on:mouseenter={evt => {
                hoveredIndex = index;
                cursor = {x: evt.x, y: evt.y};
              }}
              class:selected={isCommitSelected(commit)}  /> 
          {/each}
        {/if}
      </g>   
</svg>

<dl id="commit-tooltip" 
    class="info tooltip" 
    hidden={hoveredIndex === -1} 
    style="top: {cursor.y}px; left: {cursor.x}px">
    <dt>Commit</dt>
    <dd>
      <a href="{ hoveredCommit.url }" target="_blank">{ hoveredCommit.id }</a>
    </dd>
  
    <dt>Date</dt>
    <dd>{ hoveredCommit.datetime?.toLocaleString("en", {dateStyle: "full"}) }</dd>
  
    <dt>Time</dt>
    <dd>{hoveredCommit.datetime?.toLocaleTimeString("en", { timeStyle: "short" })}</dd>
  
    <dt>Author</dt>
    <dd>{hoveredCommit.author || "Unknown"}</dd>

    <dt>Lines Edited</dt>
    <dd>{hoveredCommit.totalLines || 0}</dd>

  </dl>

<p>{hasSelection ? selectedCommits.length : "No"} commits selected</p>


<div>
    <h3>Language Breakdown</h3>
    {#if languageBreakdown.length > 0}
      {#each languageBreakdown as { language, proportion }}
        <div>
          {language}: {d3.format(".1%")(proportion)}
        </div>
      {/each}
    {:else}
      <p>No language data available.</p>
    {/if}
  </div>
  


<style>
    svg{
        overflow:visible;
        border: 1px solid #ccc;
    }

    circle{
        transition: 200ms;
    }

    circle:hover {
    transform: scale(1.5);
    transform-origin: center;
    transform-box: fill-box;
    }

    .dots circle{
        opacity: 0.8;
        transition: transform 0.2s, opacity 0.2s;
    }

    .dots circle:hover{
        transform: scale(1.5);
        opacity: 1;
    }
    .dots circle.selected{
        fill: purple;
        stroke: black;
        stroke-width: 2;
    }

    .gridlines {
        stroke-opacity: 0.2;
    }

    .tooltip{
        position: fixed;
        top:5em;
        left: 0.5em;
        background-color: #e0e0e0;
        box-shadow: 1px 1px rgb(133, 133, 133);
        border-radius: 5px;
        backdrop-filter: : blur(10px);
        padding: 1em;
        }

    
    dl.info{
        display: grid;
        grid-template-columns: auto auto; 
        gap:0.5em;
        margin:0;
        transition-duration: 500ms;
        transition-property: opacity, visibility;

        &[hidden]:not(:hover, :focus-within) {
            opacity: 0;
            visibility: hidden;}
  }
        

    .info dt{
        font-size: 10pt;
        font-weight: bold;
        color: #aaa;
    }

    .info dd{
        font-size: 10pt;
        margin: 0;
    }
    
    @keyframes marching-ants {
        to {
            stroke-dashoffset: -8; /* 5 + 3 */
        }
}

    svg :global(.selection) {
    fill-opacity: 10%;
    stroke: black;
    stroke-opacity: 70%;
    stroke-dasharray: 5 3;
    animation: marching-ants 2s linear infinite;
}

</style>
