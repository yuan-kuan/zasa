<script>
  export let name = '';
  export let isEditingName = false;
  export let editName;
  export let cancelled = () => {};

  let clickedToActivate = false;
  let workingName;
  $: preventEditName =
    workingName == name || workingName == undefined || workingName.length == 0;

  const startEditName = () => {
    workingName = name;
    isEditingName = true;
    clickedToActivate = true;
  };

  const initInput = (inputElement) => {
    if (clickedToActivate) {
      inputElement?.focus();
    }
  };

  const onEditName = () => {
    isEditingName = false;
    if (!preventEditName) {
      editName(workingName);
    } else {
      cancelled();
    }
  };

  const nameKeyDown = (e) => {
    if (e.key == 'Enter') {
      if (!preventEditName) {
        editName(workingName);
      } else {
        cancelled();
      }
      isEditingName = false;
      e.preventDefault();
    }
  };
</script>

<div class="mx-auto relative flex justify-center p-2 pt-6 pb-4">
  {#if isEditingName}
    <!-- New tag input -->
    <input
      class="rounded-l-lg py-2 pl-2 border-t mr-0 border-b border-l border-gray-200 focus:ring-0 focus:border-opacity-40 text-center text-primary "
      type="text"
      placeholder="Name (required)"
      bind:value={workingName}
      use:initInput
      on:keydown={nameKeyDown}
    />

    <!-- Add button -->
    <button
      class="px-4 py-2 rounded-r-lg bg-primary  text-gray-800 font-bold uppercase border-primary-accent border-t border-b border-r disabled:cursor-not-allowed disabled:bg-gray-200"
      class:bg-primary={!preventEditName}
      class:bg-neutral={preventEditName}
      on:click={onEditName}>{preventEditName ? 'Cancel' : 'Done'}</button
    >
  {:else}
    <!-- New tag input -->
    <input
      class="rounded-l-lg py-2 pl-2 border-t mr-0 border-b border-l border-opacity-75 border-gray-200 text-center font-semibold text-primary "
      type="text"
      value={name}
      on:click={startEditName}
      readonly
    />

    <!-- Add button -->
    <button
      class="px-4 py-2 rounded-r-lg bg-white font-bold uppercase border-t border-b border-r border-opacity-75 border-gray-200 disabled:cursor-not-allowed disabled:bg-gray-200 text-primary"
      on:click={startEditName}
    >
      <svg class="fill-current w-5 h-5" viewBox="0 0 20 20">
        <path
          d="M18.303,4.742l-1.454-1.455c-0.171-0.171-0.475-0.171-0.646,0l-3.061,3.064H2.019c-0.251,0-0.457,0.205-0.457,0.456v9.578c0,0.251,0.206,0.456,0.457,0.456h13.683c0.252,0,0.457-0.205,0.457-0.456V7.533l2.144-2.146C18.481,5.208,18.483,4.917,18.303,4.742 M15.258,15.929H2.476V7.263h9.754L9.695,9.792c-0.057,0.057-0.101,0.13-0.119,0.212L9.18,11.36h-3.98c-0.251,0-0.457,0.205-0.457,0.456c0,0.253,0.205,0.456,0.457,0.456h4.336c0.023,0,0.899,0.02,1.498-0.127c0.312-0.077,0.55-0.137,0.55-0.137c0.08-0.018,0.155-0.059,0.212-0.118l3.463-3.443V15.929z M11.241,11.156l-1.078,0.267l0.267-1.076l6.097-6.091l0.808,0.808L11.241,11.156z"
        />
      </svg>
    </button>
  {/if}
</div>
