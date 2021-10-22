<script context="module">
  import { createRef } from '../ref';

  export const items = createRef([]);
  export const goToItem = createRef([]);
</script>

<!-- Grid -->
<div class="p-4 grid grid-cols-3 md:grid-cols-6 gap-2">
  {#each $items as item, index}
    <div class="relative" on:click={$goToItem[index]}>
      <!-- {item.name} -->
      <span
        class="absolute bottom-0 left-0 px-2 bg-secondary-accent bg-opacity-50 text-sm text-primary filter w-full truncate"
        >{item.name}</span
      >
      {#if item.blob}
        <img
          class="object-cover w-full border"
          src={URL.createObjectURL(item.blob)}
          alt=""
        />
      {/if}
    </div>
  {/each}
</div>
