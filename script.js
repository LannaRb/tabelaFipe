
let marcas = [];

// Carregar marcas de acordo com o tipo de veículo
async function buscarMarcas() {

    const tipo = document.getElementById("tipoVeiculo").value;

    const caixaMarcas = document.getElementById("marcas");
    const caixaModelos = document.getElementById("modelos");
    const caixaAnos = document.getElementById("anos");

    caixaMarcas.innerHTML = '<option value="">Selecione uma marca</option>';
    caixaModelos.innerHTML = '<option value="">Selecione um modelo</option>';
    caixaAnos.innerHTML = '<option value="">Selecione um ano</option>';

    document.getElementById("preco").innerHTML = "";

    if (!tipo) return;

    try {

        const resposta = await fetch(
            "https://brasilapi.com.br/api/fipe/marcas/v1/" + tipo
        );

        if (!resposta.ok) {
            throw new Error("Erro ao buscar marcas");
        }

        marcas = await resposta.json();

        marcas.forEach(function (marca) {

            caixaMarcas.innerHTML +=
                `<option value="${marca.valor}">${marca.nome}</option>`;

        });

    } catch (erro) {
        alert(erro.message);
    }
}


// Carregar modelos da marca selecionada
async function buscarModelos() {

    const tipo = document.getElementById("tipoVeiculo").value;
    const marca = document.getElementById("marcas").value;

    const caixaModelos = document.getElementById("modelos");
    const caixaAnos = document.getElementById("anos");

    caixaModelos.innerHTML = '<option value="">Selecione um modelo</option>';
    caixaAnos.innerHTML = '<option value="">Selecione um ano</option>';

    if (!marca) return;

    try {

        const resposta = await fetch(
            `https://brasilapi.com.br/api/fipe/veiculos/v1/${tipo}/${marca}`
        );

        if (!resposta.ok) {
            throw new Error("Erro ao buscar modelos");
        }

        const modelos = await resposta.json();

        modelos.forEach(function (modelo) {

            caixaModelos.innerHTML +=
                `<option value="${modelo.valor}">${modelo.modelo}</option>`;

        });

    } catch (erro) {
        alert(erro.message);
    }
}


// Carregar anos do modelo selecionado
async function buscarAnos() {

    const tipo = document.getElementById("tipoVeiculo").value;
    const marca = document.getElementById("marcas").value;
    const modelo = document.getElementById("modelos").value;

    const caixaAnos = document.getElementById("anos");

    caixaAnos.innerHTML = '<option value="">Selecione um ano</option>';

    if (!modelo) return;

    try {

        const resposta = await fetch(
            `https://brasilapi.com.br/api/fipe/anos/v1/${tipo}/${marca}/${modelo}`
        );

        if (!resposta.ok) {
            throw new Error("Erro ao buscar anos");
        }

        const anos = await resposta.json();

        anos.forEach(function (ano) {

            caixaAnos.innerHTML +=
                `<option value="${ano.valor}">${ano.nome}</option>`;

        });

    } catch (erro) {
        alert(erro.message);
    }
}


// Consultar preço e detalhes do veículo
async function consultarPreco() {

    const tipo = document.getElementById("tipoVeiculo").value;
    const marca = document.getElementById("marcas").value;
    const modelo = document.getElementById("modelos").value;
    const ano = document.getElementById("anos").value;

    const resultado = document.getElementById("preco");

    if (!tipo || !marca || !modelo || !ano) {
        alert("Selecione todas as informações!");
        return;
    }

    try {

        const resposta = await fetch(
            `https://brasilapi.com.br/api/fipe/detalhes/v1/${tipo}/${marca}/${modelo}/${ano}`
        );

        if (!resposta.ok) {
            throw new Error("Erro ao consultar FIPE");
        }

        const dados = await resposta.json();

        console.log(dados);

        resultado.innerHTML = "";

        // Percorrer todas as informações retornadas pela API
        for (let informacao in dados) {

            const linha = document.createElement("p");
            linha.className = "informacao";

            const titulo = document.createElement("strong");
            titulo.textContent = informacao + ": ";

            const valor = document.createElement("span");

            valor.textContent =
                typeof dados[informacao] === "object"
                    ? JSON.stringify(dados[informacao])
                    : dados[informacao];

            linha.appendChild(titulo);
            linha.appendChild(valor);

            resultado.appendChild(linha);
        }

    } catch (erro) {
        alert(erro.message);
    }
}
