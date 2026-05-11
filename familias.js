class Familia1 {
  constructor() {
    this.centroX = width / 2;
    
    // FONDO DINÁMICO
    this.ejeY_izq = height * random(0.2, 0.8); 
    this.ejeY_der = height * random(0.2, 0.8); 
    
    let coloresFondo = ["#5F93A9", "#F8D821"]; 
    let fondoIzq = shuffle([...coloresFondo]);
    this.colorIzqArriba = fondoIzq[0];
    this.colorIzqAbajo = fondoIzq[1];
    
    let fondoDer = shuffle([...coloresFondo]);
    this.colorDerArriba = fondoDer[0];
    this.colorDerAbajo = fondoDer[1];
    
    // MAZOS DE COLOR
    this.mazoNucleos = ["#34393e", "#34393e", "#34393e", "#c2cd1d", "#c2cd1d", "#6BA0B8"];
    this.colorRojoCinta = "#fe3f2c";
    this.colorGrisCapa3 = "#9ea091";
    this.restoCapa2 = ["#4f74d1", "#f6fffc", "#898A88"]; 
    this.restoCapa3 = ["#ab9f3d", "#b7d752", null, null]; 
    
    // ==========================================
    // ESCALA ACTUALIZADA (NUEVA JERARQUÍA)
    // ==========================================
    this.dBase = height * 0.20; // Tu ajuste de escala
    this.radio = this.dBase / 2; 
    this.grosorBanda = this.radio; 
    
    this.dTalle2 = this.dBase * 1.8;
    this.dTalle3 = this.dBase * 2.5;
    
    this.generarEstructura();
  }

  generarEstructura() {
    // ESTRUCTURA CENTRAL FIJA (1-2-2-1)
    let ejeFijo = ['L', 'R', 'R', 'L', 'L', 'R'];

    // MOTOR NÚCLEOS (Regla de contraste vertical)
    let nucleosOrdenados = [];
    let ordenValido = false;
    while (!ordenValido) {
      nucleosOrdenados = shuffle([...this.mazoNucleos]);
      ordenValido = true;
      for (let i = 1; i < 6; i++) {
        if (nucleosOrdenados[i] === nucleosOrdenados[i-1]) { 
          ordenValido = false; break; 
        }
      }
    }

    // REPARTO DE MAZOS (L y R)
    let remanenteC2 = shuffle([...this.restoCapa2]);
    let coloresExtrasC3 = shuffle(["#ab9f3d", "#b7d752"]); 

    let mazoCapa2_L = shuffle([this.colorRojoCinta, this.colorRojoCinta, remanenteC2[0]]);
    let mazoCapa3_L = shuffle([this.colorGrisCapa3, coloresExtrasC3[0], null]);

    let mazoCapa2_R = shuffle([this.colorRojoCinta, remanenteC2[1], remanenteC2[2]]);
    let mazoCapa3_R = shuffle([this.colorGrisCapa3, coloresExtrasC3[1], null]);

    this.niveles = [];
    
    // CÁLCULO DE CENTRADO ELÁSTICO
    let alturaTotalEstructura = 5 * this.radio; 
    let yInicial = (height - alturaTotalEstructura) / 2;

    // LÓGICA DE COMPENSACIÓN
    let valorDesfase = this.radio * 0.35; 
    let unidoArriba = random() > 0.5; 

    for (let i = 0; i < 6; i++) {
      let ladoActual = ejeFijo[i];
      let yPos = yInicial + (this.radio * i);
      
      // Aplicación de la regla de balanza
      if (i === 0 && !unidoArriba) {
        yPos -= valorDesfase; 
      } else if (i === 5 && unidoArriba) {
        yPos += valorDesfase; 
      }

      let cTalle2 = (ladoActual === 'L') ? mazoCapa2_L.pop() : mazoCapa2_R.pop();
      let cTalle3 = (ladoActual === 'L') ? mazoCapa3_L.pop() : mazoCapa3_R.pop();

      let capasNivel = [{ talle: 2, diametro: this.dTalle2, color: cTalle2 }];
      if (cTalle3 !== null) {
        capasNivel.push({ talle: 3, diametro: this.dTalle3, color: cTalle3 });
      }

      this.niveles.push({
        lado: ladoActual,
        y: yPos,
        colorNucleo: nucleosOrdenados[i],
        capas: capasNivel
      });
    }
  }

  dibujar() {
    push();
    noStroke(); 
    
    // FONDO
    fill(this.colorIzqArriba); rect(0, 0, this.centroX, this.ejeY_izq);
    fill(this.colorIzqAbajo); rect(0, this.ejeY_izq, this.centroX, height - this.ejeY_izq);
    fill(this.colorDerArriba); rect(this.centroX, 0, width - this.centroX, this.ejeY_der);
    fill(this.colorDerAbajo); rect(this.centroX, this.ejeY_der, width - this.centroX, height - this.ejeY_der);

    // DIBUJO POR Z-INDEX
    for (let talle of [3, 2]) {
      for (let i = this.niveles.length - 1; i >= 0; i--) {
        let n = this.niveles[i];
        for (let capa of n.capas) {
          if (capa.talle === talle && capa.color !== this.colorRojoCinta) {
            fill(capa.color);
            this.renderSemicirculo(n.lado, n.y, capa.diametro);
          }
        }
      }
    }
    
    for (let i = this.niveles.length - 1; i >= 0; i--) {
      let n = this.niveles[i];
      for (let capa of n.capas) {
        if (capa.color === this.colorRojoCinta) {
          fill(capa.color);
          this.renderSemicirculo(n.lado, n.y, capa.diametro);
        }
      }
    }

    for (let i = this.niveles.length - 1; i >= 0; i--) {
      let n = this.niveles[i];
      fill(n.colorNucleo);
      this.renderSemicirculo(n.lado, n.y, this.dBase);
    }
    pop();
  }

  renderSemicirculo(lado, y, diametro) {
    if (lado === 'L') {
      arc(this.centroX, y, diametro, diametro, HALF_PI, 3 * HALF_PI);
    } else {
      arc(this.centroX, y, diametro, diametro, 3 * HALF_PI, HALF_PI);
    }
  }
}


