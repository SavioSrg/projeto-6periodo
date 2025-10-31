import { API_SABERMAIS_URL } from "../config/apiConfig.js";

// GET: /api/Professores
async function buscarTodosProfessores() {
    const url = `${API_SABERMAIS_URL}/Professores`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar Professores! Status: ${response.status}`);
        }

        const professores = await response.json();
        console.log("Professores encontrados:", professores);
        //renderizarDadosNaTela(professores); // Exibir na tela
        
    } catch (error) {
        console.error("Falha na requisição GET (Professores):", error);
        // Ex: Mostrar uma mensagem de erro na tela
    }
}

// Exemplo de uso
buscarTodosProfessores();

// POST: /api/Professores
export async function createProfessor(payload) {
    const response = await fetch(`${API_SABERMAIS_URL}/professores`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao cadastrar professor.");
    }

    return response.json(); // retorna o objeto criado, se a API devolver
}


async function carregarProfessor(idProfessor) {
  try {
    const response = await fetch(`${API_SABERMAIS_URL}/Professores/${idProfessor}`, {
      method: "GET",
      credentials: "include" //envia automaticamente o cookie JWT salvo no navegador
    });

    if (response.status === 401) {
      // Não autorizado → token inválido ou expirado
      alert("Sessão expirada. Faça login novamente.");
        // document.getElementById("erro").textContent = "Sessão expirada. Faça login novamente.";
        window.location.href = "../login.html"
    //   setTimeout(() => window.location.href = "../login.html", 2000);
      return;
    }

    if (response.status === 404) {
        alert("Professor não encontrado.");
      //document.getElementById("erro").textContent = "Professor não encontrado.";
      window.location.href = "../login.html"
      return;
    }

    if (!response.ok) {
        alert("Erro ao carregar informações do professor.");
      //document.getElementById("erro").textContent = "Erro ao carregar informações do professor.";
      window.location.href = "../login.html"
      return;
    }

    const professor = await response.json();
    const info = document.getElementById("info-professor");

    // Exibe as informações do professor
    info.innerHTML = `
        <h3>${professor.nome}</h3>
      <p><strong>ID:</strong> ${professor.id}</p>
      <p><strong>Disciplina:</strong> ${professor.disciplina || "Não informado"}</p>
      <p><strong>Email:</strong> ${professor.email || "Não informado"}</p>
      `;
  } catch (error) {
    console.error("Erro:", error);
    alert("Falha na conexão com o servidor.");
    // document.getElementById("erro").textContent = "Falha na conexão com o servidor.";
  }
}

// Executa automaticamente ao abrir a página
carregarProfessor(19);
