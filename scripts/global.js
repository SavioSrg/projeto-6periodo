// =========================
// MENU HAMBÚRGUER
// =========================
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}

// =========================
// MODAL DE LOGIN
// =========================
const modal = document.getElementById("modal");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");

if (openModal && modal) {
  openModal.addEventListener("click", () => {
    modal.style.display = "flex";
  });
}

if (closeModal && modal) {
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });
}

// Fechar modal de login ao clicar fora
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// =========================
// MODAL DE CADASTRO
// =========================
const modalCadastro = document.getElementById("modalCadastro");
const openModalCadastro = document.getElementById("openModalCadastro");
const closeModalCadastro = document.getElementById("closeModalCadastro");

if (openModalCadastro && modalCadastro) {
  openModalCadastro.addEventListener("click", () => {
    modalCadastro.style.display = "flex";
  });
}

if (closeModalCadastro && modalCadastro) {
  closeModalCadastro.addEventListener("click", () => {
    modalCadastro.style.display = "none";
  });
}

// Fechar modal de cadastro ao clicar fora
window.addEventListener("click", (e) => {
  if (e.target === modalCadastro) {
    modalCadastro.style.display = "none";
  }
});