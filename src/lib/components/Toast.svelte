<script lang="ts">
  import { toast } from '$lib/stores/toast';
  import { fly } from 'svelte/transition';
</script>

{#if $toast}
  <div
    class="toast toast--{$toast.type}"
    role="status"
    aria-live="polite"
    transition:fly={{ y: 40, duration: 250 }}
  >
    {$toast.message}
  </div>
{/if}

<style>
  .toast {
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.75rem 1.5rem;
    border-radius: var(--radius);
    font-family: var(--font-body);
    font-size: 0.95rem;
    font-weight: 600;
    z-index: 1000;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
    white-space: nowrap;
    max-width: 90vw;
    text-align: center;
  }

  .toast--success {
    background: #2d5a27;
    color: #9ddc92;
    border: 1px solid #4a8a42;
  }

  .toast--error {
    background: #5a1a1a;
    color: #f08080;
    border: 1px solid #8a2020;
  }

  .toast--info {
    background: var(--color-surface-alt);
    color: var(--color-text);
    border: 1px solid var(--color-border);
  }
</style>
