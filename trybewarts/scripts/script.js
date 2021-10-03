const user = {
  email: 'tryber@teste.com',
  password: '123456',
};

const autentication = () => {
  const userEmail = document.querySelector('#email').value;
  const userPassword = document.querySelector('#password').value;

  return userEmail === user.email && userPassword === user.password;
}

const login = () => {
  autentication() ? alert('Bem Vindo Tryber!') : alert('Credenciais Incorretas')
}

const changeAgree = () => {
  const submitButton = document.querySelector('#submit-btn');

  submitButton.disabled ? submitButton.disabled = false : submitButton.disabled = true;
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
  document.querySelector('#agreement').addEventListener('click', changeAgree);
  charCount();
};
