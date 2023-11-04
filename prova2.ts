//import { BlockList } from "node:net";
//import { stringify } from "node:querystring";
//import { it } from "node:test";

import {question} from "readline-sync";

class Perfil {
    private _id: number;
    private _nome:string;
    private _email: string;

    constructor(id: number, nome: string, email: string) {
       if(this.validaId(id)){
            this._id = id;
       } else {
            throw new Error("ID deve ser do tipo numero!")
       }
       if(this.validaNome(nome)){
            this._nome = nome;
       } else {
            throw new Error(" Nome nao pode conter numeros e carecteres")
       }
       
        this._email = email;
        
    }

    get id() {
        return this._id
    }

    get nome() {
        return this._nome
    }

    get email() {
        return this._email
    }

    private validaId(id: number): boolean {
        return typeof id === 'number';
    }
    private validaNome (nome: string){
        return typeof nome === 'string'
    }
    // validar e-mail
}

class Postagem {
    private _id: number;
    private _texto: string;
    private _curtidas: number;
    private _descurtidas: number;
    private _data: Date;
    private _perfil: Perfil;

    constructor(
         id: number, texto: string, curtidas: number,
         descurtidas: number, data: Date, perfil: Perfil
        ) {
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
        return this._curtidas
    }

    get descurtidas() {
        return this._descurtidas
    }

    get data() {
        return this._data;
    }

    get perfil() {
        return this._perfil;
    }

    curtir(): void {
        this._curtidas++;
    }

    descurtir(): void {
        this._descurtidas++
    }

    ehPopular(): boolean {
        if (this.curtidas > 1.5 * this.descurtidas) {
            return true;
        } else {
            return false
        }
    }
}

class PostagemAvancada extends Postagem {
    private _hashtags: string[];
    private _visualizacoesRestantes: number

    constructor(
        id: number, texto: string, curtidas: number,
        descurtidas: number, data: Date, perfil: Perfil,
        hashtag: string[], visualizacoesRestantes: number 
    ) {

        super(id, texto, curtidas, descurtidas, data, perfil)
        this._hashtags = hashtag;
        this._visualizacoesRestantes = visualizacoesRestantes;

    }

    get hashtag(){
        return this._hashtags
    }

    get visualizacoesRestantes(){
        return this._visualizacoesRestantes 
    }
   
    adicionarHashtag(hashtag: string): void {
        this._hashtags.push(hashtag);
    }

    existeHashtag(hashtag: string): boolean {

        if (this._hashtags.includes(hashtag)) {
            return true;
        }
        return false
    }

    decrementarVisualizacoes(): void {
        this._visualizacoesRestantes--;

        if (this._visualizacoesRestantes <= 0) {
            this._visualizacoesRestantes = 0;
        }
    }

}

class RepositorioDePostagens{
    postagens: Postagem[] = [];

    incluir(postagem: Postagem): void{
        let PostagemJaExiste = this.consultar(postagem.id, postagem.texto)

        if(PostagemJaExiste == null){
            this.postagens.push(postagem);
        }else{
            console.log("Postagem já existente!");
            
        }
    }
//ajeitei----------------------------
    consultar(id?: number, texto?: string, hashtag?: string, perfil?: Perfil): Postagem[] | null {
        let postagensEncontrada: Postagem[] = [];
      
        for (let item of this.postagens) {
            if (
              (id === undefined || item.id === id) &&
              (texto === undefined || item.texto === texto) &&
              (item instanceof PostagemAvancada
                ? hashtag === undefined || item.existeHashtag(hashtag)
                : true) && // Verifica se é uma instância de PostagemAvancada
              (perfil === undefined || item.perfil === perfil)
            ) {
                postagensEncontrada.push(item);

            }
        }
        if(postagensEncontrada.length != 0 ){
            return postagensEncontrada;
        }else{
            return null;
        }
    }
}

class RepositorioDePerfis {

    private _perfis: Perfil[];

    constructor() {
        this._perfis = []
    }

    incluir(perfil: Perfil): void {
        //verificar se existe o perfil
        for (let item of this._perfis) {
            if (
                (item.id === undefined || item.id == perfil.id) ||
                (item.nome === undefined || item.nome == perfil.nome) ||
                (item.email === undefined || item.email == perfil.email)
            ) {
                console.log(" Pefil ja existe!");
                return
            }
        }
        this._perfis.push(perfil)
        console.log(`Perfil: ${perfil.id} adicionado !`);
    }

    // consulta a exisetncia de um perfil a partir de um parametro e retorna o perfil ou null
    consultar(id?: number, nome?: string, email?: string): Perfil | null {

        for (let item of this._perfis) {
            // considera a inserção ou não de parâmetros 
            if (
                (id === undefined || id === item.id) &&
                (nome === undefined || nome === item.nome) &&
                (email === undefined || email === item.email)
            ) {
                return item;
            }
        }
        //console.log(`Perfil nao encontrado!`);
        return null;
    }
    
}

class RedeSocial {

