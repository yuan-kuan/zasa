<script>
  import Logo from 'view/Logo.svelte';
  import { SettingStores } from 'app/stores';
  const {
    performCleanupStorage,
    performDestroyStorage,
    backFromSettingPage,
    performSyncStorage,
    syncStatus,
  } = SettingStores;

  let syncButton;
  let backupCode = '';
  let isSyncing = false;

  $: preventSync = backupCode.length == 0;
  $: {
    isSyncing = syncStatus == 'Synching...';
  }

  const sync = () => {
    isSyncing = true;
    $performSyncStorage(backupCode);
  };

  const backupKeyDown = (e) => {
    if (e.key == 'Enter') {
      syncButton.focus();
      e.preventDefault();
    }
  };
</script>

<header class="sticky top-0 bg-gray-200 bg-opacity-50 w-full z-10">
  <button class="ml-2 p-2 font-light" on:click={$backFromSettingPage}
    >&#60; Back</button
  >
</header>

<div class="flex flex-col justify-center pt-4 px-4 h-screen bg-neutral">
  <p class="flex justify-center font-bold text-center text-xl pb-2">
    <span><Logo /></span> <span class="pl-1 pt-1">Settings</span>
  </p>

  <div class="p-2 border-b border-black">
    <p class="font-semibold text-lg">Sync</p>
    <p>sycn up your current B4 with remote backup.</p>
    <p>
      This required a backup code, if you like to have one, email me:
      kuan@hey.com
    </p>

    {#if isSyncing}
      <p>{$syncStatus}</p>
      <button class="btn " on:click={() => (isSyncing = false)}>Retry</button>
    {:else}
      <input
        type="text"
        placeholder="code"
        bind:value={backupCode}
        on:keydown={backupKeyDown}
      />
      <button
        class="btn btn-blue mt-4"
        disabled={preventSync}
        bind:this={syncButton}
        on:click={sync}>Sync</button
      >
    {/if}
  </div>

  <div class=" flex flex-col p-2 border-b border-black">
    <p class="font-semibold text-lg">Compact</p>
    <p>Free up some space by trimming bits and bytes that B4 no longer need.</p>

    <button
      class="btn btn-primary self-center"
      on:click={$performCleanupStorage}>Compact Storage</button
    >
  </div>

  <div class=" flex flex-col p-2 border-b border-black">
    <p class="font-semibold text-lg">Factory Reset</p>
    <p>Delete everything in this device (does not affect remote backup).</p>

    <button
      class="btn bg-red-500 text-white self-center"
      on:click={$performDestroyStorage}>Factory Reset</button
    >
  </div>

  <!-- Filler  -->
  <div class="flex-grow" />
</div>
