import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const failures = [];

const fail = (message) => failures.push(message);
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));

if (!exists('CONTENT_GUIDE.md')) fail('CONTENT_GUIDE.md가 없습니다.');
if (!exists('.automation/omeokji-daily-content-state.json')) fail('.automation/omeokji-daily-content-state.json이 없습니다.');

try {
  const statePath = path.join(root, '.automation', 'omeokji-daily-content-state.json');
  if (fs.existsSync(statePath)) {
    const stateRaw = fs.readFileSync(statePath, 'utf8').replace(/^\uFEFF/, '');
    const state = JSON.parse(stateRaw);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(state.date || ''))) fail('자동 발행 상태 date 형식이 올바르지 않습니다.');
    if (![3, 4, 5].includes(Number(state.todayTarget))) fail('todayTarget은 3, 4, 5 중 하나여야 합니다.');
    if (!Array.isArray(state.selectedSlots)) fail('selectedSlots는 배열이어야 합니다.');
    if (!Array.isArray(state.published)) fail('published는 배열이어야 합니다.');
  }
} catch (error) {
  fail(`자동 발행 상태 JSON을 읽을 수 없습니다: ${error.message}`);
}

let gitStatus = '';
try {
  gitStatus = execFileSync('git', ['status', '--short'], { cwd: root, encoding: 'utf8' }).trim();
} catch (error) {
  fail(`git status 확인 실패: ${error.message}`);
}

if (gitStatus) {
  const allowedUntracked = [
    '?? .codex-remote-attachments/',
    '?? tmp/',
  ];
  const unexpected = gitStatus
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line) => !allowedUntracked.some((prefix) => line.startsWith(prefix)));

  if (unexpected.length) {
    fail(`예상하지 못한 Git 변경이 있습니다. 자동 발행을 중단해야 합니다: ${unexpected.join(' | ')}`);
  }
}

const guide = exists('CONTENT_GUIDE.md') ? fs.readFileSync(path.join(root, 'CONTENT_GUIDE.md'), 'utf8') : '';
for (const required of [
  '이미지 생성 오염 방지 프로토콜',
  '음식 이미지 생성 전용 실행 규칙',
  '대표 사진',
  '기존 이미지',
]) {
  if (!guide.includes(required)) fail(`CONTENT_GUIDE.md 필수 규칙 누락: ${required}`);
}

if (failures.length) {
  console.error(`자동 발행 사전점검 실패 (${failures.length})`);
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}

console.log('자동 발행 사전점검 통과');
