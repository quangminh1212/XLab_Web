export interface OptionPrice { price: number; originalPrice?: number }
export interface ProductVersion { name: string; price: number; originalPrice: number }
export interface PriceableProduct {
  price?: number
  originalPrice?: number
  defaultProductOption?: string
  optionPrices?: Record<string, OptionPrice>
  versions?: ProductVersion[]
}

// Trả về giá hiển thị (ưu tiên option mặc định) và originalPrice hợp lệ (>= price, fallback 5x)
export function getDisplayPrices(product: PriceableProduct): { price: number; originalPrice: number } {
  let price = 0
  let originalPrice = 0

  if (product.defaultProductOption && product.optionPrices && product.optionPrices[product.defaultProductOption]) {
    const opt = product.optionPrices[product.defaultProductOption]!
    price = opt.price ?? 0
    originalPrice = opt.originalPrice ?? 0
  } else if (product.versions && product.versions.length > 0) {
    // lấy version rẻ nhất làm mặc định khi không có option
    const min = Math.min(...product.versions.map(v => v.price))
    price = isFinite(min) ? min : (product.price ?? 0)
    // tìm original tương ứng nếu có
    const ver = product.versions.find(v => v.price === price)
    originalPrice = ver?.originalPrice ?? (product.originalPrice ?? 0)
  } else {
    price = product.price ?? 0
    originalPrice = product.originalPrice ?? 0
  }

  if (!originalPrice || originalPrice <= price) {
    originalPrice = price * 5
  }

  return { price, originalPrice }
}

// Tính giá rẻ nhất trong toàn bộ versions/optionPrices/price
export function getCheapestPrice(product: PriceableProduct): number {
  // ưu tiên option mặc định nếu có
  if (product.defaultProductOption && product.optionPrices && product.optionPrices[product.defaultProductOption]) {
    return product.optionPrices[product.defaultProductOption]!.price ?? 0
  }

  let minPrice = Number.POSITIVE_INFINITY

  if (product.versions && product.versions.length > 0) {
    for (const v of product.versions) {
      if (typeof v.price === 'number' && v.price < minPrice) minPrice = v.price
    }
  }

  if (product.optionPrices && Object.keys(product.optionPrices).length > 0) {
    for (const key of Object.keys(product.optionPrices)) {
      const p = product.optionPrices[key]?.price
      if (typeof p === 'number' && p < minPrice) minPrice = p
    }
  }

  if (typeof product.price === 'number' && product.price < minPrice) minPrice = product.price

  return isFinite(minPrice) ? minPrice : 0
}

// Lấy originalPrice ứng với cheapest price (nếu không xác định, trả về 5x cheapest)
export function getOriginalOfCheapest(product: PriceableProduct): number {
  const cheapest = getCheapestPrice(product)

  if (product.versions && product.versions.length > 0) {
    const ver = product.versions.find(v => v.price === cheapest)
    if (ver) return ver.originalPrice
  }

  if (product.optionPrices && Object.keys(product.optionPrices).length > 0) {
    for (const key of Object.keys(product.optionPrices)) {
      const opt = product.optionPrices[key]
      if (opt?.price === cheapest) return opt.originalPrice ?? cheapest * 5
    }
  }

  return product.originalPrice ?? cheapest * 5
}

