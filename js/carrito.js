let productosEnCarrito = localStorage.getItem("productoss-en-carrito");
productosEnCarrito = JSON.parse(productosEnCarrito);

const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
let botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");
const textoPedido = document.querySelector("#carrito-pedido");


function cargarProductosCarrito(){
     if(productosEnCarrito && productosEnCarrito.length>0){

     contenedorCarritoVacio.classList.add("disabled");
     contenedorCarritoProductos.classList.remove("disabled");
     contenedorCarritoAcciones.classList.remove("disabled");
     contenedorCarritoComprado.classList.add("disabled");
     textoPedido.classList.remove("disabled");


     contenedorCarritoProductos.innerHTML =  "";

     productosEnCarrito.forEach(producto => {
          const div = document.createElement("div");
          div.classList.add("carrito-producto");
          div.innerHTML = `
          <img class="carrito-producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
               <div class="carrito-producto-titulo">
                         <small>Titulo:</small>
                         <h3>${producto.titulo}</h3>
               </div>
                    <div class="carrito-titulo-cantidad">
                         <small>Cantidad:</small>
                         <p>${producto.cantidad}</p>
                    </div>
                    <div class="carrito-producto-precio">
                         <small>Precio:</small>
                         <p>${producto.precio} Gs.</p>
                    </div>
                    <div class="carrito-producto-subtotal">
                         <small>Subtotal:</small>
                         <p>${producto.precioMos * producto.cantidad} Gs.</p>
                    </div>
                    <div class="carrito-eliminar">
                         <button class="carrito-producto-eliminar" id="${producto.id}" ><i class="bi bi-trash"></i>Eliminar</button>
                    </div>
          `;
          contenedorCarritoProductos.append(div);
     });

     }else{
          contenedorCarritoVacio.classList.remove("disabled");
          contenedorCarritoProductos.classList.add("disabled");
          contenedorCarritoAcciones.classList.add("disabled");
          contenedorCarritoComprado.classList.add("disabled");
          textoPedido.classList.add("disabled");
     }
     actualizarBotonesEliminar ();
     actualizarTotal();
}

cargarProductosCarrito();

function actualizarBotonesEliminar (){
     botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
 
     botonesEliminar.forEach(boton => {
         boton.addEventListener("click", eliminarDelCarrito);
     });
}

function eliminarDelCarrito (e){
     Toastify({
          text: "producto eliminado",
          duration: 3000,
          /*destination: "./carrito.html",*/
          /*newWindow: true,*/
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #f19ccb, #F7B5CA",
            borderRadius: "1rem",
            fontSize: ".75rem",
            textTransform:"uppercase",
          },
          offset: {
              x: '1.5rem', // horizontal axis - can be a number or a string indicating unity. eg: '2em'
              y: '1.5rem' // vertical axis - can be a number or a string indicating unity. eg: '2em'
            },
          onClick: function(){} // Callback after click
        }).showToast();

     const idBoton = e.currentTarget.id;
     const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
     
     productosEnCarrito.splice(index, 1);
     cargarProductosCarrito();

     localStorage.setItem("productoss-en-carrito", JSON.stringify(productosEnCarrito));
}

botonVaciar.addEventListener("click", vaciarCarrito);
function vaciarCarrito(){
     Swal.fire({
          title: "¿Estás seguro?",
          text: `Se borraran ${productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos.`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#f19ccb",
          cancelButtonColor: "rgb(189, 189, 189)",
          cancelButtonText: "Cancelar",
          confirmButtonText: "Si, vaciar"
        }).then((result) => {
          if (result.isConfirmed) {
               productosEnCarrito.length = 0;
               localStorage.setItem("productoss-en-carrito", JSON.stringify(productosEnCarrito));
               cargarProductosCarrito();
            Swal.fire({
              title: "Vacio!",
              text: "Tu carrito se ha vaciado con éxito",
              icon: "success"
            });
          }
        });
}

function actualizarTotal(){
     const totalcalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precioMos * producto.cantidad), 0);
     total.innerText = `${totalcalculado}Gs.`;
}


botonComprar.addEventListener("click", comprarCarrito);

function comprarCarrito() {
    // Verifica si el carrito tiene productos
    if (productosEnCarrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    // Construir mensaje con los productos del carrito
    let mensaje = "Hola! Estoy interesado en comprar los siguientes productos👇🏼:\n\n";
    
    productosEnCarrito.forEach(producto => {
        mensaje += `- ${producto.titulo} \n\t(Cantidad: ${producto.cantidad}) - ${producto.precioMos * producto.cantidad} Gs.\n`;
    });

    // Agregar el total al mensaje
    const totalcalculado = productosEnCarrito.reduce((acc, producto) => acc + (producto.precioMos * producto.cantidad), 0);
    mensaje += `\nTotal: ${totalcalculado} Gs.\n`;

    // URL de WhatsApp con el mensaje codificado
    const numeroTelefono = "5950984439436"; 
    const urlWhatsapp = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`;

    // Redirigir a la URL de WhatsApp
    window.location.href = urlWhatsapp;

    // Vaciar el carrito después de enviar el mensaje
    productosEnCarrito.length = 0;
    localStorage.setItem("productoss-en-carrito", JSON.stringify(productosEnCarrito));
    cargarProductosCarrito();

    contenedorCarritoVacio.classList.add("disabled")
    contenedorCarritoComprado.classList.remove("disabled");
}

