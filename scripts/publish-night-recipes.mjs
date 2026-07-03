import fs from 'node:fs';
import path from 'node:path';

const recipes = [
  {
    slug:'night-bibim-guksu', menuTitle:'10분 비빔국수', title:'비빔국수 양념장 황금비율｜소면 100g으로 10분 야식', description:'고추장·식초·설탕 비율이 정확한 1인분 비빔국수 레시피. 소면 삶는 시간과 찬물에 씻는 방법까지 단계별 사진으로 설명합니다.', time:10, category:'국수', cuisine:'한식', eyebrow:'10-MINUTE NOODLES', tags:['비빔국수','양념장','10분','야식','매콤'],
    ingredients:[['소면','100g'],['잘 익은 김치','50g'],['오이','30g'],['삶은 달걀','½개'],['고추장','1큰술'],['식초','1큰술'],['설탕','2작은술'],['간장·참기름','각 1작은술'],['통깨','½작은술']],
    intro:'비빔국수는 양념보다 면의 물기를 얼마나 제거했는지가 맛을 좌우합니다. 소면 100g 기준 고추장 1큰술, 식초 1큰술, 설탕 2작은술을 먼저 섞고 면은 찬물에서 전분기가 사라질 때까지 씻으세요.',
    steps:[['양념장을 먼저 2분 숙성합니다.','고추장·식초 각 1큰술, 설탕 2작은술, 간장·참기름 각 1작은술과 통깨를 섞습니다. 설탕 알갱이가 거의 보이지 않을 때까지 저어 두면 매운맛과 신맛이 고르게 섞입니다.','고추장 양념장을 작은 유리 볼에서 섞는 모습'],['소면을 3분 30초 삶습니다.','물 1L가 세게 끓으면 소면을 부채꼴로 펼쳐 넣습니다. 거품이 넘치려 할 때 찬물 ½컵을 두 번 나누어 붓고, 면 중심에 흰 심이 보이지 않으면 바로 건집니다.','삶은 소면을 찬물에 씻는 모습'],['찬물에 비벼 씻고 물기를 뺍니다.','면을 찬물에서 두 손으로 30초 비벼 씻어 표면 전분을 제거합니다. 체를 세 번 힘껏 털고 1분 두어 물방울이 떨어지지 않는 상태를 만듭니다.','찬물에 헹군 소면의 물기를 빼는 모습'],['양념과 면을 30초 버무립니다.','큰 볼에 면과 양념, 잘게 썬 김치를 넣고 아래에서 위로 가볍게 들어 올리며 섞습니다. 오이와 삶은 달걀은 마지막에 올려 수분이 생기지 않게 합니다.','오이와 달걀을 올린 비빔국수 완성 모습']],
    tip:'면의 물기가 남으면 양념이 묽어지고 싱거워집니다. 양념을 더 넣기 전에 체에 밭쳐 1분 더 물기를 빼세요.', affiliate:'소면 고추장 비빔국수 재료', affiliateCopy:'소면과 고추장, 참기름 등 비빔국수 기본 재료를 확인해보세요.',
    extras:[['대체 재료','김치가 없으면 채 썬 양배추 50g을 소금 한 꼬집에 5분 절여 사용하세요. 매실청을 쓸 때는 설탕을 1작은술로 줄입니다.'],['보관과 준비','양념장은 밀폐 냉장해 3일까지 사용할 수 있습니다. 삶은 면은 불기 쉬우므로 먹기 직전에 삶아 버무리세요.'],['실패 해결','너무 시면 설탕 ½작은술, 너무 달면 식초 ½작은술을 추가합니다. 맵다면 오이 20g이나 삶은 달걀을 더하세요.'],['익힘 기준','면을 끊어 보았을 때 가운데 흰 심이 없고 눌렀을 때 탄력이 남아 있으면 알맞게 익은 상태입니다.']],
    faq:[['양념장만 미리 만들어도 되나요?','네. 밀폐 용기에 담아 냉장하면 3일까지 사용할 수 있습니다. 참기름은 먹기 직전에 넣으면 향이 더 선명합니다.'],['면이 서로 달라붙는 이유는 무엇인가요?','삶은 뒤 전분을 충분히 씻지 않았거나 물기를 뺀 채 오래 두었기 때문입니다. 찬물에 비벼 씻은 뒤 바로 양념과 섞으세요.'],['야식으로 덜 부담스럽게 먹으려면 어떻게 하나요?','소면을 80g으로 줄이고 오이와 양배추를 합쳐 80g 넣으면 씹는 양은 유지하면서 면의 양을 줄일 수 있습니다.']]
  },
  {
    slug:'microwave-corn-cheese', menuTitle:'5분 전자레인지 콘치즈', title:'전자레인지 콘치즈 레시피｜캔옥수수 200g으로 5분 완성', description:'캔옥수수 200g과 모차렐라 치즈로 만드는 전자레인지 콘치즈. 물기 제거와 가열 시간을 정확히 알려드립니다.', time:5, category:'간식', cuisine:'한식', eyebrow:'5-MINUTE CORN CHEESE', tags:['콘치즈','전자레인지','5분','야식','간단'],
    ingredients:[['캔옥수수','200g(물기 제거 후)'],['모차렐라 치즈','100g'],['마요네즈','1½큰술'],['설탕','1작은술'],['버터','5g'],['후추·파슬리','약간']],
    intro:'콘치즈가 물처럼 흥건해지는 가장 큰 원인은 옥수수 통조림의 물기입니다. 체에서 2분 충분히 빼고 키친타월로 한 번 눌러야 마요네즈와 치즈가 옥수수에 고르게 붙습니다.',
    steps:[['옥수수 물기를 2분 뺍니다.','캔옥수수를 체에 붓고 숟가락으로 가볍게 눌러 물기를 제거합니다. 키친타월 위에 펼쳐 표면에 맺힌 물방울까지 닦아주세요.','체에 밭쳐 물기를 빼는 캔옥수수'],['마요네즈 양념을 섞습니다.','전자레인지용 넓은 그릇에 옥수수, 마요네즈 1½큰술, 설탕 1작은술, 후추를 넣고 20회 섞습니다. 가운데에 버터 5g을 올립니다.','마요네즈와 버터를 섞은 옥수수'],['치즈를 가장자리까지 덮습니다.','모차렐라 100g을 가운데만 쌓지 말고 옥수수가 보이지 않도록 얇고 고르게 펼칩니다. 그래야 가장자리 옥수수도 마르지 않습니다.','옥수수 위에 모차렐라 치즈를 고르게 올린 모습'],['전자레인지에서 2분 30초 가열합니다.','700W 기준 2분 가열한 뒤 상태를 확인하고 30초 추가합니다. 치즈 전체가 녹아 작은 기포가 올라오면 멈추고 파슬리를 뿌립니다.','치즈가 녹아 촉촉한 콘치즈 완성 모습']],
    tip:'밀폐 뚜껑을 덮으면 수증기가 빠지지 않아 묽어집니다. 뚜껑 없이 가열하고, 차가운 옥수수라면 20초만 추가하세요.', affiliate:'캔옥수수 모차렐라 콘치즈 재료', affiliateCopy:'캔옥수수와 모차렐라 치즈 등 간단한 콘치즈 재료를 확인해보세요.',
    extras:[['대체 재료','모차렐라 대신 체더 슬라이스 2장을 잘게 찢어 사용할 수 있습니다. 마요네즈를 줄이면 우유 1큰술을 더하세요.'],['보관과 재가열','완성 후 바로 먹는 것이 가장 좋습니다. 남으면 2시간 안에 냉장하고 다음 날 40초씩 나누어 재가열하세요.'],['실패 해결','물이 생겼다면 키친타월 끝을 그릇 가장자리에 대어 조심히 흡수하고 치즈 20g을 더해 20초 가열합니다.'],['가열 기준','치즈의 형태가 사라지고 가장자리에서 작은 기포가 올라오면 완성입니다. 갈색 표면은 전자레인지로 만들기 어렵습니다.']],
    faq:[['전자레인지 출력이 1000W라면 몇 분인가요?','먼저 1분 30초 가열한 뒤 20초씩 추가하세요. 치즈가 완전히 녹으면 즉시 멈춥니다.'],['냉동 옥수수도 사용할 수 있나요?','해동 후 물기를 완전히 제거하면 가능합니다. 냉동 상태로 넣으면 수분이 많이 생기므로 권하지 않습니다.'],['콘치즈가 너무 느끼하면 어떻게 하나요?','마요네즈를 1큰술로 줄이고 다진 청양고추 ½개나 후추를 조금 더 넣으면 맛이 깔끔해집니다.']]
  },
  {
    slug:'sundubu-egg-soup', menuTitle:'속 편한 순두부 계란탕', title:'순두부 계란탕 끓이는 법｜속 편한 10분 야식', description:'순두부 1봉과 달걀 1개로 끓이는 맑은 순두부 계란탕. 국물이 탁해지지 않는 달걀 붓는 법까지 단계별로 알려드립니다.', time:10, category:'국·탕', cuisine:'한식', eyebrow:'GENTLE LATE-NIGHT SOUP', tags:['순두부계란탕','순두부요리','10분','야식','가벼운'],
    ingredients:[['순두부','1봉(350g)'],['달걀','1개'],['멸치다시마 육수','450ml'],['대파','15g'],['다진 마늘','½작은술'],['참치액 또는 국간장','1작은술'],['소금·후추','약간']],
    intro:'순두부 계란탕은 센 불로 오래 끓이지 않는 것이 핵심입니다. 순두부는 숟가락으로 크게 떠 넣고, 달걀물은 국물이 잔잔히 끓을 때 가늘게 부어야 부드러운 계란 실이 생깁니다.',
    steps:[['육수에 마늘을 넣고 3분 끓입니다.','냄비에 멸치다시마 육수 450ml와 다진 마늘 ½작은술을 넣습니다. 중불에서 가장자리부터 기포가 올라올 때까지 끓입니다.','맑은 육수에 다진 마늘을 넣어 끓이는 모습'],['순두부를 크게 떠 넣습니다.','순두부 봉지의 물을 버리고 숟가락으로 4cm 크기로 떠 넣습니다. 저으면 부서지므로 냄비 손잡이를 가볍게 흔들어 자리를 잡습니다.','육수에 순두부를 큰 덩어리로 넣는 모습'],['달걀물을 가늘게 붓습니다.','달걀 1개를 흰자와 노른자가 섞일 정도로만 풉니다. 국물이 잔잔히 끓을 때 원을 그리며 가늘게 붓고 20초 동안 젓지 않습니다.','순두부탕에 달걀물을 가늘게 붓는 모습'],['대파를 넣고 30초 마무리합니다.','참치액 1작은술과 소금으로 간하고 송송 썬 대파를 넣습니다. 달걀이 부드럽게 굳으면 불을 끄고 후추를 한 꼬집 뿌립니다.','대파를 올린 맑은 순두부 계란탕 완성 모습']],
    tip:'달걀을 붓자마자 저으면 국물이 탁해집니다. 20초 기다린 뒤 한 번만 크게 저어 계란 실을 살리세요.', affiliate:'순두부 달걀 계란탕 재료', affiliateCopy:'순두부와 달걀, 육수 재료를 한 번에 확인해보세요.',
    extras:[['대체 재료','멸치육수 대신 물 450ml와 코인육수 1개를 사용할 수 있습니다. 참치액이 없으면 국간장 1작은술로 간합니다.'],['보관과 재가열','순두부는 수분이 많아 완성 당일 먹는 것이 좋습니다. 남으면 2시간 안에 냉장하고 다음 날 한 번만 끓여 드세요.'],['실패 해결','국물이 짜면 물 50ml를 더하고 순두부가 너무 부서졌다면 젓지 말고 약불에서 1분 두어 가라앉힙니다.'],['익힘 기준','달걀의 투명한 흰자가 보이지 않고 순두부 중심까지 따뜻해졌다면 완성입니다. 센 불로 팔팔 끓일 필요는 없습니다.']],
    faq:[['맹물로 끓여도 되나요?','가능하지만 감칠맛이 약합니다. 물 450ml에 국간장 1작은술과 소금 한 꼬집을 넣고 대파를 조금 늘리세요.'],['매콤하게 만들려면 무엇을 넣나요?','고춧가루 ½작은술을 육수 단계에 넣거나 청양고추 ½개를 대파와 함께 넣으세요.'],['순두부 계란탕은 얼마나 보관할 수 있나요?','가급적 만든 날 드세요. 남은 음식은 2시간 안에 냉장하고 다음 날 중심까지 한 번만 충분히 끓입니다.']]
  },
  {
    slug:'crispy-kimchi-jeon', menuTitle:'바삭 김치전', title:'김치전 바삭하게 만드는 법｜부침가루 없이 실패 없는 비율', description:'신김치 150g과 밀가루 70g으로 만드는 바삭한 김치전. 얼음물 비율과 뒤집는 타이밍을 단계별 사진으로 알려드립니다.', time:15, category:'전', cuisine:'한식', eyebrow:'CRISPY KIMCHI PANCAKE', tags:['김치전','바삭한김치전','15분','야식','간단'],
    ingredients:[['신김치','150g'],['밀가루','70g'],['얼음물','90ml'],['김칫국물','2큰술'],['대파','20g'],['설탕','½작은술'],['식용유','3큰술']],
    intro:'바삭한 김치전은 반죽을 되직하게 만들기보다 차갑고 묽게 만들어 얇게 펴는 편이 좋습니다. 밀가루 70g에 얼음물 90ml를 넣고 날가루가 조금 남을 정도로만 섞으세요.',
    steps:[['김치를 1cm로 잘라 계량합니다.','신김치 150g의 속을 가볍게 털고 가위로 1cm 폭으로 자릅니다. 김칫국물 2큰술은 따로 계량해 색과 간을 맞춥니다.','신김치와 밀가루 얼음물을 계량한 모습'],['반죽을 15회만 섞습니다.','밀가루 70g과 얼음물 90ml를 젓가락으로 10회 섞고 김치·대파·김칫국물을 넣어 5회 더 섞습니다. 작은 덩어리가 남아야 질겨지지 않습니다.','김치와 얼음물을 가볍게 섞은 반죽'],['기름을 두르고 3mm 두께로 폅니다.','중강불로 팬을 1분 예열하고 식용유 2큰술을 두릅니다. 반죽을 붓고 국자로 누르지 말고 바깥쪽으로 밀어 3mm 두께로 얇게 폅니다.','기름 두른 팬에 김치전 반죽을 얇게 편 모습'],['가장자리가 갈색일 때 뒤집습니다.','3분간 건드리지 않고 익혀 가장자리 1cm가 진한 갈색이 되면 뒤집습니다. 남은 기름 1큰술을 가장자리에 둘러 2분 더 익힙니다.','가장자리가 바삭한 김치전 완성 모습']],
    tip:'반죽을 오래 섞거나 팬이 덜 달궈진 상태에서 부치면 눅눅해집니다. 차가운 반죽을 충분히 예열한 팬에 얇게 펴세요.', affiliate:'신김치 밀가루 김치전 재료', affiliateCopy:'김치전용 신김치와 밀가루, 식용유 등 필요한 재료를 확인해보세요.',
    extras:[['대체 재료','밀가루 50g과 전분 20g을 섞으면 가장자리가 더 가볍게 바삭해집니다. 대파 대신 부추 30g도 잘 어울립니다.'],['보관과 재가열','남은 전은 한 장씩 종이호일 사이에 두고 냉장해 다음 날까지 드세요. 기름 없는 팬에서 앞뒤로 2분씩 데웁니다.'],['실패 해결','반죽이 두꺼우면 가운데를 찢어 두 조각으로 나누어 다시 눌러 익히세요. 기름이 부족하면 가장자리에 1작은술씩 보충합니다.'],['익힘 기준','가장자리가 팬에서 저절로 떨어지고 바닥 전체가 진한 주황빛 갈색이면 뒤집을 시점입니다.']],
    faq:[['부침가루 없이도 간이 맞나요?','신김치와 김칫국물에 염분이 있어 별도 소금은 필요하지 않습니다. 김치가 싱거우면 간장 ½작은술을 더하세요.'],['김치전이 팬에 달라붙는 이유는 무엇인가요?','팬 예열이 부족하거나 너무 일찍 뒤집었기 때문입니다. 중강불에서 1분 예열하고 가장자리가 갈색이 될 때까지 건드리지 마세요.'],['에어프라이어로 다시 바삭하게 데울 수 있나요?','180℃로 예열한 뒤 4분, 뒤집어 2분 데우세요. 겹치지 않게 한 장씩 넣어야 합니다.']]
  },
  {
    slug:'simple-fishcake-soup', menuTitle:'15분 포장마차 어묵탕', title:'어묵탕 끓이는 법｜멸치육수로 15분 포장마차 맛', description:'사각어묵 200g과 멸치다시마 육수로 끓이는 간단 어묵탕. 어묵 꼬치 접는 법과 국물 간을 정확히 알려드립니다.', time:15, category:'국·탕', cuisine:'한식', eyebrow:'STREET-STYLE FISH CAKE SOUP', tags:['어묵탕','오뎅탕','15분','야식','국물'],
    ingredients:[['사각어묵','200g'],['물','600ml'],['국물용 멸치','8마리'],['다시마','5×5cm 1장'],['무','80g'],['국간장','1큰술'],['다진 마늘','½작은술'],['대파·홍고추','각 15g·½개']],
    intro:'포장마차처럼 맑고 깊은 어묵탕은 어묵을 오래 끓이기보다 무가 익은 육수에 마지막 5분만 넣는 것이 핵심입니다. 다시마는 물이 끓기 전에 건져 쓴맛을 막으세요.',
    steps:[['멸치다시마 육수를 7분 냅니다.','냄비에 물 600ml, 내장을 뺀 멸치 8마리, 다시마 1장을 넣습니다. 중불에 올려 끓기 직전 다시마를 건지고 멸치는 5분 더 끓여 건집니다.','멸치와 다시마 무를 준비한 어묵탕 재료'],['무를 5분 먼저 끓입니다.','무 80g을 3mm 나박썰기해 육수에 넣습니다. 가장자리가 반투명해질 때까지 중불에서 5분 끓이고 국간장과 마늘을 넣습니다.','맑은 멸치육수에 무를 끓이는 모습'],['어묵을 접어 꼬치에 꽂습니다.','사각어묵을 세로로 세 번 접어 물결 모양으로 만들고 짧은 나무꼬치에 꽂습니다. 끓는 물을 한 번 끼얹어 표면 기름을 줄입니다.','사각어묵을 접어 꼬치에 끼운 모습'],['어묵을 넣고 5분 끓입니다.','육수에 어묵꼬치를 넣고 중약불에서 5분 끓입니다. 어묵이 부드럽게 부풀면 대파와 홍고추를 넣고 30초 뒤 불을 끕니다.','대파와 홍고추를 올린 어묵탕 완성 모습']],
    tip:'어묵을 10분 이상 세게 끓이면 지나치게 불고 국물이 탁해집니다. 무 육수를 먼저 완성한 뒤 어묵은 마지막 5분만 끓이세요.', affiliate:'사각어묵 멸치 다시마 어묵탕 재료', affiliateCopy:'사각어묵과 국물용 멸치, 다시마 등 어묵탕 재료를 확인해보세요.',
    extras:[['대체 재료','멸치다시마 대신 물 600ml와 코인육수 1개를 사용할 수 있습니다. 무가 없으면 양파 ½개를 넣으세요.'],['보관과 재가열','꼬치에서 어묵을 빼 국물과 함께 밀폐 냉장하고 다음 날까지 드세요. 약불에서 한 번만 끓여 재가열합니다.'],['실패 해결','국물이 짜면 뜨거운 물 100ml를 보충하고, 싱거우면 국간장을 ½작은술씩 추가합니다.'],['익힘 기준','무 가장자리가 투명하고 젓가락이 힘없이 들어가며 어묵이 원래 두께의 약 1.5배로 부풀면 완성입니다.']],
    faq:[['어묵을 꼭 데쳐야 하나요?','필수는 아니지만 끓는 물을 한 번 끼얹으면 표면 기름이 줄어 국물이 더 맑고 깔끔해집니다.'],['꼬치 없이 끓여도 되나요?','가능합니다. 사각어묵을 삼각형으로 잘라 넣으면 먹기 편하고 조리 시간도 같습니다.'],['남은 어묵탕은 얼마나 보관하나요?','2시간 안에 냉장해 다음 날까지 드세요. 어묵이 계속 불기 때문에 가급적 국물과 분리해 보관합니다.']]
  }
];

