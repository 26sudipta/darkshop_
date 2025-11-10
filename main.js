
fetch('https://fakestoreapi.com/products')
  .then(response => response.json())
  .then(data => {
    console.log(data);
    
    const productsDiv = document.getElementById('Products');
    data.map(product => {
      const card = `
        <div class="border border-green-500/30 p-4 rounded">
          <img src="${product.image}" alt="${product.title}" class="w-full h-48 object-contain">
          <h3 class="text-green-300">${product.title}</h3>
          <p class="text-green-400">$${product.price}</p>
          <p class="text-green-200">Rating: ${product.rating.rate}</p>
          <button class="bg-green-600 text-white px-4 py-2 rounded">Add to Cart</button>
        </div>
      `;
      productsDiv.innerHTML += card;
    });
  });
