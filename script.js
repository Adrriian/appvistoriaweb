// ---------- Configuração consultores ----------
const consultores = {
  joao: { key: "API_KEY_JOAO", whatsapp: "5511999999999" },
  maria: { key: "API_KEY_MARIA", whatsapp: "5511888888888" },
  pedro: { key: "API_KEY_PEDRO", whatsapp: "5511777777777" },
  ana: { key: "API_KEY_ANA", whatsapp: "5511666666666" }
};

const urlParams = new URLSearchParams(window.location.search);
const consultorParam = urlParams.get("consultor") || "joao";
const API_KEY = consultores[consultorParam].key;
const NUM_WHATSAPP = consultores[consultorParam].whatsapp;

// ---------- Lista de fotos por veículo ----------
const fotosCarro = [
  "frente","frente lado 1","frente lado 2","farol 1","farol 2","espelho 1","espelho 2",
  "pneu dianteiro 1","pneu dianteiro 2","traseira","traseira lado 1","traseira lado 2",
  "farol traseiro 1","farol traseiro 2","pneu traseiro 1","pneu traseiro 2",
  "porta aberta pegando a marcha e volante","kilometragem com a chave virada",
  "parabrisa","motor","chassi"
];

const fotosMoto = [/* similar, ajusta conforme necessidade */];
const fotosCaminhao = [/* similar, ajusta conforme necessidade */];

let fotosLista = [];
let fotosLinks = [];
let indiceFoto = 0;

// ---------- Elementos ----------
const modalInstrucoes = document.getElementById("modal-instrucoes");
const btnFazerVistoria = document.getElementById("btn-fazer-vistoria");

const modalVeiculo = document.getElementById("modal-veiculo");
const veiculoBtns = modalVeiculo.querySelectorAll("button");

const modalModoFotos = document.getElementById("modal-modo-fotos");
const btnTodas = document.getElementById("btn-todas");
const btnEspecifica = document.getElementById("btn-especifica");

const modalFotosEspecificas = document.getElementById("modal-fotos-especificas");
const listaFotosEspecificas = document.getElementById("lista-fotos-especificas");

const modalFoto = document.getElementById("modal-foto");
const tituloFoto = document.getElementById("titulo-foto");
const referenciaImg = document.getElementById("referencia-img");
const irCameraBtn = document.getElementById("ir-camera");

const cameraContainer = document.getElementById("camera-container");
const video = document.getElementById("video");
const tirarFotoBtn = document.getElementById("tirar-foto");

const modalResultado = document.getElementById("modal-resultado");
const fotoTiradaImg = document.getElementById("foto-tirada");
const refazerBtn = document.getElementById("refazer");
const proximaBtn = document.getElementById("proxima");

// ---------- Funções ----------
function mostrarModal(modal) {
  document.querySelectorAll(".modal").forEach(m => m.classList.remove("active"));
  modal.classList.add("active");
}

// Iniciar câmera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}});
    video.srcObject = stream;
    await video.play();
  } catch(err) {
    alert("Erro ao acessar a câmera: "+err.message);
  }
}

// Avançar foto
function avancarFoto() {
  indiceFoto++;
  if(indiceFoto >= fotosLista.length) {
    // Última foto -> enviar WhatsApp
    enviarWhatsApp();
  } else {
    mostrarModal(modalFoto);
    tituloFoto.textContent = fotosLista[indiceFoto];
    referenciaImg.src = "placeholder.png";
  }
}

// Upload para ImgBB
async function uploadImgBB(blob, fileName){
  const form = new FormData();
  form.append("key", API_KEY);
  form.append("image", blob, fileName);
  try {
    const res = await fetch("https://api.imgbb.com/1/upload", {method:"POST", body: form});
    const data = await res.json();
    if(data.success){
      fotosLinks.push(data.data.url);
    } else {
      alert("Erro no upload: "+data.error.message);
    }
  } catch(err){
    alert("Erro ao enviar imagem: "+err.message);
  }
}

// Enviar WhatsApp
function enviarWhatsApp() {
  let msg = "Vistoria finalizada! Links das fotos:\n\n" + fotosLinks.map((l,i)=>`Foto ${i+1}: ${l}`).join("\n");
  const link = `https://wa.me/${NUM_WHATSAPP}?text=${encodeURIComponent(msg)}`;
  window.location.href = link;
}

// ---------- Eventos ----------
// Botão iniciar vistoria
btnFazerVistoria.addEventListener("click", ()=> mostrarModal(modalVeiculo));

// Escolher veículo
veiculoBtns.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const tipo = btn.getAttribute("data-veiculo");
    if(tipo === "carro") fotosLista = fotosCarro;
    else if(tipo==="moto") fotosLista = fotosMoto;
    else fotosLista = fotosCaminhao;
    mostrarModal(modalModoFotos);
  });
});

// Modo tirar todas as fotos
btnTodas.addEventListener("click", ()=>{
  indiceFoto=0; fotosLinks=[];
  tituloFoto.textContent = fotosLista[indiceFoto];
  referenciaImg.src="placeholder.png";
  mostrarModal(modalFoto);
});

// Modo tirar fotos específicas
btnEspecifica.addEventListener("click", ()=>{
  listaFotosEspecificas.innerHTML = "";
  fotosLista.forEach(f=>{
    const b = document.createElement("button");
    b.textContent = f;
    b.addEventListener("click", ()=>{
      indiceFoto = fotosLista.indexOf(f);
      fotosLinks=[]; // opcional, se for nova sessão
      tituloFoto.textContent = f;
      referenciaImg.src="placeholder.png";
      mostrarModal(modalFoto);
    });
    listaFotosEspecificas.appendChild(b);
  });
  mostrarModal(modalFotosEspecificas);
});

// Ir para câmera
irCameraBtn.addEventListener("click", ()=>{
  mostrarModal(cameraContainer);
  startCamera();
});

// Tirar foto
tirarFotoBtn.addEventListener("click", async ()=>{
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video,0,0,canvas.width,canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg");
  fotoTiradaImg.src = dataUrl;

  // Converter para blob e enviar ao ImgBB
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  await uploadImgBB(blob, fotosLista[indiceFoto]+".jpg");

  mostrarModal(modalResultado);
});

// Refazer
refazerBtn.addEventListener("click", ()=>{
  mostrarModal(cameraContainer);
});

// Próxima foto
proximaBtn.addEventListener("click", ()=>{
  avancarFoto();
});
