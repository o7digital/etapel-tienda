export const AVAILABILITY = {
  stocked: { label: 'En stock', description: 'Vende hasta agotar tus existencias.' },
  backorder: { label: 'Sobre pedido', description: 'Acepta pedidos aunque el stock sea cero.' },
  unavailable: { label: 'No disponible', description: 'Muestra el producto y desactiva la compra.' },
};

export function normalizeProduct(product) {
  const availability = AVAILABILITY[product.availability] ? product.availability : product.quote ? 'backorder' : product.stock > 0 ? 'stocked' : 'unavailable';
  return { ...product, availability, deliveryMin: product.deliveryMin ?? '', deliveryMax: product.deliveryMax ?? '' };
}

export function effectiveAvailability(product) {
  const state = normalizeProduct(product).availability;
  return state === 'stocked' && !(product.stock > 0) ? 'unavailable' : state;
}

export function deliveryLabel(product) {
  if (effectiveAvailability(product) === 'unavailable') return 'Sin fecha de entrega';
  const min = Number(product.deliveryMin), max = Number(product.deliveryMax);
  if (!Number.isInteger(min) || !Number.isInteger(max) || min < 1 || max < min) return 'Entrega por confirmar';
  return `Entrega estimada: ${min === max ? min : `${min}–${max}`} ${max === 1 ? 'día hábil' : 'días hábiles'}`;
}

export function purchaseIssue(product, qty = 1) {
  if (!product || !product.published) return 'El producto ya no está publicado.';
  if (effectiveAvailability(product) === 'unavailable') return 'Este producto no está disponible.';
  if (product.quote) return 'Este producto requiere una cotización.';
  if (!Number.isFinite(product.price) || product.price <= 0) return 'El precio está por confirmar.';
  if (!Number.isInteger(qty) || qty < 1 || qty > 99) return 'Elige entre 1 y 99 unidades.';
  if (effectiveAvailability(product) === 'stocked' && qty > product.stock) return `Solo hay ${product.stock} unidades disponibles.`;
  return '';
}

export function publicationIssue(product) {
  if (!product.name.trim()) return 'Escribe el nombre del producto.';
  if (!product.published) return '';
  if (!product.quote && (!Number.isFinite(product.price) || product.price <= 0)) return 'Añade un precio válido o activa la venta por cotización.';
  if (product.availability === 'stocked' && (!Number.isInteger(product.stock) || product.stock < 1)) return 'Para publicar «En stock», indica al menos una unidad o elige otra disponibilidad.';
  if (!product.quote && effectiveAvailability(product) !== 'unavailable') {
    const min = Number(product.deliveryMin), max = Number(product.deliveryMax);
    if (!Number.isInteger(min) || !Number.isInteger(max) || min < 1 || max < min || max > 365) return 'Define un plazo de entrega válido: de 1 a 365 días hábiles, con máximo igual o mayor al mínimo.';
  }
  return '';
}
