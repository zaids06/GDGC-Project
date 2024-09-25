const apiUrl = "https://fakestoreapi.com/products";
let currentIndex = 0;
const itemsPerPage = 4;
let products = [];

async function fetchProducts() {
    try {
        const response = await fetch(apiUrl);
        products = await response.json();
        displayProducts(products.slice(currentIndex, currentIndex + itemsPerPage));
        currentIndex += itemsPerPage;
        if (currentIndex >= products.length) {
            document.getElementById('show-more-btn').style.display = 'none';
        }
    } catch (error) {
        console.error("Error fetching products:", error);
    }
}

function displayProducts(productsToDisplay) {
    const productGrid = document.querySelector('.product-grid');
    productsToDisplay.forEach(product => {
        const productItem = document.createElement('div');
        productItem.classList.add('product-item');
        productItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p>⭐Rating: ${product.rating.rate} (${product.rating.count} reviews)</p>
            <p>₹${product.price}</p>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id}, '${product.title}', ${product.price}, '${product.image}')">Add to Cart</button>
        `;
        productGrid.appendChild(productItem);
    });
}

fetchProducts();
let cart = [];

function addToCart(id, title, price, image) {
    const existingProduct = cart.find(item => item.id === id);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id, title, price, image, quantity: 1 });
    }
    updateCart();
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
}

function updateCart() {
    const cartItemsSection = document.querySelector('.cart-items-section');
    cartItemsSection.innerHTML = '';
    let totalMRP = 0;

    cart.forEach(item => {
        totalMRP += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img class="product-img" src="${item.image}" alt="${item.title}">
            <div class="product-details">
                <h3>${item.title}</h3>
                <p>₹${item.price} x ${item.quantity}</p>
            </div>
            <div class="quantity-control">
                <button class="quantity-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
                <button class="remove-item-btn" onclick="removeFromCart(${item.id})">×</button>
            </div>
        `;
        cartItemsSection.appendChild(cartItem);
    });

    updatePriceDetails(totalMRP);
}

function updatePriceDetails(totalMRP) {
    const totalAmountElement = document.querySelector('.price-details-section h3 span');
    totalAmountElement.innerText = totalMRP;
    const placeOrderButton = document.querySelector('.place-order-btn');
    placeOrderButton.disabled = totalMRP === 0;
}

updatePriceDetails(0);

function changeQuantity(id, delta) {
    const product = cart.find(item => item.id === id);
    if (product) {
        product.quantity += delta;
        if (product.quantity <= 0) {
            removeFromCart(id);
        } else {
            updateCart();
        }
    }
}

document.getElementById('show-more-btn').addEventListener('click', fetchProducts);

fetchProducts();
