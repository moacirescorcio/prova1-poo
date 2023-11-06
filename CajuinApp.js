"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_sync_1 = require("readline-sync");
const fs = __importStar(require("fs"));
class Perfil {
    constructor(id, nome, email) {
        if (this.validaId(id)) {
            this._id = id;
        }
        else {
            throw new Error("ID deve ser do tipo numero!\n");
        }
        if (this.validaNome(nome)) {
            this._nome = nome;
        }
        else {
            throw new Error(" Nome nao pode conter numeros e carecteres\n");
        }
        this._email = email;
        this._seguidores = [];
        this._seguindo = [];
    }
    get seguidores() {
        return this._seguidores;
    }
    get seguindo() {
        return this._seguindo;
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
    get hashtag() {
        return this._hashtags;
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
class RepositorioDePostagens {
    constructor() {
        this.Postagens = [];
    }
    incluirPostagem(postagem) {
        //verificar se existe o perfil
        for (let item of this.Postagens) {
            if ((item.id === undefined || item.id == postagem.id) &&
                (item.texto === undefined || item.texto == postagem.texto) &&
                (item.curtidas === undefined || item.curtidas == postagem.curtidas) &&
                (item.descurtidas === undefined || item.descurtidas == postagem.descurtidas) &&
                (item.data === undefined || item.data == postagem.data) &&
                (item.perfil === undefined || item.perfil == postagem.perfil)) {
                console.log(" Postagem ja existe!\n");
                return;
            }
        }
        this.Postagens.push(postagem);
    }
    // Modifique o tipo de perfil para number
    consultar(id, texto, hashtag, perfil) {
        let postagensEncontrada = [];
        for (let item of this.Postagens) {
            if ((id === undefined || item.id === id) &&
                (texto === undefined || item.texto === texto) &&
                (item instanceof PostagemAvancada
                    ? hashtag === undefined || item.existeHashtag(hashtag)
                    : true) && // Verifica se é uma instância de PostagemAvancada
                (perfil === undefined || item.perfil.id === perfil)) {
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
    listarTodasAsPostagens() {
        const todasPostagens = [];
        for (let item of this.Postagens) {
            if (item instanceof PostagemAvancada) {
                if (item.visualizacoesRestantes === 0) {
                    continue; // Não adiciona postagens avançadas com 0 visualizações
                }
            }
            todasPostagens.push(item);
        }
        return todasPostagens;
    }
    excluirPostagem(id) {
        let postagem = this.consultar(id);
        if (postagem != null) {
            for (let item of postagem) {
                let index = this.Postagens.indexOf(item);
                if (index !== -1) {
                    this.Postagens.splice(index, 1); // Remove o perfil na posição 'index'
                    console.log(`Postagem com ID ${id} excluído com sucesso.`);
                }
            }
        }
        else {
            console.log(`Postagem com ID ${id} não encontrado.`);
        }
    }
}
class RepositorioDePerfis {
    constructor() {
        this._perfis = [];
    }
    incluir(perfil) {
        for (let item of this._perfis) {
            if ((item.id === perfil.id || item.nome === perfil.nome || item.email === perfil.email)) {
                console.log("Perfil já existe!\n");
                return;
            }
        }
        this._perfis.push(perfil);
    }
    consultar(id, nome, email) {
        if (isNaN(id)) {
            for (let item of this._perfis) {
                if ((nome === undefined || nome === item.nome || nome === '') &&
                    (email === undefined || email === item.email || email === '')) {
                    return item;
                }
            }
        }
        else {
            for (let item of this._perfis) {
                if ((id === undefined || id === item.id) &&
                    (nome === undefined || nome === item.nome || nome === '') &&
                    (email === undefined || email === item.email || email === '')) {
                    return item;
                }
            }
        }
        return null;
    }
    obterPerfis() {
        return this._perfis;
    }
    excluirPerfil(id) {
        let perfil = this.consultar(id);
        if (perfil != null) {
            let index = this._perfis.indexOf(perfil);
            if (index !== -1) {
                this._perfis.splice(index, 1); // Remove o perfil na posição 'index'
                console.log(`Perfil com ID ${id} excluído com sucesso.`);
            }
            else {
                console.log(`Perfil com ID ${id} não encontrado no array.`);
            }
        }
        else {
            console.log(`Perfil com ID ${id} não encontrado.`);
        }
    }
}
class RedeSocial {
    constructor(_RepositorioDePostagens, _RepositorioDePerfis) {
        this._RepositorioDePostagens = _RepositorioDePostagens;
        this._RepositorioDePerfis = _RepositorioDePerfis;
        this.ArquivoPerfil = "./ListaPerfil.csv";
        this.ArquivoPostagem = "./ListaPostagens.csv";
        this.ArquivoPostagemAvancada = "./ListaPostagenAvancada.csv";
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
        return this._RepositorioDePostagens.incluirPostagem(postagem);
    }
    //iv
    consultarPostagens(id, texto, hashtag, perfil) {
        return this._RepositorioDePostagens.consultar(id, texto, hashtag, perfil);
    }
    //v
    curtir(idPostagem) {
        const postagem = this._RepositorioDePostagens.consultar(idPostagem);
        if (postagem) {
            for (let item of postagem) {
                item.curtir();
                console.log(`Você curtiu a postagem com ID ${idPostagem}\n`);
            }
        }
        else {
            console.log(`Postagem com ID ${idPostagem} não encontrada\n`);
        }
    }
    //vi
    descurtir(idPostagem) {
        const postagem = this._RepositorioDePostagens.consultar(idPostagem);
        if (postagem) {
            for (let item of postagem) {
                item.descurtir();
                console.log(`Você descurtiu a postagem com ID ${idPostagem}\n`);
            }
        }
        else {
            console.log(`Postagem com ID ${idPostagem} não encontrada\n`);
        }
    }
    //vii
    decrementarVisualizacoes(idPostagem) {
        const postagens = this._RepositorioDePostagens.consultar(idPostagem);
        if (postagens) {
            for (let item of postagens) {
                if (item instanceof PostagemAvancada) {
                    item.decrementarVisualizacoes();
                    console.log('Vizualização decrementada!\n');
                }
            }
        }
        else {
            console.log("Postagem não econtrada!");
        }
    }
    exibirPostagensPorPerfil(id) {
        // ok
        const postagens = this._RepositorioDePostagens.consultar(undefined, undefined, undefined, id);
        if (postagens) {
            const postagensFiltradas = [];
            for (let item of postagens) {
                if (item instanceof PostagemAvancada) {
                    item.decrementarVisualizacoes();
                    postagensFiltradas.push(item);
                }
            }
            const filtroPostagens = postagensFiltradas.filter((item) => {
                if (item instanceof PostagemAvancada) {
                    return item.visualizacoesRestantes > 0;
                }
                return true;
            });
            return filtroPostagens.length > 0 ? filtroPostagens : null;
        }
        else {
            return null;
        }
    }
    exibirPostagensPorHashtag(hashtag) {
        const postagens = this._RepositorioDePostagens.consultar(undefined, undefined, hashtag);
        if (postagens != null) {
            for (let item of postagens) {
                if (item instanceof PostagemAvancada) {
                    item.decrementarVisualizacoes();
                }
            }
        }
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
    carregarDeArquivo() {
        //Importando os arquivos
        const dadosPerfis = fs.readFileSync(this.ArquivoPerfil, 'utf-8');
        const dadosPostagens = fs.readFileSync(this.ArquivoPostagem, 'utf-8');
        const dadosPostagensAvancadas = fs.readFileSync(this.ArquivoPostagemAvancada, 'utf-8');
        const linhasPerfis = dadosPerfis.split('\n');
        const linhasPostagens = dadosPostagens.split('\n');
        const linhasPostagensAvancadas = dadosPostagensAvancadas.split('\n');
        for (let linha of linhasPerfis) {
            const perfilData = linha.split(';');
            if (perfilData.length > 0) {
                const id = parseInt(perfilData[0]);
                const nome = perfilData[1];
                const email = perfilData[2];
                const perfil = new Perfil(id, nome, email);
                this._RepositorioDePerfis.incluir(perfil);
            }
        }
        for (let linha of linhasPostagens) {
            const DadosPostagens = linha.split(';');
            if (DadosPostagens.length > 0) {
                const id = parseInt(DadosPostagens[0]);
                const texto = DadosPostagens[1];
                const curtidas = parseInt(DadosPostagens[2]);
                const descurtidas = parseInt(DadosPostagens[3]);
                const data = new Date(DadosPostagens[4]);
                const perfilId = parseInt(DadosPostagens[5]);
                const perfil = this._RepositorioDePerfis.consultar(perfilId);
                if (perfil) {
                    const postagem = new Postagem(id, texto, curtidas, descurtidas, data, perfil);
                    this._RepositorioDePostagens.incluirPostagem(postagem);
                }
                else {
                    console.log(`Perfil inexistente para a postagem com ID ${id}!`);
                }
            }
        }
        for (let linha of linhasPostagensAvancadas) {
            const DadosPostagenAvancada = linha.split(';');
            if (DadosPostagenAvancada.length > 0) {
                const id = parseInt(DadosPostagenAvancada[0]);
                const texto = DadosPostagenAvancada[1];
                const curtidas = parseInt(DadosPostagenAvancada[2]);
                const descurtidas = parseInt(DadosPostagenAvancada[3]);
                const data = new Date(DadosPostagenAvancada[4]);
                const perfilId = parseInt(DadosPostagenAvancada[5]);
                const perfil = this._RepositorioDePerfis.consultar(perfilId);
                if (perfil) {
                    const hashtags = DadosPostagenAvancada[6].split(',');
                    const visualizacoesRestantes = parseInt(DadosPostagenAvancada[7]);
                    const postagemAvancada = new PostagemAvancada(id, texto, curtidas, descurtidas, data, perfil, hashtags, visualizacoesRestantes);
                    this.incluirPostagem(postagemAvancada);
                }
                else {
                    console.log(`Perfil inexistente para a postagem com ID ${id}!`);
                }
            }
        }
    }
    salvarEmArquivo() {
        try {
            // Salvando os perfis em um arquivo
            const dadosPerfis = this._RepositorioDePerfis.obterPerfis().map(perfil => `${perfil.id};${perfil.nome};${perfil.email}`).join('\n');
            fs.writeFileSync(this.ArquivoPerfil, dadosPerfis, 'utf-8');
            // Salvando as postagens em um arquivo
            const dadosPostagens = this._RepositorioDePostagens.Postagens.map(postagem => {
                const perfilId = postagem.perfil.id;
                const dataString = postagem.data.toISOString();
                return `${postagem.id};${postagem.texto};${postagem.curtidas};${postagem.descurtidas};${dataString};${perfilId}`;
            }).join('\n');
            fs.writeFileSync(this.ArquivoPostagem, dadosPostagens, 'utf-8');
            // Salvando as postagens avançadas em um arquivo
            const dadosPostagensAvancadas = this._RepositorioDePostagens.Postagens.filter(postagem => postagem instanceof PostagemAvancada).map(postagemAvancada => {
                const perfilId = postagemAvancada.perfil.id;
                const dataString = postagemAvancada.data.toISOString();
                const hashtags = postagemAvancada.hashtag.join(',');
                const visualizacoesRestantes = postagemAvancada.visualizacoesRestantes;
                return `${postagemAvancada.id};${postagemAvancada.texto};${postagemAvancada.curtidas};${postagemAvancada.descurtidas};${dataString};${perfilId};${hashtags};${visualizacoesRestantes}`;
            }).join('\n');
            fs.writeFileSync(this.ArquivoPostagemAvancada, dadosPostagensAvancadas, 'utf-8');
            console.log('Dados salvos com sucesso!');
        }
        catch (error) {
            console.error('Erro ao salvar os dados no arquivo:', error);
        }
    }
    //postagens populares:
    exibirPostagensPopulares() {
        const todasPostagens = this._RepositorioDePostagens.listarTodasAsPostagens();
        const postagensPopulares = [];
        for (let item of todasPostagens) {
            if (item.ehPopular()) {
                postagensPopulares.push(item);
            }
        }
        return postagensPopulares;
    }
    //FEED
    exibirTodasAsPostagens() {
        return this._RepositorioDePostagens.listarTodasAsPostagens();
    }
    //excluir perfil
    excluirPerfil(id) {
        return this._RepositorioDePerfis.excluirPerfil(id);
    }
    //excluir postagem
    excluirPostagem(id) {
        return this._RepositorioDePostagens.excluirPostagem(id);
    }
    //seguir perfil
    seguirPerfil(idPerfilSeguidor, idPerfilSeguido) {
        const perfilSeguidor = this._RepositorioDePerfis.consultar(idPerfilSeguidor);
        const perfilSeguido = this._RepositorioDePerfis.consultar(idPerfilSeguido);
        if (perfilSeguidor && perfilSeguido) {
            if (perfilSeguidor.seguindo.includes(idPerfilSeguido)) {
                console.log(`Você já está seguindo o perfil com ID ${idPerfilSeguido}.`);
            }
            else {
                perfilSeguidor.seguindo.push(idPerfilSeguido);
                perfilSeguido.seguidores.push(idPerfilSeguidor);
                console.log(`Você seguiu o perfil com ID ${idPerfilSeguido}.`);
            }
        }
        else {
            console.log("Perfis não encontrados. Certifique-se de que ambos os perfis existam.");
        }
    }
}
// Criando App;
class App {
    constructor(RedeSocial) {
        this._RedeSocial = RedeSocial;
    }
    Menu() {
        while (true) {
            const opcoes = [
                '1-Carregar de Arquivo',
                '2-Perfis',
                '3-Postagens',
                '4-Interações',
                '5-Salvar Arquivo',
                '6-Sair'
            ];
            console.log('\nBem-vindo ao sistema da Rede Social.');
            opcoes.forEach((opcao) => console.log(opcao));
            let opcaoPrincipal = (0, readline_sync_1.question)('Digite o número correspondente à opção principal: ');
            switch (opcaoPrincipal) {
                case '1':
                    this.opcao1();
                    break;
                case '2':
                    this.opcao2();
                    break;
                case '3':
                    this.opcao3();
                    break;
                case '4':
                    this.opcao4();
                    break;
                case '5':
                    this.opcao5();
                    break;
                case '6':
                    console.log('Obrigado por usar nossa Rede Social!');
                    return;
                default:
                    console.log('Opção inválida. Tente novamente.');
            }
        }
    }
    opcao1() {
        const carregarArquivos = parseInt((0, readline_sync_1.question)('Deseja carregar os dados de um arquivo? (1 - Sim, 0 - Não): '));
        if (carregarArquivos === 1) {
            this._RedeSocial.carregarDeArquivo();
            console.log('Dados do arquivo carregados com sucesso!');
        }
        else {
            console.log('Os dados do arquivo não foram carregados.');
        }
    }
    opcao2() {
        const opcoes = [
            '1-Criar Perfil',
            '2-Consultar Perfil',
            '3-Excluir um Perfil'
        ];
        console.log('\nOpções de perfis:');
        opcoes.forEach((opcao) => console.log(opcao));
        let opcaoSecundaria = (0, readline_sync_1.question)('Digite o número correspondente à opção de perfil: ');
        switch (opcaoSecundaria) {
            case '1':
                console.log(`Crie um novo perfil!\n`);
                const novoPerfil = DadosPerfil();
                this._RedeSocial.incluirPerfil(novoPerfil);
                console.log(`Perfil: ${novoPerfil.id} criado com sucesso!\n`);
                break;
            case '2':
                console.log(`Consulte um perfil\n`);
                const idconsulta = parseInt((0, readline_sync_1.question)('Digite o id do perfil: '));
                const nomeconsulta = (0, readline_sync_1.question)('Digite o nome do perfil: ');
                const emailconsulta = (0, readline_sync_1.question)('Digite o email do perfil: ');
                const resultado = this._RedeSocial.consultarPerfil(idconsulta, nomeconsulta, emailconsulta);
                mostrarPerfil(resultado);
                break;
            case '3':
                console.log(`Excluir um Perfil\n`);
                const id = parseInt((0, readline_sync_1.question)('Qual o ID do Perfil: '));
                this._RedeSocial.excluirPerfil(id);
                break;
            default:
                console.log('Opção inválida. Tente novamente.');
                this.Menu();
        }
    }
    opcao3() {
        const opcoes = [
            '1-Criar Postagem',
            '2-Consultar Postagem',
            '3-Exibir Postagem por Perfil',
            '4-Exibir Postagens por Hashtag',
            '5-Postagens Populares',
            '6-Apagar Postagem',
            '7-Listar Todas as Postagens'
        ];
        console.log('\nOpções de postagens:');
        opcoes.forEach((opcao) => console.log(opcao));
        let opcaoSecundaria = (0, readline_sync_1.question)('Digite o número correspondente à opção de postagem: ');
        switch (opcaoSecundaria) {
            case '1':
                console.log(`Criar Postagem\n`);
                const novaPostagem = DadosPostagem();
                this._RedeSocial.incluirPostagem(novaPostagem);
                break;
            case '2':
                console.log(`Consultar Postagem\n`);
                const id = parseInt((0, readline_sync_1.question)('Digite o id da postagem: '));
                const resultado = this._RedeSocial.consultarPostagens(id);
                MostrarPostagens(resultado);
                break;
            case '3':
                console.log(`Exibir Postagem por Perfil\n`);
                const idPerfil = parseInt((0, readline_sync_1.question)('Informe o Id do Perfil: '));
                const PostagensPerfil = this._RedeSocial.exibirPostagensPorPerfil(idPerfil);
                MostrarPostagens(PostagensPerfil);
                break;
            case '4':
                console.log(`Exibir Postagens por Hashtag\n`);
                const hashtag = (0, readline_sync_1.question)('Informe a hashtag que deseja procurar: ');
                const PostagemPorHashtag = this._RedeSocial.exibirPostagensPorHashtag(hashtag);
                MostrarPostagens(PostagemPorHashtag);
                break;
            case '5':
                console.log(`Postagens Populares\n`);
                const PostagensPopulares = this._RedeSocial.exibirPostagensPopulares();
                MostrarPostagens(PostagensPopulares);
                break;
            case '6':
                console.log(`Apagar Postagem\n`);
                const idPostagem = parseInt((0, readline_sync_1.question)('Informe o ID da Postagem que deseja apagar: '));
                this._RedeSocial.excluirPostagem(idPostagem);
                break;
            case '7':
                console.log(`Listar Todas as Postagens\n`);
                const todasPostagens = this._RedeSocial.exibirTodasAsPostagens();
                MostrarPostagens(todasPostagens);
                break;
        }
    }
    opcao4() {
        const opcoes = [
            '1-Curtir Postagem',
            '2-Descurtir Postagem',
            '3-Decrementar Visualização',
            '4-Seguir Perfil'
        ];
        console.log('\nOpções de interações:');
        opcoes.forEach((opcao) => console.log(opcao));
        let opcaoSecundaria = (0, readline_sync_1.question)('Digite o número correspondente à opção de interação: ');
        switch (opcaoSecundaria) {
            case '1':
                console.log(`Curtir Postagem\n`);
                const idPostCurtida = parseInt((0, readline_sync_1.question)('Informe o ID da Postagem que deseja curtir: '));
                this._RedeSocial.curtir(idPostCurtida);
                break;
            case '2':
                console.log(`Descurtir Postagem\n`);
                const idPostDescurtida = parseInt((0, readline_sync_1.question)('Informe o ID da Postagem que deseja descurtir: '));
                this._RedeSocial.descurtir(idPostDescurtida);
                break;
            case '3':
                console.log(`Decrementar Visualização\n`);
                const idPostDecrementar = parseInt((0, readline_sync_1.question)('Informe o ID da Postagem que deseja decrementar a visualização: '));
                this._RedeSocial.decrementarVisualizacoes(idPostDecrementar);
                break;
            case '4':
                console.log(`Seguir Perfil\n`);
                const idPerfilSeguidor = parseInt((0, readline_sync_1.question)('Digite o ID do perfil seguidor: '));
                const idPerfilSeguido = parseInt((0, readline_sync_1.question)('Digite o ID do perfil que deseja seguir: '));
                this._RedeSocial.seguirPerfil(idPerfilSeguidor, idPerfilSeguido);
                break;
        }
    }
    opcao5() {
        const opcoes = [
            '1-Salvar em Arquivo',
            '2-Nao Salvar'
        ];
        console.log('\nOutras opções:');
        opcoes.forEach((opcao) => console.log(opcao));
        let opcaoSecundaria = (0, readline_sync_1.question)('Digite o número correspondente à outra opção: ');
        switch (opcaoSecundaria) {
            case '1':
                this._RedeSocial.salvarEmArquivo();
                break;
            default:
                console.log('Opção inválida. Tente novamente.');
                this.Menu();
        }
    }
}
function DadosPerfil() {
    const id = parseInt((0, readline_sync_1.question)("Digite o ID: "));
    const nome = (0, readline_sync_1.question)("Digite o nome: ");
    const email = (0, readline_sync_1.question)("Digite o email: ");
    const novoPerfil = new Perfil(id, nome, email);
    return novoPerfil;
}
function mostrarPerfil(perfil) {
    if (perfil !== null) {
        console.log(`>>Dados do Perfil:`);
        console.log(`\nId: ${perfil.id}`);
        console.log(`Nome ${perfil.nome}`);
        console.log(`e-mail: ${perfil.email} `);
        console.log(`Seguindo: ${perfil.seguindo.length}`);
        console.log(`Seguidores: ${perfil.seguidores.length}\n`);
    }
    else {
        console.log(`Perfil nao encontrado!\n`);
    }
}
function DadosPostagem() {
    const id = parseInt((0, readline_sync_1.question)("Digite o ID postagem: "));
    const texto = (0, readline_sync_1.question)("Digite texto: ");
    const curtidas = parseInt((0, readline_sync_1.question)("Digite o numero de curtidas: "));
    const descurtidas = parseInt((0, readline_sync_1.question)("Digite o numero de descurtidas: "));
    const data = new Date();
    const idPerfil = parseInt((0, readline_sync_1.question)("Digite ID do perfil: "));
    const perfil = repositorioDePerfis.consultar(idPerfil);
    if (perfil != null) {
        const avancadaOuN = parseInt((0, readline_sync_1.question)("Deseja adicionar hashtags e visualizações? 1- SIM 2-NÃO"));
        if (avancadaOuN == 1) {
            const hashtag = [(0, readline_sync_1.question)("Digite a hashtag: ")];
            const visualizacoes = parseInt((0, readline_sync_1.question)("Digite o numero de visualizações: "));
            const novaPostagemAvancada = new PostagemAvancada(id, texto, curtidas, descurtidas, data, perfil, hashtag, visualizacoes);
            return novaPostagemAvancada;
        }
        else {
            const novaPostagem = new Postagem(id, texto, curtidas, descurtidas, data, perfil);
            return novaPostagem;
        }
    }
    else {
        console.log(`Erro\n`);
        throw new Error(`Perfil não associado!\n`);
    }
}
function MostrarPostagens(postagens) {
    if (postagens == null) {
        console.log("Nenhuma postagem encontrada!\n");
    }
    else {
        for (let post of postagens) {
            console.log(`\n ID: ${post.id}`);
            console.log(`Texto: ${post.texto} `);
            console.log(`Curtidas: ${post.curtidas} `);
            console.log(`Descurtidas: ${post.descurtidas} `);
            console.log(`Data: ${post.data.toISOString()} `);
            console.log(`Perfil: ${post.perfil.id} \n`);
            if (post instanceof PostagemAvancada) {
                console.log(`Hashtags: ${post.hashtag}`);
                console.log(`Visualizações: ${post.visualizacoesRestantes}`);
            }
        }
    }
}
//teste
const repositorioDePostagens = new RepositorioDePostagens();
const repositorioDePerfis = new RepositorioDePerfis();
const redeSocial = new RedeSocial(repositorioDePostagens, repositorioDePerfis);
const app = new App(redeSocial);
app.Menu();
