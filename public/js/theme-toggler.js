export function mountThemeToggler(parent) {
  if (!(parent instanceof HTMLElement)) {
    console.error("No se encontro elemento padre");
    return;
  }

  // Crear un boton
  const buttonTheme = document.createElement("button");
  buttonTheme.type = "button";
  buttonTheme.classList.add("button", "button--ghost", "button--xl-icon");

  // Creamos el icono
  const imgIconTheme = document.createElement("img");
  imgIconTheme.alt = "";
  imgIconTheme.src = "/images/icons/moon.svg";

  // Agregar el icono dentro del boton
  buttonTheme.appendChild(imgIconTheme);

  const updateUI = () => {
    const isDark = document.documentElement.classList.contains("dark"); // true, false

    imgIconTheme.src = `/images/icons/${isDark ? "sun" : "moon"}.svg`;

    buttonTheme.setAttribute(
      "aria-label",
      isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro",
    );
  };

  updateUI();

  buttonTheme.addEventListener("click", () => {
    const isDark = document.documentElement.classList.contains("dark"); // true, false
    const newTheme = isDark ? "light" : "dark";

    // Modificar la clase del html
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);

    // Agregar la preferencia al localStorage
    localStorage.setItem("theme", newTheme);

    updateUI();
  });

  // Preferencias del sistema operativo cuando el usuario no tiene tema establecido
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  mediaQuery.addEventListener("change", () => {
    const theme = localStorage.getItem("theme");

    if (!theme) {
      const newThemeSystem = mediaQuery.matches ? "dark" : "light";
      // Modificar la clase del html
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(newThemeSystem);

      updateUI();
    }
  });

  // Agregamos el boton de tema, como primer hijo del elemento padre
  parent.prepend(buttonTheme);
}
