<script>
    export let stats = [];
</script>

<dl class ="stats">
    {#each stats as {label,value}}
        <div class="stat-item">
            <dt>{label}</dt>
            <dd>{value}</dd>
        </div>
    {/each}
</dl>

<style>
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1em;
    text-align: center;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #f9f9f9;
    padding: 1em;
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  dt {
    font-size: 0.8em;
    color: #6c757d;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.3em;
  }

  dd {
    font-size: 1.2em;
    font-weight: bold;
    color: #000;
    margin: 0;
  }
</style>