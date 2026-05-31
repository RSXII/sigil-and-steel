import { writable, get } from "svelte/store";
import type { Vendor, ShopData } from "$lib/types";
import rawData from "../../data/items.json";

export const vendors = writable<Vendor[]>(
  JSON.parse(JSON.stringify(rawData.vendors)) as unknown as Vendor[],
);

export function downloadVendorsJSON(): void {
  const data: ShopData = { vendors: get(vendors) };
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "items.json";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
