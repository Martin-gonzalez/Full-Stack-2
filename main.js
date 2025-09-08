(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);
    
    
    // inicializa el wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.nav-bar').addClass('sticky-top', 'shadow-sm');
        } else {
            $('.nav-bar').removeClass('sticky-top', 'shadow-sm');
        }
    });


    // Hero Header carousel
    $(".header-carousel").owlCarousel({
        items: 1,
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: false,
        loop: true,
        margin: 0,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ]
    });


    // lista de categorias carousel
    $(".productList-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 2000,
        dots: false,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="fas fa-chevron-left"></i>',
            '<i class="fas fa-chevron-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:2
            },
            1200:{
                items:3
            }
        }
    });

    // lista de categorias carousel
    $(".productImg-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: false,
        loop: true,
        items: 1,
        margin: 25,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ]
    });


    // producto solo carousel
    $(".single-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: true,
        dotsData: true,
        loop: true,
        items: 1,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ]
    });


    // lista de productos carousel
    $(".related-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        dots: false,
        loop: true,
        margin: 25,
        nav : true,
        navText : [
            '<i class="fas fa-chevron-left"></i>',
            '<i class="fas fa-chevron-right"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            },
            1200:{
                items:4
            }
        }
    });

    //para la página de producto individual
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        var newVal;
        if (button.hasClass('btn-plus')) {
            newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 1) { // Evita que baje de 1
                newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 1;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });
    
   // vuele al top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });

})(jQuery);

