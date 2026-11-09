// أنشطة «أستكشف» التفاعلية: كل هدف له نشاط مختلف. كل دالة تُرجع وصفًا (عناصر المشهد + أدوات التحكم + القراءات).
const INK = '#14171C', MUTED = '#5B6270', LINE = '#DAD8CF', ACC = '#2346D8', ACC_SOFT = '#E6EBFC', OK = '#16825A', OK_SOFT = '#E3F3EB', BAD = '#C8372D', BAD_SOFT = '#FBE7E4', ELEC = '#D9821E', LONE = '#7B61C9', PAPER = '#F7F7F3';
const D = Math.PI / 180;
const U = v => (v / 8).toFixed(2) + 'cqw';
const EL = {
  H: ['#FFFFFF', INK], C: [INK, '#fff'], N: [ACC, '#fff'], O: [BAD, '#fff'], F: [OK, '#fff'], Cl: [OK, '#fff'], Br: ['#7A2E1F', '#fff'], I: ['#5E3A7A', '#fff'],
  P: ['#B5651D', '#fff'], S: ['#C9A227', INK], B: ['#C98F6B', '#fff'], Xe: [MUTED, '#fff'], Be: ['#8C929C', '#fff'], Al: ['#8C929C', '#fff'], Nb: [MUTED, '#fff'],
  Li: ['#8C929C', '#fff'], Na: ['#8C929C', '#fff'], K: ['#8C929C', '#fff'], Mg: ['#8C929C', '#fff'], As: ['#6B7A3A', '#fff']
};
function it(o) {
  return {
    l: (o.x / 8).toFixed(2) + '%', tp: (o.y / 5).toFixed(2) + '%', w: U(o.w || 0), h: U(o.h || 0), rot: (o.rot || 0).toFixed(1) + 'deg',
    bg: o.bg || 'transparent', bd: o.bd || 'none', r: o.r || '0', op: o.op == null ? 1 : o.op, z: o.z || 1, c: o.c || INK,
    fs: 'max(10px,' + U(o.fs || 18) + ')', fw: o.fw || 600, cur: o.click ? 'pointer' : 'default', click: o.click || null, t: o.t == null ? '' : o.t,
    tr: o.tr || 'all .55s cubic-bezier(.4,.1,.2,1)', dir: o.dir || (/[\u0600-\u06FF]/.test(String(o.t == null ? '' : o.t)) ? 'rtl' : 'ltr')
  };
}
function atom(x, y, el, o = {}) {
  const d = o.d || 64, col = EL[el] || [MUTED, '#fff'];
  return it(Object.assign({ x, y, w: d, h: d, r: '50%', bg: col[0], c: col[1], bd: el === 'H' ? '2px solid ' + INK : 'none', t: el, fs: o.fs || d * (el.length > 1 ? 0.34 : 0.42), z: 5 }, o));
}
const dot = (x, y, o = {}) => it(Object.assign({ x, y, w: o.s || 11, h: o.s || 11, r: '50%', bg: ELEC, z: 7 }, o));
function line(x1, y1, x2, y2, o = {}) {
  const len = Math.hypot(x2 - x1, y2 - y1), ang = Math.atan2(y2 - y1, x2 - x1) / D;
  const rest = Object.assign({}, o); delete rest.t;
  return it(Object.assign({ x: (x1 + x2) / 2, y: (y1 + y2) / 2, w: len, h: o.t == null ? 5 : o.t, bg: INK, rot: ang, r: '3px', z: 2 }, rest));
}
const txt = (x, y, t, o = {}) => it(Object.assign({ x, y, t, fs: 20, z: 9 }, o));
const blob = (x, y, w, h, o = {}) => it(Object.assign({ x, y, w, h, r: '50%', z: 1 }, o));
const box = (x, y, w, h, o = {}) => it(Object.assign({ x, y, w, h, r: '10px', z: 3 }, o));
function bonds(ax, ay, bx, by, k, o = {}) {
  const ra = o.ra || 32, rb = o.rb || 32, max = o.max || 3, gap = o.gap || 12;
  const L = Math.hypot(bx - ax, by - ay) || 1, ux = (bx - ax) / L, uy = (by - ay) / L, px = -uy, py = ux;
  const out = [];
  for (let i = 0; i < max; i++) {
    const vis = i < k, off = vis ? (i - (k - 1) / 2) * gap : 0;
    out.push(line(ax + ux * ra + px * off, ay + uy * ra + py * off, bx - ux * rb + px * off, by - uy * rb + py * off, { op: vis ? (o.op == null ? 1 : o.op) : 0, c: o.c, bg: o.bg || INK, t: o.th || 5, tr: o.tr }));
  }
  return out;
}
function proj(v, rx, ry) {
  const cy = Math.cos(ry * D), sy = Math.sin(ry * D);
  const x = v[0] * cy + v[2] * sy, z = -v[0] * sy + v[2] * cy, y = v[1];
  const cx = Math.cos(rx * D), sx = Math.sin(rx * D);
  return [x, y * cx - z * sx, y * sx + z * cx];
}
const norm = v => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
const T = Math.sqrt(8) / 3;
const GEO = {
  2: [[1, 0, 0], [-1, 0, 0]],
  3: [[0, 1, 0], [Math.cos(210 * D), Math.sin(210 * D), 0], [Math.cos(330 * D), Math.sin(330 * D), 0]],
  4: [[0, 1, 0], [T, -1 / 3, 0], [T * Math.cos(120 * D), -1 / 3, T * Math.sin(120 * D)], [T * Math.cos(240 * D), -1 / 3, T * Math.sin(240 * D)]],
  5: [[0, 1, 0], [0, -1, 0], [1, 0, 0], [Math.cos(120 * D), 0, Math.sin(120 * D)], [Math.cos(240 * D), 0, Math.sin(240 * D)]],
  6: [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]]
};
const opt = (label, active, go) => ({ label, active, go });
const sub = n => n > 1 ? String(n).split('').map(d => '₀₁₂₃₄₅₆₇₈₉'[d]).join('') : '';

// ---------- o1: أكملي الثمانية ----------
function o1(s, set) {
  const el = s.el || 'O', V = { C: 4, N: 5, O: 6, F: 7 }, v = V[el], need = 8 - v, h = s.h || 0;
  const FORM = { C: 'CH₄', N: 'NH₃', O: 'H₂O', F: 'HF' };
  const dirs = [[0, -1], [-1, 0], [0, 1], [1, 0]], pairOrder = [0, 1, 2, 3];
  const paired = pairOrder.slice(0, v - 4), unp = [3, 2, 0, 1].filter(i => paired.indexOf(i) < 0);
  const bonded = unp.slice(0, h);
  const cx = 400, cy = 250, items = [atom(cx, cy, el, { d: 88 })];
  dirs.forEach((d, i) => {
    const p = [-d[1], d[0]], isP = paired.indexOf(i) >= 0, isB = bonded.indexOf(i) >= 0;
    const at = r => [cx + d[0] * r, cy + d[1] * r];
    let a, b, bo = 0, hp = at(330), hop = 0;
    if (isP) { const c = at(64); a = [c[0] + p[0] * 10, c[1] + p[1] * 10]; b = [c[0] - p[0] * 10, c[1] - p[1] * 10]; bo = 1; }
    else if (isB) { const c = at(104); a = [c[0] + p[0] * 10, c[1] + p[1] * 10]; b = [c[0] - p[0] * 10, c[1] - p[1] * 10]; bo = 1; hp = at(178); hop = 1; }
    else { a = at(64); b = at(330); }
    items.push(blob(at(104)[0], at(104)[1], 56, 56, { bg: ACC_SOFT, op: isB ? 1 : 0, z: 1 }));
    items.push(dot(a[0], a[1]));
    items.push(dot(b[0], b[1], { bg: isB ? ACC : ELEC, op: bo }));
    items.push(atom(hp[0], hp[1], 'H', { d: 52, op: hop }));
  });
  const done = h >= need;
  return {
    title: 'أكملي الثمانية', prompt: 'اختاري ذرة مركزية، ثم شاركي إلكتروناتها المنفردة مع ذرات هيدروجين حتى تحيط بها ثمانية إلكترونات.',
    groups: [{ label: 'الذرة المركزية (رقم المجموعة)', opts: ['C', 'N', 'O', 'F'].map(e => opt(e + ' (' + (10 + V[e]) + ')', e === el, () => set({ el: e, h: 0, over: false }))) }],
    actions: [
      { label: 'شاركي إلكترونًا مع ذرة H', primary: true, go: () => done ? set({ over: true }) : set({ h: h + 1, over: false }) },
      { label: 'ابدئي من جديد', go: () => set({ h: 0, over: false }) }
    ],
    items,
    readouts: [
      { k: 'إلكترونات حول ' + el, v: (v + h) + ' / 8', c: done ? OK : INK },
      { k: 'روابط تساهمية', v: String(h) },
      { k: 'أزواج غير مترابطة', v: String(v - 4) },
      { k: 'الجزيء', v: done ? FORM[el] : '—' }
    ],
    legend: [{ c: ELEC, t: 'إلكترونات الذرة المركزية' }, { c: ACC, t: 'إلكترون الهيدروجين' }],
    insight: s.over ? { tone: 'bad', text: 'لا توجد إلكترونات منفردة أخرى؛ الثمانية مكتملة. عدد الروابط = عدد الإلكترونات الناقصة (' + need + ').' }
      : done ? { tone: 'ok', text: 'اكتملت الثمانية حول ' + el + ': تكوّن ' + FORM[el] + ' بـ ' + need + ' ' + (need > 1 ? 'روابط' : 'رابطة') + '. ولكل ذرة H إلكترونان مثل الهيليوم.' }
      : { tone: 'info', text: 'لذرة ' + el + ' ' + v + ' إلكترونات تكافؤ، تحتاج إلى ' + (need - h) + ' ' + (need - h > 1 ? 'إلكترونات' : 'إلكترون') + ' بعد.' }
  };
}

