<script lang="ts">
  import { vendors } from '$lib/stores/vendors';
  import ItemEditor from './ItemEditor.svelte';
  import type { VendorTheme, ProcurementVendor, ProcurementField } from '$lib/types';

  export let vendorIndex: number;

  // Discover available shopkeeper images at dev time via Vite's glob.
  // Keys are like '/static/shopkeepers/foo.jpg'; we strip the prefix for the filename.
  const _skGlob = import.meta.glob(
    '/static/shopkeepers/*.{jpg,jpeg,png,gif,webp,mp4}',
    { eager: false }
  );
  const availableImages: Array<{ filename: string; isVideo: boolean }> = Object.keys(_skGlob).map(
    (path) => {
      const filename = path.split('/').pop()!;
      return { filename, isVideo: filename.toLowerCase().endsWith('.mp4') };
    }
  );

  function selectShopkeeper(filename: string | undefined) {
    patchTheme({ shopkeeperImage: filename });
  }

  type Tab = 'info' | 'theme' | 'shopkeeper' | 'voice' | 'content';
  let activeTab: Tab = 'info';

  $: vendor = $vendors[vendorIndex];
  $: isStandard = vendor?.type === 'standard';
  $: pv = vendor?.type === 'procurement' ? (vendor as ProcurementVendor) : null;

  function patchVendor(partial: Record<string, unknown>) {
    vendors.update((vs) => {
      const copy = [...vs];
      copy[vendorIndex] = { ...copy[vendorIndex], ...partial };
      return copy;
    });
  }

  function patchTheme(partial: Partial<VendorTheme>) {
    const existing: VendorTheme = vendor?.theme ?? {
      primaryColor: '#c9a84c',
      secondaryColor: '#201c1a',
    };
    patchVendor({ theme: { ...existing, ...partial } });
  }

  function patchProcNote(note: string) {
    vendors.update((vs) => {
      const copy = [...vs];
      copy[vendorIndex] = { ...(copy[vendorIndex] as ProcurementVendor), procurementNote: note };
      return copy;
    });
  }

  function updateFields(fields: ProcurementField[]) {
    vendors.update((vs) => {
      const copy = [...vs];
      copy[vendorIndex] = { ...(copy[vendorIndex] as ProcurementVendor), requestFields: fields };
      return copy;
    });
  }

  function addField() {
    if (!pv) return;
    updateFields([
      ...(pv.requestFields ?? []),
      { id: 'field-' + Date.now(), label: 'New Field', type: 'text' as const, placeholder: '' },
    ]);
  }

  function removeField(fi: number) {
    if (!pv) return;
    if (!confirm(`Delete field "${pv.requestFields[fi].label}"?`)) return;
    updateFields(pv.requestFields.filter((_, i) => i !== fi));
  }

  function patchField(fi: number, partial: Partial<ProcurementField>) {
    if (!pv) return;
    updateFields(pv.requestFields.map((f, i) => (i === fi ? { ...f, ...partial } : f)));
  }

  function updateFieldOptions(fi: number, text: string) {
    const options = text
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    patchField(fi, { options });
  }

  function setFieldType(fi: number, value: string) {
    patchField(fi, { type: value as ProcurementField['type'] });
  }

  function addSpeech() {
    const existing = vendor.speeches ?? [];
    if (existing.length >= 20) return;
    patchVendor({ speeches: [...existing, ''] });
  }

  function removeSpeech(si: number) {
    const lines = [...(vendor.speeches ?? [])];
    lines.splice(si, 1);
    patchVendor({ speeches: lines });
  }

  function patchSpeech(si: number, text: string) {
    const lines = [...(vendor.speeches ?? [])];
    lines[si] = text;
    patchVendor({ speeches: lines });
  }

  $: contentTabLabel = isStandard ? 'Inventory' : 'Fields';
  $: tabList = [
    ['info', 'Info'],
    ['theme', 'Theme'],
    ['shopkeeper', 'Shopkeeper'],
    ['voice', 'Voice'],
    ['content', contentTabLabel],
  ] as [Tab, string][];
</script>

