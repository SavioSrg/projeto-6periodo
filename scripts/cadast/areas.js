// import { escapeHtml } from './utils-if-needed.js'; // opcional
import { API_SABERMAIS_URL } from "../config/apiConfig.js";

export default function AreasModule({ inputSel, addBtnSel, suggestionsSel, tagListSel, mockAreas = [] } = {}) {
  console.log("mock: ", mockAreas)
  const areaInput = document.querySelector(inputSel);
  const addAreaBtn = document.querySelector(addBtnSel);
  const suggestionsBox = document.querySelector(suggestionsSel);
  const tagList = document.querySelector(tagListSel);

  // RENDERIZAR TAGS
  async function renderTags() {
    tagList.innerHTML = '';
    for (const area of mockAreas) {
      const areaNome = await buscarNomeArea(area.areaId);
      const tag = document.createElement('div');
      tag.className = 'tag';
      tag.innerHTML = `<span>${areaNome}</span>
        <button aria-label="Remover área" data-id="${area.areaId}">&times;</button>`;
      tag.querySelector('button').addEventListener('click', () => {
        removeAreaById(area.areaId);
      });
      tagList.appendChild(tag);
    };
  };


  // ADICIONAR ÁREA
  async function addAreaByName(name, id) {
    name = (name || '').trim();
    if (!name) return;

    // Busca o nome real da área
    const areaNome = await buscarNomeArea(id);
    if (!areaNome) return;

    // Verifica se já existe essa área no mockAreas (comparando por ID)
    const found = mockAreas.find(a => a.areaId === id);
    if (found) return; // já existe, não adiciona novamente

    // Cria novo objeto com o nome obtido da API
    const newArea = { areaId: id, nome: areaNome };
    mockAreas.push(newArea);

    console.log("Área adicionada:", newArea);
    await renderTags();

    areaInput.value = '';
    suggestionsBox.classList.add('hidden');
  }

  // REMOVER ÁREA
  function removeAreaById(id) {
    const i = mockAreas.findIndex(a => a.areaId === id);
    if (i !== -1) mockAreas.splice(i, 1);
    renderTags();
  }

  function setSelectedAreas(list) {
    mockAreas.length = 0;
    (list || []).forEach(i => mockAreas.push(i));
    renderTags();
  }

  function getSelectedAreas() { return mockAreas.slice(); }


  // BUSCAR LISTA DE ÁREAS (API)
  async function fetchAreas() {
    const token = localStorage.getItem("jwtToken");

    const response = await fetch(`${API_SABERMAIS_URL}/Areas`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

    if (!response.ok) throw new Error("Erro ao buscar áreas");
    return await response.json();
  }

  // BUSCAR NOME DE UMA ÁREA
  async function buscarNomeArea(idArea) {
    const token = localStorage.getItem("jwtToken");
    try {
      const resp = await fetch(`${API_SABERMAIS_URL}/Areas/${idArea}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if (!resp.ok) throw new Error("Erro ao buscar nome da área");
      const area = await resp.json();
      return area.nome || `Área ${idArea}`;
    } catch (erro) {
      console.error("Erro ao buscar nome da matéria:", erro);
      return false;
    }
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
      const areas = await fetchAreas();
      const areasFiltradas = areas.filter(a =>
        a.nome.toLowerCase().includes(q)
      );

      if (areasFiltradas.length === 0) {
        suggestionsBox.classList.add('hidden');
        return;
      }

      areasFiltradas.forEach(area => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.textContent = area.nome;
        item.addEventListener('click', async () => {
          areaInput.value = area.nome;
          await addAreaByName(area.nome, area.id);
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

  // FECHAR SUGESTÕES AO CLICAR FORA
  document.addEventListener('click', (e) => {
    if (!suggestionsBox.contains(e.target) && e.target !== areaInput) {
      suggestionsBox.classList.add('hidden');
    }
  });

  renderTags();

  return {
    renderTags,
    addAreaByName,
    getSelectedAreas,
    setSelectedAreas,
    removeAreaById
  };
}
