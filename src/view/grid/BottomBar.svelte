<script>
  import BottomSideButton from './BottomSideButton.svelte';
  import Filter from './Filter.svelte';
  import { Nav } from 'app/stores';

  // TODO: Is this the best ?
  const { goToSetting, goToCreateItem } = Nav;
</script>

<div
  class="absolute bottom-4 left-1/2 transform -translate-x-1/2 inline-flex mx-auto justify-between bg-primary w-11/12 rounded-3xl"
>
  <BottomSideButton title="Settings" on:click={$goToSetting} />

  <button
    class="relative inline-flex flex-col items-center text-xs font-medium text-white py-3 px-6 flex-grow"
    on:click={$goToCreateItem}
  >
    <div
      class="absolute bottom-5 p-3 rounded-full border-4 border-white  bg-primary"
    >
      <svg
        class="w-8 h-8"
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
      <!-- 
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg> -->
    </div>
    <span class="sr-only">Add</span>
  </button>

  <Filter />
</div>
