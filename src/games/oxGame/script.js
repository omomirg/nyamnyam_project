// ========== 문제 데이터 ==========
const questions = [
  // O 문장
  { sentence: "물은 충분히 마셔야 건강하다.", answer: "O", correction: "맞아요! 물은 충분히 마셔야 건강해요." },
  { sentence: "간식을 먹을 때 목이 마르면 물과 함께 먹는다.", answer: "O", correction: "맞아요! 간식을 먹을 때 목이 마르면 물과 함께 먹어요." },
  { sentence: "우유에는 칼슘과 단백질이 많아 몸을 튼튼하게 해준다.", answer: "O", correction: "맞아요! 우유에는 칼슘과 단백질이 많아 몸을 튼튼하게 해줘요." },
  { sentence: "물은 우리 몸에 꼭 필요하다.", answer: "O", correction: "맞아요! 물은 우리 몸에 꼭 필요해요." },
  { sentence: "당류가 많은 음료를 과하게 섭취하면 충치가 생길 수 있다.", answer: "O", correction: "맞아요! 당류가 많은 음료를 과하게 마시면 충치가 생길 수 있어요." },
  { sentence: "골고루 먹으면 키가 커진다.", answer: "O", correction: "맞아요! 골고루 먹으면 키가 커지고 건강해져요." },
  { sentence: "간식을 먹을 때는 가공식품보다 자연식을 먹는다.", answer: "O", correction: "맞아요! 간식은 가공식품보다 자연식(옥수수, 감자 등)이 더 건강해요." },
  { sentence: "식품 표시에는 소비기한, 내용량, 제품명 등이 있다.", answer: "O", correction: "맞아요! 식품 표시에는 소비기한, 내용량, 제품명 등이 있어요." },
  { sentence: "아침 식사를 하면 수업 중에 집중이 잘 된다.", answer: "O", correction: "맞아요! 아침 식사를 하면 수업 중에 집중이 더 잘 돼요." },
  { sentence: "천천히 꼭꼭 씹어 먹으면 이와 잇몸이 발달한다.", answer: "O", correction: "맞아요! 천천히 꼭꼭 씹어 먹으면 이와 잇몸이 튼튼하게 발달해요." },
  // X 문장
  { sentence: "먹고 싶은 음식만 잘 먹으면 건강하다.", answer: "X", correction: "먹고 싶은 음식만 먹으면 몸이 건강하지 않아요. 다양한 음식을 골고루 먹어야 해요." },
  { sentence: "채소는 안 먹고 고기만 먹어도 건강하다.", answer: "X", correction: "음식은 골고루 섭취해야 건강을 유지할 수 있어요." },
  { sentence: "골고루 먹으면 많이 먹어도 된다.", answer: "X", correction: "골고루 적당히 먹어야 해요." },
  { sentence: "간식을 먹을 땐 많이 단 초콜릿을 먹는다.", answer: "X", correction: "간식은 가공식품보다 자연식(옥수수, 감자 등)을 섭취해요." },
  { sentence: "흰 우유와 딸기 우유 중에서 딸기 우유가 더 건강하다.", answer: "X", correction: "딸기 우유는 흰 우유보다 당류가 많아서 건강하지 않아요." },
  { sentence: "목이 마르면 탄산 음료를 마신다.", answer: "X", correction: "목마름이 해소되는 기분이지만, 시간이 지나면 오히려 더 갈증이 나요. 물이나 흰 우유를 마셔요." },
  { sentence: "하루에 우유 두 컵을 마시기 싫다면 마시지 않아도 된다.", answer: "X", correction: "우유 대체품(떠먹는 요구르트 1컵, 마시는 요구르트 1병반, 치즈 2장)을 섭취해요." },
  { sentence: "식품은 5가지로 구분할 수 있다.", answer: "X", correction: "식품은 6가지로 구분할 수 있어요." },
  { sentence: "채소류 식품은 단백질이 풍부해서 피와 살을 만들어준다.", answer: "X", correction: "단백질이 풍부한 식품은 고기, 생선, 달걀, 콩류이고, 채소류는 비타민과 무기질이 풍부해요." },
  { sentence: "우유, 유제품류에는 콩기름, 식빵이 있다.", answer: "X", correction: "우유·유제품류에는 우유, 치즈, 요구르트가 있어요." },
];

// ========== 상태 ==========
let shuffledQuestions = [];
let currentIndex = 0;
let score = 0;

// ========== 화면 전환 ==========
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  target.classList.add('active');
}

