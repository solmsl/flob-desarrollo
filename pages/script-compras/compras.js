document.addEventListener("DOMContentLoaded", function () {
    const buttons = {
        "plantillas-btn": "Plantillas",
        "digitalizacion-btn": "Digitalización de Documentos",
        "tresd-btn": "Modelo 3D"
    };

    // Asigna eventos a cada botón
    for (const [buttonId, title] of Object.entries(buttons)) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener("click", () => createForm(title));
        }
    }

    function createForm(title) {
        // Crea el formulario de solicitud usando Bootstrap
        const formHtml = `
            <div class="modal fade" id="requestModal" tabindex="-1" aria-labelledby="requestModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="requestModalLabel">Datos de solicitud para ${title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <form id="requestForm">
                      <div class="mb-3">
                        <label for="color" class="form-label">Color deseado</label>
                        <input type="text" class="form-control" id="color" placeholder="Ej. Azul" required>
                      </div>
                      <div class="mb-3">
                        <label for="size" class="form-label">Tamaño de la plantilla</label>
                        <select class="form-select" id="size">
                          <option value="A4">A4</option>
                          <option value="Carta">Carta</option>
                          <option value="Banner">Banner</option>
                        </select>
                      </div>
                      <div class="mb-3">
                        <label for="email" class="form-label">Correo electrónico</label>
                        <input type="email" class="form-control" id="email" placeholder="correo@ejemplo.com" required>
                      </div>
                    </form>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="send-request">Enviar solicitud</button>
                  </div>
                </div>
              </div>
            </div>
        `;

        document.body.insertAdjacentHTML("beforeend", formHtml);
        const requestModal = new bootstrap.Modal(document.getElementById("requestModal"));
        requestModal.show();

        document.getElementById("send-request").addEventListener("click", sendRequest);
    }

    function sendRequest() {
        const color = document.getElementById("color").value;
        const size = document.getElementById("size").value;
        const email = document.getElementById("email").value;

        if (color && size && email) {
            const requestData = { color, size, email };
            localStorage.setItem("userRequest", JSON.stringify(requestData));

            const verificationCode = Math.floor(1000 + Math.random() * 9000);
            localStorage.setItem("verificationCode", verificationCode.toString());
            alert(`Solicitud enviada! Se ha enviado un código de verificación a ${email}.`);

            document.querySelector(".modal").remove();
            createVerificationForm();
        } else {
            alert("Por favor, completa todos los campos.");
        }
    }

    function createVerificationForm() {
        const verificationFormHtml = `
            <div class="modal fade" id="verificationModal" tabindex="-1" aria-labelledby="verificationModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="verificationModalLabel">Verificación de código</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div class="mb-3">
                      <label for="verification-code" class="form-label">Ingrese el código de verificación</label>
                      <input type="text" class="form-control" id="verification-code" placeholder="Código" required>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-success" id="verify-code">Verificar</button>
                  </div>
                </div>
              </div>
            </div>
        `;

        document.body.insertAdjacentHTML("beforeend", verificationFormHtml);
        const verificationModal = new bootstrap.Modal(document.getElementById("verificationModal"));
        verificationModal.show();

        document.getElementById("verify-code").addEventListener("click", verifyCode);
    }

    function verifyCode() {
        const inputCode = document.getElementById("verification-code").value;
        const storedCode = localStorage.getItem("verificationCode");

        if (inputCode === storedCode) {
            alert("¡Código verificado correctamente!");
            document.querySelector(".modal").remove();
            enableWhatsAppButton();
        } else {
            alert("Código incorrecto. Inténtalo de nuevo.");
        }
    }

    function enableWhatsAppButton() {
        const whatsappButton = document.createElement("button");
        whatsappButton.textContent = "Contactar por WhatsApp";
        whatsappButton.className = "btn btn-success mt-3";
        whatsappButton.onclick = () => {
            const requestData = JSON.parse(localStorage.getItem("userRequest"));
            const message = `Hola, estoy interesado en ${requestData.color} de tamaño ${requestData.size}.`;
            const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
            window.open(url, "_blank");
        };

        document.body.appendChild(whatsappButton);
    }
});
