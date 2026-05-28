// =========================================
//  식판꾸미기 게임 - Script
// =========================================

// --- 음식 데이터 ---
const FOOD_DATA = [
  // 곡류
  { id: 'jap', name: '잡곡밥', emoji: '🍚', group: 'grain', groupName: '곡류' },
  { id: 'corn', name: '옥수수', emoji: '🌽', group: 'grain', groupName: '곡류' },
  { id: 'tteok', name: '떡', emoji: '🍡', group: 'grain', groupName: '곡류' },
  { id: 'potato', name: '감자', emoji: '🥔', group: 'grain', groupName: '곡류' },
  { id: 'bread', name: '식빵', emoji: '🍞', group: 'grain', groupName: '곡류' },
  { id: 'goguma', name: '고구마', emoji: '🍠', group: 'grain', groupName: '곡류' },
  { id: 'noodle', name: '잔치국수', emoji: '🍜', group: 'grain', groupName: '곡류' },

  // 고기, 생선, 달걀, 콩류
  { id: 'dakgalbi', name: '닭갈비', emoji: '🍗', group: 'protein', groupName: '고기·생선·달걀·콩류' },
  { id: 'jeyuk', name: '제육볶음', emoji: '🥩', group: 'protein', groupName: '고기·생선·달걀·콩류' },
  { id: 'bulgogi', name: '소불고기', emoji: '🥓', group: 'protein', groupName: '고기·생선·달걀·콩류' },
  { id: 'tofu', name: '두부조림', emoji: '🟫', group: 'protein', groupName: '고기·생선·달걀·콩류' },
  { id: 'egg', name: '달걀 프라이', emoji: '🍳', group: 'protein', groupName: '고기·생선·달걀·콩류' },
  { id: 'blackbean', name: '검은콩조림', emoji: '🫘', group: 'protein', groupName: '고기·생선·달걀·콩류' },
  { id: 'mackerel', name: '고등어구이', emoji: '🐟', group: 'protein', groupName: '고기·생선·달걀·콩류' },
  { id: 'cheongguk', name: '청국장', emoji: '🫕', group: 'protein', groupName: '고기·생선·달걀·콩류' },
  { id: 'dubu-jjigae', name: '두부된장국', emoji: '🍲', group: 'protein', groupName: '고기·생선·달걀·콩류' },
  { id: 'biji', name: '비지찌개', emoji: '🥘', group: 'protein', groupName: '고기·생선·달걀·콩류' },

  // 채소류
  { id: 'carrot', name: '당근', emoji: '🥕', group: 'veggie', groupName: '채소류' },
  { id: 'mushroom', name: '버섯', emoji: '🍄', group: 'veggie', groupName: '채소류' },
  { id: 'gosari', name: '고사리무침', emoji: '🌿', group: 'veggie', groupName: '채소류' },
  { id: 'cucumber', name: '오이', emoji: '🥒', group: 'veggie', groupName: '채소류' },
  { id: 'broccoli', name: '브로콜리', emoji: '🥦', group: 'veggie', groupName: '채소류' },
  { id: 'miyeok', name: '미역줄기무침', emoji: '🌊', group: 'veggie', groupName: '채소류' },
  { id: 'oigochu', name: '오이고추된장무침', emoji: '🫑', group: 'veggie', groupName: '채소류' },
  { id: 'kimchi', name: '김치', emoji: '🥬', group: 'veggie', groupName: '채소류' },
  { id: 'kimchi-jjigae', name: '김치찌개', emoji: '🫕', group: 'veggie', groupName: '채소류' },
  { id: 'miyeok-guk', name: '미역국', emoji: '🫙', group: 'veggie', groupName: '채소류' },
  { id: 'kongnamul', name: '콩나물국', emoji: '🍵', group: 'veggie', groupName: '채소류' },

  // 과일류
  { id: 'apple', name: '사과', emoji: '🍎', group: 'fruit', groupName: '과일류' },
  { id: 'grape', name: '포도', emoji: '🍇', group: 'fruit', groupName: '과일류' },
  { id: 'tangerine', name: '귤', emoji: '🍊', group: 'fruit', groupName: '과일류' },
  { id: 'kiwi', name: '키위', emoji: '🥝', group: 'fruit', groupName: '과일류' },
  { id: 'plum', name: '자두', emoji: '🍑', group: 'fruit', groupName: '과일류' },
  { id: 'peach', name: '복숭아', emoji: '🍑', group: 'fruit', groupName: '과일류' },
  { id: 'grapefruit', name: '자몽', emoji: '🍋', group: 'fruit', groupName: '과일류' },
  { id: 'strawberry', name: '딸기', emoji: '🍓', group: 'fruit', groupName: '과일류' },

  // 우유, 유제품류
  { id: 'milk', name: '우유', emoji: '🥛', group: 'dairy', groupName: '우유·유제품류' },
  { id: 'cheese', name: '치즈', emoji: '🧀', group: 'dairy', groupName: '우유·유제품류' },
  { id: 'yogurt-spoon', name: '떠먹는 요구르트', emoji: '🍮', group: 'dairy', groupName: '우유·유제품류' },
  { id: 'yogurt-drink', name: '마시는 요구르트', emoji: '🥤', group: 'dairy', groupName: '우유·유제품류' },
];

