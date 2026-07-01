# 오먹지

SEO 콘텐츠, 바이럴 메뉴 테스트, 커머스 전환을 한 흐름으로 연결한 요리 콘텐츠 MVP입니다.

## 로컬 실행

```powershell
pnpm install
pnpm dev
```

또는 별도 설치 없이 `public` 폴더를 정적 서버로 열어 확인할 수 있습니다.

## Cloudflare 배포

```powershell
pnpm install
pnpm deploy
```

배포 전에 다음 항목을 실제 운영값으로 교체하세요.

- `public/index.html`과 아티클의 canonical URL을 실제 도메인의 절대 URL로 변경
- Open Graph 이미지 URL을 실제 도메인의 절대 URL로 변경
- 쿠팡 검색 URL을 승인받은 파트너스 딥링크로 변경
- 카카오 JavaScript SDK를 연결해 카카오톡 전용 공유 버튼 추가
- Search Console과 네이버 서치어드바이저 등록 후 사이트맵 제출

## 구조

- `public/index.html`: 홈, 레시피 탐색, 1분 메뉴 테스트
- `public/articles/leftover-chicken.html`: 첫 롱테일 SEO 콘텐츠
- `public/app.js`: 검색, 필터, 퀴즈, Web Share API
- `wrangler.toml`: Cloudflare Workers Static Assets 설정
