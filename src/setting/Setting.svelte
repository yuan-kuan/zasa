<script>
  import {
    performCleanupStorage,
    performDestroyStorage,
    backFromSettingPage,
  } from './setting_store';
</script>

<header class="sticky top-0 bg-gray-200 bg-opacity-50 w-full z-10">
  <button class="ml-2 p-2 font-light" on:click={$backFromSettingPage}
    >&#60; Back</button
  >
</header>

<div class="flex flex-col justify-center pt-4 px-4">
  <button class="btn btn-blue" on:click={$performCleanupStorage}
    >Compact Storage</button
  >
  <button class="btn btn-red mt-4" on:click={$performDestroyStorage}
    >Destroy Storage</button
  >
</div>
