const botao = document.getElementById("verMais");
const linhasExtras = document.querySelectorAll(".tbl-sec-extra");

botao.addEventListener("click", function () {

    const tabelaAberta = linhasExtras[0].style.display === "table-row";

    linhasExtras.forEach(function (linha) {
        linha.style.display = tabelaAberta ? "none" : "table-row";
    });

    if (tabelaAberta) {
        botao.textContent = "Ver Mais";
    } else {
        botao.textContent = "Ver Menos";
    }

});