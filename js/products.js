document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const categoryButtons = document.querySelectorAll('#category-list button');
    const placeholderImage = 'https://via.placeholder.com/300x300?text=No+Image';
    const finalizePurchaseButton = document.getElementById('finalize-purchase');

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

    const addToCart = (index) => {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products[index];
        

        if (product.stock <= 0) {
            alert('No hay suficiente stock disponible');
            return;
        }

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const cartItem = cart.find(item => item.name === product.name);
        if (cartItem) {
            if (cartItem.quantity >= product.stock) {
                alert('No hay suficiente stock disponible');
                return;
            } else {
                cartItem.quantity++;
            }
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    };

    const renderCart = () => {
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

    const decreaseQuantity = (index) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
        } else {
            cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    };

    const increaseQuantity = (index) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let products = JSON.parse(localStorage.getItem('products')) || [];
        const product = products.find(p => p.name === cart[index].name);
        if (cart[index].quantity < product.stock) {
            cart[index].quantity++;
        } else {
            alert('No hay suficiente stock disponible');
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    };

    const removeFromCart = (index) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    };

    const finalizePurchase = () => {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        const sales = JSON.parse(localStorage.getItem('sales')) || [];

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

        sales.push(saleDetails);

        localStorage.setItem('products', JSON.stringify(products));
        localStorage.setItem('sales', JSON.stringify(sales));
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        renderProducts();

        
        const paymentModal = document.getElementById('payment-modal');
        const modalContent = paymentModal.querySelector('.modal-content');
        modalContent.classList.add('finalize');
        setTimeout(() => {
            paymentModal.style.display = 'none';
            modalContent.classList.remove('finalize');
        }, 2000); 

        renderAnalytics(); // Llamar a esta función para actualizar los datos analíticos
    };

    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const category = e.target.getAttribute('data-category');
            renderProducts(category);
        });
    });

    finalizePurchaseButton.addEventListener('click', finalizePurchase);

    renderProducts();
    renderCart();
});