class Familia2 {
  constructor() {
    this.col = {
      negro:    "#1a1a1a",
      blanco:   "#f0ede6",
      amarillo: "#e8c700",
      rojo:     "#d42b1e",
      naranja:  "#e05a1a",
      verde:    "#3a8c2f",
      azul:     "#2060b0",
      gris:     "#b8b0a8"
    };

    this.paleta = {
      fondos: [
        "#8fa8b0",  // azul grisáceo claro
        "#c4a85a",  // dorado cálido
        "#b8b8b0",  // gris frío
        "#d4b870"   // amarillo dorado
      ],
      nucleos: [
        "#1a1a1a",  // negro puro
        "#f0ede6",  // blanco roto
        "#e8c700",  // amarillo puro
        "#d42b1e",  // rojo primario
        "#e05a1a",  // naranja
        "#3a8c2f",  // verde brillante
        "#2060b0",  // azul eléctrico
        "#c94060",  // rosa-rojo
        "#b8b0a8",  // gris neutro
        "#1a1a1a",  // negro (repetido para peso visual)
        "#e8a030"   // naranja-amarillo
      ],
      anillos: [
        "#3a8c2f",  // verde brillante
        "#2060b0",  // azul eléctrico
        "#d42b1e",  // rojo primario
        "#e8c700",  // amarillo puro
        "#f5c0b0",  // rosa pálido
        "#6ab8d0",  // celeste suave
        "#e05a1a",  // naranja
        "#1a1a1a",  // negro
        "#f0ede6",  // blanco roto
        "#c8d040",  // verde-amarillo
        "#5090c8",  // azul medio
        "#88c870"   // verde claro
      ]
    };

    let fondoShuffle = shuffle([...this.paleta.fondos]);
    this.bgTopL = fondoShuffle[0];
    this.bgBotL = fondoShuffle[1];
    this.bgTopR = fondoShuffle[2];
    this.bgBotR = fondoShuffle[3];
    this.anilloPal = shuffle([...this.paleta.anillos]);
    this.nucleoPal = shuffle([...this.paleta.nucleos]);

    this.cx    = width / 2;
    this.scale = 0.85;

    this.y1 = height * 0.22;
    this.y2 = height * 0.50;
    this.y3 = height * 0.78;

    this.bgXSplit = width * 0.5;
    this.ySplitL  = height * random(0.28, 0.42);
    this.ySplitR  = height * random(0.56, 0.72);
  }

  // Helper: Anillo con grosor variable
  anilloSemi(x, y, d_ext, d_int, lado, col) {
    let a1 = (lado === "L") ? HALF_PI : -HALF_PI;
    let a2 = (lado === "L") ? HALF_PI + PI : HALF_PI;

    push();
    noFill();
    stroke(col);
    strokeCap(SQUARE);

    let grosor = (d_ext - d_int) / 2;
    if (grosor <= 0) grosor = 1;

    strokeWeight(grosor);
    let d_medio = (d_ext + d_int) / 2;
    arc(x, y, d_medio, d_medio, a1, a2);
    pop();
  }

  cuadrantes() {
    noStroke();
    fill(this.bgTopL); rect(0, 0, this.bgXSplit, this.ySplitL);
    fill(this.bgBotL); rect(0, this.ySplitL, this.bgXSplit, height - this.ySplitL);
    fill(this.bgTopR); rect(this.bgXSplit, 0, width - this.bgXSplit, this.ySplitR);
    fill(this.bgBotR); rect(this.bgXSplit, this.ySplitR, width - this.bgXSplit, height - this.ySplitR);
  }

  capasFondo() {
    let dMax = 1800 * this.scale;

    // Secuencias de anillos basadas en la paleta Delaunay
    let seqR = [
      "#3a8c2f",  // verde brillante
      "#2060b0",  // azul eléctrico
      "#d42b1e",  // rojo primario
      "#e8c700",  // amarillo
      "#f5c0b0",  // rosa pálido
      "#6ab8d0"   // celeste
    ];
    let seqL = [
      "#6ab8d0",  // celeste
      "#f5c0b0",  // rosa pálido
      "#e8c700",  // amarillo
      "#d42b1e",  // rojo
      "#2060b0",  // azul
      "#3a8c2f"   // verde
    ];

    // --- LADO DERECHO ---
    let dActualR = dMax;
    for (let i = 0; i < 20; i++) {
      let g         = random([15, 25, 40, 60, 70]) * this.scale;
      let espaciado = random([10, 20, 30]);
      this.anilloSemi(this.cx, this.y2, dActualR, dActualR - g, "R", seqR[i % seqR.length]);
      dActualR -= (g + espaciado);
      if (dActualR < 120) break;
    }

    // --- LADO IZQUIERDO ---
    let dActualL = dMax;
    for (let i = 0; i < 20; i++) {
      let g         = random([15, 25, 40, 60, 70]) * this.scale;
      let espaciado = random([10, 20, 30]);
      this.anilloSemi(this.cx, this.y2, dActualL, dActualL - g, "L", seqL[i % seqL.length]);
      dActualL -= (g + espaciado);
      if (dActualL < 120) break;
    }

    // --- NODOS PUENTE ---
    let puenteA = ["#e05a1a", "#d42b1e", "#e8c700"];   // naranja-rojo-amarillo
    let puenteB = ["#88c870", "#3a8c2f", "#c8d040"];   // verdes

    this.nodoPuente(this.cx, (this.y1 + this.y2) / 2, "R", puenteA, 450);
    this.nodoPuente(this.cx, (this.y2 + this.y3) / 2, "R", puenteB, 400);
    this.nodoPuente(this.cx, this.y2 + 150,            "R", puenteA, 300);
    this.nodoPuente(this.cx, (this.y1 + this.y2) / 2, "L", puenteA, 450);
    this.nodoPuente(this.cx, (this.y2 + this.y3) / 2, "L", puenteB, 400);
    this.nodoPuente(this.cx, this.y2 + 150,            "L", puenteA, 300);
  }

