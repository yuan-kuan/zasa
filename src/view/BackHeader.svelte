<script>
  import DropdownMenu from './DropdownMenu.svelte';

  import { Nav } from 'app/stores';
  const { backToHome } = Nav;

  export let back = $backToHome;
  export let actions;
</script>

<header class="sticky top-0 w-full z-10 flex justify-between">
  <button class="ml-2 p-2 font-light text-primary " on:click={back}
    >&#60; Back</button
  >

  {#if actions}
    <DropdownMenu {actions} />
  {/if}
</header>
