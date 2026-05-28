// ======================
// 카드 데이터
// ======================

const cardData = [
  {
    processed: "감자튀김",
    healthy: "감자",
    desc: "튀긴 음식 대신 건강한 감자"
  },
  {
    processed: "초코우유",
    healthy: "흰우유",
    desc: "당분이 적은 건강한 우유"
  },
  {
    processed: "튀긴만두",
    healthy: "찐만두",
    desc: "기름 없이 조리된 음식"
  },
  {
    processed: "고구마맛탕",
    healthy: "찐고구마",
    desc: "설탕 대신 자연식"
  },
  {
    processed: "과일통조림",
    healthy: "생과일",
    desc: "신선한 과일 선택"
  },
  {
    processed: "팝콘",
    healthy: "찐옥수수",
    desc: "자연 그대로의 음식"
  }
];


// ======================
// 화면 요소
// ======================

const startScreen = document.querySelector("#start-screen");
const guideScreen = document.querySelector("#guide-screen");
const gameScreen = document.querySelector("#game-screen");
const resultScreen = document.querySelector("#result-screen");


// 버튼
const startBtn = document.querySelector("#start-btn");
const backBtn = document.querySelector("#back-btn");
const nextBtn = document.querySelector("#next-btn");
const finishBtn = document.querySelector("#finish-btn");
const restartBtn = document.querySelector("#restart-btn");
const exitBtn = document.querySelector("#exit-btn");


// 카드 영역
const cardContainer = document.querySelector("#card-container");


// ======================
// 화면 전환
// ======================

function showScreen(screen) {

  const screens = document.querySelectorAll(".screen");

  screens.forEach(function(item) {
    item.classList.remove("active");
  });

  screen.classList.add("active");
}


// ======================
// 카드 생성
// ======================

function createCards() {

  // 기존 카드 제거
  cardContainer.innerHTML = "";

  // 데이터 반복
  cardData.forEach(function(data) {

    // 카드 생성
    const card = document.createElement("div");
    card.classList.add("card");

    // 카드 내부
    card.innerHTML = `
      <div class="card-image">
        ${data.processed}
      </div>

      <div class="card-content">
        <div class="card-title">
          ${data.processed}
        </div>

        <div class="card-desc">
          가공식품 카드
        </div>
      </div>
    `;

    // 상태 저장
    card.dataset.flipped = "false";

    // 클릭 이벤트
    card.addEventListener("click", function() {

      // 이미 뒤집힌 카드면 종료
      if (card.dataset.flipped === "true") {
        return;
      }

      flipCard(card, data);
    });

    // 추가
    cardContainer.appendChild(card);

  });

}


// ======================
// 카드 뒤집기
// ======================

function flipCard(card, data) {

  // 상태 변경
  card.dataset.flipped = "true";

  // 클래스 추가
  card.classList.add("flipped");

  // 텍스트 변경
  card.querySelector(".card-image").textContent =
    data.healthy;

  card.querySelector(".card-title").textContent =
    data.healthy;

  card.querySelector(".card-desc").textContent =
    data.desc;
}


// ======================
// 게임 초기화
// ======================

function resetGame() {
  createCards();
}


// ======================
// 버튼 이벤트
// ======================

// 시작
startBtn.addEventListener("click", function() {
  showScreen(guideScreen);
});

// 이전
backBtn.addEventListener("click", function() {
  showScreen(startScreen);
});

// 다음
nextBtn.addEventListener("click", function() {

  resetGame();

  showScreen(gameScreen);

});

// 게임 마치기
finishBtn.addEventListener("click", function() {
  showScreen(resultScreen);
});

// 다시 시작
restartBtn.addEventListener("click", function() {

  resetGame();

  showScreen(gameScreen);

});

// 종료
exitBtn.addEventListener("click", function() {
  showScreen(startScreen);
});