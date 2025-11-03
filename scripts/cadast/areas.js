// import { escapeHtml } from './utils-if-needed.js'; // opcional

export default function AreasModule({ inputSel, addBtnSel, suggestionsSel, tagListSel, mockAreas = [] } = {}) {
  const areaInput = document.querySelector(inputSel);
  const addAreaBtn = document.querySelector(addBtnSel);
  const suggestionsBox = document.querySelector(suggestionsSel);
  const tagList = document.querySelector(tagListSel);
  const selectedAreas = [];

// ===== MOCK TEMPORÁRIO =====
const listaAreas = [
  { Id: 1, Nome: "Matemática" },
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

  function renderTags() {
    tagList.innerHTML = '';
    selectedAreas.forEach(area => {
      const tag = document.createElement('div');
      tag.className = 'tag';
      tag.innerHTML = `<span>${area.Nome}</span><button aria-label="Remover área" data-id="${area.Id}">&times;</button>`;
      tag.querySelector('button').addEventListener('click', () => {
        removeAreaById(area.Id);
      });
      tagList.appendChild(tag);
    });
  }

  function addAreaByName(name) {
    name = (name || '').trim();
    if (!name) return;
    const found = mockAreas.find(a => a.Nome.toLowerCase() === name.toLowerCase());
    const newArea = found || { Id: Date.now(), Nome: name };
    if (!selectedAreas.some(a => a.Nome.toLowerCase() === newArea.Nome.toLowerCase())) {
      selectedAreas.push(newArea);
      renderTags();
    }
    areaInput.value = '';
    suggestionsBox.classList.add('hidden');
  }

  function removeAreaById(id) {
    const i = selectedAreas.findIndex(a => a.Id === id);
    if (i !== -1) selectedAreas.splice(i, 1);
    renderTags();
  }

  function setSelectedAreas(list) {
    selectedAreas.length = 0;
    (list || []).forEach(i => selectedAreas.push(i));
    renderTags();
  }

  function getSelectedAreas() { return selectedAreas.slice(); }



// ===== FUNÇÃO FUTURA PARA BUSCAR DA API =====
async function fetchAreas(query) {
  // Quando a API estiver pronta, basta descomentar e ajustar:
  // const response = await fetch(`https://suaapi.com/areas?search=${encodeURIComponent(query)}`);
  // if (!response.ok) throw new Error("Erro ao buscar áreas");
  // return await response.json();

  // Simulação temporária (mock)
  return listaAreas.filter(a => a.Nome.toLowerCase().includes(query.toLowerCase()));
}

// ===== AUTOCOMPLETE =====
areaInput.addEventListener('input', async () => {
  const q = areaInput.value.toLowerCase().trim();
  suggestionsBox.innerHTML = '';
  if (!q) {
    suggestionsBox.classList.add('hidden');
    return;
  }

  try {
    const areas = await fetchAreas(q);
    if (areas.length === 0) {
      suggestionsBox.classList.add('hidden');
      return;
    }

    areas.forEach(area => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      item.textContent = area.Nome;
      item.addEventListener('click', () => {
        areaInput.value = area.Nome;
        addAreaByName(area.Nome);
        suggestionsBox.classList.add('hidden'); // fecha após selecionar
      });
      suggestionsBox.appendChild(item);
    });

    suggestionsBox.classList.remove('hidden');
  } catch (err) {
    console.error('Erro ao carregar áreas:', err);
    suggestionsBox.classList.add('hidden');
  }
});

// ===== OPCIONAL: FECHAR AO CLICAR FORA =====
document.addEventListener('click', (e) => {
  if (!suggestionsBox.contains(e.target) && e.target !== areaInput) {
    suggestionsBox.classList.add('hidden');
  }
});

  return { renderTags, addAreaByName, getSelectedAreas, setSelectedAreas, removeAreaById };
}
