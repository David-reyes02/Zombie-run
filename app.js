//****** GAME LOOP ********//

var time = new Date();
var deltaTime = 0;

if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(Init, 1);
} else {
    document.addEventListener("DOMContentLoaded", Init);
}

function Init() {
    time = new Date();
    Start();
    Loop();
}

function Loop() {
    deltaTime = (new Date() - time) / 1000;
    time = new Date();
    Update();
    requestAnimationFrame(Loop);
}

//****** GAME LOGIC ********//

var sueloY = 22;
var velY = 0;
var impulso = 900;
var gravedad = 2500;

var dinoPosX = 42;
var dinoPosY = sueloY;

var sueloX = 0;
var velEscenario = 1280 / 3;
var gameVel = 1;
var score = 0;

var parado = false;
var saltando = false;
var iniciado = false;
var tiempoHastaObstaculo = 2;
var tiempoObstaculoMin = 0.7;
var tiempoObstaculoMax = 1.8;
var obstaculoPosY = 16;
var obstaculos = [];

var tiempoHastaNube = 0.5;
var tiempoNubeMin = 0.2;
var tiempoNubeMax = 1.2;
var maxNubeY = 670;
var minNubeY = 250;
var nubes = [];
var velNube = 0.3;

var contenedor;
var dino;
var textoScore;
var suelo;
var gameOver;
var mensajeInicio;

var fondoCielo;
var fondoCasas;
var fondoMuro;
var fondoGrietas;
var fondoCasas2;
var fondoCasas3;
var fondoCasas4;
var fondoCasas5;

let casasX = 0;
let casas2X = 0;
let casas3X = 0;
let casas4X = 0;
let casas5X = 0;
let muroX = 0;
let grietasX = 0;

const fondoAncho = 1920;
let velocidad = 10;
let jugadorMuerto = false;

function Start() {
    gameOver = document.querySelector(".game-over");
    suelo = document.querySelector(".suelo");
    contenedor = document.querySelector(".contenedor");
    textoScore = document.querySelector(".score");
    dino = document.querySelector(".dino");
    mensajeInicio = document.getElementById("mensaje-inicio");

    fondoCielo = document.querySelector(".fondo-cielo");
    fondoCasas = document.querySelector(".fondo-casas");
    fondoMuro = document.querySelector(".fondo-muro");
    fondoGrietas = document.querySelector(".fondo-grietas");
    fondoCasas2 = document.querySelector(".fondo-casas2");
    fondoCasas3 = document.querySelector(".fondo-casas3");
    fondoCasas4 = document.querySelector(".fondo-casas4");
    fondoCasas5 = document.querySelector(".fondo-casas5");

    document.addEventListener("keydown", HandleKeyDown);
    document.addEventListener("touchstart", HandleTouchStart, { passive: false });

    // Pausar animaciones desde el inicio
    suelo.style.animationPlayState = "paused";
    dino.style.animationPlayState = "paused";

    const btn = document.getElementById("btn-reiniciar");
    if (btn) {
        btn.addEventListener("click", () => location.reload());
        btn.addEventListener("touchstart", () => location.reload());
    }
}

function HandleKeyDown(ev) {
    if (ev.keyCode == 32) {
        if (!iniciado) {
            iniciado = true;
            dino.classList.add("dino-corriendo");
            suelo.style.animationPlayState = "running";
            dino.style.animationPlayState = "running";
            if (mensajeInicio) mensajeInicio.style.display = "none";
            return;
        }
        Saltar();
    }
}

function HandleTouchStart(ev) {
    ev.preventDefault();
    if (!iniciado) {
        iniciado = true;
        dino.classList.add("dino-corriendo");
        suelo.style.animationPlayState = "running";
        dino.style.animationPlayState = "running";
        if (mensajeInicio) mensajeInicio.style.display = "none";
        return;
    }
    Saltar();
}

function Update() {
    if (!iniciado || parado) return;

    MoverDinosaurio();
    MoverSuelo();
    MoverFondos();
    DecidirCrearObstaculo();
    DecidirCrearNubes();
    MoverObstaculos();
    MoverNubes();
    DetectarColision();

    velY -= gravedad * deltaTime;
}

function Saltar() {
    if (dinoPosY === sueloY) {
        saltando = true;
        velY = impulso;
        dino.classList.remove("dino-corriendo", "dino-muerto");
        dino.classList.add("dino-saltando");
    }
}

function MoverDinosaurio() {
    dinoPosY += velY * deltaTime;
    if (dinoPosY < sueloY) {
        TocarSuelo();
    }
    dino.style.bottom = dinoPosY + "px";
}

function TocarSuelo() {
    dinoPosY = sueloY;
    velY = 0;
    if (saltando) {
        dino.classList.add("dino-corriendo");
        dino.classList.remove("dino-saltando");
    }
    saltando = false;
}

function MoverSuelo() {
    sueloX += CalcularDesplazamiento();
    suelo.style.left = -(sueloX % contenedor.clientWidth) + "px";
}

function MoverFondos() {
    if (!jugadorMuerto) {
        const desp = velocidad / 3;

        casasX -= desp * 0.4;
        casas5X -= desp * 0.09;
        casas4X -= desp * 0.1;
        casas3X -= desp * 0.2;
        casas2X -= desp * 0.3;
        muroX -= desp * 0.5;
        grietasX -= desp * 0.8;

        fondoCasas.style.backgroundPositionX = `${Math.floor(casasX)}px`;
        fondoCasas5.style.backgroundPositionX = `${Math.floor(casas5X)}px`;
        fondoCasas4.style.backgroundPositionX = `${Math.floor(casas4X)}px`;
        fondoCasas3.style.backgroundPositionX = `${Math.floor(casas3X)}px`;
        fondoCasas2.style.backgroundPositionX = `${Math.floor(casas2X)}px`;
        fondoMuro.style.backgroundPositionX = `${Math.floor(muroX)}px`;
        fondoGrietas.style.backgroundPositionX = `${Math.floor(grietasX)}px`;
    }
}

