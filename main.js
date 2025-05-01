import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";



// Config Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBAvc2H2QVHDr7vYmx0-58VOtHMbKA1flM",
  authDomain: "controle-financeiro-91e08.firebaseapp.com",
  databaseURL: "https://controle-financeiro-91e08-default-rtdb.firebaseio.com",
  projectId: "controle-financeiro-91e08",
  storageBucket: "controle-financeiro-91e08.appspot.com",
  messagingSenderId: "378316753134",
  appId: "1:378316753134:web:e27086cbfb60d7c5420bff",
  measurementId: "G-VW0LL3VP8D"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

let userPath = "";

// Espera autenticação para carregar dados do usuário logado
onAuthStateChanged(auth, (user) => {
  if (user) {
    userPath = `usuarios/${user.uid}`;
    carregarDados();
  } else {
    // Se não estiver logado, redireciona para login
    window.location.href = "index.html";
  }
});

window.setSalario = function () {
  const valor = parseFloat(document.getElementById("salario").value);
  if (!isNaN(valor)) {
    set(ref(db, userPath + "/salario"), valor);
  }
};

window.adicionarItem = function () {
  const desc = document.getElementById("descricao").value;
  const valor = parseFloat(document.getElementById("valor").value);
  const tipo = document.getElementById("tipo").value;

  if (desc && !isNaN(valor)) {
    const item = { descricao: desc, valor, tipo };
    push(ref(db, userPath + "/movimentacoes"), item);
    document.getElementById("descricao").value = "";
    document.getElementById("valor").value = "";
  }
};

function carregarDados() {
  onValue(ref(db, userPath + "/salario"), (snapshot) => {
    const salario = snapshot.val() || 0;
    document.getElementById("viewSalario").textContent = salario.toFixed(2);
    atualizarSaldo();
  });

  onValue(ref(db, userPath + "/movimentacoes"), (snapshot) => {
    const lista = document.getElementById("lista");
    lista.innerHTML = "";
    let gastos = 0, economias = 0;

    snapshot.forEach((child) => {
      const mov = child.val();
      const id = child.key;
      const li = document.createElement("li");
      li.textContent = `${mov.descricao} - R$ ${mov.valor.toFixed(2)} (${mov.tipo})`;

      // Botões editar e excluir
      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.onclick = () => editarMovimentacao(id, mov.descricao, mov.valor, mov.tipo);

      const btnExcluir = document.createElement("button");
      btnExcluir.textContent = "Excluir";
      btnExcluir.onclick = () => excluirMovimentacao(id);

      btnEditar.style.marginLeft = "10px";
      btnExcluir.style.marginLeft = "5px";
      btnEditar.style.fontSize = "12px";
      btnExcluir.style.fontSize = "12px";

      li.appendChild(btnEditar);
      li.appendChild(btnExcluir);
      lista.appendChild(li);

      if (mov.tipo === "gasto") gastos += mov.valor;
      else if (mov.tipo === "economia") economias += mov.valor;
    });

    document.getElementById("totalGastos").textContent = gastos.toFixed(2);
    document.getElementById("totalEconomias").textContent = economias.toFixed(2);
    atualizarSaldo();
  });
}

function atualizarSaldo() {
  const salario = parseFloat(document.getElementById("viewSalario").textContent) || 0;
  const gastos = parseFloat(document.getElementById("totalGastos").textContent) || 0;
  const economias = parseFloat(document.getElementById("totalEconomias").textContent) || 0;

  const saldoDisponivel = salario - gastos;
  document.getElementById("saldo").textContent = saldoDisponivel.toFixed(2);
  document.getElementById("saldoEconomias").textContent = economias.toFixed(2);
}

function editarMovimentacao(id, desc, valor, tipo) {
  document.getElementById("descricao").value = desc;
  document.getElementById("valor").value = valor;
  document.getElementById("tipo").value = tipo;

  excluirMovimentacao(id);
}

function excluirMovimentacao(id) {
  remove(ref(db, `${userPath}/movimentacoes/${id}`));
}
