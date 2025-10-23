async function loadProducts() {
  try {
    const response = await fetch('/data/products.json');
    const products = await response.json();

    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';

    products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('card');

      card.innerHTML = `
        <img src="/${product.image}" alt="${product.name}" class="product-image" />
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <span class="price">$${product.price.toFixed(2)}</span>
        <button class="buy-btn">Add to Cart</button>
      `;

      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading products:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadProducts);
