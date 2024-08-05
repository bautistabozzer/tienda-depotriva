document.addEventListener('DOMContentLoaded', () => {
    const cartIcon = document.getElementById('cart-icon');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartButton = document.getElementById('close-cart');
    const cartOverlay = document.getElementById('cart-overlay');

    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('open');
    });

    closeCartButton.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('open');
    });

    cartOverlay.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('open');
    });

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
        if (cart[index].quantity < cart[index].stock) {
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

    renderCart(); 
});
