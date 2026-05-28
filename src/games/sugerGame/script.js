// ===========================
//   FOOD DATA
// ===========================
const FOODS = [
  { id: 'strawberry_milk', name: '딸기우유',       sugarG: 20, answer: 7,  img: 'img/strawberry_milk.png' },
  { id: 'white_milk',      name: '흰우유',          sugarG: 9,  answer: 3,  img: 'img/white_milk.png' },
  { id: 'soda',            name: '탄산음료',        sugarG: 39, answer: 13, img: 'img/soda.png' },
  { id: 'water',           name: '물',              sugarG: 0,  answer: 0,  img: 'img/water.png' },
  { id: 'icecream',        name: '아이스크림(딸기)', sugarG: 18, answer: 6,  img: 'img/icecream.png' },
  { id: 'frozen_fruit',    name: '냉동과일(딸기)',   sugarG: 9,  answer: 3,  img: 'img/frozen_fruit.png' },
  { id: 'candied_potato',  name: '고구마맛탕',      sugarG: 39, answer: 13, img: 'img/candied_potato.png' },
  { id: 'steamed_potato',  name: '찐고구마',        sugarG: 16, answer: 5,  img: 'img/steamed_potato.png' },
  { id: 'canned_peach',    name: '과일통조림(복숭아)', sugarG: 80, answer: 27, img: 'img/canned_peach.png' },
  { id: 'fresh_peach',     name: '생과일(복숭아)',   sugarG: 16, answer: 3,  img: 'img/fresh_peach.png' },
  { id: 'bread',           name: '빵(보름달)',       sugarG: 31, answer: 10, img: 'img/bread.png' },
  { id: 'banana',          name: '바나나',          sugarG: 12, answer: 4,  img: 'img/banana.png' },
  { id: 'whole_bread',     name: '통밀빵',          sugarG: 5.5, answer: 2, img: 'img/whole_bread.png' },
];

const TOTAL_ROUNDS = 10;

// ===========================
//   STATE
// ===========================
let state = {
  round: 1,
  score: 0,
  sugarValue: 1,
  currentFood: null,
  roundFoods: [],   // shuffled list for this game session
  usedIndexes: [],  // indexes used so far
};

// ===========================
//   DOM REFS
// ===========================
const screens = {
  start:   document.getElementById('screen-start'),
  game:    document.getElementById('screen-game'),
  correct: document.getElementById('screen-correct'),
  wrong:   document.getElementById('screen-wrong'),
  end:     document.getElementById('screen-end'),
};

function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// ===========================
//   UTILS
// ===========================
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function updateSugarDisplay() {
  document.getElementById('sugar-count').textContent = state.sugarValue;
}

function loadFood(food) {
  state.currentFood = food;
  document.getElementById('food-name').textContent = food.name;
  document.getElementById('food-state').textContent =
    `당류 ${food.sugarG}g`;

  // image
  const imgEl = document.getElementById('quiz-card-img');
  imgEl.innerHTML = '';
  const img = document.createElement('img');
  img.src = food.img;
  img.alt = food.name;
  img.onerror = () => {
    imgEl.innerHTML = `<div class="food-placeholder" style="display:flex;align-items:center;justify-content:center;font-size:48px;">🍱</div>`;
  };
  imgEl.appendChild(img);
}

function updateRoundInfo() {
  document.getElementById('round-info').textContent =
    `라운드 ${state.round} / ${TOTAL_ROUNDS}`;
}

// ===========================
//   GAME FLOW
// ===========================
function startGame() {
  state.round = 1;
  state.score = 0;
  state.sugarValue = 1;
  state.roundFoods = shuffle(FOODS).slice(0, TOTAL_ROUNDS);

  loadCurrentRound();
  showScreen('game');
}

function loadCurrentRound() {
  const food = state.roundFoods[state.round - 1];
  state.sugarValue = 1;
  updateSugarDisplay();
  loadFood(food);
  updateRoundInfo();
}

function checkAnswer() {
  const correct = state.currentFood.answer;
  const selected = state.sugarValue;

  if (selected === correct) {
    state.score++;
    document.getElementById('correct-msg').textContent =
      `각설탕 ${correct}개가 정확해요. 다음 음식으로 이동합니다.`;
    showScreen('correct');
  } else {
    document.getElementById('wrong-msg').textContent =
      `아쉬워요! 정답은 각설탕 ${correct}개예요. (당류 ${state.currentFood.sugarG}g ÷ 3g = ${correct}개) 다시 맞춰보세요.`;
    showScreen('wrong');
  }
}

function goNextRound() {
  if (state.round >= TOTAL_ROUNDS) {
    showEndScreen();
    return;
  }
  state.round++;
  loadCurrentRound();
  showScreen('game');
}

function showEndScreen() {
  document.getElementById('final-score').textContent =
    `${state.score} / ${TOTAL_ROUNDS}`;
  document.getElementById('end-score-msg').textContent =
    `${TOTAL_ROUNDS}라운드가 끝났어요. 수고하셨습니다! 🎉`;
  showScreen('end');
}

// ===========================
//   EVENT LISTENERS
// ===========================

// 시작화면
document.getElementById('btn-start').addEventListener('click', () => {
  startGame();
});

// 게임화면: +/-
document.getElementById('btn-minus').addEventListener('click', () => {
  if (state.sugarValue > 0) {
    state.sugarValue--;
    updateSugarDisplay();
  }
});

document.getElementById('btn-plus').addEventListener('click', () => {
  state.sugarValue++;
  updateSugarDisplay();
});

// 게임화면: 정답확인
document.getElementById('btn-submit').addEventListener('click', () => {
  checkAnswer();
});

// 게임화면: 다음(힌트) - hint cycling
const hints = ['3g당 각설탕 1개', '당류를 3으로 나눠 반올림하세요!', '각설탕 1개 = 3g (설탕)'];
let hintIdx = 0;
document.getElementById('btn-next-hint').addEventListener('click', () => {
  hintIdx = (hintIdx + 1) % hints.length;
  document.getElementById('hint-text').textContent = hints[hintIdx];
});

// 정답화면: 다음음식
document.getElementById('btn-correct-next').addEventListener('click', () => {
  goNextRound();
});

// 오답화면: 다시도전하기
document.getElementById('btn-retry').addEventListener('click', () => {
  state.sugarValue = 1;
  updateSugarDisplay();
  showScreen('game');
});

// 오답화면: 다음음식
document.getElementById('btn-wrong-next').addEventListener('click', () => {
  goNextRound();
});

// 게임종료화면: 다시시작
document.getElementById('btn-restart').addEventListener('click', () => {
  startGame();
});

// 게임종료화면: 게임종료 → 시작화면
document.getElementById('btn-go-home').addEventListener('click', () => {
  showScreen('start');
});

// 모든 "게임 마치기" 버튼 → 시작화면
document.getElementById('btn-end-game').addEventListener('click', () => showScreen('start'));
document.getElementById('btn-end-correct').addEventListener('click', () => showScreen('start'));
document.getElementById('btn-end-wrong').addEventListener('click', () => showScreen('start'));