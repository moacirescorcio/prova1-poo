"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const readline_sync_1 = require("readline-sync");
class Perfil {
    constructor(id, nome, email) {
        if (this.validaId(id)) {
            this._id = id;
        }
        else {
            throw new Error("ID deve ser do tipo numero");
        }
        if (this.validaNome(nome)) {
            this._nome = nome;
        }
        else {
            throw new Error(" Nome nao pode conter numeros e carecteres");
        }
        this._email = email;
    }
    get id() {
        return this._id;
    }
    get nome() {
        return this._nome;
    }
    get email() {
        return this._email;
    }
    validaId(id) {
        return typeof id === 'number';
    }
    validaNome(nome) {
        return typeof nome === 'string';
    }
}
class Postagem {
    constructor(id, texto, curtidas, descurtidas, data, perfil) {
        this._id = id;
        this._texto = texto;
        this._curtidas = curtidas;
        this._descurtidas = descurtidas;
        this._data = new Date();
        this._perfil = perfil;
    }
    get id() {
        return this._id;
    }
    get texto() {
        return this._texto;
    }
    get curtidas() {
        return this._curtidas;
    }
    get descurtidas() {
        return this._descurtidas;
    }
    get data() {
        return this._data;
    }
    get perfil() {
        return this._perfil;
    }
    curtir() {
        this._curtidas++;
    }
    descurtir() {
        this._descurtidas++;
    }
    ehPopular() {
        if (this.curtidas > 1.5 * this.descurtidas) {
            return true;
        }
        else {
            return false;
        }
    }
}
class PostagemAvancada extends Postagem {
    constructor(id, texto, curtidas, descurtidas, data, perfil, hashtag, visualizacoesRestantes) {
        super(id, texto, curtidas, descurtidas, data, perfil);
        this._hashtags = hashtag;
        this._visualizacoesRestantes = visualizacoesRestantes;
    }
    get visualizacoesRestantes() {
        return this._visualizacoesRestantes;
    }
    adicionarHashtag(hashtag) {
        this._hashtags.push(hashtag);
    }
    existeHashtag(hashtag) {
        if (this._hashtags.includes(hashtag)) {
            return true;
        }
        return false;
    }
    decrementarVisualizacoes() {
        this._visualizacoesRestantes--;
        if (this._visualizacoesRestantes <= 0) {
            this._visualizacoesRestantes = 0;
        }
    }
}
class RepositorioDePerfis {
    constructor() {
        this._perfis = [];
    }
    incluir(perfil) {
        //verificar se existe o perfil
        for (let item of this._perfis) {
            if ((item.id === undefined || item.id == perfil.id) ||
                (item.nome === undefined || item.nome == perfil.nome) ||
                (item.email === undefined || item.email == perfil.email)) {
                console.log(" Perfil ja existe!");
                return;
            }
        }
        this._perfis.push(perfil);
        console.log(`Perfil: ${perfil.id} adicionado !`);
    }
    // consulta a exisetncia de um perfil a partir de um parametro e retorna o perfil ou null
    consultar(id, nome, email) {
        let resultadoPerfil = [];
        for (let item of this._perfis) {
            // considera a inserção ou não de parametros 
            if ((id === undefined || id === item.id) &&
                (nome === undefined || nome === item.nome) &&
                (email === undefined || email === item.email)) {
                resultadoPerfil.push(item);
            }
        }
        if (resultadoPerfil.length != 0) {
            return resultadoPerfil;
        }
        else {
            return null;
        }
    }
}
//ajeitei--------------------------
class RepositorioDePostagens {
    constructor() {
        this.postagens = [];
    }
    incluir(postagem) {
        let PostagemJaExiste = this.consultar(postagem.id, postagem.texto);
        if (PostagemJaExiste == null) {
            this.postagens.push(postagem);
        }
        else {
            console.log("Postagem já existente!");
        }
    }
    //ajeitei----------------------------
    consultar(id, texto, hashtag, perfil) {
        let postagensEncontrada = [];
        for (let item of this.postagens) {
            if ((id === undefined || item.id === id) &&
                (texto === undefined || item.texto === texto) &&
                (item instanceof PostagemAvancada
                    ? hashtag === undefined || item.existeHashtag(hashtag)
                    : true) && // Verifica se é uma instância de PostagemAvancada
                (perfil === undefined || item.perfil === perfil)) {
                postagensEncontrada.push(item);
            }
        }
        if (postagensEncontrada.length != 0) {
            return postagensEncontrada;
        }
        else {
            return null;
        }
    }
}
class RedeSocial {
    constructor(_RepositorioDePostagens, _RepositorioDePerfis) {
        this._RepositorioDePostagens = _RepositorioDePostagens;
        this._RepositorioDePerfis = _RepositorioDePerfis;
    }
    //i
    incluirPerfil(perfil) {
        this._RepositorioDePerfis.incluir(perfil);
    }
    //ii
    consultarPerfil(id, nome, email) {
        return this._RepositorioDePerfis.consultar(id, nome, email);
    }
    //iii
    incluirPostagem(postagem) {
        return this._RepositorioDePostagens.incluir(postagem);
    }
    //iv-----------ok--------------------------
    consultarPostagens(id, texto, hashtag, perfil) {
        return this._RepositorioDePostagens.consultar(id, texto, hashtag, perfil);
    }
    //v----------- ok-----------------------------
    curtir(idPostagem) {
        const postagem = this._RepositorioDePostagens.consultar(idPostagem);
        if (postagem) {
            for (let item of postagem) {
                item.curtir();
                console.log(`Você curtiu a postagem com ID ${idPostagem}`);
            }
        }
        else {
            console.log(`Postagem com ID ${idPostagem} não encontrada`);
        }
    }
    //vi-ok
    descurtir(idPostagem) {
        const postagem = this._RepositorioDePostagens.consultar(idPostagem);
        if (postagem) {
            for (let item of postagem) {
                item.descurtir();
                console.log(`Você descurtiu a postagem com ID ${idPostagem}`);
            }
        }
        else {
            console.log(`Postagem com ID ${idPostagem} não encontrada`);
        }
    }
    //vii
    decrementarVisualizacoes(postagem) {
        const postagens = this._RepositorioDePostagens.consultar(postagem.id);
        if (postagens) {
            for (let item of postagens) {
                if (item instanceof PostagemAvancada) {
                    item.decrementarVisualizacoes();
                    console.log('Vizualização decrementada!');
                }
            }
        }
        else {
            console.log("Postagem não econtrada!");
        }
    }
    //viii
    exibirPostagensPorPerfil(id) {
        const postagens = this.consultarPostagens(id);
        if (postagens != null) {
            for (let item of postagens) {
                if (item instanceof PostagemAvancada) {
                    item.decrementarVisualizacoes();
                }
            }
        }
        // Filtrando as postagens que ainda podem ser decrementadas
        if (postagens != null) {
            const filtroPostagens = postagens.filter((item) => {
                if (item instanceof PostagemAvancada) {
                    return item.visualizacoesRestantes > 0;
                }
                return true;
            });
            return filtroPostagens;
        }
        return null;
    }
    ///ix
    exibirPostagensPorHashtag(hashtag) {
        const postagens = this._RepositorioDePostagens.consultar(undefined, undefined, hashtag);
        if (postagens != null) {
            for (let item of postagens) {
                if (item instanceof PostagemAvancada) {
                    item.decrementarVisualizacoes();
                }
            }
        }
        // Filtrando as postagens que ainda podem ser decrementadas
        const filtroPostagens = [];
        if (postagens != null) {
            for (let item of postagens) {
                if (item instanceof PostagemAvancada && item.visualizacoesRestantes > 0) {
                    filtroPostagens.push(item);
                }
            }
            return filtroPostagens;
        }
        else {
            return null;
        }
    }
}
// Criando App;
class App {
    constructor(RedeSocial) {
        this._RedeSocial = RedeSocial;
    }
    Menu() {
        const opcoes = [
            '1. Criar Perfil',
            '1. Incluir Perfil',
            '2. Consultar Perfil',
            '3. Incluir Postagem',
            '4. Consultar Postagens',
            '5. Exibir Postagens por Perfil',
            '6. Sair'
        ];
        console.log('Bem-vindo ao sistema da Rede Social.');
        opcoes.forEach(opcao => console.log(opcao));
        let escolha = (0, readline_sync_1.question)(" Digite a opcao: ");
        this.opcoes(escolha);
    }
    ;
    opcoes(opcao) {
        switch (opcao) {
            case '1':
                console.log(`Digi`);
                console.log(`Crie um novo perfil!`);
                const novoPerfil = criarPerfil();
                this._RedeSocial.incluirPerfil(novoPerfil);
                console.log(`Perfil: ${novoPerfil.id} criado com sucesso!`);
                break;
            case '2':
                break;
            case '3':
                break;
            case '4':
                break;
            case '5':
                break;
            case '6':
                console.log(`Obrigado por usar nossa RedeSocia!`);
                break;
            default:
                console.log('Opção inválida. Tente novamente.');
                this.Menu();
        }
    }
}