// ---------- o2: شاركي الأزواج ----------
function o2(s, set) {
  const m = s.m || 'N2', k = s.k || 0;
  const M = { F2: ['F', 7, 'الفلور', 'F—F'], O2: ['O', 6, 'الأكسجين', 'O=O'], N2: ['N', 5, 'النيتروجين', 'N≡N'] }[m];
  const el = M[0], v = M[1], n = 8 - v, lp = (v - n) / 2;
  const xA = 270, xB = 530, y = 250, items = [];
  items.push(blob(400, y, 36 + 30 * k, 40 + 34 * k, { bg: ACC_SOFT, op: k ? 1 : 0, r: '40%' }));
  items.push(atom(xA, y, el, { d: 92 }), atom(xB, y, el, { d: 92 }));
  [[xA, 1], [xB, -1]].forEach(([x0, inner]) => {
    const slots = { outer: [-inner, 0], top: [0, -1], bottom: [0, 1], inner: [inner, 0] };
    const lpSlots = ['outer', 'top', 'bottom'].slice(0, lp), unSlots = ['inner', 'bottom', 'top'].filter(q => lpSlots.indexOf(q) < 0);
    lpSlots.forEach(q => { const d = slots[q], p = [-d[1], d[0]]; items.push(dot(x0 + d[0] * 66 + p[0] * 10, y + d[1] * 66 + p[1] * 10), dot(x0 + d[0] * 66 - p[0] * 10, y + d[1] * 66 - p[1] * 10)); });
    unSlots.slice(0, n).forEach((q, j) => {
      const d = slots[q];
      if (j < k) items.push(dot(400 - inner * 10, y + (j - (k - 1) / 2) * 30, { bg: inner > 0 ? ELEC : ACC }));
      else items.push(dot(x0 + d[0] * 66, y + d[1] * 66, { bg: inner > 0 ? ELEC : ACC }));
    });
  });
  items.push(txt(400, 440, k === n ? ':' + M[3] + ':' : '', { fs: 30, c: INK }));
  const done = k >= n, names = ['لا توجد رابطة', 'رابطة أحادية', 'رابطة ثنائية', 'رابطة ثلاثية'];
  return {
    title: 'شاركي الأزواج', prompt: 'اضغطي «شاركي زوجًا» لتنتقل الإلكترونات المنفردة من كل ذرة إلى منطقة الرابطة.',
    groups: [{ label: 'الجزيء', opts: ['F2', 'O2', 'N2'].map(x => opt(x.replace('2', '₂'), x === m, () => set({ m: x, k: 0, over: false }))) }],
    actions: [{ label: 'شاركي زوجًا', primary: true, go: () => done ? set({ over: true }) : set({ k: k + 1, over: false }) }, { label: 'أعيدي', go: () => set({ k: 0, over: false }) }],
    items,
    readouts: [{ k: 'الأزواج المشتركة', v: String(k) }, { k: 'نوع الرابطة', v: names[k], c: done ? OK : INK }, { k: 'حول كل ذرة', v: (v + k) + ' / 8', c: done ? OK : INK }, { k: 'أزواج غير مترابطة لكل ذرة', v: String(lp) }],
    legend: [{ c: ELEC, t: 'إلكترونات الذرة اليسرى' }, { c: ACC, t: 'إلكترونات الذرة اليمنى' }],
    insight: s.over ? { tone: 'bad', text: 'لم يعد لدى الذرتين إلكترونات منفردة؛ اكتملت الثمانية.' }
      : done ? { tone: 'ok', text: 'تشاركت ذرتا ' + M[2] + ' ' + (n === 1 ? 'بزوج واحد' : n === 2 ? 'بزوجين' : 'بثلاثة أزواج') + ' فتكوّنت ' + names[n] + ' ' + M[3] + '.' }
      : { tone: 'info', text: 'لكل ذرة ' + M[2] + ' ' + v + ' إلكترونات تكافؤ؛ تحتاج كل ذرة إلى ' + (n - k) + ' ' + (n - k > 1 ? 'إلكترونات' : 'إلكترون') + ' إضافية.' }
  };
}

// ---------- o3: تداخل المستويات ----------
function o3(s, set) {
  const mode = s.mode || 'sigma', d = s.d == null ? 20 : s.d, items = [];
  const y = 250;
  if (mode === 'sigma') {
    const sep = 440 - d * 2.4, xA = 400 - sep / 2, xB = 400 + sep / 2, off = 74;
    const gap = (xB - off) - (xA + off), ov = Math.max(0, Math.min(1, (120 - gap) / 110));
    items.push(blob(xA - off, y, 124, 72, { bg: 'rgba(35,70,216,.16)', bd: '2px solid ' + ACC }), blob(xA + off, y, 124, 72, { bg: 'rgba(35,70,216,.16)', bd: '2px solid ' + ACC }));
    items.push(blob(xB - off, y, 124, 72, { bg: 'rgba(217,130,30,.18)', bd: '2px solid ' + ELEC }), blob(xB + off, y, 124, 72, { bg: 'rgba(217,130,30,.18)', bd: '2px solid ' + ELEC }));
    items.push(blob(400, y, 30 + ov * 90, 30 + ov * 34, { bg: INK, op: ov > 0.12 ? 0.85 : 0, z: 4 }), blob(400, y + 0, 1, 1, { op: 0 }));
    items.push(txt(400, y, ov > 0.12 ? 'σ' : '', { c: '#fff', fs: 30, z: 8 }), txt(400, y, '', {}));
    items.push(atom(xA, y, '+', { d: 26, bg: INK, c: '#fff', fs: 16 }), atom(xB, y, '+', { d: 26, bg: INK, c: '#fff', fs: 16 }));
    items.push(line(80, y, 720, y, { t: 1, bg: MUTED, op: 0.4, z: 0 }));
    var formed = ov > 0.12;
  } else {
    const sep = 440 - d * 3.1, xA = 400 - sep / 2, xB = 400 + sep / 2, off = 70, wdt = 150;
    const ov = Math.max(0, Math.min(1, (wdt - sep) / 100));
    items.push(blob(xA, y - off, wdt, 112, { bg: 'rgba(35,70,216,.16)', bd: '2px solid ' + ACC }), blob(xA, y + off, wdt, 112, { bg: 'rgba(35,70,216,.16)', bd: '2px solid ' + ACC }));
    items.push(blob(xB, y - off, wdt, 112, { bg: 'rgba(217,130,30,.18)', bd: '2px solid ' + ELEC }), blob(xB, y + off, wdt, 112, { bg: 'rgba(217,130,30,.18)', bd: '2px solid ' + ELEC }));
    items.push(blob(400, y - off, 20 + ov * 70, 40 + ov * 50, { bg: INK, op: ov > 0.1 ? 0.85 : 0, z: 4 }), blob(400, y + off, 20 + ov * 70, 40 + ov * 50, { bg: INK, op: ov > 0.1 ? 0.85 : 0, z: 4 }));
    items.push(txt(400, y - off, ov > 0.1 ? 'π' : '', { c: '#fff', fs: 28, z: 8 }), txt(400, y + off, ov > 0.1 ? 'π' : '', { c: '#fff', fs: 28, z: 8 }));
    items.push(atom(xA, y, '+', { d: 26, bg: INK, c: '#fff', fs: 16 }), atom(xB, y, '+', { d: 26, bg: INK, c: '#fff', fs: 16 }));
    items.push(line(80, y, 720, y, { t: 1, bg: MUTED, op: 0.4, z: 0 }));
    var formed = ov > 0.1;
  }
  const isS = mode === 'sigma';
  return {
    title: 'تداخل المستويات', prompt: 'اختاري نوع التداخل، ثم قرّبي النواتين بالمنزلق وراقبي أين تتركز الكثافة الإلكترونية.',
    groups: [{ label: 'نوع التداخل', opts: [opt('رأسي', isS, () => set({ mode: 'sigma', d: 20 })), opt('متوازي', !isS, () => set({ mode: 'pi', d: 20 }))] }],
    slider: { label: 'قرّبي النواتين', min: 0, max: 100, step: 1, value: d, change: e => set({ d: +e.target.value }), valueLabel: d + '%' },
    items,
    readouts: [{ k: 'المستويات', v: isS ? 'p مع p على خط واحد' : 'p مع p متوازيان' }, { k: 'الرابطة', v: formed ? (isS ? 'سيجما σ' : 'باي π') : 'لم تتكوّن بعد', c: formed ? OK : MUTED }, { k: 'موقع الكثافة', v: isS ? 'بين النواتين' : 'أعلى خط الاتحاد وأسفله' }],
    insight: !formed ? { tone: 'info', text: 'قرّبي النواتين حتى تتداخل المستويات.' }
      : isS ? { tone: 'ok', text: 'تكوّنت رابطة سيجما: تداخل رأسي يزيد الكثافة الإلكترونية بين الذرتين. كل رابطة أحادية سيجما.' }
        : { tone: 'ok', text: 'تكوّنت رابطة باي من تداخل مستويي p متوازيين؛ تشغل إلكتروناتها الفراغ أعلى خط الاتحاد وأسفله، ولا توجد إلا في الروابط المتعددة مع سيجما.' }
  };
}

