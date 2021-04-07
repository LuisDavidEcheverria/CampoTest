let cargas = [];
var carga = {
  x: 0,
  y: 0,
  carga: 1,
  texto: null,
  div: null,
  vector: null,
  i: 0,
  j: 0,
};

var punto = {
  x: 0,
  y: 0,
};

var vectorSuma = {
  x: 0,
  y: 0,
};
let interactuable = document.getElementById("interactuable");
let vectores = document.getElementById("vectores");

var q = 0;
var cargaHTML = document.getElementById("carga");

function dibujarVectores() {}
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
  e = 0;
  for (let i = 0; i < cargas.length; i++) {
    {
      //console.log(cargas[i].x);
      //Obtiene la distancia
      let distancia = (
        Math.sqrt(
          Math.pow(punto.x - cargas[i].x, 2) +
            Math.pow(punto.y - cargas[i].y, 2)
        ) / 40
      ).toFixed(2);
      console.log("D" + i + ":" + distancia);
      //Calcula el campo para todas las cargas
      e += parseFloat(
        ((k * cargas[i].carga) / Math.pow(parseFloat(distancia), 2)).toFixed(2)
      );
    }
  }
  e = (e * Math.pow(10, -9)).toFixed(2);
  campo.textContent = "Campo: " + e + " N/C";
}

// target elements with the "draggable" class
interact(".draggable").draggable({
  // enable inertial throwing
  inertia: false,
  //Mantiene los elementos en el parent
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: "parent",
      endOnly: false,

      //prueba para hacer que se muevan en una grid
    }) /*
      interact.modifiers.snap({
        targets:[
          interact.snappers.grid({x:40,y:40})
        ],
      })*/,
  ],

  autoScroll: false,

  listeners: {
    //Llama esta función cada que se mueve un elemento
    move: dragMoveListener,

    // Llama esta función cada que un elemento termina de ser arrastrado
    end(event) {
      //obtenerCampo();
      console.log("Punto", punto);
      console.log("Carga", carga);
    },
  },
});

function dragMoveListener(event) {
  var target = event.target;
  // keep the dragged position in the data-x/data-y attributes
  var x = Math.floor(
    (parseFloat(target.getAttribute("data-x")) || 0) + event.dx
  );
  var y = Math.floor(
    (parseFloat(target.getAttribute("data-y")) || 0) + event.dy
  );

  // Mueve el elemento
  target.style.webkitTransform = target.style.transform =
    "translate(" + x + "px, " + y + "px)";

  // Actualiza las posiciones
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
  if (target.getAttribute("id") == "punto") {
    punto.x = x;
    punto.y = y;
  } else {
    for (let i = 0; i < cargas.length; i++) {
      if (cargas[i].div.id == target.id) {
        cargas[i].x = x;
        cargas[i].y = y;
        //console.log(cargas);
        break;
      }
    }
  }

  document.getElementById("q").textContent = "Q: X:" + carga.x + "Y:" + carga.y;
  document.getElementById("p").textContent = "P: X:" + punto.x + "Y:" + punto.y;
  obtenerCampo();

  //Test de Vectores
  cargas.forEach((cargaProto) => {
    cargaProto.vector.setAttribute("x1", cargaProto.x + 12.5);
    cargaProto.vector.setAttribute("y1", cargaProto.y + 12.5);
    cargaProto.vector.setAttribute("x2", punto.x + 12.5);
    cargaProto.vector.setAttribute("y2", punto.y + 12.5);
  });
}

//Remover cargas con doble click
interact(".carga").on("doubletap", function (event) {
  let target = event.target;
  for (let i = 0; i < cargas.length; i++) {
    if (cargas[i].div.id == target.id) {
      cargas[i].div.remove();
      cargas[i].vector.remove();
      cargas.splice(i, 1);
      break;
    }
  }
  obtenerCampo();
});

let n = 0;
function AgregarCarga() {
  //Crea una nuevo espacio para la carga
  let div = document.createElement("div");
  div.className = "carga draggable";
  div.id = "carga" + n;
  interactuable.appendChild(div);
  //Crea un nuevo vector
  let vector = document.createElementNS("http://www.w3.org/2000/svg", "line");
  vector.id = "linea" + n;
  vector.setAttribute("x1", 12.5);
  vector.setAttribute("x1", 12.5);
  vector.setAttribute("y1", 12.5);
  vector.setAttribute("x2", punto.x + 12.5);
  vector.setAttribute("y2", punto.y + 12.5);
  vectores.appendChild(vector);

  //Crea un objecto carga
  let nuevaCarga = Object.create(carga);
  nuevaCarga.x = 0;
  nuevaCarga.y = 0;
  nuevaCarga.carga = document.getElementById("cargaInput").value;
  //Crea un nuevo texto
  let txt = document.createTextNode(nuevaCarga.carga);
  div.appendChild(txt);
  nuevaCarga.texto = txt;
  if (nuevaCarga.carga > 0) {
    div.className += " positiva";
    vector.setAttribute("class", "vecPos");
  } else {
    div.className += " negativa";
    vector.setAttribute("class", "vecNeg");
  }
  nuevaCarga.div = div;
  nuevaCarga.vector = vector;

  //Agrega el nuevo objeto a un array con todas las cargas
  cargas.push(nuevaCarga);
  console.log("Carga agregada: ", nuevaCarga);
  n++;

  obtenerCampo();
}

function AlternarVectores(value) {
  console.log(value.checked);
  if (value.checked) {
    vectores.style.visibility = "visible";
  } else {
    vectores.style.visibility = "hidden";
  }
}
window.dragMoveListener = dragMoveListener;
