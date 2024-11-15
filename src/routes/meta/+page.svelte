<svelte:head>
  <title>Meta</title>
</svelte:head>
<h2>Meta</h2>

<script>
import * as d3 from 'd3';
import { onMount } from 'svelte';

let data = [];

onMount(async () => {
  data = await d3.csv('loc.csv');
});



</script>


<p>This is a description of the website.</p>
<p>Total lines of code: {data.length}</p>
console.log(data)

