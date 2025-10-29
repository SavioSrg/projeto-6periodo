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

// Script dedicado ao modal de cadastro

// Seleciona os elementos
const modalCadastroForm = document.getElementById('modalCadastro');
const openModalCadastroForm = document.getElementById('openModalCadastroForm');
const closeModalCadastroForm = document.getElementById('closeModalCadastro');

// Abre o modal
openModalCadastroForm?.addEventListener('click', () => {
  modalCadastroForm.style.display = 'flex';
});

// Fecha ao clicar no botão de fechar
closeModalCadastroForm?.addEventListener('click', () => {
  modalCadastroForm.style.display = 'none';
});

// Fecha ao clicar fora do conteúdo
window.addEventListener('click', (e) => {
  if (e.target === modalCadastroForm) {
    modalCadastroForm.style.display = 'none';
  }
});
