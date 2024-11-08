<script>
export let data = {};
export let hLevel =2;
</script>

<article>
    <svelte:element this={'h' + hLevel}>
        {data.title} 
    </svelte:element>
    
    <img src={data.image} alt={data.title} width=300px height=200px/>
    <div>
    <p>{data.description}</p>
    <p> created on {data.year}</p>
    </div>
</article>

