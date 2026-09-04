export type CustomerTier = "STANDARD" | "PREMIUM";
export type ShippingMethod = "STANDARD" | "EXPRESS";

export interface LineItem {
  sku: string;
  unitPrice: number;
  quantity: number;
}

export interface Order {
  customerTier: CustomerTier;
  shippingMethod: ShippingMethod;
  items: LineItem[];
}

export type Promotion =
  | { type: "PERCENT"; value: number }
  | { type: "FIXED"; value: number };

export interface PriceBreakdown {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
}
