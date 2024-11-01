
<script>
import '../style.css';
import { page } from '$app/stores';
    import { onMount } from 'svelte';

let pages = [
  { url: '/my-portfolio/', title: 'Home' },
  { url: '/my-portfolio/projects', title: 'Projects' },
  { url: '/my-portfolio/resume', title: 'Resume' },
  { url: '/my-portfolio/contacts', title: 'Contacts' },
  { url: 'https://github.com/chm011', title: 'Github Profile' }
];

onMount(() => {
document.body.insertAdjacentHTML(
  'beforeend', 
  `
  <label class="color-scheme" style="position: absolute; top: 1rem; right: 1rem;">
    Theme:
    <select id="theme-switcher">
      <option value="light dark">Automatic</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  </label>`
);

// Function to set the color scheme
function setColorScheme(scheme) {
  document.documentElement.style.setProperty('color-scheme', scheme);
}

// Handle theme switching
const select = document.querySelector('#theme-switcher');

if (select) {
  const savedScheme = localStorage.getItem('colorScheme');
  if (savedScheme) {
    setColorScheme(savedScheme);
    select.value = savedScheme;
  }

  select.addEventListener('input', function (event) {
    const scheme = event.target.value;
    setColorScheme(scheme);
    console.log('Color scheme changed to', scheme);
    localStorage.setItem('colorScheme', scheme);
  });
}
});

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
  /* nav */
  nav {
    display: flex;
    flex-direction: row;
    margin-bottom: 0.2ch;
    border-bottom: 1px solid var(--selected-page-color); /* width style color */
    --border-color: oklch(50% 10% 200 / 40%);
    border-bottom-color: var(--border-color);
    padding: 10px;
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

/* theme switcher */
.color-scheme{
  position: absolute;
  top: 1rem;
  right:1rem;
  font-size:80%;
  font-size: 80%;
  font-family: inherit;
}


html{
  color-scheme: light dark;
}



</style>

