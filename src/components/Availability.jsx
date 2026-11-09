import React from 'react';
import { Truck } from 'lucide-react';
import { AVAILABILITY, deliveryLabel, effectiveAvailability } from '../commerce.js';

export default function Availability({product,compact=false}) {
  const state = effectiveAvailability(product);
  return <div className={`availability-info ${state} ${compact?'compact':''}`}>
    <span className="availability-badge"><i/>{AVAILABILITY[state].label}{state==='stocked'&&!compact&&<small> · {product.stock} {product.stock===1?'unidad':'unidades'}</small>}</span>
    <span className="delivery-label"><Truck size={14}/>{deliveryLabel(product)}</span>
  </div>;
}
