<script lang="ts">
  import { fade } from "svelte/transition";
  import type { Vendor } from "$lib/types";

  export let vendor: Vendor;

  $: theme = vendor?.theme;
  $: primaryColor = theme?.primaryColor ?? "#c9a84c";
  $: secondaryColor = theme?.secondaryColor ?? "#201c1a";
  $: imagePath = theme?.shopkeeperImage
    ? `/shopkeepers/${theme.shopkeeperImage}`
    : null;
  $: isVideo = imagePath?.toLowerCase().endsWith(".mp4") ?? false;
</script>

{#key vendor?.id}
  <div
    class="portrait-wrap"
    transition:fade={{ duration: 250 }}
    style="--p-primary: {primaryColor}; --p-secondary: {secondaryColor}"
  >
    <div class="portrait-frame">
      <div class="portrait-media-area">
        {#if imagePath}
          {#if isVideo}
            <!-- svelte-ignore a11y-media-has-caption -->
            <video
              src={imagePath}
              autoplay
              loop
              muted
              playsinline
              class="portrait-media"
            />
          {:else}
            <img
              src={imagePath}
              alt="Portrait of {vendor.name}"
              class="portrait-media"
            />
          {/if}
        {:else}
          <div class="portrait-placeholder">
            <span class="placeholder-glyph">⚜</span>
          </div>
        {/if}
        <div class="portrait-gradient" />
      </div>
      <div class="portrait-nameplate">
        <span>{vendor.name}</span>
      </div>
    </div>
  </div>
{/key}

<style>
  .portrait-wrap {
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 1.75rem 1rem;
    background: var(--p-secondary);
    transition:
      background 400ms ease,
      border-color 400ms ease;
  }

  .portrait-frame {
    width: 100%;
    max-width: 200px;
    display: flex;
    flex-direction: column;
    border: 2px solid var(--p-primary);
    border-radius: 3px;
    overflow: hidden;
    box-shadow:
      0 0 24px color-mix(in srgb, var(--p-primary) 20%, transparent),
      0 4px 16px rgba(0, 0, 0, 0.5);
    transition: border-color 400ms ease, box-shadow 400ms ease;
  }

  .portrait-media-area {
    aspect-ratio: 2 / 3;
    position: relative;
    overflow: hidden;
    background: color-mix(in srgb, var(--p-secondary) 70%, black 30%);
  }

  .portrait-media {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .portrait-gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30%;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.8) 0%,
      transparent 100%
    );
    pointer-events: none;
  }

  .portrait-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--p-secondary) 80%, var(--p-primary) 20%);
  }

  .placeholder-glyph {
    font-size: 3.5rem;
    opacity: 0.2;
    user-select: none;
    color: var(--p-primary);
    filter: drop-shadow(0 0 8px var(--p-primary));
  }

  .portrait-nameplate {
    padding: 0.45rem 0.6rem;
    background: color-mix(in srgb, var(--p-secondary) 50%, black 50%);
    border-top: 1px solid color-mix(in srgb, var(--p-primary) 60%, transparent);
    text-align: center;
  }

  .portrait-nameplate span {
    font-family: var(--font-heading);
    font-size: 0.75rem;
    color: var(--p-primary);
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }
</style>