  nodoPuente(x, y, lado, colores, dBase) {
    let d_actual = dBase * this.scale;
    colores.forEach((c) => {
      let g = random(20, 40) * this.scale;
      this.anilloSemi(x, y, d_actual, d_actual - g, lado, c);
      d_actual -= (g + random(5, 15));
    });
  }

  nucleoSuperior() {
    let pattern = random(['concentric', 'arcs', 'mixed']);
    let d = 300 * this.scale;

    if (pattern === 'concentric') {
      // Anillos concéntricos: negro exterior → blanco → amarillo → verde → azul
      let colors = ["#1a1a1a", "#f0ede6", "#e8c700", "#3a8c2f", "#2060b0"];
      let dCurrent   = d;
      let decrement  = 25 * this.scale;
      for (let i = 0; i < 5; i++) {
        noStroke();
        fill(colors[i]);
        circle(this.cx, this.y1, dCurrent);
        dCurrent -= decrement;
      }

    } else if (pattern === 'arcs') {
      // Mitades izq/der en distintos colores vivos
      this.anilloSemi(this.cx, this.y1, d,      d - 30, "L", "#e8c700");  // amarillo izq
      this.anilloSemi(this.cx, this.y1, d,      d - 30, "R", "#3a8c2f");  // verde der
      this.anilloSemi(this.cx, this.y1, d - 30, d - 60, "L", "#2060b0");  // azul izq
      this.anilloSemi(this.cx, this.y1, d - 30, d - 60, "R", "#d42b1e");  // rojo der

      noStroke();
      fill("#f0ede6"); circle(this.cx, this.y1, d - 60);  // blanco
      fill("#1a1a1a"); circle(this.cx, this.y1, (d - 60) * 0.4); // negro centro

    } else { // mixed
      this.anilloSemi(this.cx, this.y1, d, d - 35, "L", "#e8c700");  // amarillo izq
      this.anilloSemi(this.cx, this.y1, d, d - 35, "R", "#3a8c2f");  // verde der

      noStroke();
      fill("#f0ede6"); circle(this.cx, this.y1, d - 35); // blanco

      let dInner = d - 35 - 25;
      fill("#1a1a1a"); circle(this.cx, this.y1, dInner); // negro centro
    }
  }

  nucleoMedio() {
    let pattern = random(['concentric', 'arcs', 'mixed']);
    let d = 280 * this.scale;

    if (pattern === 'concentric') {
      let colors    = ["#d42b1e", "#3a8c2f", "#2060b0", "#e8c700"];
      let dCurrent  = d;
      let decrement = 30 * this.scale;
      for (let i = 0; i < 4; i++) {
        noStroke();
        fill(colors[i]);
        circle(this.cx, this.y2, dCurrent);
        dCurrent -= decrement;
      }

    } else if (pattern === 'arcs') {
      this.anilloSemi(this.cx, this.y2, d,      d - 35, "L", "#2060b0");  // azul izq
      this.anilloSemi(this.cx, this.y2, d,      d - 35, "R", "#e05a1a");  // naranja der

      noStroke();
      fill("#e8c700"); circle(this.cx, this.y2, d - 35);  // amarillo base

      this.anilloSemi(this.cx, this.y2, d - 35, d - 70, "L", "#3a8c2f");  // verde izq
      this.anilloSemi(this.cx, this.y2, d - 35, d - 70, "R", "#d42b1e");  // rojo der

      noStroke();
      fill("#d42b1e"); circle(this.cx, this.y2, d - 70); // rojo centro

    } else { // mixed
      this.anilloSemi(this.cx, this.y2, d,      d - 40, "L", "#6ab8d0");  // celeste izq
      this.anilloSemi(this.cx, this.y2, d,      d - 40, "R", "#2060b0");  // azul der

      noStroke();
      fill("#d42b1e"); circle(this.cx, this.y2, d - 40);  // rojo

      this.anilloSemi(this.cx, this.y2, d - 40, d - 70, "R", "#e8c700");  // amarillo der

      noStroke();
      fill("#e8c700"); circle(this.cx, this.y2, d - 70); // amarillo centro
    }
  }