// ---------- o4: اكسري الرابطة ----------
function o4(s, set) {
  const m = s.m || 'O2', e = s.e || 0;
  const M = { F2: { L: 1.43, E: 159, k: 1, el: 'F' }, O2: { L: 1.21, E: 498, k: 2, el: 'O' }, N2: { L: 1.10, E: 945, k: 3, el: 'N' } }[m];
  const broken = e >= M.E, len = M.L * 175, cx = 320, y = 230;
  const xA = broken ? cx - 250 : cx - len / 2, xB = broken ? cx + 250 : cx + len / 2;
  const items = [];
  bonds(xA, y, xB, y, M.k, { ra: 44, rb: 44, gap: 14, op: broken ? 0 : 1 }).forEach(x => items.push(x));
  items.push(atom(xA, y, M.el, { d: 88 }), atom(xB, y, M.el, { d: 88 }));
  items.push(line(cx - len / 2, 330, cx + len / 2, 330, { t: 2, bg: MUTED, op: broken ? 0 : 1 }));
  items.push(txt(cx, 360, broken ? '' : M.L.toFixed(2) + ' × 10⁻¹⁰ m', { fs: 18, c: MUTED, fw: 500 }));
  const top = 60, H = 360, bx = 680;
  items.push(box(bx, top + H / 2, 54, H, { bg: '#fff', bd: '2px solid ' + INK, r: '8px', z: 2 }));
  const fh = Math.min(1, e / 1000) * (H - 8);
  items.push(box(bx, top + H - 4 - fh / 2, 44, Math.max(fh, 0.1), { bg: broken ? OK : ELEC, r: '5px', z: 3, tr: 'all .15s' }));
  const ty = top + H - 4 - (M.E / 1000) * (H - 8);
  items.push(line(bx - 44, ty, bx + 44, ty, { t: 3, bg: BAD, z: 4 }), txt(bx - 90, ty, M.E + '', { fs: 17, c: BAD }));
  items.push(txt(bx, top - 26, 'kJ/mol', { fs: 15, c: MUTED, fw: 500 }));
  return {
    title: 'اكسري الرابطة', prompt: 'اختاري جزيئًا، ثم زيدي الطاقة بالمنزلق حتى تنكسر الرابطة. قارني بين الجزيئات الثلاثة.',
    groups: [{ label: 'الجزيء', opts: ['F2', 'O2', 'N2'].map(x => opt(x.replace('2', '₂'), x === m, () => set({ m: x, e: 0 }))) }],
    slider: { label: 'الطاقة المعطاة', min: 0, max: 1000, step: 5, value: e, change: ev => set({ e: +ev.target.value }), valueLabel: e + ' kJ/mol' },
    items,
    readouts: [{ k: 'نوع الرابطة', v: ['', 'أحادية', 'ثنائية', 'ثلاثية'][M.k] }, { k: 'طول الرابطة', v: M.L + ' × 10⁻¹⁰ m' }, { k: 'طاقة التفكك', v: M.E + ' kJ/mol' }, { k: 'الحالة', v: broken ? 'انكسرت' : 'متماسكة', c: broken ? OK : INK }],
    insight: broken ? { tone: 'ok', text: 'انكسرت الرابطة عند ' + M.E + ' kJ/mol. ' + (m === 'N2' ? 'الرابطة الثلاثية الأقصر هي الأقوى.' : 'جرّبي N₂: رابطته الثلاثية أقصر، فهل تحتاج طاقة أكبر؟') }
      : { tone: 'info', text: 'الطاقة غير كافية؛ تحتاجين إلى ' + (M.E - e) + ' kJ/mol إضافية لكسر هذه الرابطة.' }
  };
}

// ---------- o5: مركبات من الكتاب ----------
function o5(s, set) {
  const L = [
    { a: 'N', na: 2, b: 'O', nb: 1, name: 'أكسيد ثنائي النيتروجين', A: 'النيتروجين', B: 'أكسيد', pa: 'ثنائي', pb: '' },
    { a: 'P', na: 2, b: 'O', nb: 5, name: 'خامس أكسيد ثنائي الفوسفور', A: 'الفوسفور', B: 'أكسيد', pa: 'ثنائي', pb: 'خامس' },
    { a: 'C', na: 1, b: 'O', nb: 2, name: 'ثاني أكسيد الكربون', A: 'الكربون', B: 'أكسيد', pa: '', pb: 'ثاني' },
    { a: 'N', na: 1, b: 'F', nb: 3, name: 'ثلاثي فلوريد النيتروجين', A: 'النيتروجين', B: 'فلوريد', pa: '', pb: 'ثلاثي' },
    { a: 'C', na: 1, b: 'Cl', nb: 4, name: 'رباعي كلوريد الكربون', A: 'الكربون', B: 'كلوريد', pa: '', pb: 'رباعي' },
    { a: 'Cl', na: 1, b: 'F', nb: 3, name: 'ثلاثي فلوريد الكلور', A: 'الكلور', B: 'فلوريد', pa: '', pb: 'ثلاثي' },
    { a: 'As', na: 2, b: 'O', nb: 3, name: 'ثالث أكسيد ثنائي الزرنيخ', A: 'الزرنيخ', B: 'أكسيد', pa: 'ثنائي', pb: 'ثالث' },
    { a: 'P', na: 2, b: 'O', nb: 3, name: 'ثلاثي أكسيد ثنائي الفوسفور', A: 'الفوسفور', B: 'أكسيد', pa: 'ثنائي', pb: 'ثلاثي' },
    { a: 'S', na: 2, b: 'F', nb: 10, name: 'عشاري فلوريد ثنائي الكبريت', A: 'الكبريت', B: 'فلوريد', pa: 'ثنائي', pb: 'عشاري' }
  ];
  const i = s.i || 0, m = L[i], st = s.st || 0;
  const f = m.a + sub(m.na) + m.b + sub(m.nb);
  const items = [txt(400, 70, f, { fs: 54, fw: 600, dir: 'ltr' })];
  for (let k = 0; k < 4; k++) { const x = 400 + (k - (m.na - 1) / 2) * 76; items.push(atom(k < m.na ? x : 400, 185, m.a, { d: 60, r: '12px', op: k < m.na ? 1 : 0 })); }
  for (let k = 0; k < 10; k++) { const x = 400 + (k - (m.nb - 1) / 2) * 64; items.push(atom(k < m.nb ? x : 400, 290, m.b, { d: 52, r: '12px', op: k < m.nb ? 1 : 0 })); }
  const parts = [st >= 2 && m.pb ? m.pb : null, st >= 1 ? m.B : null, st >= 3 && m.pa ? m.pa : null, st >= 3 ? m.A : null].filter(Boolean);
  items.push(txt(400, 420, parts.length ? parts.join(' ') : '؟', { fs: 34, fw: 700, c: st >= 3 ? OK : ACC }));
  const STEPS = ['اكتبي اسم العنصر الثاني مع المقطع (يد)', 'أضيفي بادئة عدد ذرات العنصر الثاني', 'أضيفي اسم العنصر الأول وبادئته', ''];
  return {
    title: 'ابني الاسم', prompt: 'اختاري مركبًا ورد في الكتاب، ثم ابني اسمه بتطبيق القواعد خطوة بخطوة.',
    groups: [{ label: 'المركب', opts: L.map((x, k) => opt(x.a + sub(x.na) + x.b + sub(x.nb), k === i, () => set({ i: k, st: 0 }))) }],
    actions: st < 3 ? [{ label: STEPS[st], primary: true, go: () => set({ st: st + 1 }) }, { label: 'أعيدي', go: () => set({ st: 0 }) }] : [{ label: 'مركب آخر', primary: true, go: () => set({ i: (i + 1) % L.length, st: 0 }) }],
    items,
    readouts: [{ k: 'العنصر الثاني (' + m.b + ')', v: st >= 1 ? m.B : '؟' }, { k: 'عدد ذرات ' + m.b, v: m.nb + (st >= 2 ? (m.pb ? ' ← ' + m.pb : ' ← بلا بادئة') : '') }, { k: 'عدد ذرات ' + m.a, v: m.na + (st >= 3 ? (m.pa ? ' ← ' + m.pa : ' ← بلا بادئة') : '') }],
    insight: st >= 3 ? { tone: 'ok', text: f + ' ← ' + m.name } : { tone: 'info', text: 'يُذكر اسم العنصر الثاني أولًا، ويُذكر اسم العنصر الأول كاملًا.' }
  };
}

