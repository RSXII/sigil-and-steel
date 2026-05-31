<script lang="ts">
  import type { Vendor } from '$lib/types';
  import { createEventDispatcher } from 'svelte';

  export let vendors: Vendor[];
  export let activeVendorId: string;

  const dispatch = createEventDispatcher<{ select: { vendorId: string } }>();
</script>

<nav class="vendor-nav">
  {#each vendors as vendor}
    <button
      class="vendor-btn"
      class:active={vendor.id === activeVendorId}
      on:click={() => dispatch('select', { vendorId: vendor.id })}
    >
      <span class="vendor-btn__name">{vendor.name}</span>
      {#if vendor.type === 'procurement'}
        <span class="badge">Procurement</span>
      {/if}
    </button>
  {/each}
</nav>

<style>
  .vendor-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .vendor-btn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    padding: 0.75rem 1rem;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 6px;
    color: var(--color-text);
    font-family: var(--font-body);
    font-size: 0.95rem;
    cursor: pointer;
    text-align: left;
    transition: background 0.15s, border-color 0.15s;
  }

  .vendor-btn:hover {
    background: var(--color-surface-hover);
    border-color: var(--vendor-primary);
  }

  .vendor-btn.active {
    background: var(--color-surface-active);
    border-color: var(--vendor-primary);
    color: var(--vendor-primary);
    box-shadow: inset 3px 0 0 var(--vendor-primary);
    transition: background 0.15s, border-color 400ms ease, color 400ms ease, box-shadow 400ms ease;
  }

  .vendor-btn__name {
    font-family: var(--font-heading);
    font-size: 1rem;
  }

  .badge {
    font-size: 0.7rem;
    font-family: var(--font-body);
    color: var(--color-text-muted);
    border: 1px solid var(--color-text-muted);
    border-radius: 4px;
    padding: 0 0.4rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
</style>
