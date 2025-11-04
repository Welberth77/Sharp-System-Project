"use strict";

const fs = require("fs");
const path = require("path");

// Unified validator and fixer for gameData.json
// - Parses concatenated JSON blocks
// - Normalizes Translation Bank to remove '.' tokens from words and correct
// - Validates all game types and auto-fixes minor issues when safe

function parseMultiDataset(raw) {
  const acc = {
    translation_bank: [],
    match_pairs: [],
    multiple_choice: [],
    fill_blank: [],
    free_translation: [],
    match_madness: [],
  };

  // 1) Split into top-level JSON blocks (supports concatenated objects)
  let inString = false, escape = false, depth = 0, start = -1;
  const blocks = [];
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (inString) {
      if (escape) { escape = false; continue; }
      if (ch === "\\") { escape = true; continue; }
      if (ch === '"') { inString = false; }
      continue;
    }
    if (ch === '"') { inString = true; continue; }
    if (ch === '{' || ch === '[') {
      if (depth === 0 && ch === '{') start = i;
      depth++; continue;
    }
    if (ch === '}' || ch === ']') {
      depth--; if (depth === 0 && start >= 0) { blocks.push(raw.slice(start, i + 1)); start = -1; }
      continue;
    }
  }

  // 2) Helper: extract repeated arrays for known keys inside a single object block
  const KEYS = [
    'translation_bank','match_pairs','multiple_choice','fill_blank','free_translation','match_madness'
  ];
  function extractArraysFromObjectBlock(text) {
    const found = { translation_bank: [], match_pairs: [], multiple_choice: [], fill_blank: [], free_translation: [], match_madness: [] };
    let i = 0; let inStr = false; let esc = false; let depthObj = 0;
    while (i < text.length) {
      const ch = text[i];
      if (inStr) {
        if (esc) { esc = false; i++; continue; }
        if (ch === '\\') { esc = true; i++; continue; }
        if (ch === '"') { inStr = false; i++; continue; }
        i++; continue;
      }
      if (ch === '"') {
        // Potential key at depth 1
        if (depthObj === 1) {
          // Read key string
          let j = i + 1; let keyStr = '';
          while (j < text.length) {
            const c2 = text[j];
            if (c2 === '\\') { j += 2; continue; }
            if (c2 === '"') break;
            keyStr += c2; j++;
          }
          // Move j to after closing quote
          j++;
          // Skip whitespace
          while (j < text.length && /\s/.test(text[j])) j++;
          if (text[j] === ':') {
            j++;
            while (j < text.length && /\s/.test(text[j])) j++;
            if (KEYS.includes(keyStr) && text[j] === '[') {
              // Extract the array value
              let k = j; let arrDepth = 0; let inS = false; let escS = false;
              while (k < text.length) {
                const c3 = text[k];
                if (inS) {
                  if (escS) { escS = false; k++; continue; }
                  if (c3 === '\\') { escS = true; k++; continue; }
                  if (c3 === '"') { inS = false; k++; continue; }
                  k++; continue;
                }
                if (c3 === '"') { inS = true; k++; continue; }
                if (c3 === '[') { arrDepth++; k++; continue; }
                if (c3 === ']') { arrDepth--; k++; if (arrDepth === 0) { break; } continue; }
                k++;
              }
              const arrStr = text.slice(j, k);
              try {
                const arrVal = JSON.parse(arrStr);
                if (Array.isArray(arrVal)) found[keyStr].push(arrVal);
              } catch {}
              i = k; // continue after array
              continue;
            }
          }
        }
        inStr = true; i++; continue;
      }
      if (ch === '{') { depthObj++; i++; continue; }
      if (ch === '}') { depthObj--; i++; continue; }
      i++;
    }
    return found;
  }

  // 3) If no blocks detected, treat whole raw as one block
  if (blocks.length === 0) blocks.push(raw);

  for (const b of blocks) {
    // Try to extract repeated arrays per key from this object block text
    const found = extractArraysFromObjectBlock(b);
    let mergedAny = false;
    for (const k of KEYS) {
      if (found[k] && found[k].length) {
        for (const arr of found[k]) mergeInto(acc, { [k]: arr });
        mergedAny = true;
      }
    }
    // Fallback: regular JSON parse and merge (for blocks without explicit matches)
    if (!mergedAny) {
      try {
        const obj = JSON.parse(b);
        mergeInto(acc, obj);
      } catch {}
    }
  }
  return acc;
}

function mergeInto(acc, obj) {
  if (!obj || typeof obj !== "object") return acc;
  const keys = [
    "translation_bank",
    "match_pairs",
    "multiple_choice",
    "fill_blank",
    "free_translation",
    "match_madness",
  ];
  for (const k of keys) {
    if (Array.isArray(obj[k])) acc[k] = acc[k].concat(obj[k]);
  }
  return acc;
}

const uniq = (arr) => Array.from(new Set(arr));
const dedupePreserve = (arr) => {
  const seen = new Set();
  const res = [];
  for (const x of arr || []) {
    if (!seen.has(x)) {
      seen.add(x);
      res.push(x);
    }
  }
  return res;
};

