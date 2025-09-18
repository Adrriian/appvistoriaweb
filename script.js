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
  { nome: "Frente", ref: "placeholder.png" },
  { nome: "Traseira", ref: "placeholder.png" },
  { nome: "Chassi", ref: "placeholder.png" }
];

const fotosCaminhao = [
  { nome: "Frente", ref: "placeholder.png" },
  { nome: "Traseira", ref: "placeholder.png" },
  { nome: "Motor", ref: "placeholder.png" },
  { nome: "Chassi", ref: "placeholder.png" }
];
const MENSAGEM_WHATS = encodeURIComponent(
  "Olá, acabei de realizar uma vistoria! Confira as fotos no link abaixo:\nhttps://appvistoriaweb.netlify.app/fotossite"
);

// ---------- VARIÁVEIS ----------
let fotosLista = [];
let fotosLinks = [];
let indiceFoto = 0;

// ---------- CONFIGURAÇÃO ----------
const IMGBB_API = "https://api.imgbb.com/1/upload";
const IMGBB_KEY = "5c298eb2a1382aeb9277e4da5696b77d"; // sua API Key
const WHATSAPP = "47984910058"; // seu WhatsApp

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

// Mostrar modal
function mostrarModal(modal) {
  Object.values(modais).forEach(m => m.classList.remove("active"));
  modal.classList.add("active");
  modalOverlay.style.display = "flex";
}

// Iniciar câmera
async function startCamera() {
  try {
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
    }
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    video.srcObject = stream;
    await video.play();
  } catch (err) {
    alert("Erro ao acessar a câmera: " + err.message);
  }
}

// Mostrar foto atual
function mostrarFotoAtual() {
  const fotoAtual = fotosLista[indiceFoto];
  tituloFoto.textContent = fotoAtual.nome;
  referenciaImg.src = fotoAtual.ref || "placeholder.png";
  mostrarModal(modais.foto);
}

// Avançar foto
function avancarFoto() {
  indiceFoto++;
  if (indiceFoto >= fotosLista.length) {
    mostrarLoading(); // 👉 chama carregamento no final
  } else {
    mostrarFotoAtual();
  }
}

// ---------- UPLOAD IMG BB ----------
async function enviarParaImgBB(dataUrl) {
  const formData = new FormData();
  formData.append("image", dataUrl.split(",")[1]);
  formData.append("key", IMGBB_KEY);

  try {
    const response = await fetch(IMGBB_API, { method: "POST", body: formData });
    const resultado = await response.json();
    return resultado.data.url;
  } catch (err) {
    console.error("Erro ao enviar para ImgBB:", err);
    return null;
  }
}

// Mostrar modal de carregamento
const modalLoading = document.getElementById("modal-loading");

function mostrarLoading() {
  modalOverlay.style.display = "flex";
  modalLoading.style.display = "flex";
  enviarVistoria(); // inicia upload automático
}

// Enviar todas as fotos
async function enviarVistoria() {
  const urls = [];

  for (let i = 0; i < fotosLinks.length; i++) {
    if (fotosLinks[i]) {
      const url = await enviarParaImgBB(fotosLinks[i]);
      if (url) urls.push(url);
    }
  }

  console.log("Fotos enviadas:", urls);

  // Termina o carregamento
  modalLoading.style.display = "none";

  // Mostra botão "Falar com consultor"
  const modalResultado = modais.resultado;
  mostrarModal(modalResultado);

  modalResultado.innerHTML = `
  <div class="result"
  <h2>Vistoria concluída!</h2>
  <p>Todas as fotos foram enviadas com sucesso.</p>
  <a class='button' href="https://wa.me/${WHATSAPP}?text=${MENSAGEM_WHATS}"
     target="_blank"
     class="btn-consultor">
     Falar com consultor
  </a>
  </div>`;
}

// ---------- EVENTOS ----------

// Iniciar vistoria
btnFazerVistoria.addEventListener("click", () => {
  mostrarModal(modais.veiculo);
  startCamera();
  localStorage.setItem("vistoriaAcessada", "true");
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

// Todas as fotos
btnTodas.addEventListener("click", () => {
  indiceFoto = 0;
  fotosLinks = [];
  mostrarFotoAtual();
});

// Foto específica
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
  modalOverlay.style.display = "none";
  cameraContainer.style.display = "flex";
});

// Tirar foto
tirarFotoBtn.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg");

  fotoTiradaImg.src = dataUrl;
  fotosLinks[indiceFoto] = dataUrl;

  const fotoAtual = fotosLista[indiceFoto];
  fotoReferenciaResultado.src = fotoAtual.ref || "placeholder.png";

  proximaBtn.textContent = indiceFoto === fotosLista.length - 1 ? "Finalizar Vistoria" : "Próxima Foto";

  modalOverlay.style.display = "flex";
  mostrarModal(modais.resultado);
});

// Refazer foto
refazerBtn.addEventListener("click", () => {
  fotosLinks[indiceFoto] = null;
  modalOverlay.style.display = "none";
  cameraContainer.style.display = "flex";
});

// Botão próxima / finalizar
proximaBtn.addEventListener("click", () => {
  if (indiceFoto === fotosLista.length - 1) {
    mostrarLoading();
  } else {
    avancarFoto();
  }
});

// Ao carregar a página
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("vistoriaAcessada")) {
    startCamera();
    mostrarModal(modais.instrucoes);
  } else {
    modalOverlay.style.display = "flex";
    mostrarModal(modais.instrucoes);
  }
});
