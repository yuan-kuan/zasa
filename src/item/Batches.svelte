<script>
  import {
    batches,
    performAddBatch,
    performDeleteBatch,
    performBatchInc,
    performBatchDec,
  } from './item_store';

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
</script>

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
