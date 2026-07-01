const recipes = [...document.querySelectorAll('.recipe-card')];
const toast = document.getElementById('toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2200);
}

function filterRecipes(term) {
  const keyword = term.trim().toLowerCase();
  let visible = 0;
  recipes.forEach((card) => {
    const haystack = `${card.dataset.title} ${card.dataset.tags}`.toLowerCase();
    const match = !keyword || haystack.includes(keyword);
    card.hidden = !match;
    if (match) visible += 1;
  });
  document.getElementById('emptyState').hidden = visible > 0;
  document.getElementById('recipes').scrollIntoView({ behavior: 'smooth' });
}

const searchToggle = document.getElementById('searchToggle');
const searchPanel = document.getElementById('searchPanel');
searchToggle.addEventListener('click', () => {
  searchPanel.hidden = !searchPanel.hidden;
  searchToggle.setAttribute('aria-label', searchPanel.hidden ? '레시피 검색 열기' : '레시피 검색 닫기');
  if (!searchPanel.hidden) document.getElementById('siteSearch').focus();
});

searchPanel.addEventListener('submit', (event) => {
  event.preventDefault();
  filterRecipes(new FormData(searchPanel).get('q') || '');
});

document.querySelectorAll('[data-filter]').forEach((button) => {
  button.addEventListener('click', () => filterRecipes(button.dataset.filter));
});

document.querySelectorAll('[data-category]').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-category]').forEach((tab) => tab.classList.remove('is-active'));
    button.classList.add('is-active');
    const category = button.dataset.category;
    recipes.forEach((card) => { card.hidden = category !== 'all' && !card.dataset.tags.includes(category); });
    document.getElementById('emptyState').hidden = recipes.some((card) => !card.hidden);
  });
});

document.querySelectorAll('[data-recipe]').forEach((button) => {
  button.addEventListener('click', () => showToast(`${button.dataset.recipe} 상세 레시피는 곧 공개됩니다.`));
});

const publishedMenus = [
  { id: 'chicken-mayo', title: '바삭 치킨마요 덮밥', copy: '고소하고 든든한 한 그릇이 당기는 오늘에 잘 맞아요.', image: '/images/leftover-chicken/03-chicken-mayo-bowl.webp', url: '/articles/leftover-chicken.html#chicken-mayo', tags: ['밥','든든','고소','순한','간단','10분','혼밥','따뜻','부드러운','한식'] },
  { id: 'chicken-fried-rice', title: '파기름 치킨 볶음밥', copy: '파기름 향과 씹는 맛을 살린 든든한 한 끼를 추천해요.', image: '/images/leftover-chicken/04-scallion-fried-rice.webp', url: '/articles/leftover-chicken.html#chicken-fried-rice', tags: ['밥','든든','고소','짭짤','볶음','간단','10분','혼밥','따뜻','씹는맛','한식'] },
  { id: 'chicken-tortilla', title: '매콤 치킨 또띠아', copy: '손으로 가볍게 집어 먹는 매콤하고 바삭한 메뉴가 어울려요.', image: '/images/leftover-chicken/05-spicy-tortilla.webp', url: '/articles/leftover-chicken.html#chicken-tortilla', tags: ['분식','빵','고기','매콤','간단','10분','손으로','가벼운','씹는맛','간식'] },
  { id: 'chicken-salad', title: '산뜻한 치킨 샐러드', copy: '부담은 줄이고 신선한 채소와 바삭한 식감은 살린 선택이에요.', image: '/images/leftover-chicken/06-chicken-salad.webp', url: '/articles/leftover-chicken.html#chicken-salad', tags: ['고기','가벼운','산뜻','순한','차가운','채소','간단','건강','바삭','혼밥'] },
  { id: 'chicken-ramen', title: '얼큰 치킨 라면', copy: '후루룩 넘어가는 따뜻하고 얼큰한 국물이 필요한 날이에요.', image: '/images/leftover-chicken/07-spicy-ramen.webp', url: '/articles/leftover-chicken.html#chicken-ramen', tags: ['면','국물','매콤','얼큰','따뜻','든든','간단','10분','야식','후루룩','한식'] }
];

