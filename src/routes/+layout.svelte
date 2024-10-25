
<script>
import { page } from '$app/stores';

let pages = [
  { url: '/my-portfolio/', title: 'Home' },
  { url: '/my-portfolio/projects', title: 'Projects' },
  { url: '/my-portfolio/resume', title: 'Resume' },
  { url: '/my-portfolio/contacts', title: 'Contacts' },
  { url: 'https://github.com/chm011', title: 'Github Profile' }
];
</script>


<nav>
    {#each pages as p }
    <a href = {p.url}>{p.title}</a>

    {/each}
  </nav>

  {
    JSON.stringify($page);
  }

  
  <slot />
