<script>
  import { fade } from 'svelte/transition';
</script>

<div
  class="opacity-100 fixed z-30 w-full h-full top-0 left-0 flex items-center justify-center"
>
  <!-- Modal background to get close click -->
  <div
    class="fixed bottom-0 left-0 w-screen h-screen bg-gray-900 opacity-10"
    transition:fade={{ duration: 500 }}
    on:click
  />
  <slot />
</div>