    constructor
        (   private _RepositorioDePostagens: RepositorioDePostagens,
            private _RepositorioDePerfis: RepositorioDePerfis) { }

    //i
    incluirPerfil(perfil: Perfil): void {
        this._RepositorioDePerfis.incluir(perfil);
    }
    //ii
    consultarPerfil(id?: number, nome?: string, email?: string): Perfil | null {
        return this._RepositorioDePerfis.consultar(id, nome, email)
    }
    //iii
    incluirPostagem(postagem: Postagem): void {
        return this._RepositorioDePostagens.incluir(postagem)
    }
    //iv–ok
    consultarPostagens(id?: number, texto?: string, hashtag?: string, perfil?:
        Perfil): Postagem[] | null{
            return this._RepositorioDePostagens.consultar(id,texto,hashtag,perfil)
    }
//v----------- ok-----------------------------
    curtir(idPostagem: number): void{
        const postagem = this._RepositorioDePostagens.consultar(idPostagem);

        if (postagem) {
            for(let item of postagem){
                item.curtir(); 
                console.log(`Você curtiu a postagem com ID ${idPostagem}`);
            }
        } else {
            console.log(`Postagem com ID ${idPostagem} não encontrada`);
        }
    }

//vi-ok
    descurtir(idPostagem: number): void{
        const postagem = this._RepositorioDePostagens.consultar(idPostagem);

        if (postagem) {
            for(let item of postagem){
                item.descurtir(); 
                console.log(`Você descurtiu a postagem com ID ${idPostagem}`);
            }
        } else {
            console.log(`Postagem com ID ${idPostagem} não encontrada`);
        }
    }

//vii
    decrementarVisualizacoes(idPostagem: number): void{
        const postagens = this._RepositorioDePostagens.consultar(idPostagem);

        if(postagens){
            for(let item of postagens){
                if(item instanceof PostagemAvancada){
                    item.decrementarVisualizacoes();
                    console.log('Vizualização decrementada!');
                    
                }
            }
        }else{
            console.log("Postagem não econtrada!");
            
        }
    }
   
    //viii
    exibirPostagensPorPerfil(id: number): Postagem[] {
        const postagens = this.consultarPostagens(id);
        const postagensDecrementadas: Postagem [] = [];
        
        if(postagens != null){
            for (let item of postagens) {
                if (item instanceof PostagemAvancada) {
                    item.decrementarVisualizacoes();
                    postagensDecrementadas.push(item)
                }
            }
        }
        
        
        // Filtrando as postagens que ainda podem ser decrementadas
        const filtroPostagens = postagensDecrementadas.filter((item) => {
            if (item instanceof PostagemAvancada) {
                return item.visualizacoesRestantes > 0;
            }
            return true;
        })
    
        return filtroPostagens;
    }

    ///ix
    exibirPostagensPorHashtag(hashtag: string): PostagemAvancada[] | null {
    const postagens = this._RepositorioDePostagens.consultar(undefined,undefined,hashtag);

    if(postagens != null){
        for(let item of postagens){
            if(item instanceof PostagemAvancada){
                item.decrementarVisualizacoes();
            }
        }
    }

    // Filtrando as postagens que ainda podem ser decrementadas
    const filtroPostagens: PostagemAvancada[] = [];
    if(postagens != null){
        for(let item of postagens){
            if(item instanceof PostagemAvancada && item.visualizacoesRestantes > 0){
                filtroPostagens.push(item);
            }
        }            
        return filtroPostagens;
    }else{
        
        return null;
    }

    
}
    
}


// Criando App;

class  App {

    private _RedeSocial: RedeSocial

    constructor(RedeSocial: RedeSocial) { 
        this._RedeSocial = RedeSocial
    }

    Menu(): void {
        while (true) {
          const opcoes = [
            '1. Criar Perfil',
            '2. Consultar Perfil',
            '3. Criar Postagem, Consultar Postagem',
            '4. Exibir Postagem por Perfil',
            '5. Exibir Postagens por Hashtag',
            '6. Curtir postagem',
            '7. Descurtir postagem',
            '8. Decrementar Visualização',
            '9. Sair',
          ];
          console.log('Bem-vindo ao sistema da Rede Social.');
    
          opcoes.forEach((opcao) => console.log(opcao));
          let escolha = question('Digite a opção: ');
    
          if (escolha === '9') {
            console.log('Obrigado por usar nossa Rede Social!');
            break; // Sai do loop enquanto o usuário escolhe '9'.
          } else {
            this.opcoes(escolha);
          }
        }
      }

