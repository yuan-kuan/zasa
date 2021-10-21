<script>
  export let name;
  export let selected;
  export let dense = false;
</script>

{#if dense}
  <div
    class="border rounded-full text-xs select-none leading-tight text-primary  bg-secondary-accent px-1"
    on:click
  >
    {name}
  </div>
{:else}
  <div
    class="m-1 border rounded-full text-sm text-primary select-none leading-loose bg-white px-3 py-1"
    class:bg-white={selected == false}
    class:bg-secondary-accent={selected}
    on:click
  >
    {name}
  </div>
{/if}
