document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');
    const addProductButton = document.getElementById('nav-add-product');
    const analyticsButton = document.getElementById('nav-analytics');
    const updateStockButton = document.getElementById('nav-update-stock');
    const productModal = document.getElementById('product-modal');
    const productForm = document.getElementById('product-form');
    const cancelButton = document.getElementById('cancel');
    const toggleViewButton = document.getElementById('toggle-view');
    const adminSection = document.getElementById('admin-section');
    const analyticsSection = document.getElementById('analytics-section');
    const updateStockSection = document.getElementById('update-stock-section');
    const fileInput = document.getElementById('file-input');
    const csvPreview = document.getElementById('csv-preview');
    const dropArea = document.getElementById('drop-area');
    const selectFileButton = document.getElementById('select-file');
    const uploadFileButton = document.getElementById('upload-file');
    const clearSalesButton = document.getElementById('clear-sales');
    const clearZeroStockButton = document.getElementById('clear-zero-stock');
    const loadSampleStockButton = document.getElementById('load-sample-stock');
    const addProductUpdateStockButton = document.getElementById('add-product-update-stock');
    let editIndex = null;
    let selectedFile = null;

    const salesList = document.getElementById('sales-list');
    const incomeAmount = document.getElementById('income-amount');
    const totalOrders = document.getElementById('total-orders');
    const stockSoldList = document.getElementById('stock-sold');

    const renderProducts = () => {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        productGrid.innerHTML = '';
        products.forEach((product, index) => {
            const productCard = document.createElement('div');
            productCard.className = 'admin-product-card';
            const imageUrl = product.image ? product.image : 'https://via.placeholder.com/300x300?text=No+Image';
            productCard.innerHTML = `
                <img src="${imageUrl}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Precio: $${product.price}</p>
                <p>Stock: ${Math.max(0, product.stock)}</p>
                <p>${product.category}</p>
                <button data-index="${index}" class="edit-product">Editar</button>
                <button data-index="${index}" class="delete-product">Eliminar</button>
            `;
            productGrid.appendChild(productCard);
        });

        document.querySelectorAll('.edit-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                editIndex = e.target.getAttribute('data-index');
                openModal(products[editIndex]);
            });
        });

        document.querySelectorAll('.delete-product').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                deleteProduct(index);
            });
        });
    };

    const openModal = (product = null) => {
        productModal.style.display = 'flex';
        if (product) {
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-stock').value = product.stock;
            document.getElementById('product-category').value = product.category;
            document.getElementById('product-image').value = product.image;
        } else {
            productForm.reset();
        }
    };

    const closeModal = () => {
        productModal.style.display = 'none';
        editIndex = null;
    };

    const saveProduct = (e) => {
        e.preventDefault();
        const newProduct = {
            name: document.getElementById('product-name').value,
            price: document.getElementById('product-price').value,
            stock: document.getElementById('product-stock').value,
            category: document.getElementById('product-category').value,
            image: document.getElementById('product-image').value
        };

        let products = JSON.parse(localStorage.getItem('products')) || [];
        if (editIndex !== null) {
            products[editIndex] = newProduct;
        } else {
            products.push(newProduct);
        }
        localStorage.setItem('products', JSON.stringify(products));
        closeModal();
        renderProducts();
    };

    const deleteProduct = (index) => {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
    };

    const toggleSection = (section) => {
        adminSection.classList.add('hidden');
        analyticsSection.classList.add('hidden');
        updateStockSection.classList.add('hidden');
        section.classList.remove('hidden');
        if (section === analyticsSection) {
            renderAnalytics();
        }
    };

    const parseCSV = (csvText) => {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        const products = lines.slice(1).map(line => {
            const values = line.split(',').map(value => value.trim());
            let product = {};
            headers.forEach((header, index) => {
                product[header] = values[index];
            });
            return product;
        });
        return products;
    };

    const updateStock = (products) => {
        let existingProducts = JSON.parse(localStorage.getItem('products')) || [];
        products.forEach(newProduct => {
            const index = existingProducts.findIndex(product => product.name === newProduct.name);
            if (index !== -1) {
                existingProducts[index].stock = newProduct.stock;
            } else {
                existingProducts.push(newProduct);
            }
        });
        localStorage.setItem('products', JSON.stringify(existingProducts));
        renderProducts();
    };

    const showCSVPreview = (products) => {
        const tbody = csvPreview.querySelector('tbody');
        tbody.innerHTML = '';
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.stock}</td>
                <td>${product.category}</td>
                <td>${product.image}</td>
            `;
            tbody.appendChild(row);
        });
        csvPreview.classList.remove('hidden');
    };

    const renderAnalytics = () => {
        // Obtener los elementos de las tarjetas
        const totalProductsElement = document.getElementById('total-products');
        const inventoryValueElement = document.getElementById('inventory-value');
        const dailySalesElement = document.getElementById('daily-sales');
        const totalItemsSoldElement = document.getElementById('total-items-sold'); // Nuevo elemento para artículos vendidos
    
        // Verificar que los elementos existan
        if (!totalProductsElement || !inventoryValueElement || !dailySalesElement || !totalItemsSoldElement) {
            console.error("No se encontraron los elementos necesarios en el DOM.");
            return;
        }
    
        // Obtener ventas y productos desde localStorage
        const sales = JSON.parse(localStorage.getItem('sales')) || [];
        const products = JSON.parse(localStorage.getItem('products')) || [];
    
        // Cálculo del total de productos
        const totalProducts = products.length;
    
        // Cálculo del valor del inventario
        const inventoryValue = products.reduce((total, product) => total + product.price * product.stock, 0);
    
        // Cálculo de las ventas del día
        const dailySales = sales.reduce((total, sale) => {
            const saleDate = new Date(sale.date);
            const today = new Date();
            return saleDate.toDateString() === today.toDateString() ? total + sale.items.reduce((subTotal, item) => subTotal + item.price * item.quantity, 0) : total;
        }, 0);
    
        // Cálculo del total de artículos vendidos
        const totalItemsSold = sales.reduce((total, sale) => {
            return total + sale.items.reduce((itemTotal, item) => itemTotal + item.quantity, 0);
        }, 0);
    
        // Actualizar las tarjetas con los valores calculados
        totalProductsElement.textContent = totalProducts;
        inventoryValueElement.textContent = `$${inventoryValue.toFixed(2)}`;
        dailySalesElement.textContent = `$${dailySales.toFixed(2)}`;
        totalItemsSoldElement.textContent = totalItemsSold; // Actualizar el valor de la nueva tarjeta
    
        // Consola para depuración
        console.log("Total de Productos:", totalProducts);
        console.log("Valor del Inventario:", inventoryValue);
        console.log("Ventas del Día:", dailySales);
        console.log("Artículos Vendidos:", totalItemsSold);
    };
    
    
    

    const clearSales = () => {
        localStorage.removeItem('sales');
        renderAnalytics();
        alert('Últimas ventas eliminadas');
    };

    const clearZeroStockProducts = () => {
        let products = JSON.parse(localStorage.getItem('products')) || [];
        products = products.filter(product => product.stock > 0);
        localStorage.setItem('products', JSON.stringify(products));
        renderProducts();
        alert('Productos sin stock eliminados');
    };

    addProductButton.addEventListener('click', () => {
        toggleSection(adminSection);
    });
    analyticsButton.addEventListener('click', () => {
        toggleSection(analyticsSection);
    });
    updateStockButton.addEventListener('click', () => {
        toggleSection(updateStockSection);
    });
    cancelButton.addEventListener('click', closeModal);
    productForm.addEventListener('submit', saveProduct);

    selectFileButton.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const csvText = event.target.result;
                const products = parseCSV(csvText);
                showCSVPreview(products);
            };
            reader.readAsText(selectedFile);
        }
    });

    uploadFileButton.addEventListener('click', () => {
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const csvText = event.target.result;
                const products = parseCSV(csvText);
                updateStock(products);
                alert('Stock actualizado');
                selectedFile = null;
                csvPreview.classList.add('hidden');
                fileInput.value = '';
            };
            reader.readAsText(selectedFile);
        } else {
            alert('Por favor selecciona un archivo CSV');
        }
    });

    clearSalesButton.addEventListener('click', clearSales);
    clearZeroStockButton.addEventListener('click', clearZeroStockProducts);

    toggleViewButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    addProductUpdateStockButton.addEventListener('click', () => {
        openModal(); 
    });

    loadSampleStockButton.addEventListener('click', () => {
        fetch('products.csv')
            .then(response => response.text())
            .then(data => {
                const products = parseCSV(data);
                updateStock(products);
                alert('Stock de prueba cargado');
            })
            .catch(error => console.error('Error loading sample stock:', error));
    });

    renderProducts();
});
