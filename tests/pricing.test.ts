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

  it("applies a percentage promotion to merchandise only, not shipping", () => {
    expect(priceOrder(baseOrder, { type: "PERCENT", value: 10 })).toEqual({
      subtotal: 30,
      discount: 3,
      shipping: 5,
      tax: 2.7,
      total: 34.7,
    });
  });

  it("gives PREMIUM customers free STANDARD shipping when post-promotion merchandise is at least $50", () => {
    expect(
      priceOrder({
        ...baseOrder,
        customerTier: "PREMIUM",
        items: [{ sku: "monitor", unitPrice: 50, quantity: 1 }],
      }),
    ).toEqual({
      subtotal: 50,
      discount: 0,
      shipping: 0,
      tax: 5,
      total: 55,
    });
  });

  it("evaluates the PREMIUM shipping threshold after the promotion is applied", () => {
    expect(
      priceOrder(
        {
          ...baseOrder,
          customerTier: "PREMIUM",
          items: [{ sku: "desk", unitPrice: 60, quantity: 1 }],
        },
        { type: "PERCENT", value: 20 },
      ),
    ).toEqual({
      subtotal: 60,
      discount: 12,
      shipping: 5,
      tax: 4.8,
      total: 57.8,
    });
  });

  it("does not waive EXPRESS shipping for PREMIUM customers", () => {
    expect(
      priceOrder({
        ...baseOrder,
        customerTier: "PREMIUM",
        shippingMethod: "EXPRESS",
        items: [{ sku: "monitor", unitPrice: 50, quantity: 1 }],
      }),
    ).toMatchObject({ shipping: 15 });
  });

  it("does not waive STANDARD shipping for STANDARD customers below the existing free-shipping threshold", () => {
    expect(
      priceOrder({
        ...baseOrder,
        items: [{ sku: "monitor", unitPrice: 50, quantity: 1 }],
      }),
    ).toMatchObject({ shipping: 5 });
  });

  it("keeps existing free STANDARD shipping when a promotion drops PREMIUM merchandise below $50", () => {
    expect(
      priceOrder(
        {
          ...baseOrder,
          customerTier: "PREMIUM",
          items: [{ sku: "chair", unitPrice: 80, quantity: 1 }],
        },
        { type: "PERCENT", value: 50 },
      ),
    ).toMatchObject({ shipping: 0, discount: 40 });
  });
});
