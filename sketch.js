let obra;
let lastIndex = -1;
let texturas = [];

function preload() {
  for (let i = 1; i <= 4; i++) {
    texturas.push(loadImage('img/textura' + i + '.png',
      () => console.log("Textura " + i + " cargada OK"),
      () => console.warn("Textura " + i + " no encontrada")
    ));
  }
}

function setup() {
  let canvas = createCanvas(600, 800);
  canvas.parent('canvas-holder');

  let btn = document.getElementById('btnGenerar');
  if (btn) {
    btn.onclick = () => {
      generarNuevaObra();
      redraw();
    };
  }

  generarNuevaObra();
  noLoop();
}

function draw() {
  background(255);
  if (obra) {
    obra.dibujar();
  }
  if (texturas.length > 0) {
    let t = random(texturas);
    blendMode(MULTIPLY);
    tint(255, 200);
    image(t, 0, 0, width, height);
    tint(255, 255);
    blendMode(BLEND);
  }
}

function keyPressed() {
  if (key === ' ' || key === 'r' || key === 'R') {
    generarNuevaObra();
    redraw();
  }
}

function generarNuevaObra() {
  const familiasConcretas = [Familia1, Familia2, Familia3, Familia4];
  const seleccion = document.getElementById('selectorFamilia').value;

  let Elegida;

  if (seleccion === "azar") {
    Elegida = FamiliaAzar;
  } else {
    let index = parseInt(seleccion);
    lastIndex = index;
    Elegida = familiasConcretas[index];
  }

  obra = new Elegida();
  console.log("Sistema activo: " + Elegida.name);
}