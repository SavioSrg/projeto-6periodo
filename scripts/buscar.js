   // >>>>>>>>>>>> CONFIGURE AQUI <<<<<<<<<<<<<<
    const API_URL = 'http://localhost:5041/api/professores'; // ajuste pra sua API
    const LIMITE_CARDS = 4;

    const listaEl = document.getElementById('profLista');
    const formBusca = document.querySelector('.search');
    const inputBusca = document.getElementById('q');

    function embaralhar(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    function criarCardProfessor(prof) {
      const tpl = document.getElementById('profCardTemplate');
      const clone = tpl.content.cloneNode(true);

      const article = clone.querySelector('.prof-card');
      article.setAttribute('data-id', prof.id ?? '');

      const fotoEl = clone.querySelector('.prof-card__foto');
      fotoEl.src = prof.fotoUrl || '../assets/images/default-prof.png';
      fotoEl.alt = 'Foto de ' + (prof.nome || 'Professor');

      clone.querySelector('.prof-card__nome').textContent =
        prof.nome ?? '';

      clone.querySelector('.prof-card__Conteúdo').textContent =
        prof.descricao ?? prof.area ?? prof.materia ?? '';

      clone.querySelector('.prof-card__Certificação').textContent =
        Array.isArray(prof.certificacoes)
          ? prof.certificacoes.join(', ')
          : (prof.certificacoes || '');

      clone.querySelector('.prof-card__Competencias').textContent =
        Array.isArray(prof.competencias)
          ? prof.competencias.join(', ')
          : (prof.competencias || '');

      clone.querySelector('.prof-card__cidade').textContent =
        '📍 ' + (prof.cidade || 'Local não informado');

      clone.querySelector('.prof-card__experiencia').textContent =
        '💼 ' + (
          prof.experiencia_anos != null
            ? prof.experiencia_anos + ' anos'
            : 'Experiência não informada'
        );

      clone.querySelector('.prof-card__preco').textContent =
        '💲 ' + (
          prof.valorHora != null
            ? `R$ ${Number(prof.valorHora).toFixed(2)}/h`
            : 'Valor não informado'
        );

      const linkPerfil = clone.querySelector('.ver-perfil-link');
      linkPerfil.href = 'Contratar.html?id=' + (prof.id ?? '');

      return clone;
    }

    function mostrarLista(professores) {
      listaEl.innerHTML = '';

      if (!Array.isArray(professores) || professores.length === 0) {
        listaEl.innerHTML = `
        <article class="prof-card">
          <div class="prof-card__body">
            <h3 class="prof-card__nome">Nenhum professor encontrado.</h3>
            <p class="prof-card__Conteúdo">Tente outro termo.</p>
          </div>
        </article>
      `;
        return;
      }

      professores.forEach(p => {
        listaEl.appendChild(criarCardProfessor(p));
      });
    }

    async function buscarNaApi() {
      const resp = await fetch(API_URL, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });

      if (!resp.ok) {
        throw new Error('Erro HTTP ' + resp.status);
      }

      const data = await resp.json();
      return Array.isArray(data) ? data : [];
    }

    async function carregarProfessoresAleatorios() {
      listaEl.innerHTML = `
      <article class="prof-card">
        <div class="prof-card__body">
          <h3 class="prof-card__nome">Carregando professores...</h3>
        </div>
      </article>
    `;

      try {
        let professores = await buscarNaApi();
        professores = embaralhar(professores).slice(0, LIMITE_CARDS);
        mostrarLista(professores);
      } catch (err) {
        console.error(err);
        listaEl.innerHTML = `
        <article class="prof-card">
          <div class="prof-card__body">
            <h3 class="prof-card__nome">Erro ao carregar</h3>
            <p class="prof-card__Conteúdo">${err.message}</p>
          </div>
        </article>
      `;
      }
    }

    async function carregarProfessoresFiltrados(termo) {
      listaEl.innerHTML = `
      <article class="prof-card">
        <div class="prof-card__body">
          <h3 class="prof-card__nome">Buscando "${termo}"...</h3>
        </div>
      </article>
    `;

      try {
        let professores = await buscarNaApi();

        const termoLower = termo.toLowerCase().trim();

        if (termoLower !== '') {
          professores = professores.filter(p => {
            const nome = (p.nome || '').toLowerCase();
            const desc = (p.descricao || p.area || p.materia || '').toLowerCase();

            const compArray = Array.isArray(p.competencias)
              ? p.competencias
              : [p.competencias];
            const compTxt = compArray
              .filter(Boolean)
              .join(' ')
              .toLowerCase();

            return (
              nome.includes(termoLower) ||
              desc.includes(termoLower) ||
              compTxt.includes(termoLower)
            );
          });
        }

        mostrarLista(professores);
      } catch (err) {
        console.error(err);
        listaEl.innerHTML = `
        <article class="prof-card">
          <div class="prof-card__body">
            <h3 class="prof-card__nome">Erro na busca</h3>
            <p class="prof-card__Conteúdo">${err.message}</p>
          </div>
        </article>
      `;
      }
    }

    // --- Eventos ---

    // busca manual (submit da barra de pesquisa)
    formBusca.addEventListener('submit', (e) => {
      e.preventDefault();
      const termo = inputBusca.value || '';
      carregarProfessoresFiltrados(termo);
    });

    // carregamento inicial: mostra aleatórios
    carregarProfessoresAleatorios();