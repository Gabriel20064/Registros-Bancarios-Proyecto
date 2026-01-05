import Cl_mTransaccion from "./Cl_mTransaccion.js";
export default class Cl_mBanco {
    transacciones = [];
    STORAGE_KEY = "Movimientos_Bancarios_data";
    //Atributos derivados para los metodos de conciliacion (en revision)
    //Resumen
    acmMontoCargos = 0;
    acmMontoAbonos = 0;
    //Desglose por categoria
    cntTransacciones = 0;
    categoria1 = 0; // Ingresos
    categoria2 = 0; // Alimentacion
    categoria3 = 0; // Servicios Basicos
    categoria4 = 0; // Articulos de Vestimenta
    categoria5 = 0; // Servicios Publicos
    categoria6 = 0; // Entretenimiento
    categoria7 = 0; // Educacion
    categoria8 = 0; // Gasto del Hogar
    categoria9 = 0; // Otros
    cntCategoria1 = 0;
    cntCategoria2 = 0;
    cntCategoria3 = 0;
    cntCategoria4 = 0;
    cntCategoria5 = 0;
    cntCategoria6 = 0;
    cntCategoria7 = 0;
    cntCategoria8 = 0;
    cntCategoria9 = 0;
    //Analisis
    categoriaMayorGasto = 0; // Categoria con mayor gasto
    montoMayorGasto = 0; // Monto de la categoria con mayor gasto
    constructor() {
        this.cargar();
        this.emitirTotales(); //new
    }
    cargar() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (data) {
            try {
                const json = JSON.parse(data);
                this.transacciones = json.map((registro) => new Cl_mTransaccion(registro));
            }
            catch (error) {
                console.error("Error al cargar data del almacenamiento local:", error);
                this.transacciones = [];
            }
        }
    }
    guardar() {
        const data = this.transacciones.map(registro2 => registro2.toJSON());
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }
    procesarTransaccion(data) {
        let existe = this.transacciones.find(a => a.referencia === data.referencia);
        if (existe) {
            if (data.referencia !== undefined)
                existe.referencia = data.referencia;
            if (data.fecha !== undefined)
                existe.fecha = data.fecha;
            if (data.descripcion !== undefined)
                existe.descripcion = data.descripcion;
            if (data.monto !== undefined)
                existe.monto = data.monto;
            if (data.tipoTransaccion !== undefined)
                existe.tipoTransaccion = data.tipoTransaccion;
            if (data.categoria !== undefined)
                existe.categoria = data.categoria;
        }
        else {
            this.transacciones.push(new Cl_mTransaccion(data));
        }
        this.guardar();
        this.emitirTotales(); //new
        return true;
    }
    deleteTransaccion(referencia) {
        let index = this.transacciones.findIndex(registro3 => registro3.referencia === referencia);
        if (index !== -1) {
            this.transacciones.splice(index, 1);
            this.guardar();
            this.emitirTotales(); //new
            return true;
        }
        return false;
    }
    getTransaccion(referencia) {
        return this.transacciones.find(registro4 => registro4.referencia === referencia);
    }
    get dtTransacciones() {
        return this.transacciones;
    }
    //Metodos
    //Resumen
    calcularTotales(saldoInicial = 5000.00) {
        let totalCargos = 0;
        let totalAbonos = 0;
        for (const t of this.transacciones) {
            const monto = Number(t.monto) || 0;
            if (Number(t.tipoTransaccion) === 1)
                totalCargos -= monto;
            else if (Number(t.tipoTransaccion) === 2)
                totalAbonos += monto;
        }
        return { totalCargos, totalAbonos, saldoFinal: saldoInicial + totalAbonos + totalCargos };
    }
    formatearMonto(n) { return Number(n).toFixed(2); } //new
    eventTarget = new EventTarget(); //new
    onTotalesActualizados(cb) {
        this.eventTarget.addEventListener('totalesActualizados', (ev) => cb(ev.detail));
    }
    emitirTotales() {
        const tot = this.calcularTotales();
        this.eventTarget.dispatchEvent(new CustomEvent('totalesActualizados', { detail: tot }));
    }
}
