<script context="module">
  import { createRef } from '../ref';

  export const tags = createRef([]);
  export const tagSelections = createRef([]);
  export const performAddNewTag = createRef();
  export const performAddTag = createRef([]);
  export const performRemoveTag = createRef([]);
</script>

<script>
  let isAddingTag = false;
  let isEditingTag = false;
  let workingTag;

  const addNewTag = () => {
    $performAddNewTag(workingTag);
    isAddingTag = false;
    workingTag = undefined;
  };

  let addTagButton;
  const addTagKeyDown = (e) => {
    if (e.key == 'Enter') {
      addTagButton.focus();
      e.preventDefault();
    }
  };
</script>

{#if isEditingTag}
  <div class="flex flex-wrap justify-center">
    {#each $tags as tag, index}
      <div
        class="m-1 rounded-full font-bold text-sm leading-loose bg-gray-400 px-3 py-1"
        on:click={$performRemoveTag[index]}
      >
        {tag}
        <svg class="fill-current w-5 h-5 inline" viewBox="0 0 20 20">
          <!-- xmlns="http://www.w3.org/2000/svg" -->
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
          <!-- xmlns="http://www.w3.org/2000/svg" -->
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
  </div>
{:else}
  <div
    class="flex flex-wrap justify-center"
    on:click={() => (isEditingTag = true)}
  >
    {#each $tags as tag}
      <div
        class="m-1 rounded-full px-2 font-bold text-sm leading-loose bg-gray-400"
      >
        #{tag}
      </div>
    {/each}

    {#if $tags.length > 0}
      <div class="m-1 px-1 pt-1 font-bold text-sm leading-loose">
        <svg class="fill-current w-5 h-5" viewBox="0 0 20 20">
          <path
            d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"
          />
        </svg>
      </div>
    {:else}
      <div
        class="m-1 rounded-full px-2 font-bold text-sm leading-loose bg-gray-400"
      >
        Tap here to add tags
      </div>
    {/if}
  </div>
{/if}
