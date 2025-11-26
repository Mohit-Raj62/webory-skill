/**
 * Calculate discounted price based on percentage
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercentage: number
): number {
  if (discountPercentage <= 0 || discountPercentage > 100) {
    return originalPrice;
  }
  const discount = (originalPrice * discountPercentage) / 100;
  return Math.round(originalPrice - discount);
}

/**
 * Apply promo code discount to a price
 */
export function applyPromoDiscount(
  price: number,
  promoCode: {
    discountType: 'percentage' | 'fixed';
    discountValue: number;
  }
): number {
  if (promoCode.discountType === 'percentage') {
    return calculateDiscountedPrice(price, promoCode.discountValue);
  } else {
    // Fixed discount
    const finalPrice = price - promoCode.discountValue;
    return Math.max(0, Math.round(finalPrice)); // Don't go below 0
  }
}

/**
 * Format price with Indian Rupee symbol
 */
export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Calculate savings amount
 */
export function calculateSavings(
  originalPrice: number,
  finalPrice: number
): number {
  return Math.max(0, originalPrice - finalPrice);
}

/**
 * Calculate total discount percentage
 */
export function calculateTotalDiscountPercentage(
  originalPrice: number,
  finalPrice: number
): number {
  if (originalPrice <= 0) return 0;
  const savings = calculateSavings(originalPrice, finalPrice);
  return Math.round((savings / originalPrice) * 100);
}