function dedupeById(arr, type, issues) {
  const seen = new Set();
  const out = [];
  for (const item of arr || []) {
    const id = item && item.id;
    if (id && seen.has(id)) {
      issues && issues.push({ id, type, msg: "Duplicate id removed (dedupe)" });
      continue;
    }
    if (id) seen.add(id);
    out.push(item);
  }
  return out;
}

function parseFlags(argv){
  const flags = { smartIds: false };
  for (const a of argv || []){
    if (a === '--smart-ids' || a === '--dedupe=smart') flags.smartIds = true;
  }
  return flags;
}

function stableStringify(obj){
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return `[${obj.map(stableStringify).join(',')}]`;
  const keys = Object.keys(obj).sort();
  return `{${keys.map(k=>JSON.stringify(k)+":"+stableStringify(obj[k])).join(',')}}`;
}

function normalizeComparable(type, item){
  if (!item) return '';
  const base = { ...item };
  delete base.id;
  // Per-type normalization to make comparisons robust
  switch(type){
    case 'translation_bank': {
      // Compare by portuguese + correct sequence; ignore words order/contents
      const o = { portuguese: item.portuguese || '', correct: Array.isArray(item.correct)? item.correct : [] , difficulty: item.difficulty };
      return stableStringify(o);
    }
    case 'match_pairs': {
      const pairs = Array.isArray(item.pairs)? [...item.pairs] : [];
      const normPairs = pairs.map(p=>({ en: p.en, pt: p.pt })).sort((a,b)=> (a.en||'').localeCompare(b.en||''));
      const o = { pairs: normPairs, difficulty: item.difficulty };
      return stableStringify(o);
    }
    case 'multiple_choice': {
      const opts = Array.isArray(item.options)? [...item.options].sort() : [];
      const o = { question: item.question || '', options: opts, correct: item.correct, difficulty: item.difficulty };
      return stableStringify(o);
    }
    case 'fill_blank': {
      const opts = Array.isArray(item.options)? [...item.options].sort() : [];
      const o = { sentence: item.sentence || '', options: opts, correct: item.correct, difficulty: item.difficulty };
      return stableStringify(o);
    }
    case 'free_translation': {
      const o = { portuguese: item.portuguese || '', expected: item.expected || '', difficulty: item.difficulty };
      return stableStringify(o);
    }
    case 'match_madness': {
      const pairs = Array.isArray(item.pairs)? [...item.pairs] : [];
      const normPairs = pairs.map(p=>({ en: p.en, pt: p.pt })).sort((a,b)=> (a.en||'').localeCompare(b.en||''));
      const o = { timeLimit: item.timeLimit, pairs: normPairs, difficulty: item.difficulty };
      return stableStringify(o);
    }
    default:
      return stableStringify(base);
  }
}

function generateUniqueId(baseId, existing){
  // Try to preserve pattern <tt>_<theme>_<n>
  const m = /^([a-z]{2})_([a-z]+)_(\d+)$/.exec(baseId||'');
  if (m){
    const tt = m[1], theme = m[2];
    let n = parseInt(m[3],10);
    let candidate;
    do { n++; candidate = `${tt}_${theme}_${n}`; } while (existing.has(candidate));
    return candidate;
  }
  // Fallback suffix
  let i = 2; let cand;
  do { cand = `${baseId||'item'}_${i}`; i++; } while (existing.has(cand));
  return cand;
}

function dedupeByIdStrategy(arr, type, issues, smart){
  if (!smart) return dedupeById(arr, type, issues);
  const out = [];
  const byId = new Map();
  const idSet = new Set();
  for (const item of arr || []){
    const id = item && item.id;
    if (!id || !byId.has(id)){
      if (id) { byId.set(id, normalizeComparable(type, item)); idSet.add(id); }
      out.push(item);
      continue;
    }
    // Duplicate id: compare content
    const prevSig = byId.get(id);
    const curSig = normalizeComparable(type, item);
    if (prevSig === curSig){
      issues && issues.push({ id, type, msg: 'Duplicate id with identical content removed' });
      // drop this item
      continue;
    }
    // Different content: rename the new item to a unique id
    const newId = generateUniqueId(id, idSet);
    const renamed = { ...item, id: newId };
    idSet.add(newId);
    byId.set(newId, curSig);
    out.push(renamed);
    issues && issues.push({ id, type, msg: `Duplicate id with different content renamed to ${newId}` });
  }
  return out;
}

