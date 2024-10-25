<script>
  import projects from '$lib/projects.json';
  import Project from '$lib/Project.svelte';
</script>

<h1>Christie Ma</h1>


<p>Current student in the Masters of Data Science program. I studied pharmacy in previous years and is hoping to combine my strengths and work in healthcare analytics or the consulting field. </p>
<img 
  src="/my-portfolio/PHOTO-2023-04-03-22-38-17.jpg" alt="Profile Photo"  width="200" height="270" 
/>

<h2>Lastest Projects </h2>
<div class ="projects">
  {#each projects.slice(0,3) as project}
  <Project data ={project} hLevel=3/>
  {/each}
</div>