import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeProduct, purchaseIssue, publicationIssue, deliveryLabel, effectiveAvailability } from '../src/commerce.js';

const product={name:'Test',published:true,quote:false,price:1200,stock:3,availability:'stocked',deliveryMin:2,deliveryMax:4};
test('Stock limits apply to stocked products, while backorders can sell at zero stock',()=>{
  assert.equal(purchaseIssue(product,3),'');
  assert.ok(purchaseIssue(product,4));
  assert.equal(purchaseIssue({...product,stock:0,availability:'backorder'},4),'');
  assert.ok(purchaseIssue({...product,stock:0},1));
  assert.equal(effectiveAvailability({...product,stock:0}),'unavailable');
});
test('A product already in the cart cannot be purchased after it is disabled, unpublished or changed to quote',()=>{
  for(const change of [{availability:'unavailable'},{published:false},{quote:true}]) assert.ok(purchaseIssue({...product,...change},1));
});
test('Publishing requires coherent delivery and stock; incomplete drafts remain editable',()=>{
  assert.equal(publicationIssue(product),'');
  assert.ok(publicationIssue({...product,deliveryMin:9,deliveryMax:2}));
  assert.ok(publicationIssue({...product,stock:0}));
  assert.equal(publicationIssue({...product,availability:'backorder',stock:0}),'');
  assert.equal(publicationIssue({...product,published:false,price:null,deliveryMin:'',deliveryMax:''}),'');
});
test('Delivery is shown accurately, and unavailable products have no delivery promise',()=>{
  assert.equal(deliveryLabel(product),'Entrega estimada: 2–4 días hábiles');
  assert.equal(deliveryLabel({...product,deliveryMin:1,deliveryMax:1}),'Entrega estimada: 1 día hábil');
  assert.equal(deliveryLabel({...product,availability:'unavailable'}),'Sin fecha de entrega');
  assert.equal(deliveryLabel({...product,deliveryMin:'',deliveryMax:''}),'Entrega por confirmar');
});
test('Older saved products gain availability fields without overwriting prior edits or inventing delivery',()=>{
  const legacy={name:'Custom',price:17100,stock:8,quote:false};
  assert.deepEqual(normalizeProduct(legacy),{...legacy,availability:'stocked',deliveryMin:'',deliveryMax:''});
  assert.equal(normalizeProduct({...legacy,quote:true,stock:0}).availability,'backorder');
});
