const user = {
  email: 'tryber@teste.com',
  password: '123456',
  trueAgreement: false,
};

function charCount() {
  const textArea = document.querySelector('#textarea');
  const counter = document.querySelector('#counter');
  const numberChar = parseInt(counter.innerText, 10);

  textArea.addEventListener('input', () => {
    counter.innerText = numberChar - textArea.value.length;
  });
}

window.onload = () => {
  charCount();
};