const simpleQuestions = [
  { title: '지금 가장 끌리는 형태는?', subtitle: '첫 느낌대로 골라주세요.', answers: [
    ['🍜','후루룩 넘어가는 면',['면','국물','후루룩']], ['🍚','든든한 밥·국밥',['밥','든든']], ['🍗','씹는 맛이 있는 고기',['고기','씹는맛']], ['🥙','가볍게 집어먹는 분식·빵',['분식','빵','손으로']]
  ]},
  { title: '오늘 당기는 맛은?', subtitle: '가장 먼저 떠오르는 맛을 선택하세요.', answers: [
    ['🌶️','매콤하고 얼큰한 맛',['매콤','얼큰']], ['🧂','짭짤하고 감칠맛 나는 맛',['짭짤','볶음']], ['🥚','고소하고 순한 맛',['고소','순한']], ['🥬','산뜻하고 깔끔한 맛',['산뜻','채소']], ['🍲','따뜻하고 편안한 맛',['따뜻','국물']]
  ]},
  { title: '배고픔은 어느 정도인가요?', subtitle: '지금 필요한 포만감을 알려주세요.', answers: [
    ['🔥','아주 배고파요',['든든','밥','면']], ['🙂','적당히 한 끼 먹고 싶어요',['한식','고기']], ['🪶','조금 가볍게 먹고 싶어요',['가벼운','채소']], ['🍪','식사보다 간식에 가까워요',['간식','분식']]
  ]},
  { title: '요리에 쓸 수 있는 힘은?', subtitle: '오늘의 에너지에 맞춰볼게요.', answers: [
    ['⚡','10분 안에 빠르게',['10분','간단']], ['🍳','팬 하나 정도는 괜찮아요',['볶음','간단']], ['🔪','조금 손질해도 좋아요',['채소','씹는맛']], ['🛋️','최대한 단순했으면 해요',['간단','면']]
  ]},
  { title: '오늘의 식사 분위기는?', subtitle: '마지막 선택이에요.', answers: [
    ['☝️','혼자 편하게 먹는 한 끼',['혼밥','간단']], ['🌙','늦은 밤의 야식',['야식','매콤']], ['💚','건강을 챙기는 한 끼',['건강','가벼운']], ['🧸','익숙하고 편안한 한 끼',['따뜻','순한']], ['🎈','재미있게 집어 먹는 메뉴',['손으로','분식']]
  ]}
];

const preciseQuestions = [
  ...simpleQuestions,
  { title: '따뜻한 음식과 차가운 음식 중에는?', subtitle: '먹고 싶은 온도를 골라주세요.', answers: [
    ['♨️','김이 나는 따뜻한 음식',['따뜻','국물','볶음']], ['❄️','차갑고 산뜻한 음식',['차가운','산뜻','채소']], ['🌤️','온도는 크게 상관없어요',[]], ['🔥','뜨겁고 얼큰한 음식',['얼큰','매콤']]
  ]},
  { title: '좋아하는 식감은?', subtitle: '입안에서 느껴지는 재미도 중요해요.', answers: [
    ['✨','겉은 바삭한 식감',['바삭','씹는맛']], ['☁️','부드럽게 넘어가는 식감',['부드러운','밥']], ['🥢','고슬고슬하고 씹히는 식감',['볶음','씹는맛']], ['🥬','아삭하고 신선한 식감',['채소','산뜻']], ['🍜','후루룩 편하게 먹는 식감',['면','후루룩']]
  ]},
  { title: '어떻게 먹는 게 편한가요?', subtitle: '식사 방식도 메뉴를 결정해요.', answers: [
    ['🥄','숟가락으로 한 그릇',['밥','혼밥']], ['🥢','젓가락으로 면이나 볶음',['면','볶음']], ['🤲','손으로 간편하게',['손으로','분식']], ['🍴','채소와 함께 천천히',['채소','건강']]
  ]},
  { title: '지금 가장 필요한 기분은?', subtitle: '음식이 채워줬으면 하는 감정은 무엇인가요?', answers: [
    ['🧸','편안한 위로',['순한','따뜻']], ['⚡','확실한 자극',['매콤','얼큰']], ['🌿','산뜻한 리셋',['산뜻','가벼운']], ['💪','든든한 충전',['든든','고기']], ['🎉','재미있는 변화',['분식','손으로']]
  ]},
  { title: '지금 눈에 들어오는 재료는?', subtitle: '마지막으로 끌리는 조합을 골라주세요.', answers: [
    ['🍚','밥과 달걀',['밥','고소','부드러운']], ['🌿','대파와 간장',['볶음','짭짤']], ['🧀','치즈와 또띠아',['분식','빵']], ['🥗','신선한 채소',['채소','건강']], ['🍜','라면과 얼큰한 국물',['면','국물','얼큰']]
  ]}
];

