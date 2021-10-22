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

  import BottomSideButton from './BottomSideButton.svelte';
  import Tag from './Tag.svelte';

  let expanded = false;
  const toggle = () => {
    expanded = !expanded;
  };

  $: hasFilter = $filteringTags.length != 0;
</script>

<BottomSideButton highlight={hasFilter} title="Filter" on:click={toggle} />

{#if expanded}
  <div class="fixed bottom-0 right-0 w-screen h-screen" on:click={toggle} />

  <div
    class="fixed bottom-20 right-4 ml-2 p-2 rounded-lg bg-white shadow-lg"
    transition:slide={{ delay: 0, duration: 500, easing: circInOut }}
  >
    <div class="p-2 flex justify-between border-b">
      <span class="text-primary font-semibold"> Filter with Tags </span>
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
