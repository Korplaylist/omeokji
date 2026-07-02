const COUPANG_HOST = 'api-gateway.coupang.com';
const COUPANG_SEARCH_PATH = '/v2/providers/affiliate_open_api/apis/openapi/v1/products/search';

function json(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': status === 200 ? 'public, max-age=600' : 'no-store',
      'x-content-type-options': 'nosniff',
      ...extraHeaders
    }
  });
}

function signedDate(date = new Date()) {
  return date.toISOString().slice(2, 19).replace(/[-:]/g, '') + 'Z';
}

async function hmacHex(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return [...new Uint8Array(signature)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function searchCoupang(request, env) {
  if (!env.COUPANG_ACCESS_KEY || !env.COUPANG_SECRET_KEY) {
    return json({ error: '상품 API 설정을 확인하고 있습니다.' }, 503);
  }

  const inputUrl = new URL(request.url);
  const keyword = (inputUrl.searchParams.get('q') || '').trim().slice(0, 80);
  if (keyword.length < 2) return json({ error: '검색어를 두 글자 이상 입력해주세요.' }, 400);

  const cacheKey = new Request(`${inputUrl.origin}/api/coupang/search?q=${encodeURIComponent(keyword)}`);
  const cache = caches.default;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  const query = `keyword=${encodeURIComponent(keyword)}&limit=5`;
  const datetime = signedDate();
  const method = 'GET';
  const signature = await hmacHex(env.COUPANG_SECRET_KEY, datetime + method + COUPANG_SEARCH_PATH + query);
  const authorization = `CEA algorithm=HmacSHA256, access-key=${env.COUPANG_ACCESS_KEY}, signed-date=${datetime}, signature=${signature}`;

  const upstream = await fetch(`https://${COUPANG_HOST}${COUPANG_SEARCH_PATH}?${query}`, {
    headers: { Authorization: authorization, 'Content-Type': 'application/json' }
  });

  if (!upstream.ok) {
    console.error('Coupang API request failed', upstream.status);
    return json({ error: '현재 상품 정보를 불러오지 못했습니다.' }, 502);
  }

  const payload = await upstream.json();
  const products = (payload?.data?.productData || []).slice(0, 5).map((product) => ({
    id: String(product.productId || ''),
    name: String(product.productName || '').slice(0, 120),
    price: Number(product.productPrice || 0),
    image: String(product.productImage || ''),
    url: String(product.productUrl || ''),
    rocket: Boolean(product.isRocket),
    freeShipping: Boolean(product.isFreeShipping)
  })).filter((product) => product.name && product.url.startsWith('http'));

  const response = json({ keyword, products }, 200, { 'cache-control': 'public, max-age=1800' });
  if (products.length) await cache.put(cacheKey, response.clone());
  return response;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/coupang/search' && request.method === 'GET') {
      return searchCoupang(request, env);
    }
    return env.ASSETS.fetch(request);
  }
};
