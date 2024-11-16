<svelte:head>
  <title>Meta</title>
</svelte:head>
<h2>Meta</h2>

<script>
import * as d3 from 'd3';
import { onMount } from 'svelte';

let data = [];
let commits = [];

let numberOfFiles = 0;
let maxFileLength = 0;
let longestFile = null;
let averageFileLength = 0;
let totalLOC = 0;
let workByPeriod = 0

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

  const fileGroups = d3.groups(data, (d) => d.file);
  numberOfFiles = d3.groups(data, d => d.file).length;


  let totalFileLength = 0;

  $: fileLengths = d3.rollups(
  data,
  (v) => d3.max(v, (v) => v.line),
  (d) => d.file,
  );

  $: averageFileLength = d3.mean(fileLengths, (d) => d[1]);
    
  $: workByPeriod = d3.rollups(
  data,
  (v) => v.length,
  (d) => d.datetime.toLocaleString('en', { dayPeriod: 'short' }),
);

});

</script>


<dl class="stats">
    <div class="stat-item">
    <dt>Total <abbr title="Lines of code">LOC</abbr></dt>
    <dd>{data.length}</dd>
    </div>
    
    <div class="stat-item">
    <dt>Number of Files</dt>
    <dd>{numberOfFiles}</dd>
    </div>
    
    <div class="stat-item">
    <dt>Maximum File Length</dt>
    <dd>{maxFileLength}</dd>
    </div>  

    <div class="stat-item">
    <dt>Average File length</dt>
    <dd>{averageFileLength}</dd>
    </div>

    <div class="stat-item">
    <dt>Longest File</dt>
    <dd>{longestFile || 'N/A'}</dd>
    </div>

  </dl>


  <style>
  .stats{
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 1em;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }


  dt {
    font-size: 0.8em;
    color: #6c757d;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.3em;
  }

  dd {
    font-size: 1.2em;
    font-weight: bold;
    color: #000; 
    margin: 0; }

</style>