// --- 게임 상태 ---
let traySlots = Array(6).fill(null); // 각 슬롯에 담긴 음식 데이터
let draggedFood = null;

// --- 화면 전환 ---
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(screenId).classList.add('active');

  if (screenId === 'screen-game') {
    traySlots = Array(6).fill(null);
    for (let i = 0; i < 6; i++) renderSlot(i);
    updateFilledCount();
    renderFoodGrid();
  }
}

// --- 음식 그리드 렌더링 ---
function renderFoodGrid() {
  const page0 = document.getElementById('food-page-0');
  const page1 = document.getElementById('food-page-1');
  page0.innerHTML = '';
  page1.innerHTML = '';

  const usedIds = traySlots.filter(Boolean).map(f => f.id);

  FOOD_DATA.forEach((food, index) => {
    const el = createFoodItem(food, usedIds.includes(food.id));
    if (index < 21) {
      page0.appendChild(el);
    } else {
      page1.appendChild(el);
    }
  });
}

function createFoodItem(food, isUsed) {
  const div = document.createElement('div');
  div.className = `food-item${isUsed ? ' used' : ''}`;
  div.draggable = !isUsed;
  div.dataset.foodId = food.id;

  div.innerHTML = `
    <span class="food-emoji">${food.emoji}</span>
    <span class="food-name">${food.name}</span>
    <span class="food-group-tag group-${food.group}">${food.groupName}</span>
  `;

  div.addEventListener('dragstart', (e) => {
    draggedFood = food;
    div.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'copy';
  });
  div.addEventListener('dragend', () => {
    div.classList.remove('dragging');
  });

  // 클릭으로도 추가 (빈 슬롯에 자동 배치)
  div.addEventListener('click', () => {
    if (isUsed) return;
    const emptySlot = traySlots.findIndex(s => s === null);
    if (emptySlot === -1) {
      alert('식판이 가득 찼어요! 음식을 빼고 다시 시도해보세요.');
      return;
    }
    placeFood(food, emptySlot);
  });

  return div;
}

// --- 드래그 앤 드롭 ---
function allowDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.add('drag-over');
}

function dropFood(event, slotIndex) {
  event.preventDefault();
  event.currentTarget.classList.remove('drag-over');
  if (!draggedFood) return;
  placeFood(draggedFood, slotIndex);
  draggedFood = null;
}

// 드래그 오버 리셋
document.addEventListener('dragover', (e) => {
  document.querySelectorAll('.tray-slot').forEach(s => s.classList.remove('drag-over'));
});

// --- 음식 배치 ---
function placeFood(food, slotIndex) {
  // 이미 담긴 음식이면 무시
  if (traySlots.some(s => s && s.id === food.id)) return;

  traySlots[slotIndex] = food;
  renderSlot(slotIndex);
  renderFoodGrid();
  updateFilledCount();
}

