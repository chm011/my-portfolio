<script>
import * as d3 from 'd3';

let arc = d3.arc().innerRadius(0).outerRadius(50)({
  startAngle: 0,
  endAngle: 2 * Math.PI,
});

let data = [1, 2];

let total = 0;

for (let d of data) {
  total += d;
}

let angle = 0;
let arcData = [];

for (let d of data) {
  let endAngle = angle + (d / total) * 2 * Math.PI;
  arcData.push({ startAngle: angle, endAngle });
  angle = endAngle;
}

let arcs = arcData.map((d) => arcGenerator(d));

let colors = ['gold', 'purple'];
</script>


<svg viewBox="-50 -50 100 100">
    <path d="{arc}" fill="red" />
  </svg>


{#each arcs as arc}
    <path d="{" arc } fill="{" colors[i] } />
{/each}




<style>
    svg {
  max-width: 20em;
  margin-block: 2em;

  /* Do not clip shapes outside the viewBox */
  overflow: visible;
}
</style>