// ---------- o6: خريطة تسمية الأحماض ----------
function o6(s, set) {
  const AC = [
    { f: 'HCl', oxy: false, name: 'حمض الهيدروكلوريك' }, { f: 'HF', oxy: false, name: 'حمض الهيدروفلوريك' }, { f: 'HCN', oxy: false, name: 'حمض الهيدروسيانيك' },
    { f: 'HNO₃', oxy: true, ion: 'نترات', end: 'ات', name: 'حمض النيتريك' }, { f: 'HNO₂', oxy: true, ion: 'نيتريت', end: 'يت', name: 'حمض النيتروز' },
    { f: 'HClO₃', oxy: true, ion: 'كلورات', end: 'ات', name: 'حمض الكلوريك' }, { f: 'HClO₂', oxy: true, ion: 'كلوريت', end: 'يت', name: 'حمض الكلوروز' }
  ];
  const ai = s.a || 0, a = AC[ai], st = s.st || 0, done = a.oxy ? st >= 3 : st >= 2;
  const wrong = s.wrong;
  const go = ok => ok ? set({ st: st + 1, wrong: false }) : set({ wrong: true });
  let q = null;
  if (st === 0) q = { ask: 'هل يحتوي ' + a.f + ' على أكسجين؟', opts: [['نعم', a.oxy], ['لا', !a.oxy]] };
  else if (!a.oxy && st === 1) q = { ask: 'كيف يُبنى اسم الحمض الثنائي؟', opts: [['حمض + هيدرو + جذر + يك', true], ['حمض + جذر + وز', false], ['حمض + جذر + يك', false]] };
  else if (a.oxy && st === 1) q = { ask: 'اسم الأيون الأكسجيني ' + a.ion + '. بماذا ينتهي؟', opts: [['ات', a.end === 'ات'], ['يت', a.end === 'يت']] };
  else if (a.oxy && st === 2) q = { ask: 'بماذا نستبدل المقطع (' + a.end + ')؟', opts: [['يك', a.end === 'ات'], ['وز', a.end === 'يت']] };
  const on = (cond) => cond ? { bg: INK, c: '#fff', bd: '2px solid ' + INK } : { bg: '#fff', c: INK, bd: '2px solid ' + LINE };
  const N = (x, y, w, t, active, faded) => box(x, y, w, 54, Object.assign({ t, fs: 17, op: faded ? 0.35 : 1 }, on(active)));
  const binPath = !a.oxy, items = [];
  const e = (x1, y1, x2, y2, act) => items.push(line(x1, y1, x2, y2, { t: 3, bg: act ? INK : LINE, z: 1 }));
  e(400, 60, 400, 140, st >= 0); e(400, 140, 220, 245, binPath && st >= 1); e(400, 140, 580, 245, !binPath && st >= 1);
  e(220, 245, 220, 345, binPath && st >= 2); e(580, 245, 480, 345, !binPath && st >= 2 && a.end === 'ات'); e(580, 245, 680, 345, !binPath && st >= 2 && a.end === 'يت');
  e(220, 345, 400, 448, binPath && done); e(480, 345, 400, 448, done && a.end === 'ات'); e(680, 345, 400, 448, done && a.end === 'يت');
  items.push(N(400, 60, 150, a.f, true));
  items.push(N(400, 145, 190, 'يحتوي على أكسجين؟', st >= 1));
  items.push(N(220, 245, 170, 'حمض ثنائي', binPath && st >= 1, st >= 1 && !binPath));
  items.push(N(580, 245, 170, 'حمض أكسجيني', !binPath && st >= 1, st >= 1 && binPath));
  items.push(N(220, 345, 190, 'هيدرو … يك', binPath && st >= 2, st >= 1 && !binPath));
  items.push(N(480, 345, 150, 'ات ← يك', !binPath && st >= 3 && a.end === 'ات', st >= 1 && (binPath || (st >= 2 && a.end !== 'ات'))));
  items.push(N(680, 345, 150, 'يت ← وز', !binPath && st >= 3 && a.end === 'يت', st >= 1 && (binPath || (st >= 2 && a.end !== 'يت'))));
  items.push(box(400, 448, 300, 58, { t: done ? a.name : '؟', fs: 20, bg: done ? OK : '#fff', c: done ? '#fff' : MUTED, bd: '2px solid ' + (done ? OK : LINE) }));
  return {
    title: 'خريطة تسمية الأحماض', prompt: 'اختاري حمضًا، ثم أجيبي عن أسئلة الخريطة خطوة بخطوة حتى تصلي إلى اسمه.',
    groups: [{ label: 'الحمض', opts: AC.map((x, i) => opt(x.f, i === ai, () => set({ a: i, st: 0, wrong: false }))) }],
    question: q ? { ask: q.ask, opts: q.opts.map(o => ({ label: o[0], go: () => go(o[1]) })) } : null,
    actions: done ? [{ label: 'جرّبي حمضًا آخر', primary: true, go: () => set({ a: (ai + 1) % AC.length, st: 0, wrong: false }) }] : [],
    items,
    readouts: [{ k: 'نوع الحمض', v: st >= 1 ? (a.oxy ? 'أكسجيني' : 'ثنائي') : '؟' }, { k: 'الاسم', v: done ? a.name : '؟', c: done ? OK : MUTED }],
    insight: wrong ? { tone: 'bad', text: 'ليس صحيحًا؛ راجعي القاعدة وحاولي مرة أخرى.' } : done ? { tone: 'ok', text: a.f + ' ← ' + a.name + (a.f === 'HCN' ? '. لا يحتوي على أكسجين، وجذر الاسم من أيون السيانيد.' : '.') } : { tone: 'info', text: 'الكلمة الأولى في اسم الحمض دائمًا «حمض».' }
  };
}

// ---------- o7: منشئ تراكيب لويس ----------
const MOLS7 = {
  CO2: { label: 'CO₂', avail: 16, atoms: [['O', 200, 250], ['C', 400, 250], ['O', 600, 250]], bonds: [[0, 1], [1, 2]] },
  NH3: { label: 'NH₃', avail: 8, atoms: [['N', 400, 215], ['H', 240, 215], ['H', 560, 215], ['H', 400, 375]], bonds: [[0, 1], [0, 2], [0, 3]] },
  H2O: { label: 'H₂O', avail: 8, atoms: [['O', 400, 205], ['H', 265, 325], ['H', 535, 325]], bonds: [[0, 1], [0, 2]] },
  CH4: { label: 'CH₄', avail: 8, atoms: [['C', 400, 245], ['H', 400, 90], ['H', 400, 400], ['H', 230, 245], ['H', 570, 245]], bonds: [[0, 1], [0, 2], [0, 3], [0, 4]] }
};
function o7(s, set) {
  const key = s.m || 'CO2', M = MOLS7[key];
  const b = s.b || M.bonds.map(() => 1), lp = s.lp || M.atoms.map(() => 0);
  const dist = (x, y) => Math.abs(((x - y) % 360 + 540) % 360 - 180);
  const free = M.atoms.map((a, i) => {
    if (a[0] === 'H') return [];
    const nb = M.bonds.filter(q => q[0] === i || q[1] === i).map(q => M.atoms[q[0] === i ? q[1] : q[0]]);
    const bang = nb.map(o => Math.atan2(o[2] - a[2], o[1] - a[1]) / D);
    const sx = nb.reduce((t, o) => t - (o[1] - a[1]) / Math.hypot(o[1] - a[1], o[2] - a[2]), 0), sy = nb.reduce((t, o) => t - (o[2] - a[2]) / Math.hypot(o[1] - a[1], o[2] - a[2]), 0);
    const opp = Math.hypot(sx, sy) < 0.1 ? -90 : Math.atan2(sy, sx) / D;
    const sd = g => ((g - opp) % 360 + 540) % 360 - 180;
    const cand = [-90, 90, 180, 0, -135, -45, 135, 45].filter(g => bang.every(bb => dist(g, bb) >= 60));
    const pick = [];
    cand.sort((p, q) => Math.abs(sd(p)) - Math.abs(sd(q))).forEach(g => { if (pick.length < 3 && pick.every(p => dist(p, g) >= 45)) pick.push(g); });
    pick.sort((p, q) => sd(p) - sd(q));
    return pick;
  });
  const lpDirs = (i, k) => { const f = free[i]; if (k >= f.length) return f; if (k === 0) return []; if (k === 1) return [f.reduce((p, g) => Math.abs(((g - f[Math.floor(f.length / 2)]))) < Math.abs(p - f[Math.floor(f.length / 2)]) ? g : p, f[Math.floor(f.length / 2)])]; return [f[0], f[f.length - 1]]; };
  const around = M.atoms.map((a, i) => 2 * M.bonds.reduce((t, q, j) => t + ((q[0] === i || q[1] === i) ? b[j] : 0), 0) + 2 * lp[i]);
  const target = M.atoms.map(a => a[0] === 'H' ? 2 : 8);
  const used = 2 * b.reduce((x, y) => x + y, 0) + 2 * lp.reduce((x, y) => x + y, 0);
  const okAtoms = around.filter((v, i) => v === target[i]).length, allOk = okAtoms === M.atoms.length && used === M.avail;
  const items = [];
  M.bonds.forEach((q, j) => {
    const A = M.atoms[q[0]], B = M.atoms[q[1]], hasH = A[0] === 'H' || B[0] === 'H';
    bonds(A[1], A[2], B[1], B[2], b[j], { ra: 34, rb: 34, gap: 13 }).forEach(x => items.push(x));
    items.push(box((A[1] + B[1]) / 2, (A[2] + B[2]) / 2, 80, 56, { bg: 'transparent', z: 8, click: hasH ? null : () => { const nb = b.slice(); nb[j] = nb[j] % 3 + 1; set({ b: nb }); } }));
  });
  M.atoms.forEach((a, i) => {
    const max = free[i].length;
    items.push(atom(a[1], a[2], a[0], { d: 66, click: max ? () => { const nl = lp.slice(); nl[i] = (nl[i] + 1) % (max + 1); set({ lp: nl }); } : null }));
    const shown = lpDirs(i, lp[i]);
    for (let k = 0; k < 3; k++) {
      const g = shown[k], vis = g != null, d = vis ? [Math.cos(g * D), Math.sin(g * D)] : [0, 0], p = [-d[1], d[0]], cx = a[1] + d[0] * 50, cy = a[2] + d[1] * 50;
      items.push(dot(cx + p[0] * 9, cy + p[1] * 9, { op: vis ? 1 : 0, s: 10 }), dot(cx - p[0] * 9, cy - p[1] * 9, { op: vis ? 1 : 0, s: 10 }));
    }
    const good = around[i] === target[i];
    items.push(box(a[1] + 58, a[2] - 58, 32, 32, { r: '50%', t: String(around[i]), fs: 15, bg: good ? OK : '#fff', c: good ? '#fff' : around[i] > target[i] ? BAD : MUTED, bd: '2px solid ' + (good ? OK : around[i] > target[i] ? BAD : LINE), z: 9 }));
  });
  let ins;
  if (allOk) ins = { tone: 'ok', text: 'تركيب لويس صحيح! استخدمتِ ' + M.avail + ' إلكترونًا وحققت كل ذرة الثمانية' + (M.atoms.some(a => a[0] === 'H') ? ' (والهيدروجين إلكترونين)' : '') + '.' };
  else if (used > M.avail) ins = { tone: 'bad', text: 'استخدمتِ ' + used + ' إلكترونًا، والمتوافر ' + M.avail + ' فقط. قللي الأزواج غير الرابطة أو الروابط.' };
  else if (used < M.avail) ins = { tone: 'info', text: 'بقي ' + (M.avail - used) + ' إلكترونات لم توزَّع. أضيفي أزواجًا غير رابطة بالضغط على الذرات.' };
  else { const bad = M.atoms.find((a, i) => around[i] < target[i]); ins = { tone: 'bad', text: 'وزّعتِ كل الإلكترونات، لكن ذرة ' + (bad ? bad[0] : '') + ' لم تحقق الثمانية. حوّلي زوجًا غير رابط إلى رابطة متعددة.' }; }
  return {
    title: 'منشئ تراكيب لويس', prompt: 'اضغطي على الرابطة لتغيير نوعها (أحادية ← ثنائية ← ثلاثية)، وعلى الذرة لإضافة زوج غير رابط. الرقم بجانب كل ذرة = الإلكترونات حولها.',
    groups: [{ label: 'الجزيء', opts: Object.keys(MOLS7).map(k => opt(MOLS7[k].label, k === key, () => set({ m: k, b: null, lp: null }))) }],
    actions: [{ label: 'ابدئي من جديد', go: () => set({ b: null, lp: null }) }],
    items,
    readouts: [{ k: 'الإلكترونات المتوافرة', v: String(M.avail) }, { k: 'المستخدمة', v: String(used), c: used > M.avail ? BAD : used === M.avail ? OK : INK }, { k: 'ذرات حققت الثمانية', v: okAtoms + ' / ' + M.atoms.length, c: okAtoms === M.atoms.length ? OK : INK }],
    insight: ins
  };
}