  nucleoInferior() {
    let pattern = random(['arcs', 'concentric', 'mixed']);
    let d = 320 * this.scale;

    if (pattern === 'concentric') {
      let colors    = ["#d42b1e", "#1a1a1a", "#f0ede6", "#e05a1a"];
      let dCurrent  = d;
      let decrement = 35 * this.scale;
      for (let i = 0; i < 4; i++) {
        noStroke();
        fill(colors[i]);
        circle(this.cx, this.y3, dCurrent);
        dCurrent -= decrement;
      }

    } else if (pattern === 'arcs') {
      this.anilloSemi(this.cx, this.y3, d, d - 40, "L", "#d42b1e");  // rojo izq
      this.anilloSemi(this.cx, this.y3, d, d - 40, "R", "#1a1a1a");  // negro der

      noStroke();
      let coreD = d - 40;
      // Mitad izq blanca, mitad der roja → característico de Delaunay
      fill("#f0ede6"); arc(this.cx, this.y3, coreD, coreD, HALF_PI,  HALF_PI + PI, PIE);
      fill("#d42b1e"); arc(this.cx, this.y3, coreD, coreD, -HALF_PI, HALF_PI,      PIE);
      // Centro: mitad verde, mitad negro
      fill("#3a8c2f"); arc(this.cx, this.y3, coreD * 0.5, coreD * 0.5, -HALF_PI, HALF_PI, PIE);

    } else { // mixed
      this.anilloSemi(this.cx, this.y3, d, d - 45, "L", "#d42b1e");  // rojo izq

      noStroke();
      fill("#f0ede6"); circle(this.cx, this.y3, d - 45);  // blanco

      let innerD = d - 45 - 30;
      fill("#1a1a1a"); circle(this.cx, this.y3, innerD);  // negro

      // Detalle interior: mitad verde
      fill("#3a8c2f"); arc(this.cx, this.y3, innerD * 0.8, innerD * 0.8, HALF_PI, HALF_PI + PI, PIE);
    }
  }

  dibujar() {
    this.cuadrantes();
    this.capasFondo();

    stroke(0, 50);
    strokeWeight(4);
    line(this.cx, 0, this.cx, height);

    this.nucleoSuperior();
    this.nucleoMedio();
    this.nucleoInferior();
  }
}

class Familia3 {
  constructor() {
    this.cx = width / 2;
    this.r = width * random(0.20, 0.26); 
    let r = this.r;
    let sep = r * 1.5;
    let totalH = (r * 2) + (sep * 2);
    let top = (height - totalH) / 2;
    this.cy = [top + r, top + r + sep, top + r + sep * 2];

    // --- PALETA DE ANILLOS (Sin duplicados para forzar variedad) ---
    this.mazoAnillosBase = [
      "#eedebc", "#c4b7a6", "#5d7648", "#2d2a29", "#f3e8cd", "#b7ab94", "#c3b6a5"
    ];

    this.mazoFondoClaro = ["#d0bfa6", "#c5b39a", "#ddd0bb"];
    this.mazoFondoVerde = ["#6a7442", "#7a8652"];

    // --- LÓGICA DE SELECCIÓN POR BARAJA ---

    // 1. Fondos (Como siempre)
    if (random() > 0.5) {
      this.colFondoL = random(this.mazoFondoClaro);
      this.colFondoR = random(this.mazoFondoVerde);
    } else {
      this.colFondoL = random(this.mazoFondoVerde);
      this.colFondoR = random(this.mazoFondoClaro);
    }

    // 2. Barajamos el mazo de anillos completo
    let anillosBarajados = shuffle(this.mazoAnillosBase);

    // 3. Repartimos los colores barajados (Asegura que sean todos distintos entre sí)
    this.colS_Ext    = anillosBarajados[0];
    this.colS_Int    = anillosBarajados[1];
    this.colNoS_Ext  = anillosBarajados[2];
    this.colNoS_Int  = anillosBarajados[3];

    // --- REGLA DE EMERGENCIA: Si el color elegido es igual al fondo, lo cambiamos por el siguiente del mazo ---
    if (this.colS_Ext === this.colFondoL || this.colS_Ext === this.colFondoR) {
        this.colS_Ext = anillosBarajados[4];
    }
    if (this.colNoS_Ext === this.colFondoL || this.colNoS_Ext === this.colFondoR) {
        this.colNoS_Ext = anillosBarajados[5];
    }

    // 4. Lógica de Núcleos (Barajado también)
    let coloresParaNucleos = ["#c5422d", "#373334", "#6981b7"];
    this.misNucleos = shuffle(coloresParaNucleos);

    // 5. Excepción cromática
    this.indiceExcep = floor(random(3));
    this.colExcep = "#c5422d"; 

    this.S = ["L", "R", "L"];
  }

  // ... (los métodos semi y dibujar se mantienen iguales)

  obtenerColorDistinto(mazo, evitar) {
    let opciones = mazo.filter(col => !evitar.includes(col));
    return opciones.length > 0 ? random(opciones) : random(mazo);
  }

  semi(cx, cy, r, lado, col) {
    fill(col);
    noStroke();
    let rr = r * 2;
    if (lado === "L") arc(cx, cy, rr + 0.5, rr + 0.5, HALF_PI, 3 * HALF_PI);
    else arc(cx, cy, rr + 0.5, rr + 0.5, -HALF_PI, HALF_PI);
  }

  dibujar() {
    const cx = this.cx;
    const cy = this.cy;
    const r = this.r;

    let r1 = r;
    let r2 = r * 0.75;
    let r4 = r * 0.30;

    // --- 1. FONDO ---
    noStroke();
    fill(this.colFondoL); 
    rect(0, 0, cx + 1, height); 
    fill(this.colFondoR); 
    rect(cx, 0, cx, height);

    // --- 2. CAPA 1: LADO NO-S ---
    for (let i = 0; i < 3; i++) {
      let ladoOpuesto = (this.S[i] === "L") ? "R" : "L";
      this.semi(cx, cy[i], r1, ladoOpuesto, this.colNoS_Ext);
      this.semi(cx, cy[i], r2, ladoOpuesto, this.colNoS_Int);
    }

    // --- 3. CAPA 2: LA S ---
    for (let i = 0; i < 3; i++) {
      let ladoS = this.S[i];
      this.semi(cx, cy[i], r1, ladoS, this.colS_Ext);
      
      if (i === this.indiceExcep) {
        this.semi(cx, cy[i], r2, ladoS, this.colExcep);
      } else {
        this.semi(cx, cy[i], r2, ladoS, this.colS_Int);
      }
    }

    // --- 4. CAPA 3: NÚCLEOS CENTRALES ---
    for (let i = 0; i < 3; i++) {
      fill(this.misNucleos[i]);
      ellipse(cx, cy[i], r4 * 3.5);
    }
  }
}

