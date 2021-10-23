<script>
  import Tag from './Tag.svelte';

  import { FilterStores } from '../stores';
  const { tags } = FilterStores;
</script>

<div class="fixed bottom-12 right-2 ">
  <div class="flex flex-col-reverse items-start">
    {#each $tags as tag}
      <Tag name={tag} dense on:click />
    {/each}
  </div>
</div>
