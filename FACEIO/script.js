// Reemplaza esto con tu Public API Key real
const faceio = new faceIO("fioa3cb3Y");

function faceRegister() {
  faceio.enroll({
    locale: "auto", // Idioma automático
    payload: {
      // Puedes guardar información adicional del usuario
      email: "ejemplo@email.com",
      nombre: "Juan Pérez"
    }
  }).then(userInfo => {
    console.log("Usuario registrado:", userInfo);
    alert("¡Registro exitoso! Bienvenido " + userInfo.details.nombre);
  }).catch(errCode => {
    handleError(errCode);
  });
}

function faceLogin() {
  faceio.authenticate({
    locale: "auto"
  }).then(userData => {
    console.log("Usuario autenticado:", userData);
    alert("¡Bienvenido de nuevo " + userData.details.nombre + "!");
  }).catch(errCode => {
    handleError(errCode);
  });
}

function handleError(errCode) {
  // Puedes personalizar los errores aquí
  console.error("Error:", errCode);
  alert("Error con FACEIO: " + errCode);
}
