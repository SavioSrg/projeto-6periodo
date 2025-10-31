import { API_SABERMAIS_URL } from "../config/apiConfig.js";

document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault(); // impede o recarregamento da página

  const email = document.getElementById("email").value;
  const password = document.getElementById("senha").value;

  try {
    // Aqui entra exatamente o seu trecho de código de autenticação:
    const response = await fetch(`${API_SABERMAIS_URL}/Usuarios/Authenticate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include" // envia e recebe cookies automaticamente
    });

    if (!(response.ok)) {
      const errorData = await response.json();
      document.getElementById("errorMsg").style.color = "red";
      document.getElementById("errorMsg").textContent =
        errorData.message || "Email ou senha inválidos.";
      return;
    }

    // Se o login for bem-sucedido, o backend já enviou o cookie JWT.
    // Nenhum token é manipulado no JS — apenas redirecionamos.
    document.getElementById("errorMsg").style.color = "green";
    document.getElementById("errorMsg").textContent = "Login realizado com sucesso!";
    setTimeout(() => {
      window.location.href = "../teachers/dashboard.html"; // redireciona para a área protegida
    }, 1000);

  } catch (error) {
    console.error("Erro:", error);
    document.getElementById("errorMsg").style.color = "red";
    document.getElementById("errorMsg").textContent = "Falha na conexão com o servidor.";
  }
});