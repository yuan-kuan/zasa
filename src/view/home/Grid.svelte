<script>
  import Welcome from 'view/info/Welcome.svelte';
  import Logo from 'view/Logo.svelte';
  import { GridStores } from 'app/stores';
  const { items, goToItem } = GridStores;

  $: hasItem = $items.length > 0;

  let filler = [];
  $: {
    filler = [];
    if ($items.length < 12) {
      filler = Array(12 - $items.length);
    }
  }

  const dayInMs = 24 * 60 * 60 * 1000;
  const expireInDays = (expiry) => {
    const today = new Date();
    return Math.floor((expiry - today.valueOf()) / dayInMs);
  };
</script>

<!-- Grid -->
{#if hasItem}
  <div class="p-4 grid grid-cols-3 md:grid-cols-6 gap-2 auto-cols-max">
    {#each $items as item, index}
      <div class="relative w-full" on:click={$goToItem[index]}>
        {#if item.blob}
          <img
            class="object-cover w-full border rounded-xl"
            src={URL.createObjectURL(item.blob)}
            alt=""
          />
        {:else}
          <div
            class="relative bg-primary rounded-lg ratio11 flex justify-center items-center
        m-auto w-full bg-opacity-50
        "
          >
            <div class=" text-white">
              <Logo />
            </div>
          </div>
        {/if}
        <!-- {item.name} -->
        <span
          class="absolute bottom-0 left-0 px-2 bg-secondary-accent bg-opacity-50 text-sm text-primary filter w-full truncate rounded-b-xl"
          >{item.name}</span
        >
        {#if item.expiry}
          <span
            class="absolute top-0 right-0 px-2 bg-red-300 bg-opacity-50 text-sm text-primary filter w-full truncate rounded-t-xl"
            >{expireInDays(item.expiry)} days left</span
          >
        {/if}
      </div>
    {/each}

    {#each filler as _, i}
      <div
        class="relative bg-neutral rounded-lg ratio11 flex justify-center items-center
        m-auto
        {`bg-opacity-${100 - i * 10}`}
        {`w-${11 - i}/12`}
        "
      >
        <div class=" text-white">
          <Logo />
        </div>
      </div>
    {/each}
  </div>
{:else}
  <Welcome />
{/if}

<style>
  .ratio11 {
    aspect-ratio: 1;
  }
</style>
