// Cart array and balance
let cart = [];
let balance = parseFloat(localStorage.getItem('balance')) || 1000;

// Load balance from localStorage
document.getElementById('navTotal').textContent = '$' + balance.toFixed(2);

fetch('https://fakestoreapi.com/products')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    
    const productsDiv = document.getElementById('Products');
    data.map((product, index) => {
      const card = `
        <div class="border border-green-500/30 p-4 rounded" data-id="${product.id}" data-count="0">
          <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-contain">
          <h3 class="text-green-300">${product.title}</h3>
          <p class="text-green-400">$<span class="price">${product.price}</span></p>
          <p class="text-green-200">Rating: ${product.rating.rate}</p>
          <p class="text-green-300">Quantity: <span class="quantity">0</span></p>
          <div class="flex gap-2">
            <button onclick="addToCart(this)" class="bg-green-600 text-white px-4 py-2 rounded flex-1">Add to Cart</button>

            <button onclick="removeFromCart(this)" class="bg-red-600 text-white px-4 py-2 rounded flex-1 opacity-50 cursor-not-allowed" disabled id="removeBtn">Remove</button>
          </div>
        </div>
      `;
      productsDiv.innerHTML += card;
    });
  });

function addToCart(button) {
  const card = button.parentElement.parentElement;
  const productId = card.getAttribute('data-id');
  const title = card.querySelector('h3').textContent;
  const price = parseFloat(card.querySelector('.price').textContent);
  
  // Calculate current cart total
  const currentTotal = calculateCartTotal();
  
  // Check if adding this product exceeds balance
  if (currentTotal + price > balance) {
    alert('Insufficient balance! Please add money to continue shopping.');
    return;
  }
  
  // Find if product already in cart
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, title: title, price: price, quantity: 1 });
  }
  
  // Update UI
  let count = parseInt(card.getAttribute('data-count'));
  count += 1;
  card.setAttribute('data-count', count);
  card.querySelector('.quantity').textContent = count;
  
  const removeBtn = card.querySelector('#removeBtn');
  removeBtn.disabled = false;
  removeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  
  updateCartDisplay();
}

function removeFromCart(button) {
  const card = button.parentElement.parentElement;
  const productId = card.getAttribute('data-id');
  
  let count = parseInt(card.getAttribute('data-count'));
  if (count > 0) {
    // Find product in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity -= 1;
      
      // Remove from cart if quantity becomes 0
      if (existingItem.quantity === 0) {
        cart = cart.filter(item => item.id !== productId);
      }
    }
    
    // Update UI
    count -= 1;
    card.setAttribute('data-count', count);
    card.querySelector('.quantity').textContent = count;
    
    if (count === 0) {
      button.disabled = true;
      button.classList.add('opacity-50', 'cursor-not-allowed');
    }
    
    updateCartDisplay();
  }
}

function calculateCartTotal() {
  let total = 0;
  cart.forEach(item => {
    total += item.price * item.quantity;
  });
  return total;
}

function updateCartDisplay() {
  const subtotal = calculateCartTotal();
  document.getElementById('cartTotal').textContent = subtotal.toFixed(2);
  
  let totalProducts = 0;
  cart.forEach(item => {
    totalProducts += item.quantity;
  });
  document.getElementById('totalProducts').textContent = totalProducts;
  
  updateFinalTotal();
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
  
  if (finalTotal === 0) {
    alert('Your cart is empty!');
    return;
  }
  
  if (finalTotal > balance) {
    alert('Insufficient balance! Please add money.');
    return;
  }
  
  // Deduct from balance
  balance -= finalTotal;
  localStorage.setItem('balance', balance);
  document.getElementById('navTotal').textContent = '$' + balance.toFixed(2);
  
  // Clear cart array
  cart = [];
  
  // Reset all product quantities in UI
  const allCards = document.querySelectorAll('[data-id]');
  allCards.forEach(card => {
    card.setAttribute('data-count', '0');
    card.querySelector('.quantity').textContent = '0';
    const removeBtn = card.querySelector('#removeBtn');
    removeBtn.disabled = true;
    removeBtn.classList.add('opacity-50', 'cursor-not-allowed');
  });
  
  // Reset cart display
  document.getElementById('cartTotal').textContent = '0.00';
  document.getElementById('totalProducts').textContent = '0';
  document.getElementById('discount').textContent = '0.00';
  updateFinalTotal();
  
  alert('Purchase successful!');
}

function addMoney() {
  balance += 1000;
  localStorage.setItem('balance', balance);
  document.getElementById('navTotal').textContent = '$' + balance.toFixed(2);
  alert('$1000 added to your balance!');
}

// Reviews carousel
let currentSlide = 0;

fetch('review.json')
  .then(response => response.json())
  .then(reviews => {
    const slider = document.getElementById('reviewsSlider');
    
    reviews.forEach(review => {
      const reviewCard = `
        <div class="border border-green-500/30 p-4 rounded bg-neutral-900 min-w-[calc(33.333%-1rem)]">
          <h3 class="text-green-400 font-bold mb-2">${review.name}</h3>
          <p class="text-neutral-300 mb-2">${review.comment}</p>
          <p class="text-green-300">Rating: ${review.rating}/5</p>
          <p class="text-neutral-500 text-sm mt-2">${review.date}</p>
        </div>
      `;
      slider.innerHTML += reviewCard;
    });
    
    // Auto slide every 10 seconds
    setInterval(nextReview, 10000);
  });

function prevReview() {
  const slider = document.getElementById('reviewsSlider');
  const totalReviews = slider.children.length;
  const slidesToShow = 3;
  const maxSlide = Math.ceil(totalReviews / slidesToShow) - 1;
  
  currentSlide = (currentSlide - 1 + maxSlide + 1) % (maxSlide + 1);
  slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function nextReview() {
  const slider = document.getElementById('reviewsSlider');
  const totalReviews = slider.children.length;
  const slidesToShow = 3;
  const maxSlide = Math.ceil(totalReviews / slidesToShow) - 1;
  
  currentSlide = (currentSlide + 1) % (maxSlide + 1);
  slider.style.transform = `translateX(-${currentSlide * 100}%)`;
}