// ---------- o8: الرنين ----------
function o8(s, set) {
  const pos = s.pos || 0, real = !!s.real, N = [400, 265], O = [[400, 105], [255, 350], [545, 350]], items = [];
  O.forEach((o, i) => {
    const dbl = !real && i === pos;
    const L = Math.hypot(o[0] - N[0], o[1] - N[1]), ux = (o[0] - N[0]) / L, uy = (o[1] - N[1]) / L, px = -uy, py = ux, ra = 34, rb = 34;
    const g = real || dbl ? 7 : 0;
    items.push(line(N[0] + ux * ra + px * g, N[1] + uy * ra + py * g, o[0] - ux * rb + px * g, o[1] - uy * rb + py * g, { t: 5 }));
    items.push(line(N[0] + ux * ra - px * 7, N[1] + uy * ra - py * 7, o[0] - ux * rb - px * 7, o[1] - uy * rb - py * 7, real ? { t: 0, bg: 'transparent', bd: '2.5px dashed ' + INK } : { t: 5, op: dbl ? 1 : 0 }));
  });
  items.push(atom(N[0], N[1], 'N', { d: 70 }));
  O.forEach((o, i) => {
    const dbl = !real && i === pos, n = dbl ? 2 : 3;
    items.push(atom(o[0], o[1], 'O', { d: 66, click: real ? null : () => set({ pos: i }) }));
    const ux0 = (o[0] - N[0]), uy0 = (o[1] - N[1]), L = Math.hypot(ux0, uy0), base = Math.atan2(uy0 / L, ux0 / L);
    [-75, 0, 75].forEach((a, k) => {
      const ang = base + a * D, cx = o[0] + Math.cos(ang) * 50, cy = o[1] + Math.sin(ang) * 50, px = -Math.sin(ang), py = Math.cos(ang);
      const vis = real ? 0.25 : (k < n ? 1 : 0);
      items.push(dot(cx + px * 9, cy + py * 9, { op: vis, s: 10 }), dot(cx - px * 9, cy - py * 9, { op: vis, s: 10 }));
    });
  });
  items.push(txt(140, 70, 'NO₃⁻', { fs: 34 }));
  return {
    title: 'أشكال الرنين', prompt: 'اضغطي على أي ذرة أكسجين لنقل الرابطة الثنائية إليها. لاحظي ما يتحرك وما يبقى ثابتًا، ثم اعرضي الصورة الحقيقية.',
    groups: [{ label: 'الشكل', opts: [0, 1, 2].map(i => opt('الشكل ' + (i + 1), !real && pos === i, () => set({ pos: i, real: false }))).concat([opt('الصورة الحقيقية', real, () => set({ real: true }))]) }],
    items,
    readouts: [{ k: 'الشكل المعروض', v: real ? 'المتوسط' : (pos + 1) + ' من 3' }, { k: 'مواقع الذرات', v: 'ثابتة', c: OK }, { k: 'أطوال الروابط', v: real ? 'متساوية' : 'ثنائية أقصر + أحاديتان', c: real ? OK : INK }],
    insight: real ? { tone: 'ok', text: 'الروابط الثلاث متماثلة في الواقع: أقصر من الأحادية وأطول من الثنائية، وطولها هو المتوسط الحسابي لأشكال الرنين.' }
      : { tone: 'info', text: 'تحركت أزواج الإلكترونات فقط؛ الذرات بقيت في أماكنها. هذه ثلاثة تراكيب لويس متكافئة للأيون نفسه.' }
  };
}

// ---------- o9: صنّفي الاستثناء ----------
function o9(s, set) {
  const L = [
    { f: 'NO₂', c: 'N', lig: ['O', 'O'], tot: 17, cat: 0, n: 0, note: '5 + 12 = 17 إلكترون تكافؤ: عدد فردي لا يكوّن أزواجًا كاملة.' },
    { f: 'BH₃', c: 'B', lig: ['H', 'H', 'H'], tot: 6, cat: 1, n: 6, note: 'تتشارك ذرة البورون بستة إلكترونات فقط في ثلاث روابط.' },
    { f: 'SF₆', c: 'S', lig: ['F', 'F', 'F', 'F', 'F', 'F'], tot: 48, cat: 2, n: 12, note: 'ست روابط = 12 إلكترونًا حول S بفضل المستوى d.' },
    { f: 'NO', c: 'N', lig: ['O'], tot: 11, cat: 0, n: 0, note: '5 + 6 = 11 إلكترون تكافؤ: عدد فردي.' },
    { f: 'PCl₅', c: 'P', lig: ['Cl', 'Cl', 'Cl', 'Cl', 'Cl'], tot: 40, cat: 2, n: 10, note: 'خمس روابط = 10 إلكترونات حول P.' },
    { f: 'ClO₂', c: 'Cl', lig: ['O', 'O'], tot: 19, cat: 0, n: 0, note: '7 + 12 = 19 إلكترون تكافؤ: عدد فردي.' },
    { f: 'XeF₄', c: 'Xe', lig: ['F', 'F', 'F', 'F'], tot: 36, cat: 2, n: 12, note: '4 روابط + زوجان غير رابطين = 12 إلكترونًا حول Xe.' }
  ];
  const CATS = ['عدد فردي من الإلكترونات', 'أقل من ثمانية', 'أكثر من ثمانية'];
  const i = s.i || 0, ans = s.ans == null ? null : s.ans, score = s.score || 0, fin = i >= L.length;
  const m = L[Math.min(i, L.length - 1)], items = [];
  const cx = 400, cy = 245, R = 175;
  for (let k = 0; k < 6; k++) {
    const vis = k < m.lig.length, a = (-90 + k * 360 / m.lig.length) * D, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * 0.95;
    items.push(line(cx, cy, vis ? x : cx, vis ? y : cy, { t: 5, op: vis && !fin ? 1 : 0, z: 1 }));
    items.push(atom(vis ? x : cx, vis ? y : cy, vis ? m.lig[k] : 'H', { d: 54, op: vis && !fin ? 1 : 0 }));
  }
  items.push(atom(cx, cy, m.c, { d: 84, op: fin ? 0 : 1 }));
  for (let k = 0; k < 12; k++) {
    const show = ans !== null && k < m.n, a = (-90 + k * 360 / Math.max(m.n, 1)) * D;
    items.push(dot(cx + Math.cos(a) * 64, cy + Math.sin(a) * 64, { op: show ? 1 : 0, s: 12 }));
  }
  items.push(txt(cx, cy + 0, '', {}));
  items.push(txt(cx, 470, ans !== null ? (m.cat === 0 ? 'الإلكترونات الكلية: ' + m.tot + ' (فردي)' : m.n + ' إلكترونات حول ' + m.c) : (fin ? '' : 'كم إلكترونًا حول ' + m.c + '؟'), { fs: 20, c: ans !== null ? ACC : MUTED }));
  items.push(txt(cx, cy, fin ? score + ' / ' + L.length : '', { fs: 64 }));
  const correct = ans !== null && ans === m.cat;
  return {
    title: 'صنّفي الاستثناء', prompt: 'لكل جزيء: عدّي الروابط حول الذرة المركزية واحسبي إلكترونات التكافؤ، ثم صنّفيه في إحدى الحالات الثلاث.',
    groups: [],
    question: !fin && ans === null ? { ask: m.f + ' — الإلكترونات الكلية: ' + m.tot + '. أي حالة؟', opts: CATS.map((c, k) => ({ label: c, go: () => set({ ans: k, score: score + (k === m.cat ? 1 : 0) }) })) } : null,
    actions: fin ? [{ label: 'أعيدي النشاط', primary: true, go: () => set({ i: 0, ans: null, score: 0 }) }] : ans !== null ? [{ label: i + 1 < L.length ? 'الجزيء التالي' : 'عرض النتيجة', primary: true, go: () => set({ i: i + 1, ans: null }) }] : [],
    items,
    readouts: [{ k: 'الجزيء', v: fin ? '—' : m.f }, { k: 'التقدم', v: Math.min(i + 1, L.length) + ' من ' + L.length }, { k: 'نتيجتك', v: score + ' / ' + L.length, c: OK }],
    insight: fin ? { tone: 'ok', text: 'أنهيتِ التصنيف: ' + score + ' من ' + L.length + '. تذكّري الحالات: عدد فردي، أقل من ثمانية، أكثر من ثمانية.' }
      : ans === null ? { tone: 'info', text: 'تلميح: إذا كان العدد الكلي فرديًّا فلا يمكن تكوين أزواج كاملة.' }
        : { tone: correct ? 'ok' : 'bad', text: (correct ? 'صحيح. ' : 'ليس صحيحًا، الحالة: ' + CATS[m.cat] + '. ') + m.note }
  };
}

