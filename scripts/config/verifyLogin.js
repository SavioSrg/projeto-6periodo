import { API_SABERMAIS_URL } from "../config/apiConfig.js";
import { verifyAuth } from "../services/autenticaçãoService.js";

(async function () {
  const token = localStorage.getItem("jwtToken");

  // Se não tiver token, redireciona para login
  if (!token) {
    alert("Ops! É necessário fazer login para continuar.");
    window.location.href = "../login.html";
    return;

  } else {
    try {
      const response = await fetch(`${API_SABERMAIS_URL}/Usuarios/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        localStorage.removeItem("jwtToken");
        window.location.href = "../login.html";
        return;
      }

      const user = await response.json();
      console.log(user);

      const info = await fetch(`${API_SABERMAIS_URL}/Usuarios/${user.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dadosUser = await info.json();

      if (dadosUser.tipo == 1) {
        const buttonDashboard = document.getElementById("buttonDashboard");
        buttonDashboard.classList.remove("hidden");
      } if (dadosUser.tipo == 0) {
        buttonDashboard.classList.add("hidden");
      }

      console.log(dadosUser);
      return dadosUser; // retorna o objeto criado, se a API devolver

    }
    catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      localStorage.removeItem("jwtToken");
      window.location.href = "../login/login.html";

    }
  }
})();