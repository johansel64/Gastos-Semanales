//VAriables y slectores
const formulario = document.querySelector("#agregar-gasto");
const gastoListado = document.querySelector("#gastos ul");


//Eventos

evenListeners();
function evenListeners() {
    document.addEventListener("DOMContentLoaded",preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}




//Clases

class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante () {
        const gastado = this.gastos.reduce( (total, gasto) => Number(total) + Number(gasto.cantidad), 0 );
        this.restante = this.presupuesto - gastado;
        console.log(this.restante);
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter( gasto => gasto.id !== id );
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto ( cantidad ) {
        console.log(cantidad);
        const { presupuesto, restante } = cantidad;
        document.querySelector("#total").textContent = presupuesto;
        document.querySelector("#restante").textContent = restante;
    }

    imprimirAlerta (mensaje, tipo) {
        //Crear div
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("alert", 'text-center');

        if (tipo === 'error') {
            divMensaje.classList.add("alert-danger");
        }else{
            divMensaje.classList.add('alert-success');
        }

        //Mensaje

        divMensaje.textContent = mensaje;

        document.querySelector(".primario").insertBefore(divMensaje, formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastoListado (gastos) {

        this.limpiarHtml();
        
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            // Crear un LIST
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            //dataset sirve para agregar un dato al html
            nuevoGasto.dataset.id = id;

            // Agregar el html del gasto
            nuevoGasto.innerHTML =`${nombre} <span class='badge badge-primary badge-pill'> $ ${cantidad} </span>`;


            // Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.className = 'btn btn-danger borrar-gasto';
            btnBorrar.innerHTML = '&times'
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //Agregar html
            gastoListado.appendChild(nuevoGasto);

        });
    }

    // Limpiamos los gastos
    limpiarHtml () {
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild)
        }
    }


    actualizarRestante (restante) {
        document.querySelector("#restante").textContent = restante;
    }

    comprobarPresupuesto (presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;
        const restanteDiv = document.querySelector(".restante");
        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }else{
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se agoto...', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

//Instanciar
const ui = new UI();
let presupuesto;


//Funciones

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("Cual es tu presupuesto?");

    if (presupuestoUsuario === "" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0){
        window.location.reload();
    }

    // Presupuesto validado

    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
    e.preventDefault();

    const nombre = document.querySelector('#gasto').value;
    const cantidad = document.querySelector('#cantidad').value;

    if (nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    }else if (cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;
    }


    const gasto = {nombre, cantidad, id: Date.now()}

    //agregar nuevo gasto
    presupuesto.nuevoGasto( gasto );

    ui.imprimirAlerta('Correcto')

    //Imprimir los gastos
    const {gastos, restante} = presupuesto;
    ui.mostrarGastoListado(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    formulario.reset();
}

function eliminarGasto (id) {
    presupuesto.eliminarGasto(id);
    const {gastos, restante} = presupuesto;
    ui.mostrarGastoListado(gastos);
    
    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}