// ---------- o10: بالونات التنافر ----------
function o10(s, set) {
  const n = s.n || 4, lp = n === 4 ? (s.lp || 0) : 0, rx = -22, ry = 50;
  const SH = { 2: ['خطي', '180°'], 3: ['مثلث مستوٍ', '120°'], 4: [['رباعي الأوجه منتظم', '109.5°'], ['مثلثي هرمي', '107.3°'], ['منحنٍ', '104.5°']], 5: ['ثنائي الهرم الثلاثي', '90° و 120°'], 6: ['ثماني الأوجه', '90°'] };
  const sh = n === 4 ? SH[4][lp] : SH[n];
  let dirs = GEO[n].map(v => v.slice());
  const isLone = k => n === 4 && k < lp;
  if (lp) { const ld = dirs.slice(0, lp).reduce((a, v) => [a[0] + v[0], a[1] + v[1], a[2] + v[2]], [0, 0, 0]); dirs = dirs.map((v, k) => k < lp ? v : norm([v[0] - ld[0] * 0.12, v[1] - ld[1] * 0.12, v[2] - ld[2] * 0.12])); }
  const items = [];
  for (let k = 0; k < 6; k++) {
    const vis = k < n, v = vis ? dirs[k] : [0, 0, 0.01], p = proj(v, rx, ry), L2 = Math.hypot(p[0], p[1]);
    const ang = Math.atan2(-p[1], p[0]) / D, big = isLone(k) ? 1.18 : 1;
    const len = (70 + 110 * L2) * big, cx = 400 + p[0] * 105 * big, cy = 250 - p[1] * 105 * big;
    items.push(blob(vis ? cx : 400, vis ? cy : 250, vis ? len : 10, vis ? 96 * big : 10, { rot: ang, bg: isLone(k) ? 'rgba(123,97,201,.55)' : 'rgba(35,70,216,.32)', bd: '2px solid ' + (isLone(k) ? LONE : ACC), op: vis ? 1 : 0, z: 10 + Math.round(p[2] * 8) }));
  }
  items.push(dot(400, 250, { s: 18, bg: INK, z: 30 }));
  items.push(txt(120, 460, sh[1], { fs: 30, c: INK }));
  return {
    title: 'بالونات التنافر', prompt: 'كل بالون منطقة كثافة إلكترونية. غيّري عددها وراقبي كيف تتباعد لتقلل التنافر. مع 4 مناطق جرّبي جعل بعضها أزواجًا غير رابطة.',
    groups: [{ label: 'عدد مناطق الكثافة', opts: [2, 3, 4, 5, 6].map(k => opt(String(k), k === n, () => set({ n: k, lp: 0 }))) }].concat(n === 4 ? [{ label: 'منها أزواج غير رابطة', opts: [0, 1, 2].map(k => opt(String(k), k === lp, () => set({ lp: k }))) }] : []),
    items,
    readouts: [{ k: 'المناطق', v: String(n) }, { k: 'الشكل', v: sh[0] }, { k: 'زاوية الرابطة', v: sh[1], c: ACC }],
    legend: [{ c: ACC, t: 'زوج رابط' }, { c: LONE, t: 'زوج غير رابط' }],
    insight: lp ? { tone: 'ok', text: 'الزوج غير الرابط يحتل حيزًا أكبر قليلًا، فيضغط الروابط وتصغر الزاوية من 109.5° إلى ' + sh[1] + '.' }
      : { tone: 'info', text: 'تتباعد المناطق إلى أقصى حد ممكن: هذا هو أساس نموذج VSEPR.' }
  };
}

// ---------- o11: عارض ثلاثي الأبعاد ----------
const MOLS11 = {
  BeCl2: { label: 'BeCl₂', c: 'Be', geo: 2, lig: ['Cl', 'Cl'], lone: 0, shape: 'خطي', ang: '180°', hyb: 'sp' },
  AlCl3: { label: 'AlCl₃', c: 'Al', geo: 3, lig: ['Cl', 'Cl', 'Cl'], lone: 0, shape: 'مثلث مستوٍ', ang: '120°', hyb: 'sp²' },
  CH4: { label: 'CH₄', c: 'C', geo: 4, lig: ['H', 'H', 'H', 'H'], lone: 0, shape: 'رباعي الأوجه منتظم', ang: '109.5°', hyb: 'sp³' },
  PH3: { label: 'PH₃', c: 'P', geo: 4, lig: ['H', 'H', 'H'], lone: 1, shape: 'مثلثي هرمي', ang: '107.3°', hyb: 'sp³' },
  H2O: { label: 'H₂O', c: 'O', geo: 4, lig: ['H', 'H'], lone: 2, shape: 'منحنٍ', ang: '104.5°', hyb: 'sp³' },
  NbBr5: { label: 'NbBr₅', c: 'Nb', geo: 5, lig: ['Br', 'Br', 'Br', 'Br', 'Br'], lone: 0, shape: 'ثنائي الهرم الثلاثي', ang: '90° و 120°', hyb: 'sp³d' },
  SF6: { label: 'SF₆', c: 'S', geo: 6, lig: ['F', 'F', 'F', 'F', 'F', 'F'], lone: 0, shape: 'ثماني الأوجه منتظم', ang: '90°', hyb: 'sp³d²' }
};
function o11(s, set) {
  const key = s.m || 'CH4', M = MOLS11[key], rx = s.rx == null ? -15 : s.rx, ry = s.ry == null ? 25 : s.ry, auto = s.auto !== false;
  let dirs = GEO[M.geo].map(v => v.slice());
  if (key === 'H2O') { const r3 = Math.sqrt(3); dirs = [[1 / r3, 1 / r3, 1 / r3], [-1 / r3, 1 / r3, -1 / r3], [-1 / r3, -1 / r3, 1 / r3], [1 / r3, -1 / r3, -1 / r3]]; }
  const items = [], R = 165, cx = 400, cy = 250, NOTR = 'none';
  for (let k = 0; k < 6; k++) {
    const vis = k < dirs.length, isL = k < M.lone, v = vis ? dirs[k] : [0, 0, 0], p = proj(v, rx, ry);
    const x = cx + p[0] * R, y = cy - p[1] * R, z = p[2];
    if (isL) {
      const L2 = Math.hypot(p[0], p[1]), ang = Math.atan2(-p[1], p[0]) / D;
      items.push(line(cx, cy, cx, cy, { op: 0, tr: NOTR }));
      items.push(blob(cx + p[0] * 80, cy - p[1] * 80, 60 + 90 * L2, 74, { rot: ang, bg: 'rgba(123,97,201,.45)', bd: '2px solid ' + LONE, z: 20 + Math.round(z * 10), tr: NOTR }));
    } else {
      items.push(line(cx, cy, vis ? x : cx, vis ? y : cy, { t: 7, bg: '#8C929C', z: 20 + Math.round(z * 5), op: vis ? 1 : 0, tr: NOTR }));
      const el = vis ? M.lig[k - M.lone] : 'H';
      items.push(atom(vis ? x : cx, vis ? y : cy, el, { d: (el === 'H' ? 48 : 62) * (1 + z * 0.16), z: 20 + Math.round(z * 10) + 1, op: vis ? 1 : 0, tr: NOTR }));
    }
  }
  items.push(atom(cx, cy, M.c, { d: 76, z: 21, tr: NOTR }));
  return {
    title: 'أشكال الجزيئات ثلاثية الأبعاد', prompt: 'اختاري جزيئًا من الجدول 4-6 واسحبيه بالفأرة أو بإصبعك لتدويره. الفصوص البنفسجية أزواج غير رابطة.',
    groups: [{ label: 'الجزيء', opts: Object.keys(MOLS11).map(k => opt(MOLS11[k].label, k === key, () => set({ m: k }))) }],
    actions: [{ label: auto ? 'أوقفي الدوران' : 'دوران تلقائي', go: () => set({ auto: !auto }) }],
    items,
    drag: {
      down: e => { set({ drag: [e.clientX, e.clientY, rx, ry], auto: false }); try { e.currentTarget.setPointerCapture(e.pointerId); } catch (x) {} },
      move: e => { const d = s.drag; if (!d) return; set({ ry: d[3] + (e.clientX - d[0]) * 0.6, rx: Math.max(-85, Math.min(85, d[2] - (e.clientY - d[1]) * 0.6)) }); },
      up: () => set({ drag: null })
    },
    tick: auto ? () => set({ ry: ry + 0.9 }) : null,
    readouts: [{ k: 'الشكل', v: M.shape }, { k: 'زاوية الرابطة', v: M.ang, c: ACC }, { k: 'رابطة / غير رابطة', v: M.lig.length + ' / ' + M.lone }, { k: 'التهجين', v: M.hyb }],
    legend: [{ c: LONE, t: 'زوج غير رابط' }],
    insight: { tone: 'info', text: M.lone ? 'الأزواج غير الرابطة لا تظهر في اسم الشكل، لكنها تدفع الذرات وتصغّر الزاوية إلى ' + M.ang + '.' : 'لا توجد أزواج غير رابطة؛ تتوزع الروابط بانتظام والزاوية ' + M.ang + '.' }
  };
}

