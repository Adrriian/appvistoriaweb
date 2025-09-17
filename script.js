// ---------- LISTAS DE FOTOS ----------
const fotosCarro = [
  "frente","frente lado 1","frente lado 2","farol 1","farol 2","espelho 1","espelho 2",
  "pneu dianteiro 1","pneu dianteiro 2","traseira","traseira lado 1","traseira lado 2",
  "farol traseiro 1","farol traseiro 2","pneu traseiro 1","pneu traseiro 2",
  "porta aberta pegando a marcha e volante","kilometragem com a chave virada",
  "parabrisa","motor","chassi"
];
const fotosMoto = ["frente", "traseira", "chassi"]; // exemplo simplificado
const fotosCaminhao = ["frente", "traseira", "motor", "chassi"]; // exemplo simplificado

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

// ---------- FUNÇÕES ----------
function mostrarModal(modal) {
  Object.values(modais).forEach(m=>m.classList.remove("active"));
  modal.classList.add("active");
  modalOverlay.style.display="flex";
}

// Iniciar câmera (somente quando usuário clicar)
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});
    video.srcObject = stream;
    await video.play();
  } catch(err) {
    alert("Erro ao acessar a câmera: "+err.message);
  }
}

// Avançar para próxima foto
function avancarFoto() {
  indiceFoto++;
  if(indiceFoto >= fotosLista.length){
    alert("Vistoria finalizada!");
    // aqui no futuro: enviar para WhatsApp
    modalOverlay.style.display="flex";
    mostrarModal(modais.instrucoes); // volta para instruções por enquanto
  } else {
    tituloFoto.textContent = fotosLista[indiceFoto];
    referenciaImg.src = "placeholder.png";
    mostrarModal(modais.foto);
  }
}

// ---------- EVENTOS ----------

// Botão iniciar vistoria → pede permissão de câmera
btnFazerVistoria.addEventListener("click", ()=> {
  mostrarModal(modais.veiculo);
  startCamera(); // pede permissão só aqui
});

// Escolher veículo
veiculoBtns.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const tipo = btn.getAttribute("data-veiculo");
    fotosLista = tipo==="carro"? fotosCarro : tipo==="moto"? fotosMoto : fotosCaminhao;
    mostrarModal(modais.modo);
  });
});

// Modo "todas as fotos"
btnTodas.addEventListener("click", ()=>{
  indiceFoto = 0;
  fotosLinks = [];
  tituloFoto.textContent = fotosLista[indiceFoto];
  referenciaImg.src = "placeholder.png";
  mostrarModal(modais.foto);
});

// Modo "foto específica"
btnEspecifica.addEventListener("click", ()=>{
  listaFotosEspecificas.innerHTML = "";
  fotosLista.forEach(f=>{
    const b = document.createElement("button");
    b.textContent=f;
    b.addEventListener("click", ()=>{
      indiceFoto = fotosLista.indexOf(f);
      fotosLinks=[];
      tituloFoto.textContent=f;
      referenciaImg.src="placeholder.png";
      mostrarModal(modais.foto);
    });
    listaFotosEspecificas.appendChild(b);
  });
  mostrarModal(modais.especifica);
});

// Ir para câmera
irCameraBtn.addEventListener("click", ()=>{
  modalOverlay.style.display="none"; // fecha modal
  cameraContainer.style.display="flex"; // mostra câmera
});

// Tirar foto
tirarFotoBtn.addEventListener("click", ()=>{
  // Captura foto
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video,0,0,canvas.width,canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg");
  fotoTiradaImg.src = dataUrl;

  // Mostra modal de resultado
  modalOverlay.style.display="flex";
  mostrarModal(modais.resultado);
});

// Refazer foto
refazerBtn.addEventListener("click", ()=>{
  modalOverlay.style.display="none";
  cameraContainer.style.display="flex";
});

// Próxima foto
proximaBtn.addEventListener("click", ()=>{
  avancarFoto();
});
// Quando a página carregar, já abre o modal de instruções
window.addEventListener("DOMContentLoaded", () => {
  modalOverlay.style.display = "flex";
  mostrarModal(modais.instrucoes);
});
