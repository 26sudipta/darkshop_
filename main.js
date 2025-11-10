
fetch('https://fakestoreapi.com/products')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    
    const productsDiv = document.getElementById('Products');
    data.map(product => {
      const card = `
        <div class="border border-green-500/30 p-4 rounded" data-count="0">
          <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-contain">
          <h3 class="text-green-300">${product.title}</h3>
          <p class="text-green-400">$<span class="price">${product.price}</span></p>
          <p class="text-green-200">Rating: ${product.rating.rate}</p>
          <p class="text-green-300">Quantity: <span class="quantity">0</span></p>
          <div class="flex gap-2">
            <button onclick="addToCart(this)" class="bg-green-600 text-white px-4 py-2 rounded flex-1">Add to Cart</button>
            <button onclick="removeFromCart(this)" class="bg-red-600 text-white px-4 py-2 rounded flex-1 opacity-50 cursor-not-allowed" disabled>Remove</button>
          </div>
        </div>
      `;
      productsDiv.innerHTML += card;
    });
  });

function addToCart(button) {
  const card = button.parentElement.parentElement;
  const title = card.querySelector('h3').textContent;
  const price = card.querySelector('.price').textContent;
  
  let count = parseInt(card.getAttribute('data-count'));
  count += 1;
  card.setAttribute('data-count', count);
  card.querySelector('.quantity').textContent = count;
  
  const removeBtn = card.querySelectorAll('button')[1];
  removeBtn.disabled = false;
  removeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  
  const priceValue = parseFloat(price);
  const currentTotal = parseFloat(document.getElementById('cartTotal').textContent);
  const newTotal = currentTotal + priceValue;
  document.getElementById('cartTotal').textContent = newTotal.toFixed(2);
  
  const totalProducts = parseInt(document.getElementById('totalProducts').textContent);
  document.getElementById('totalProducts').textContent = totalProducts + 1;
  
  updateFinalTotal();
}

function removeFromCart(button) {
  const card = button.parentElement.parentElement;
  const price = card.querySelector('.price').textContent;
  
  let count = parseInt(card.getAttribute('data-count'));
  if (count > 0) {
    count -= 1;
    card.setAttribute('data-count', count);
    card.querySelector('.quantity').textContent = count;
    
    if (count === 0) {
      button.disabled = true;
      button.classList.add('opacity-50', 'cursor-not-allowed');
    }
    
    const priceValue = parseFloat(price);
    const currentTotal = parseFloat(document.getElementById('cartTotal').textContent);
    const newTotal = currentTotal - priceValue;
    document.getElementById('cartTotal').textContent = newTotal.toFixed(2);
    
    const totalProducts = parseInt(document.getElementById('totalProducts').textContent);
    document.getElementById('totalProducts').textContent = totalProducts - 1;
    
    updateFinalTotal();
  }
}

function updateFinalTotal() {
  const subtotal = parseFloat(document.getElementById('cartTotal').textContent);
  const delivery = parseFloat(document.getElementById('deliveryCharge').textContent);
  const discount = parseFloat(document.getElementById('discount').textContent);
  
  const finalTotal = subtotal + delivery - discount;
  document.getElementById('finalTotal').textContent = finalTotal.toFixed(2);
}

function applyCoupon() {
  const couponCode = document.getElementById('couponInput').value;
  const subtotal = parseFloat(document.getElementById('cartTotal').textContent);
  
  if (couponCode === 'SMART10') {
    const discountAmount = subtotal * 0.10;
    document.getElementById('discount').textContent = discountAmount.toFixed(2);
    updateFinalTotal();
    alert('Coupon applied! 10% discount');
  } else {
    alert('Invalid coupon');
  }
}

function buyNow() {
  const finalTotal = parseFloat(document.getElementById('finalTotal').textContent);
  const navTotal = parseFloat(document.getElementById('navTotal').textContent.replace('$', ''));
  
  const newNavTotal = navTotal - finalTotal;
  document.getElementById('navTotal').textContent = '$' + newNavTotal.toFixed(2);
  
  alert('Purchase successful!');
}
