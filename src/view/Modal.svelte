<script>
  import { fade } from 'svelte/transition';
</script>

<div
  class="fixed z-30 w-screen h-screen top-0 left-0 bg-gray-900 bg-opacity-10 flex items-center justify-center"
  on:click
>
  <!-- Modal background to get close click -->
  <div
    class="relative max-h-full m-8"
    transition:fade={{ duration: 500 }}
    on:click|stopPropagation|preventDefault={() => {}}
  >
    <slot />
  </div>
</div>
