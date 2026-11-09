import React, { useState } from 'react';
import { Package, Clock3, CircleSlash, ShoppingBag, ArrowUpRight, Save, Eye, CheckCircle2, Truck, Pencil } from 'lucide-react';
import { AVAILABILITY, effectiveAvailability, normalizeProduct, publicationIssue } from '../commerce.js';
import Availability from './Availability.jsx';

const CATS=['Pintura','Detallado','Carrocería','Consumibles','Mecánica','Equipo mayor'];
const money=n=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:2,minimumFractionDigits:Number.isInteger(Number(n||0))?0:2}).format(n||0);

export default function ProductEditor({p,onClose,onSave,Modal}){
  const [draft,setDraft]=useState(()=>normalizeProduct(p));
  const [error,setError]=useState('');
  const [mobilePreview,setMobilePreview]=useState(false);
  const change=(k,v)=>{setDraft(p=>({...p,[k]:v}));setError('')};
  const state=effectiveAvailability(draft);
  const submit=e=>{e.preventDefault();const issue=publicationIssue(draft);if(issue){setError(issue);setMobilePreview(false);return}onSave(draft)};
  return <Modal title="Editar producto" onClose={onClose} wide>
    <form className="product-editor editor-live" onSubmit={submit}>
      <div className="editor-heading"><p className="eyebrow">TÚ DECIDES. TU CLIENTE LO VE.</p><h2>{p.name?'Administra tu producto.':'Crea tu próximo producto.'}</h2><p>Cambia el precio, la disponibilidad o la entrega. Comprueba el resultado en la vista previa.</p></div>
      <div className="editor-mobile-tabs"><button type="button" className={!mobilePreview?'active':''} onClick={()=>setMobilePreview(false)}><Pencil size={15}/> Editar producto</button><button type="button" className={mobilePreview?'active':''} onClick={()=>setMobilePreview(true)}><Eye size={15}/> Vista cliente en vivo</button></div>
      <div className={`editor-live-grid ${mobilePreview?'show-preview':''}`}>
        <div className="editor-fields">
          <section className="editor-section"><div className="editor-section-title"><span>01</span><h3>El producto y su precio</h3></div>
            <label>Nombre del producto<input required value={draft.name} onChange={e=>change('name',e.target.value)}/></label>
            <div className="form-row"><label>Marca<input required value={draft.brand} onChange={e=>change('brand',e.target.value)}/></label><label>Referencia / SKU<input value={draft.sku} onChange={e=>change('sku',e.target.value)}/></label></div>
            <div className="form-row"><label>Categoría<select value={draft.category} onChange={e=>change('category',e.target.value)}>{CATS.map(c=><option key={c}>{c}</option>)}</select></label><label>Precio MXN · IVA incluido<input type="number" min="0.01" step="0.01" disabled={draft.quote} value={draft.price??''} onChange={e=>change('price',e.target.value===''?null:Number(e.target.value))}/></label></div>
            <label className="check-label quote-toggle"><input type="checkbox" checked={draft.quote} onChange={e=>change('quote',e.target.checked)}/><span>Solo cotización<small>El cliente solicita asesoría; no paga en línea.</small></span></label>
          </section>
          <section className="editor-section"><div className="editor-section-title"><span>02</span><h3>Disponibilidad y entrega</h3></div>
            <fieldset className="availability-options"><legend>¿Cómo puedes entregar este producto?</legend>{Object.entries(AVAILABILITY).map(([value,meta])=>{const Icon=value==='stocked'?Package:value==='backorder'?Clock3:CircleSlash;return <label key={value} className={`availability-option ${draft.availability===value?'selected':''}`}><input type="radio" name="availability" value={value} checked={draft.availability===value} onChange={()=>change('availability',value)}/><Icon size={19}/><span><b>{meta.label}</b><small>{meta.description}</small></span><CheckCircle2 size={16} className="choice-check"/></label>})}</fieldset>
            <label>Unidades en stock<input type="number" min="0" step="1" disabled={draft.availability!=='stocked'} value={draft.stock} onChange={e=>change('stock',Math.max(0,Math.floor(Number(e.target.value))))}/><small className="field-hint">{draft.availability==='backorder'?'La compra sobre pedido no depende de esta cantidad.':draft.availability==='unavailable'?'El botón de compra quedará desactivado.':'La cantidad limita las unidades que se pueden comprar.'}</small></label>
            <div className="delivery-fieldset"><p><Truck size={16}/> Entrega estimada · días hábiles</p><div className="form-row"><label>Desde<input type="number" aria-label="Entrega mínima en días hábiles" min="1" max="365" step="1" disabled={draft.availability==='unavailable'} value={draft.deliveryMin} placeholder="Ej. 2" onChange={e=>change('deliveryMin',e.target.value===''?'':Number(e.target.value))}/></label><label>Hasta<input type="number" aria-label="Entrega máxima en días hábiles" min="1" max="365" step="1" disabled={draft.availability==='unavailable'} value={draft.deliveryMax} placeholder="Ej. 4" onChange={e=>change('deliveryMax',e.target.value===''?'':Number(e.target.value))}/></label></div><small className="field-hint">El cliente verá este plazo antes de comprar. {draft.quote?'Puedes dejarlo pendiente hasta cotizar.':'Los plazos de la demo son ilustrativos.'}</small></div>
          </section>
          <details className="editor-extra"><summary>Fotos y descripción <Pencil size={15}/></summary><label>URL de imagen<input value={draft.image} pattern="(https://.*|/assets/.*)" title="Usa una URL https:// o una ruta /assets/" onChange={e=>change('image',e.target.value)}/></label><label>Línea de producto<input value={draft.line} onChange={e=>change('line',e.target.value)}/></label><label>Descripción<textarea rows={4} value={draft.description} onChange={e=>change('description',e.target.value)}/></label></details>
          <label className="check-label publish-check"><input type="checkbox" checked={draft.published} onChange={e=>change('published',e.target.checked)}/><span>Publicar en la tienda<small>Los cambios se aplican al guardar. Desactívalo para conservar un borrador.</small></span></label>
          {error&&<p className="editor-error" role="alert">{error}</p>}
        </div>
        <aside className="live-preview" aria-label="Vista previa del cliente">
          <div className="preview-top"><span><Eye size={16}/> ASÍ LO VERÁ TU CLIENTE</span><b><i/> EN VIVO</b></div>
          <div className="preview-product"><div className="preview-image"><img src={draft.image||'/assets/logo.svg'} alt={draft.name||'Vista previa del producto'}/><span>{draft.category}</span></div><div className="preview-product-copy"><span className="product-brand">{draft.brand||'TU MARCA'}</span><h3>{draft.name||'Nombre de tu producto'}</h3><p className="preview-description">{draft.description||'La descripción de tu producto aparecerá aquí.'}</p><div className="preview-price">{draft.quote?'Cotización personalizada':draft.price?money(draft.price):'Precio por definir'}{!draft.quote&&draft.price>0&&<small>MXN · IVA incluido</small>}</div><Availability product={draft}/><span className={`preview-cta ${state==='unavailable'?'disabled':''}`}>{state==='unavailable'?'No disponible':draft.quote?'Solicitar cotización':state==='backorder'?'Comprar sobre pedido':'Agregar al carrito'}{draft.quote?<ArrowUpRight size={17}/>:<ShoppingBag size={17}/>}</span><p className="preview-demo-note">Precio, stock y entrega de demostración.</p></div></div>
          <div className="preview-explanation"><CheckCircle2 size={18}/><p>{draft.availability==='backorder'?'Sigues vendiendo sin stock inmediato. Tu cliente conoce el tiempo de espera.':draft.availability==='unavailable'?'El producto sigue visible, pero no se puede comprar hasta que lo reactives.':'Tu cliente conoce la disponibilidad y el plazo antes de comprar.'}</p></div>
          <span className={`preview-publication ${draft.published?'is-published':''}`}>{draft.published?'Se publicará al guardar.':'Borrador: todavía no será visible en la tienda.'}</span>
        </aside>
      </div>
      <div className="editor-footer"><span><span className="tiny muted">Los cambios están en vista previa.</span><button type="button" className="text-link" onClick={onClose}>Cancelar</button></span><button type="submit" className="btn orange" onClick={()=>setMobilePreview(false)}><Save size={17}/>{draft.published?'Guardar y publicar':'Guardar borrador'}</button></div>
    </form>
  </Modal>;
}
