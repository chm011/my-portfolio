
<script>
import '../style.css';
import { page } from '$app/stores';

let pages = [
  { url: '/my-portfolio/', title: 'Home' },
  { url: '/my-portfolio/projects', title: 'Projects' },
  { url: '/my-portfolio/resume', title: 'Resume' },
  { url: '/my-portfolio/contacts', title: 'Contacts' },
  { url: 'https://github.com/chm011', title: 'Github Profile' }
];

</script>


<!--Navigation Bar-->
<nav>
    {#each pages as p }
    <a
        href={p.url} 
        class:current={$page.url.pathname === p.url}
        target={ p.url.startsWith("http") ? "_blank" : null }>
        {p.title}
      </a>
      
    {/each}
    
  </nav>


<!--page content-->
  <slot />


<!--style css-->
<style>
  nav {
    display: flex;
    flex-direction: row;
    margin-bottom: 0.2ch;
    border-bottom: 1px solid var(--selected-page-color); /* width style color */
  }

nav a {
  flex: 1; /* equal width for each nav button*/
  text-decoration: none;
  color: inherit;
  text-align: center;
  padding: 1em;
  
}

nav a.current {
  border-bottom:0.4em solid var(--selected-page-color);
  padding-bottom: 0.5em;
}


nav a:hover {
  border-bottom: 0.4em solid var(--color-accent);
  padding-bottom: 0.5em;
  background-color: oklch(from var(--color-accent) 95% 5% h);
}


</style>