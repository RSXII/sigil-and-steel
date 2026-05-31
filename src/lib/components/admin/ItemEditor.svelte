<script lang="ts">
  import { vendors } from "$lib/stores/vendors";
  import type { StandardVendor, Category, ShopItem } from "$lib/types";

  export let vendorIndex: number;

  $: vendor = $vendors[vendorIndex] as StandardVendor;

  function updateCategories(categories: Category[]) {
    vendors.update((vs) => {
      const copy = [...vs];
      copy[vendorIndex] = { ...(copy[vendorIndex] as StandardVendor), categories };
      return copy;
    });
  }

  function addCategory() {
    updateCategories([...(vendor.categories ?? []), { name: "New Category", items: [] }]);
  }

  function updateCategoryName(ci: number, name: string) {
    updateCategories(vendor.categories.map((c, i) => (i === ci ? { ...c, name } : c)));
  }

  function removeCategory(ci: number) {
    if (!confirm(`Delete category "${vendor.categories[ci].name}" and all its items?`)) return;
    updateCategories(vendor.categories.filter((_, i) => i !== ci));
  }

  function addItem(ci: number) {
    const newItem: ShopItem = {
      id: "item-" + Date.now(),
      name: "New Item",
      price: 0,
      unit: "gp",
      description: "",
    };
    updateCategories(
      vendor.categories.map((c, i) =>
        i === ci ? { ...c, items: [...c.items, newItem] } : c,
      ),
    );
  }

  function updateItem(ci: number, ii: number, patch: Partial<ShopItem>) {
    updateCategories(
      vendor.categories.map((c, catIdx) => {
        if (catIdx !== ci) return c;
        return {
          ...c,
          items: c.items.map((item, itemIdx) =>
            itemIdx === ii ? { ...item, ...patch } : item,
          ),
        };
      }),
    );
  }

  function removeItem(ci: number, ii: number) {
    updateCategories(
      vendor.categories.map((c, catIdx) => {
        if (catIdx !== ci) return c;
        return { ...c, items: c.items.filter((_, itemIdx) => itemIdx !== ii) };
      }),
    );
  }

  function setUnit(ci: number, ii: number, value: string) {
    updateItem(ci, ii, { unit: value as ShopItem['unit'] });
  }
</script>

<div class="item-editor">
  {#each vendor?.categories ?? [] as category, ci}
    <div class="category-block">
      <div class="category-header">
        <input
          class="cat-name-input"
          value={category.name}
          on:change={(e) => updateCategoryName(ci, e.currentTarget.value)}
          placeholder="Category name"
        />
        <button
          class="btn-danger icon-btn"
          on:click={() => removeCategory(ci)}
          title="Delete category"
        >
          ✕
        </button>
      </div>

      <div class="items-list">
        {#each category.items as item, ii}
          <div class="item-row">
            <input
              class="item-input name"
              value={item.name}
              on:change={(e) => updateItem(ci, ii, { name: e.currentTarget.value })}
              placeholder="Name"
            />
            <input
              class="item-input price"
              type="number"
              min="0"
              step="1"
              value={item.price}
              on:change={(e) => updateItem(ci, ii, { price: +e.currentTarget.value })}
            />
            <select
              class="item-input unit"
              value={item.unit}
              on:change={(e) => setUnit(ci, ii, e.currentTarget.value)}
            >
              <option value="gp">gp</option>
              <option value="sp">sp</option>
              <option value="cp">cp</option>
            </select>
            <input
              class="item-input desc"
              value={item.description}
              on:change={(e) =>
                updateItem(ci, ii, { description: e.currentTarget.value })}
              placeholder="Description"
            />
            <button
              class="btn-danger icon-btn"
              on:click={() => removeItem(ci, ii)}
              title="Remove item"
            >
              ✕
            </button>
          </div>
        {/each}
        <button class="btn-ghost add-item-btn" on:click={() => addItem(ci)}>
          + Add Item
        </button>
      </div>
    </div>
  {/each}

  <button class="btn-ghost add-cat-btn" on:click={addCategory}>
    + Add Category
  </button>
</div>

<style>
  .item-editor {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .category-block {
    border: 1px solid var(--color-border);
    border-radius: 4px;
    overflow: hidden;
  }

  .category-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    background: var(--color-bg-hover);
    border-bottom: 1px solid var(--color-border);
  }

  .cat-name-input {
    flex: 1;
    background: transparent;
    border: none;
    border-bottom: 1px solid transparent;
    border-radius: 0;
    font-family: var(--font-heading);
    font-size: 0.9rem;
    color: var(--color-text);
    padding: 0.15rem 0;
  }

  .cat-name-input:focus {
    outline: none;
    border-bottom-color: var(--color-gold-dim);
  }

  .items-list {
    padding: 0.5rem 0.75rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .item-row {
    display: grid;
    grid-template-columns: 1fr 70px 50px 1.5fr auto;
    gap: 0.4rem;
    align-items: center;
  }

  .item-input {
    font-size: 0.82rem;
    padding: 0.3rem 0.5rem;
  }

  .item-input.price {
    text-align: right;
  }

  .item-input.unit {
    padding-right: 1.5rem;
    background-position: right 0.4rem center;
  }

  .icon-btn {
    padding: 0.2rem 0.4rem;
    font-size: 0.75rem;
    border: none;
  }

  .add-item-btn,
  .add-cat-btn {
    font-size: 0.8rem;
    padding: 0.3rem 0.6rem;
    align-self: flex-start;
    margin-top: 0.25rem;
  }

  .add-cat-btn {
    margin-top: 0.25rem;
  }
</style>
