let productos = [];

// Cargar los productos desde el archivo JSON
fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })
    .catch(error => console.error('Error al cargar los productos:', error));

const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categorias");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
             <img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}" height="240px">
             <div class="producto-detalles">
                  <h3 class="producto-titulo">${producto.titulo}</h3>
                  <p class="producto-precio">Gs: ${producto.precio}</p>
                  <button class="producto-agregar" id="${producto.id}">Agregar</button>
             </div>
        `;

        contenedorProductos.append(div);
    });

    // Asegúrate de actualizar los botones después de cargar los productos
    actualizarBotonesAgregar();
}

// Función para filtrar productos por categoría
botonesCategorias.forEach(boton => {
    boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const productosBoton = productos.filter(producto => producto.categorias.id === e.currentTarget.id);
            const productoCategoria = productos.find(producto => producto.categorias.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria ? productoCategoria.categorias.nombre : "Categoría";

            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    });
});

function actualizarBotonesAgregar() {
    botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}

let productosEnCarrito = [];
let productosEnCarritoLS = localStorage.getItem("productoss-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
}

function agregarAlCarrito(e) {
    Toastify({
        text: "Producto agregado",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        stopOnFocus: true,
        style: {
            background: "linear-gradient(to right, #f19ccb, #F7B5CA)",
            borderRadius: "1rem",
            fontSize: ".75rem",
            textTransform: "uppercase",
        },
        offset: {
            x: '.5rem',
            y: '.5rem',
        },
        onClick: function() {}
    }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if (productoAgregado) {
        if (productosEnCarrito.some(producto => producto.id === idBoton)) {
            const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
            productosEnCarrito[index].cantidad++;
        } else {
            productoAgregado.cantidad = 1;
            productosEnCarrito.push(productoAgregado);
        }

        actualizarNumerito();
        localStorage.setItem("productoss-en-carrito", JSON.stringify(productosEnCarrito));
    } else {
        console.error(`Producto con id ${idBoton} no encontrado.`);
    }
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}


document.addEventListener("DOMContentLoaded", function() {
    const introAnimation = document.getElementById("intro-animation");
    const mainContent = document.getElementById("main-content");

    // Mostrar el logo por 3 segundos
    setTimeout(() => {
        // Ocultar la animación gradualmente
        introAnimation.style.opacity = 0;
        
        // Esperar a que la animación termine (1 segundo) antes de ocultar completamente
        setTimeout(() => {
            introAnimation.style.display = "none";
            // Mostrar el contenido de la página
            mainContent.classList.remove("hidden");
            // Hacer que el contenido aparezca con un efecto de fade-in
            mainContent.style.opacity = 1;
        }, 800); // Tiempo de espera para completar la transición de opacidad
    }, 800); // Duración que el logo se muestra (3 segundos)
});
