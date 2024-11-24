<script>
  import projects from '$lib/projects.json';
  import Project from '$lib/Project.svelte';
</script>

<h1>Christie Ma</h1>


<p>Current student in the Masters of Data Science program. I studied pharmacy in previous years and is hoping to combine my strengths and work in healthcare analytics or the consulting field. </p>
<img 
  src="/my-portfolio/PHOTO-2023-04-03-22-38-17.jpg" alt="Profile Photo"  width="200" height="270" 
/>

<br></br>
<br></br>
<h2>Lastest Projects </h2>
<div class ="projects">
  {#each projects.slice(0,3) as project}
  <Project data ={project} hLevel=3/>
  {/each}
</div>


{#await fetch("https://api.github.com/users/chm011") }
{:then response}
  {#await response.json() then profileData}
    <section>
      <h2>Profile Data</h2>
      <dl class="profile-stats">
        <div>
          <dt>Followers</dt>
          <dd>{profileData.followers}</dd>
        </div>
        <div>
          <dt>Following</dt>
          <dd>{profileData.following}</dd>
        </div>
        <div>
          <dt>Public Repos</dt>
          <dd>{profileData.public_repos}</dd>
        </div>
        <div>
          <dt>Public Gists</dt>
          <dd>{profileData.public_gists}</dd>
        </div>
      </dl>
      </section>
  {/await}
{:catch error}
<p class="error">Something went wrong: {error.message}</p>
{/await}


<style>
    .profile-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1em; 
    text-align: left;
  }

  .profile-stats dt {
    font-weight: bold;
    color: #333;
    grid-row: 1; 
  }

  .profile-stats dd {
    font-size: 1.2em;
    color: #555;
    grid-row: 2; 
    margin: 0;
  }

  section {
    margin: 2em 0;
    padding: 1em;
  }



</style>