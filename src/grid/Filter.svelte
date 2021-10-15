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
    xmlns="http://www.w3.org/2000/svg"
    class="h-7 w-7"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z"
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

    <button
      class="absolute -top-3 -right-3 rounded-full focus:outline-none bg-white"
      on:click={toggle}
    >
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
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
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
