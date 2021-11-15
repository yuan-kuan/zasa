<script>
  import { scale } from 'svelte/transition';
  import { circInOut } from 'svelte/easing';

  import Modal from 'view/Modal.svelte';
  import BottomSideButton from 'view/grid/BottomSideButton.svelte';

  let isShowing = false;

  const closeInfoPanel = () => (isShowing = false);
  const openInfoPanel = () => (isShowing = true);
</script>

<BottomSideButton title="Info" on:click={openInfoPanel}>?</BottomSideButton>

{#if isShowing}
  <Modal on:click={closeInfoPanel}>
    <div
      class="fixed mx-3 p-4 flex flex-col justify-center items-center rounded-lg bg-white shadow-lg"
      transition:scale={{ delay: 0, duration: 500, easing: circInOut }}
    >
      Ask me anything
    </div>
  </Modal>
{/if}
