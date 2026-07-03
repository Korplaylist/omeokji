import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const indexPath = path.join(root, 'public', 'index.html');
const cssPath = path.join(root, 'public', 'styles.css');
const index = fs.readFileSync(indexPath, 'utf8');
const css = fs.readFileSync(cssPath, 'utf8').trim();
const start = '    <style data-home-inline>';
const end = '    </style>';
const startAt = index.indexOf(start);
const endAt = index.indexOf(end, startAt);

if (startAt < 0 || endAt < 0) throw new Error('홈 인라인 CSS 영역을 찾을 수 없습니다.');

const next = `${index.slice(0, startAt)}${start}\n${css}\n${index.slice(endAt)}`;
fs.writeFileSync(indexPath, next, 'utf8');
console.log(`홈 CSS ${Buffer.byteLength(css)}바이트를 인라인으로 동기화했습니다.`);
