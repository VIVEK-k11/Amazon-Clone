import {cart} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';

export function renderPaymentSummary(){
let productPriceCents=0;
let ShippingPriceCents =0;
cart.forEach((cartItem) => {

let product = getProduct(cartItem.productId);
productPriceCents += product.priceCents * cartItem.quantity;

let deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

ShippingPriceCents += deliveryOption.priceCents;



});
let priceCentsBeforeTax = productPriceCents + ShippingPriceCents;
let priceCentsTax = priceCentsBeforeTax * 0.1;
let priceCentsAfterTax = priceCentsBeforeTax + priceCentsTax;

const paymentSummaryHTML = 
`
 <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (3):</div>
            <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">$${formatCurrency(ShippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$${formatCurrency(priceCentsBeforeTax)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$${formatCurrency(priceCentsTax)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$${formatCurrency(priceCentsAfterTax)}</div>
          </div>

          <button class="place-order-button button-primary">
            Place your order
          </button>
`
document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
}