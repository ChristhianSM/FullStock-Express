// Seleccionar los elementos necesarios
const inputsPassword = document.querySelectorAll(
  "input[type='password'][data-toggle-password]",
);

inputsPassword.forEach((inputPassword) => {
  inputPassword.classList.add("password-input__field");

  // Creamos el contenedor y el boton de toggle
  const containerDivInput = document.createElement("div");
  containerDivInput.classList.add("password-input");

  const buttonToggle = document.createElement("button");
  buttonToggle.type = "button";
  buttonToggle.classList.add(
    "password-input__toggle",
    "button",
    "button--ghost",
    "button--sm-icon",
  );
  buttonToggle.ariaLabel = "Mostrar Contraseña";

  const imgToggle = document.createElement("img");
  imgToggle.src = "/images/icons/eye.svg";
  imgToggle.alt = "Mostrar contraseña";

  // Introducir la imagen dentro del boton
  buttonToggle.appendChild(imgToggle);

  // Introducir el container como hermano previo del input
  inputPassword.before(containerDivInput);

  //  Envolver el input password dentro del contenedor
  containerDivInput.append(inputPassword);
  containerDivInput.append(buttonToggle);

  // Agregar un evento al boton toggle
  buttonToggle.addEventListener("click", (_event) => {
    const isPasswordType = inputPassword.type === "password";

    inputPassword.type = isPasswordType ? "text" : "password";
    imgToggle.src = `/images/icons/${isPasswordType ? "eye-off" : "eye"}.svg`;

    buttonToggle.ariaLabel = isPasswordType
      ? "Ocultar Contraseña"
      : "Mostrar contraseña";
  });
});
