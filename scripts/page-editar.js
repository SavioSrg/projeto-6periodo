import AreasModule from './cadast/areas.js';
import DisponibilidadeModule from "./cadast/disponibilidade.js";

const mockApiData = {
  nome: "a",
  email: "a@gmail.com",
  password: "1",
  cpf: "203.411.060-97",
  tipo: "professor",
  descricao: "a",
  certificacoes: ["1", "2", "3", "4", "5"],
  competencias: ["a", "b", "c", "d", "e"],
  valorHora: 80.99,
};
const mockAreas = [
  { Id: 1, Nome: "Matemática" },
  { Id: 13, Nome: "Tecnologia da Informação" },
  { Id: 14, Nome: "Programação" },
  { Id: 15, Nome: "Administração" }
];

const weekDays = [
  { id: 1762018461203, DiaDaSemana: 0, HoraInicio: '08:00:00', HoraFim: '09:00:00' },
  { id: 1762018461204, DiaDaSemana: 1, HoraInicio: '13:00:00', HoraFim: '14:00:00' },
  { id: 1762018461205, DiaDaSemana: 4, HoraInicio: '08:00:00', HoraFim: '12:00:00' }
];

const areas = AreasModule({ inputSel: '#areaInput', addBtnSel: '#addAreaBtn', suggestionsSel: '#suggestionsBox', tagListSel: '#tagList', mockAreas });

const dispo = DisponibilidadeModule({ rowsSelector: '#rows', addBtnSelector: '#addBtn', clearBtnSelector: '#clearBtn', summarySelector: '#summary', weekDays });

// carregar dados do backend
function loadData(data, area, hor) {
  document.getElementById('nome').value = data.nome;
  document.getElementById('email').value = data.email;
  document.getElementById('senha').value = data.password;
  document.getElementById('cpf').value = data.cpf;
  document.getElementById('tipo').value = data.tipo;
  document.getElementById('descricao').value = data.descricao;
  document.getElementById('certificacoes').value = data.certificacoes;
  document.getElementById('competencias').value = data.competencias;
  document.getElementById('valorHora').value = data.valorHora;
  areas.setSelectedAreas(area);
  dispo.setDisponibilidade(hor);
}

loadData(mockApiData, mockAreas, weekDays);

document.getElementById('saveBtn').addEventListener('click', () => {
  const saveObj = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    password: document.getElementById('senha').value,
    cpf: document.getElementById('cpf').value,
    tipo: document.getElementById('tipo').value,
    descricao: document.getElementById('descricao').value,
    certificacoes: document.getElementById('certificacoes').value,
    competencias: document.getElementById('competencias').value,
    Areas: areas.getSelectedAreas(),
    Disponibilidade: dispo.getDisponibilidade()
  };
  console.log('Salvar editar:', saveObj);
  alert("Salvo com sucesso!");
});

if (!document.getElementById('editForm')) {
  console.warn('Página sem formulário de edição, script ignorado.');
}