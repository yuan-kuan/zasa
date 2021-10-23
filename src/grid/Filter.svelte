<script>
  import BottomSideButton from './BottomSideButton.svelte';
  import FilterSelection from './FilterSelection.svelte';
  import FilterSummary from './FilterSummary.svelte';

  import { FilterStores } from '../stores';
  const { tags } = FilterStores;

  let expanded = false;
  const toggle = () => {
    expanded = !expanded;
  };

  $: hasFilter = $tags.length != 0;
</script>

<BottomSideButton highlight={hasFilter} title="Filter" on:click={toggle} />

{#if expanded}
  <div class="fixed bottom-0 right-0 w-screen h-screen" on:click={toggle} />
  <FilterSelection />
{:else}
  <FilterSummary on:click={toggle} />
{/if}
