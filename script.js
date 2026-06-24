
// ref DOM
const inputBusca = document.getElementById('input-busca');
const btnBuscar = document.getElementById('btn-buscar');
const containerResultados = document.getElementById('container-resultados');
const containerFavoritos = document.getElementById('container-favoritos');
const erroValidacao = document.getElementById('erro-validacao');

// ajax 
function buscarAgentes() {
    const termo = inputBusca.value.trim().toLowerCase();
    if (termo.length < 0) {
        erroValidacao.textContent = "Digite pelo menos 3 caracteres.";
        return;
    }
    erroValidacao.textContent = "";

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://valorant-api.com/v1/agents?language=pt-BRisPlayableCharacter=true', true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const resposta = JSON.parse(xhr.responseText);

            // filtragem por nome
            const filtrados = resposta.data.filter(a =>
                a.displayName.toLoweCase().includes(termo));
                renderizarCards(filtrados, containerResultados, true);
        }
    };
    xhr.send();
}

// cards
function renderizarCards(lista, container, botaoFavoritar) {
    container.innerHTML = "";
    lista.forEach(agente => {
        const div = documento.createElement('div');
        div.innerHTML = `
        <img src="${agente.displayIcon}" alt="${agente.displayName}">
        <h3>${agente.displayName}</h3>
        ${botaoFavoritar
            ? `<button class="btn-acao" onclick="adicionarFavorito('${agente.uuid}', '${agente.displayName}', '${agente.displayIcon}')">ADICIONAR À EQUIPE</button>`
            : `<button class="btn-acao" style="border-color:#7e7e7e; color: #7e7e7e" 
            onclick= "removerFavorito('${agente.uuid}')">DISPENSAR</button>`
            }
        `;
        container.appendChild(div);
    });
}
// localStorage
function adicionarFavorito(uuid,nome,icone) {

    let favs = JSON.parse(localStorage.getItem('valorant_favs')) || [];

    if (favs.find(f => f.uuid === uuid)) {
        alert("Este agente já está na sua equipe!");
        return;
    }
    favs.push({ uuid, nome, icone});
    localStorage.setItem('valorant_favs', JSON.stringify(favs));
    carregarFavoritos();
}
function carregarFavoritos() {
    const favs = JSON.parse(localStorage.getItem('valorant_favs')) || []

containerFavoritos.innerHTML = "";
    favs.forEach( f => {
        const div = document.createElement('div');
        div.className =  'card-agente';
        div.innerHTML = ` <img src="${f.icone}" alt="${f.nome}" style="width: 80px">
            <h3>${f.nome}</h3>
            <button class="btn-acao" onclick="removerFavorito('${f.uuid}')">REMOVER</button>
        `;
        containerFavoritos.appendChild(div);
    });
}
    
