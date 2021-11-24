<script>
  export let highlight = false;
  export let needAttention = false;
  export let title;
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<a
  class="inline-flex justify-center text-xs font-medium text-white py-3 px-4 flex-grow"
  class:text-white={!highlight}
  class:text-neutral={highlight}
  on:click|preventDefault
>
  {#if title == 'Filter'}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-7 w-7"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"
      />
    </svg>
  {/if}

  {#if title == 'B4'}
    <span class="font-bold text-xl">B4</span>
  {/if}

  {#if needAttention}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-7 w-7"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  {/if}
  <span class="sr-only">{title}</span>
</a>
