<script lang="ts">
  import { vendors, downloadVendorsJSON } from '$lib/stores/vendors';
  import VendorEditor from './VendorEditor.svelte';

  export let onClose: () => void;

  let selectedIndex = 0;

  function addVendor() {
    vendors.update((vs) => [
      ...vs,
      {
        id: 'vendor-' + Date.now(),
        name: 'New Vendor',
        description: '',
        type: 'standard' as const,
        categories: [],
        theme: { primaryColor: '#c9a84c', secondaryColor: '#201c1a' },
      },
    ]);
    selectedIndex = $vendors.length - 1;
  }

  function removeVendor(i: number) {
    if (
      !confirm(
        `Delete "${$vendors[i].name}"? Changes revert when you reload unless you export first.`,
      )
    )
      return;
    vendors.update((vs) => vs.filter((_, idx) => idx !== i));
    selectedIndex = Math.max(0, Math.min(selectedIndex, $vendors.length - 1));
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-static-element-interactions -->
<div class="overlay" on:click|self={onClose} role="presentation">
  <div class="panel">
    <header class="panel-header">
      <h2 class="panel-title">Admin Panel</h2>
      <div class="header-actions">
        <button class="btn-ghost export-btn" on:click={downloadVendorsJSON}>
          ↓ Export items.json
        </button>
        <button class="btn-ghost" on:click={onClose}>✕ Close</button>
      </div>
    </header>

    <div class="panel-body">
      <aside class="vendor-sidebar">
        <p class="sidebar-label">Vendors</p>
        <div class="vendor-list">
          {#each $vendors as v, i}
            <button
              class="vendor-btn"
              class:active={selectedIndex === i}
              on:click={() => (selectedIndex = i)}
            >
              <span class="v-name">{v.name}</span>
              <span class="v-type {v.type}">{v.type}</span>
            </button>
          {/each}
        </div>
        <button class="btn-ghost add-vendor-btn" on:click={addVendor}>+ Add Vendor</button>
      </aside>

      <section class="editor-section">
        {#if $vendors.length === 0}
          <p class="empty-note">No vendors yet. Click "+ Add Vendor" to create one.</p>
        {:else}
          <div class="editor-top-bar">
            <h3 class="editing-name">Editing: {$vendors[selectedIndex]?.name}</h3>
            <button class="btn-danger" on:click={() => removeVendor(selectedIndex)}>
              Delete Vendor
            </button>
          </div>
          {#key selectedIndex}
            <VendorEditor vendorIndex={selectedIndex} />
          {/key}
        {/if}
      </section>
    </div>

    <footer class="panel-footer">
      Changes are live-previewed but not persisted until you export items.json and redeploy.
    </footer>
  </div>
</div>

<style>
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.78);
    z-index: 500;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
  }

  .panel {
    /* Reset vendor theme so admin panel always uses default gold */
    --vendor-primary: #c9a84c;
    --vendor-secondary: #201c1a;

    background: var(--color-bg-alt);
    border: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    margin: 1rem;
    border-radius: 6px;
    max-height: calc(100vh - 2rem);
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1.25rem;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-bg);
    flex-shrink: 0;
    gap: 1rem;
  }

  .panel-title {
    font-family: var(--font-heading);
    font-size: 1.1rem;
    color: var(--color-gold);
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .export-btn {
    color: var(--color-gold-dim);
    border-color: var(--color-gold-dim);
  }

  .export-btn:hover {
    color: var(--color-gold);
    border-color: var(--color-gold);
    background: rgba(201, 168, 76, 0.08);
  }

  .panel-body {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  /* ── Vendor sidebar ── */
  .vendor-sidebar {
    width: 220px;
    flex-shrink: 0;
    border-right: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    padding: 0.75rem 0 0.5rem;
  }

  .sidebar-label {
    font-family: var(--font-heading);
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: var(--color-muted);
    padding: 0 1rem 0.5rem;
    margin: 0;
  }

  .vendor-list {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0 0.4rem;
  }

  .vendor-btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.45rem 0.6rem;
    border: 1px solid transparent;
    background: transparent;
    text-align: left;
    border-radius: 4px;
    cursor: pointer;
    gap: 0.5rem;
    width: 100%;
  }

  .vendor-btn:hover {
    background: var(--color-bg-hover);
  }

  .vendor-btn.active {
    background: var(--color-bg-hover);
    border-color: var(--color-gold-dim);
  }

  .v-name {
    font-family: var(--font-heading);
    font-size: 0.85rem;
    color: var(--color-text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }

  .v-type {
    font-size: 0.62rem;
    padding: 0.1rem 0.3rem;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    flex-shrink: 0;
  }

  .v-type.standard {
    background: rgba(74, 140, 92, 0.15);
    color: #4a8c5c;
    border: 1px solid rgba(74, 140, 92, 0.25);
  }

  .v-type.procurement {
    background: rgba(122, 106, 154, 0.15);
    color: #9a8aba;
    border: 1px solid rgba(122, 106, 154, 0.25);
  }

  .add-vendor-btn {
    margin: 0.5rem 0.4rem 0;
    font-size: 0.82rem;
  }

  /* ── Editor area ── */
  .editor-section {
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .editor-top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  .editing-name {
    font-family: var(--font-heading);
    font-size: 1.1rem;
    color: var(--color-text);
    margin: 0;
  }

  .empty-note {
    color: var(--color-muted);
    padding: 2rem;
    text-align: center;
  }

  /* ── Footer ── */
  .panel-footer {
    padding: 0.55rem 1.25rem;
    border-top: 1px solid var(--color-border);
    background: var(--color-bg);
    font-size: 0.78rem;
    color: var(--color-muted);
    font-style: italic;
    flex-shrink: 0;
  }
</style>
