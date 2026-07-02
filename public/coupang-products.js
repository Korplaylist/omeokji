const formatWon = new Intl.NumberFormat('ko-KR');

document.querySelectorAll('.affiliate-box').forEach(async (box) => {
  const fallbackLink = box.querySelector('a[rel~="sponsored"]');
  if (!fallbackLink) return;
  const keyword = new URL(fallbackLink.href).searchParams.get('q');
  if (!keyword) return;

  try {
    const response = await fetch(`/api/coupang/search?q=${encodeURIComponent(keyword)}`);
    if (!response.ok) return;
    const { products = [] } = await response.json();
    if (!products.length) return;

    const list = document.createElement('div');
    list.className = 'coupang-product-list';
    list.setAttribute('aria-label', `${keyword} 추천 상품`);
    list.innerHTML = products.slice(0, 3).map((product) => `
      <a class="coupang-product" href="${product.url}" target="_blank" rel="sponsored noopener">
        <img src="${product.image}" width="180" height="180" loading="lazy" alt="">
        <span><strong>${product.name}</strong><b>${formatWon.format(product.price)}원</b>${product.rocket ? '<small>로켓배송</small>' : ''}</span>
      </a>`).join('');
    fallbackLink.insertAdjacentElement('afterend', list);
    fallbackLink.textContent = '쿠팡에서 더 보기 →';
  } catch (_) {
    // API를 사용할 수 없을 때 기존 검색 링크를 그대로 유지합니다.
  }
});
