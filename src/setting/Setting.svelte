<script>
  import {
    performCleanupStorage,
    performDestroyStorage,
    performSyncStorage,
    backFromSettingPage,
  } from './setting_store';

  let syncButton;
  let backupCode = '';
  $: preventSync = backupCode.length == 0;
  const sync = () => $performSyncStorage(backupCode);
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

<div class="flex flex-col justify-center pt-4 px-4">
  <div class="p-2 border-b-1 broder-black">
    <p>Sycn with Remote</p>
    <p>sycn up your current ZASA with remote backup.</p>
    <p>
      This required a backup code, if you like to have one, email kuan@hey.com
    </p>

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
  </div>

  <button class="btn btn-blue" on:click={$performCleanupStorage}
    >Compact Storage</button
  >
  <button class="btn btn-red mt-4" on:click={$performDestroyStorage}
    >Destroy Storage</button
  >
</div>