function renderSlot(slotIndex) {
  const slot = document.getElementById(`slot-${slotIndex}`);
  const food = traySlots[slotIndex];

  if (!food) {
    slot.classList.remove('filled');
    slot.innerHTML = '<span class="slot-hint">여기에 놓기</span>';
    return;
  }

  slot.classList.add('filled');
  slot.innerHTML = `
    <div class="slot-food-inner">
      <span class="slot-food-emoji">${food.emoji}</span>
      <span class="slot-food-name">${food.name}</span>
      <span class="slot-food-group group-${food.group}">${food.groupName}</span>
    </div>
    <button class="slot-remove-btn" onclick="removeFood(${slotIndex}, event)">✕</button>
  `;
}

function removeFood(slotIndex, event) {
  event.stopPropagation();
  traySlots[slotIndex] = null;
  renderSlot(slotIndex);
  renderFoodGrid();
  updateFilledCount();
}

function updateFilledCount() {
  const count = traySlots.filter(Boolean).length;
  document.getElementById('filled-count').textContent = count;
}

// --- 초기화 ---
function clearTray() {
  traySlots = Array(6).fill(null);
  for (let i = 0; i < 6; i++) renderSlot(i);
  renderFoodGrid();
  updateFilledCount();
}

// --- 페이지 탭 ---
function showFoodPage(pageIndex) {
  document.querySelectorAll('.food-grid').forEach((g, i) => {
    g.classList.toggle('hidden', i !== pageIndex);
  });
  document.querySelectorAll('.tab-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === pageIndex);
  });
}

// --- 점수 계산 ---
function calcScore() {
  const filled = traySlots.filter(Boolean);
  const groups = new Set(filled.map(f => f.group));
  const groupCount = groups.size;

  let score, message;
  if (groupCount >= 5) {
    score = 100;
    message = '100점, 참 잘했어요! 앞으로도 건강한 식사를 규칙적으로 적당히 맛있게 먹어요';
  } else if (groupCount === 4) {
    score = 70;
    message = '70점! 조금 아쉽네요! 더 건강한 식사를 위해 노력해봐요';
  } else if (groupCount === 3) {
    score = 40;
    message = '40점! 노력이 필요해요! 다양한 음식을 섭취하면 좋을 것 같아요. 천천히 하나씩 실천해봐요.';
  } else {
    score = 0;
    message = '0점! 오늘 식사는 건강하지 않아요! 영양에 대한 공부가 필요해요';
  }

  return { score, message, groups, groupCount };
}

// --- 점수 보기 ---
function showScore() {
  const { score, message, groups } = calcScore();

  const scoreEl = document.getElementById('result-score-value');
  scoreEl.textContent = `${score}점`;
  scoreEl.className = 'result-score-value';
  if (score === 100) scoreEl.classList.add('score-100');
  else if (score === 70) scoreEl.classList.add('score-70');
  else if (score === 40) scoreEl.classList.add('score-40');
  else scoreEl.classList.add('score-0');

  document.getElementById('result-message').textContent = message;

  // 포함된 분류군 태그
  const summaryEl = document.getElementById('result-summary');
  const groupInfo = [
    { key: 'grain', label: '곡류', cls: 'group-grain' },
    { key: 'protein', label: '고기·생선·달걀·콩류', cls: 'group-protein' },
    { key: 'veggie', label: '채소류', cls: 'group-veggie' },
    { key: 'fruit', label: '과일류', cls: 'group-fruit' },
    { key: 'dairy', label: '우유·유제품류', cls: 'group-dairy' },
  ];
  summaryEl.innerHTML = groupInfo.map(g => `
    <span class="result-group-tag ${g.cls}" style="opacity:${groups.has(g.key) ? 1 : 0.3}">
      ${groups.has(g.key) ? '✓' : '✗'} ${g.label}
    </span>
  `).join('');

  showScreen('screen-result');
}

// --- 다시 시작 ---
function restartGame() {
  traySlots = Array(6).fill(null);
  for (let i = 0; i < 6; i++) renderSlot(i);
  updateFilledCount();
  renderFoodGrid();
  showScreen('screen-game');
}

// --- 초기화 ---
window.addEventListener('DOMContentLoaded', () => {
  // 슬롯 드래그오버 이벤트 리셋
  document.querySelectorAll('.tray-slot').forEach(slot => {
    slot.addEventListener('dragleave', () => {
      slot.classList.remove('drag-over');
    });
  });
});