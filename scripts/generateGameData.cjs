"use strict";
// Deprecated: data is no longer generated automatically. Use the curated JSON and run the unified validator.
console.error("Deprecated script. Use: node scripts/validateGameData.cjs");
process.exit(1);
function __discard__(){
  };
  const list = safe[cat] || ['new', 'good', 'big', 'small'];
  const adjEn = pick(list);
  const adj = adjectivesLex.find(a=>a.en===adjEn) || pick(adjectivesLex);
  return adj;
}

function buildTranslationBank(total=1200){
  const arr=[];
  for(let i=1;i<=total;i++){
    const subj = pick(ptSubjects);
    const verb = pick(verbs);
    // Restrict object/adjective/adverb to plausible choices
    const verbCatMap = {
      eat:'edible', drink:'drinkable', watch:'watchable', read:'readable', write:'writable',
      study:'study', learn:'study', visit:'place', build:'buildable', use:'device', call:'person',
      open:'closable', close:'closable', make:'cookable', play:'playable', buy:'object', sell:'object',
      find:'place', lose:'object',
      // --- NOVAS ENTRADAS ---
      need: 'object', love: 'object', see: 'object', know: 'object', want: 'object', give: 'object'
    };
    const cat = verbCatMap[verb] || 'object';
    const obj = pickFromCategory(cat);
    const adj = pickAdjForCategory(cat);
    const adv = pick(adverbsPresent);

    const ptVerb = conjPt(verb, subj.key);
    const ptAdj = obj.gender==='f' ? adj.ptF : adj.ptM;
    const ptArt = obj.gender==='f' ? 'uma' : 'um';
    const pt = `${subj.pt} ${ptVerb} ${ptArt} ${ptAdj} ${obj.pt} ${adv.pt}.`;

  const enSubj = subj.en;
    // 3rd person singular conjugation rules
    function conj3s(v){
      if(v==='have') return 'has';
      if(v==='do') return 'does';
      if(v==='know') return 'knows';
      if(v==='see') return 'sees';
      if(v==='need') return 'needs';
      if(v==='want') return 'wants';
      if(v==='give') return 'gives';
      if(v==='love') return 'loves';
      if(/(s|sh|ch|x|z)$/.test(v)) return v+'es';
      if(/[^aeiou]y$/.test(v)) return v.replace(/y$/,'ies');
      return v+'s';
    }
    const enVerb = ['He','She'].includes(enSubj) ? conj3s(verb) : verb;
  const headWord = adj.en || obj.en;
  const article = /^[aeiou]/i.test(headWord) ? 'an' : 'a';
  const enObj = `${article} ${adj.en} ${obj.en}`;
  const en = `${enSubj} ${enVerb} ${enObj} ${adv.en}.`;

  const tokens = [capitalize(enSubj), enVerb, article, adj.en, obj.en, ...adv.en.split(' '), '.'];
    const words = shuffle(tokens);

    arr.push({
      id: `tb_${i}`,
      portuguese: capitalize(pt),
      words,
      correct: tokens.map(t=>t==='.'?'.':t),
      difficulty: i%10===0?'difícil': i%3===0?'médio':'fácil'
    });
  }
  return arr;
}

