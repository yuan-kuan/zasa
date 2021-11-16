<script>
  import BottomSideButton from './BottomSideButton.svelte';
  import FloatUpMenuButton from './FloatUpMenuButton.svelte';

  import { Nav } from 'app/stores';
  const { goToSetting, goToInfo } = Nav;

  let expanded = true;
  const toggle = () => {
    expanded = !expanded;
  };
</script>

<BottomSideButton title="B4" on:click={toggle} />
<!-- <BottomSideButton title="Info" on:click={$goToInfo} /> -->

{#if expanded}
  <div class="fixed bottom-0 right-0 w-screen h-screen" on:click={toggle} />
  <div class="fixed bottom-16 left-4 flex flex-col">
    <FloatUpMenuButton
      title="Settings"
      on:click={toggle}
      on:click={$goToSetting}
    />
    <FloatUpMenuButton title="Info" on:click={$goToInfo} on:click={toggle} />
  </div>
{/if}
