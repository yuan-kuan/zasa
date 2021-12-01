<script>
  import { fade } from 'svelte/transition';
</script>

<div
  class="fixed z-30 w-screen h-screen top-0 left-0 bg-gray-900 bg-opacity-10 flex items-center justify-center"
  on:click
>
  <div
    id="content"
    class="relative rounded-3xl overflow-auto mx-8 my-12"
    transition:fade={{ duration: 500 }}
    on:click|stopPropagation={() => {}}
  >
    <slot />
  </div>
  <button class="absolute top-2 right-2" on:click>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-10 w-10"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </button>
</div>

<style>
  #content {
    max-height: 93%;
  }
</style>
