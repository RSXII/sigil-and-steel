<script lang="ts">
  import type { ProcurementVendor } from '$lib/types';
  import { postProcurement } from '$lib/discord';
  import { showToast } from '$lib/stores/toast';

  export let vendor: ProcurementVendor;
  export let charName: string;

  let fieldValues: Record<string, string> = {};
  let submitting = false;

  // Reset field values when vendor changes
  $: vendor, resetForm();

  function resetForm() {
    fieldValues = Object.fromEntries(vendor.requestFields.map((f) => [f.id, '']));
  }

  async function handleSubmit() {
    if (!charName.trim()) {
      showToast('Enter your character name first.', 'error');
      return;
    }
    const descField = vendor.requestFields.find((f) => f.id === 'item-description');
    if (descField && !fieldValues['item-description']?.trim()) {
      showToast('Please describe what you are looking for.', 'error');
      return;
    }

    submitting = true;
    try {
      const labeledFields: Record<string, string> = {};
      for (const field of vendor.requestFields) {
        labeledFields[field.label] = fieldValues[field.id] ?? '';
      }
      await postProcurement(charName, labeledFields);
      showToast('Request sent to the Grey Veil.', 'success');
      resetForm();
    } catch {
      showToast('Failed to send request. Try again.', 'error');
    } finally {
      submitting = false;
    }
  }
</script>

<div class="procurement">
  <div class="procurement-note">{vendor.procurementNote}</div>

  <form class="procurement-form" on:submit|preventDefault={handleSubmit}>
    {#each vendor.requestFields as field (field.id)}
      <div class="field">
        <label for={field.id}>{field.label}</label>

        {#if field.type === 'textarea'}
          <textarea
            id={field.id}
            placeholder={field.placeholder ?? ''}
            bind:value={fieldValues[field.id]}
            rows="3"
          ></textarea>
        {:else if field.type === 'select'}
          <select id={field.id} bind:value={fieldValues[field.id]}>
            <option value="" disabled selected>Select…</option>
            {#each field.options ?? [] as option}
              <option value={option}>{option}</option>
            {/each}
          </select>
        {:else}
          <input
            type="text"
            id={field.id}
            placeholder={field.placeholder ?? ''}
            bind:value={fieldValues[field.id]}
          />
        {/if}
      </div>
    {/each}

    <button type="submit" class="btn-submit" disabled={submitting}>
      {submitting ? 'Sending…' : 'Send Request'}
    </button>
  </form>
</div>

<style>
  .procurement {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
  }

  .procurement-note {
    padding: var(--space-md);
    background: var(--color-surface-alt);
    border-left: 3px solid var(--color-gold);
    border-radius: 0 var(--radius) var(--radius) 0;
    color: var(--color-muted);
    font-style: italic;
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .procurement-form {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
  }

  label {
    font-size: 0.9rem;
    color: var(--color-text);
    font-weight: 600;
  }

  input,
  textarea,
  select {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    color: var(--color-text);
    font-family: var(--font-body);
    font-size: 0.95rem;
    padding: var(--space-sm) var(--space-md);
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
  }

  input:focus,
  textarea:focus,
  select:focus {
    outline: none;
    border-color: var(--color-gold);
  }

  .btn-submit {
    align-self: flex-start;
    padding: var(--space-sm) var(--space-lg);
    background: var(--color-crimson);
    color: var(--color-text);
    font-family: var(--font-heading);
    font-size: 1rem;
    border: none;
    border-radius: var(--radius);
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-submit:not(:disabled):hover {
    opacity: 0.85;
  }
</style>
