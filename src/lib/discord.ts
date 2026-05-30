import type { CartItem } from "$lib/types";

const PURCHASE_WEBHOOK = import.meta.env.VITE_PURCHASE_WEBHOOK;
const PROCUREMENT_WEBHOOK = import.meta.env.VITE_PROCUREMENT_WEBHOOK;

export async function postPurchase(
  charName: string,
  cartItems: CartItem[],
): Promise<void> {
  const multiplier: Record<string, number> = { gp: 1, sp: 0.1, cp: 0.01 };
  const totalGp = cartItems.reduce(
    (sum, ci) => sum + ci.item.price * ci.qty * (multiplier[ci.item.unit] ?? 1),
    0,
  );

  const lines = cartItems
    .map(
      (ci) =>
        `• **${ci.item.name}** ×${ci.qty} — ${ci.item.price * ci.qty} ${ci.item.unit} *(${ci.vendorName})*`,
    )
    .join("\n");

  const embed = {
    title: `🛒 Purchase — ${charName}`,
    color: 0xc9a84c,
    fields: [
      { name: "Items", value: lines },
      {
        name: "Total",
        value: Number.isInteger(totalGp)
          ? `${totalGp} gp`
          : `${totalGp.toFixed(2)} gp`,
        inline: true,
      },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: "The Merchant Quarter" },
  };

  const res = await fetch(PURCHASE_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] }),
  });

  if (!res.ok) throw new Error(`Discord webhook failed: ${res.status}`);
}

export async function postProcurement(
  charName: string,
  fields: Record<string, string>,
): Promise<void> {
  const embedFields = Object.entries(fields)
    .filter(([, value]) => value.trim())
    .map(([name, value]) => ({ name, value }));

  const embed = {
    title: `🕵️ Procurement Request — ${charName}`,
    color: 0x8a3030,
    fields: [
      { name: "Character", value: charName, inline: true },
      ...embedFields,
    ],
    timestamp: new Date().toISOString(),
    footer: { text: "Grey Veil — DM Eyes Only" },
  };

  const res = await fetch(PROCUREMENT_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds: [embed] }),
  });

  if (!res.ok) throw new Error(`Discord webhook failed: ${res.status}`);
}
