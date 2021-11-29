<script>
  import Logo from 'view/Logo.svelte';
</script>

<div class="p-8 sm:p-4 h-screen">
  <div class="relative h-full p-8 sm:p-4 bg-neutral rounded-lg overflow-auto">
    <h1><span id="logo"><Logo /></span><span id="back">The Date</span></h1>

    <p>Hello!</p>

    <p>
      Use this application to remind you about expiring stuff before it goes to
      waste.
    </p>

    <p>To learn more about us, tap on the "B4" button at the bottom left.</p>

    <p>
      Want to start right away? Click on the "+" button at the bottom center.
    </p>

    <p>Have fun!</p>
  </div>
</div>

<style>
  h1 {
    font-size: 1.25rem /* 20px */;
    line-height: 1.75rem /* 28px */;
    text-align: center;
    display: flex;
    justify-content: center;
  }

  #logo {
    vertical-align: baseline;
  }

  #back {
    padding-left: 0.2rem;
    padding-top: 0.2rem;
  }

  p {
    padding-top: 1.5rem;
  }
</style>
