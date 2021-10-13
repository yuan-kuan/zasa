<script>
  export let name;
  export let selected;
</script>

<div
  class="m-1 border rounded-full font-bold text-sm select-none leading-loose bg-white px-3 py-1"
  class:bg-white={selected == false}
  class:bg-primary-accent={selected}
  on:click
>
  {name}
</div>
