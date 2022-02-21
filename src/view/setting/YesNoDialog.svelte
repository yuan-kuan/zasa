<script>
  import Modal from 'view/Modal.svelte';
  import { scale } from 'svelte/transition';
  import { circInOut } from 'svelte/easing';

  export let message;
  export let confirmText = 'Yes';
  export let cancelText = 'No';
  export let onCancel;
  export let onConfirm;
</script>

<Modal on:click={onCancel}>
  <div
    class="mx-3 p-4 flex flex-col justify-center items-center rounded-lg bg-white shadow-lg"
    transition:scale={{ delay: 0, duration: 500, easing: circInOut }}
  >
    <span class="text-primary font-semibold mb-4">{message}</span>

    <div class="flex flex-row justify-between w-full my-1">
      <button class="btn btn-secondary px-4" on:click={onCancel}
        >{cancelText}</button
      >
      <button class="btn btn-primary px-4" on:click={onConfirm}
        >{confirmText}</button
      >
    </div>
  </div>
</Modal>