    opcoes(opcao : string): void{
        switch (opcao) {
            case '1':
                console.log(`Crie um novo perfil!`);
                const novoPerfil = DadosPerfil();
                this._RedeSocial.incluirPerfil(novoPerfil)
                console.log(`Perfil: ${novoPerfil.id} criado com sucesso!`);        
                break;

            case '2':
                console.log(`Consulte um perfil`);
                const id = parseInt(question("Digite o id do perfil: "))
                const nome = question("Digite o nome do perfil: ")
                const email = question("Digite o email do perfil: ")
                //let busca = DadosPerfil();
                let resultado = this._RedeSocial.consultarPerfil(id,nome,email);
                mostrarPerfil(resultado)
                break;
                
            case '3':
                const escolha = parseInt(question(`Escolha: CriarPostagem e incluir(1) \n ou ConsultarPostagem(2)\: `));
                if (escolha === 1) {
                    const novaPostagem = DadosPostagem();
                    let Post = this._RedeSocial.incluirPostagem(novaPostagem);
                    //return menu
                } else if(escolha ==2 ){
                  
                    console.log(`
                        Consulta de Postagem:
                        1. ID postagem,
                        2. Texto,
                        3. Hashtag,
                        4. Perfil `
                    );
                    const opcao = parseInt(question("Escolha uma opção de consulta: "));
            
                    if (opcao === 1) {
                        const id = parseInt(question("Digite o ID da postagem: "));
                        this._RedeSocial.consultarPostagens(id);
                    } else if (opcao === 2) {
                        const texto = question("Digite o texto da postagem: ");
                        this._RedeSocial.consultarPostagens(undefined, texto);
                    } else if (opcao === 3) {
                        const hashtag = question("Digite a hashtag: ");
                        this._RedeSocial.consultarPostagens(undefined, undefined, hashtag);
                    } else if (opcao === 4) {
                        const idPerfil = parseInt(question("Digite o ID do perfil: "));
                        this._RedeSocial.consultarPostagens(undefined, undefined, undefined, idPerfil);
                    } else {
                        console.log("Opção inválida!");
                    }
                }
                
                break;
            case '4':
                const opcao4 = parseInt(question("Informe o Id do Perfil: "));
                const PostagensPerfil= this._RedeSocial.exibirPostagensPorPerfil(opcao4);
                MostarPostagens(PostagensPerfil);
                break;
            case '5': // exbir postagem por hashtag
                const opcao5 = question("Informe a hashtag que deseja procurar: ");
                const PostagemPorHashtag = this._RedeSocial.exibirPostagensPorHashtag(opcao5);
                MostarPostagens(PostagemPorHashtag);
                break;
            case '6'://curtir postagem
                const opcao6 = parseInt(question("Informe o id da postagem que deseja curtir: "));
                this._RedeSocial.curtir(opcao6);
                break;
            case '7': //descurtir postagem
                const opcao7 = parseInt(question("Informe o id da postagem que deseja descurtir: "));
                this._RedeSocial.descurtir(opcao7);
                break;
            case '8'://descrementar vizualizaçao
                const opcao8 = parseInt(question("Informe o id da postagem que deseja decrementar vizualizações: "))
                this._RedeSocial.decrementarVisualizacoes(opcao8);
                break;
            case '9':
                console.log(`Obrigado por usar nossa RedeSocia!`);
                  
                break;
            default:
                console.log('Opção inválida. Tente novamente.');
                this.Menu();
        }
    }

    
}

function DadosPerfil(): Perfil {
    const id = parseInt(question("Digite o ID: "));
    const nome = question("Digite o nome: ");
    const email = question("Digite o email: ");
  
    const novoPerfil = new Perfil(id, nome, email);
    return novoPerfil;
}
function mostrarPerfil(perfil:Perfil | null): void{
     
    if(perfil!==null){
        console.log(`\nID: ${perfil.id}`);
        console.log(`NOME: ${perfil.nome}`);
        console.log(`EMAIL: ${perfil.email}\n `);
    } else{
        console.log(`Perfil nao encontrado!`);
        
    }
}
function DadosPostagem(): Postagem {
    const id = parseInt(question("Digite o ID postagem: "));
    const texto = question("Digite texto: ");
    const curtidas = question("Digite o numero de curtidas: ");
    const descurtidas = question("Digite o numero de descurtidas: ");
    const data = question("Digite a data: ");
    const perfil = question("Digite ID do perfil: ");
  
    const novaPostagem = new Postagem(id, texto, curtidas, descurtidas,data, perfil);
    return novaPostagem;
}
function MostarPostagens (postagens: Postagem[] | null): void{
    const itemPostagem = postagens;

    if(itemPostagem == null){
        console.log("Nenhuma postagem encontrada!");
        
    }else{
        for(let post of itemPostagem){
            console.log(`ID: ${post.id} \n`);
            console.log(`Texto: ${post.texto} \n`);
            console.log(`Curtidas: ${post.curtidas} \n`);
            console.log(`Descurtidas: ${post.descurtidas} \n`);
            console.log(`Data: ${post.data} \n`);
            console.log(`Perfil: ${post.perfil} \n`);
        }
    }
  

}

//teste
const repositorioDePostagens = new RepositorioDePostagens();
const repositorioDePerfis = new RepositorioDePerfis();
const redeSocial = new RedeSocial(repositorioDePostagens, repositorioDePerfis);
const app = new App(redeSocial);

app.Menu();
