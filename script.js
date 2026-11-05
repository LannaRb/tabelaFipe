// Guarda as marcas vindas da API numa variavel
let marcas = [];

// Function para carregar as marcas na lista de sugestões da página
async function buscarMarcas() {
    // Pede as marcas para a API
    const resposta = await fetch("https://brasilapi.com.br/api/fipe/marcas/v1/carros");
    // Converte a resposta em array
    marcas = await resposta.json();

    // Pega a lista de sugestões e limpa a lista
    const lista = document.getElementById("listaMarcas")
    lista.innerHTML = "";

    // Para cada marca adiciona uma opção na lista
    marcas.forEach(function (marca) {
        lista.innerHTML +=
            "<option value='" + marca.nome + "'>"
    })
}

// Function para carregar os modelos da marca digitada
async function buscarModelos() {
    // Pega o nome digitado
    const nomeDigitado = document.getElementById("pesquisaMarca").value;
    // Procura a marca com esse nome e ignora o case
    const marcaEncontrada = marcas.find(function (marca) {
        return marca.nome.toLowerCase() === nomeDigitado.toLowerCase();
    });
    // Se não achou a marca avisa o usuário que não foi encontrado
    if (!marcaEncontrada) {
        alert("Selecione uma marca válida da lista!");
        return;
    }
    // Guarda o código da marca no campo "resultado"
    document.getElementById("resultado").value = marcaEncontrada.valor;
    // Guarda o código em uma variável
    const marca = marcaEncontrada.valor;
    // Pede os modelos dessa marca para a API
    const resposta = await fetch("https://brasilapi.com.br/api/fipe/veiculos/v1/carros/" + marca);
    // Converte a resposta em array
    const modelos = await resposta.json();
    // Pega o campo de modelos e limpa o campo
    const caixaModelos = document.getElementById("modelos");
    caixaModelos.innerHTML = "";
    // Para cada modelo adiciona uma opção no campo
    modelos.forEach(function (modelo) {
        caixaModelos.innerHTML += "<option value = '" + modelo.valor + "'>" + modelo.modelo + "</option>"
    });
}

// Function para carregar os anos do modelo escolhido
async function buscarAnos() {
    // Pega o código da marca
    const marca = document.getElementById("resultado").value;
    // Pega o modelo escolhido
    const modelo = document.getElementById("modelos").value;
    // Mostra a marca no console
    console.log("Marca:", marca);
    // Mostra o modelo no console
    console.log("Modelo:", modelo);
    // Pede os anos à API
    const resposta = await fetch(
        "https://brasilapi.com.br/api/fipe/anos/v1/carros/" + marca + "/" + modelo
    );
    // Se a API deu erro mostra o erro no console
    if (!resposta.ok) {
        console.log("Erro na API:", resposta.status);
        return;
    }
    // Converte a resposta em array
    const anos = await resposta.json();
    // Pega o campo de anos e limpa o campo
    const caixaAnos = document.getElementById("anos");
    caixaAnos.innerHTML = "";
    // Para cada ano adiciona uma opção no campo
    anos.forEach(function (ano) {
        caixaAnos.innerHTML +=
            "<option value ='" + ano.valor + "'>" + ano.nome + "</option>";
    });
};

// Function para consultar e mostrar o preço FIPE
async function consultarPreco() {
    // Pega a marca
    const marca = document.getElementById("resultado").value;
    // Pega o modelo
    const modelo = document.getElementById("modelos").value;
    // Pega o ano
    const ano = document.getElementById("anos").value;
    // Se faltar algum dos três avisa o usuário
    if (!marca || !modelo || !ano) {
        alert("Selecione marca, modelo e ano!");
        return;
    }
    // Pede o preço à API
    const resposta = await fetch(
        "https://brasilapi.com.br/api/fipe/detalhes/v1/carros/" + marca + "/" + modelo + "/" + ano
    );
    // Se a API deu erro avisa o usuário
    if (!resposta.ok) {
        alert("Erro ao consultar preço!");
        return;
    }
    // Converte a resposta em objeto
    const dados = await resposta.json();
    // Mostra os dados no console
    console.log(dados);
    // Mostra o valor FIPE na tela
    document.getElementById("preco").innerText = "valor FIPE: " + dados.valor;
}
