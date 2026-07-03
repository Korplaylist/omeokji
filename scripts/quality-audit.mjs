import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');
const failures = [];
const assert = (condition, message) => {
  if (!condition) failures.push(message);
};

const index = read('public/index.html');
const app = read('public/app.js');

assert(index.includes('rel="preload" href="/styles.css?v=20260703-responsive" as="style"'), '홈 CSS preload가 없습니다.');
assert(index.includes('media="print" onload="this.media=\'all\'"'), '홈 CSS가 비차단 방식이 아닙니다.');
assert(index.includes('<ul class="recipe-grid"'), '레시피 목록은 ul 요소여야 합니다.');
assert(!index.includes('role="listitem"'), '허용되지 않은 명시적 listitem 역할이 남아 있습니다.');
assert(app.includes('return `<li class="recipe-card"'), '레시피 카드는 li 요소여야 합니다.');
assert(app.includes('src="${smallImage}" width="320" height="214"'), '레시피 카드는 320px 이미지를 직접 전송해야 합니다.');
assert(!app.includes('srcset="${smallImage} 320w, ${menu.image} 640w"'), '레시피 카드에 과도한 640px 후보가 남아 있습니다.');
assert(!/clientWidth|scrollWidth|offsetWidth|offsetHeight|getBoundingClientRect/.test(app), '캐러셀 코드에 강제 리플로우를 유발하는 기하 측정이 있습니다.');
assert(app.includes('alt="${menu.title} 완성 모습"'), '레시피 카드 이미지에 설명형 대체텍스트가 필요합니다.');

const menuImages = [...app.matchAll(/image:\s*'([^']+-640\.webp)'/g)].map((match) => match[1]);
assert(menuImages.length >= 25, `메뉴 이미지가 부족합니다: ${menuImages.length}`);

for (const image of menuImages) {
  const large = path.join(root, 'public', image.replace(/^\//, ''));
  const small = large.replace('-640.webp', '-320.webp');
  assert(fs.existsSync(large), `640px 이미지 누락: ${image}`);
  assert(fs.existsSync(small), `320px 이미지 누락: ${image.replace('-640.webp', '-320.webp')}`);
  if (fs.existsSync(small)) {
    assert(fs.statSync(small).size <= 20 * 1024, `320px 이미지가 20KiB를 초과합니다: ${small}`);
  }
}

const homeLargeImages = [...index.matchAll(/\/images\/[^" ]+-home-640\.webp/g)].map((match) => match[0]);
assert(homeLargeImages.length === 4, `홈 활용백서 압축 이미지가 4개여야 합니다: ${homeLargeImages.length}`);
for (const image of homeLargeImages) {
  const file = path.join(root, 'public', image.replace(/^\//, ''));
  assert(fs.existsSync(file), `홈 활용백서 압축 이미지 누락: ${image}`);
  if (fs.existsSync(file)) assert(fs.statSync(file).size <= 22 * 1024, `홈 활용백서 이미지가 22KiB를 초과합니다: ${image}`);
}

if (failures.length) {
  console.error(`품질 검사 실패 (${failures.length})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`품질 검사 통과: 메뉴 ${menuImages.length}개, 반응형 이미지·CSS·목록 접근성 정상`);