class FamiliaAzar {
  constructor() {
    this.cx = width / 2;

    // ============================================================
    // PASO 1: SORTEAR PALETA (fuente independiente)
    // ============================================================
    // Cada familia aporta su sistema cromático completo con roles definidos
    const todasLasPaletas = [
      {
        // Paleta F1: azul/amarillo de fondo, núcleos oscuros y lima, cinta roja
        nombre: "F1",
        fondos:  shuffle(["#5F93A9", "#F8D821", "#5F93A9", "#F8D821"]),
        anillos: shuffle(["#fe3f2c", "#4f74d1", "#f6fffc", "#898A88", "#9ea091", "#ab9f3d", "#b7d752"]),
        nucleos: shuffle(["#34393e", "#34393e", "#34393e", "#c2cd1d", "#c2cd1d", "#6BA0B8"])
      },
      {
        // Paleta F2: primarios Delaunay puros
        nombre: "F2",
        fondos:  shuffle(["#8fa8b0", "#c4a85a", "#b8b8b0", "#d4b870"]),
        anillos: shuffle(["#3a8c2f", "#2060b0", "#d42b1e", "#e8c700", "#f5c0b0", "#6ab8d0", "#e05a1a", "#1a1a1a", "#f0ede6", "#c8d040", "#88c870"]),
        nucleos: shuffle(["#1a1a1a", "#f0ede6", "#e8c700", "#d42b1e", "#e05a1a", "#3a8c2f", "#2060b0", "#c94060", "#b8b0a8", "#e8a030"])
      },
      {
        // Paleta F3: terrosa (beige, verde musgo, marrón)
        nombre: "F3",
        fondos:  shuffle(["#d0bfa6", "#c5b39a", "#ddd0bb", "#6a7442", "#7a8652"]),
        anillos: shuffle(["#eedebc", "#c4b7a6", "#5d7648", "#2d2a29", "#f3e8cd", "#b7ab94", "#c3b6a5"]),
        nucleos: shuffle(["#c5422d", "#373334", "#6981b7", "#2d2a29", "#5d7648"])
      },
      {
        // Paleta F4: acentos fuertes sobre neutro claro
        nombre: "F4",
        fondos:  shuffle(["#f3f0e8", "#e6e0d6", "#f3f0e8", "#e6e0d6"]),
        anillos: shuffle(["#d7263d", "#3562b7", "#f2c94c", "#111111", "#f3f0e8", "#d7263d", "#3562b7"]),
        nucleos: shuffle(["#111111", "#f3f0e8", "#d7263d", "#3562b7", "#f2c94c"])
      }
    ];
    this.pal = random(todasLasPaletas);

    // ============================================================
    // PASO 2: SORTEAR FONDO (fuente independiente)
    // ============================================================
    // Los 4 sistemas de fondo, parametrizados para recibir colores externos
    const sistemasFondo = ["F1", "F2", "F3", "F4"];
    this.fuenteFondo = random(sistemasFondo);

    // Pre-calcular parámetros del fondo que necesiten randomness
    this.ejeY_izq  = height * random(0.2, 0.8);
    this.ejeY_der  = height * random(0.2, 0.8);
    this.ySplitL   = height * random(0.28, 0.42);
    this.ySplitR   = height * random(0.56, 0.72);
    // F4: un solo color de fondo
    this.bgUnico   = this.pal.fondos[0];

    // ============================================================
    // PASO 3: SORTEAR COMPOSICIÓN (fuente independiente)
    // ============================================================
    const sistemasComp = ["F1", "F2", "F3", "F4"];
    this.fuenteComp = random(sistemasComp);

    // Pre-calcular parámetros de composición según la fuente elegida
    this._prepararComp();

    console.log(`FamiliaAzar → paleta:${this.pal.nombre} fondo:${this.fuenteFondo} comp:${this.fuenteComp}`);
  }

