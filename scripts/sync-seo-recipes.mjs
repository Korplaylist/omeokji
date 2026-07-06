import fs from 'node:fs';
import path from 'node:path';

const recipePaths = {
  'crispy-kimchi-jeon': 'crispy-kimchi-pancake',
  'dakgalbi-fried-rice': 'cheese-dakgalbi-fried-rice',
  'eggplant-rice-bowl': 'eggplant-rice-bowl',
  'zucchini-stir-fry': 'zucchini-stir-fry',
  'tofu-kongguksu': 'quick-tofu-kongguksu',
  'tomato-egg-stir-fry': 'tomato-egg-stir-fry',
  'potato-stir-fry': 'potato-stir-fry',
  'spicy-cucumber-salad': 'spicy-cucumber-salad',
  'seasoned-mung-bean-sprouts': 'seasoned-mung-bean-sprouts',
  'egg-fried-rice': 'easy-egg-fried-rice',
  'frozen-dumpling-hotpot': 'spicy-frozen-dumpling-hotpot',
  'kimchi-fried-rice': 'kimchi-fried-rice-recipe',
  'leftover-bread': 'leftover-bread-recipes',
  'leftover-chicken': 'leftover-chicken-recipes',
  'leftover-gimbap': 'leftover-gimbap-recipes',
  'leftover-jokbal': 'leftover-jokbal-recipes',
  'leftover-pork-belly-rice': 'leftover-pork-belly-rice-bowl',
  'miyeok-oi-naengguk': 'seaweed-cucumber-cold-soup',
  'microwave-corn-cheese': 'microwave-corn-cheese',
  'night-bibim-guksu': 'spicy-bibim-guksu',
  'potato-jjageuli': 'spam-potato-jjageuli',
  'simple-fishcake-soup': 'korean-fish-cake-soup',
  'sundubu-egg-soup': 'sundubu-egg-soup',
  'tofu-egg-pancake': 'tofu-egg-pancake',
  'tofu-kimchi': 'tofu-kimchi-recipe',
  'tteokbokki': 'korean-tteokbokki',
  'tuna-mayo-rice': 'tuna-mayo-rice-bowl',
  'vegetable-curry': 'leftover-vegetable-curry'
};

const root = process.cwd();
const destination = path.join(root, 'public', 'recipes');
fs.mkdirSync(destination, { recursive: true });

for (const [legacy, seo] of Object.entries(recipePaths)) {
  const source = path.join(root, 'public', 'articles', `${legacy}.html`);
  fs.copyFileSync(source, path.join(destination, `${seo}.html`));
}

console.log(`영문 SEO 레시피 ${Object.keys(recipePaths).length}개를 동기화했습니다.`);
