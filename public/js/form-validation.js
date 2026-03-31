import { z } from "zod";

function showError(container, message) {
  container.classList.add("input-field--error");
  const span = document.createElement("span");
  span.className = "input-field__error";
  span.textContent = message;
  container.appendChild(span);
}

function clearError(container) {
  container.classList.remove("input-field--error");
  const span = container.querySelector(".input-field__error");
  if (span) span.remove();
}

export function setupValidation(form, schema) {
  if (!form) {
    console.error("Formulario no encontrado");
    return;
  }

  // Agregamos al formulario el atributo novalidate
  form.setAttribute("novalidate", "");

  const touchedFields = new Set();

  // Agregar los eventos a ejecutar
  form.addEventListener("focusout", (e) => {
    const fieldName = e.target.name;
    if (!fieldName) return;

    touchedFields.add(fieldName);

    validate();
  });

  form.addEventListener("input", (e) => {
    const fieldName = e.target.name;
    if (!fieldName) return;

    if (touchedFields.has(fieldName)) {
      validate();
    }
  });

  form.addEventListener("submit", (e) => {
    const formData = new FormData(form);
    for (const key of formData.keys()) {
      touchedFields.add(key);
    }

    const result = validate();
    if (!result.success) {
      e.preventDefault();
    }
  });

  function validate() {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const result = schema.safeParse(data);

    // Limpiar todos los campos tocados
    const allInputs = form.querySelectorAll("input, select, textarea");
    allInputs.forEach((input) => {
      const fieldName = input.name;
      if (touchedFields.has(fieldName)) {
        const containerInput = input.closest(".input-field, .select-field");
        if (containerInput) clearError(containerInput);
      }
    });

    // Mostrar los errores pero solo de los campos tocados
    if (!result.success) {
      const fieldErrors = z.flattenError(result.error).fieldErrors;
      console.log(fieldErrors);

      Object.entries(fieldErrors).forEach(([fieldName, messages]) => {
        if (touchedFields.has(fieldName)) {
          const input = form.querySelector(`[name="${fieldName}"]`);
          if (input) {
            const containerInput = input.closest(".input-field, .select-field");
            if (containerInput) showError(containerInput, messages[0]);
          }
        }
      });
    }

    return result;
  }
}
