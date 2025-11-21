let cardContainer = document.querySelector(".card-container");
let campoBusca = document.querySelector("header input")
let dados = [];

// Carregar dados ao iniciar
async function carregarDadosIniciais() {
    try {
        let resposta = await fetch("data.json");
        dados = await resposta.json();
        renderizarCards(dados);  // Renderiza todos ao abrir
    } catch (error) {
        console.error("Falha ao buscar dados:", error);
    }
}

carregarDadosIniciais();

// Busca
async function iniciarBusca() {
    const termoBusca = campoBusca.value.toLowerCase();
    const dadosFiltrados = dados.filter(dado =>
        dado.nome.toLowerCase().includes(termoBusca) ||
        dado.descricao.toLowerCase().includes(termoBusca)
    );

    // NÃO precisamos limpar aqui, pois renderizarCards já faz a limpeza
    renderizarCards(dadosFiltrados);
}

// Renderizar cards
function renderizarCards(dadosLista) {
    // limpar o container antes de renderizar (centraliza a limpeza)
    cardContainer.innerHTML = "";

    for (let dado of dadosLista) {
        let article = document.createElement("article");
        article.classList.add("card");

        // adiciona o id para saber qual card foi clicado (sempre string)
        article.dataset.id = String(dado.id);

        article.innerHTML = `
            <h2>${dado.nome}</h2>
            <p>${dado.ano}</p>
            <p>${dado.descricao}</p>
            <a href="${dado.link}" target="_blank">Saiba mais</a>
            <img src="${dado.imagem}" alt="imagens,games">
        `;

        // evento de clique no card
        article.addEventListener("click", (event) => {

            // Se o clique foi no link (ou em dentro de um link), deixa o link agir normalmente
            if (event.target.closest("a")) {
                return;
            }

            // pega o id a partir do próprio article (evita problemas de closure)
            const idClicado = article.dataset.id;

            abrirCardUnico(idClicado);
        });

        cardContainer.appendChild(article);
    }
}

// Função para abrir card único
function abrirCardUnico(id) {
    // normaliza tipos e procura pelo id correto
    const dado = dados.find(item => String(item.id) === String(id));

    if (!dado) {
        console.error("abrirCardUnico: dado não encontrado para id =", id);
        return;
    }

    // Re-renderiza apenas o card selecionado
    cardContainer.innerHTML = `
        <article class="card">
            <h2>${dado.nome}</h2>
            <p>${dado.ano}</p>
            <p>${dado.descricao}</p>
            <a href="${dado.link}" target="_blank">Saiba mais</a>
            <img src="${dado.imagem}" alt="imagem">
        </article>
    `;
}

/* -------------------------------------------
   Detectar ENTER no input de busca (final do arquivo)
--------------------------------------------- */
campoBusca.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        iniciarBusca();
    }
});