// ---------- o12: امزجي المستويات ----------
function o12(s, set) {
  const key = s.m || 'CH4', mixed = !!s.mixed;
  const M = { BeCl2: { label: 'BeCl₂', k: 1, hyb: 'sp', shape: 'خطي 180°' }, AlCl3: { label: 'AlCl₃', k: 2, hyb: 'sp²', shape: 'مثلث مستوٍ 120°' }, CH4: { label: 'CH₄', k: 3, hyb: 'sp³', shape: 'رباعي الأوجه 109.5°' } }[key];
  const n = 1 + M.k, items = [];
  items.push(txt(400, 40, mixed ? 'بعد التهجين' : 'قبل التهجين', { fs: 22, c: MUTED }));
  const el = key === 'CH4' ? [2, 1, 1, 0] : null;
  for (let i = 0; i < 4; i++) {
    const isH = mixed && i < n;
    let x, y, lab, bg = '#fff', bdc = INK;
    if (!mixed) { x = i === 0 ? 220 : 320 + i * 90; y = i === 0 ? 360 : 230; lab = i === 0 ? 's' : 'p'; }
    else if (isH) { x = 400 + (i - (n - 1) / 2) * 96; y = 290; lab = M.hyb; bg = ACC_SOFT; bdc = ACC; }
    else { const j = i - n; x = 560 + j * 96; y = 170; lab = 'p'; }
    items.push(box(x, y, 76, 76, { bg, bd: '2.5px solid ' + bdc, r: '8px', t: lab, fs: 22, c: isH ? ACC : INK }));
    const ne = el ? (mixed ? (i < 4 ? 1 : 0) : el[i]) : 0;
    items.push(dot(x - (ne === 2 ? 11 : 0), y + 26, { op: ne >= 1 ? 1 : 0, s: 12, z: 6 }), dot(x + 11, y + 26, { op: ne === 2 ? 1 : 0, s: 12, z: 6 }));
  }
  items.push(txt(610, 120, mixed && M.k < 3 ? 'غير مهجنة ← π' : '', { fs: 17, c: MUTED }));
  return {
    title: 'امزجي المستويات', prompt: 'اختاري جزيئًا، ثم اضغطي «امزجي» لتري كيف تختلط المستويات الفرعية وتتكوّن مستويات مهجنة متماثلة.',
    groups: [{ label: 'الجزيء', opts: ['BeCl2', 'AlCl3', 'CH4'].map(k => opt({ BeCl2: 'BeCl₂', AlCl3: 'AlCl₃', CH4: 'CH₄' }[k], k === key, () => set({ m: k, mixed: false }))) }],
    actions: [{ label: mixed ? 'أعيدي' : 'امزجي المستويات', primary: !mixed, go: () => set({ mixed: !mixed }) }],
    items,
    readouts: [{ k: 'المستويات الممزوجة', v: 's + ' + M.k + ' p' }, { k: 'الناتجة', v: n + ' × ' + M.hyb, c: ACC }, { k: 'p غير مهجنة', v: String(3 - M.k) }, { k: 'الشكل', v: M.shape }],
    insight: mixed ? { tone: 'ok', text: 'عدد المستويات المهجنة (' + n + ') = عدد المستويات المتداخلة' + (key === 'CH4' ? '، وفي كل مستوى sp³ إلكترون واحد يكوّن رابطة C—H.' : '. مستويات p غير المهجنة يمكن أن تكوّن روابط باي.') }
      : { tone: 'info', text: key === 'CH4' ? 'للكربون 2s² 2p²؛ قد تتوقعين رابطتين فقط، لكن التهجين يعطي أربعة مستويات متماثلة.' : 'يختلط مستوى s مع ' + (M.k === 1 ? 'مستوى p واحد' : 'مستويين من p') + ' في الذرة المركزية.' }
  };
}

// ---------- o13: منزلق الكهروسالبية ----------
const EN = { H: 2.20, Li: 0.98, Na: 0.93, C: 2.55, N: 3.04, O: 3.44, F: 3.98, S: 2.58, Cl: 3.16, Br: 2.96, I: 2.66 };
function o13(s, set) {
  const a = s.a || 'H', b = s.b || 'Cl', ea = EN[a], eb = EN[b], diff = Math.round(Math.abs(ea - eb) * 100) / 100;
  const type = diff === 0 ? 'تساهمية غير قطبية' : diff < 0.4 ? 'تساهمية غالبًا' : diff <= 1.7 ? 'تساهمية قطبية' : 'أيونية غالبًا';
  const X0 = 90, X1 = 710, sc = v => X0 + (Math.min(v, 3.3) / 3.3) * (X1 - X0), items = [];
  items.push(box((sc(0) + sc(0.4)) / 2, 100, sc(0.4) - sc(0), 40, { bg: '#ECEAE3', r: '6px 0 0 6px' }));
  items.push(box((sc(0.4) + sc(1.7)) / 2, 100, sc(1.7) - sc(0.4), 40, { bg: ACC_SOFT, r: '0' }));
  items.push(box((sc(1.7) + sc(3.3)) / 2, 100, sc(3.3) - sc(1.7), 40, { bg: '#F6E3C8', r: '0 6px 6px 0' }));
  items.push(txt((sc(0) + sc(0.4)) / 2, 58, 'تساهمية', { fs: 15, c: MUTED }), txt((sc(0.4) + sc(1.7)) / 2, 58, 'تساهمية قطبية', { fs: 15, c: ACC }), txt((sc(1.7) + sc(3.3)) / 2, 58, 'أيونية غالبًا', { fs: 15, c: ELEC }));
  [0, 0.4, 1.7, 3.3].forEach(v => items.push(txt(sc(v), 140, String(v), { fs: 14, c: MUTED, fw: 500 })));
  items.push(box(sc(diff), 100, 6, 62, { bg: INK, r: '3px', z: 6 }), txt(sc(diff), 170, 'Δ = ' + diff.toFixed(2), { fs: 18, z: 6 }));
  const xA = 250, xB = 550, y = 330, hi = ea === eb ? 0 : ea > eb ? -1 : 1, t = Math.min(diff / 1.7, 1), ionic = diff > 1.7;
  const px = 400 + hi * (ionic ? 150 : t * 110);
  items.push(blob(px, y, ionic ? 120 : 190 - t * 60, 110 - t * 20, { bg: 'rgba(217,130,30,.22)', bd: '2px solid ' + ELEC, z: 2 }));
  items.push(atom(xA, y, a, { d: 84 }), atom(xB, y, b, { d: 84 }));
  items.push(dot(px, y - 9, { s: 13, z: 8 }), dot(px, y + 9, { s: 13, z: 8 }));
  const lab = (side) => { if (diff < 0.4) return ''; const neg = side === (ea > eb ? 'a' : 'b'); return ionic ? (neg ? '−' : '+') : (neg ? 'δ⁻' : 'δ⁺'); };
  items.push(txt(xA, y - 70, lab('a'), { fs: 26, c: ACC }), txt(xB, y - 70, lab('b'), { fs: 26, c: ACC }));
  items.push(txt(xA, y + 66, ea.toFixed(2), { fs: 16, c: MUTED, fw: 500 }), txt(xB, y + 66, eb.toFixed(2), { fs: 16, c: MUTED, fw: 500 }));
  const keys = Object.keys(EN);
  return {
    title: 'شد الحبل الإلكتروني', prompt: 'اختاري ذرتين وراقبي إلى أين يُسحب زوج إلكترونات الرابطة، وأين يقع الفرق في الكهروسالبية على المقياس.',
    groups: [{ label: 'الذرة الأولى', opts: keys.map(k => opt(k, k === a, () => set({ a: k }))) }, { label: 'الذرة الثانية', opts: keys.map(k => opt(k, k === b, () => set({ b: k }))) }],
    items,
    readouts: [{ k: 'كهروسالبية ' + a, v: ea.toFixed(2) }, { k: 'كهروسالبية ' + b, v: eb.toFixed(2) }, { k: 'الفرق', v: diff.toFixed(2) }, { k: 'نوع الرابطة', v: type, c: ACC }],
    insight: { tone: 'info', text: diff === 0 ? 'ذرتان متماثلتان: الإلكترونات موزعة بالتساوي.' : ionic ? 'الفرق أكبر من 1.7: ينتقل الإلكترون إلى ' + (ea > eb ? a : b) + ' فتتكوّن رابطة أيونية غالبًا.' : 'تُسحب الإلكترونات نحو ' + (ea > eb ? a : b) + ' (الأعلى كهروسالبية) فيحمل الشحنة الجزئية السالبة.' }
  };
}

