/**
 * Función para agregar abrir el modal
 * @returns {void}
 */
export function abrirModal(modalId) {
  const modal = document.querySelector(modalId);
  modal.classList.add("show");
  modal.style.display = "block";
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("role", "dialog");
}

/**
 * Función para agregar cerrar el modal
 * @returns {void}
 */
export function cerrarModal(modalId) {
  const modal = document.querySelector(modalId);
  modal.classList.remove("show");
  modal.style.display = "none";
  modal.removeAttribute("aria-modal");
}

/**
 * Función para agregar eventos de apertura y cierre de modales
 * @returns {void}
 */
export function agregarEventosModales() {
  document.querySelectorAll("[data-target]").forEach((boton) => {
    boton.addEventListener("click", function () {
      const targetModalId = this.getAttribute("data-target");
      abrirModal(targetModalId);
    });
  });

  const closeModalButtons = document.querySelectorAll(
    '.modal .close, .modal [data-dismiss="modal"]'
  );
  closeModalButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      const modal = this.closest(".modal");
      cerrarModal(`#${modal.id}`);
    });
  });

  window.addEventListener("click", function (event) {
    const modal = document.querySelector(".modal.show");
    if (modal && event.target === modal) {
      cerrarModal(`#${modal.id}`);
    }
  });
}

/**
 * Función que crea el alerta o toast al agregar un producto al Carrito
 *  * @returns {void}
 */
export function crearAlerta() {
  Swal.fire({
    title: "Agregado!",
    text: "Tu producto se ha agregado al carrito!",
    icon: "success",
  });
}