  // ============================================================
  // PRE-CÁLCULO DE COMPOSICIÓN
  // ============================================================
  _prepararComp() {
    const p = this.pal;

    if (this.fuenteComp === "F1") {
      // 6 semicírculos en columna, alternados L/R, 2-3 capas de anillo
      this.dBase  = height * 0.20;
      this.radio  = this.dBase / 2;
      this.dT2    = this.dBase * 1.8;
      this.dT3    = this.dBase * 2.5;

      let ejeFijo = ['L', 'R', 'R', 'L', 'L', 'R'];
      let anillosBarajados = shuffle([...p.anillos]);
      let nucleosBarajados = [];
      let valido = false;
      while (!valido) {
        nucleosBarajados = shuffle([...p.nucleos]);
        valido = true;
        for (let i = 1; i < nucleosBarajados.length && i < 6; i++) {
          if (nucleosBarajados[i] === nucleosBarajados[i-1]) { valido = false; break; }
        }
      }

      let totalH  = 5 * this.radio;
      let yIni    = (height - totalH) / 2;
      let desfase = this.radio * 0.35;
      let uneArriba = random() > 0.5;

      this.niveles = [];
      for (let i = 0; i < 6; i++) {
        let yPos = yIni + this.radio * i;
        if (i === 0 && !uneArriba) yPos -= desfase;
        if (i === 5 &&  uneArriba) yPos += desfase;
        this.niveles.push({
          lado: ejeFijo[i],
          y: yPos,
          colorNucleo: nucleosBarajados[i % nucleosBarajados.length],
          cT2: anillosBarajados[i % anillosBarajados.length],
          cT3: (random() > 0.4) ? anillosBarajados[(i + 3) % anillosBarajados.length] : null
        });
      }

    } else if (this.fuenteComp === "F2") {
      // 3 nodos grandes con anillos densos de fondo + nodos puente
      this.scale = 0.85;
      this.y1 = height * 0.22;
      this.y2 = height * 0.50;
      this.y3 = height * 0.78;
      // Preparar secuencias de anillos con la paleta recibida
      let a = shuffle([...p.anillos]);
      this.seqR = [a[0], a[1], a[2], a[3], a[4 % a.length], a[5 % a.length]];
      this.seqL = [...this.seqR].reverse();
      // Nodos puente: grupos de 3 colores
      this.puenteA = [a[0], a[1], a[2]];
      this.puenteB = [a[3], a[4 % a.length], a[5 % a.length]];
      // Núcleos de los 3 nodos principales
      let n = shuffle([...p.nucleos]);
      this.nucleosF2 = [n[0], n[1 % n.length], n[2 % n.length]];

    } else if (this.fuenteComp === "F3") {
      // 3 círculos completos con semicírculos de anillo (lado S y no-S)
      this.r = width * random(0.20, 0.26);
      let r = this.r;
      let sep = r * 1.5;
      let totalH = (r * 2) + (sep * 2);
      let top = (height - totalH) / 2;
      this.cyF3 = [top + r, top + r + sep, top + r + sep * 2];

      let a = shuffle([...p.anillos]);
      this.colS_Ext   = a[0];
      this.colS_Int   = a[1];
      this.colNoS_Ext = a[2];
      this.colNoS_Int = a[3];
      let n = shuffle([...p.nucleos]);
      this.nucleosF3  = [n[0], n[1 % n.length], n[2 % n.length]];
      this.indiceExcep = floor(random(3));
      this.colExcep   = p.anillos[0]; // el color más "dominante" de la paleta
      this.S = shuffle(["L", "R", "L"]);

    } else { // F4
      // 3 módulos órbita (arco + núcleo bicolor) con masas grandes
      this.scale  = random(0.9, 1.2);
      this.dCore  = 170 * this.scale;
      this.g      = 28  * this.scale;
      this.dOrbit = this.dCore + this.g * 2;
      this.baseY  = random(-60, 120);
      this.y1F4   = this.baseY;
      this.y2F4   = this.y1F4 + this.dOrbit;
      this.y3F4   = this.y2F4 + this.dOrbit;
      this.desfase   = random() < 0.6;
      this.deltaX    = random(-20, 20);
      this.deltaY    = random(-30, 30);
      this.rojoOffY  = random(-80, 100);
      // Asignar roles de color desde la paleta recibida
      let a = shuffle([...p.anillos]);
      this.colorA = a[0]; // masa L
      this.colorB = a[1]; // masa R
      this.colorC = a[2]; // masa esquina
      let n = shuffle([...p.nucleos]);
      this.negro  = n[0]; // "negro" funcional (el más oscuro disponible)
      this.blanco = n[1 % n.length]; // "blanco" funcional
    }
  }

  // ============================================================
  // HELPERS DE DIBUJO
  // ============================================================
  _semi(lado, y, d, col) {
    fill(col); noStroke();
    if (lado === "L") arc(this.cx, y, d, d, HALF_PI, 3 * HALF_PI);
    else              arc(this.cx, y, d, d, -HALF_PI, HALF_PI);
  }

  _anilloSemi(x, y, dExt, dInt, lado, col) {
    let a1 = (lado === "L") ? HALF_PI : -HALF_PI;
    let a2 = (lado === "L") ? HALF_PI + PI : HALF_PI;
    push(); noFill(); stroke(col); strokeCap(SQUARE);
    let grosor = (dExt - dInt) / 2;
    if (grosor <= 0) grosor = 1;
    strokeWeight(grosor);
    arc(x, y, (dExt + dInt) / 2, (dExt + dInt) / 2, a1, a2);
    pop();
  }

  // ============================================================
  // SISTEMAS DE FONDO
  // ============================================================
  _dibujarFondo() {
    const f = this.pal.fondos;
    noStroke();

    if (this.fuenteFondo === "F1") {
      // 4 rectángulos: 2 por lado con corte horizontal independiente
      fill(f[0]); rect(0, 0, this.cx, this.ejeY_izq);
      fill(f[1]); rect(0, this.ejeY_izq, this.cx, height - this.ejeY_izq);
      fill(f[2 % f.length]); rect(this.cx, 0, this.cx, this.ejeY_der);
      fill(f[3 % f.length]); rect(this.cx, this.ejeY_der, this.cx, height - this.ejeY_der);

    } else if (this.fuenteFondo === "F2") {
      // 4 cuadrantes con cortes L y R independientes
      fill(f[0]); rect(0, 0, this.cx, this.ySplitL);
      fill(f[1]); rect(0, this.ySplitL, this.cx, height - this.ySplitL);
      fill(f[2 % f.length]); rect(this.cx, 0, this.cx, this.ySplitR);
      fill(f[3 % f.length]); rect(this.cx, this.ySplitR, this.cx, height - this.ySplitR);

    } else if (this.fuenteFondo === "F3") {
      // Bicolor vertical puro
      fill(f[0]); rect(0, 0, this.cx + 1, height);
      fill(f[1]); rect(this.cx, 0, this.cx, height);

    } else { // F4
      // Un solo color de fondo
      background(this.bgUnico);
    }
  }

