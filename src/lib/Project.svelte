<script>
export let data = {};
export let hLevel =2;
</script>

<article>
    <svelte:element this={'h' + hLevel}>
        {data.title} -  {data.year} 
    </svelte:element>
    
    <img src={data.image} alt={data.title} width=300px height=200px/>
    <p>{data.description}</p>
</article>

