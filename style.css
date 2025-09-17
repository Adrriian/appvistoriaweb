// ---------- LISTAS DE FOTOS ----------
const fotosCarro = [
  { nome: "Frente", ref: "img/carros/frente.jpeg" },
  { nome: "Frente Lado 1", ref: "img/carros/frentelado1.jpeg" },
  { nome: "Farol Dianteiro 1", ref: "img/carros/faroldianteiro1.jpeg" },
  { nome: "Pneu Dianteiro 1", ref: "img/carros/pneudianteiro1.jpeg" },
  { nome: "Espelho Dianteiro 1", ref: "img/carros/espelho1.jpeg" },
  { nome: "Frente Lado 2", ref: "img/carros/frentelado2.jpeg" },
  { nome: "Farol Dianteiro 2", ref: "img/carros/faroldianteiro2.jpeg" },
  { nome: "Pneu Dianteiro 2", ref: "img/carros/pneudianteiro2.jpeg" },
  { nome: "Espelho Dianteiro 2", ref: "img/carros/espelho2.jpeg" },
  { nome: "Traseira", ref: "img/carros/traseira.jpeg" },
  { nome: "Traseira lado 1", ref: "img/carros/traseiralado1.jpeg" },
  { nome: "Farol Traseiro 1", ref: "img/carros/faroltraseira1.jpeg" },
  { nome: "Pneu Traseiro 1", ref: "img/carros/pneutraseiro1.jpeg" },
  { nome: "Traseira lado 2", ref: "img/carros/traseiralado2.jpeg" },
  { nome: "Farol Traseiro 2", ref: "img/carros/faroltraseira2.jpeg" },
  { nome: "Pneu Traseiro 2", ref: "img/carros/pneutraseiro2.jpeg" },
  { nome: "Porta Aberta", ref: "img/carros/portaaberta.jpeg" },
  { nome: "Kilometragem com chave virada", ref: "img/carros/kilometragem.jpeg" },
  { nome: "Parabrisa", ref: "img/carros/parabrisa.jpeg" },
  { nome: "Motor", ref: "img/carros/Motor.jpeg" },
  { nome: "Chassi", ref: "img/carros/chassi.jpeg" },
];

const fotosMoto = [
  { nome: "frente", ref: "placeholder.png" },
  { nome: "traseira", ref: "placeholder.png" },
  { nome: "chassi", ref: "placeholder.png" }
];

const fotosCaminhao = [
  { nome: "frente", ref: "placeholder.png" },
  { nome: "traseira", ref: "placeholder.png" },
  { nome: "motor", ref: "placeholder.png" },
  { nome: "chassi", ref: "placeholder.png" }
];

let fotosLista = [];
let fotosLinks = [];
let indiceFoto = 0;

// ---------- ELEMENTOS ----------
const modalOverlay = document.getElementById("modal-overlay");
const modais = {
  instrucoes: document.getElementById("instruction"),
  veiculo: document.getElementById("modal-veiculo"),
  modo: document.getElementById("modal-modo-fotos"),
  especifica: document.getElementById("modal-fotos-especificas"),
  foto: document.getElementById("modal-foto"),
  resultado: document.getElementById("modal-resultado")
};

const btnFazerVistoria = document.getElementById("btn-fazer-vistoria");
const veiculoBtns = modais.veiculo.querySelectorAll("button");
const btnTodas = document.getElementById("btn-todas");
const btnEspecifica = document.getElementById("btn-especifica");
const listaFotosEspecificas = document.getElementById("lista-fotos-especificas");

const tituloFoto = document.getElementById("titulo-foto");
const referenciaImg = document.getElementById("referencia-img");
const irCameraBtn = document.getElementById("ir-camera");

const cameraContainer = document.getElementById("camera-container");
const video = document.getElementById("video");
const tirarFotoBtn = document.getElementById("tirar-foto");

const fotoTiradaImg = document.getElementById("foto-tirada");
const refazerBtn = document.getElementById("refazer");
const proximaBtn = document.getElementById("proxima");
const fotoReferenciaResultado = document.getElementById("foto-referencia");

// ---------- FUNÇÕES ----------
function mostrarModal(modal) {
  Object.values(modais).forEach(m => m.classList.remove("active"));
  modal.classList.add("active");
  modalOverlay.style.display = "flex";
}

// Iniciar câmera (somente quando usuário clicar)
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;
    await video.play();
  } catch (err) {
    alert("Erro ao acessar a câmera: " + err.message);
  }
}

// Exibir a foto atual (título + referência)
function mostrarFotoAtual() {
  const fotoAtual = fotosLista[indiceFoto];
  tituloFoto.textContent = fotoAtual.nome;
  referenciaImg.src = fotoAtual.ref || "placeholder.png";
  mostrarModal(modais.foto);
}

// Avançar para próxima foto
function avancarFoto() {
  indiceFoto++;
  if (indiceFoto >= fotosLista.length) {
    alert("Vistoria finalizada!");
    modalOverlay.style.display = "flex";
    mostrarModal(modais.instrucoes);
  } else {
    mostrarFotoAtual();
  }
}

// ---------- EVENTOS ----------

// Botão iniciar vistoria → pede permissão de câmera
btnFazerVistoria.addEventListener("click", () => {
  mostrarModal(modais.veiculo);
  startCamera(); // pede permissão só aqui
});

// Escolher veículo
veiculoBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    const tipo = btn.getAttribute("data-veiculo");
    fotosLista =
      tipo === "carro" ? fotosCarro :
      tipo === "moto" ? fotosMoto : fotosCaminhao;
    mostrarModal(modais.modo);
  });
});

// Modo "todas as fotos"
btnTodas.addEventListener("click", () => {
  indiceFoto = 0;
  fotosLinks = [];
  mostrarFotoAtual();
});

// Modo "foto específica"
btnEspecifica.addEventListener("click", () => {
  listaFotosEspecificas.innerHTML = "";
  fotosLista.forEach((f, i) => {
    const b = document.createElement("button");
    b.textContent = f.nome;
    b.addEventListener("click", () => {
      indiceFoto = i;
      fotosLinks = [];
      mostrarFotoAtual();
    });
    listaFotosEspecificas.appendChild(b);
  });
  mostrarModal(modais.especifica);
});

// Ir para câmera
irCameraBtn.addEventListener("click", () => {
  modalOverlay.style.display = "none"; // fecha modal
  cameraContainer.style.display = "flex"; // mostra câmera
});

// Tirar foto
tirarFotoBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg");
  fotoTiradaImg.src = dataUrl;

  // Mostra a referência correta no resultado
  const fotoAtual = fotosLista[indiceFoto];
  fotoReferenciaResultado.src = fotoAtual.ref || "placeholder.png";

  modalOverlay.style.display = "flex";
  mostrarModal(modais.resultado);
});

// Refazer foto
refazerBtn.addEventListener("click", () => {
  modalOverlay.style.display = "none";
  cameraContainer.style.display = "flex";
});

// Próxima foto
proximaBtn.addEventListener("click", () => {
  avancarFoto();
});

// Quando a página carregar, já abre o modal de instruções
window.addEventListener("DOMContentLoaded", () => {
  modalOverlay.style.display = "flex";
  mostrarModal(modais.instrucoes);
});
