<script context="module">
  import { createRef } from '../ref';

  export const allTags = createRef([]);
  export const allTagsSelected = createRef([]);
  export const performToggleTagFilter = createRef([]);
  export const tags = createRef([]);
  export const performAddNewTag = createRef();
</script>

<script>
  import { scale, fade } from 'svelte/transition';
  import { circInOut } from 'svelte/easing';

  import Modal from '../view/Modal.svelte';
  import Tag from '../grid/Tag.svelte';

  let isEditingTag = false;
  let workingTag;

  const closeTagSelection = () => (isEditingTag = false);
  const openTagSelection = () => (isEditingTag = true);

  const addNewTag = () => {
    $performAddNewTag(workingTag);
    workingTag = undefined;
  };

  const addTagKeyDown = (e) => {
    if (e.key == 'Enter') {
      addNewTag();
      e.preventDefault();
    }
  };
</script>

<div class="flex flex-wrap justify-center items-start">
  {#each $tags as tag}
    <Tag name={tag} dense on:click={openTagSelection} />
  {:else}
    <button
      class="btn bg-secondary-accent flex items-center text-primary "
      on:click={openTagSelection}
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4v16m8-8H4"
        />
      </svg>
      <span class="pl-1"> add tag </span>
    </button>
  {/each}
</div>

{#if isEditingTag}
  <Modal on:click={closeTagSelection}>
    <div
      class="fixed mx-3 p-4 flex flex-col justify-center items-center rounded-lg bg-white shadow-lg"
      transition:scale={{ delay: 0, duration: 500, easing: circInOut }}
    >
      <div class="relative flex p-2 pt-2 pb-4 mx-4 flex-initial text-primary ">
        <!-- New tag input -->
        <input
          type="text"
          placeholder="Add new tag here"
          class="rounded-l-lg py-2 pl-2 border-t mr-0 border-b border-l border-gray-200 text-center"
          bind:value={workingTag}
          on:keydown={addTagKeyDown}
        />

        <!-- Add button -->
        <button
          class="px-4 py-2 rounded-r-lg bg-secondary-accent font-bold text-primary  border-primary-accent border-t border-b border-r disabled:cursor-not-allowed disabled:bg-gray-200"
          disabled={!workingTag}
          on:click={addNewTag}>add</button
        >

        <!-- Potential X clear button inside text input -->
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
      </div>

      <!-- Tags cloud -->
      <div class="mt-2 flex flex-row flex-wrap justify-center items-start">
        {#each $allTags as selection, index}
          <Tag
            name={selection}
            selected={$allTagsSelected[index]}
            on:click={$performToggleTagFilter[index]}
          />
        {/each}
      </div>

      <!-- <button
        class="absolute -top-3 -right-3 rounded-full focus:outline-none bg-white"
        on:click={closeTagSelection}
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
      </button> -->
    </div>
  </Modal>
{/if}
