import { API_SABERMAIS_URL } from "../config/apiConfig.js";

export async function loadUser() {
    const token = localStorage.getItem("jwtToken"); //Verifica se tem o JWT Token no localStorage

    if (!token) {
        alert("Ops! É necessário fazer login para continuar.");
        window.location.href = "../login.html"; // Se não tiver token, redireciona para login
        return;

    } else {
        try {
            const response = await fetch(`${API_SABERMAIS_URL}/Usuarios/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status === 401) {
                // Não autorizado → token inválido ou expirado
                alert("Sessão expirada. Faça login novamente.");
                window.location.href = "../login.html"
                setTimeout(() => window.location.href = "../login.html", 1000);
                return;
            }

            if (response.status === 404) {
                alert("Professor não encontrado.");
                window.location.href = "../login.html"
                return;
            }

            if (!response.ok) {
                alert("Erro ao carregar informações do professor.");
                window.location.href = "../login.html"
                return;
            }

            const user = await response.json();
            console.log(response);
            console.log(user);

            const idUsuario = user.id;

            const response2 = await fetch(`${API_SABERMAIS_URL}/Professores/${idUsuario}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const dadosUser = await response2.json(); //Retorna as infos do usuário logado
            console.log(dadosUser);
            const tipoUsuario = dadosUser.tipo;

            if (tipoUsuario == 1) {
                const buttonDashboard = document.getElementById("buttonDashboard"); //Botão Dashboard do menu
                buttonDashboard.classList.remove("hidden");
            } if (tipoUsuario == 0) {
                buttonDashboard.classList.add("hidden");
            }

            await carregarProfessor(dadosUser);
            return dadosUser;
        }
        catch (error) {
            console.error("Erro ao verificar autenticação:", error);
            alert("Erro ao verificar autenticação.");
            localStorage.removeItem("jwtToken");
            window.location.href = "../login.html";
        }
    }
};

async function carregarProfessor(professor) {

    document.getElementById("userName").textContent = professor.nome;
    document.getElementById("aulasAgendadas").textContent = professor.agendamentosComoProfessor.length;

    // Função que conta aulas concluídas (status = 2 e 3)
    function contarAulas() {
        if (!professor.agendamentosComoProfessor) return 0;

        const aulasSemAvaliacao = professor.agendamentosComoProfessor.filter(aula => aula.status === 2).length;
        const aulasComAvaliacao = professor.agendamentosComoProfessor.filter(aula => aula.status === 3).length;
        return aulasSemAvaliacao + aulasComAvaliacao;
    }
    document.getElementById("aulasConcluidas").textContent = contarAulas();

    // Função que conta alunos únicos em aulas concluídas
    function contarAlunos() {
        if (!professor.agendamentosComoProfessor) return 0;

        const aulasConcluidas = professor.agendamentosComoProfessor.filter(aula => aula.status === 0);
        const idsAlunos = aulasConcluidas.map(aula => aula.alunoId);
        const alunosUnicos = new Set(idsAlunos); // remove duplicados

        return alunosUnicos.size;
    }
    document.getElementById("totalAlunos").textContent = contarAlunos();

    function somarHorasAulas() {
        if (!professor.agendamentosComoProfessor) return 0;
        const horasSemAvaliacao = professor.agendamentosComoProfessor.filter(aula => aula.status === 2).length * 60;
        const horasComAvaliacao = professor.agendamentosComoProfessor.filter(aula => aula.status === 3).length * 60;
        return horasSemAvaliacao + horasComAvaliacao;
    }
    document.getElementById("horasAulas").textContent = `${somarHorasAulas()} minutos`;

    await carregarAgendamentos(professor);
}


const token = localStorage.getItem("jwtToken");
const activityTimeline = document.getElementById("upcomingLessons");

// Função para formatar data e hora
function formatarDataHora(datetime) {
    const dataObj = new Date(datetime);
    const data = dataObj.toLocaleDateString("pt-BR", { timeZone: "UTC" });
    const hora = dataObj.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
    });
    return { data, hora };
}

// Função para criar o card da aula
function criarAula({ materia, aluno, data, hora }) {
    const card = document.createElement("div");
    card.className = "lesson-item";
    card.dataset.status = "confirmar"; // estado inicial

    card.innerHTML = `
       <div class="lesson-avatar">${aluno[0].toUpperCase()}</div>
       <div class="lesson-info">
         <div class="lesson-header">
           <h4>${materia}</h4>
           <span class="lesson-status status-pending">Aula confirmada</span>
         </div>
         <p class="lesson-teacher">Aluno ${aluno}</p>
         <div class="lesson-details">
           <span class="lesson-date"><i class="fas fa-calendar"></i> ${data}</span>
           <span class="lesson-time"><i class="fas fa-clock"></i> ${hora}</span>
         </div>
       </div>
      <div class="lesson-actions">
        <button class="btn-sm btn-primary" onclick="confirmarAula(this)">Confirmar</button>
        <button class="btn-sm btn-outline" onclick="negarAula(this)">Negar</button>
      </div>
    `;
    activityTimeline.appendChild(card);
}

// Função principal: busca os dados e cria os cards
async function carregarAgendamentos(dadosProfessor) {

    const agendamentos = dadosProfessor.agendamentosComoProfessor;

    // Filtrar apenas os agendamentos confirmados (status === 1)
    const agendamentosFiltrados = agendamentos.filter(a => a.status === 1);

    for (const agendamento of agendamentosFiltrados) {
        const { data, hora } = formatarDataHora(agendamento.dataHora);

        // Para obter o nome do aluno e da disciplina
        const alunoNome = await buscarNomeAluno(agendamento.alunoId);
        const disciplinaNome = await buscarNomeMateria(agendamento.disciplinaId);

        criarAula({
            materia: disciplinaNome,
            aluno: alunoNome,
            data,
            hora,
        });
    }

}

// Função para buscar o nome do aluno
async function buscarNomeAluno(idAluno) {
    try {
        const resp = await fetch(`${API_SABERMAIS_URL}/Usuarios/${idAluno}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const aluno = await resp.json();
        return aluno.nome || `ID ${idAluno}`;
    } catch {
        return `ID ${idAluno}`;
    }
}

// Função para buscar o nome da disciplina
async function buscarNomeMateria(idArea) {
    try {
        const resp = await fetch(`${API_SABERMAIS_URL}/Areas/${idArea}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        const area = await resp.json();
        return area.nome || `Área ${idArea}`;
    } catch (erro) {
        console.error("Erro ao buscar nome da matéria:", erro);
        return `Área ${idArea}`;
    }
}
