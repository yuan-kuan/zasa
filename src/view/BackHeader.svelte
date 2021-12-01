<script>
  import DropdownMenu from './DropdownMenu.svelte';

  import { Nav } from 'app/stores';
  const { backToHome } = Nav;

  export let back = $backToHome;
  export let actions = null;
</script>

<header class="sticky top-0 w-full z-10 flex justify-between">
  <button class="flex ml-2 p-2 font-light text-primary " on:click={back}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M11 17l-5-5m0 0l5-5m-5 5h12"
      />
    </svg>
    Back
  </button>

  {#if actions}
    <DropdownMenu {actions} />
  {/if}
</header>
