let recipes = [];
const toast = document.getElementById('toast');

function showHomeSection() {
  const hash = location.hash;
  const sections = {
    '#taste-test': document.getElementById('taste-test'),
    '#recipes': document.getElementById('recipes'),
    '#articles': document.getElementById('articles')
  };
  const focused = sections[hash];
  const quickPicks = document.querySelector('.quick-picks');
  if (!focused) {
    Object.values(sections).forEach((section) => { if (section) section.hidden = false; });
    if (quickPicks) quickPicks.hidden = false;
    return;
  }
  Object.values(sections).forEach((section) => { if (section) section.hidden = section !== focused; });
  if (quickPicks) quickPicks.hidden = true;
}

showHomeSection();
window.addEventListener('hashchange', showHomeSection);

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
    document.querySelectorAll('[data-category]').forEach((tab) => {
      tab.classList.remove('is-active');
      tab.setAttribute('aria-pressed', 'false');
    });
    button.classList.add('is-active');
    button.setAttribute('aria-pressed', 'true');
    const category = button.dataset.category;
    recipes.forEach((card) => { card.hidden = category !== 'all' && !card.dataset.tags.includes(category); });
    document.getElementById('emptyState').hidden = recipes.some((card) => !card.hidden);
  });
});

document.querySelectorAll('[data-recipe]').forEach((button) => {
  button.addEventListener('click', () => showToast(`${button.dataset.recipe} 상세 레시피는 곧 공개됩니다.`));
});

