  document.addEventListener("DOMContentLoaded", () => {
    const inputs = document.querySelectorAll(".guessRow input");
    if (inputs.length > 0) {
    inputs[0].focus();
   }
    inputs.forEach((input, index) => {
      input.addEventListener("input", () => {
        if (input.value.length === 1 && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && input.value === "" && index > 0) {
          inputs[index - 1].focus();
        }
      });
    });
  });
