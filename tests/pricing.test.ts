import { describe, expect, it } from "vitest";
import { calculateSubtotal, priceOrder } from "../src/pricing.js";
import type { Order } from "../src/types.js";

const baseOrder: Order = {
  customerTier: "STANDARD",
  shippingMethod: "STANDARD",
  items: [{ sku: "keyboard", unitPrice: 30, quantity: 1 }],
};

describe("pricing", () => {
  it("calculates a merchandise subtotal", () => {
    expect(
      calculateSubtotal({
        ...baseOrder,
        items: [
          { sku: "keyboard", unitPrice: 30, quantity: 1 },
          { sku: "mouse", unitPrice: 12.5, quantity: 2 },
        ],
      }),
    ).toBe(55);
  });

  it("charges standard shipping based on merchandise subtotal", () => {
    expect(priceOrder(baseOrder)).toEqual({
      subtotal: 30,
      discount: 0,
      shipping: 5,
      tax: 3,
      total: 38,
    });
  });

  it("caps a fixed promotion at the merchandise subtotal", () => {
    expect(priceOrder(baseOrder, { type: "FIXED", value: 100 })).toEqual({
      subtotal: 30,
      discount: 30,
      shipping: 5,
      tax: 0,
      total: 5,
    });
  });

  it("charges express shipping independently from standard shipping", () => {
    expect(
      priceOrder({ ...baseOrder, shippingMethod: "EXPRESS" }),
    ).toMatchObject({ shipping: 15 });
  });
});
