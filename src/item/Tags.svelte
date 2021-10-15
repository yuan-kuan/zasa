<script context="module">
  import { createRef } from '../ref';

  export const allTags = createRef([]);
  export const allTagsSelected = createRef([]);
  export const performToggleTagFilter = createRef([]);

  export const tags = createRef([]);
  // export const tagSelections = createRef([]);
  export const performAddNewTag = createRef();
  // export const performAddTag = createRef([]);
  // export const performRemoveTag = createRef([]);
</script>

<script>
  import Tag from '../grid/Tag.svelte';

  let isAddingTag = false;
  let isEditingTag = true;
  let workingTag;

  const closeTagSelection = () => (isEditingTag = false);
  const openTagSelection = () => (isEditingTag = true);

  const addNewTag = () => {
    $performAddNewTag(workingTag);
    isAddingTag = false;
    workingTag = undefined;
  };

  let addTagButton;
  const addTagKeyDown = (e) => {
    if (e.key == 'Enter') {
      // addTagButton.focus();
      addNewTag();
      e.preventDefault();
    }
  };
</script>

<div class="flex flex-wrap justify-center items-start">
  {#each $tags as tag}
    <Tag name={tag} selected on:click={openTagSelection} />
  {/each}
</div>

{#if isEditingTag}
  <div
    class="opacity-100 fixed z-30 w-full h-full top-0 right-0 flex items-center justify-center"
  >
    <div
      class="fixed bottom-0 right-0 w-screen h-screen bg-gray-900 opacity-10"
      on:click={closeTagSelection}
    />

    <div
      class="fixed mx-2 flex flex-col justify-center items-center rounded-lg bg-white shadow-lg"
    >
      <!-- transition:slide={{ delay: 0, duration: 500, easing: circInOut }} -->

      <div class="relative flex p-2 py-4 flex-initial">
        <input
          type="text"
          placeholder="Add new tag here"
          class="rounded-l-lg py-2 pl-2 border-t mr-0 border-b border-l border-gray-200"
          bind:value={workingTag}
          on:keydown={addTagKeyDown}
        />
        <!-- <button
          class="absolute right-16 top-6"
          class:hidden={!workingTag}
          on:click={addNewTag}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button> -->
        <button
          class="px-4 py-2 rounded-r-lg bg-primary  text-gray-800 font-bold uppercase border-primary-accent border-t border-b border-r disabled:cursor-not-allowed disabled:bg-gray-200"
          disabled={!workingTag}
          on:click={addNewTag}>Add</button
        >
      </div>

      <div class="mt-2 flex flex-row flex-wrap justify-center items-start">
        {#each $allTags as selection, index}
          <Tag
            name={selection}
            selected={$allTagsSelected[index]}
            on:click={$performToggleTagFilter[index]}
          />
        {/each}
      </div>
    </div>
  </div>

  <!-- <div class="flex flex-wrap justify-center">
    {#each $tags as tag, index}
      <div
        class="m-1 rounded-full font-bold text-sm leading-loose bg-gray-400 px-3 py-1"
        on:click={$performRemoveTag[index]}
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
    {#if isAddingTag}
      <div
        class="m-1 rounded-full font-bold text-sm leading-loose bg-blue-300 px-3 py-1"
        on:click={() => (isAddingTag = true)}
      >
        <div class="flex items-center px-4">
          <input
            class="appearance-none bg-transparent border-b border-blue-500 text-gray-700 w-48 mr-3 py-1 px-2 leading-tight focus:outline-none text-right"
            type="text"
            autofocus
            bind:value={workingTag}
            on:keydown={addTagKeyDown}
          />
          <button
            class="flex-shrink-0 bg-blue-500 hover:bg-teal-700  text-sm text-white py-1 px-2 rounded"
            on:click={addNewTag}
            bind:this={addTagButton}
          >
            Save
          </button>
          <button
            class="flex-shrink-0 border-transparent border-4 text-yellow-500 hover:text-teal-800 text-sm py-1 px-2 rounded"
            on:click={() => (isAddingTag = false)}
          >
            Cancel
          </button>
        </div>
      </div>
    {:else}
      <div
        class="m-1 rounded-full font-bold text-sm leading-loose bg-blue-300 px-3 py-1"
        on:click={() => (isAddingTag = true)}
      >
        Create new tag
      </div>
    {/if}
    {#each $tagSelections as selection, index}
      <div
        class="m-1 rounded-full font-bold text-sm leading-loose bg-blue-300 px-3 py-1"
        on:click={$performAddTag[index]}
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

  <div class="flex flex-wrap justify-center mt-2">
    <button class="btn btn-blue" on:click={() => (isEditingTag = false)}
      >Done tagging</button
    >
  </div> -->
{/if}
