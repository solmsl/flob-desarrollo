document.addEventListener("DOMContentLoaded", () => {
    const requestForm = document.getElementById("requestForm");
    const addToOrderButton = document.getElementById("addToOrderButton");
    const cartItemsContainer = document.getElementById("cartItems");
    const selectedProductContainer = document.getElementById("selectedProduct");
    const totalAmountElement = document.getElementById("totalAmount");
    const checkoutButton = document.getElementById("checkoutButton");

    const cartItems = [];
    let totalAmount = 0;

    // Cargar productos en el carrito de compras
    cartItemsContainer.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
            const product = e.target.getAttribute("data-product");
            const productPrice = 10; // Suponiendo que cada producto cuesta 10
            totalAmount += productPrice;
            totalAmountElement.textContent = totalAmount;
            cartItems.push(product);
            updateSelectedProductDisplay();
        }
    });

    // Función para mostrar los productos seleccionados
    function updateSelectedProductDisplay() {
        selectedProductContainer.innerHTML = cartItems.map(item => `<div>${item}</div>`).join("");
        addToOrderButton.disabled = cartItems.length === 0; // Habilitar botón si hay productos
    }

    // Al hacer clic en el botón "Añadir al Detalle del Pedido"
    addToOrderButton.addEventListener("click", () => {
        const formData = {
            color: document.getElementById("color").value,
            size: document.getElementById("size").value,
            style: document.getElementById("style").value,
            payment: document.getElementById("payment").value,
            comments: document.getElementById("comments").value,
            products: [...cartItems], // Añadir todos los productos seleccionados
            totalAmount: totalAmount
        };

        // Aquí podrías mostrar un mensaje de éxito o realizar otra acción
        alert("Información agregada al comprobante.");
    });

    // Al hacer clic en el botón "Finalizar Compra"
    checkoutButton.addEventListener("click", () => {
        const formData = {
            color: document.getElementById("color").value,
            size: document.getElementById("size").value,
            style: document.getElementById("style").value,
            payment: document.getElementById("payment").value,
            comments: document.getElementById("comments").value,
            products: [...cartItems], // Añadir todos los productos seleccionados
            totalAmount: totalAmount
        };

        // Crear PDF con jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let y = 10;

        doc.setFontSize(12);
        doc.text(`COMPROBANTE DE SOLICITUD`, 20, y);
        y += 10;
        doc.text(`Color: ${formData.color}`, 20, y);
        y += 10;
        doc.text(`Tamaño: ${formData.size}`, 20, y);
        y += 10;
        doc.text(`Estilo: ${formData.style}`, 20, y);
        y += 10;
        doc.text(`Opción de Pago: ${formData.payment}`, 20, y);
        y += 10;
        doc.text(`Comentarios: ${formData.comments}`, 20, y);
        y += 10;

        // Agregar productos
        doc.text("Productos Seleccionados:", 20, y);
        y += 10;
        formData.products.forEach((product, index) => {
            doc.text(`${index + 1}. ${product}`, 20, y);
            y += 10;
        });

        doc.text(`Total: $${formData.totalAmount}`, 20, y);
        
        // Descargar el PDF
        doc.save("comprobante.pdf");
    });
});
