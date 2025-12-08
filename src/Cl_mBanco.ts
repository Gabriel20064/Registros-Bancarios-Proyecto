import Cl_mTransaccion, { iTransaccion } from "./Cl_mTransaccion.js";

export default class Cl_mBanco {
    private transacciones: Cl_mTransaccion[] = [];
    private readonly STORAGE_KEY = "Movimientos_Bancarios_data";
    //Atributos derivados para los metodos de conciliacion (revision)
    private acmMontoCargos: number = 0;
    private acmMontoAbonos: number = 0; 

    constructor() {
        this.cargar();
    }

    private cargar() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (data) {
            try {
                const json = JSON.parse(data);
                this.transacciones = json.map((registro: any) => new Cl_mTransaccion(registro));
            } catch (error) {
                console.error("Error al cargar data del almacenamiento local:", error);
                this.transacciones = [];
            }
        }
    }

    private guardar() {
        const data = this.transacciones.map(registro2 => registro2.toJSON());
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
    public procesarTransaccion(data: any): boolean {
        let existe = this.transacciones.find(a => a.referencia === data.referencia);
        
        if (existe) {
            if (data.referencia !== undefined) existe.referencia = data.referencia;
            if (data.fecha !== undefined) existe.fecha = data.fecha;
            if (data.descripcion !== undefined) existe.descripcion = data.descripcion;
            if (data.monto !== undefined) existe.monto = data.monto;
            if (data.tipoTransaccion !== undefined) existe.tipoTransaccion = data.tipoTransaccion;
            if (data.categoria !== undefined) existe.categoria = data.categoria;
        } else {
            this.transacciones.push(new Cl_mTransaccion(data));
        }
        
        this.guardar();
        return true;
    }

    public deleteTransaccion(referencia: string): boolean {
        let index = this.transacciones.findIndex(registro3 => registro3.referencia === referencia);
        if (index !== -1) {
            this.transacciones.splice(index, 1);
            this.guardar();
            return true;
        }
        return false;
    }

    public getTransaccion(referencia: string): Cl_mTransaccion | undefined {
        return this.transacciones.find(registro4 => registro4.referencia === referencia);
    }

    get dtTransacciones(): Cl_mTransaccion[] {
        return this.transacciones;
    }
        
}