<script>
  import { createEventDispatcher } from 'svelte';
  import { TagStores } from 'app/stores';
  import Tag from 'view/Tag.svelte';

  const dispatch = createEventDispatcher();
  const { tags } = TagStores;
</script>

<div class="flex flex-wrap justify-center items-start">
  {#each $tags as tag}
    <Tag name={tag} dense on:tagclick />
  {:else}
    <button
      class="btn bg-secondary-accent flex items-center text-primary "
      on:click={() => dispatch('tagclick')}
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
