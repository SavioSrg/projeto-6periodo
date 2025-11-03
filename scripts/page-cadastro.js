import AreasModule from './cadast/areas.js';
import DisponibilidadeModule from "./cadast/disponibilidade.js";

// SCRIPT DO PAGE CADASTRO

const mockAreas = [
    { Id: 1, Nome: "Matemática" },
    { Id: 2, Nome: "Português" },
    { Id: 3, Nome: "Ciências" },
    { Id: 4, Nome: "História" },
    { Id: 5, Nome: "Geografia" },
    { Id: 6, Nome: "Física" },
    { Id: 7, Nome: "Química" },
    { Id: 8, Nome: "Biologia" },
    { Id: 9, Nome: "Educação Física" },
    { Id: 10, Nome: "Artes" },
    { Id: 11, Nome: "Sociologia" },
    { Id: 12, Nome: "Filosofia" },
    { Id: 13, Nome: "Tecnologia da Informação" },
    { Id: 14, Nome: "Programação" },
    { Id: 15, Nome: "Administração" }
];

const weekDays = [
    { val: '0', label: 'Segunda' },
    { val: '1', label: 'Terça' },
    { val: '2', label: 'Quarta' },
    { val: '3', label: 'Quinta' },
    { val: '4', label: 'Sexta' },
    { val: '5', label: 'Sábado' },
    { val: '6', label: 'Domingo' }
];

const areas = AreasModule({ inputSel: '#areaInput', addBtnSel: '#addAreaBtn', suggestionsSel: '#suggestionsBox', tagListSel: '#tagList', mockAreas });
const dispo = DisponibilidadeModule({ rowsSelector: '#rows', addBtnSelector: '#addBtn', clearBtnSelector: '#clearBtn', summarySelector: '#summary', weekDays });

document.getElementById('saveBtn').addEventListener('click', () => {
    const payload = {
        Areas: areas.getSelectedAreas(),
        Disponibilidade: dispo.getDisponibilidade()
    };

    alert("Salvo com sucesso!");
    console.log('Payload cadastro:', payload);
    // fetch('/api/save', { method:'POST', body:JSON.stringify(payload) ...});
});