const base='https://omeokji.korplaylist-hong.workers.dev';
const esc=(value)=>String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

function render(recipe){
  const url=`${base}/articles/${recipe.slug}.html`;
  const image=`${base}/images/${recipe.slug}/04-finish-1080.webp`;
  const recipeIngredient=recipe.ingredients.map(([name,amount])=>`${name} ${amount}`);
  const instructions=recipe.steps.map(([name,text],index)=>({ '@type':'HowToStep', name, text, url:`${url}#step-${index+1}`, image:`${base}/images/${recipe.slug}/${String(index+1).padStart(2,'0')}-${index===3?'finish':'step'}-1080.webp` }));
  const schema={ '@context':'https://schema.org','@graph':[{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'홈',item:`${base}/`},{'@type':'ListItem',position:2,name:'레시피',item:`${base}/#recipes`},{'@type':'ListItem',position:3,name:recipe.menuTitle}]},{'@type':'Recipe','@id':`${url}#recipe`,url,name:recipe.menuTitle,description:recipe.description,image,author:{'@type':'Person','@id':`${base}/about.html#author`,name:'임채홍'},publisher:{'@id':`${base}/#organization`},datePublished:'2026-07-03',totalTime:`PT${recipe.time}M`,recipeYield:['1인분'],recipeCategory:recipe.category,recipeCuisine:recipe.cuisine,recipeIngredient,recipeInstructions:instructions}]};
  const faqSchema={'@context':'https://schema.org','@type':'FAQPage',mainEntity:recipe.faq.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))};
  const ingredients=recipe.ingredients.flatMap(([name,amount])=>[`<li>${esc(name)}</li>`,`<li>${esc(amount)}</li>`]).join('');
  const steps=recipe.steps.map(([name,text,alt],index)=>{const n=index+1;const file=`${String(n).padStart(2,'0')}-${index===3?'finish':'step'}`;return `<li id="step-${n}"><strong>${esc(name)}</strong>${esc(text)}<figure class="step-figure"><img src="/images/${recipe.slug}/${file}-640.webp" srcset="/images/${recipe.slug}/${file}-640.webp 640w,/images/${recipe.slug}/${file}-1080.webp 1080w" width="640" height="427" loading="lazy" alt="${esc(alt)}"><figcaption>ⓒ오먹지</figcaption></figure></li>`}).join('');
  const extras=recipe.extras.map(([title,text])=>`<article><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('');
  const faqs=recipe.faq.map(([q,a])=>`<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('');
  return `<!doctype html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(recipe.title)} | 오먹지</title><meta name="description" content="${esc(recipe.description)}"><link rel="canonical" href="${url}"><meta property="og:title" content="${esc(recipe.title)}"><meta property="og:description" content="${esc(recipe.description)}"><meta property="og:image" content="${image}"><meta property="og:type" content="article"><link rel="stylesheet" href="/styles.css?v=20260703"><link rel="stylesheet" href="/recipe-article.css?v=20260702"><script type="application/ld+json">${JSON.stringify(schema)}</script><script type="application/ld+json">${JSON.stringify(faqSchema)}</script></head><body class="article-page"><nav class="article-nav"><a class="brand" href="/"><span class="brand-mark">오</span><span>오먹지</span></a><a href="/#recipes">레시피 목록 →</a></nav><main><header class="article-hero"><p class="eyebrow">${recipe.eyebrow}</p><h1>${esc(recipe.title).replace('｜','<br>')}</h1><p class="lead">${esc(recipe.description)}</p><p class="article-meta">작성·검수 임채홍 · 2026. 07. 03 · 1인분 · 약 ${recipe.time}분</p></header><figure class="article-cover"><img src="/images/${recipe.slug}/04-finish-1080.webp" srcset="/images/${recipe.slug}/04-finish-640.webp 640w,/images/${recipe.slug}/04-finish-1080.webp 1080w" width="1080" height="720" alt="${esc(recipe.menuTitle)} 완성 모습"></figure><article class="article-body"><ul class="recipe-tags">${recipe.tags.map(tag=>`<li>#${esc(tag)}</li>`).join('')}</ul><p>${esc(recipe.intro)}</p><h2>재료와 정확한 용량</h2><section class="ingredient-panel"><figure><img src="/images/${recipe.slug}/00-ingredients-640.webp" width="640" height="427" alt="${esc(recipe.menuTitle)} 1인분 계량 재료"><figcaption>ⓒ오먹지</figcaption></figure><div><ul class="ingredient-list">${ingredients}</ul></div></section><h2 class="step-title">만드는 순서</h2><ol class="recipe-steps">${steps}</ol><div class="step-tip"><strong>실패 방지:</strong> ${esc(recipe.tip)}</div><section class="recipe-extra-guide" aria-labelledby="extra-guide-title"><h2 id="extra-guide-title">더 맛있게 만드는 실전 가이드</h2><div class="extra-guide-grid">${extras}</div></section><section class="article-faq" aria-labelledby="faq-title"><h2 id="faq-title">자주 묻는 질문</h2>${faqs}</section><section class="affiliate-box"><p class="eyebrow">MAKE IT EASY</p><h2>필요한 재료를 한 번에 찾을까요?</h2><p>${esc(recipe.affiliateCopy)}</p><a class="button button-cream" href="https://www.coupang.com/np/search?q=${encodeURIComponent(recipe.affiliate)}" target="_blank" rel="sponsored noopener">관련 재료 보기 →</a><p class="affiliate-disclosure">쿠팡 파트너스 활동을 통해 일정액의 수수료를 제공받을 수 있습니다.</p></section><div class="share-strip"><a href="/">다른 레시피 보기</a><button type="button" onclick="navigator.share?navigator.share({title:document.title,url:location.href}):navigator.clipboard.writeText(location.href)">이 글 공유하기</button></div></article></main><footer class="site-footer"><div class="footer-bottom"><p>© 2026 오먹지</p><p>콘텐츠와 이미지의 무단 복제·배포를 금합니다.</p><p>문의: <a href="mailto:timmy759@naver.com">timmy759@naver.com</a></p></div></footer><script src="/coupang-products.js?v=20260702" defer></script><script src="/recommendations.js?v=20260702" defer></script></body></html>`;
}

for(const recipe of recipes){
  const html = render(recipe)
    .replace('/recipe-article.css?v=20260702','/recipe-article.css?v=20260703-section-nav')
    .replace('/recommendations.js?v=20260702','/recommendations.js?v=20260703-section-nav');
  fs.writeFileSync(path.join(process.cwd(),'public','articles',`${recipe.slug}.html`),html,'utf8');
}
console.log(`야식 레시피 ${recipes.length}개를 생성했습니다.`);