const publishedMenus = [
  { id: 'tteokbokki', title: '꾸덕한 국물 떡볶이', copy: '매콤달콤하고 쫀득한 분식이 당기는 날에 잘 맞아요.', image: '/images/tteokbokki/05-finish-640.webp', url: '/recipes/korean-tteokbokki', tags: ['분식','매콤','쫀득','따뜻','간단','15분','야식','한식'] },
  { id: 'dakgalbi-fried-rice', title: '치즈 닭갈비 볶음밥', copy: '매콤한 닭고기와 치즈를 더한 든든한 한 팬 요리예요.', image: '/images/dakgalbi-fried-rice/06-melt-cheese-640.webp', url: '/recipes/cheese-dakgalbi-fried-rice', tags: ['밥','고기','매콤','든든','볶음','따뜻','씹는맛','한식','20분'] },
  { id: 'tofu-kimchi', title: '들기름 두부김치', copy: '고소한 두부와 새콤한 볶음김치로 편안한 한 끼를 채워요.', image: '/images/tofu-kimchi/05-finish-640.webp', url: '/recipes/tofu-kimchi-recipe', tags: ['한식','고소','순한','따뜻','간단','채소','건강','혼밥','15분'] },
  { id: 'chicken-mayo', title: '바삭 치킨마요 덮밥', copy: '고소하고 든든한 한 그릇이 당기는 오늘에 잘 맞아요.', image: '/images/leftover-chicken/03-chicken-mayo-bowl-640.webp', url: '/recipes/leftover-chicken-recipes#chicken-mayo', tags: ['밥','든든','고소','순한','간단','10분','혼밥','따뜻','부드러운','한식'] },
  { id: 'chicken-fried-rice', title: '파기름 치킨 볶음밥', copy: '파기름 향과 씹는 맛을 살린 든든한 한 끼를 추천해요.', image: '/images/leftover-chicken/04-scallion-fried-rice-640.webp', url: '/recipes/leftover-chicken-recipes#chicken-fried-rice', tags: ['밥','든든','고소','짭짤','볶음','간단','10분','혼밥','따뜻','씹는맛','한식'] },
  { id: 'chicken-tortilla', title: '매콤 치킨 또띠아', copy: '손으로 가볍게 집어 먹는 매콤하고 바삭한 메뉴가 어울려요.', image: '/images/leftover-chicken/05-spicy-tortilla-640.webp', url: '/recipes/leftover-chicken-recipes#chicken-tortilla', tags: ['분식','빵','고기','매콤','간단','10분','손으로','가벼운','씹는맛','간식'] },
  { id: 'chicken-salad', title: '산뜻한 치킨 샐러드', copy: '부담은 줄이고 신선한 채소와 바삭한 식감은 살린 선택이에요.', image: '/images/leftover-chicken/06-chicken-salad-640.webp', url: '/recipes/leftover-chicken-recipes#chicken-salad', tags: ['고기','가벼운','산뜻','순한','차가운','채소','간단','건강','바삭','혼밥','8분'] },
  { id: 'chicken-ramen', title: '얼큰 치킨 라면', copy: '후루룩 넘어가는 따뜻하고 얼큰한 국물이 필요한 날이에요.', image: '/images/leftover-chicken/07-spicy-ramen-640.webp', url: '/recipes/leftover-chicken-recipes#chicken-ramen', tags: ['면','국물','매콤','얼큰','따뜻','든든','간단','10분','야식','후루룩','한식'] },
  { id: 'egg-fried-rice', title: '파기름 계란볶음밥', copy: '찬밥과 달걀 두 개로 빠르게 만드는 고소한 한 끼예요.', image: '/images/egg-fried-rice/04-finish-640.webp', url: '/recipes/easy-egg-fried-rice', tags: ['밥','달걀','고소','순한','볶음','간단','10분','혼밥','따뜻','한식'] },
  { id: 'kimchi-fried-rice', title: '신김치 계란볶음밥', copy: '신김치의 감칠맛을 고슬고슬한 찬밥에 살렸어요.', image: '/images/kimchi-fried-rice/04-finish-640.webp', url: '/recipes/kimchi-fried-rice-recipe', tags: ['밥','김치','매콤','볶음','간단','12분','혼밥','따뜻','한식'] },
  { id: 'tuna-mayo-rice', title: '양파조림 참치마요 덮밥', copy: '부드러운 참치마요와 짭짤한 양파조림을 한 그릇에 담았어요.', image: '/images/tuna-mayo-rice/04-finish-640.webp', url: '/recipes/tuna-mayo-rice-bowl', tags: ['밥','참치','고소','부드러운','간단','10분','혼밥','따뜻','한식'] },
  { id: 'potato-jjageuli', title: '스팸 감자짜글이', copy: '포슬한 감자와 얼큰한 국물이 밥을 부르는 메뉴예요.', image: '/images/potato-jjageuli/04-finish-640.webp', url: '/recipes/spam-potato-jjageuli', tags: ['국물','고기','매콤','얼큰','든든','따뜻','20분','한식'] },
  { id: 'frozen-dumpling-hotpot', title: '얼큰 냉동만두 전골', copy: '냉동만두와 채소로 국물까지 든든하게 채워요.', image: '/images/frozen-dumpling-hotpot/04-finish-640.webp', url: '/recipes/spicy-frozen-dumpling-hotpot', tags: ['국물','만두','매콤','얼큰','든든','따뜻','20분','한식'] },
  { id: 'tofu-egg-pancake', title: '촉촉한 두부계란전', copy: '두부 한 모와 달걀로 부드럽고 고소하게 부쳤어요.', image: '/images/tofu-egg-pancake/04-finish-640.webp', url: '/recipes/tofu-egg-pancake', tags: ['두부','달걀','고소','순한','부드러운','건강','15분','한식'] },
  { id: 'vegetable-curry', title: '자투리 채소 카레', copy: '냉장고 채소 다섯 가지를 든든한 한 그릇으로 바꿔요.', image: '/images/vegetable-curry/04-finish-640.webp', url: '/recipes/leftover-vegetable-curry', tags: ['밥','채소','순한','든든','건강','따뜻','25분','한그릇'] },
  { id: 'leftover-pork-belly-rice', title: '양파간장 삼겹살 덮밥', copy: '남은 삼겹살을 촉촉한 양파간장 소스로 되살렸어요.', image: '/images/leftover-pork-belly-rice/04-finish-640.webp', url: '/recipes/leftover-pork-belly-rice-bowl', tags: ['밥','고기','짭짤','든든','간단','10분','혼밥','따뜻','한식'] },
  { id: 'gimbap-jeon', title: '남은 김밥 계란전', copy: '딱딱해진 김밥을 달걀로 촉촉하게 감쌌어요.', image: '/images/leftover-gimbap/03-gimbapjeon-finish-640.webp', url: '/recipes/leftover-gimbap-recipes#gimbap-jeon', tags: ['밥','분식','달걀','고소','순한','간단','10분','혼밥','따뜻','한식','남은'] },
  { id: 'gimbap-fried-rice', title: '파기름 김밥볶음밥', copy: '김밥 속재료까지 잘게 풀어 볶은 든든한 한 그릇이에요.', image: '/images/leftover-gimbap/06-friedrice-finish-640.webp', url: '/recipes/leftover-gimbap-recipes#gimbap-fried-rice', tags: ['밥','분식','볶음','고소','짭짤','간단','12분','혼밥','따뜻','한식','남은'] },
  { id: 'gimbap-hotpot', title: '매콤 김밥전골', copy: '배추 국물에 김밥을 짧게 데워 따뜻하게 즐겨요.', image: '/images/leftover-gimbap/09-hotpot-finish-640.webp', url: '/recipes/leftover-gimbap-recipes#gimbap-hotpot', tags: ['밥','분식','국물','매콤','따뜻','든든','15분','한식','남은'] },
  { id: 'bread-french-toast', title: '촉촉한 프렌치토스트', copy: '마른 식빵이 달걀우유를 만나 부드럽게 살아나요.', image: '/images/leftover-bread/03-french-finish-640.webp', url: '/recipes/leftover-bread-recipes#bread-french-toast', tags: ['빵','달걀','고소','달콤','부드러운','간단','12분','간식','남은'] },
  { id: 'garlic-rusk', title: '바삭 마늘빵 러스크', copy: '남은 식빵 두 장을 바삭한 마늘 간식으로 바꿔요.', image: '/images/leftover-bread/06-rusk-finish-640.webp', url: '/recipes/leftover-bread-recipes#garlic-rusk', tags: ['빵','간식','고소','바삭','간단','20분','남은'] },
  { id: 'bread-pizza', title: '채소 치즈 식빵피자', copy: '토마토소스와 치즈로 식빵을 든든하게 구웠어요.', image: '/images/leftover-bread/09-pizza-finish-640.webp', url: '/recipes/leftover-bread-recipes#bread-pizza', tags: ['빵','치즈','채소','고소','간단','12분','간식','남은'] },
  { id: 'spicy-jokbal-bowl', title: '매콤 족발덮밥', copy: '남은 족발을 매콤 양파소스에 짧게 데워 촉촉해요.', image: '/images/leftover-jokbal/03-bowl-finish-640.webp', url: '/recipes/leftover-jokbal-recipes#spicy-jokbal-bowl', tags: ['밥','고기','매콤','든든','간단','12분','혼밥','따뜻','한식','남은'] },
  { id: 'jokbal-fried-rice', title: '파기름 족발볶음밥', copy: '족발의 고소한 지방을 살린 12분 찬밥 요리예요.', image: '/images/leftover-jokbal/06-friedrice-finish-640.webp', url: '/recipes/leftover-jokbal-recipes#jokbal-fried-rice', tags: ['밥','고기','볶음','고소','짭짤','간단','12분','혼밥','한식','남은'] },
  { id: 'mustard-jokbal-salad', title: '겨자 족발냉채', copy: '오이와 양파를 더해 산뜻하고 가볍게 즐겨요.', image: '/images/leftover-jokbal/09-salad-finish-640.webp', url: '/recipes/leftover-jokbal-recipes#mustard-jokbal-salad', tags: ['고기','차가운','산뜻','채소','간단','10분','건강','한식','남은'] },
  { id: 'night-bibim-guksu', title: '10분 비빔국수', copy: '새콤매콤한 양념장이 야식으로 당기는 날 잘 어울려요.', image: '/images/night-bibim-guksu/04-finish-640.webp', url: '/recipes/spicy-bibim-guksu', tags: ['면','매콤','새콤','간단','10분','야식','후루룩','한식'] },
  { id: 'microwave-corn-cheese', title: '5분 전자레인지 콘치즈', copy: '톡톡 터지는 옥수수와 고소한 치즈를 5분 만에 즐겨요.', image: '/images/microwave-corn-cheese/04-finish-640.webp', url: '/recipes/microwave-corn-cheese', tags: ['치즈','고소','간단','5분','야식','간식','전자레인지'] },
  { id: 'sundubu-egg-soup', title: '속 편한 순두부 계란탕', copy: '부드러운 순두부와 달걀로 늦은 밤을 가볍게 채워요.', image: '/images/sundubu-egg-soup/04-finish-640.webp', url: '/recipes/sundubu-egg-soup', tags: ['국물','순한','따뜻','가벼운','건강','간단','10분','야식','한식'] },
  { id: 'crispy-kimchi-jeon', title: '바삭 김치전', copy: '신김치 반죽을 얇게 부쳐 바삭한 가장자리를 살렸어요.', image: '/images/crispy-kimchi-jeon/04-finish-640.webp', url: '/recipes/crispy-kimchi-pancake', tags: ['분식','김치','매콤','바삭','간단','15분','야식','한식'] },
  { id: 'simple-fishcake-soup', title: '15분 포장마차 어묵탕', copy: '멸치육수와 부드러운 어묵으로 따뜻한 밤을 만들어요.', image: '/images/simple-fishcake-soup/04-finish-640.webp', url: '/recipes/korean-fish-cake-soup', tags: ['국물','어묵','따뜻','든든','간단','15분','야식','한식'] }
];