{#if vendor}
  <div class="vendor-editor">
    <nav class="tab-nav">
      {#each tabList as [tabId, tabLabel]}
        <button
          class="tab-btn"
          class:active={activeTab === tabId}
          on:click={() => (activeTab = tabId)}
        >
          {tabLabel}
        </button>
      {/each}
    </nav>

    <div class="tab-body">

      <!-- ── INFO ── -->
      {#if activeTab === 'info'}
        <div class="field-group">
          <label for="ve-name">Name</label>
          <input
            id="ve-name"
            type="text"
            value={vendor.name}
            on:input={(e) => patchVendor({ name: e.currentTarget.value })}
          />
        </div>
        <div class="field-group">
          <label for="ve-desc">Description</label>
          <textarea
            id="ve-desc"
            rows="3"
            on:change={(e) => patchVendor({ description: e.currentTarget.value })}
          >{vendor.description}</textarea>
        </div>
        <div class="field-group">
          <p class="pseudo-label">Type</p>
          <span class="type-badge {vendor.type}">{vendor.type}</span>
        </div>
      {/if}

      <!-- ── THEME ── -->
      {#if activeTab === 'theme'}
        <div class="color-row">
          <div class="field-group">
            <label for="ve-primary">Primary Color</label>
            <div class="color-input-wrap">
              <input
                id="ve-primary"
                type="color"
                value={vendor.theme?.primaryColor ?? '#c9a84c'}
                on:input={(e) => patchTheme({ primaryColor: e.currentTarget.value })}
              />
              <code class="color-hex">{vendor.theme?.primaryColor ?? '#c9a84c'}</code>
            </div>
            <p class="field-hint">Accent — portrait border, vendor title, category headings</p>
          </div>
          <div class="field-group">
            <label for="ve-secondary">Secondary Color</label>
            <div class="color-input-wrap">
              <input
                id="ve-secondary"
                type="color"
                value={vendor.theme?.secondaryColor ?? '#201c1a'}
                on:input={(e) => patchTheme({ secondaryColor: e.currentTarget.value })}
              />
              <code class="color-hex">{vendor.theme?.secondaryColor ?? '#201c1a'}</code>
            </div>
            <p class="field-hint">Background tint — portrait panel</p>
          </div>
        </div>

        <div
          class="theme-preview"
          style="--p: {vendor.theme?.primaryColor ?? '#c9a84c'}; --s: {vendor.theme?.secondaryColor ?? '#201c1a'}"
        >
          <div class="preview-bg">
            <span class="preview-heading">Sample Heading</span>
            <div class="preview-rule" />
            <span class="preview-muted">Category / subtext</span>
          </div>
        </div>
      {/if}

      <!-- ── SHOPKEEPER ── -->
      {#if activeTab === 'shopkeeper'}
        <div class="sk-gallery">
          <!-- None / clear option -->
          <button
            class="sk-thumb"
            class:selected={!vendor.theme?.shopkeeperImage}
            on:click={() => selectShopkeeper(undefined)}
            title="No shopkeeper image"
          >
            <div class="sk-thumb-none"><span>⊘</span></div>
            <span class="sk-thumb-name">None</span>
          </button>

          {#each availableImages as img}
            <button
              class="sk-thumb"
              class:selected={vendor.theme?.shopkeeperImage === img.filename}
              on:click={() => selectShopkeeper(img.filename)}
              title={img.filename}
            >
              {#if img.isVideo}
                <!-- svelte-ignore a11y-media-has-caption -->
                <video src={`/shopkeepers/${img.filename}`} muted class="sk-thumb-media" />
              {:else}
                <img src={`/shopkeepers/${img.filename}`} alt={img.filename} class="sk-thumb-media" />
              {/if}
              <span class="sk-thumb-name">{img.filename.replace(/\.[^.]+$/, '')}</span>
              {#if vendor.theme?.shopkeeperImage === img.filename}
                <div class="sk-selected-badge">✓</div>
              {/if}
            </button>
          {/each}
        </div>

        {#if availableImages.length === 0}
          <p class="field-hint">
            No images found. Add <code>.jpg</code>, <code>.png</code>, <code>.gif</code>, or
            <code>.mp4</code> files to <code>/static/shopkeepers/</code> — the gallery refreshes automatically.
          </p>
        {:else}
          <p class="field-hint">
            Add new files to <code>/static/shopkeepers/</code> and the gallery updates on save.
          </p>
        {/if}
      {/if}

      <!-- ── VOICE ── -->
      {#if activeTab === 'voice'}
        {@const speechLines = vendor.speeches ?? []}
        <div class="field-group">
          <p class="pseudo-label">
            Speech Lines
            <span class="hint-inline">({speechLines.length}/20)</span>
          </p>
          <p class="field-hint">
            A random line is shown in the portrait panel whenever a player opens this vendor's tab.
          </p>
        </div>

        {#each speechLines as line, si}
          <div class="speech-row">
            <textarea
              rows="2"
              class="speech-input"
              value={line}
              placeholder="What does the shopkeeper say…"
              on:change={(e) => patchSpeech(si, e.currentTarget.value)}
            />
            <button
              class="btn-danger icon-btn"
              title="Delete line"
              on:click={() => removeSpeech(si)}
            >✕</button>
          </div>
        {/each}

        {#if speechLines.length === 0}
          <p class="field-hint" style="font-style: italic; margin-top: 0.25rem">
            No lines yet — add some below.
          </p>
        {/if}

        <button
          class="btn-ghost"
          on:click={addSpeech}
          disabled={speechLines.length >= 20}
        >
          + Add Line{speechLines.length >= 20 ? ' (max 20)' : ''}
        </button>
      {/if}

      <!-- ── CONTENT: Inventory or Fields ── -->
      {#if activeTab === 'content'}
        {#if isStandard}
          <ItemEditor {vendorIndex} />
        {:else if pv}
          <div class="field-group">
            <label for="ve-proc-note">Procurement Note</label>
            <textarea
              id="ve-proc-note"
              rows="3"
              on:change={(e) => patchProcNote(e.currentTarget.value)}
            >{pv.procurementNote}</textarea>
          </div>

          <h4 class="section-subheading">Request Fields</h4>

          {#each pv.requestFields as field, fi}
            <div class="field-card">
              <div class="field-card-head">
                <span class="field-label-preview">{field.label || '(untitled)'}</span>
                <button
                  class="btn-danger icon-btn"
                  on:click={() => removeField(fi)}
                  title="Delete field"
                >
                  ✕
                </button>
              </div>
              <div class="field-card-body">
                <div class="inline-row">
                  <div class="field-group flex1">
                    <label for="fl-label-{fi}">Label</label>
                    <input
                      id="fl-label-{fi}"
                      type="text"
                      value={field.label}
                      on:input={(e) => patchField(fi, { label: e.currentTarget.value })}
                    />
                  </div>
                  <div class="field-group w120">
                    <label for="fl-type-{fi}">Type</label>
                    <select
                      id="fl-type-{fi}"
                      value={field.type}
                      on:change={(e) => setFieldType(fi, e.currentTarget.value)}
                    >
                      <option value="text">text</option>
                      <option value="textarea">textarea</option>
                      <option value="select">select</option>
                    </select>
                  </div>
                </div>

                {#if field.type !== 'select'}
                  <div class="field-group">
                    <label for="fl-ph-{fi}">Placeholder</label>
                    <input
                      id="fl-ph-{fi}"
                      type="text"
                      value={field.placeholder ?? ''}
                      on:input={(e) => patchField(fi, { placeholder: e.currentTarget.value })}
                    />
                  </div>
                {:else}
                  <div class="field-group">
                    <label for="fl-opts-{fi}">
                      Options
                      <span class="hint-inline">(one per line)</span>
                    </label>
                    <textarea
                      id="fl-opts-{fi}"
                      rows="4"
                      on:change={(e) => updateFieldOptions(fi, e.currentTarget.value)}
                    >{(field.options ?? []).join('\n')}</textarea>
                  </div>
                {/if}
              </div>
            </div>
          {/each}

          <button class="btn-ghost" on:click={addField}>+ Add Field</button>
        {/if}
      {/if}

    </div>
  </div>
{/if}

<style>
  .vendor-editor {
    display: flex;
    flex-direction: column;
    gap: 0;
    flex: 1;
    min-height: 0;
  }

  /* ── Tabs ── */
  .tab-nav {
    display: flex;
    gap: 0;
    border-bottom: 1px solid var(--color-border);
    margin-bottom: 1.25rem;
    flex-shrink: 0;
  }

  .tab-btn {
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    border-radius: 0;
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
    color: var(--color-muted);
    cursor: pointer;
    transition:
      color var(--transition),
      border-color var(--transition);
    margin-bottom: -1px;
    text-transform: uppercase;
    letter-spacing: 0.07em;
  }

  .tab-btn:hover {
    color: var(--color-text);
    background: transparent;
  }

  .tab-btn.active {
    color: var(--color-gold);
    border-bottom-color: var(--color-gold);
    background: transparent;
  }

  /* ── Tab body ── */
  .tab-body {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  /* ── Field groups ── */
  .field-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }

  .field-hint {
    font-size: 0.78rem;
    color: var(--color-muted);
    font-style: italic;
    margin: 0;
    line-height: 1.5;
  }

  .pseudo-label {
    font-family: var(--font-heading);
    font-size: 0.85rem;
    color: var(--color-text-dim);
    margin: 0;
  }

  code {
    font-size: 0.82em;
    background: var(--color-bg);
    padding: 0.1em 0.35em;
    border-radius: 3px;
    color: var(--color-text-dim);
    font-style: normal;
  }

  .type-badge {
    display: inline-block;
    font-size: 0.75rem;
    padding: 0.2rem 0.5rem;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    align-self: flex-start;
  }

  .type-badge.standard {
    background: rgba(74, 140, 92, 0.15);
    color: #4a8c5c;
    border: 1px solid rgba(74, 140, 92, 0.3);
  }

  .type-badge.procurement {
    background: rgba(122, 106, 154, 0.15);
    color: #9a8aba;
    border: 1px solid rgba(122, 106, 154, 0.3);
  }

  /* ── Theme tab ── */
  .color-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
  }

  .color-input-wrap {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  input[type='color'] {
    width: 40px;
    height: 34px;
    padding: 2px;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-bg);
    cursor: pointer;
    flex-shrink: 0;
  }

  .color-hex {
    font-size: 0.85rem;
    font-style: normal;
  }

  .theme-preview {
    border: 1px solid var(--color-border);
    border-radius: 4px;
    overflow: hidden;
  }

  .preview-bg {
    background: var(--s);
    padding: 1rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .preview-heading {
    font-family: var(--font-heading);
    color: var(--p);
    font-size: 1.15rem;
  }

  .preview-rule {
    height: 1px;
    background: color-mix(in srgb, var(--p) 40%, transparent);
  }

  .preview-muted {
    font-size: 0.8rem;
    color: color-mix(in srgb, var(--p) 60%, var(--color-muted) 40%);
    font-style: italic;
  }

  /* ── Shopkeeper gallery ── */
  .sk-gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(108px, 1fr));
    gap: 0.65rem;
  }

  .sk-thumb {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem;
    background: var(--color-bg);
    border: 2px solid var(--color-border);
    border-radius: 6px;
    cursor: pointer;
    transition:
      border-color var(--transition),
      background var(--transition);
    position: relative;
    text-align: center;
  }

  .sk-thumb:hover {
    border-color: var(--color-text-dim);
    background: var(--color-bg-hover);
  }

  .sk-thumb.selected {
    border-color: var(--color-gold);
    background: rgba(201, 168, 76, 0.08);
  }

  .sk-thumb-media {
    width: 100%;
    aspect-ratio: 3 / 4;
    object-fit: cover;
    border-radius: 3px;
    display: block;
  }

  .sk-thumb-none {
    width: 100%;
    aspect-ratio: 3 / 4;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg-alt);
    border-radius: 3px;
    font-size: 1.75rem;
    color: var(--color-muted);
  }

  .sk-thumb-name {
    font-size: 0.7rem;
    color: var(--color-text-dim);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    line-height: 1.3;
  }

  .sk-selected-badge {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 18px;
    height: 18px;
    background: var(--color-gold);
    color: var(--color-bg);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.68rem;
    font-weight: bold;
    line-height: 1;
  }

  /* ── Content/Fields tab ── */
  .section-subheading {
    font-family: var(--font-heading);
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-text-dim);
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 0.35rem;
    margin: 0;
  }

  .field-card {
    border: 1px solid var(--color-border);
    border-radius: 4px;
    overflow: hidden;
  }

  .field-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.4rem 0.75rem;
    background: var(--color-bg-hover);
    border-bottom: 1px solid var(--color-border);
  }

  .field-label-preview {
    font-size: 0.83rem;
    color: var(--color-text-dim);
    font-style: italic;
  }

  .field-card-body {
    padding: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .inline-row {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .flex1 {
    flex: 1;
  }

  .w120 {
    width: 120px;
    flex-shrink: 0;
  }

  .hint-inline {
    font-size: 0.75rem;
    color: var(--color-muted);
    font-style: italic;
    font-family: var(--font-body);
    text-transform: none;
    letter-spacing: 0;
  }

  .icon-btn {
    padding: 0.2rem 0.45rem;
    font-size: 0.75rem;
    border: none;
  }

  /* ── Voice tab ── */
  .speech-row {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .speech-input {
    flex: 1;
    resize: vertical;
    min-height: 54px;
    font-style: italic;
  }
</style>
