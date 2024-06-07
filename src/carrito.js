function obtenerCantidadProductosEnCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let cantidadTotal = 0;
  carrito.forEach((producto) => {
    cantidadTotal += producto.cantidad;
  });
  return cantidadTotal;
}

function actualizarContadorProductos() {
  const contadorProductos = document.getElementById("contador-productos");
  const cantidadProductos = obtenerCantidadProductosEnCarrito();
  contadorProductos.innerText = cantidadProductos;
}

export async function actualizarContenidoCarrito() {
  const carritoContainer = document.querySelector(".offcanvas-body");
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let carritoHTML = "";
  let precioTotal = 0;
  carrito.forEach((producto, index) => {
    const precioProducto = producto.precio * producto.cantidad;
    precioTotal += precioProducto;
    carritoHTML += generarHTMLProductoEnCarrito(
      producto,
      index,
      precioProducto
    );
  });
  mostrarContenidoCarrito(carritoContainer, carritoHTML, precioTotal);
  actualizarEstadoBotonComprar();
  const precioTotalElement = document.querySelector(".precio-total");
  if (carrito.length === 0) {
    precioTotalElement.style.display = "none";
  } else {
    precioTotalElement.style.display = "block";
  }
  actualizarContadorProductos();
}

function alertCorrecto() {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });
  Toast.fire({
    icon: "success",
    title: "La compra se ha realizado con éxito!!!",
  });
  localStorage.removeItem("carrito");
  actualizarContenidoCarrito();
}

function eliminarTodoDelCarrito() {
  Swal.fire({
    title: "Desea eliminar todos los productos del carrito?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Si",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire(
        "Todos los productos han sido eliminados del carrito",
        "",
        "success"
      );
      localStorage.removeItem("carrito");
      actualizarContenidoCarrito();
      actualizarEstadoBotonComprar();
      actualizarContadorProductos();
    } else {
      Swal.fire("Operación cancelada", "", "info");
    }
  });
}

async function alertEliminar(index) {
  const result = await Swal.fire({
    title: "Desea eliminar este producto del carrito?",
    icon: "warning",
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "Si",
    denyButtonText: `No`,
  });
  if (result.isConfirmed) {
    Swal.fire("Producto eliminado!", "", "success");
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    await actualizarContenidoCarrito();
    actualizarEstadoBotonComprar();
  } else if (result.isDenied) {
    Swal.fire("No se eliminó el producto", "", "info");
  }
}

let products = document.querySelector(".productos");

function generarHTMLProductoEnCarrito(producto, index, precioProducto) {
  return `
          <div class="card mb-3">
              <div class="row g-0">
                  <div class="col-md-4">
                      <img src="${
                        producto.imagen
                      }" class="img-fluid rounded-start" alt="Imagen del producto">
                  </div>
                  <div class="col-md-8">
                      <div class="card-body">
                          <h5 class="card-title">${producto.nombre}</h5>
                          <p class="card-text">Cantidad: 
                              <button class="btn btn-sm btn-secondary mr-2" data-product-index="${index}" data-action="decrease">-</button>
                              <span class="cantidad">${producto.cantidad}</span>
                              <button class="btn btn-sm btn-secondary ml-2" data-product-index="${index}" data-action="increase">+</button>
                          </p>
                          <p class="card-text">Precio unitario: $${producto.precio.toFixed(
                            2
                          )}</p>
                          <p class="card-text">Precio total: $${precioProducto.toFixed(
                            2
                          )}</p>
                          <button type="button" class="btn btn-danger btn-sm eliminar-producto" data-producto-index="${index}">Eliminar</button>
                      </div>
                  </div>
              </div>
          </div>
      `;
}

export async function fetchProducts(url) {
  let data = await fetch(url);
  let response = await data.json();
  for (let i = 0; i < response.length; i++) {
    let title = response[i].title;
    products.innerHTML += `    
        <div class="card" >
            <img src="${
              response[i].image
            }" class="card-img-top" alt="..." data-target="#modalId${i}">
            <div class="card-body">
                <h5 class="card-title">${
                  title.length > 15
                    ? title.substring(0, 15).concat("...")
                    : title
                }</h5>
                <h6 class="card-subtitle mb-2 text-body-secondary">${
                  response[i].category
                }</h6>
            </div>
        </div>
        
        <div class="modal fade fixed-size-modal" id="modalId${i}">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <div class="contenedor">
                <h5 class="modal-title">${response[i].title}</h5>
                <button type="button" class="btn-close close custom-close" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <img src="${
                    response[i].image
                  }" class="img-fluid rounded" alt="Imagen del producto">
                </div>
                <div class="col-md-6 content-right">
                  <p class="card-text text-dark text-justify">${
                    response[i].description
                  }</p>
                  <p class="price card-text text-success">$${
                    response[i].price
                  }</p>
                  <a href="#" class="btn btn-dark btn-block agregar-carrito-modal" data-product-id="${
                    response[i].id
                  }">Agregar al carrito</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    `;
  }
}

