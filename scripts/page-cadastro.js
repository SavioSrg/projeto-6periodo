import AreasModule from './cadast/areas.js';
import DisponibilidadeModule from "./cadast/disponibilidade.js";
import { API_SABERMAIS_URL } from "./config/apiConfig.js";

// SCRIPT DO PAGE CADASTRO

async function carregarAreasApi() {
  const token = localStorage.getItem("jwtToken");

  const resp = await fetch(`${API_SABERMAIS_URL}/Areas`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return await resp.json();
}

// const mockAreas = [
//     { Id: 1, Nome: "Matemática" },
//     { Id: 2, Nome: "Português" },
//     { Id: 3, Nome: "Ciências" },
//     { Id: 4, Nome: "História" },
//     { Id: 5, Nome: "Geografia" },
//     { Id: 6, Nome: "Física" },
//     { Id: 7, Nome: "Química" },
//     { Id: 8, Nome: "Biologia" },
//     { Id: 9, Nome: "Educação Física" },
//     { Id: 10, Nome: "Artes" },
//     { Id: 11, Nome: "Sociologia" },
//     { Id: 12, Nome: "Filosofia" },
//     { Id: 13, Nome: "Tecnologia da Informação" },
//     { Id: 14, Nome: "Programação" },
//     { Id: 15, Nome: "Administração" }
// ];

const weekDays = [
    { val: '0', label: 'Segunda' },
    { val: '1', label: 'Terça' },
    { val: '2', label: 'Quarta' },
    { val: '3', label: 'Quinta' },
    { val: '4', label: 'Sexta' },
    { val: '5', label: 'Sábado' },
    { val: '6', label: 'Domingo' }
];

const areasList = await carregarAreasApi();

const areas = AreasModule({
  inputSel: '#areaInput',
  addBtnSel: '#addAreaBtn',
  suggestionsSel: '#suggestionsBox',
  tagListSel: '#tagList',
  mockAreas: [],           // começa vazio
  apiAreas: areasList       // ← as áreas reais da API
});

const dispo = DisponibilidadeModule({ rowsSelector: '#rows', addBtnSelector: '#addBtn', clearBtnSelector: '#clearBtn', summarySelector: '#summary', weekDays });

document.getElementById('saveBtn').addEventListener('click', async () => {

    const areasSelecionadas = areas.getSelectedAreas().map(a => a.areaId);

    const disponibilidade = dispo.getDisponibilidade().map(d => ({
        diaDaSemana: d.DiaDaSemana,
        horaInicio: d.HoraInicio,
        horaFim: d.HoraFim
    }));

    const payload = {
        areas: areasSelecionadas,
        disponibilidades: disponibilidade
    };

    console.log("Enviando para API:", payload);

    await salvarCadastro(payload);
});

//FUNÇÃO PARA ENVIAR PARA A API
async function salvarCadastro(payload) {
    const token = localStorage.getItem("jwtToken");

    try {
        const response = await fetch(`${API_SABERMAIS_URL}/professores/cadastro-finalizar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        // SE FALHOU → MOSTRA ERRO REAL DA API
        if (!response.ok) {
            const texto = await response.text();
            console.error("🔴 ERRO DA API:", texto);
            alert("Erro ao salvar. Veja o console (F12).");
            return;
        }

        alert("Cadastro finalizado com sucesso!");
    } 
    catch (erro) {
        console.error("🔴 ERRO FETCH:", erro);
        alert("Erro de conexão com a API!");
    }
}


