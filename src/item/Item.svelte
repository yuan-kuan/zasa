<script>
  import { name, performSave } from './item_store';

  let workingName = '';
  const saveItem = () => {
    $performSave(workingName, 'fake');
  };
</script>

<div><p>Photo goes here</p></div>
<div>
  <input type="text" bind:value={workingName} />
</div>
<button on:click={saveItem}>Save</button>
