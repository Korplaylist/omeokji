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
const styles = read('public/styles.css').trim();

assert(index.includes(`<style data-home-inline>\n${styles}\n    </style>`), '홈 인라인 CSS가 styles.css와 동기화되지 않았습니다. npm run sync:home-css를 실행하세요.');
assert(!index.includes('href="/styles.css'), '홈에서 외부 CSS를 후적용하면 레이아웃 재계산이 발생할 수 있습니다.');
assert(index.includes('<ul class="recipe-grid"'), '레시피 목록은 ul 요소여야 합니다.');
assert(!index.includes('role="listitem"'), '허용되지 않은 명시적 listitem 역할이 남아 있습니다.');
assert(app.includes('return `<li class="recipe-card"'), '레시피 카드는 li 요소여야 합니다.');
assert(app.includes('<picture><source media="(min-width:681px)" srcset="${compactImage}"'), 'PC 레시피 카드는 220px 전용 picture 소스를 제공해야 합니다.');
assert(app.includes('<img src="${smallImage}" width="320" height="214"'), '모바일 레시피 카드는 320px 이미지를 제공해야 합니다.');
assert(!app.includes('srcset="${smallImage} 320w, ${menu.image} 640w"'), '레시피 카드에 과도한 640px 후보가 남아 있습니다.');
assert(!/clientWidth|scrollWidth|offsetWidth|offsetHeight|getBoundingClientRect/.test(app), '캐러셀 코드에 강제 리플로우를 유발하는 기하 측정이 있습니다.');
assert(app.includes('alt="${menu.title} 완성 모습"'), '레시피 카드 이미지에 설명형 대체텍스트가 필요합니다.');

const menuImages = [...app.matchAll(/image:\s*'([^']+-640\.webp)'/g)].map((match) => match[1]);
assert(menuImages.length >= 25, `메뉴 이미지가 부족합니다: ${menuImages.length}`);

for (const image of menuImages) {
  const large = path.join(root, 'public', image.replace(/^\//, ''));
  const small = large.replace('-640.webp', '-320.webp');
  const compact = large.replace('-640.webp', '-220.webp');
  assert(fs.existsSync(large), `640px 이미지 누락: ${image}`);
  assert(fs.existsSync(small), `320px 이미지 누락: ${image.replace('-640.webp', '-320.webp')}`);
  assert(fs.existsSync(compact), `220px 이미지 누락: ${image.replace('-640.webp', '-220.webp')}`);
  if (fs.existsSync(small)) {
    assert(fs.statSync(small).size <= 20 * 1024, `320px 이미지가 20KiB를 초과합니다: ${small}`);
  }
  if (fs.existsSync(compact)) {
    assert(fs.statSync(compact).size <= 10 * 1024, `220px 이미지가 10KiB를 초과합니다: ${compact}`);
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