function normalizeTranslationBank(items) {
  let fixes = 0;
  let issues = [];
  const dot = ".";
  const normalized = (items || []).map((item, idx) => {
    const id = item.id || `tb_${idx + 1}`;
    const it = { ...item };
    if (!Array.isArray(it.correct)) it.correct = [];
    if (!Array.isArray(it.words)) it.words = [];

    const beforeCorrectLen = it.correct.length;
    const beforeWordsLen = it.words.length;

    // Remove '.' from correct and words
    const newCorrect = it.correct.filter((w) => w !== dot);
    const newWords = it.words.filter((w) => w !== dot);
    if (newCorrect.length !== beforeCorrectLen) fixes++;
    if (newWords.length !== beforeWordsLen) fixes++;

    // Ensure all correct tokens appear in words
    const wordSet = new Set(newWords);
    let added = 0;
    for (const w of newCorrect) {
      if (!wordSet.has(w)) {
        newWords.push(w);
        wordSet.add(w);
        added++;
      }
    }
    if (added > 0) fixes++;

    // Dedupe words
    const dedupedWords = dedupePreserve(newWords);
    if (dedupedWords.length !== newWords.length) fixes++;

    it.correct = newCorrect;
    it.words = dedupedWords;

    // Basic validity checks
    if (it.correct.length === 0) issues.push({ id, type: "translation_bank", msg: "Empty correct sequence" });
    if (it.words.length === 0) issues.push({ id, type: "translation_bank", msg: "Empty word bank" });
    for (const w of it.correct) {
      if (!wordSet.has(w)) {
        issues.push({ id, type: "translation_bank", msg: `Correct token missing in words: ${w}` });
        break;
      }
    }
    return it;
  });
  return { normalized, fixes, issues };
}

(function main() {
  const dataPath = path.join(__dirname, "..", "src", "utils", "gameData.json");
  const raw = fs.readFileSync(dataPath, "utf8");
  const data = parseMultiDataset(raw);

  let issues = [];
  let totalFixes = 0;
  const flags = parseFlags(process.argv);

  // Normalize Translation Bank (remove punctuation and fix membership)
  const { normalized: tbNorm, fixes: tbFixes, issues: tbIssues } = normalizeTranslationBank(
    data.translation_bank
  );
  data.translation_bank = dedupeByIdStrategy(tbNorm, 'translation_bank', issues, flags.smartIds);
  totalFixes += tbFixes;
  issues = issues.concat(tbIssues);

  // Multiple choice validations
  (data.multiple_choice || []).forEach((q, idx) => {
    const id = q.id || `mc_${idx + 1}`;
    if (!q.options || q.options.length !== 3)
      issues.push({ id, type: "multiple_choice", msg: "Expected 3 options" });
    if (q.options && uniq(q.options).length !== q.options.length)
      issues.push({ id, type: "multiple_choice", msg: "Duplicate options" });
    if (q.options && !q.options.includes(q.correct))
      issues.push({ id, type: "multiple_choice", msg: "Correct option missing from options" });
    if (/Qual palavra significa '\\w+' em inglês\?/.test(q.question || ""))
      issues.push({ id, type: "multiple_choice", msg: "Question using EN word in prompt (should be PT)" });
  });

  // Fill blank: ensure correct is present if options exist
  (data.fill_blank || []).forEach((q, idx) => {
    const id = q.id || `fb_${idx + 1}`;
    if (q.options && !q.options.includes(q.correct))
      issues.push({ id, type: "fill_blank", msg: "Correct option missing" });
    if (q.options && uniq(q.options).length !== q.options.length)
      issues.push({ id, type: "fill_blank", msg: "Duplicate options" });
  });

  // Free translation: Portuguese and expected must be strings
  (data.free_translation || []).forEach((q, idx) => {
    const id = q.id || `ft_${idx + 1}`;
    if (typeof q.portuguese !== "string" || typeof q.expected !== "string")
      issues.push({ id, type: "free_translation", msg: "Portuguese/expected should be strings" });
  });

  // Match pairs / madness: ensure pairs non-empty
  data.match_pairs = dedupeByIdStrategy(data.match_pairs, 'match_pairs', issues, flags.smartIds);
  (data.match_pairs || []).forEach((q, idx) => {
    const id = q.id || `mp_${idx + 1}`;
    if (!Array.isArray(q.pairs) || q.pairs.length === 0)
      issues.push({ id, type: "match_pairs", msg: "No pairs" });
  });
  data.multiple_choice = dedupeByIdStrategy(data.multiple_choice, 'multiple_choice', issues, flags.smartIds);
  data.fill_blank = dedupeByIdStrategy(data.fill_blank, 'fill_blank', issues, flags.smartIds);
  data.free_translation = dedupeByIdStrategy(data.free_translation, 'free_translation', issues, flags.smartIds);
  data.match_madness = dedupeByIdStrategy(data.match_madness, 'match_madness', issues, flags.smartIds);
  (data.match_madness || []).forEach((q, idx) => {
    const id = q.id || `mm_${idx + 1}`;
    if (!Array.isArray(q.pairs) || q.pairs.length === 0)
      issues.push({ id, type: "match_madness", msg: "No pairs" });
  });

  // Write back normalized single-block JSON (simpler than multi-block)
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");

  // Report
  const totals = Object.fromEntries(
    Object.entries(data).map(([k, v]) => [k, Array.isArray(v) ? v.length : 0])
  );
  console.log(`Validation complete. Fixes applied: ${totalFixes}`);
  console.log("Counts:", totals);
  if (issues.length) {
    console.log(`Found ${issues.length} issues:`);
    issues.slice(0, 100).forEach((i) => console.log(`${i.type} ${i.id}: ${i.msg}`));
    if (issues.length > 100) console.log("...");
    process.exitCode = 1;
  } else {
    console.log("No issues found.");
  }
})();
