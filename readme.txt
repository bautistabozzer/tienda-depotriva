
## Descripción de Archivos

### HTML
- **index.html**: Página principal de la tienda deportiva donde los clientes pueden ver productos, agregar productos al carrito y finalizar compras.
- **admin.html**: Página de administración donde el administrador puede gestionar productos, ver analíticas de negocio y actualizar stock.
- **login.html**: Página de inicio de sesión para el administrador.
- **template.csv**: Archivo de plantilla CSV para actualizar el stock de productos.

### CSS
- **css/styles.css**: Archivo de estilos CSS para dar formato y diseño a las páginas del proyecto.

### JavaScript
- **js/admin.js**: Maneja todas las funcionalidades de la página de administración, incluyendo la gestión de productos, visualización de analíticas y actualización de stock.
- **js/cart.js**: Gestiona las funcionalidades del carrito de compras en la página principal.
- **js/common.js**: Contiene funciones comunes que se utilizan en varias partes del proyecto.
- **js/payment.js**: Maneja el proceso de pago y finalización de compra.
- **js/products.js**: Gestiona la visualización y filtrado de productos en la página principal.
- **js/login.js**: Maneja el proceso de inicio de sesión del administrador.

## Funcionalidades

### Cliente
- **Visualización de Productos**: Los clientes pueden ver una lista de productos disponibles categorizados.
- **Agregar al Carrito**: Los clientes pueden agregar productos al carrito de compras.
- **Finalizar Compra**: Los clientes pueden proceder al pago y finalizar la compra. El stock se actualiza automáticamente.

### Administrador
- **Gestión de Productos**: El administrador puede agregar, editar y eliminar productos.
- **Analíticas del Negocio**: Visualización de órdenes totales, ingresos y stock vendido. También muestra una lista de las últimas ventas.
- **Actualizar Stock**: El administrador puede actualizar el stock mediante la carga de un archivo CSV. También puede cargar un stock de prueba usando el archivo `products(1).csv`.
- **Eliminar Últimas Ventas**: El administrador puede eliminar los registros de ventas recientes.
- **Limpiar Productos Sin Stock**: El administrador puede eliminar productos que ya no tienen stock disponible.

## Uso

1. **Inicio de Sesión**: El administrador inicia sesión desde `login.html`.
2. **Gestión de Productos**: Desde `admin.html`, el administrador puede gestionar los productos, ver analíticas y actualizar el stock.
3. **Tienda para Clientes**: Los clientes pueden navegar por los productos, agregar productos al carrito y realizar compras desde `index.html`.

## Instalación

1. Clonar el repositorio.
2. Abrir los archivos HTML en un navegador web.
3. Asegurarse de tener los archivos CSS y JS correctamente vinculados.

Este proyecto es una demostración simple de una tienda en línea con funcionalidades básicas de gestión y compra.
