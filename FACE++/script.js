const API_KEY = "93Ibi82-l3sMyyrEvFje0B-Id-jCvIAo"; // Reemplaza por tu clave real
const API_SECRET = "_qI-Jn5RZHYylaVsx_Gp36WgHvzgjRoc";
const DETECT_URL = "https://api-us.faceplusplus.com/facepp/v3/detect";
const COMPARE_URL = "https://api-us.faceplusplus.com/facepp/v3/compare";

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let registeredFaceToken = null; // Guardará el rostro registrado

// Inicia la cámara
navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
});

function captureImage() {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg');
}

async function registerFace() {
  const base64Image = captureImage().split(',')[1];

  const formData = new FormData();
  formData.append('api_key', API_KEY);
  formData.append('api_secret', API_SECRET);
  formData.append('image_base64', base64Image);

  const response = await fetch(DETECT_URL, {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  if (result.faces && result.faces.length > 0) {
    registeredFaceToken = result.faces[0].face_token;
    alert("Rostro registrado con éxito.");
  } else {
    alert("No se detectó ningún rostro.");
  }
}

async function loginFace() {
  if (!registeredFaceToken) {
    alert("Primero debes registrar un rostro.");
    return;
  }

  const base64Image = captureImage().split(',')[1];

  const formData = new FormData();
  formData.append('api_key', API_KEY);
  formData.append('api_secret', API_SECRET);
  formData.append('image_base64', base64Image);
  formData.append('face_token2', registeredFaceToken);

  const response = await fetch(COMPARE_URL, {
    method: 'POST',
    body: formData
  });

  const result = await response.json();
  if (result.confidence && result.confidence > 70) {
    alert("Inicio de sesión exitoso. Confianza: " + result.confidence.toFixed(2));
  } else {
    alert("Fallo en reconocimiento. Confianza: " + (result.confidence || 0).toFixed(2));
  }
}
async function detectFace() {
    const base64Image = captureImage().split(',')[1];
  
    const formData = new FormData();
    formData.append('api_key', API_KEY);
    formData.append('api_secret', API_SECRET);
    formData.append('image_base64', base64Image);
    formData.append('return_attributes', 'age,gender,emotion'); // Puedes agregar más
  
    const response = await fetch(DETECT_URL, {
      method: 'POST',
      body: formData
    });
  
    const result = await response.json();
    if (result.faces && result.faces.length > 0) {
      let info = '';
      result.faces.forEach((face, i) => {
        const attr = face.attributes;
        info += `Rostro ${i + 1}:\n`;
        info += `Edad: ${attr.age.value}\n`;
        info += `Género: ${attr.gender.value}\n`;
        info += `Emoción principal: ${getMainEmotion(attr.emotion)}\n\n`;
      });
      alert(info);
    } else {
      alert("No se detectó ningún rostro.");
    }
  }
  
  function getMainEmotion(emotionObj) {
    // Devuelve la emoción dominante
    let max = 0;
    let emotion = '';
    for (let key in emotionObj) {
      if (emotionObj[key] > max) {
        max = emotionObj[key];
        emotion = key;
      }
    }
    return `${emotion} (${max.toFixed(1)}%)`;
  }
  function clearToken() {
    localStorage.removeItem("face_token");
    alert("Rostro registrado eliminado.");
  }