const recommendationMenus = [
  { title:'꾸덕한 국물 떡볶이', image:'/images/tteokbokki/05-finish-640.webp', url:'/articles/tteokbokki.html', time:'15분' },
  { title:'치즈 닭갈비 볶음밥', image:'/images/dakgalbi-fried-rice/06-melt-cheese-640.webp', url:'/articles/dakgalbi-fried-rice.html', time:'20분' },
  { title:'들기름 두부김치', image:'/images/tofu-kimchi/05-finish-640.webp', url:'/articles/tofu-kimchi.html', time:'15분' },
  { title:'바삭 치킨마요 덮밥', image:'/images/leftover-chicken/03-chicken-mayo-bowl.webp', url:'/articles/leftover-chicken.html#chicken-mayo', time:'10분' },
  { title:'파기름 치킨 볶음밥', image:'/images/leftover-chicken/04-scallion-fried-rice.webp', url:'/articles/leftover-chicken.html#chicken-fried-rice', time:'10분' },
  { title:'매콤 치킨 또띠아', image:'/images/leftover-chicken/05-spicy-tortilla.webp', url:'/articles/leftover-chicken.html#chicken-tortilla', time:'10분' },
  { title:'산뜻한 치킨 샐러드', image:'/images/leftover-chicken/06-chicken-salad.webp', url:'/articles/leftover-chicken.html#chicken-salad', time:'8분' },
  { title:'얼큰 치킨 라면', image:'/images/leftover-chicken/07-spicy-ramen.webp', url:'/articles/leftover-chicken.html#chicken-ramen', time:'10분' },
  { title:'파기름 계란볶음밥', image:'/images/egg-fried-rice/04-finish-640.webp', url:'/articles/egg-fried-rice.html', time:'10분' },
  { title:'신김치 계란볶음밥', image:'/images/kimchi-fried-rice/04-finish-640.webp', url:'/articles/kimchi-fried-rice.html', time:'12분' },
  { title:'양파조림 참치마요 덮밥', image:'/images/tuna-mayo-rice/04-finish-640.webp', url:'/articles/tuna-mayo-rice.html', time:'10분' },
  { title:'스팸 감자짜글이', image:'/images/potato-jjageuli/04-finish-640.webp', url:'/articles/potato-jjageuli.html', time:'20분' },
  { title:'얼큰 냉동만두 전골', image:'/images/frozen-dumpling-hotpot/04-finish-640.webp', url:'/articles/frozen-dumpling-hotpot.html', time:'20분' },
  { title:'촉촉한 두부계란전', image:'/images/tofu-egg-pancake/04-finish-640.webp', url:'/articles/tofu-egg-pancake.html', time:'15분' },
  { title:'자투리 채소 카레', image:'/images/vegetable-curry/04-finish-640.webp', url:'/articles/vegetable-curry.html', time:'25분' },
  { title:'양파간장 삼겹살 덮밥', image:'/images/leftover-pork-belly-rice/04-finish-640.webp', url:'/articles/leftover-pork-belly-rice.html', time:'10분' },
  { title:'남은 김밥 계란전', image:'/images/leftover-gimbap/03-gimbapjeon-finish-640.webp', url:'/articles/leftover-gimbap.html#gimbap-jeon', time:'10분' },
  { title:'파기름 김밥볶음밥', image:'/images/leftover-gimbap/06-friedrice-finish-640.webp', url:'/articles/leftover-gimbap.html#gimbap-fried-rice', time:'12분' },
  { title:'촉촉한 프렌치토스트', image:'/images/leftover-bread/03-french-finish-640.webp', url:'/articles/leftover-bread.html#bread-french-toast', time:'12분' },
  { title:'바삭 마늘빵 러스크', image:'/images/leftover-bread/06-rusk-finish-640.webp', url:'/articles/leftover-bread.html#garlic-rusk', time:'20분' },
  { title:'채소 치즈 식빵피자', image:'/images/leftover-bread/09-pizza-finish-640.webp', url:'/articles/leftover-bread.html#bread-pizza', time:'12분' },
  { title:'매콤 족발덮밥', image:'/images/leftover-jokbal/03-bowl-finish-640.webp', url:'/articles/leftover-jokbal.html#spicy-jokbal-bowl', time:'12분' },
  { title:'파기름 족발볶음밥', image:'/images/leftover-jokbal/06-friedrice-finish-640.webp', url:'/articles/leftover-jokbal.html#jokbal-fried-rice', time:'12분' },
  { title:'겨자 족발냉채', image:'/images/leftover-jokbal/09-salad-finish-640.webp', url:'/articles/leftover-jokbal.html#mustard-jokbal-salad', time:'10분' }
];

const shareStrip = document.querySelector('.share-strip');
if (shareStrip) {
  const currentPath = location.pathname;
  const available = recommendationMenus.filter((menu) => new URL(menu.url, location.origin).pathname !== currentPath);
  const seed = [...currentPath].reduce((total, character) => total + character.charCodeAt(0), 0) % available.length;
  const selected = Array.from({ length: 5 }, (_, index) => available[(seed + index * 3) % available.length]);
  const section = document.createElement('section');
  section.className = 'related-recipes';
  section.setAttribute('aria-labelledby', 'related-recipes-title');
  section.innerHTML = `<div class="related-heading"><p class="eyebrow">MORE RECIPES</p><h2 id="related-recipes-title">이런 레시피도 좋아요</h2></div><div class="related-track">${selected.map((menu) => `<article class="related-card"><a href="${menu.url}"><img src="${menu.image}" width="320" height="213" loading="lazy" alt="${menu.title}"><h3>${menu.title}</h3><p>초급 · ${menu.time}</p></a></article>`).join('')}</div>`;
  shareStrip.insertAdjacentElement('afterend', section);
}
