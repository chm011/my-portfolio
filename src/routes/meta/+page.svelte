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
  d3.select(yAxis).call(d3.axisLeft(yScale));
}

let yAxisGridlines;
$: if (yScale) {
  d3.select(yAxisGridlines).call(
    d3.axisLeft(yScale).tickFormat((d) => `$(String(d).padStart(2,'0')}:00)`).tickSize(-usableArea.width),
  );
}

</script>
<Stats {stats}/>


<h3> Commits by Time of Day </h3>
<svg viewBox="0 0 {width} {height}">
    <g transform="translate(0, {height - margin.bottom})" bind:this={xAxis}></g>
    <g transform="translate({margin.left}, 0)" bind:this={yAxis}></g>
    <g class="gridlines" transform="translate({usableArea.left}, 0)" bind:this="{yAxisGridlines}"/>
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
           />
        {/each}
    {/if}
    </g>    
</svg>



<style>
    svg{
        overflow:visible;
        border: 1px solid #ccc;
    }

    .dots circle{
        opacity: 0.8;
        transition: transform 0.2s, opacity 0.2s;
    }

    .dots circle:hover{
        transform: scale(1.5);
        opacity: 1;
    }
    .gridlines {
        stroke-opacity: 0.2;
}
</style>