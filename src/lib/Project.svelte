<script>
export let data = {};
export let hLevel =2;
</script>

<article>
    <svelte:element this={'h' + hLevel}>
        {data.title} 
    </svelte:element>
    
    <img src={data.image} alt={data.title} width=300px height=200px/>
    <div id = 'project_description'>
    <p>{data.description}</p>
    <p><span style="font-family: Baskerville; font-variant-numeric: oldstyle-nums;">Created on {data.year}</p>
    <p>{data.url}</p>
    </div>
</article>

