import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = process.cwd();
const failures = [];
const fail = (message) => failures.push(message);
const resolveRoot = (relativePath) => path.join(root, relativePath);
const exists = (relativePath) => fs.existsSync(resolveRoot(relativePath));

const readUtf8 = (relativePath) => fs.readFileSync(resolveRoot(relativePath), 'utf8').replace(/^\uFEFF/, '');

if (!exists('CONTENT_GUIDE.md')) fail('CONTENT_GUIDE.md가 없습니다.');
if (!exists('public')) fail('public 디렉터리가 없습니다.');
if (!exists('scripts/quality-audit.mjs')) fail('품질 검사 스크립트가 없습니다.');

if (exists('CONTENT_GUIDE.md')) {
  const guide = readUtf8('CONTENT_GUIDE.md');
  for (const required of [
    '수동 발행 안정화 규칙',
    '클린 이미지 세션 필요',
    '대표 이미지가 음식 사진으로 통과하지 못하면',
    '텍스트만 먼저 발행',
  ]) {
    if (!guide.includes(required)) fail(`CONTENT_GUIDE.md 수동 발행 규칙 누락: ${required}`);
  }
}

const failedDraftsPath = resolveRoot('.automation/failed-drafts');
if (fs.existsSync(failedDraftsPath)) {
  const failedDrafts = fs
    .readdirSync(failedDraftsPath, { withFileTypes: true })
    .filter((entry) => entry.name !== '.gitkeep');
  if (failedDrafts.length) {
    fail(`실패 초안이 남아 있습니다. 발행 전 정리 필요: ${failedDrafts.map((entry) => entry.name).join(', ')}`);
  }
}

for (const tempPath of ['tmp/manual-publish', 'tmp/imagegen', 'tmp/omeokji-draft']) {
  if (exists(tempPath)) fail(`임시 발행 산출물이 남아 있습니다: ${tempPath}`);
}

let gitStatus = '';
try {
  gitStatus = execFileSync('git', ['status', '--short'], { cwd: root, encoding: 'utf8' }).trim();
} catch (error) {
  fail(`git status 확인 실패: ${error.message}`);
}

if (gitStatus) {
  const allowedPrefixes = new Set([
    'M CONTENT_GUIDE.md',
    'M package.json',
    '?? scripts/manual-publish-preflight.mjs',
  ]);
  const allowedDirectoryPrefixes = ['?? .codex-remote-attachments/', '?? tmp/'];
  const unexpected = gitStatus
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => line.trimStart())
    .filter((line) => !allowedPrefixes.has(line))
    .filter((line) => !allowedDirectoryPrefixes.some((prefix) => line.startsWith(prefix)));

  if (unexpected.length) {
    fail(`예상하지 못한 Git 변경이 있습니다. 수동 발행 전 정리 필요: ${unexpected.join(' | ')}`);
  }
}

if (exists('.automation/omeokji-daily-content-state.json')) {
  try {
    const state = JSON.parse(readUtf8('.automation/omeokji-daily-content-state.json'));
    if (!Array.isArray(state.published)) fail('자동 발행 상태의 published가 배열이 아닙니다.');
  } catch (error) {
    fail(`자동 발행 상태 JSON을 읽을 수 없습니다: ${error.message}`);
  }
}

if (failures.length) {
  console.error(`수동 발행 사전점검 실패 (${failures.length})`);
  for (const item of failures) console.error(`- ${item}`);
  process.exit(1);
}

console.log('수동 발행 사전점검 통과');
