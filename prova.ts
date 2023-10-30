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

//repositório de perfil

class RepositorioDePostagens{
    postagens: Postagem[];

    incluir(postagem: Postagem): void{
        let PostagemJaExiste = this.consultar(postagem.id, postagem.texto)

        if(PostagemJaExiste == -1){
            this.postagens.push(postagem);
        }else{
            console.log("Postagem já existente!");
            
        }
    }

    consultar(id?: number, texto?: string, hashtag?: string, perfil?: Perfil) {
        let postagensEncontradas: Postagem[] = [];
      
        for (let item of this.postagens) {
            if (
              (id === undefined || item.id === id) &&
              (texto === undefined || item.texto === texto) &&
              (item instanceof PostagemAvancada
                ? hashtag === undefined || item.existeHashtag(hashtag)
                : true) && // Verifica se é uma instância de PostagemAvancada
              (perfil === undefined || item.perfil === perfil)
            ) {
              postagensEncontradas.push(item);
            }
        }

        if(postagensEncontradas == null){
            return -1
        }else{
            return postagensEncontradas;
        }
      
      }
}