  // ============================================================
  // SISTEMAS DE COMPOSICIÓN
  // ============================================================
  _dibujarCompF1() {
    // Primero talles grandes (detrás), luego talles chicos, luego núcleos
    for (let i = this.niveles.length - 1; i >= 0; i--) {
      let n = this.niveles[i];
      if (n.cT3) { fill(n.cT3); this._semi(n.lado, n.y, this.dT3, n.cT3); }
    }
    for (let i = this.niveles.length - 1; i >= 0; i--) {
      let n = this.niveles[i];
      fill(n.cT2); this._semi(n.lado, n.y, this.dT2, n.cT2);
    }
    for (let i = this.niveles.length - 1; i >= 0; i--) {
      let n = this.niveles[i];
      fill(n.colorNucleo); this._semi(n.lado, n.y, this.dBase, n.colorNucleo);
    }
  }

  _dibujarCompF2() {
    const cx = this.cx;
    const sc = this.scale;
    let dMax = 1800 * sc;

    // Capas de anillos de fondo
    let dR = dMax;
    for (let i = 0; i < 20; i++) {
      let g = random([15, 25, 40, 60, 70]) * sc;
      let esp = random([10, 20, 30]);
      this._anilloSemi(cx, this.y2, dR, dR - g, "R", this.seqR[i % this.seqR.length]);
      dR -= (g + esp);
      if (dR < 120) break;
    }
    let dL = dMax;
    for (let i = 0; i < 20; i++) {
      let g = random([15, 25, 40, 60, 70]) * sc;
      let esp = random([10, 20, 30]);
      this._anilloSemi(cx, this.y2, dL, dL - g, "L", this.seqL[i % this.seqL.length]);
      dL -= (g + esp);
      if (dL < 120) break;
    }

    // Nodos puente
    const nodoPuente = (x, y, lado, cols, dBase) => {
      let d = dBase * sc;
      cols.forEach(c => {
        let g = random(20, 40) * sc;
        this._anilloSemi(x, y, d, d - g, lado, c);
        d -= (g + random(5, 15));
      });
    };
    nodoPuente(cx, (this.y1 + this.y2) / 2, "R", this.puenteA, 450);
    nodoPuente(cx, (this.y2 + this.y3) / 2, "R", this.puenteB, 400);
    nodoPuente(cx, (this.y1 + this.y2) / 2, "L", this.puenteA, 450);
    nodoPuente(cx, (this.y2 + this.y3) / 2, "L", this.puenteB, 400);

    // Línea central
    stroke(0, 50); strokeWeight(4);
    line(cx, 0, cx, height);

    // Núcleos de los 3 nodos principales (círculos concéntricos)
    const ys = [this.y1, this.y2, this.y3];
    noStroke();
    for (let i = 0; i < 3; i++) {
      let d = [300, 280, 320][i] * sc;
      let cols = shuffle([...this.pal.anillos]);
      let dCur = d;
      for (let j = 0; j < 4; j++) {
        fill(cols[j % cols.length]);
        circle(cx, ys[i], dCur);
        dCur -= 28 * sc;
      }
    }
  }

  _dibujarCompF3() {
    const cx = this.cx;
    const r  = this.r;
    const r1 = r;
    const r2 = r * 0.75;
    const r4 = r * 0.30;

    for (let i = 0; i < 3; i++) {
      let cy = this.cyF3[i];
      let ladoOpuesto = (this.S[i] === "L") ? "R" : "L";
      this._semi(ladoOpuesto, cy, r1 * 2, this.colNoS_Ext);
      this._semi(ladoOpuesto, cy, r2 * 2, this.colNoS_Int);
    }
    for (let i = 0; i < 3; i++) {
      let cy = this.cyF3[i];
      this._semi(this.S[i], cy, r1 * 2, this.colS_Ext);
      let colInt = (i === this.indiceExcep) ? this.colExcep : this.colS_Int;
      this._semi(this.S[i], cy, r2 * 2, colInt);
    }
    noStroke();
    for (let i = 0; i < 3; i++) {
      fill(this.nucleosF3[i]);
      ellipse(cx, this.cyF3[i], r4 * 3.5);
    }
  }

  _dibujarCompF4() {
    const cx = this.cx;
    const sc = this.scale;

    // Método semi local con flip
    const semiF = (x, y, d, lado, col, flip = 1) => {
      fill(col); noStroke();
      let a1 = (lado === "L") ? HALF_PI : -HALF_PI;
      let a2 = (lado === "L") ? HALF_PI + PI : HALF_PI;
      arc(x, y, d, d, a1 * flip, a2 * flip);
    };

    const arco = (x, y, lado, col, flip) => {
      semiF(x, y, this.dOrbit, lado, col, flip);
      semiF(x, y, this.dCore, lado, this.bgUnico, flip);
    };

    const modulo = (y, cL, cR, oL, oR) => {
      let flip = random([1, -1]);
      arco(cx, y, "L", oL, flip);
      arco(cx, y, "R", oR, flip);
      semiF(cx, y, this.dCore, "L", cL, flip);
      semiF(cx, y, this.dCore, "R", cR, flip);
    };

    // Masas de fondo
    let dx = this.desfase ? this.deltaX : 0;
    let dy = this.desfase ? this.deltaY : 0;
    semiF(cx + dx, this.y2F4 - 20 + dy, 600 * sc, "L", this.colorA);
    semiF(cx - dx + dx * 0.6, this.y2F4 + this.rojoOffY + dy, 600 * sc, "R", this.colorB);
    semiF(cx, this.y1F4 - 100, 300 * sc, "R", this.colorC);
    semiF(cx, this.y1F4 - 90, 160 * sc, "R", this.bgUnico);

    // Módulos
    modulo(this.y1F4, this.negro,  this.blanco, this.colorC,  this.negro);
    modulo(this.y2F4, this.blanco, this.negro,  this.negro,   this.blanco);
    modulo(this.y3F4, this.negro,  this.blanco, this.blanco,  this.negro);
  }

