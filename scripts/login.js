/* ----------- Toggle Senha ----------- */
function setupTogglePassword(toggleId, inputId) {
    const toggle = document.getElementById(toggleId);
    const input = document.getElementById(inputId);

    toggle.addEventListener("click", () => {
        const hidden = input.type === "password";
        input.type = hidden ? "text" : "password";
        toggle.textContent = hidden ? "$" : "%";
        toggle.setAttribute("aria-pressed", String(!hidden));
    });
}

setupTogglePassword("toggleSenha", "senha");
setupTogglePassword("toggleConfirmarSenha", "confirmarSenha");

