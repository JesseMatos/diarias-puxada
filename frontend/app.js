const API_URL = "https://shiny-adventure-59p7jqjx64wf7rvq-3333.app.github.dev";

window.onload = () => {
  const btnLogin = document.getElementById("btnLogin");
  btnLogin.addEventListener("click", login);
};

function login() {
  const cpf = document.getElementById("cpf").value;
  const password = document.getElementById("password").value;

  fetch(API_URL + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ cpf, password })
  })
  .then(res => res.json())
  .then(data => {
    if (data.token) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      alert("CPF ou senha incorretos");
    }
  });
}
