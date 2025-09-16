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

// ---------- Lista de fotos ----------
const fotosCarro = [
  "frente","frente lado 1","frente lado 2","farol 1","farol 2","espelho 1","espelho 2",
  "pneu dianteiro 1","pneu dianteiro 2","traseira","traseira lado 1","traseira lado 2",
  "farol traseiro 1","farol traseiro 2","pneu traseiro 1","pneu traseiro 2",
  "porta aberta pegando a marcha e volante","kilometragem com a chave virada",
  "parabrisa","motor","chassi"
];
const fotosMoto = [/* definir */];
const fotosCaminhao = [/* definir */];

let fotosLista = [];
let fotosLinks = [];
let indiceFoto = 0;

// ---------- Elementos ----------
const modalOverlay = document.getElementById("modal-overlay");
const modais = {
  instrucoes: document.getElementById("modal-instrucoes"),
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

// ---------- Funções ----------
function mostrarModal(modal) {
  Object.values(modais).forEach(m=>m.classList.remove("active"));
  modal.classList.add("active");
}

// iniciar câmera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});
    video.srcObject = stream;
    await video.play();
  } catch(err) {
    alert("Erro ao acessar a câmera: "+err.message);
  }
}

// avançar foto
function avancarFoto() {
  indiceFoto++;
  if(indiceFoto>=fotosLista.length){
    enviarWhatsApp();
  } else {
    tituloFoto.textContent = fotosLista[indiceFoto];
    referenciaImg.src="placeholder.png";
    mostrarModal(modais.foto);
  }
}

// upload ImgBB
async function uploadImgBB(blob, fileName){
  const form = new FormData();
  form.append("key", API_KEY);
  form.append("image", blob, fileName);
  try{
    const res = await fetch("https://api.imgbb.com/1/upload",{method:"POST",body:form});
    const data = await res.json();
    if(data.success) fotosLinks.push(data.data.url);
    else alert("Erro upload: "+data.error.message);
  } catch(err){
    alert("Erro ao enviar imagem: "+err.message);
  }
}

// enviar WhatsApp
function enviarWhatsApp(){
  let msg = "Vistoria finalizada! Links das fotos:\n\n"+fotosLinks.map((l,i)=>`Foto ${i+1}: ${l}`).join("\n");
  const link = `https://wa.me/${NUM_WHATSAPP}?text=${encodeURIComponent(msg)}`;
  window.location.href = link;
}

// ---------- Eventos ----------
// iniciar vistoria
btnFazerVistoria.addEventListener("click", ()=> mostrarModal(modais.veiculo));

// escolher veículo
veiculoBtns.forEach(btn=>{
  btn.addEventListener("click", ()=>{
    const tipo = btn.getAttribute("data-veiculo");
    fotosLista = tipo==="carro"? fotosCarro : tipo==="moto"? fotosMoto : fotosCaminhao;
    mostrarModal(modais.modo);
  });
});

// modo todas
btnTodas.addEventListener("click", ()=>{
  indiceFoto=0; fotosLinks=[];
  tituloFoto.textContent = fotosLista[indiceFoto];
  referenciaImg.src="placeholder.png";
  mostrarModal(modais.foto);
});

// modo específica
btnEspecifica.addEventListener("click", ()=>{
  listaFotosEspecificas.innerHTML="";
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

// ir para câmera
irCameraBtn.addEventListener("click", ()=>{
  modalOverlay.style.display="none"; // esconde overlay
  cameraContainer.style.display="flex"; // mostra câmera
  startCamera();
});

// tirar foto
tirarFotoBtn.addEventListener("click", async ()=>{
  const canvas=document.createElement("canvas");
  canvas.width=video.videoWidth;
  canvas.height=video.videoHeight;
  canvas.getContext("2d").drawImage(video,0,0,canvas.width,canvas.height);
  const dataUrl = canvas.toDataURL("image/jpeg");
  fotoTiradaImg.src=dataUrl;

  const blob = await (await fetch(dataUrl)).blob();
  await uploadImgBB(blob,fotosLista[indiceFoto]+".jpg");

  modalOverlay.style.display="flex"; // volta overlay
  mostrarModal(modais.resultado);
});

// refazer
refazerBtn.addEventListener("click", ()=>{
  modalOverlay.style.display="none";
  cameraContainer.style.display="flex";
});

// próxima
proximaBtn.addEventListener("click", ()=>{
  avancarFoto();
});
