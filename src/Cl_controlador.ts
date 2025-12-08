import Cl_mBanco from "./Cl_mBanco.js";
import Cl_vBanco from "./Cl_vBanco.js";
import Cl_vTransaccion from "./Cl_vTransaccion.js";
import Cl_vEditTransaccion from "./Cl_vEditTransaccion.js";
import { iTransaccion } from "./Cl_mTransaccion.js";

export default class Cl_controlador {
    private mBanco: Cl_mBanco;
    private vBanco: Cl_vBanco;
    private vTransaccion: Cl_vTransaccion;
    private vEditTransaccion: Cl_vEditTransaccion;

    constructor(
        modelo: Cl_mBanco, 
        vBanco: Cl_vBanco, 
        vTransaccion: Cl_vTransaccion,
        vEditTransaccion: Cl_vEditTransaccion
    ) {
        this.mBanco = modelo;
        this.vBanco = vBanco;
        this.vTransaccion = vTransaccion;
        this.vEditTransaccion = vEditTransaccion;
    }

    public procesarTransaccion(data: iTransaccion) {
        this.mBanco.procesarTransaccion(data);
        this.mostrarVista("transacciones");
    }

    public deleteTrans(referencia: string) {
        if (confirm(`¿Está seguro de eliminar la transaccion ${referencia}?`)) {
            this.mBanco.deleteTransaccion(referencia);
            this.vBanco.refreshTable();
        }
    }

    public vDetails(referencia: string) { //Para despues
    const trans = this.mBanco.getTransaccion(referencia);
    if (trans) {
        alert(JSON.stringify(trans.toJSON(), null, 2));
    }
}

    public vEdit(referencia: string) {
        const trans = this.mBanco.getTransaccion(referencia);
        if (trans && this.vEditTransaccion) {
            this.vEditTransaccion.cargarDatos(trans.toJSON());
            this.mostrarVista("editTransaccion");
        }
    }
    
    public mostrarVista(vista: string) {
        this.vBanco.ocultar();
        this.vTransaccion.ocultar();
        this.vEditTransaccion.ocultar();


        if (vista === "transacciones") {
            this.vBanco.mostrar();
            this.vBanco.refreshTable(); // Refrescar para ver nuevos totales
        } else if (vista === "registro") {
            this.vTransaccion.mostrar();
        } else if (vista === "editTransaccion") {
            this.vEditTransaccion.mostrar();
        }
    }
    
    get dtTransacciones() {
        return this.mBanco.dtTransacciones;
    }
}