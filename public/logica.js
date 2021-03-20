var carga = {
  x: 0,
  y: 0,
};

var punto = {
  x: 0,
  y: 0,
};

var distancia = 0;
var q = 0;
var cargaHTML = document.getElementById("carga");

function obtenerCarga() {
  q = document.getElementById("cargaInput").value * Math.pow(10, -9);
  if (q > 0) {
    cargaHTML.style.backgroundColor = "red";
    cargaHTML.textContent = "+";
    cargaHTML.style.boxShadow = "0 0 30px 10px red";
  } else {
    cargaHTML.style.backgroundColor = "blue";
    cargaHTML.textContent = "-";
    cargaHTML.style.boxShadow = "0 0 30px 10px blue";
  }
  obtenerCampo();
  console.log(q);
}

let e = 0;
const k = 9 * Math.pow(10, 9);
let campo = document.getElementById("campo");
function obtenerCampo() {
  e = ((k * q) / Math.pow(distancia, 2)).toFixed(2);
  console.log("Campo: ", e);
  campo.textContent = "Campo: " + e;
}

// target elements with the "draggable" class
interact(".draggable").draggable({
  // enable inertial throwing
  inertia: false,
  //Mantiene los elementos en el parent
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: "parent",
      endOnly: true,

      //prueba para hacer que se muevan en una grid
    }) /*
      interact.modifiers.snap({
        targets:[
          interact.snappers.grid({x:40,y:40})
        ],
      })*/,
  ],

  autoScroll: true,

  listeners: {
    //Llama esta función cada que se mueve un elemento
    move: dragMoveListener,

    // Llama esta función cada que un elemento termina de ser arrastrado
    end(event) {
      console.log("Punto", punto);
      console.log("Carga", carga);
    },
  },
});

function dragMoveListener(event) {
  var target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy;

  // Mueve el elemento
  target.style.webkitTransform = target.style.transform =
    "translate(" + x + "px, " + y + "px)";

  // Actualiza las posiciones
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);

  if (target.getAttribute("id") == "carga") {
    carga.x = x;
    carga.y = y;
  } else {
    punto.x = x;
    punto.y = y;
  }
  //Obtiene la distancia
  distancia = (
    Math.sqrt(Math.pow(punto.x - carga.x, 2) + Math.pow(punto.y - carga.y, 2)) /
    40
  ).toFixed(2);
  document.getElementById("distancia").textContent = "Distancia: " + distancia;
  document.getElementById("q").textContent = "Q: X:" + carga.x + "Y:" + carga.y;
  document.getElementById("p").textContent = "P: X:" + punto.x + "Y:" + punto.y;
  obtenerCampo();
}

window.dragMoveListener = dragMoveListener;