<script>
  export let name;
  export let selected;
  export let dense = false;
</script>

{#if dense}
  <div
    class="border rounded-full text-xs select-none leading-tight bg-primary-accent px-1"
    on:click
  >
    {name}
  </div>
{:else}
  <div
    class="m-1 border rounded-full font-bold text-sm select-none leading-loose bg-white px-3 py-1"
    class:bg-white={selected == false}
    class:bg-primary-accent={selected}
    on:click
  >
    {name}
  </div>
{/if}
