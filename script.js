
// ref DOM
const inputBusca = document.getElementById('input-busca');
const btnBuscar = document.getElementById('btn-buscar');
const containerResultados = document.getElementById('container-resultados');
const containerFavoritos = document.getElementById('container-favoritos');
const erroValidacao = document.getElementById('erro-validacao');

// ajax 
function buscarAgentes() {
    const termo = inputBusca.value.trim().toLowerCase();
    
    // Corrigido para validar os 3 caracteres (Requisito 4)
    if (termo.length < 3) {
        erroValidacao.textContent = "Digite pelo menos 3 caracteres.";
        return;
    }
    erroValidacao.textContent = "";

    const xhr = new XMLHttpRequest();
    // adicionado o '&' na URL
    xhr.open('GET', 'https://valorant-api.com/v1/agents?language=pt-BR&isPlayableCharacter=true', true);
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const resposta = JSON.parse(xhr.responseText);

            // toLowerCase() com 'r'
            const filtrados = resposta.data.filter(a =>
                a.displayName.toLowerCase().includes(termo)
            );
            renderizarCards(filtrados, containerResultados, true);
        }
    };
    xhr.send();
}

// cards
function renderizarCards(lista, container, botaoFavoritar) {
    container.innerHTML = "";
    lista.forEach(agente => {
        // era 'documento', mudei para 'document'
        const div = document.createElement('div');
        div.className = 'card-agente'; // adicionado para pegar o estilo do CSS
        div.innerHTML = `
        <img src="${agente.displayIcon}" alt="${agente.displayName}">
        <h3>${agente.displayName}</h3>
        ${botaoFavoritar
            ? `<button class="btn-acao" onclick="adicionarFavorito('${agente.uuid}', '${agente.displayName}', '${agente.displayIcon}')">ADICIONAR À EQUIPE</button>`
            : `<button class="btn-acao" style="border-color:#7e7e7e; color: #7e7e7e" 
            onclick="removerFavorito('${agente.uuid}')">DISPENSAR</button>`
            }
        `;
        container.appendChild(div);
    });
}

// localStorage
function adicionarFavorito(uuid, nome, icone) {
    let favs = JSON.parse(localStorage.getItem('valorant_favs')) || [];

    if (favs.find(f => f.uuid === uuid)) {
        alert("Este agente já está na sua equipe!");
        return;
    }
    favs.push({ uuid, nome, icone });
    localStorage.setItem('valorant_favs', JSON.stringify(favs));
    carregarFavoritos();
}

function carregarFavoritos() {
    const favs = JSON.parse(localStorage.getItem('valorant_favs')) || [];
    containerFavoritos.innerHTML = "";
    
    favs.forEach(f => {
        const div = document.createElement('div');
        div.className = 'card-agente';
        div.innerHTML = `
            <img src="${f.icone}" alt="${f.nome}" style="width: 80px">
            <h3>${f.nome}</h3>
            <button class="btn-acao" onclick="removerFavorito('${f.uuid}')">REMOVER</button>
        `;
        containerFavoritos.appendChild(div);
    });
}

function removerFavorito(uuid) {
    // faltava fechar a aspa simples em 'valorant_favs'
    let favs = JSON.parse(localStorage.getItem('valorant_favs')) || [];
    favs = favs.filter(f => f.uuid !== uuid);
    localStorage.setItem('valorant_favs', JSON.stringify(favs));
    carregarFavoritos();
}

// eventos
if(btnBuscar) {
    btnBuscar.addEventListener('click', buscarAgentes);
}
window.onload = carregarFavoritos;

// lupa do menu
const btnLupa = document.getElementById('btn-lupa');
const inputTopo = document.getElementById('input-busca-topo');

// clicar na lupa
btnLupa.addEventListener('click', function() {
    // on/off a classe que esconde o campo
    inputTopo.classList.toggle('escondido');
    
    // se ele apareceu, coloca o foco nele
    if (!inputTopo.classList.contains('escondido')) {
        inputTopo.focus();
    }
});

// faz a busca quando apertar ENTER
inputTopo.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const termo = inputTopo.value.trim();
        if (termo.length >= 3) {
            // preenche o campo de baixo automaticamente e busca
            const inputPrincipal = document.getElementById('input-busca');
            if(inputPrincipal) inputPrincipal.value = termo;
            
            buscarAgentes(); // função AJAX
            
            // rola a página para os resultados
            document.getElementById('container-resultados').scrollIntoView({ behavior: 'smooth' });
        } else {
            alert("Digite pelo menos 3 caracteres!");
        }
    }
});
