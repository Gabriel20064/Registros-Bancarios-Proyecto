import Cl_vGeneral from "./tools/Cl_vGeneral.js";
import Cl_controlador from "./Cl_controlador.js";

export default class vTransaccion extends Cl_vGeneral {
    private inFecha: HTMLInputElement;
    private inDescripcion: HTMLInputElement;
    private inMonto: HTMLInputElement;
    private inReferencia: HTMLInputElement;
    private inTipoTransaccion: HTMLInputElement;
    private inCategoria: HTMLInputElement;
    private btVolver: HTMLButtonElement;
    private btGuardar: HTMLButtonElement;
    
    constructor(){
        super({formName: "registroTransaccion"})
        this.inFecha = this.crearHTMLInputElement("inFecha");
        this.inDescripcion = this.crearHTMLInputElement("inDescripcion");
        this.inMonto = this.crearHTMLInputElement("inMonto");
        this.inReferencia = this.crearHTMLInputElement("inReferencia");
        this.inTipoTransaccion = this.crearHTMLInputElement("inTipoTransaccion");
        this.inCategoria = this.crearHTMLInputElement("inCategoria");
        this.btGuardar = this.crearHTMLButtonElement("btGuardar", {
            onclick: () => this.guardar()
        });
        this.btVolver = this.crearHTMLButtonElement("btVolver", {
            onclick: () => this.volver()
        });
    }

    private guardar(){ //ARREGLADO
        if (!this.inFecha.value || !this.inDescripcion.value || !this.inMonto.value || !this.inReferencia.value || !this.inTipoTransaccion.value || !this.inCategoria.value){ 
            alert("Debes llenar todos los campos.");
            return;}
        if (+this.inMonto.value <= 0){ 
            alert("El monto debe ser mayor a 0.");
            return;
        }
        if (this.inReferencia.value.length !== 3){
            alert("La referencia debe tener 3 caracteres.");
            return;
        }
    const data = {
        fecha: this.inFecha.value,
        descripcion: this.inDescripcion.value.toLowerCase(),
        monto: parseFloat(this.inMonto.value || "0"),
        referencia: this.inReferencia.value.trim().toUpperCase(),
        tipoTransaccion: parseInt(this.inTipoTransaccion.value || "0", 10),
        categoria: parseInt(this.inCategoria.value || "0", 10)
    };
        this.controlador?.procesarTransaccion(data);
        this.limpiar();
    }
    private volver(){
        this.limpiar();
        this.controlador?.mostrarVista("transacciones");
    }

    private limpiar() {
        this.inFecha.value = "";
        this.inDescripcion.value = "";
        this.inReferencia.value = "";
        //Prueba
        this.inMonto.value = "";
        this.inTipoTransaccion.value = "";
        this.inCategoria.value = "";
    }

    public mostrar() { this.vista!.hidden = false; }
    public ocultar() { this.vista!.hidden = true; }
        
}

