<script>
   import projects from '$lib/projects.json';
   import Project from '$lib/Project.svelte';
   import Pie from '$lib/Pie.svelte';

   let pieData = [
    { value: 1, label: 'apples' },
    { value: 2, label: 'oranges' },
    { value: 3, label: 'mangos' },
    { value: 4, label: 'pears' },
    { value: 5, label: 'limes' },
    { value: 5, label: 'cherries' },
  ];
</script>

<svelte:head>
  <title>Projects</title>
</svelte:head>

<h1>{projects.length} Projects</h1>

<Pie data="{pieData}" />

<div class="projects">
    {#each projects as project}
    <Project data={project} />
    {/each}
</div>
