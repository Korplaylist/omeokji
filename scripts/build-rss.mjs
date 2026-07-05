import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const articleDirectory = path.join(root, 'public', 'articles');
const syncScript = fs.readFileSync(path.join(root, 'scripts', 'sync-seo-recipes.mjs'), 'utf8');
const publishedArticleFiles = [...syncScript.matchAll(/'([^']+)':\s*'[^']+'/g)]
  .map((match) => `${match[1]}.html`)
  .filter((file) => fs.existsSync(path.join(articleDirectory, file)));
const escapeXml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

const items = publishedArticleFiles
  .map((file) => {
    const html = fs.readFileSync(path.join(articleDirectory, file), 'utf8');
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.replace(/\s*\|\s*오먹지$/, '') || file;
    const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] || '';
    const url = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || '';
    const published = html.match(/"datePublished":"(\d{4}-\d{2}-\d{2})"/)?.[1] || '2026-07-03';
    return { title, description, url, published };
  })
  .filter((item) => item.url.startsWith('https://omeokji.com/recipes/'))
  .sort((a, b) => b.published.localeCompare(a.published) || a.title.localeCompare(b.title, 'ko'));

const itemXml = items.map((item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.url)}</link>
      <guid isPermaLink="true">${escapeXml(item.url)}</guid>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${new Date(`${item.published}T00:00:00+09:00`).toUTCString()}</pubDate>
    </item>`).join('\n');

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>오먹지 레시피</title>
    <link>https://omeokji.com/</link>
    <description>오늘 뭐 먹지 고민을 덜어주는 간단 요리와 남은 재료 활용 레시피</description>
    <language>ko-KR</language>
    <atom:link href="https://omeokji.com/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemXml}
  </channel>
</rss>
`;

fs.writeFileSync(path.join(root, 'public', 'rss.xml'), rss, 'utf8');
console.log(`RSS 레시피 ${items.length}개를 생성했습니다.`);
