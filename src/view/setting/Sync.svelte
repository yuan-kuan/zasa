<script>
  import moment from 'moment';

  import { scale } from 'svelte/transition';
  import { circInOut } from 'svelte/easing';
  import Modal from 'view/Modal.svelte';

  import { SyncStores } from 'app/stores';
  const {
    savedCode,
    syncStatus,
    syncErrorMessage,
    savedTimestamp,
    performSyncStorage,
  } = SyncStores;

  $: hasCode = $savedCode;
  let settingUp = false;
  let showingTips = false;

  let timeAgoText;
  savedTimestamp.subscribe((v) => {
    if (v) {
      let previosSyncDate = moment(v);
      let today = moment();
      let daysDifference = today.diff(previosSyncDate, 'days');
      if (daysDifference > 0) {
        timeAgoText = `${daysDifference} days ago`;
      } else {
        let hoursDifference = today.diff(previosSyncDate, 'hours');
        if (hoursDifference > 0) {
          timeAgoText = `${hoursDifference} hours ago`;
        } else {
          timeAgoText = `${today.diff(previosSyncDate, 'minutes')} minutes ago`;
        }
      }
    }
  });

  let workingCode = '';

  const submit = () => {
    if (!isSyncing) {
      $performSyncStorage(workingCode);
    }
  };

  const keyDown = (e) => {
    if (e.key == 'Enter') {
      submit();
      e.preventDefault();
    }
  };

  const initInput = (inputElement) => {
    inputElement?.focus();
    inputElement?.select();
  };

  const syncWithSavedCode = () => {
    if (hasCode) {
      $performSyncStorage($savedCode);
    }
  };

  const closeSettingUp = () => (settingUp = false);

  $: hasSyncStatus = $syncStatus != SyncStores.IDLE;
  $: isSyncing = $syncStatus == SyncStores.SYNCING;
  $: syncStatusIsError = $syncStatus == SyncStores.FAILED;

  let syncMessage;
  $: {
    switch ($syncStatus) {
      case SyncStores.IDLE:
        syncMessage = '';
        break;
      case SyncStores.SYNCING:
        syncMessage = 'Syncing...';
        break;
      case SyncStores.DONE:
        syncMessage = 'Synced Succeed!';
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        break;
      case SyncStores.FAILED:
        syncMessage = `Sync failed with error ${$syncErrorMessage}`;
        break;

      default:
        break;
    }
  }
</script>

<div class="flex flex-col p-2 py-4 border-b border-black">
  <p class="font-semibold text-lg">Sync</p>

  {#if hasCode}
    <p>Sync often to keep your data safe.</p>
    <p><strong>Code: </strong> {$savedCode}</p>
    {#if isSyncing}
      <p>{syncMessage}</p>
    {:else}
      <p><strong>Last Sync: </strong> {timeAgoText}</p>
    {/if}

    <div class="flex flex-row justify-center mt-2">
      <button
        class="btn bg-secondary text-white"
        on:click={() => (settingUp = true)}>Setup new Sync</button
      >
      <span class="px-4" />
      <button
        class="btn bg-primary text-white disabled:cursor-not-allowed disabled:bg-gray-200"
        disabled={isSyncing}
        on:click={syncWithSavedCode}>Sync Now</button
      >
    </div>
  {:else}
    <p class="mb-2">
      Sync lets you backup data into a remote database. You can later sync this
      data from another device.
    </p>
    <button
      class="btn bg-primary text-white self-center"
      on:click={() => (settingUp = true)}>Setup Sync</button
    >
  {/if}
</div>

{#if settingUp}
  <Modal on:click={closeSettingUp}>
    <div
      class="mx-3 p-4 flex flex-col justify-center items-center rounded-lg bg-white shadow-lg"
      transition:scale={{ delay: 0, duration: 500, easing: circInOut }}
    >
      <span class="text-primary font-semibold mb-4">Setup Sync</span>

      <div class="relative flex p-2 pt-2 pb-4 mx-4 text-primary ">
        <input
          placeholder="Backup Code"
          type="text"
          class="rounded-l-lg py-2 pl-2 border-t mr-0 border-b border-l border-gray-200 text-center w-40"
          use:initInput
          on:keydown={keyDown}
          bind:value={workingCode}
        />

        <!-- Add button -->
        <button
          class="px-4 py-2 rounded-r-lg bg-secondary-accent font-bold text-primary  border-primary-accent border-t border-b border-r disabled:cursor-not-allowed disabled:bg-gray-200"
          disabled={workingCode == '' || isSyncing}
          on:click={submit}>Submit</button
        >
      </div>

      {#if hasSyncStatus}
        {#if syncStatusIsError}
          <p class="w-full mb-4 text-center text-red-600">{syncMessage}</p>
        {:else}
          <p class="w-full mb-4 text-center text-green-600">{syncMessage}</p>
        {/if}
      {/if}

      {#if showingTips}
        <p>
          A personalised code is needed to upload and download data from the
          remote database.
        </p>
        <p class="mb-4">
          If you like to have one, send an email to <a
            href="mailto:kuan@hey.com">kuan@hey.com</a
          >. It is free (now).
        </p>
      {/if}

      <div class="flex flex-row justify-between w-full my-1">
        <button
          class="font-light text-primary underline place-self-center"
          on:click={() => (showingTips = !showingTips)}>What is this?</button
        >
        {#if !isSyncing}
          <button
            class="font-light text-primary underline place-self-center"
            on:click={closeSettingUp}>Close</button
          >
        {/if}
      </div>
    </div>
  </Modal>
{/if}
