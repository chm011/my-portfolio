<script>
   import projects from '$lib/projects.json';
   import Project from '$lib/Project.svelte';
   import Pie from '$lib/Pie.svelte';
   import * as d3 from 'd3';

let query = '';
let filteredProjects;
$: filteredProjects = projects.filter((project) => {
  if (query) {
    return project.title.includes(query);
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

<Pie data="{pieData}" />

<div class="projects">
  {#each filteredProjects as project}
    <Project data={project} />
  {/each}
</div>

