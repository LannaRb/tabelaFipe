const API = "https://brasilapi.com.br/api/fipe";

// Pega um elemento da página pelo id
function pegar(id) {
    return document.getElementById(id);
}

// Limpa uma lista suspensa e deixa só a opção padrão
function limpar(id, texto) {
    pegar(id).innerHTML = `<option value="">${texto}</option>`;
}

// Preenche uma lista suspensa com opções
function preencher(id, lista, campoValor, campoTexto) {
    const caixa = pegar(id);

    lista.forEach(function (item) {
        caixa.innerHTML += `<option value="${item[campoValor]}">${item[campoTexto]}</option>`;
    });
}

// Faz a requisição e devolve os dados
async function buscarDados(url, mensagemErro) {
    const resposta = await fetch(url);

    if (!resposta.ok) {
        throw new Error(mensagemErro);
    }

    return await resposta.json();
}


// 1. Carregar marcas
async function buscarMarcas() {
    const tipo = pegar("tipoVeiculo").value;

    limpar("marcas", "Selecione uma marca");
    limpar("modelos", "Selecione um modelo");
    limpar("anos", "Selecione um ano");
    pegar("preco").innerHTML = "";

    if (!tipo) return;

    try {
        const marcas = await buscarDados(`${API}/marcas/v1/${tipo}`, "Erro ao buscar marcas");
        preencher("marcas", marcas, "valor", "nome");
    } catch (erro) {
        alert(erro.message);
    }
}


// 2. Carregar modelos
async function buscarModelos() {
    const tipo = pegar("tipoVeiculo").value;
    const marca = pegar("marcas").value;

    limpar("modelos", "Selecione um modelo");
    limpar("anos", "Selecione um ano");

    if (!marca) return;

    try {
        const modelos = await buscarDados(`${API}/veiculos/v1/${tipo}/${marca}`, "Erro ao buscar modelos");
        preencher("modelos", modelos, "valor", "modelo");
    } catch (erro) {
        alert(erro.message);
    }
}


// 3. Carregar anos
async function buscarAnos() {
    const tipo = pegar("tipoVeiculo").value;
    const marca = pegar("marcas").value;
    const modelo = pegar("modelos").value;

    limpar("anos", "Selecione um ano");

    if (!modelo) return;

    try {
        const anos = await buscarDados(`${API}/anos/v1/${tipo}/${marca}/${modelo}`, "Erro ao buscar anos");
        preencher("anos", anos, "valor", "nome");
    } catch (erro) {
        alert(erro.message);
    }
}


// 4. Consultar preço
async function consultarPreco() {
    const tipo = pegar("tipoVeiculo").value;
    const marca = pegar("marcas").value;
    const modelo = pegar("modelos").value;
    const ano = pegar("anos").value;

    if (!tipo || !marca || !modelo || !ano) {
        alert("Selecione todas as informações!");
        return;
    }

    try {
        const dados = await buscarDados(
            `${API}/detalhes/v1/${tipo}/${marca}/${modelo}/${ano}`,
            "Erro ao consultar FIPE"
        );

        mostrarResultado(dados);
    } catch (erro) {
        alert(erro.message);
    }
}


// Mostra os dados na tela
function mostrarResultado(dados) {
    const resultado = pegar("preco");
    resultado.innerHTML = "";

    for (let chave in dados) {
        let valor = dados[chave];

        if (typeof valor === "object") {
            valor = JSON.stringify(valor);
        }

        resultado.innerHTML += `<p class="informacao"><strong>${chave}: </strong>${valor}</p>`;
    }
}