function renderPublishedMenus() {
  const grid = document.getElementById('recipeGrid');
  grid.innerHTML = publishedMenus.map((menu, index) => {
    const duration = menu.tags.find((tag) => /^\d+분$/.test(tag)) || '15분';
    const filterTags = [...menu.tags, ...(menu.tags.includes('간단') ? ['간단요리'] : [])].join(' ');
    const badge = menu.id === 'chicken-mayo'
      ? '<span class="badge">BEST</span>'
      : '';
    const smallImage = menu.image.replace('-640.webp', '-320.webp');
    const compactImage = menu.image.replace('-640.webp', '-220.webp');
    return `<li class="recipe-card" data-title="${menu.title}" data-tags="${filterTags}">
      <a href="${menu.url}" aria-label="${menu.title} 레시피 보기">
        <div class="recipe-image"><picture><source media="(min-width:681px)" srcset="${compactImage} 1x, ${menu.image} 2x" width="220" height="147" /><img src="${smallImage}" srcset="${smallImage} 1x, ${menu.image} 2x" width="320" height="214" loading="lazy" decoding="async" alt="${menu.title} 완성 모습" /></picture>${badge}</div>
        <div class="recipe-info"><p>${menu.copy}</p><h3>${menu.title}</h3><div><span>초급</span><span>${duration}</span></div></div>
      </a>
    </li>`;
  }).join('');
  recipes = [...grid.querySelectorAll('.recipe-card')];
}

