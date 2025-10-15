const togglePassword = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";

    // Alternar tipo do input
    passwordInput.type = isHidden ? "text" : "password";

    // Atualizar texto do botão
    togglePassword.textContent = isHidden ? "$" : "%";

    // Acessibilidade (opcional)
    togglePassword.setAttribute("aria-label", isHidden ? "Ocultar senha" : "Mostrar senha");
    togglePassword.setAttribute("aria-pressed", String(!isHidden));
});
