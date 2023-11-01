class Perfil{
    private _id: number;
    private _nome: String;
    private _email: String;

    constructor(id: number, nome: String, email: String){
        this._id = id;
        this._email = email;
        this._nome = nome;
    }

    get id(){
        return this._id
    }

    get nome(){
        return this._nome
    }

    get email(){
        return this._email
    }
}

class Postagem{
    private _id: number;
    private _texto: string;
    private _curtidas: number;
    private _descurtidas: number;
    private _data: Date;
    private _perfil: Perfil;

    constructor(id: number, texto: string, curtidas: number,descurtidas: number, data: Date, perfil: Perfil){
        this._id = id;
        this._texto = texto;
        this._curtidas = curtidas;
        this._descurtidas = descurtidas;
        this._data = new Date();
        this._perfil = perfil;
    }

    get id(){
        return this._id;
    }

    get texto(){
        return this._texto;
    }

    get curtidas(){
        return this._curtidas
    }

    get descurtidas(){
        return this._descurtidas
    }

    get data(){
        return this._data;
    }

    get perfil(){
        return this._perfil;
    }

    curtir(): void{
        this._curtidas++;
    }

    descurtir(): void{
        this._descurtidas++
    }

    ehPopular(): boolean{
        if(this.curtidas > 1.5 * this.descurtidas){
            return true;
        }else{
            return false
        }
    }
}

class PostagemAvancada extends Postagem{
    private _hashtags: string[];
    private _visualizacoesRestantes: number

    constructor(
            id: number,texto: string, curtidas: number,
            descurtidas: number, data: Date, perfil: Perfil,
            hashtag: string[], visualizacoesRestantes: number){

        super(id, texto, curtidas, descurtidas, data,perfil)
        this._hashtags = hashtag;
        this._visualizacoesRestantes = visualizacoesRestantes;

    }

    adicionarHashtag(hashtag: string): void{
        this._hashtags.push(hashtag);
    }

    existeHashtag(hashtag: string): boolean{

        if(this._hashtags.includes(hashtag)){
            return true;
        }
        return false
    }

    decrementarVisualizacoes(): void {
        this._visualizacoesRestantes--;

        if(this._visualizacoesRestantes<=0){
            this._visualizacoesRestantes = 0;
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
   consultar(id?: number, nome?: String, email?: String): Perfil[] | null {

        let resultadoPerfil: Perfil[] = [];

        for (let item of this._perfis) {
            // considera a inserção ou não de parametros 
            if (
                (id === undefined || id === item.id) &&
                (nome === undefined || nome === item.nome) &&
                (email === undefined || email === item.email)) {

                resultadoPerfil.push(item);
            }
        }

        if (resultadoPerfil.length != 0) {
            return resultadoPerfil;
        } else {
            return null
        }

    }
}

//ajeitei--------------------------
class RepositorioDePostagens{
    postagens: Postagem[];

    incluir(postagem: Postagem): void{
        let PostagemJaExiste = this.consultar(postagem.id, postagem.texto)

        if(PostagemJaExiste == null){
            this.postagens.push(postagem);
        }else{
            console.log("Postagem já existente!");
            
        }
    }
//ajeitei----------------------------
    consultar(id?: number, texto?: string, hashtag?: string, perfil?: Perfil): Postagem {
        let postagensEncontrada: Postagem
      
        for (let item of this.postagens) {
            if (
              (id === undefined || item.id === id) &&
              (texto === undefined || item.texto === texto) &&
              (item instanceof PostagemAvancada
                ? hashtag === undefined || item.existeHashtag(hashtag)
                : true) && // Verifica se é uma instância de PostagemAvancada
              (perfil === undefined || item.perfil === perfil)
            ) {
                postagensEncontrada = item;
                return postagensEncontrada;

            }
        }
      
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
    consultarPerfil(id: number, nome: string, email: string): Perfil[] | null {
        return this._RepositorioDePerfis.consultar(id, nome, email)
    }
    //iii
    incluirPostagem(postagem: Postagem): void {
        return this._RepositorioDePostagens.incluir(postagem)
    }
    //iv-----------ajeitei--------------------------
    consultarPostagens(id?: number, texto?: string, hashtag?: string, perfil?:
        Perfil): Postagem{
            return this._RepositorioDePostagens.consultar(id,texto,hashtag,perfil)
    }
    //v----------- ajeitei-----------------------------
    curtir(idPostagem: number): void{
        const postagem = this._RepositorioDePostagens.consultar(idPostagem);
        if (postagem) {
            postagem.curtir(); 
            console.log(`Você curtiu a postagem com ID ${idPostagem}`);
        } else {
            console.log(`Postagem com ID ${idPostagem} não encontrada`);
        }
    }
    //vi--------------ajeitei-----------------------------
    descurtir(idPostagem: number): void{
        const postagem = this._RepositorioDePostagens.consultar(idPostagem);
        if (postagem) {
            postagem.descurtir(); 
            console.log(`Você descurtiu a postagem com ID ${idPostagem}`);
        } else {
            console.log(`Postagem com ID ${idPostagem} não encontrada`);
        }
    }
    //vii
    decrementarVisualizacoes(postagem: PostagemAvancada): void{
        this.
    }
    //viii
    exibirPostagensPorPerfil(id: number): Postagem[]{
        //this.consultarPerfil(id)
    }
    ///ix
    exibirPostagensPorHashtag(hashtag: string): PostagemAvancada[] {

    }
}