// ---------- o14: المجال الكهربائي ----------
function o14(s, set) {
  const key = s.m || 'H2O', on = !!s.on, t = s.t == null ? 0 : s.t;
  const M = {
    H2O: { label: 'H₂O', polar: true, shape: 'منحنٍ', atoms: [['O', 0, 0, 40], ['H', -33, 26, 28], ['H', 33, 26, 28]], b: [[0, 1], [0, 2]] },
    NH3: { label: 'NH₃', polar: true, shape: 'مثلثي هرمي', atoms: [['N', 0, 0, 40], ['H', -36, 20, 28], ['H', 36, 20, 28], ['H', 0, 40, 28]], b: [[0, 1], [0, 2], [0, 3]] },
    CCl4: { label: 'CCl₄', polar: false, shape: 'رباعي الأوجه متماثل', atoms: [['C', 0, 0, 34], ['Cl', -32, -32, 30], ['Cl', 32, -32, 30], ['Cl', -32, 32, 30], ['Cl', 32, 32, 30]], b: [[0, 1], [0, 2], [0, 3], [0, 4]] }
  }[key];
  const POS = [[250, 160], [400, 160], [550, 160], [250, 340], [400, 340], [550, 340]], BASE = [30, 160, 250, 80, 300, 200];
  const items = [], NOTR = 'none';
  items.push(box(80, 250, 22, 400, { bg: BAD, r: '4px', t: '+', c: '#fff', fs: 22 }), box(720, 250, 22, 400, { bg: ACC, r: '4px', t: '−', c: '#fff', fs: 22 }));
  for (let k = 0; k < 4; k++) items.push(line(100, 90 + k * 107, 700, 90 + k * 107, { t: 2, bg: MUTED, op: on ? 0.35 : 0, z: 0 }));
  POS.forEach((p, mi) => {
    const target = M.polar ? -90 : BASE[mi], ang = (BASE[mi] + (target - BASE[mi]) * t) * D, c = Math.cos(ang), sn = Math.sin(ang);
    const P = M.atoms.map(a => [p[0] + a[1] * c - a[2] * sn, p[1] + a[1] * sn + a[2] * c]);
    for (let j = 0; j < 4; j++) { const q = M.b[j]; items.push(q ? line(P[q[0]][0], P[q[0]][1], P[q[1]][0], P[q[1]][1], { t: 4, tr: NOTR }) : line(p[0], p[1], p[0], p[1], { op: 0, tr: NOTR })); }
    for (let j = 0; j < 5; j++) { const a = M.atoms[j]; items.push(a ? atom(P[j][0], P[j][1], a[0], { d: a[3], tr: NOTR, fs: a[3] * 0.4 }) : atom(p[0], p[1], 'H', { d: 1, op: 0, tr: NOTR })); }
  });
  const goal = on ? 1 : 0;
  return {
    title: 'الجزيئات في المجال الكهربائي', prompt: 'اختاري جزيئًا ثم شغّلي المجال الكهربائي. أي الجزيئات تنتظم داخله؟',
    groups: [{ label: 'الجزيء', opts: ['H2O', 'NH3', 'CCl4'].map(k => opt({ H2O: 'H₂O', NH3: 'NH₃', CCl4: 'CCl₄' }[k], k === key, () => set({ m: k, on: false, t: 0 }))) }],
    actions: [{ label: on ? 'أطفئي المجال' : 'شغّلي المجال الكهربائي', primary: !on, go: () => set({ on: !on }) }],
    items,
    tick: Math.abs(t - goal) > 0.001 ? () => set({ t: goal > t ? Math.min(1, t + 0.05) : Math.max(0, t - 0.05) }) : null,
    readouts: [{ k: 'الشكل', v: M.shape }, { k: 'القطبية', v: M.polar ? 'قطبي' : 'غير قطبي', c: M.polar ? ACC : MUTED }, { k: 'في المجال', v: !on ? '—' : M.polar ? 'ينتظم' : 'لا يتأثر' }],
    insight: !on ? { tone: 'info', text: 'الجزيئات موزعة عشوائيًّا. شغّلي المجال وراقبي.' }
      : M.polar ? { tone: 'ok', text: M.label + ' ثنائي القطب: شكله غير متماثل وروابطه قطبية، فيتجه طرفه السالب نحو اللوح الموجب.' }
        : { tone: 'ok', text: 'CCl₄ روابطه قطبية لكنه متماثل، فتتساوى الشحنات الجزئية حول المركز ولا ينجذب للمجال.' }
  };
}

// ---------- o15: سخّني المواد ----------
function o15(s, set) {
  const h = s.h || 0;
  const S = [{ n: 'البارافين', t: 'تساهمية جزيئية', mp: 40, c: '#E8DFC4', p: 'mol' }, { n: 'السكر', t: 'تساهمية جزيئية', mp: 40, c: '#FFFFFF', p: 'mol' }, { n: 'NaCl', t: 'أيونية', mp: 999, c: '#FFFFFF', p: 'ion' }, { n: 'الألماس', t: 'تساهمية شبكية', mp: 999, c: '#CFE3F2', p: 'net' }];
  const X = [130, 310, 490, 670], items = [];
  const rnd = (i, j) => { const v = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453; return v - Math.floor(v); };
  items.push(box(400, 455, 700, 24 + h * 0.14, { bg: h > 66 ? BAD : h > 33 ? ELEC : '#F0C987', r: '6px', op: 0.2 + h / 130, tr: 'all .2s' }));
  S.forEach((m, i) => {
    const melt = Math.max(0, Math.min(1, (h - m.mp) / 15));
    items.push(blob(X[i], 270, 160, 160, { bg: '#ECEAE3', bd: '2px solid ' + LINE }));
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const j = r * 3 + c, gx = X[i] + (c - 1) * 34, gy = 270 + (r - 1) * 34;
      const lx = X[i] + (rnd(i, j) - 0.5) * 110, ly = 300 + (rnd(j, i) - 0.5) * 50;
      const x = gx + (lx - gx) * melt, y = gy + (ly - gy) * melt;
      const ion = m.p === 'ion', col = ion ? ((r + c) % 2 ? ACC : OK) : m.p === 'net' ? '#6FA8D6' : m.c;
      items.push(box(x, y, ion ? 24 : 28, ion ? 24 : 28, { r: ion || m.p === 'net' ? '50%' : '7px', bg: col, bd: '1.5px solid ' + (ion ? 'transparent' : '#9AA0AA'), rot: melt * rnd(i, j) * 120, z: 4 }));
    }
    items.push(txt(X[i], 380, m.n, { fs: 19 }), txt(X[i], 408, melt >= 1 ? 'انصهر' : melt > 0 ? 'ينصهر…' : 'صلب', { fs: 16, c: melt > 0 ? BAD : MUTED }));
    items.push(txt(X[i], 160, m.t, { fs: 14, c: MUTED, fw: 500 }));
  });
  const lvl = h < 25 ? 'منخفضة' : h < 50 ? 'متوسطة' : h < 80 ? 'مرتفعة' : 'مرتفعة جدًّا';
  const meltedN = S.filter(m => h >= m.mp + 15).length;
  return {
    title: 'سخّني المواد', prompt: 'زيدي شدة التسخين وراقبي أي المواد تنصهر وأيها لا ينصهر. فكّري: ما القوى التي يجب التغلب عليها؟',
    groups: [],
    slider: { label: 'شدة التسخين', min: 0, max: 100, step: 1, value: h, change: e => set({ h: +e.target.value }), valueLabel: lvl },
    items,
    readouts: S.map(m => ({ k: m.n, v: h >= m.mp + 15 ? 'انصهر' : 'صلب', c: h >= m.mp + 15 ? BAD : INK })),
    insight: meltedN === 0 ? { tone: 'info', text: 'ابدئي التسخين.' }
        : { tone: 'ok', text: 'انصهرت المواد التساهمية الجزيئية لأن القوى بين جزيئاتها ضعيفة، أما الملح الأيوني والألماس الشبكي فلم ينصهرا.' }
  };
}


// ---------- تراكيب لويس الثابتة (أمثلة الكتاب) ----------
function lw(atoms, bnds, extra) {
  const items = [];
  bnds.forEach(b => { const A = atoms[b[0]], B = atoms[b[1]]; bonds(A[1], A[2], B[1], B[2], b[2], { ra: 38, rb: 38, gap: 16, max: b[2], th: 6 }).forEach(x => items.push(x)); });
  atoms.forEach(a => {
    items.push(it({ x: a[1], y: a[2], w: 70, h: 70, t: a[0], fs: 62, fw: 600, z: 5 }));
    (a[3] || []).forEach(g => { const r = g * D, rr = a[4] || 52, cx = a[1] + Math.cos(r) * rr, cy = a[2] + Math.sin(r) * rr, px = -Math.sin(r), py = Math.cos(r); items.push(dot(cx + px * 10, cy + py * 10, { bg: INK, s: 12 }), dot(cx - px * 10, cy - py * 10, { bg: INK, s: 12 })); });
  });
  (extra || []).forEach(e => items.push(e));
  return items;
}
export const LEWIS = {
  HF: () => lw([['H', 300, 250], ['F', 500, 250, [-90, 90, 0]]], [[0, 1, 1]]),
  N2: () => lw([['N', 310, 250, [180]], ['N', 490, 250, [0]]], [[0, 1, 3]]),
  C2H4: () => lw([['C', 320, 250], ['C', 480, 250], ['H', 190, 130], ['H', 190, 370], ['H', 610, 130], ['H', 610, 370]], [[0, 1, 2], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1]]),
  NH3: () => lw([['N', 400, 210, [-90]], ['H', 220, 210], ['H', 580, 210], ['H', 400, 400]], [[0, 1, 1], [0, 2, 1], [0, 3, 1]]),
  CO2: () => lw([['O', 200, 250, [-90, 90]], ['C', 400, 250], ['O', 600, 250, [-90, 90]]], [[0, 1, 2], [1, 2, 2]]),
  O3: () => lw([['O', 210, 120, [-90, 180]], ['O', 400, 120, [-90]], ['O', 590, 120, [-90, 90, 0]], ['O', 210, 390, [-90, 90, 180]], ['O', 400, 390, [-90]], ['O', 590, 390, [-90, 0]]], [[0, 1, 2], [1, 2, 1], [3, 4, 1], [4, 5, 2]], [txt(400, 255, '↕', { fs: 46 })]),
  XeF4: () => lw([['Xe', 400, 250, [-45, 135], 84], ['F', 180, 250, [180, -90, 90]], ['F', 620, 250, [0, -90, 90]], ['F', 400, 75, [-90, 180, 0]], ['F', 400, 425, [90, 180, 0]]], [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]]),
  PH3: () => lw([['P', 400, 210, [-90]], ['H', 220, 210], ['H', 580, 210], ['H', 400, 400]], [[0, 1, 1], [0, 2, 1], [0, 3, 1]])
};

export const EXPLORE = { o1, o2, o3, o4, o5, o6, o7, o8, o9, o10, o11, o12, o13, o14, o15 };
