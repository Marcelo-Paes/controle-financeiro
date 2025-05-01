import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAvc2H2QVHDr7vYmx0-58VOtHMbKA1flM",
  authDomain: "controle-financeiro-91e08.firebaseapp.com",
  projectId: "controle-financeiro-91e08",
  storageBucket: "controle-financeiro-91e08.appspot.com",
  messagingSenderId: "378316753134",
  appId: "1:378316753134:web:e27086cbfb60d7c5420bff",
  measurementId: "G-VW0LL3VP8D"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.login = function () {
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;

  if (!email || !senha) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  signInWithEmailAndPassword(auth, email, senha)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log("Usuário logado com sucesso!", user);
    window.location.href = "home.html";  // Redireciona para a página inicial após login
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error(`Erro ao logar: ${errorCode}, ${errorMessage}`);
    alert("Erro ao fazer login, verifique suas credenciais.");
  });
};

window.cadastrar = function () {
  const email = document.getElementById("emailCadastro").value;
  const senha = document.getElementById("senhaCadastro").value;

  if (!email || !senha) {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  createUserWithEmailAndPassword(auth, email, senha)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("Usuário cadastrado com sucesso:", user);
      alert("Cadastro realizado com sucesso!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(`Erro ao cadastrar: ${errorCode}, ${errorMessage}`);
      alert("Erro ao cadastrar, tente novamente.");
    });
};
