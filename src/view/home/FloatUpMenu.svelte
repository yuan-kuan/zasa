<script>
  import BottomSideButton from './BottomSideButton.svelte';
  import FloatUpMenuButton from './FloatUpMenuButton.svelte';

  import { Nav } from 'app/stores';
  const { goToSetting, goToInfo, goToHowTo, goToRelease } = Nav;

  let expanded = false;
  const toggle = () => {
    expanded = !expanded;
  };

  const reviewOnProductHunt = () => {
    window.open('https://www.producthunt.com/posts/b4the-date', '_blank');
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
    <FloatUpMenuButton
      title="Releases"
      on:click={$goToRelease}
      on:click={toggle}
    />
    <FloatUpMenuButton title="Info" on:click={$goToInfo} on:click={toggle} />
    <FloatUpMenuButton title="HowTo" on:click={$goToHowTo} on:click={toggle} />
    <FloatUpMenuButton
      title="Review"
      on:click={reviewOnProductHunt}
      on:click={toggle}
    />
  </div>
{/if}
