<script>
  import Logo from 'view/Logo.svelte';
  import { Nav } from 'app/stores';
  const { backToHome } = Nav;
</script>

<div class="p-8  bg-neutral">
  <p class="flex justify-center font-bold text-center text-xl pb-2">
    <span><Logo /></span> <span class="pl-1 pt-1">The Date</span>
  </p>
  
  <p class="font-semibold text-base py-2">February 2022</p>
  <p>patching</p>

  <p class="font-semibold text-base py-2">December 2021</p>

  <ul class="list-disc">
    <li>Made a wrong tag? You can now rename or remove it.</li>
    <li>
      Have a large number of batch, like a pallet of pills? Tap on the number to
      directly input the count.
    </li>
  </ul>
  <div class="flex flex-row-reverse">
    <button
      class="mt-6 font-light text-primary underline place-self-end"
      on:click={$backToHome}>close</button
    >
  </div>
</div>
