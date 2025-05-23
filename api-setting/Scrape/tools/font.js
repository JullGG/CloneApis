const fonts = {
  smallcaps: {
    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ',
    i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ',
    q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x',
    y: 'ʏ', z: 'ᴢ',
    A: 'A', B: 'B', C: 'C', D: 'D', E: 'E', F: 'F', G: 'G', H: 'H',
    I: 'I', J: 'J', K: 'K', L: 'L', M: 'M', N: 'N', O: 'O', P: 'P',
    Q: 'Q', R: 'R', S: 'S', T: 'T', U: 'U', V: 'V', W: 'W', X: 'X',
    Y: 'Y', Z: 'Z'
  }
};

function mapUnicode(text, mapStartLower, mapStartUpper, extras = {}) {
  let result = '';
  for (const c of text) {
    if (c >= 'a' && c <= 'z') {
      result += String.fromCodePoint(mapStartLower + c.charCodeAt(0) - 97);
    } else if (c >= 'A' && c <= 'Z') {
      result += String.fromCodePoint(mapStartUpper + c.charCodeAt(0) - 65);
    } else if (extras[c]) {
      result += extras[c];
    } else {
      result += c;
    }
  }
  return result;
}

function toSmallCaps(text) {
  return text.split('').map(c => fonts.smallcaps[c] || c).join('');
}

function toBold(text) {
  return mapUnicode(text, 0x1D41A, 0x1D400);
}

function toItalic(text) {
  return mapUnicode(text, 0x1D44E, 0x1D434);
}

function toBoldItalic(text) {
  return mapUnicode(text, 0x1D482, 0x1D468);
}

function toScript(text) {
  const extras = {
    B: 'ℬ', E: 'ℰ', F: 'ℱ', H: 'ℋ', I: 'ℐ', L: 'ℒ', M: 'ℳ', R: 'ℛ',
    e: 'ℯ'
  };
  return mapUnicode(text, 0x1D4B6, 0x1D49C, extras);
}

function toBoldScript(text) {
  return mapUnicode(text, 0x1D4EA, 0x1D4D0);
}

function toFraktur(text) {
  const extras = {
    C: 'ℭ', H: 'ℌ', I: 'ℑ', R: 'ℜ', Z: 'ℨ'
  };
  return mapUnicode(text, 0x1D51E, 0x1D504, extras);
}

function toBoldFraktur(text) {
  return mapUnicode(text, 0x1D552, 0x1D538);
}

function toDoubleStruck(text) {
  const extras = {
    C: 'ℂ', H: 'ℍ', N: 'ℕ', P: 'ℙ', Q: 'ℚ', R: 'ℝ', Z: 'ℤ'
  };
  return mapUnicode(text, 0x1D57E, 0x1D560, extras);
}

function toSansSerif(text) {
  return mapUnicode(text, 0x1D5BA, 0x1D5A0);
}

function toBoldSansSerif(text) {
  return mapUnicode(text, 0x1D5EE, 0x1D5D4);
}

function toItalicSansSerif(text) {
  return mapUnicode(text, 0x1D622, 0x1D608);
}

function toBoldItalicSansSerif(text) {
  return mapUnicode(text, 0x1D656, 0x1D63C);
}

function toMonospace(text) {
  return mapUnicode(text, 0x1D68A, 0x1D670, {
    '0': '𝟶',
    '1': '𝟷',
    '2': '𝟸',
    '3': '𝟹',
    '4': '𝟺',
    '5': '𝟻',
    '6': '𝟼',
    '7': '𝟽',
    '8': '𝟾',
    '9': '𝟿'
  });
}

const fontMap = {
  smallcap: toSmallCaps,
  bold: toBold,
  italic: toItalic,
  bolditalic: toBoldItalic,
  script: toScript,
  boldscript: toBoldScript,
  fraktur: toFraktur,
  boldfraktur: toBoldFraktur,
  doublestruck: toDoubleStruck,
  sans: toSansSerif,
  boldsans: toBoldSansSerif,
  italicsans: toItalicSansSerif,
  bolditalicsans: toBoldItalicSansSerif,
  monospace: toMonospace,
};

function convertFont(text, font) {
  const fn = fontMap[font.toLowerCase()];
  if (!fn) return text;
  return fn(text);
}

module.exports = convertFont;
