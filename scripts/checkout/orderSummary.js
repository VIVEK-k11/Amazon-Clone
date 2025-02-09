import {cart, removeFromCart, updateDeliveryOption} from '../../data/cart.js';
import {products, getProduct} from '../../data/products.js';
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import {deliveryOptions, getDeliveryOption} from '../../data/deliveryOptions.js';
import { formatCurrency } from '../utils/money.js';
import { renderPaymentSummary } from './paymentSummary.js';

export function renderOrderSummary(){

  //GENERATING ORDER SUMMARY HTML
let cartSummaryHTML ='';
cart.forEach((cartItem) => {
  let productId = cartItem.productId;
  let matchingProduct= getProduct(productId);

  const deliveryOptionId = cartItem.deliveryOptionId;
  let deliveryOption= getDeliveryOption(deliveryOptionId);
  
  let today = dayjs();
  let deliveryDate = today.add(deliveryOption.deliveryDays,'days');
  let dateString = deliveryDate.format('dddd, MMMM D');

  cartSummaryHTML = cartSummaryHTML + 
  `
  <div class="cart-item-container js-cart-item-container-${matchingProduct.id}" >
            <div class="delivery-date">
             Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                ${matchingProduct.name}
                </div>
                <div class="product-price">
                 $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary">
                    Update
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(matchingProduct,cartItem)}

              </div>
            </div>
          </div>
  `;
});

// GENERATING OPTIONS HTML
function deliveryOptionsHTML(matchingProduct,cartItem){
  let optionhtml='';
  deliveryOptions.forEach((deliveryOption) => {
    let today = dayjs();
    let deliveryDate = today.add(deliveryOption.deliveryDays,'days');
    let dateString = deliveryDate.format('dddd, MMMM D');
    let priceString = deliveryOption.priceCents === 0 ? 'FREE' : `${(deliveryOption.priceCents/100).toFixed(2)} -`;
    let isChecked = deliveryOption.id === cartItem.deliveryOptionId;
     optionhtml = optionhtml + `
     <div class="delivery-option js-delivery-option" 
           data-product-id="${matchingProduct.id}"
           data-delivery-option-id="${deliveryOption.id}"
     >
                  <input type="radio" ${isChecked ?'checked' : ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      ${dateString}
                    </div>
                    <div class="delivery-option-price">
                      $${priceString} Shipping
                    </div>
                  </div>
                </div>
     `;
  });
  return optionhtml;
}

//
document.querySelector('.order-summary').innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link').forEach((link) => {
link.addEventListener('click',()=>{
  let productId = link.dataset.productId;
    removeFromCart(productId);
    
    let container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.remove();
    renderPaymentSummary();
});

});    



document.querySelectorAll('.js-delivery-option').forEach((element) =>{
element.addEventListener('click',() =>{
  let productId = element.dataset.productId ;
  let deliveryOptionId = element.dataset.deliveryOptionId;
  console.log(productId);
  console.log(deliveryOptionId);
  updateDeliveryOption(productId, deliveryOptionId);
  renderOrderSummary();
  renderPaymentSummary();
});
  
});

}

