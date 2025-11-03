(function() {
  const token = localStorage.getItem("jwtToken");

  // Se não tiver token, redireciona para login
  if (!token) {
    alert("Ops! É necessário fazer login para continuar.");
    window.location.href = "../login.html";
    return;
  }
})();