function buildMatchPairs(total=400){
  const basePairs = [
    ['Man','Homem'],['Woman','Mulher'],['Apple','Maçã'],['Book','Livro'],['House','Casa'],
    ['Beautiful','Bonito'],['Dangerous','Perigoso'],['Happy','Feliz'],['Tired','Cansado'],['Angry','Raivoso'],
    ['Run','Correr'],['Eat','Comer'],['Sleep','Dormir'],['Read','Ler'],['Write','Escrever'],
    ['Computer','Computador'],['Keyboard','Teclado'],['Mouse','Mouse'],['Screen','Tela'],['Software','Programa'],
    ['Sky','Céu'],['Star','Estrela'],['Moon','Lua'],['Sun','Sol'],['Cloud','Nuvem'],
    ['Red','Vermelho'],['Blue','Azul'],['Green','Verde'],['Yellow','Amarelo'],['Black','Preto'],
    // --- NOVAS ENTRADAS ---
    ['Touch', 'Tocar'],
    ['Need', 'Precisar'],
    ['Want', 'Querer'],
    ['See', 'Ver'],
    ['Know', 'Saber'],
    ['Give', 'Dar'],
    ['Love', 'Amar'],
    ['Work', 'Trabalhar'],
    ['Walk', 'Andar'],
    ['Programmer', 'Programador'],
    ['Shirt', 'Camisa'],
    ['Shoes', 'Sapatos'],
    ['Money', 'Dinheiro'],
    ['Time', 'Tempo'],
    ['Problem', 'Problema'],
    ['Solution', 'Solução'],
    ['Fast', 'Rápido'],
    ['Slow', 'Lento'],
    ['Strong', 'Forte'],
    ['Weak', 'Fraco'],
    ['Expensive', 'Caro'],
    ['Cheap', 'Barato'],
    ['Clean', 'Limpo'],
    ['Dirty', 'Sujo'],
    ['Always', 'Sempre'],
    ['Never', 'Nunca'],
    ['Now', 'Agora'],
    ['Today', 'Hoje'],
    ['Yesterday', 'Ontem'],
    ['Tomorrow', 'Amanhã']
  ];
  const arr=[];
  for(let i=1;i<=total;i++){
    const pairs = shuffle(basePairs).slice(0,5).map(([en,pt])=>({en,pt}));
    arr.push({ id:`mp_${i}`, pairs, difficulty: i%5===0?'médio':'fácil' });
  }
  return arr;
}

function buildMultipleChoice(total=800){
  const arr=[];
  for(let i=1;i<=total;i++){
    const nounEntry = pick(nounsLex);
    const adjEntry = pick(adjectivesLex);
    const qType = i%3;
    if(qType===0){
      // Adjective translation to English: show PT adjective, answer in EN
      const ptWord = Math.random()<0.5 ? adjEntry.ptM : adjEntry.ptF;
      const correct = capitalize(adjEntry.en);
      const distractors = new Set();
      while(distractors.size<2){
        const alt = capitalize(pick(adjectivesLex).en);
        if(alt!==correct) distractors.add(alt);
      }
      const options = shuffle([correct, ...Array.from(distractors)]);
      arr.push({id:`mc_${i}`, question:`Qual é a tradução de '${ptWord}' para o inglês?`, options, correct, difficulty: i%6===0?'difícil':'médio'});
    } else if(qType===1){
      // Article + noun: show PT with correto artigo, resposta em EN
      const enNoun = nounEntry.en;
      const correct = `The ${enNoun}`;
      function enIndefArticle(word){ return /^[aeiou]/i.test(word)?'An':'A'; }
      const opts = new Set([correct]);
      while(opts.size<3){
        const altN = pick(nounsLex).en;
        const alt = `${enIndefArticle(altN)} ${altN}`;
        if(alt!==correct) opts.add(alt);
      }
      const artPt = nounEntry.gender==='f'?'a':'o';
      const question = `Qual é a melhor tradução para '${artPt} ${nounEntry.pt}'?`;
      const options = shuffle(Array.from(opts));
      arr.push({id:`mc_${i}`, question, options, correct, difficulty: i%4===0?'fácil':'médio'});
    } else {
      const correct = 'Went';
      const options = shuffle(['Goed','Gone','Went']);
      arr.push({id:`mc_${i}`, question:`Escolha o passado do verbo 'go'.`, options, correct, difficulty: 'médio'});
    }
  }
  return arr;
}

function buildFillBlank(total=800){
  const arr=[];
  for(let i=1;i<=total;i++){
    const verb = pick(verbs);
    const sentenceType = i%4;
    if(sentenceType===0){
      const sentence = `I ___ ${pick(nounsLex).en}.`;
      const options = ['is','am',verb];
      arr.push({id:`fb_${i}`, sentence, options, correct: verb, difficulty:'fácil'});
    } else if(sentenceType===1){
      const sentence = `She ___ to ${pick(verbs)} ${pick(adverbsPresent).en}.`;
      const options = ['go','goes','going'];
      arr.push({id:`fb_${i}`, sentence, options, correct: 'goes', difficulty:'médio'});
    } else if(sentenceType===2){
      const sentence = `They have ___ a ${pick(adjectivesLex).en} ${pick(nounsLex).en}.`;
      const options = ['make','made','makes'];
      arr.push({id:`fb_${i}`, sentence, options, correct: 'made', difficulty:'médio'});
    } else {
      const sentence = `The book is ___ the table.`;
      const options = ['on','in','at'];
      arr.push({id:`fb_${i}`, sentence, options, correct: 'on', difficulty:'fácil'});
    }
  }
  return arr;
}

