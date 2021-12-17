<script>
  import { longpress } from 'view/actions.js';

  export let name;
  export let selected = false;
  export let dense = false;
</script>

{#if dense}
  <div
    class="border rounded-full text-xs select-none leading-tight text-primary  bg-secondary-accent px-2 py-1 mx-1"
    use:longpress
    on:tagclick
    on:longpress
  >
    {name}
  </div>
{:else}
  <div
    class="m-1 border rounded-full text-sm text-primary select-none leading-loose bg-white px-3 py-1"
    class:bg-white={selected == false}
    class:bg-secondary-accent={selected}
    use:longpress
    on:longpress
    on:tagclick
  >
    <!-- on:click -->
    {name}
  </div>
{/if}