// Se asegura de que el script se ejecute solo después de que toda la página se haya cargado.
document.addEventListener('DOMContentLoaded', () => {
    
    // Carga el carrito desde localStorage. Si no hay nada, devuelve un array vacío.
    const loadCart = () => JSON.parse(localStorage.getItem('cart')) || [];

    // Guarda el carrito en localStorage.
    const saveCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));

    // Formatea un número al formato de peso chileno (CLP).
    const formatPriceCLP = (price) => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 0
        }).format(price);
    
    }
    const updateCartIcon = () => {
        const cart = loadCart();
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElement.textContent = totalItems;
        }
    };

    const addToCart = (e) => {
        e.preventDefault(); // Evita que la página se recargue.
        const button = e.currentTarget;
        const cart = loadCart();

        // Recoge la información del producto desde los atributos data-* del botón.
        const product = {
            id: button.dataset.id,
            name: button.dataset.name,
            price: parseFloat(button.dataset.price),
            image: button.dataset.image,
            quantity: 1
        };

        // Busca si el producto ya está en el carrito.
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            // Si ya existe, solo aumenta la cantidad.
            existingItem.quantity += 1;
        } else {
            // Si es un producto nuevo, lo añade al carrito.
            cart.push(product);
        }

        saveCart(cart); // Guarda el carrito actualizado.
        updateCartIcon(); // Actualiza el número en el ícono.

        // Da una señal visual al usuario.
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fa fa-check me-2"></i> Agregado';
        setTimeout(() => {
            button.innerHTML = originalText;
        }, 1500);
    };

    const displayCartPage = () => {
        const cartItemsBody = document.getElementById('cart-items-body');
        // Si no estamos en la página del carrito (no se encuentra el elemento), no hace nada.
        if (!cartItemsBody) return;

        const cart = loadCart();
        cartItemsBody.innerHTML = ''; // Limpia la tabla para redibujarla.
        let subtotal = 0;

        if (cart.length === 0) {
            cartItemsBody.innerHTML = `<tr><td colspan="6" class="text-center py-5">Tu carrito está vacío. <a href="shop.html">¡Ve a la tienda!</a></td></tr>`;
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                const itemRow = `
                    <tr>
                        <!-- Columna de la Imagen -->
                        <th scope="row">
                            <div class="d-flex align-items-center">
                                <img src="${item.image}" class="img-fluid me-3 rounded-circle" style="width: 80px; height: 80px; object-fit: cover;" alt="${item.name}">
                            </div>
                        </th>
                        <!-- Columna del Nombre -->
                        <td><p class="mb-0 mt-4">${item.name}</p></td>
                        <!-- Columna del Precio Unitario -->
                        <td><p class="mb-0 mt-4">${formatPriceCLP(item.price)}</p></td>
                        <!-- Columna de la Cantidad -->
                        <td>
                            <div class="input-group quantity mt-4" style="width: 120px;">
                                <div class="input-group-btn">
                                    <button class="btn btn-sm btn-minus rounded-circle bg-light border cart-quantity-btn" data-id="${item.id}" data-change="-1"><i class="fa fa-minus"></i></button>
                                </div>
                                <input type="text" class="form-control form-control-sm text-center border-0" value="${item.quantity}" readonly>
                                <div class="input-group-btn">
                                    <button class="btn btn-sm btn-plus rounded-circle bg-light border cart-quantity-btn" data-id="${item.id}" data-change="1"><i class="fa fa-plus"></i></button>
                                </div>
                            </div>
                        </td>
                        <!-- Columna del Precio Total por Item -->
                        <td><p class="mb-0 mt-4 fw-bold">${formatPriceCLP(itemTotal)}</p></td>
                        <!-- Columna del Botón para Eliminar -->
                        <td>
                            <button class="btn btn-md rounded-circle bg-light border mt-4 remove-from-cart-btn" data-id="${item.id}"><i class="fa fa-times text-danger"></i></button>
                        </td>
                    </tr>
                `;
                cartItemsBody.innerHTML += itemRow;
            });
        }
        updateTotals(subtotal);
    };

    const updateTotals = (subtotal) => {
        const ivaRate = 0.19; // IVA en Chile es 19%
        const iva = subtotal * ivaRate;
        const total = subtotal + iva;

        // Actualiza los elementos en el HTML.
        document.getElementById('cart-subtotal').textContent = formatPriceCLP(subtotal);
        document.getElementById('cart-iva').textContent = formatPriceCLP(iva);
        document.getElementById('cart-total').textContent = formatPriceCLP(total);
    };

    const changeQuantity = (id, change) => {
        let cart = loadCart();
        const item = cart.find(item => item.id === id);
        if (item) {
            item.quantity += change;
            // Si la cantidad llega a 0, elimina el producto del carrito.
            if (item.quantity <= 0) {
                cart = cart.filter(cartItem => cartItem.id !== id);
            }
        }
        saveCart(cart);
        updateCartIcon();
        displayCartPage(); // Redibuja toda la página del carrito.
    };
    
    const removeFromCart = (id) => {
        let cart = loadCart();
        // Filtra el array, quedándose solo con los productos que NO tienen el id a eliminar.
        cart = cart.filter(item => item.id !== id);
        saveCart(cart);
        updateCartIcon();
        displayCartPage();
    };

    // 1. Asigna el evento 'click' a TODOS los botones para añadir productos.
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    // 2. Si estamos en la página del carrito, se necesita una lógica especial
    // para los botones que se crean dinámicamente (+, -, eliminar).
    const cartPage = document.getElementById('cart-items-body');
    if (cartPage) {
        // Usamos "delegación de eventos" para escuchar clics en toda la tabla.
        cartPage.addEventListener('click', (e) => {
            const button = e.target.closest('button'); // Busca el botón más cercano al clic.
            if (!button) return; // Si no se hizo clic en un botón, no hace nada.

            // Si el botón es para cambiar cantidad...
            if (button.classList.contains('cart-quantity-btn')) {
                const id = button.dataset.id;
                const change = parseInt(button.dataset.change);
                changeQuantity(id, change);
            }

            // Si el botón es para eliminar...
            if (button.classList.contains('remove-from-cart-btn')) {
                const id = button.dataset.id;
                removeFromCart(id);
            }
        });
    }

    // Al cargar cualquier página, siempre actualiza el ícono del carrito.
    updateCartIcon();

    // Y si estamos en la página del carrito, la dibuja.
    displayCartPage();
});

