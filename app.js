// Definimos la función constructora para un Movimiento
function Movimiento(tipo, monto, descripcion) {
    if (!tipo || (tipo !== "Ingreso" && tipo !== "Egreso")) {
        throw new Error("Tipo de transacción inválido");
    }
    if (isNaN(monto) || monto <= 0) {
        throw new Error("El monto debe ser un número positivo");
    }
    if (!descripcion.trim()) {
        throw new Error("La descripción no puede estar vacía");
    }

    this.tipo = tipo;
    this.monto = monto;
    this.descripcion = descripcion;
    this.fecha = new Date();
}

// Método para renderizar en el DOM
Movimiento.prototype.render = function () {
    const li = document.createElement("li");
    li.textContent = `${this.fecha.toLocaleDateString()} - ${this.descripcion} - ${this.tipo}: $${this.monto.toFixed(2)}`;
    document.getElementById("transaccionesList").appendChild(li);
};

// Definimos la función constructora para manejar el presupuesto
function Presupuesto() {
    this.movimientos = [];
}

// Método para agregar una nueva transacción
Presupuesto.prototype.agregarMovimiento = function(tipo, monto, descripcion) {
    try {
        const nuevoMovimiento = new Movimiento(tipo, monto, descripcion);
        this.movimientos.push(nuevoMovimiento);
        nuevoMovimiento.render();
        this.mostrarResumen();
    } catch (error) {
        console.error("❌", error.message);
        document.getElementById("errorMessage").textContent = `❌ ${error.message}`;
    }
};

// Método para calcular el saldo total
Presupuesto.prototype.calcularTotalSaldo = function() {
    let totalIngresos = 0;
    let totalEgresos = 0;

    for (const movimiento of this.movimientos) {
        if (movimiento.tipo === "Ingreso") {
            totalIngresos += movimiento.monto;
        } else {
            totalEgresos += movimiento.monto;
        }
    }

    return { totalIngresos, totalEgresos, saldoTotal: totalIngresos - totalEgresos };
};

// Método para renderizar el resumen
Presupuesto.prototype.mostrarResumen = function() {
    const { totalIngresos, totalEgresos, saldoTotal } = this.calcularTotalSaldo();

    let resumenHTML = `
        <h3> Resumen General</h3>
        <p>🔹 Movimientos registrados: ${this.movimientos.length}</p>
        <p>💰 Total de Ingresos: $${totalIngresos.toFixed(2)}</p>
        <p>💸 Total de Egresos: $${totalEgresos.toFixed(2)}</p>
        <p>💵 Saldo Total: $${saldoTotal.toFixed(2)}</p>
    `;

    resumenHTML += saldoTotal < 0
        ? `<p style="color:red;">⚠️ ¡Cuidado! Estás en saldo negativo.</p>`
        : `<p style="color:green;">✅ ¡Bien! Tienes un saldo positivo.</p>`;

    document.getElementById("resumen").innerHTML = resumenHTML;
};

// Instanciamos el presupuesto
const presupuesto = new Presupuesto();

// Manejo del formulario de transacciones
document.getElementById("transactionForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const descripcion = document.getElementById("transaccion").value.trim();
    const tipo = document.getElementById("tipoDeTransaccion").value;
    const monto = parseFloat(document.getElementById("monto").value);

    presupuesto.agregarMovimiento(tipo, monto, descripcion);
    
    document.getElementById("transaccion").value = "";
    document.getElementById("monto").value = "";
});

// Manejo del formulario de búsqueda
document.getElementById("searchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const searchInput = document.getElementById("searchInput").value.trim();
    const searchResult = document.getElementById("searchResult");
    
    const resultado = presupuesto.movimientos.find(movimiento => movimiento.descripcion.toLowerCase() === searchInput.toLowerCase());
    
    searchResult.innerHTML = resultado
        ? `✅ Movimiento encontrado: <strong>${resultado.descripcion}</strong> - ${resultado.tipo}: $${resultado.monto.toFixed(2)}`
        : `❌ No se encontró un movimiento con el nombre "<strong>${searchInput}</strong>".`;
});