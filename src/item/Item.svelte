<script>
  import { name, performSave } from './item_store';
</script>

<div><p>Photo goes here</p></div>
<div><p>{$name}</p></div>
<button on:click={$performSave}>Save</button>
