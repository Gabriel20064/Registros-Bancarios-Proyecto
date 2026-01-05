export default class Cl_controlador {
    mBanco;
    vBanco;
    vTransaccion;
    vEditTransaccion;
    constructor(modelo, vBanco, vTransaccion, vEditTransaccion) {
        this.mBanco = modelo;
        this.vBanco = vBanco;
        this.vTransaccion = vTransaccion;
        this.vEditTransaccion = vEditTransaccion;
    }
    procesarTransaccion(data) {
        this.mBanco.procesarTransaccion(data);
        this.mostrarVista("transacciones");
    }
    deleteTrans(referencia) {
        if (confirm(`¿Está seguro de eliminar la transaccion ${referencia}?`)) {
            this.mBanco.deleteTransaccion(referencia);
            this.vBanco.refreshTable();
        }
    }
    vDetails(referencia) {
        const trans = this.mBanco.getTransaccion(referencia);
        if (trans) {
            alert(JSON.stringify(trans.toJSON(), null, 2));
        }
    }
    vEdit(referencia) {
        const trans = this.mBanco.getTransaccion(referencia);
        if (trans && this.vEditTransaccion) {
            this.vEditTransaccion.cargarDatos(trans.toJSON());
            this.mostrarVista("editTransaccion");
        }
    }
    mostrarVista(vista) {
        this.vBanco.ocultar();
        this.vTransaccion.ocultar();
        this.vEditTransaccion.ocultar();
        if (vista === "transacciones") {
            this.vBanco.mostrar();
            this.vBanco.refreshTable(); // Refrescar para ver nuevos totales
        }
        else if (vista === "registro") {
            this.vTransaccion.mostrar();
        }
        else if (vista === "editTransaccion") {
            this.vEditTransaccion.mostrar();
        }
    }
    get dtTransacciones() {
        return this.mBanco.dtTransacciones;
    }
    get dtBanco() {
        return this.mBanco;
    }
}