// ========== 게임 초기화 ==========
function initGame() {
  // 문제 셔플 (O/X 각각 섞어 10개 선택: O 5개 + X 5개 또는 전체 랜덤 10개)
  const oList = questions.filter(q => q.answer === 'O');
  const xList = questions.filter(q => q.answer === 'X');
  shuffleArray(oList);
  shuffleArray(xList);
  shuffledQuestions = [...oList.slice(0, 5), ...xList.slice(0, 5)];
  shuffleArray(shuffledQuestions);
  currentIndex = 0;
  score = 0;
  loadQuestion();
  showScreen('screen-game');
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ========== 문제 로드 ==========
function loadQuestion() {
  const q = shuffledQuestions[currentIndex];
  document.getElementById('sentence-text').textContent = q.sentence;
  document.getElementById('progress-text').textContent = `문장 ${currentIndex + 1} / 10`;
}

// ========== 답변 처리 ==========
function handleAnswer(userAnswer) {
  const q = shuffledQuestions[currentIndex];
  if (userAnswer === q.answer) {
    score++;
    // 정답화면: X 문장이면 올바른 내용도 함께 표시
    const feedbackEl = document.getElementById('correct-feedback');
    if (q.answer === 'X' && q.correction) {
      feedbackEl.innerHTML = `
        <div class="correct-only-row">
          <span class="correct-label">✓ 올바른 내용</span>
          <span class="correct-sentence-val">${q.correction}</span>
        </div>
      `;
      feedbackEl.style.display = 'flex';
    } else {
      feedbackEl.innerHTML = `
        <div class="correct-only-row plain">
          <span class="correct-sentence-val">맞았어요! 다음 문장으로 넘어가요.</span>
        </div>
      `;
      feedbackEl.style.display = 'flex';
    }
    showScreen('screen-correct');
  } else {
    // 오답 화면: 틀린 문장 + 올바른 문장 표시
    const expEl = document.getElementById('wrong-explanation');
    const correctionText = q.correction || '';
    expEl.innerHTML = `
      <div class="wrong-sentence-row">
        <span class="wrong-label">✗ 틀린 문장</span>
        <span class="wrong-sentence-val">${q.sentence}</span>
      </div>
      ${correctionText ? `
      <div class="correct-sentence-row">
        <span class="correct-label">✓ 올바른 내용</span>
        <span class="correct-sentence-val">${correctionText}</span>
      </div>` : ''}
    `;
    expEl.style.display = 'flex';
    showScreen('screen-wrong');
  }
}

// ========== 다음 문제 ==========
function nextQuestion() {
  currentIndex++;
  if (currentIndex >= 10) {
    showEndScreen();
  } else {
    loadQuestion();
    showScreen('screen-game');
  }
}

// ========== 종료화면 ==========
function showEndScreen() {
  let title, desc, tags;

  if (score === 10) {
    title = '훌륭해요! 100점이에요';
    desc = '10문장 다 맞혔어요. 영양에 대해 잘 알고 있네요!';
    tags = ['100점', '최우수'];
  } else if (score >= 8) {
    title = '대단해요!';
    desc = '영양에 대해 잘 알고 있어요.';
    tags = [`${score * 10}점`, '우수'];
  } else if (score >= 5) {
    title = '조금 아쉬워요';
    desc = '영양에 대해 조금 더 공부해요.';
    tags = [`${score * 10}점`, '보통'];
  } else {
    title = '아쉬워요';
    desc = '영양에 대한 공부가 필요해요.';
    tags = [`${score * 10}점`, '분발'];
  }

  document.getElementById('end-title').textContent = title;
  document.getElementById('end-desc').textContent = desc;

  const tagsEl = document.getElementById('end-tags');
  tagsEl.innerHTML = tags.map(t => `<span class="tag">${t}</span>`).join('');

  showScreen('screen-end');
}

// ========== 이벤트 바인딩 ==========
document.getElementById('btn-start').addEventListener('click', initGame);

document.getElementById('btn-o').addEventListener('click', () => handleAnswer('O'));
document.getElementById('btn-x').addEventListener('click', () => handleAnswer('X'));

document.getElementById('btn-next-correct').addEventListener('click', nextQuestion);
document.getElementById('btn-next-wrong').addEventListener('click', nextQuestion);

document.getElementById('btn-end-game').addEventListener('click', () => showScreen('screen-start'));
document.getElementById('btn-restart').addEventListener('click', initGame);
document.getElementById('btn-end-final').addEventListener('click', () => showScreen('screen-start'));