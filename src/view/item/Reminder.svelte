<script>
  import { ItemStores } from 'app/stores';
  const { remindDays, performEditRemindDays } = ItemStores;

  let isEditing = false;
  let clickedToActivate = false;
  let count = $remindDays;

  const startEdit = () => {
    count = $remindDays;
    isEditing = true;
    clickedToActivate = true;
  };

  const initInput = (inputElement) => {
    if (clickedToActivate) {
      inputElement?.focus();
      inputElement?.select();
    }
  };

  const onEditDays = () => {
    isEditing = false;
    $performEditRemindDays(count);
  };

  const daysKeyDown = (e) => {
    if (e.key == 'Enter') {
      $performEditRemindDays(count);
      isEditing = false;
      e.preventDefault();
    }
  };
</script>

<div class="mx-auto relative flex justify-center p-2 pt-6 pb-4">
  <span class="text-right">Remind me in</span>

  {#if isEditing}
    <input
      class="w-12 px-2 rounded border border-gray-200 text-right text-primary"
      type="text"
      bind:value={count}
      use:initInput
      on:keydown={daysKeyDown}
    />

    <button
      class="px-2 rounded-r-lg bg-primary  text-gray-800 font-bold uppercase border-primary-accent border-t border-b border-r disabled:cursor-not-allowed disabled:bg-gray-200"
      on:click={onEditDays}>Done</button
    >
  {:else}
    <input
      class="w-12 px-2 rounded border border-gray-200 text-right text-primary"
      type="text"
      value={$remindDays}
      on:click={startEdit}
      readonly
    />
  {/if}

  <span>Days</span>
</div>
