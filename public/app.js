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

const questions = [
  { title: '지금 가장 끌리는 맛은?', subtitle: '첫 느낌이 가장 정확해요.', answers: [
    ['🌶️', '화끈하게 매콤한 맛', 'spicy'], ['🍲', '속 편한 따뜻한 맛', 'warm'], ['🥬', '산뜻하고 가벼운 맛', 'light'], ['🧀', '고소하고 진한 맛', 'rich']
  ]},
  { title: '오늘의 에너지는 어느 정도인가요?', subtitle: '요리에 쓸 수 있는 힘을 알려주세요.', answers: [
    ['⚡', '10분도 길어요', 'quick'], ['🙂', '간단한 조리는 가능', 'normal'], ['👩‍🍳', '제법 요리하고 싶어요', 'cook'], ['🛍️', '사 먹는 것도 좋아요', 'buy']
  ]},
  { title: '누구와 먹는 한 끼인가요?', subtitle: '인원에 맞는 메뉴를 고를게요.', answers: [
    ['☝️', '나 혼자 오붓하게', 'solo'], ['💛', '둘이서 맛있게', 'pair'], ['🏠', '온 가족이 함께', 'family'], ['🎉', '친구들과 신나게', 'party']
  ]},
  { title: '지금 필요한 한 끼는?', subtitle: '마지막 질문이에요.', answers: [
    ['🍚', '든든한 밥 한 그릇', 'rice'], ['🍜', '후루룩 면 요리', 'noodle'], ['🥘', '함께 떠먹는 요리', 'share'], ['🥗', '가벼운 채소 한 접시', 'salad']
  ]}
];

const results = {
  spicy: { emoji: '🌶️', title: '꾸덕한 국물 떡볶이', copy: '오늘은 생각만 해도 입맛 도는 매콤달콤한 메뉴가 정답이에요.', tags: ['매콤달콤', '15분 완성', '야식 추천'], query: '떡볶이 밀키트' },
  warm: { emoji: '🥘', title: '돼지고기 김치찌개', copy: '보글보글 끓는 따뜻한 국물로 오늘의 피로를 천천히 풀어보세요.', tags: ['따뜻한 국물', '한식', '가족 메뉴'], query: '김치찌개 밀키트' },
  light: { emoji: '🥗', title: '들기름 두부 샐러드', copy: '부담은 덜고 고소함은 충분한, 산뜻하고 든든한 한 접시가 어울려요.', tags: ['가벼운 한 끼', '고단백', '10분 완성'], query: '두부 샐러드 재료' },
  rich: { emoji: '🧀', title: '치즈 닭갈비 볶음밥', copy: '고소한 치즈와 매콤한 닭갈비가 만나는 확실한 행복이 필요한 날이에요.', tags: ['고소매콤', '한 팬 요리', '혼밥 추천'], query: '닭갈비 밀키트' }
};

const modal = document.getElementById('quizModal');
const quizContent = document.getElementById('quizContent');
const quizStep = document.getElementById('quizStep');
const progressBar = document.getElementById('progressBar');
let currentQuestion = 0;
let selections = [];

function renderQuestion() {
  const question = questions[currentQuestion];
  quizStep.textContent = `${currentQuestion + 1} / ${questions.length}`;
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  quizContent.innerHTML = `
    <div class="quiz-body">
      <p class="eyebrow">QUESTION ${String(currentQuestion + 1).padStart(2, '0')}</p>
      <h2>${question.title}</h2>
      <p>${question.subtitle}</p>
      <div class="answer-grid">
        ${question.answers.map(([emoji, label, value]) => `<button class="answer-button" type="button" data-answer="${value}"><span>${emoji}</span><strong>${label}</strong></button>`).join('')}
      </div>
    </div>`;
  quizContent.querySelectorAll('[data-answer]').forEach((button) => {
    button.addEventListener('click', () => {
      selections.push(button.dataset.answer);
      currentQuestion += 1;
      if (currentQuestion < questions.length) renderQuestion(); else renderResult();
    });
  });
}

function renderResult() {
  const taste = selections.find((value) => results[value]) || 'warm';
  const result = results[taste];
  quizStep.textContent = 'RESULT';
  progressBar.style.width = '100%';
  const productUrl = `https://www.coupang.com/np/search?q=${encodeURIComponent(result.query)}`;
  quizContent.innerHTML = `
    <div class="result-body">
      <p class="eyebrow">TODAY'S MENU</p>
      <div class="result-emoji">${result.emoji}</div>
      <h2>${result.title}</h2>
      <p>${result.copy}</p>
      <div class="result-tags">${result.tags.map((tag) => `<span>#${tag}</span>`).join('')}</div>
      <div class="result-actions">
        <a class="button button-dark" href="${productUrl}" target="_blank" rel="sponsored noopener">재료 보러가기 →</a>
        <button class="button button-outline" id="shareResult" type="button">결과 공유하기</button>
      </div>
      <p class="result-disclosure">이 링크는 쿠팡 상품 검색으로 연결되며, 파트너스 링크로 교체할 수 있습니다.</p>
    </div>`;
  document.getElementById('shareResult').addEventListener('click', async () => {
    const shareData = { title: `오먹지 결과: ${result.title}`, text: `내 오늘의 메뉴는 ${result.title}! 당신의 메뉴도 찾아보세요.`, url: window.location.href.split('#')[0] + '#taste-test' };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`); showToast('결과 링크를 복사했어요.'); }
    } catch (error) { if (error.name !== 'AbortError') showToast('공유 링크를 복사하지 못했어요.'); }
  });
}

function openQuiz() {
  currentQuestion = 0;
  selections = [];
  renderQuestion();
  modal.showModal();
}

document.getElementById('startQuiz').addEventListener('click', openQuiz);
document.getElementById('closeQuiz').addEventListener('click', () => modal.close());
modal.addEventListener('click', (event) => { if (event.target === modal) modal.close(); });

const params = new URLSearchParams(window.location.search);
if (params.get('q')) filterRecipes(params.get('q'));
