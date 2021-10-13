<script context="module">
  import { createRef } from '../ref';

  export const filteringTags = createRef([]);
  export const allTags = createRef([]);
  export const allTagsSelected = createRef([]);
  export const performToggleTagFilter = createRef([]);
</script>

<script>
  import Tag from './Tag.svelte';

  let expanded = false;
  const toggle = () => {
    expanded = !expanded;

    console.log('$allTagsSelected :>> ', $allTagsSelected);
  };
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<a
  class="inline-flex flex-col items-center text-xs font-medium text-white py-3 px-4 flex-grow"
  on:click|preventDefault={toggle}
>
  <svg
    class="w-7 h-7"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
      clip-rule="evenodd"
    />
  </svg>

  <span class="sr-only">Filter</span>
</a>

{#if expanded}
  <div class="fixed bottom-20 right-4 ml-2 p-2 rounded-lg bg-white shadow-lg">
    <div class="p-2 border-b">Filter with Tags</div>
    <div class="mt-2 flex flex-row-reverse flex-wrap-reverse items-start">
      {#each $allTags as selection, index}
        <Tag
          name={selection}
          selected={$allTagsSelected[index]}
          on:click={$performToggleTagFilter[index]}
        />
      {/each}
    </div>
  </div>
{/if}
