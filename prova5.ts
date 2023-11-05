//import { BlockList } from "node:net";
//import { stringify } from "node:querystring";
//import { it } from "node:test";

import {question} from "readline-sync";
import * as fs from 'fs';

class Perfil {
    private _id: number;
    private _nome:string;
    private _email: string;
    private _seguindo: number[];  // Array de IDs dos perfis que este perfil está seguindo
    private _seguidores: number[];
    

    constructor(id: number, nome: string, email: string) {
       if(this.validaId(id)){
            this._id = id;
       } else {
            throw new Error("ID deve ser do tipo numero!\n")
       }
       if(this.validaNome(nome)){
            this._nome = nome;
       } else {
            throw new Error(" Nome nao pode conter numeros e carecteres\n")
       }
       
        this._email = email;
        this._seguidores = [];
        this._seguindo = [];
        
    }

    get seguidores() {
        return this._seguidores
    }
    get seguindo() {
        return this._seguindo
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
    Postagens: Postagem[] = [];

    incluir(postagem: Postagem): void{
        let PostagemJaExiste = this.consultar(postagem.id)

        if(PostagemJaExiste === null){
            this.Postagens.push(postagem);
            console.log("Postagem inserida!");
            
        }else{
            console.log("Postagem já existente!\n");
            
        }
    }
//ajeitei----------------------------
// Modifique o tipo de perfil para number
    consultar(id?: number, texto?: string, hashtag?: string, perfil?: number): Postagem[] | null {
        let postagensEncontrada: Postagem[] = [];
      
        for (let item of this.Postagens) {
            if (
              (id === undefined || item.id === id) &&
              (texto === undefined || item.texto === texto) &&
              (item instanceof PostagemAvancada
                ? hashtag === undefined || item.existeHashtag(hashtag)
                : true) && // Verifica se é uma instância de PostagemAvancada
              (perfil === undefined || item.perfil.id === perfil)
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

    listarTodasAsPostagens(): Postagem[]{
        const todasPostagens: Postagem[] = [];

        for(let item of this.Postagens){
            todasPostagens.push(item);
        }

        return todasPostagens;
    }

    excluirPostagem(id: number){
        let postagem = this.consultar(id)

        if(postagem != null){
            for(let item of postagem){
                let index = this.Postagens.indexOf(item)
                if (index !== -1) {
                    this.Postagens.splice(index, 1); // Remove o perfil na posição 'index'
                    console.log(`Postagem com ID ${id} excluído com sucesso.`);
                } 
            }

           
        } else {
            console.log(`Postagem com ID ${id} não encontrado.`);
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
                (item.id === undefined || item.id == perfil.id) &&
                (item.nome === undefined || item.nome == perfil.nome) &&
                (item.email === undefined || item.email == perfil.email)
            ) {
                console.log(" Pefil ja existe!\n");
                return
            }
        }
        this._perfis.push(perfil)
        console.log(`Perfil: ${perfil.id} adicionado !\n`);
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
        return null;
    }

    //excluir perfil
    excluirPerfil(id: number){
        let perfil = this.consultar(id)

        if(perfil != null){
            let index = this._perfis.indexOf(perfil)

            if (index !== -1) {
                this._perfis.splice(index, 1); // Remove o perfil na posição 'index'
                console.log(`Perfil com ID ${id} excluído com sucesso.`);
            } else {
                console.log(`Perfil com ID ${id} não encontrado no array.`);
            }
        } else {
            console.log(`Perfil com ID ${id} não encontrado.`);
        }
    }
    
}

class RedeSocial {
    private ArquivoPerfil: string = "./ListaPerfiz.csv"

    constructor
        (   private _RepositorioDePostagens: RepositorioDePostagens,
            private _RepositorioDePerfis: RepositorioDePerfis) {}

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
    consultarPostagens(id?: number, texto?: string, hashtag?: string, perfil?: number): Postagem[] | null{
        return this._RepositorioDePostagens.consultar(id,texto,hashtag,perfil)
    }
//v----------- ok-----------------------------
    curtir(idPostagem: number): void{
        const postagem = this._RepositorioDePostagens.consultar(idPostagem);

        if (postagem) {
            for(let item of postagem){
                item.curtir(); 
                console.log(`Você curtiu a postagem com ID ${idPostagem}\n`);
            }
        } else {
            console.log(`Postagem com ID ${idPostagem} não encontrada\n`);
        }
    }

//vi-ok
    descurtir(idPostagem: number): void{
        const postagem = this._RepositorioDePostagens.consultar(idPostagem);

        if (postagem) {
            for(let item of postagem){
                item.descurtir(); 
                console.log(`Você descurtiu a postagem com ID ${idPostagem}\n`);
            }
        } else {
            console.log(`Postagem com ID ${idPostagem} não encontrada\n`);
        }
    }

//vii
    decrementarVisualizacoes(idPostagem: number): void{
        const postagens = this._RepositorioDePostagens.consultar(idPostagem);

        if(postagens){
            for(let item of postagens){
                if(item instanceof PostagemAvancada){
                    item.decrementarVisualizacoes();
                    console.log('Vizualização decrementada!\n');
                    
                }
            }
        }else{
            console.log("Postagem não econtrada!");
            
        }
    }

    //viii
    // Esta função até o momento não esta executando pois ela só retorna se existir postagens avançada
    // Podemos depoios pensar em colocar postagens normais nesta função
    exibirPostagensPorPerfil(id: number): Postagem[] | null {
        // ok -funcionando
        const postagens = this._RepositorioDePostagens.consultar(undefined, undefined, undefined, id);
    
        if (postagens) {
            
            const postagensFiltradas: Postagem[] = [];
            
            //adicionei exibir todas as postagens to tipo normal
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
        } else {
            return null;
        }
    }

    ///ix- Não testei esta função
    exibirPostagensPorHashtag(hashtag: string): PostagemAvancada[] | null {
        const postagens = this._RepositorioDePostagens.consultar(undefined, undefined, hashtag);

        if (postagens != null) {
            for (let item of postagens) {
                if (item instanceof PostagemAvancada) {
                    item.decrementarVisualizacoes();
                }
            }
        }

        // Filtrando as postagens que ainda podem ser decrementadas
        const filtroPostagens: PostagemAvancada[] = [];
        if (postagens != null) {
            for (let item of postagens) {
                if (item instanceof PostagemAvancada && item.visualizacoesRestantes > 0) {
                    filtroPostagens.push(item);
                }
            }
            return filtroPostagens;
        } else {

            return null;
        }

    }
    //postagens populares:
    exibirPostagensPopulares(): Postagem[] | null{
        const todasPostagens = this._RepositorioDePostagens.listarTodasAsPostagens();
        const postagensPopulares: Postagem[] = []

        for(let item of todasPostagens){
            if(item.ehPopular()){
                postagensPopulares.push(item)
            }
        }

        return postagensPopulares;
    } 

    //FEED
    exibirTodasAsPostagens(): Postagem[] | null{
        return this._RepositorioDePostagens.listarTodasAsPostagens();
    }

    //hashtags mais populares
    
    

   

    //excluir rede social
    excluirPerfil(id: number){
        return this._RepositorioDePerfis.excluirPerfil(id);
    }

    //excluir postagem
    excluirPostagem(id: number){
        return this._RepositorioDePostagens.excluirPostagem(id);
    }

    //seguir perfil
    seguirPerfil(idPerfilSeguidor: number, idPerfilSeguido: number): void {
        const perfilSeguidor = this._RepositorioDePerfis.consultar(idPerfilSeguidor);
        const perfilSeguido = this._RepositorioDePerfis.consultar(idPerfilSeguido);
    
        if (perfilSeguidor && perfilSeguido) {
            if (perfilSeguidor.seguindo.includes(idPerfilSeguido)) {
                console.log(`Você já está seguindo o perfil com ID ${idPerfilSeguido}.`);
            } else {
                perfilSeguidor.seguindo.push(idPerfilSeguido);
    
                perfilSeguido.seguidores.push(idPerfilSeguidor);
    
                
                console.log(`Você seguiu o perfil com ID ${idPerfilSeguido}.`);
            }
        } else {
            console.log("Perfis não encontrados. Certifique-se de que ambos os perfis existam.");
        }
    }



    // iniciei agora
    carregarPefis(){
        const arquivo:string = fs.readFileSync(this.ArquivoPerfil,'utf-8');
        const linhas: string[] = arquivo.split('\n');
        console.log(`Iniciando  a Leitura\n`);

        for (let i:number = 0; i< linhas.length; i++){
            let linhaPerfil: string[] = linhas[i].split(";");
			let perfil!: Perfil;
			let ID: string  = linhaPerfil[2];
			if (tipo == 'C') {
				conta = new Conta(linhaConta[0], parseFloat(linhaConta[1]));
			} else if (tipo == 'CP') {
				conta = new Poupanca(linhaConta[0], parseFloat(linhaConta[1]),parseFloat(linhaConta[3]));
			} else if (tipo == 'CI') {
				conta = new ContaImposto(linhaConta[0], parseFloat(linhaConta[1]),parseFloat(linhaConta[3]));
			}

			this.inserir(conta);
			console.log(`Conta ${conta.numero} carregada`);
		}
        }
        
    }

}


// Criando App;

class App {
    private _RedeSocial: RedeSocial;

    constructor(RedeSocial: RedeSocial) {
        this._RedeSocial = RedeSocial;
    }

    Menu(): void {
        // ajustei o menu um pouco mas ainda precisa terminar
        while (true) {
            const opcoes = [
                '1. Criar Perfil',// Funcionando
                '2. Consultar Perfil',//
                '3. Postagens:',
                '    a. Criar Postagem',//Funcionando
                '    b. Consultar Postagem',//Funcionando parcial...não foram testados todas as opçãoes
                '4. Exibir Postagem por Perfil',//Funcionando
                '5. Exibir Postagens por Hashtag',//Funcionando
                '6. Curtir postagem',// Funcionando
                '7. Descurtir postagem',// Funcionando
                '8. Decrementar Visualização',// Funcionando
                '9. Postagens Populares', //Fucionando
                '10. Hashtags mais populares',//NÃO CRIADA AINDA
                '11. Listar todas as postagens',//Funcionando
                '12. Excluir um perfil',//Funcionando
                '13. Apagar Postagem',//Funcionando
                '14. Seguir Perfil',//funcionando
                '15. Sair',
            ];
            console.log('\nBem-vindo ao sistema da Rede Social.');

            opcoes.forEach((opcao) => console.log(opcao));
            let escolha = question('Digite a opção: ');

            if (escolha === '15') {
                console.log('Obrigado por usar nossa Rede Social!\n');
                break; // Sai do loop enquanto o usuário escolhe '9'.
            } else {
                this.opcoes(escolha);
            }
        }
    }

    opcoes(opcao: string): void {
        switch (opcao) {
            case '1':// Funcionando
                console.log(`Crie um novo perfil!\n`);
                const novoPerfil = DadosPerfil();
                this._RedeSocial.incluirPerfil(novoPerfil);
                console.log(`Perfil: ${novoPerfil.id} criado com sucesso!\n`);
                break;

            case '2': // Funcionando
                console.log(`Consulte um perfil\n`);
                const id = parseInt(question('Digite o id do perfil: '));
                const nome = question('Digite o nome do perfil: ');
                const email = question('Digite o email do perfil: ');
                let resultado = this._RedeSocial.consultarPerfil(id, nome, email);
                mostrarPerfil(resultado);
                break;

            case '3': // Funcioando até onde testei
                const escolha = parseInt(
                    question(`Escolha: CriarPostagem e incluir(1) \n ou ConsultarPostagem(2)\: \n`)
                );
                if (escolha === 1) {
                    const novaPostagem = DadosPostagem();
                    let Post = this._RedeSocial.incluirPostagem(novaPostagem);
                    //return menu
                } else if (escolha == 2) {
                    // funcionando: opção 1 e 4 
                    // 2 e 3 não textei
                    console.log(
                        `\nConsulta de Postagem:
                    1. ID postagem,
                    2. Texto,
                    3. Hashtag, 
                    4. Perfil \n` 
                    );
                    const opcao = parseInt(question('Escolha uma opção de consulta: '));
                    
                    if (opcao === 1) {
                        const id = parseInt(question('Digite o ID da postagem: '));
                        const resultado = this._RedeSocial.consultarPostagens(id);
                        MostrarPostagens(resultado);
                    } else if (opcao === 2) {
                        const texto = question('Digite o texto da postagem: ');
                        const resultado = this._RedeSocial.consultarPostagens(undefined, texto);
                        MostrarPostagens(resultado);
                    } else if (opcao === 3) {
                        const hashtag = question('Digite a hashtag: ');
                        const resultado = this._RedeSocial.consultarPostagens(undefined, undefined, hashtag);
                        MostrarPostagens(resultado);
                    } else if (opcao === 4) {
                        const idPerfil = parseInt(question('Digite o ID do perfil: '));
                        const resultado = this._RedeSocial.consultarPostagens(undefined, undefined, undefined, idPerfil);
                        MostrarPostagens(resultado);
                    } else {
                        console.log('Opção inválida!');
                    }
                }

                break;
            case '4':
                const opcao4 = parseInt(question('Informe o Id do Perfil: '));
                const PostagensPerfil = this._RedeSocial.exibirPostagensPorPerfil(opcao4);
                MostrarPostagens(PostagensPerfil);
                break;
            case '5': // exbir postagem por hashtag
                const opcao5 = question('Informe a hashtag que deseja procurar: ');
                const PostagemPorHashtag = this._RedeSocial.exibirPostagensPorHashtag(opcao5);
                MostrarPostagens(PostagemPorHashtag);
                break;
            case '6': // curtir postagem
                const opcao6 = parseInt(question('Informe o id da postagem que deseja curtir: '));
                this._RedeSocial.curtir(opcao6);
                break;
            case '7': // descurtir postagem
                const opcao7 = parseInt(question('Informe o id da postagem que deseja descurtir: '));
                this._RedeSocial.descurtir(opcao7);
                break;
            case '8': // descrementar vizualizaçao
                const opcao8 = parseInt(question('Informe o id da postagem que deseja decrementar vizualizações: '));
                this._RedeSocial.decrementarVisualizacoes(opcao8);
                break;
            case '9'://postagens populares
                console.log("\nPostagens Populares:");
                const opcao9 = this._RedeSocial.exibirPostagensPopulares();
                MostrarPostagens(opcao9);
                break;
            case '10': //hashtags mais populares
                
                
                break;

            case '11'://listar todas as postagens
                console.log("\nFeed de Postagens: ");
                const opcao11 = this._RedeSocial.exibirTodasAsPostagens();
                MostrarPostagens(opcao11);
                break;

            case '12'://excluir perfil
                const opcao12 = parseInt(question('Qual o ID do Perfil: '));
                this._RedeSocial.excluirPerfil(opcao12);

                break;
            case '13': //excluir postagem
                const opcao13 = parseInt(question('Qual o ID da postagem: '));
                this._RedeSocial.excluirPostagem(opcao13);
                break;
            case '14': //seguir perfil
                const idPerfilSeguidor = parseInt(question('Digite o ID do perfil seguidor: '));
                const idPerfilSeguido = parseInt(question('Digite o ID do perfil que deseja seguir: '));
                this._RedeSocial.seguirPerfil(idPerfilSeguidor, idPerfilSeguido);
                break;
            case '15':
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
        console.log(`\n>>Dados do Perfil:`);
        
        console.log(`Id: ${perfil.id}`);
        console.log(`Nome ${perfil.nome}`);
        console.log(`e-mail: ${perfil.email} `);
        console.log(`Seguindo: ${perfil.seguindo.length}`);
        console.log(`Seguidores: ${perfil.seguidores.length}\n`);
        
    } else{
        console.log(`Perfil nao encontrado!\n`);
        
    }
}
// Função ajustada ---- parte avançada
function DadosPostagem(): Postagem {
    const id = parseInt(question("Digite o ID postagem: "));
    const texto = question("Digite texto: ");
    const curtidas = parseInt(question("Digite o numero de curtidas: "));
    const descurtidas = parseInt(question("Digite o numero de descurtidas: "));
    const data = new Date();
    const idPerfil =  parseInt(question("Digite ID do perfil: "));

    const perfil = repositorioDePerfis.consultar(idPerfil)

    if(perfil!=null){
        //se for avançada
        const avancadaOuN = parseInt(question("Deseja adicionar hashtags e visualizações? 1- SIM 2-NÃO "))

        if(avancadaOuN == 1){
            const hashtag = question("Digite a hashtag: ")
            const visualizacoes = parseInt(question("Digite o numero de visualizações: "))

            const novaPostagemAvancada = new PostagemAvancada(id,texto,curtidas,descurtidas,data,perfil,hashtag,visualizacoes);
            return novaPostagemAvancada;
        }else{
            const novaPostagem = new Postagem(id, texto, curtidas, descurtidas,data, perfil);
            return novaPostagem;
        }
    }  else {
        console.log(`Erro\n`);
        
        throw new Error(`Perfil não associado!\n`);
    } 
    
}
// Função ajustada --- adicionei parte avançada
function MostrarPostagens(postagens: Postagem[] | null): void {
    if (postagens == null) {
        console.log("Nenhuma postagem encontrada!\n");
    } else {
        for (let post of postagens) {
            console.log(`\n ID: ${post.id}`);
            console.log(`Texto: ${post.texto} `);
            console.log(`Curtidas: ${post.curtidas} `);
            console.log(`Descurtidas: ${post.descurtidas} `);
            console.log(`Data: ${post.data.toISOString()} `); 
            console.log(`Perfil: ${post.perfil.id} \n`); 
            if(post instanceof PostagemAvancada){
                console.log(`Hashtags: ${post.hashtag}`);
                console.log(`Visualizações: ${post.visualizacoesRestantes}`);
                
                
            }
        }
    }
}





function slavarArquivo =
// sugestão de função Apagar perfil
//apagar postagem
// seguir perfil
//aumentar visualizações
//listar todas as postagens

//teste
const repositorioDePostagens = new RepositorioDePostagens();
const repositorioDePerfis = new RepositorioDePerfis();
const redeSocial = new RedeSocial(repositorioDePostagens, repositorioDePerfis);
const app = new App(redeSocial);

app.Menu();