const modal = document.getElementById('quizModal');
const quizContent = document.getElementById('quizContent');
const quizStep = document.getElementById('quizStep');
const progressBar = document.getElementById('progressBar');
let currentQuestion = 0;
let selections = [];
let activeMode = 'simple';
let activeQuestions = simpleQuestions;

function renderQuestion() {
  const question = activeQuestions[currentQuestion];
  quizStep.textContent = `${currentQuestion + 1} / ${activeQuestions.length}`;
  progressBar.style.width = `${((currentQuestion + 1) / activeQuestions.length) * 100}%`;
  quizContent.innerHTML = `
    <div class="quiz-body">
      <p class="eyebrow">QUESTION ${String(currentQuestion + 1).padStart(2, '0')}</p>
      <h2>${question.title}</h2>
      <p>${question.subtitle}</p>
      <div class="answer-grid">
        ${question.answers.map(([emoji, label], index) => `<button class="answer-button" type="button" data-answer="${index}"><span>${emoji}</span><strong>${label}</strong></button>`).join('')}
      </div>
    </div>`;
  quizContent.querySelectorAll('[data-answer]').forEach((button) => {
    button.addEventListener('click', () => {
      selections.push(question.answers[Number(button.dataset.answer)][2]);
      currentQuestion += 1;
      if (currentQuestion < activeQuestions.length) renderQuestion(); else renderResult();
    });
  });
}

function pickResult() {
  if (activeMode === 'random') return publishedMenus[Math.floor(Math.random() * publishedMenus.length)];
  const selectedTags = selections.flat();
  const scored = publishedMenus.map((menu) => ({ menu, score: selectedTags.reduce((total, tag) => total + (menu.tags.includes(tag) ? 1 : 0), 0) }));
  const topScore = Math.max(...scored.map(({ score }) => score));
  const topMenus = scored.filter(({ score }) => score === topScore).map(({ menu }) => menu);
  return topMenus[Math.floor(Math.random() * topMenus.length)];
}

function renderResult() {
  const result = pickResult();
  quizStep.textContent = 'RESULT';
  progressBar.style.width = '100%';
  quizContent.innerHTML = `
    <div class="result-body">
      <p class="eyebrow">TODAY'S MENU</p>
      <img class="result-image" src="${result.image}" width="600" height="400" alt="${result.title}" />
      <h2>${result.title}</h2>
      <p>${result.copy}</p>
      <div class="result-tags">${result.tags.slice(0, 4).map((tag) => `<span>#${tag}</span>`).join('')}</div>
      <div class="result-actions">
        <a class="button button-dark" href="${result.url}">레시피 보러가기 →</a>
        <button class="button button-outline" id="retryQuiz" type="button">다시 추천받기</button>
      </div>
      <button class="text-link result-share" id="shareResult" type="button">결과 공유하기</button>
    </div>`;
  document.getElementById('retryQuiz').addEventListener('click', () => openQuiz(activeMode));
  document.getElementById('shareResult').addEventListener('click', async () => {
    const shareData = { title: `오먹지 결과: ${result.title}`, text: `내 오늘의 메뉴는 ${result.title}! 당신의 메뉴도 찾아보세요.`, url: window.location.href.split('#')[0] + '#taste-test' };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`); showToast('결과 링크를 복사했어요.'); }
    } catch (error) { if (error.name !== 'AbortError') showToast('공유 링크를 복사하지 못했어요.'); }
  });
}

function openQuiz(mode = 'simple') {
  activeMode = mode;
  activeQuestions = mode === 'precise' ? preciseQuestions : simpleQuestions;
  currentQuestion = 0;
  selections = [];
  if (!modal.open) modal.showModal();
  if (mode === 'random') renderResult(); else renderQuestion();
}

document.querySelectorAll('[data-test-mode]').forEach((button) => button.addEventListener('click', () => openQuiz(button.dataset.testMode)));
document.getElementById('closeQuiz').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });

const params = new URLSearchParams(window.location.search);
if (params.get('q')) filterRecipes(params.get('q'));
