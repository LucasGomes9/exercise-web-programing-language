const express = require("express");
const app = express();
app.use(express.json());



const produto = [
    {id: "1", nomeDoProduto: "Notebook", quantidade: 40, valorUnitario: 5000, complemento: "um notebook",
     precoTotal: "" , precoDeVenda: "" , lucro: "" , situacaoDoProduto: ""}
];

// criei essa variável para de forma mais fácil saber qual o indice quando pesquisar pelo id, pois caso
// não fizesse dessa forma ia ter que fazer de outra maneira mais complexa ai preferi deixar de forma básica
let index = '';

//iniciar o array de forma correta
handleObj(produto[0]);

app.use((req, res, next) => {
    console.log("Controle de Estoque da Empresa ABC")
    return next()
});

/// criei essa function para diminuir o código ele só pega o obj do produto faz a alteração com as
//fórmulas dadas e retorna o obj
function handleObj(prod){
    let tot = prod.quantidade*prod.valorUnitario
    prod.precoTotal = tot
    let precVenda = prod.valorUnitario*1.20
    prod.precoDeVenda = precVenda
    let vaLucro = prod.precoDeVenda - prod.valorUnitario
    prod.lucro = vaLucro

  
    prod.situacaoDoProduto = checkSituation(prod.quantidade)

    return prod;
}

// function para verificar situação do produto
function checkSituation(quantidade){

    let situacaoProd = ''

    if(quantidade < 50) {
        situacaoProd = "Situaçao é estavel"
    } else if(quantidade >= 50 && quantidade < 100){
        situacaoProd = "Situação é boa"
    } else {
        situacaoProd = "Situaçao é excelente"
    }

    return situacaoProd;
}



// verificação de id do produto para não repetir várias vezes
const checkIdProduto = (req, res, next) => {
    const {indice} = req.params

    //verifica se existe id no array
    const exists = produto.some((obj, id) =>{

        //atribuindo o valor do índice para a variável global para recuperar dps
        index = id;
        
        if(obj.id === indice)
        {
            return true;
        }else{
            return false;
        }
    }); 



    if(!exists){
        return res
            .status(400)
            .json({error: "Não existe Produto com este id"})
    }
    return next()
};

// verificação de atributos do produto para não repetir várias vezes
//letra E checa o complemento

const checkAtributos = (req, res, next) =>{
    const {id, nomeDoProduto, quantidade, valorUnitario, complemento} = req.body
    if(!id || !nomeDoProduto || !quantidade || !valorUnitario || !complemento) {
        return res
            .status(400)
            .json({error: "O campo id do produto ou nome do produto ou quantidade ou valor unitario ou complemento não existe no corpo da requisição"})
    }
    return next()
}

// verificação de atributos do produto para não repetir várias vezes
//letra F não checa o complemento
const checkAtributos2 = (req, res, next) =>{
    const {id, nomeDoProduto, quantidade, valorUnitario} = req.body
    if(!id || !nomeDoProduto || !quantidade || !valorUnitario) {
        return res
            .status(400)
            .json({error: "O campo id do produto ou nome do produto ou quantidade ou valor unitario não existe no corpo da requisição"})
    }
    return next()
}

// rota para retorno de todos os produtos
app.get("/produtos", (req, res) => {
    return res.json(produto)
});


// listar os produtos pelo id
app.get("/produtos/:indice", checkIdProduto, (req, res) => {
    return res.json(produto[index])
});


//  incluir o produto no array
//poderia ter criado uma function para fazer o calculo e retornar o obj já alterado, mas como
//
app.post("/produtos", checkAtributos, (req, res) => {
    const prod = req.body

    produto.push(handleObj(prod))

    return res.json(prod)
})

// alterar o produto
app.put("/produtos/:indice", checkAtributos2, checkIdProduto, (req, res) =>{
    const prod = req.body

    let produtos = handleObj(prod)
    
    produto[index] = produtos

    return res.json(produtos)
})

// excluir um produto pelo id.
app.delete("/produtos/:indice" , checkIdProduto, (req, res) => {
    console.log(produto[index])
    produto.splice(index, 1)
    return res.json(produto)
})

//add novo complemento no array de complementos
app.post("/produtos/:indice/complemento", checkIdProduto, (req, res) =>{
    const {complemento} = req.body
    produto[index].complemento = complemento
    return res.json(produto[index])
})



app.listen(3333, () => {
    console.log("Servidor Online")
});