  // ============================================================
  // DIBUJAR
  // ============================================================
  dibujar() {
    push();
    this._dibujarFondo();

    if (this.fuenteComp === "F1")      this._dibujarCompF1();
    else if (this.fuenteComp === "F2") this._dibujarCompF2();
    else if (this.fuenteComp === "F3") this._dibujarCompF3();
    else                               this._dibujarCompF4();
    pop();
  }
}

class Familia4 {

  constructor() {

    // ==========================
    // PALETA FIJA (IDENTIDAD)
    // ==========================

    this.paleta = {
      fondos: ["#1f2a44", "#243b55", "#2c3e50"],
      acento: ["#d7263d", "#3562b7", "#f2c94c"],
      neutro: ["#f3f0e8", "#e6e0d6"]
    };

    // fondo estable (puede variar levemente dentro de la misma identidad)
    this.bg = random(this.paleta.neutro);
    this.negro = "#111111";

    // asignación de roles fijos dentro de la familia
    let acentos = shuffle(this.paleta.acento);

    this.colorA = acentos[0]; // estructura azul
    this.colorB = acentos[1]; // estructura roja
    this.colorC = acentos[2]; // masa amarilla

    // ==========================
    // ESCALA
    // ==========================

    this.scale = random(0.9, 1.2);

    this.dCore = 170 * this.scale;
    this.g = 28 * this.scale;
    this.dOrbit = this.dCore + this.g * 2;

    // ==========================
    // POSICIONES VERTICALES
    // ==========================

    this.baseY = random(-60, 120);

    this.y1 = this.baseY;
    this.y2 = this.y1 + this.dOrbit;
    this.y3 = this.y2 + this.dOrbit;

    // ==========================
    // VARIACIÓN ESTRUCTURAL
    // ==========================

    this.desfase = random() < 0.6;

    this.deltaX = random(-20, 20);
    this.deltaY = random(-30, 30);

    this.rojoOffsetY = random(-80, 100);

    // ==========================
    // CENTRO
    // ==========================

    this.cx = width / 2;
  }

  // ==========================
  // SEMICIRCULO BASE
  // ==========================

  semi(x, y, d, lado, col, flip = 1) {

    fill(col);
    noStroke();

    let a1, a2;

    if (lado === "L") {
      a1 = HALF_PI;
      a2 = HALF_PI + PI;
    }

    if (lado === "R") {
      a1 = -HALF_PI;
      a2 = HALF_PI;
    }

    arc(x, y, d, d, a1 * flip, a2 * flip);
  }

  // ==========================
  // ARCO / ANILLO
  // ==========================

  arco(x, y, lado, col, flip) {

    this.semi(x, y, this.dOrbit, lado, col, flip);
    this.semi(x, y, this.dCore, lado, this.bg, flip);
  }

  // ==========================
  // MODULO (con flip estructural)
  // ==========================

  modulo(y, coreL, coreR, orbitL, orbitR) {

    let flip = random([1, -1]);

    this.arco(this.cx, y, "L", orbitL, flip);
    this.arco(this.cx, y, "R", orbitR, flip);

    this.semi(this.cx, y, this.dCore, "L", coreL, flip);
    this.semi(this.cx, y, this.dCore, "R", coreR, flip);
  }

  // ==========================
  // MASA AZUL
  // ==========================

  masaAzul() {

    let dx = this.desfase ? this.deltaX : 0;
    let dy = this.desfase ? this.deltaY : 0;

    this.semi(
      this.cx + dx,
      this.y2 - 20 + dy,
      600 * this.scale,
      "L",
      this.colorA
    );
  }

  // ==========================
  // MASA ROJA
  // ==========================

masaRoja() {

  let dx = this.desfase ? this.deltaX : 0;
  let dy = this.desfase ? this.deltaY : 0;

  // influencia del azul (micro relación)
  let relacion = dx * 0.6;

  this.semi(
    this.cx - dx + relacion,
    this.y2 + this.rojoOffsetY + dy,
    600 * this.scale,
    "R",
    this.colorB
  );
}

  // ==========================
  // MASA AMARILLA
  // ==========================

  masaAmarilla() {

    this.semi(
      300,
      190,
      300 * this.scale,
      "R",
      this.colorC
    );

    this.semi(
      300,
      210,
      160 * this.scale,
      "R",
      this.bg
    );
  }

  // ==========================
  // DIBUJAR
  // ==========================

  dibujar() {

    background(this.bg);

    this.masaAzul();
    this.masaRoja();
    this.masaAmarilla();

    this.modulo(this.y1, this.negro, this.bg, this.colorC, this.negro);
    this.modulo(this.y2, this.bg, this.negro, this.negro, this.bg);
    this.modulo(this.y3, this.negro, this.bg, this.bg, this.negro);
  }
}

