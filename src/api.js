import { actualizarContenidoCarrito, fetchProducts, agregarAlCarrito } from './carrito.js';
import { agregarEventosModales, cerrarModal, crearAlerta } from './modal.js';

document.addEventListener("DOMContentLoaded", async function () {
  let carritoButton;

  await fetchProducts("https://fakestoreapi.com/products");

  // Se añade evento de click a los botones "Agregar al carrito"
  document.querySelectorAll(".agregar-carrito").forEach((boton) => {
    boton.addEventListener("click", async function (event) {
      event.preventDefault();
      const productoId = this.getAttribute("data-product-id");
      await agregarProductoAlCarrito(productoId);
      crearAlerta();
    });
  });

  // Se añade evento de click a los botones "Agregar al carrito" dentro del modal
  document.querySelectorAll(".agregar-carrito-modal").forEach((boton) => {
    boton.addEventListener("click", async function (event) {
      event.preventDefault();
      const productoId = this.getAttribute("data-product-id");
      await agregarProductoAlCarrito(productoId);
      crearAlerta();
      const modal = document.querySelector(".modal.show");
      if (modal) {
        cerrarModal(`#${modal.id}`);
      }
    });
  });

  // Se muestra el contenido del carrito al cargar la página
  await actualizarContenidoCarrito();

  carritoButton = document.getElementById("carritoLink");

  agregarEventosModales();

  // Función para agregar un producto al carrito
  async function agregarProductoAlCarrito(productoId) {
    const producto = await obtenerInformacionProducto(productoId);
    await agregarAlCarrito(producto);
    await actualizarContenidoCarrito();
  }

  // Función para obtener información de un producto
  async function obtenerInformacionProducto(productoId) {
    const response = await fetch(
      `https://fakestoreapi.com/products/${productoId}`
    );
    const producto = await response.json();
    return producto;
  }

});
