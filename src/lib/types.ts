export interface ShopItem {
  id: string;
  name: string;
  price: number;
  unit: "gp" | "sp" | "cp";
  description: string;
}

export interface Category {
  name: string;
  items: ShopItem[];
}

export interface VendorTheme {
  primaryColor: string;
  secondaryColor: string;
  shopkeeperImage?: string;
}

export interface StandardVendor {
  id: string;
  name: string;
  description: string;
  type: "standard";
  categories: Category[];
  theme?: VendorTheme;
}

export interface ProcurementField {
  id: string;
  label: string;
  type: "text" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
}

export interface ProcurementVendor {
  id: string;
  name: string;
  description: string;
  type: "procurement";
  procurementNote: string;
  requestFields: ProcurementField[];
  theme?: VendorTheme;
}

export type Vendor = StandardVendor | ProcurementVendor;

export interface ShopData {
  vendors: Vendor[];
}

export interface CartItem {
  item: ShopItem;
  vendorName: string;
  qty: number;
}
