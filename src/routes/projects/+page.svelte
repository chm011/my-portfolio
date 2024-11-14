<script>
   import projects from '$lib/projects.json';
   import Project from '$lib/Project.svelte';
   import Pie from '$lib/Pie.svelte';
   import * as d3 from 'd3';

   
let query = '';
let selectedYearIndex = -1;
let selectedYear; 

let filteredProjects;
$: filteredProjects = projects.filter((project) => {
  if (query) {
    return project.title.includes(query);
  }

  return true;
});

let filteredByYear;
  $: filteredByYear = filteredProjects.filter((project) => {
    if (selectedYear) {
      return project.year === selectedYear;
    }
    return true;
  });
  
let pieData;

  $:{
    pieData={};
    let rolledData = d3.rollups(
      filteredProjects,
      (v) => v.length,
      (d) => d.year
      );
    
    pieData = rolledData.map(([year, count]) => {
      return { value: count, label: year };
      });
  }

  $: selectedYear = selectedYearIndex > -1 ? pieData[selectedYearIndex].label : null;
</script>


<svelte:head>
  <title>Projects</title>
</svelte:head>

<h1>{projects.length} Projects</h1>

<input
  type="search"
  bind:value="{query}"
  aria-label="Search projects"
  placeholder="🔍 Search projects…"
/>

<Pie data="{pieData}" bind:selectedIndex="{selectedYearIndex}" />

<div class="projects">
  {#each filteredByYear as project}
    <Project data={project} />
  {/each}
</div>