function CalcularDesplazamiento() {
    return velEscenario * deltaTime * gameVel;
}

function Estrellarse() {
    dino.classList.remove("dino-corriendo", "dino-saltando");
    dino.classList.add("dino-muerto");
    parado = true;

    setTimeout(() => {
        contenedor.classList.add("parado");
        gameOver.style.display = "block";
    }, 600);

    if (dinoPosY > sueloY) {
        let caer = setInterval(() => {
            velY -= gravedad * deltaTime;
            dinoPosY += velY * deltaTime;
            if (dinoPosY <= sueloY) {
                dinoPosY = sueloY;
                dino.style.bottom = sueloY + "px";
                clearInterval(caer);
            } else {
                dino.style.bottom = dinoPosY + "px";
            }
        }, 1000 / 60);
    } else {
        dino.style.bottom = sueloY + "px";
    }
}

function DecidirCrearObstaculo() {
    tiempoHastaObstaculo -= deltaTime;
    if (tiempoHastaObstaculo <= 0) {
        CrearObstaculo();
    }
}

function DecidirCrearNubes() {
    tiempoHastaNube -= deltaTime;
    if (tiempoHastaNube <= 0) {
        CrearNube();
    }
}

function CrearObstaculo() {
    var obstaculo = document.createElement("div");
    contenedor.appendChild(obstaculo);
    obstaculo.classList.add("cactus");

    const tipo = Math.floor(Math.random() * 7) + 1;
    if (tipo > 1) obstaculo.classList.add("cactus" + tipo);

    obstaculo.posX = contenedor.clientWidth;
    obstaculo.style.left = contenedor.clientWidth + "px";

    obstaculos.push(obstaculo);
    tiempoHastaObstaculo = tiempoObstaculoMin + Math.random() * (tiempoObstaculoMax - tiempoObstaculoMin) / gameVel;
}

function CrearNube() {
    var nube = document.createElement("div");
    contenedor.appendChild(nube);
    nube.classList.add("nube");
    nube.posX = contenedor.clientWidth;
    nube.style.left = contenedor.clientWidth + "px";
    nube.style.bottom = minNubeY + Math.random() * (maxNubeY - minNubeY) + "px";

    nubes.push(nube);
    tiempoHastaNube = tiempoNubeMin + Math.random() * (tiempoNubeMax - tiempoNubeMin) / gameVel;
}

function MoverObstaculos() {
    if (parado) return;

    for (var i = obstaculos.length - 1; i >= 0; i--) {
        if (obstaculos[i].posX < -obstaculos[i].clientWidth) {
            obstaculos[i].remove();
            obstaculos.splice(i, 1);
            GanarPuntos();
        } else {
            obstaculos[i].posX -= CalcularDesplazamiento();
            obstaculos[i].style.left = obstaculos[i].posX + "px";
        }
    }
}

function MoverNubes() {
    for (var i = nubes.length - 1; i >= 0; i--) {
        if (nubes[i].posX < -nubes[i].clientWidth) {
            nubes[i].remove();
            nubes.splice(i, 1);
        } else {
            nubes[i].posX -= CalcularDesplazamiento() * velNube;
            nubes[i].style.left = nubes[i].posX + "px";
        }
    }
}

function GanarPuntos() {
    score++;
    textoScore.innerText = score;

    if (score % 5 === 0) {
        gameVel += 0.1;
    }

    if (score >= 10) contenedor.classList.add("mediodia");
    if (score >= 15) contenedor.classList.add("tarde");
    if (score >= 20) contenedor.classList.add("noche");

    suelo.style.animationDuration = (3 / gameVel) + "s";
}

function GameOver() {
    Estrellarse();
}

function DetectarColision() {
    for (var i = 0; i < obstaculos.length; i++) {
        if (obstaculos[i].posX > dinoPosX + dino.clientWidth) break;

        if (IsCollision(dino, obstaculos[i], 70, 60, 70, 60)) {
            GameOver();
        }
    }
}

function IsCollision(a, b, paddingTop, paddingRight, paddingBottom, paddingLeft) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return !(
        ((aRect.top + aRect.height - paddingBottom) < (bRect.top)) ||
        (aRect.top + paddingTop > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width - paddingRight) < bRect.left) ||
        (aRect.left + paddingLeft > (bRect.left + bRect.width))
    );
}


// Mostrar botón de pantalla completa solo en móviles
document.addEventListener("DOMContentLoaded", () => {
    const fullscreenBtn = document.getElementById("btn-fullscreen");

    const esMovil = /Mobi|Android|iPhone|iPad|iPod|Touch/.test(navigator.userAgent);

    if (fullscreenBtn && esMovil) {
        // Mostrar botón si es móvil
        fullscreenBtn.style.display = "block";

        const activarPantallaCompleta = () => {
            const elem = document.documentElement;
            if (!document.fullscreenElement) {
                if (elem.requestFullscreen) {
                    elem.requestFullscreen();
                } else if (elem.webkitRequestFullscreen) {
                    elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    elem.msRequestFullscreen();
                }
            }
        };

        // Soporte para click y touch
        fullscreenBtn.addEventListener("click", e => {
            e.preventDefault();
            activarPantallaCompleta();
        });

        fullscreenBtn.addEventListener("touchend", e => {
            e.preventDefault();
            activarPantallaCompleta();
        });
    }
});