function agregarEventosModificarCantidad() {
  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", async function () {
      const index = parseInt(this.getAttribute("data-product-index"));
      const action = this.getAttribute("data-action");
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      const producto = carrito[index];
      if (action === "increase") {
        producto.cantidad++;
      } else if (action === "decrease") {
        if (producto.cantidad > 1) {
          producto.cantidad--;
        } else {
          carrito.splice(index, 1);
        }
      }
      localStorage.setItem("carrito", JSON.stringify(carrito));
      await actualizarContenidoCarrito();
      actualizarEstadoBotonComprar();
    });
  });
}

function mostrarContenidoCarrito(carritoContainer, carritoHTML, precioTotal) {
  carritoContainer.innerHTML = carritoHTML;
  const precioTotalElement = document.createElement("p");
  precioTotalElement.textContent = `Precio total: $${precioTotal.toFixed(2)}`;
  precioTotalElement.classList.add("precio-total");
  carritoContainer.appendChild(precioTotalElement);
  agregarEventosEliminarProducto();
  agregarEventosModificarCantidad();
}

function agregarEventosEliminarProducto() {
  document.querySelectorAll(".eliminar-producto").forEach((boton) => {
    boton.addEventListener("click", async function () {
      const index = parseInt(this.getAttribute("data-producto-index"));
      await alertEliminar(index);
    });
  });
}

export async function agregarAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const productoExistenteIndex = carrito.findIndex(
    (item) => item.id === producto.id
  );
  if (productoExistenteIndex !== -1) {
    carrito[productoExistenteIndex].cantidad += 1;
    carrito[productoExistenteIndex].precioTotal =
      carrito[productoExistenteIndex].cantidad * producto.price;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.title,
      precio: producto.price,
      cantidad: 1,
      precioTotal: producto.price,
      imagen: producto.image,
    });
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para cambiar el fondo del slider según el tamaño de la pantalla
function changeSliderBackground() {
  var screenWidth = window.innerWidth;

  if (screenWidth < 768) {
    // Pantalla pequeña
    document.querySelectorAll(".carousel-item").forEach(function (item, index) {
      item.style.backgroundImage =
        "url('./img/slider" + (index + 1) + "-small.png')";
    });
  } else if (screenWidth < 992) {
    // Pantalla mediana
    document.querySelectorAll(".carousel-item").forEach(function (item, index) {
      item.style.backgroundImage =
        "url('./img/slider" + (index + 1) + "-medium.png')";
    });
  } else {
    // Pantalla grande
    document.querySelectorAll(".carousel-item").forEach(function (item, index) {
      item.style.backgroundImage =
        "url('./img/slider" + (index + 1) + "-large.png')";
    });
  }
}

/* // Llama a la función al cargar la página y al cambiar el tamaño de la pantalla */
window.addEventListener("load", changeSliderBackground);
window.addEventListener("resize", changeSliderBackground);

const botonComprar = document.getElementById("btn-comprar");
const btnEliminarTodo = document.getElementById("btn-eliminar");

function carritoEstaVacio() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  return carrito.length === 0;
}

function actualizarEstadoBotonComprar() {
  if (carritoEstaVacio()) {
    botonComprar.setAttribute("disabled", "true");
    btnEliminarTodo.setAttribute("disabled", "true");
  } else {
    botonComprar.removeAttribute("disabled");
    btnEliminarTodo.removeAttribute("disabled");
  }
}

document.addEventListener("DOMContentLoaded", async function () {
  await actualizarContenidoCarrito();
  btnEliminarTodo.addEventListener("click", eliminarTodoDelCarrito);
  botonComprar.addEventListener("click", alertCorrecto);
});

fetchProducts("https://fakestoreapi.com/products");

actualizarContadorProductos();
