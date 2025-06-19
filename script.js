const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
let cards;
let interval;
let firstCard = false;
let secondCard = false;

const items = [
  { name: "Serj", image: "serj.jpg" },
  { name: "Joey", image: "jj.jpg" },
  { name: "Chester", image: "chester.jpg" },
  { name: "Eddie", image: "eddie.jpg" },
  { name: "Jonathan", image: "jonathan.jpg" },
  { name: "Layne", image: "layne.jpg" },
  { name: "Corey", image: "corey.jpg" },
  { name: "James", image: "james.jpg" },
  { name: "Kirk", image: "kirk.jpg" },
  { name: "Kurt", image: "kurt.jpg" },
  { name: "Max", image: "max.jpg" },
  { name: "Simone", image: "simone.jpg" },
];

// tempo inicial
let seconds = 0,
  minutes = 0;
// contador de movimentos e vitórias
let movesCount = 0,
  winCount = 0;

// para o timer
const timeGenerator = () => {
  seconds += 1;
// lógica dos minutos
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
// formatação do tempo
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

// calculando movimentos
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

// escolhendo objetos aleatórios do array
const generateRandom = (size = 4) => {
  // array temporário
  let tempArray = [...items];
  // inicializa o array cardValues
  let cardValues = [];
  // o tamanho deve ser dobrado (matriz 4x4)/2 já que existem pares de objetos
  size = (size * size) / 2;
  // seleção de objetos aleatórios
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    // uma vez selecionado, remove o objeto do array temporário
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  // embaralhamento simples
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    /*
         Criar Cartas
        before => lado frontal (contém ponto de interrogação)
        after => lado traseiro (contém imagem);
        data-card-values é um atributo personalizado que armazena os nomes das cartas para comparar depois
      */
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  // grid
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  // cards
  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // se a carta selecionada ainda não foi combinada, execute (ou seja, cartas já combinadas quando clicadas serão ignoradas)
      if (!card.classList.contains("matched")) {
        // virar a carta clicada
        card.classList.add("flipped");
        // se for a primeira carta (!firstCard já que firstCard é inicialmente falso)
        if (!firstCard) {
          // então a carta atual se tornará firstCard
          firstCard = card;
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          // incrementar movimentos já que o usuário selecionou a segunda carta
          movesCounter();
          // secondCard  e value
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            // se ambas as cartas combinam, adicionar classe matched para que essas cartas sejam ignoradas na próxima vez
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            // definir firstCard como falso já que a próxima carta será a primeira agora
            firstCard = false;
            // incrementar winCount já que o usuário encontrou uma combinação correta
            winCount += 1;
            // verificar se winCount == metade de cardValues
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>Você Venceu!!</h2>
            <h4>Moves: ${movesCount}</h4>`;
              stopGame();
            }
          } else {
            // se as cartas não combinam,virar as cartas de volta ao normal
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

// start
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  // visibilidade de controles e botões
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  // iniciar timer
  interval = setInterval(timeGenerator, 1000);

  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

// parar jogo
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

// inicializar valores e chamadas de função
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  console.log(cardValues);
  matrixGenerator(cardValues);
};