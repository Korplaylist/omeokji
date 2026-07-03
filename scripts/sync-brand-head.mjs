import fs from 'node:fs';
import path from 'node:path';

const root = path.join(process.cwd(),'public');
const brandHead = '<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="manifest" href="/site.webmanifest"><meta name="application-name" content="오먹지">';
const files=[];
function visit(directory){
  for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
    const full=path.join(directory,entry.name);
    if(entry.isDirectory()) visit(full);
    else if(entry.name.endsWith('.html')) files.push(full);
  }
}
visit(root);
for(const file of files){
  let html=fs.readFileSync(file,'utf8');
  if(html.includes('href="/favicon.svg"')) continue;
  const viewport=/<meta name="viewport"[^>]*>/;
  html=viewport.test(html)?html.replace(viewport,match=>`${match}${brandHead}`):html.replace('<head>',`<head>${brandHead}`);
  fs.writeFileSync(file,html,'utf8');
}
console.log(`브랜드 헤드 동기화: HTML ${files.length}개`);
