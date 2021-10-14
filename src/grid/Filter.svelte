<script context="module">
  import { createRef } from '../ref';

  export const filteringTags = createRef([]);
  export const allTags = createRef([]);
  export const allTagsSelected = createRef([]);
  export const performToggleTagFilter = createRef([]);
</script>

<script>
  import { slide } from 'svelte/transition';
  import { circInOut } from 'svelte/easing';

  import Tag from './Tag.svelte';

  let expanded = false;
  const toggle = () => {
    expanded = !expanded;
  };

  $: hasFilter = $filteringTags.length != 0;
</script>

<!-- svelte-ignore a11y-missing-attribute -->
<a
  class="inline-flex flex-col items-center text-xs font-medium text-white py-3 px-4 flex-grow"
  class:text-white={!hasFilter}
  class:text-secondary-accent={hasFilter}
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
  <div class="fixed bottom-0 right-0 w-screen h-screen" on:click={toggle} />

  <div
    class="fixed bottom-20 right-4 ml-2 p-2 rounded-lg bg-white shadow-lg"
    transition:slide={{ delay: 0, duration: 500, easing: circInOut }}
  >
    <div class="p-2 flex justify-between border-b">
      <span> Filter with Tags </span>
      <!-- svelte-ignore a11y-missing-attribute -->
      <a
        class="inline-flex flex-col items-center text-xs font-medium cursor-auto"
        on:click|preventDefault={toggle}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>

        <span class="sr-only">Filter</span>
      </a>
    </div>
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
{:else}
  <div class="fixed bottom-12 right-2 ">
    <div class="flex flex-col-reverse items-start">
      {#each $filteringTags as tag}
        <Tag name={tag} dense on:click={toggle} />
      {/each}
    </div>
  </div>
{/if}
