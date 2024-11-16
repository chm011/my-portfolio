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
  numberOfFiles = fileGroups.length;

  let totalFileLength = 0;

  fileGroups.forEach(([file, lines]) => {
      const fileLength = lines.length;
      if (fileLength > maxFileLength) {
        maxFileLength = fileLength;
        longestFile = file;
      }
    });
    
    averageFileLength = numberOfFiles > 0 ? totalFileLength / numberOfFiles : 0;




});

</script>


<dl class="stats">
    <dt>Total <abbr title="Lines of code">LOC</abbr></dt>
    <dd>{data.length}</dd>
    
    <dt>Number of Files</dt>
    <dd>{numberOfFiles}</dd>

    <dt>Maximum File Length</dt>
    <dd>{maxFileLength}</dd>

    <dt>Average File length</dt>
    <dd>{averageFileLength}</dd>

    <dt>Longest File</dt>
    <dd>{longestFile || 'N/A'}</dd>

  </dl>


  <style>
    .stats {
      font-family: Arial, sans-serif;
      margin: 1em 0;
    }
  
    dt {
      font-weight: bold;
    }
  
    dd {
      margin: 0 0 1em 0;
      padding-left: 1em;
    }
  
    abbr {
      text-decoration: none;
      border-bottom: 1px dotted;
      cursor: help;
    }
  </style>