renderPublishedMenus();

function bindHorizontalCarousel(trackId, previousId, nextId, desktopStep = 1, mobileStep = 1) {
  const track = document.getElementById(trackId);
  const previous = document.getElementById(previousId);
  const next = document.getElementById(nextId);
  if (!track || !previous || !next) return;
  const cards = [...track.children];
  let currentIndex = 0;
  const step = () => window.matchMedia('(max-width: 680px)').matches ? mobileStep : desktopStep;
  const updateButtons = () => {
    previous.disabled = currentIndex === 0;
    next.disabled = currentIndex >= Math.max(0, cards.length - step());
  };
  const move = (direction) => {
    currentIndex = Math.min(Math.max(0, currentIndex + direction * step()), Math.max(0, cards.length - step()));
    cards[currentIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    updateButtons();
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  window.addEventListener('resize', updateButtons, { passive: true });
  updateButtons();
}

document.querySelectorAll('#articleCarousel .article-feature').forEach((card, index) => {
  if (index >= 8) card.remove();
});
bindHorizontalCarousel('recipeGrid', 'recipePrev', 'recipeNext', 5, 4);
bindHorizontalCarousel('articleCarousel', 'articlePrev', 'articleNext');

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
const dailyRecommendationCount = document.getElementById('dailyRecommendationCount');
let currentQuestion = 0;
let selections = [];
let activeMode = 'simple';
let activeQuestions = simpleQuestions;

function getKoreanDateKey() {
  return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
}

function readDailyRecommendationCount() {
  const today = getKoreanDateKey();
  try {
    const saved = JSON.parse(localStorage.getItem('omeokjiDailyRecommendations') || '{}');
    return saved.date === today ? Number(saved.count) || 0 : 0;
  } catch (error) {
    return 0;
  }
}

function updateDailyRecommendationCount(increment = false) {
  const today = getKoreanDateKey();
  const count = readDailyRecommendationCount() + (increment ? 1 : 0);
  if (increment) {
    try { localStorage.setItem('omeokjiDailyRecommendations', JSON.stringify({ date: today, count })); } catch (error) {}
  }
  dailyRecommendationCount.textContent = count === 0
    ? '첫 추천을 시작해보세요'
    : `오늘 ${count.toLocaleString('ko-KR')}회 추천 완료`;
}

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
  updateDailyRecommendationCount(true);
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

updateDailyRecommendationCount();

const params = new URLSearchParams(window.location.search);
if (params.get('q')) filterRecipes(params.get('q'));
