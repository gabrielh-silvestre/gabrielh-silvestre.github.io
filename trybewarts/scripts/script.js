const user = {
  email: 'tryber@teste.com',
  password: '123456',
  trueAgreement: false,
};

const autentication = () => {
  const userEmail = document.querySelector('#email').value;
  const userPassword = document.querySelector('#password').value;

  return userEmail === user.email && userPassword === user.password;
}

const login = () => {
  autentication() ? alert('Bem Vindo Tryber!') : alert('Credenciais Incorretas')
}

const charCount = () => {
  const textArea = document.querySelector('#textarea');
  const counter = document.querySelector('#counter');
  const numberChar = parseInt(counter.innerText, 10);

  textArea.addEventListener('input', () => {
    counter.innerText = numberChar - textArea.value.length;
  });
}

window.onload = () => {
  document.querySelector('#btn-login').addEventListener('click', login);
  charCount();
};
