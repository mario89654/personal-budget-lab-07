document.addEventListener("DOMContentLoaded", () => {
    const transacciones = [
        { transaccion: "Salario", tipoDeTransaccion: "Ingreso", monto: 2000 },
        { transaccion: "Alquiler", tipoDeTransaccion: "Egreso", monto: 800 },
        { transaccion: "Mercado", tipoDeTransaccion: "Egreso", monto: 400 },
        { transaccion: "Cena", tipoDeTransaccion: "Egreso", monto: 50 },
        { transaccion: "Suscripción", tipoDeTransaccion: "Egreso", monto: 120 }
    ];

    const form = document.getElementById("transactionForm");
    const transaccionInput = document.getElementById("transaccion");
    const tipoInput = document.getElementById("tipoDeTransaccion");
    const montoInput = document.getElementById("monto");
    const errorMessage = document.getElementById("errorMessage");
    const transaccionesList = document.getElementById("transaccionesList");

    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const searchResult = document.getElementById("searchResult");

    function calcularTotalSaldo() {
        let totalIngresos = 0;
        let totalEgresos = 0;

        for (const transaccion of transacciones) {
            if (transaccion.tipoDeTransaccion === "Ingreso") {
                totalIngresos += transaccion.monto;
            } else {
                totalEgresos += transaccion.monto;
            }
        }

        return { totalIngresos, totalEgresos, saldoTotal: totalIngresos - totalEgresos };
    }

    function mostrarResumen() {
        const { totalIngresos, totalEgresos, saldoTotal } = calcularTotalSaldo();

        let resumenHTML = `
            <h3>📊 Resumen General</h3>
            <p>🔹 Movimientos registrados: ${transacciones.length}</p>
            <p>💰 Total de Ingresos: $${totalIngresos.toFixed(2)}</p>
            <p>💸 Total de Egresos: $${totalEgresos.toFixed(2)}</p>
            <p>💵 Saldo Total: $${saldoTotal.toFixed(2)}</p>
        `;

        if (saldoTotal < 0) {
            resumenHTML += `<p style="color:red;">⚠️ ¡Cuidado! Estás en saldo negativo.</p>`;
        } else {
            resumenHTML += `<p style="color:green;">✅ ¡Bien! Tienes un saldo positivo.</p>`;
        }

        document.getElementById("resumen").innerHTML = resumenHTML;
    }

    function obtenerNombresTransacciones() {
        return transacciones.map(transaccion => transaccion.transaccion);
    }

    function mostrarNombresEnConsola() {
        const nombres = obtenerNombresTransacciones();
        console.log("📌 Lista de nombres de transacciones:", nombres);
    }

    function obtenerEgresosMayoresA100() {
        return transacciones.filter(transaccion =>
            transaccion.tipoDeTransaccion === "Egreso" && transaccion.monto > 100
        );
    }

    function mostrarEgresosMayoresA100() {
        const egresosFiltrados = obtenerEgresosMayoresA100().map(transaccion => transaccion.transaccion);
        console.log("🔍 Gastos mayores a $100:", egresosFiltrados);
    }

    function buscarTransaccionPorNombre(nombre) {
        return transacciones.find(transaccion => transaccion.transaccion.toLowerCase() === nombre.toLowerCase());
    }

    function mostrarBusquedaEnPantalla(nombre) {
        const resultado = buscarTransaccionPorNombre(nombre);
        if (resultado) {
            searchResult.innerHTML = `✅ Movimiento encontrado: <strong>${resultado.transaccion}</strong> - ${resultado.tipoDeTransaccion}: $${resultado.monto}`;
            console.log(`✅ Movimiento encontrado:`, resultado);
        } else {
            searchResult.innerHTML = `❌ No se encontró un movimiento con el nombre "<strong>${nombre}</strong>".`;
            console.log(`❌ No se encontró un movimiento con el nombre "${nombre}".`);
        }
    }

    function actualizarListaTransacciones() {
        transaccionesList.innerHTML = "";
        transacciones.forEach(({ transaccion, tipoDeTransaccion, monto }) => {
            const li = document.createElement("li");
            li.textContent = `${transaccion} - ${tipoDeTransaccion}: $${monto}`;
            transaccionesList.appendChild(li);
        });

        mostrarResumen();
        mostrarNombresEnConsola();
        mostrarEgresosMayoresA100();
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const transaccion = transaccionInput.value.trim();
        const tipoDeTransaccion = tipoInput.value;
        const monto = parseFloat(montoInput.value);

        if (!transaccion || isNaN(monto) || monto <= 0) {
            errorMessage.textContent = "❌ Error: Ingrese datos válidos.";
            return;
        }

        errorMessage.textContent = "";
        transacciones.push({ transaccion, tipoDeTransaccion, monto });

        transaccionInput.value = "";
        montoInput.value = "";

        actualizarListaTransacciones();
    });

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const nombreBuscado = searchInput.value.trim();
        if (nombreBuscado) {
            mostrarBusquedaEnPantalla(nombreBuscado);
        } else {
            searchResult.innerHTML = "❌ Ingrese un nombre para buscar.";
        }
    });

    actualizarListaTransacciones();
});