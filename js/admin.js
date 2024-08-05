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
        const sales = JSON.parse(localStorage.getItem('sales')) || [];
        const products = JSON.parse(localStorage.getItem('products')) || [];

        let totalIncome = 0;
        let totalOrdersCount = sales.length;
        const categoryStock = {};

        salesList.innerHTML = '';
        stockSoldList.innerHTML = '';
        sales.forEach(sale => {
            // Verificar si la venta tiene items
            if (sale.items.length > 0) {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <h4>Compra #${sale.id}</h4>
                    <ul>
                        ${sale.items.map(item => `<li>${item.productName} - ${item.quantity} unidades - $${(item.price * item.quantity).toFixed(2)}</li>`).join('')}
                    </ul>
                `;
                salesList.appendChild(listItem);

                sale.items.forEach(item => {
                    totalIncome += item.price * item.quantity;

                    if (!categoryStock[item.category]) {
                        categoryStock[item.category] = 0;
                    }
                    categoryStock[item.category] += item.quantity;
                });
            }
        });

        incomeAmount.textContent = `$${totalIncome.toFixed(2)}`;
        totalOrders.textContent = totalOrdersCount;

        let stockSoldHtml = '';
        Object.keys(categoryStock).forEach(category => {
            stockSoldHtml += `${category}: ${categoryStock[category]}<br>`;
        });
        document.getElementById('stock-sold').innerHTML = stockSoldHtml;
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
