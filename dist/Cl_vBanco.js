import Cl_vGeneral from "./tools/Cl_vGeneral.js";
export default class Cl_vBanco extends Cl_vGeneral {
    divTransacciones;
    btAdd;
    totalesResumen = false; //new
    constructor() {
        super({ formName: "transacciones" });
        this.divTransacciones = this.crearHTMLElement("divTransacciones");
        this.btAdd = this.crearHTMLButtonElement("btAdd", {
            onclick: () => this.controlador?.mostrarVista("registro")
        });
    }
    refreshTable() {
        if (!this.controlador)
            return;
        let htmlTable = "";
        const transacciones = this.controlador.dtTransacciones;
        const banco = this.controlador.dtBanco;
        transacciones.forEach((trans) => {
            htmlTable += `
            <tr>
                <td>${trans.fecha}</td>
                <td>${trans.descripcion}</td>
                <td class= "${trans.tipoTransaccion === 1 ? "negative-amount" : "positive-amount"}">${trans.tipoTransaccion === 1 ? "Cargo" : "Abono"}</td>
                <td class= "${trans.tipoTransaccion === 1 ? "negative-amount" : "positive-amount"}">${trans.tipoTransaccion === 1 ? "Bs." + (trans.monto * -1).toFixed(2) : "Bs." + trans.monto.toFixed(2)}</td>
                <td>${trans.referencia}</td>
                <td>${trans.categoriaTexto()}</td>
                <td>
                    <button class="btDetails" data-ref="${trans.referencia}" title="Detalles de la Transaccion" style=" font-size: 1rem; color:black; background:black; border:2px solid black; padding:3px;">❔</button>
                    <button class="btEdit" data-ref="${trans.referencia}" title="Editar Transaccion" style=" font-size: 1rem; color:black; background:black; border:2px solid black; padding:3px;">⚙️</button>
                    <button class="btDelete" data-ref="${trans.referencia}" title="Eliminar Transaccion" style=" font-size: 1rem; color:red; background:red; border:2px solid black; padding:3px;">🗑️</button>
                </td>
            </tr>`;
        });
        this.divTransacciones.innerHTML = htmlTable;
        this.asignarEventos();
        // Actualizacion totales//new
        if (this.controlador) {
            const banco = this.controlador.dtBanco;
            // Actualiza inmediatamente los totales
            this.actualizarDOMTotales(banco.calcularTotales());
            // Suscribir a futuras actualizaciones una sola vez
            if (!this.totalesResumen) {
                banco.onTotalesActualizados(t => this.actualizarDOMTotales(t));
                this.totalesResumen = true;
            }
        }
    }
    asignarEventos() {
        //Detalles
        this.divTransacciones.querySelectorAll(".btDetails").forEach((det) => {
            det.onclick = () => {
                const ref = det.dataset.ref;
                if (ref)
                    this.controlador?.vDetails(ref);
            };
        });
        //Editar
        this.divTransacciones.querySelectorAll(".btEdit").forEach((edi) => {
            edi.onclick = () => {
                const ref = edi.dataset.ref;
                if (ref)
                    this.controlador?.vEdit(ref);
            };
        });
        //Eliminar
        this.divTransacciones.querySelectorAll(".btDelete").forEach((del) => {
            del.onclick = () => {
                const ref = del.dataset.ref;
                if (ref)
                    this.controlador?.deleteTrans(ref);
            };
        });
    }
    mostrar() {
        this.vista.hidden = false;
        this.refreshTable();
    }
    ocultar() {
        this.vista.hidden = true;
    }
    //Para los Metodos
    // Actualizar los elementos del DOM que muestran los totales 
    actualizarDOMTotales(t) {
        const elCargos = document.getElementById("totalDeCargos");
        const elAbonos = document.getElementById("totalDeAbonos");
        const elSaldo = document.getElementById("saldoFinal");
        const banco = this.controlador?.dtBanco;
        const format = banco ? (n) => banco.formatearMonto(n) : (n) => Number(n).toFixed(2);
        if (elCargos)
            elCargos.textContent = `Total de cargos: Bs. ${format(t.totalCargos)}`;
        if (elAbonos)
            elAbonos.textContent = `Total de abonos: Bs. ${format(t.totalAbonos)}`;
        if (elSaldo)
            elSaldo.textContent = `Saldo final: Bs. ${format(t.saldoFinal)}`;
    }
}
