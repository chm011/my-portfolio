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


let width = 1000,
    height = 600;

let xScale, yScale;
    const dataExtent = d3.extent(data, (d) => d.datetime);

    xScale = d3
        .scaleTime()
        .domain(dataExtent)
        .range([0, width])
        .nice();
    
    yScale = d3
        .scaleLinear()
        .domain([0,24])
        .range([height,0])
</script>

<svg viewBox="0 0 {width} {height}">
    <g class="dots"></g>
    {if xScale && yScale}
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

<Stats {stats}/>

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
</style>