<script>
  import Logo from 'view/Logo.svelte';
  import Sync from './Sync.svelte';
  import YesNoDialog from './YesNoDialog.svelte';

  import { SettingStores } from 'app/stores';
  const { performCleanupStorage, performDestroyStorage, backFromSettingPage } =
    SettingStores;

  let sureAboutReset = false;
  const confirmReset = () => {
    sureAboutReset = false;
    $performDestroyStorage();
  };
</script>

<header class="sticky top-0 bg-neutral bg-opacity-50 w-full z-10">
  <button class="ml-2 p-2 font-light" on:click={$backFromSettingPage}
    >&#60; Back</button
  >
</header>

<div class="flex flex-col justify-center pt-4 px-4 h-screen bg-neutral">
  <p class="flex justify-center font-bold text-center text-xl pb-2">
    <span><Logo /></span> <span class="pl-1 pt-1">Settings</span>
  </p>

  <Sync />

  <div class=" flex flex-col p-2 py-4 border-b border-black">
    <p class="font-semibold text-lg">Compact</p>
    <p class="mb-2">
      Free up some space by trimming bits and bytes that B4 no longer need.
    </p>

    <button
      class="btn btn-primary self-center"
      on:click={$performCleanupStorage}>Compact Storage</button
    >
  </div>

  <div class="flex flex-col p-2 py-4 border-b border-black">
    <p class="font-semibold text-lg">Factory Reset</p>
    <p class="mb-2">
      Delete everything in this device (does not affect remote backup).
    </p>

    <button
      class="btn bg-red-500 text-white self-center"
      on:click={() => (sureAboutReset = true)}>Factory Reset</button
    >
  </div>

  <!-- Filler  -->
  <div class="flex-grow" />
</div>

{#if sureAboutReset}
  <YesNoDialog
    message="This will delete all local data. Are you sure?"
    onCancel={() => (sureAboutReset = false)}
    onConfirm={confirmReset}
  />
{/if}
