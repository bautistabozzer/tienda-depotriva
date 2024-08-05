document.addEventListener('DOMContentLoaded', () => {
    const checkoutButton = document.getElementById('checkout');
    const paymentModal = document.getElementById('payment-modal');
    const finalizeButton = document.getElementById('finalize-purchase');

    checkoutButton.addEventListener('click', () => {
        paymentModal.style.display = 'flex';
    });

    finalizeButton.addEventListener('click', finalizePurchase);

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', (event) => {
        if (event.target === paymentModal) {
            paymentModal.style.display = 'none';
        }
    });
});

// Función para finalizar la compra y cambiar el color del modal
const finalizePurchase = () => {
    console.log("Finalizando compra...");

    let products = JSON.parse(localStorage.getItem('products')) || [];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const sales = JSON.parse(localStorage.getItem('sales')) || [];

    // Verificar si el carrito no está vacío
    if (cart.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    const saleId = `sale-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const saleDetails = {
        id: saleId,
        items: [],
        date: new Date().toISOString()
    };

    cart.forEach(cartItem => {
        const productIndex = products.findIndex(product => product.name === cartItem.name);
        if (productIndex !== -1) {
            products[productIndex].stock = Math.max(0, products[productIndex].stock - cartItem.quantity);
            saleDetails.items.push({
                productName: cartItem.name,
                quantity: cartItem.quantity,
                price: cartItem.price,
                category: cartItem.category
            });
        }
    });

    // Solo agregar la venta si tiene al menos un item
    if (saleDetails.items.length > 0) {
        sales.push(saleDetails);
        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('sales', JSON.stringify(sales));
        localStorage.setItem('cart', JSON.stringify([])); // Limpiar el carrito
        renderCart();
        renderProducts();

        // Mostrar el modal y cambiar el color a verde
        const paymentModal = document.getElementById('payment-modal');
        const modalContent = paymentModal.querySelector('.modal-content');
        modalContent.classList.add('finalize');
        setTimeout(() => {
            paymentModal.style.display = 'none';
            modalContent.classList.remove('finalize');
        }, 2000); // Ocultar el modal después de 2 segundos

        console.log("Compra finalizada:", saleDetails);
        renderAnalytics(); // Llamar a esta función para actualizar los datos analíticos
    } else {
        console.log("No se registró la compra porque el carrito está vacío.");
    }
};

const renderCart = () => {
    console.log("Renderizando carrito...");
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.getElementById('cart-list');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');

    cartList.innerHTML = '';
    let total = 0;
    cart.forEach((product, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            ${product.name} - $${product.price} x ${product.quantity}
            <div class="cart-item-controls">
                <button data-index="${index}" class="decrease-quantity">-</button>
                <span>${product.quantity}</span>
                <button data-index="${index}" class="increase-quantity">+</button>
                <button data-index="${index}" class="remove-item">🗑️</button>
            </div>
        `;
        cartList.appendChild(listItem);
        total += parseFloat(product.price) * product.quantity;
    });

    cartTotal.textContent = `Subtotal: $${total.toFixed(2)}`;
    cartCount.textContent = cart.reduce((acc, product) => acc + product.quantity, 0);

    document.querySelectorAll('.decrease-quantity').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            decreaseQuantity(index);
        });
    });

    document.querySelectorAll('.increase-quantity').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            increaseQuantity(index);
        });
    });

    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            removeFromCart(index);
        });
    });
};

const renderProducts = () => {
    console.log("Renderizando productos...");
    const productGrid = document.getElementById('product-grid');
    const categoryButtons = document.querySelectorAll('#category-list button');
    const placeholderImage = 'https://via.placeholder.com/300x300?text=No+Image'; // URL de imagen de marcador de posición

    const renderProducts = (category = null) => {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        productGrid.innerHTML = '';
        products.forEach((product, index) => {
            if (category && product.category !== category) {
                return;
            }
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            const imageUrl = product.image ? product.image : placeholderImage;
            productCard.innerHTML = `
                <img src="${imageUrl}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Precio: $${product.price}</p>
                <button data-index="${index}" ${product.stock <= 0 ? 'disabled' : ''}>Agregar al Carrito</button>
            `;
            productGrid.appendChild(productCard);
        });

        document.querySelectorAll('.product-card button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                addToCart(index);
            });
        });
    };

    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.getAttribute('data-category');
            renderProducts(category);
        });
    });

    renderProducts();
};

const renderAnalytics = () => {
    console.log("Renderizando analíticas...");
    const sales = JSON.parse(localStorage.getItem('sales')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const totalOrders = sales.length;
    const incomeAmount = sales.reduce((total, sale) => total + sale.items.reduce((subtotal, item) => subtotal + (item.price * item.quantity), 0), 0);
    const stockSold = sales.reduce((total, sale) => {
        sale.items.forEach(item => {
            total[item.category] = (total[item.category] || 0) + item.quantity;
        });
        return total;
    }, {});

    const totalOrdersElement = document.getElementById('total-orders');
    const incomeAmountElement = document.getElementById('income-amount');
    const stockSoldElement = document.getElementById('stock-sold');
    const salesListElement = document.getElementById('sales-list');

    if (!totalOrdersElement || !incomeAmountElement || !stockSoldElement || !salesListElement) {
        console.error("Error: No se encontraron todos los elementos necesarios en el DOM.");
        return;
    }

    totalOrdersElement.textContent = totalOrders;
    incomeAmountElement.textContent = `$${incomeAmount.toFixed(2)}`;
    stockSoldElement.innerHTML = Object.entries(stockSold).map(([category, quantity]) => `${category}: ${quantity}`).join('<br>');

    salesListElement.innerHTML = '';
    sales.forEach(sale => {
        const saleItem = document.createElement('li');
        saleItem.innerHTML = `
            <h4>Compra #${sale.id}</h4>
            <ul>
                ${sale.items.map(item => `<li>${item.productName} - ${item.quantity} unidades - $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
            </ul>
        `;
        salesListElement.appendChild(saleItem);
    });
};


document.getElementById('finalize-purchase').addEventListener('click', finalizePurchase);
