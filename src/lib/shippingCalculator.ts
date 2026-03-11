/**
 * Shipping Cost Calculator
 * Calculates shipping costs based on order weight and total price
 */

export interface ShippingCalculation {
  weight: number;
  orderTotal: number;
  shippingCost: number;
  shippingPercentage: number;
  finalTotal: number;
}

/**
 * Calculate shipping cost based on weight and order total
 * 
 * Shipping Rules:
 * - Less than 15 kg: 10% of order total
 * - 16kg to 100kg: 10% of order total  
 * - 101kg to 500kg: 9% of order total
 * - Above 500kg: 8% of order total
 */
export function calculateShipping(weight: number, orderTotal: number): ShippingCalculation {
  let shippingPercentage: number;

  if (weight <= 15) {
    shippingPercentage = 10;
  } else if (weight <= 100) {
    shippingPercentage = 10;
  } else if (weight <= 500) {
    shippingPercentage = 9;
  } else {
    shippingPercentage = 8;
  }

  const shippingCost = Math.round((orderTotal * shippingPercentage) / 100);
  const finalTotal = orderTotal + shippingCost;

  return {
    weight,
    orderTotal,
    shippingCost,
    shippingPercentage,
    finalTotal,
  };
}

/**
 * Get shipping tier description for display
 */
export function getShippingTierDescription(weight: number): string {
  if (weight <= 15) {
    return "Standard shipping (≤15kg): 10% of order value";
  } else if (weight <= 100) {
    return "Standard shipping (16-100kg): 10% of order value";
  } else if (weight <= 500) {
    return "Bulk shipping (101-500kg): 9% of order value";
  } else {
    return "Heavy bulk shipping (>500kg): 8% of order value";
  }
}

/**
 * Format shipping cost for display
 */
export function formatShippingCost(shippingCost: number): string {
  return `₹${shippingCost.toLocaleString()}`;
}