function buildFreeTranslation(total=600){
  const arr=[];
  for(let i=1;i<=total;i++){
    const subj = pick(ptSubjects);
    const verb = pick(verbs);
    const verbCatMap = {
      eat:'edible', drink:'drinkable', watch:'watchable', read:'readable', write:'writable',
      study:'study', learn:'study', visit:'place', build:'buildable', use:'device', call:'person',
      open:'closable', close:'closable', make:'cookable', play:'playable', buy:'object', sell:'object',
      find:'place', lose:'object',
      // --- NOVAS ENTRADAS ---
      need: 'object', love: 'object', see: 'object', know: 'object', want: 'object', give: 'object'
    };
    const cat = verbCatMap[verb] || 'object';
    const obj = pickFromCategory(cat);
    const adj = pickAdjForCategory(cat);
    const adv = pick(adverbsPresent);

    const ptVerb = conjPt(verb, subj.key);
    const ptAdj = obj.gender==='f' ? adj.ptF : adj.ptM;
    const ptArt = obj.gender==='f' ? 'uma' : 'um';
    const pt = `${subj.pt} ${ptVerb} ${ptArt} ${ptAdj} ${obj.pt} ${adv.pt}.`;

    const enSubj = subj.en;
    function conj3s(v){
      if(v==='have') return 'has';
      if(v==='do') return 'does';
      if(v==='know') return 'knows';
      if(v==='see') return 'sees';
      if(v==='need') return 'needs';
      if(v==='want') return 'wants';
      if(v==='give') return 'gives';
      if(v==='love') return 'loves';
      if(/(s|sh|ch|x|z)$/.test(v)) return v+'es';
      if(/[^aeiou]y$/.test(v)) return v.replace(/y$/,'ies');
      return v+'s';
    }
    const enVerb = ['He','She'].includes(enSubj) ? conj3s(verb) : verb;
    const headWord = adj.en || obj.en;
    const article = /^[aeiou]/i.test(headWord) ? 'an' : 'a';
  const en = `${enSubj} ${enVerb} ${article} ${adj.en} ${obj.en} ${adv.en}.`;

    arr.push({ id:`ft_${i}`, portuguese: capitalize(pt), expected: capitalize(en), difficulty: i%5===0?'médio':'fácil' });
  }
  return arr;
}

function buildMatchMadness(total=200){
  const basePairs = [
    ['Cat','Gato'],['Dog','Cachorro'],['Bird','Pássaro'],['Fish','Peixe'],['Lion','Leão'],['Tiger','Tigre'],
    ['Red','Vermelho'],['Blue','Azul'],['Green','Verde'],['Yellow','Amarelo'],['Black','Preto'],['White','Branco'],
    ['Run','Correr'],['Walk','Andar'],['Swim','Nadar'],['Fly','Voar'],['Jump','Pular'],['Drive','Dirigir'],
    ['Money','Dinheiro'],
    ['Time','Tempo'],
    ['Day','Dia'],
    ['Night','Noite'],
    ['Work','Trabalhar'],
    ['Want','Querer'],
    ['Need','Precisar'],
    ['See','Ver'],
    ['Talk','Conversar'],
    ['Fast','Rápido'],
    ['Slow','Lento'],
    ['Good','Bom'],
    ['Bad','Ruim'],
    ['Here','Aqui'],
    ['There','Lá']
  ];
  const arr=[];
  for(let i=1;i<=total;i++){
    const pairs = shuffle(basePairs).slice(0,6).map(([en,pt])=>({en,pt}));
    arr.push({ id:`mm_${i}`, timeLimit: 25 + (i%3)*5, pairs, difficulty: 'rápido' });
  }
  return arr;
}

function buildData(){
  return {
    translation_bank: buildTranslationBank(1200),
    match_pairs: buildMatchPairs(400),
    multiple_choice: buildMultipleChoice(800),
    fill_blank: buildFillBlank(800),
    free_translation: buildFreeTranslation(600),
    match_madness: buildMatchMadness(200)
  };
}

(function main(){
  const outPath = path.join(__dirname, '..', 'src', 'utils', 'gameData.json');
  const data = buildData();
  fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Generated gameData.json at ${outPath}`);
})();