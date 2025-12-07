export interface iTransaccion{
    fecha: string;
    descripcion: string;
    monto: number;
    referencia: string;
    tipoTransaccion: number;
    categoria: number; //1 para Ingreso
}

export default class Cl_mTransaccion{
    protected _fecha: string = "";
    protected _descripcion: string ="";
    protected _monto: number =0 ;
    protected _referencia: string ="";
    protected _tipoTransaccion: number = 0;
    protected _categoria: number =0 ;
    constructor({
        fecha = "",
        descripcion = "",
        monto = 0,
        referencia = "",
        tipoTransaccion = 0,
        categoria = 0
    }: {
        fecha: string;
        descripcion: string;
        monto: number;
        referencia: string;
        tipoTransaccion: number;
        categoria: number;
    }){
        this.fecha = fecha;
        this.descripcion = descripcion;
        this.monto = monto;
        this.referencia = referencia;
        this.tipoTransaccion = tipoTransaccion;
        this.categoria = categoria;
    }
    set fecha(f: string) {
        this._fecha = f;
    }
    get fecha(): string {
        return this._fecha;
    }
    set descripcion(d: string) {
        this._descripcion = d;
    }
    get descripcion(): string {
        return this._descripcion;
    }
    set monto(m: number) {
        this._monto = +m;
    }
    get monto(): number {
        return this._monto;
    }
    set referencia(r: string) {
        this._referencia = r;
    }
    get referencia(): string {
        return this._referencia;
    }
    set tipoTransaccion(t: number) {
        this._tipoTransaccion = +t;
    }
    get tipoTransaccion(): number {
        return this._tipoTransaccion;
    }
    set categoria(c: number) {
        this._categoria = +c;
    }
    get categoria(): number {
        return this._categoria;
    }
    public montoCargo(): number{
        if (this.tipoTransaccion === 1)
            return this.monto;
        else 
            return 0;
    }
    public montoAbono(): number{
        if (this.tipoTransaccion === 2)
            return this.monto;
        else 
            return 0;
    }
    public categoriaTexto(): string{
        switch(this.categoria){
            case 1:
                return "Ingreso"; break;
            case 2:
                return "Alimentación"; break;
            case 3:
                return "Servicios Basicos"; break;
            case 4:
                return "Artículos de Vestimenta"; break;
            case 5:
                return "Servicios Publicos"; break;
            case 6:
                return "Entretenimiento"; break;
            case 7:
                return "Educación"; break;
            case 8:
                return "Gasto del Hogar"; break;
            default:
                return "Otros";
        }
    }
        toJSON(): iTransaccion {
            return {
                descripcion: this.descripcion,
                monto: this.monto,
                referencia: this.referencia,
                categoria: this.categoria,
                fecha: this.fecha,
                tipoTransaccion: this.tipoTransaccion
            };
        }
} 