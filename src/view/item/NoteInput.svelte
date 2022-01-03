<script>
  export let note = '';
  export let isEditingNote = false;
  export let editNote;
  export let cancelled = () => {};

  let clickedToActivate = false;
  let workingNote;
  $: preventEditNote =
    workingNote == note || workingNote == undefined || workingNote.length == 0;

  const startEditName = () => {
    workingNote = note;
    isEditingNote = true;
    clickedToActivate = true;
  };

  const initInput = (inputElement) => {
    if (clickedToActivate) {
      inputElement?.focus();
      inputElement?.select();
    }
  };

  const onEditNote = () => {
    isEditingNote = false;
    if (!preventEditNote) {
      editNote(workingNote);
    } else {
      cancelled();
    }
  };
</script>

<div class="mx-auto relative flex flex-col px-4 w-80">
  {#if isEditingNote}
    <!-- New tag input -->
    <textarea
      class="p-4 rounded-lg border border-opacity-75 border-gray-200 text-primary"
      placeholder="Notes"
      bind:value={workingNote}
      use:initInput
    />
    <!-- on:keydown={nameKeyDown} -->

    <!-- Add button -->
    <button
      class="mt-2 px-4 py-2 rounded-lg bg-primary  text-gray-800 font-bold uppercase border-primary-accent border-t border-b border-r disabled:cursor-not-allowed disabled:bg-gray-200"
      class:bg-primary={!preventEditNote}
      class:bg-neutral={preventEditNote}
      on:click={onEditNote}>{preventEditNote ? 'Cancel' : 'Add Note'}</button
    >
  {:else}
    <!-- New tag input -->
    <textarea
      class="p-4 rounded-lg border border-opacity-75 border-gray-200 text-primary"
      rows="3"
      value={note ? note : 'click to add note'}
      on:click={startEditName}
      readonly
    />

    <!-- Add button -->
    <button
      class="absolute bottom-4 right-8 text-primary  opacity-75 rounded-xl"
      on:click={startEditName}
    >
      <svg class="fill-current w-7 h-7" viewBox="0 0 20 20">
        <path
          d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"
        />
      </svg>
    </button>
  {/if}
</div>
