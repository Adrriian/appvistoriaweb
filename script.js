const modalFoto = document.getElementById('modal-foto');
const cameraContainer = document.getElementById('camera-container');
const modalResultado = document.getElementById('modal-resultado');

const irCameraBtn = document.getElementById('ir-camera');
const tirarFotoBtn = document.getElementById('tirar-foto');
const refazerBtn = document.getElementById('refazer');
const proximaBtn = document.getElementById('proxima');

const video = document.getElementById('video');
const fotoTiradaImg = document.getElementById('foto-tirada');

// iniciar câmera
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}});
    video.srcObject = stream;
    await video.play();
  } catch (err) {
    alert("Erro ao acessar a câmera: " + err.message);
  }
}

// Abrir câmera
irCameraBtn.addEventListener('click', () => {
  modalFoto.classList.remove('active');
  cameraContainer.classList.add('active');
  startCamera();
});

// Tirar foto
tirarFotoBtn.addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const dataUrl = canvas.toDataURL('image/jpeg');
  fotoTiradaImg.src = dataUrl;

  cameraContainer.classList.remove('active');
  modalResultado.classList.add('active');
});

// Refazer foto
refazerBtn.addEventListener('click', () => {
  modalResultado.classList.remove('active');
  cameraContainer.classList.add('active');
});

// Próxima foto
proximaBtn.addEventListener('click', () => {
  modalResultado.classList.remove('active');
  modalFoto.classList.add('active');
});
