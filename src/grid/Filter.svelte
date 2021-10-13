<script context="module">
  import { createRef } from '../ref';

  export const filteringTags = createRef([]);
  export const tagSelections = createRef([]);
  export const performAddTagToFilter = createRef([]);
  export const performRemoveTagFromFilter = createRef([]);
</script>

<script>
  import Tag from './Tag.svelte';

  let expanded = false;
  const toggle = () => {
    expanded = !expanded;
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
  <div class="fixed bottom-20 right-4 w-2/3 p-2 rounded-lg bg-white shadow-lg">
    <div class="p-2 border-b">Filter with Tags</div>
    <div class="mt-2 flex flex-row-reverse flex-wrap-reverse items-start">
      {#each $tagSelections as selection, index}
        <Tag name={selection} />
      {/each}
    </div>
  </div>
{/if}
<!-- 
<div class="flex w-full p-2 mb-4 border-b-1 border-black shadow-md bg-white">
  {#if expanded}
    <div class="w-full">
      <div class="flex flex-wrap justify-center">
        {#each $filteringTags as tag, index}
          <div
            class="m-1 rounded-full font-bold text-sm leading-loose bg-gray-400 px-3 py-1"
            on:click={$performRemoveTagFromFilter[index]}
          >
            {tag}
            <svg class="fill-current w-5 h-5 inline" viewBox="0 0 20 20">
              <path
                d="M10.185,1.417c-4.741,0-8.583,3.842-8.583,8.583c0,4.74,3.842,8.582,8.583,8.582S18.768,14.74,18.768,10C18.768,5.259,14.926,1.417,10.185,1.417 M10.185,17.68c-4.235,0-7.679-3.445-7.679-7.68c0-4.235,3.444-7.679,7.679-7.679S17.864,5.765,17.864,10C17.864,14.234,14.42,17.68,10.185,17.68 M10.824,10l2.842-2.844c0.178-0.176,0.178-0.46,0-0.637c-0.177-0.178-0.461-0.178-0.637,0l-2.844,2.841L7.341,6.52c-0.176-0.178-0.46-0.178-0.637,0c-0.178,0.176-0.178,0.461,0,0.637L9.546,10l-2.841,2.844c-0.178,0.176-0.178,0.461,0,0.637c0.178,0.178,0.459,0.178,0.637,0l2.844-2.841l2.844,2.841c0.178,0.178,0.459,0.178,0.637,0c0.178-0.176,0.178-0.461,0-0.637L10.824,10z"
              />
            </svg>
          </div>
        {/each}
      </div>

      <div class="flex flex-wrap justify-center">
        {#each $tagSelections as selection, index}
          <div
            class="m-1 rounded-full font-bold text-sm leading-loose bg-blue-300 px-3 py-1"
            on:click={$performAddTagToFilter[index]}
          >
            {selection}
            <svg class="fill-current w-5 h-5 inline" viewBox="0 0 20 20">
              <path
                d="M14.613,10c0,0.23-0.188,0.419-0.419,0.419H10.42v3.774c0,0.23-0.189,0.42-0.42,0.42s-0.419-0.189-0.419-0.42v-3.774H5.806c-0.23,0-0.419-0.189-0.419-0.419s0.189-0.419,0.419-0.419h3.775V5.806c0-0.23,0.189-0.419,0.419-0.419s0.42,0.189,0.42,0.419v3.775h3.774C14.425,9.581,14.613,9.77,14.613,10 M17.969,10c0,4.401-3.567,7.969-7.969,7.969c-4.402,0-7.969-3.567-7.969-7.969c0-4.402,3.567-7.969,7.969-7.969C14.401,2.031,17.969,5.598,17.969,10 M17.13,10c0-3.932-3.198-7.13-7.13-7.13S2.87,6.068,2.87,10c0,3.933,3.198,7.13,7.13,7.13S17.13,13.933,17.13,10"
              />
            </svg>
          </div>
        {/each}
      </div>
    </div>
    <div class="flex-shrink-0">
      <button class="btn btn-blue" on:click={() => (expanded = !expanded)}
        >Close</button
      >
    </div>
  {:else}
    <div class="flex-grow-1 flex flex-wrap justify-center w-full">
      {#each $filteringTags as tag}
        <Tag name={tag} />
      {:else}
        <div class="font-semibold self-center">Showing All Items</div>
      {/each}
    </div>
    <div class="flex-shrink-0">
      <button class="btn btn-blue" on:click={() => (expanded = !expanded)}
        >Edit Filter</button
      >
    </div>
  {/if}
</div> -->
