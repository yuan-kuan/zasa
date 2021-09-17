<script>
  import {
    name,
    nameError,
    photoBlob,
    batches,
    tags,
    tagSelections,
    performEditName,
    performAddBatch,
    performDeleteBatch,
    performBatchInc,
    performBatchDec,
    performAddNewTag,
    performAddTag,
    performRemoveTag,
    goToEditPhoto,
  } from './item_store';

  let isAddingTag = false;
  let workingTag;

  const addNewTag = () => {
    $performAddNewTag(workingTag);
    isAddingTag = false;
  };

  let workingName;
  let isEditingName = false;

  const editName = () => {
    isEditingName = false;
    $performEditName(workingName);
  };

  let isAddingBatch = false;
  let workingDate;
  let workingCount = 1;

  const addNewBatch = () => {
    // <input type="date"> return a FFFF-MM-DD string, convert it to date
    $performAddBatch(new Date(workingDate), workingCount);
  };

  let confirmingDeleteIndex = -1;
  const decrementBatchCount = (index) => {
    confirmingDeleteIndex = -1;
    const batch = $batches[index];
    if (batch.count <= 1) {
      confirmingDeleteIndex = index;
    } else {
      $performBatchDec[index]();
    }
  };

  const incrementBatchCount = (index) => {
    confirmingDeleteIndex = -1;
    $performBatchInc[index]();
  };

  let photoUrl;
  photoBlob.subscribe((value) => {
    if (value) {
      photoUrl = URL.createObjectURL(value);
    }
  });
</script>

<div class="p-1 w-1/3 lg:w-1/4 xl:w-1/6 relative">
  <img class="object-cover h-32 w-full border" src={photoUrl} alt="" />
  <button on:click={$goToEditPhoto}>Change Photo</button>
</div>

<br />

{#if isEditingName}
  <input type="text" bind:value={workingName} />
  <button on:click={editName}>Done</button>
{:else}
  <p>{$name}</p>
  <button on:click={() => (isEditingName = true)}>Edit</button>
{/if}

<br />
<ul>
  {#each $tags as tag, index}
    <li>
      {tag}
      <button class="btn btn-red" on:click={$performRemoveTag[index]}>X</button>
    </li>
  {/each}
</ul>

<br />

{#if isAddingTag}
  <input type="text" bind:value={workingTag} />
  <button class="btn btn-blue" on:click={addNewTag}>Done</button>
{:else}
  <button class="btn" on:click={() => (isAddingTag = true)}>Add new tag</button>
{/if}

<br />
<ul>
  {#each $tagSelections as selection, index}
    <li>
      <button class="btn btn-blue" on:click={$performAddTag[index]}>
        {selection}
      </button>
    </li>
  {/each}
</ul>

<br />
<ul>
  {#each $batches as batch, index}
    <li>
      {new Date(batch.expiry)}
      <br />
      ({batch.count})

      <button class="btn btn-blue" on:click={() => incrementBatchCount(index)}
        >+</button
      >
      <span />
      {#if index == confirmingDeleteIndex}
        <button class="btn btn-red" on:click={$performDeleteBatch[index]}
          >Delete?</button
        >
      {:else}
        <button class="btn btn-red" on:click={() => decrementBatchCount(index)}
          >-</button
        >
      {/if}
    </li>
  {/each}
</ul>

<br />
<p class="text-green-600">Batches</p>
{#if isAddingBatch}
  <input type="date" bind:value={workingDate} />
  <span>{workingCount}</span>
  <button class="btn btn-blue" on:click={() => workingCount++}>+</button>
  <br />
  <button class="btn btn-blue" on:click={addNewBatch}>Done Batch</button>
{:else}
  <button on:click={() => (isAddingBatch = true)}>New Batch</button>
{/if}
