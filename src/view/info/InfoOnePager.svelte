<script>
  import Logo from 'view/Logo.svelte';
  import { Nav } from 'app/stores';
  const { backToHome } = Nav;
</script>

<div class="p-8 rounded-3xl bg-neutral">
  <p class="flex justify-center font-bold text-center text-xl pb-2">
    <span><Logo /></span> <span class="pl-1 pt-1">The Date</span>
  </p>
  <p class="font-semibold text-base py-2">What is this?</p>
  <p class="">
    It helps you keep track of all your food, cans, pickles, dried food, etc.
  </p>
  <p class="pt-2">
    With a glance, you will know what is expiring, how many of them left, which
    you need to consume first and when is your next restock.
  </p>

  <p class="font-semibold text-base py-2 mt-4 border-t-2">How to use?</p>
  <p class="">
    We have a dedicated section for the guides. <a
      class="underline"
      href="/howto">Visit Here</a
    >.
  </p>

  <p class="font-semibold text-base py-2 mt-4 border-t-2">Is this free?</p>
  <p class="">
    Not entirely. It is free to use on your personal device, mobile phone,
    tablet or laptop.
  </p>
  <p class="pt-2">
    However, if you need a backup on the Internet, I need you to chip in for the
    server cost.
  </p>
  <p class="pt-2">
    Don't worry about it now. Talk to Kuan after you used B4TheDate extensively.
    We will figure it out.
  </p>

  <p class="font-semibold text-base py-2 mt-4 border-t-2">
    This is not <i class="italic">online</i>?
  </p>
  <p class="">
    Indeed it is not. You can use this application offline. You can <a
      class="underline"
      href="https://www.howtogeek.com/196087/how-to-add-websites-to-the-home-screen-on-any-smartphone-or-tablet/"
      target="_blank"
      >add it to your Home screen too.
    </a>
  </p>
  <p class="pt-2">
    B4 will store all your data and photos inside your phone. I do not upload
    your information to the Internet unless you decide to backup your data into
    the remote server.
  </p>

  <p class="font-semibold text-base py-2 mt-4 border-t-2">How to backup?</p>
  <p class="">Talk to Kuan.</p>
  <p class="pt-2">
    I will provide you with a backup code eventually. You will use it to upload
    all your data and photos to a remote server. Later, you can use the same
    code in another device, or the same device, to download all the backup data.
  </p>

  <p class="font-semibold text-base py-2 mt-4 border-t-2">
    How to "talk to Kuan"?
  </p>
  <p class="">Call or message him lah.</p>
  <p class="pt-2">
    If you do not have his phone number (Welcome stranger on the Internet!),
    send an email to <a class="underline" href="mailto:kuan@hey.com"
      >kuan@hey.com</a
    >
  </p>

  <div class="flex flex-row-reverse">
    <button
      class="mt-6 font-light text-primary underline place-self-end"
      on:click={$backToHome}>close</button
    >
  </div>
</div>
