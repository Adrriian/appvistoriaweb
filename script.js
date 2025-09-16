(async function(){
  const API_KEY = "5c298eb2a1382aeb9277e4da5696b77d";
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const captureBtn = document.getElementById('capture');
  const finishBtn = document.getElementById('finish');
  const fotosLinks = [];
  let stream;
  let fotoCount = 0;
  const timestampVistoria = new Date().toISOString().replace(/[:.-]/g,"");

  function nowDatetime(){
    const d = new Date();
    const pad = n=>String(n).padStart(2,'0');
    return `${pad(d.getDate())}/${pad(d.getMonth()+1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  async function startCamera(){
    try{
      stream = await navigator.mediaDevices.getUserMedia({video: {facingMode: 'environment'}, audio: false});
      video.srcObject = stream;
      await video.play();
    }catch(err){
      alert('Erro ao acessar a câmera: '+err.message);
    }
  }

  async function uploadImgBB(blob, fileName){
    const form = new FormData();
    form.append("key", API_KEY);
    form.append("image", blob, fileName);
    try{
      const res = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: form
      });
      const data = await res.json();
      if(data.success){
        fotosLinks.push(data.data.url);
        alert(`Foto ${fileName} enviada com sucesso!`);
      } else {
        alert(`Erro no upload: ${data.error.message}`);
      }
    } catch(err){
      alert('Erro ao enviar imagem: ' + err.message);
    }
  }

  captureBtn.addEventListener('click', async ()=>{
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    canvas.width = vw;
    canvas.height = vh;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video,0,0,vw,vh);
    ctx.font = `32px sans-serif`;
    ctx.fillStyle = "black";
    ctx.textBaseline = 'bottom';
    ctx.fillText(nowDatetime(), 20, vh - 20);

    canvas.toBlob(async function(blob){
      fotoCount++;
      const fileName = `vistoria_${timestampVistoria}_foto${fotoCount}.jpg`;
      await uploadImgBB(blob, fileName);
    }, 'image/jpeg', 0.9);
  });

  finishBtn.addEventListener('click', ()=>{
    if(fotosLinks.length === 0){
      alert("Nenhuma foto enviada ainda!");
      return;
    }
    let msg = "Vistoria finalizada! Links das fotos:\n\n";
    fotosLinks.forEach((l,i)=> msg += `Foto ${i+1}: ${l}\n`);
    alert(msg);
  });

  startCamera();
})();
