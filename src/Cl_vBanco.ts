import Cl_vGeneral from "./tools/Cl_vGeneral.js";
import Cl_controlador from "./Cl_controlador.js";
import Cl_mBanco from "./Cl_mBanco.js";
export default class Cl_vBanco extends Cl_vGeneral {
    private divTransacciones: HTMLElement; 
    private btAdd: HTMLButtonElement;
    private totalesResumen: boolean = false; //new
    constructor() {
        super({ formName: "transacciones" });
        this.divTransacciones = this.crearHTMLElement("divTransacciones"); 
        this.btAdd = this.crearHTMLButtonElement("btAdd", {
            onclick: () => this.controlador?.mostrarVista("registro")
        });
    }

    public refreshTable() {
        if (!this.controlador) return;
        let htmlTable = "";

        const transacciones = this.controlador.dtTransacciones;
        const banco = this.controlador.dtBanco;
        transacciones.forEach((trans: any) => {
            htmlTable += `
            <tr>
                <td>${trans.fecha}</td>
                <td>${trans.descripcion}</td>
                <td class= "${trans.tipoTransaccion === 1 ? "negative-amount" : "positive-amount"}">${trans.tipoTransaccion === 1 ? "Cargo" : "Abono"}</td>
                <td class= "${trans.tipoTransaccion === 1 ? "negative-amount" : "positive-amount"}">${trans.tipoTransaccion === 1 ? "Bs."+(trans.monto * -1).toFixed(2) : "Bs."+trans.monto.toFixed(2)}</td>
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

    private asignarEventos() {
        //Detalles
        this.divTransacciones.querySelectorAll(".btDetails").forEach((det) => {
            (det as HTMLElement).onclick = () => {
                const ref = (det as HTMLElement).dataset.ref;
                if(ref) this.controlador?.vDetails(ref);
            };
        });

        //Editar
        this.divTransacciones.querySelectorAll(".btEdit").forEach((edi) => {
            (edi as HTMLElement).onclick = () => {
                const ref = (edi as HTMLElement).dataset.ref;
                if(ref) this.controlador?.vEdit(ref);
            };
        });

        //Eliminar
        this.divTransacciones.querySelectorAll(".btDelete").forEach((del) => {
            (del as HTMLElement).onclick = () => {
                const ref = (del as HTMLElement).dataset.ref;
                if(ref) this.controlador?.deleteTrans(ref);
            };
        });
    }
    public mostrar() {
        this.vista!.hidden = false;
        this.refreshTable(); 
    }
    public ocultar() {
        this.vista!.hidden = true;
    }

     //Para los Metodos
    // Actualizar los elementos del DOM que muestran los totales 
    private actualizarDOMTotales(t: { totalCargos: number; totalAbonos: number; saldoFinal: number }) { //new
        const elCargos = document.getElementById("totalDeCargos");
        const elAbonos = document.getElementById("totalDeAbonos");
        const elSaldo = document.getElementById("saldoFinal");
        const banco = this.controlador?.dtBanco;
        const format = banco ? (n: number) => banco.formatearMonto(n) : (n: number) => Number(n).toFixed(2);
        if (elCargos) elCargos.textContent = `Total de cargos: Bs. ${format(t.totalCargos)}`; 
        if (elAbonos) elAbonos.textContent = `Total de abonos: Bs. ${format(t.totalAbonos)}`;
        if (elSaldo) elSaldo.textContent = `Saldo final: Bs. ${format(t.saldoFinal)}`;
    }
}