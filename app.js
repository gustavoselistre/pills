const MESSAGES = [
  { text: "Kamilly, não esquece do remédio. Você cuida de tanta gente — cuida de você também.", tag: "carinhosa" },
  { text: "Webber, hora do remédio. Farmacêutica que não toma o próprio remédio é ironia demais.", tag: "engraçada" },
  { text: "Kamizinha, remédio tomado = missão cumprida. Vai lá.", tag: "simples" },
  { text: "Você passa o dia inteiro orientando pacientes sobre medicamentos. Agora é a sua vez.", tag: "farmácia" },
  { text: "Antes do treino, antes do café, antes de tudo: remédio.", tag: "academia" },
  { text: "Webber, mais um dia. Mais um comprimido. Mais uma sequência mantida.", tag: "sequência" },
  { text: "A Kamilinha que corre, lê, trabalha e estuda merece se sentir bem. Começa aqui.", tag: "carinhosa" },
  { text: "Você decorou a bula inteira de vários remédios. Lembra de tomar o seu.", tag: "engraçada" },
  { text: "Pequeno gesto, grande diferença. Vai lá, Webber.", tag: "simples" },
  { text: "Nem o livro, nem a corrida, nem a aula começa antes do remédio.", tag: "rotina" },
  { text: "Kamizinha, sua saúde importa tanto quanto a dos pacientes que você cuida.", tag: "carinhosa" },
  { text: "Remédio tomado. Agora pode ir arrasar na farmácia, na faculdade, na academia — na vida.", tag: "motivacional" },
  { text: "Webber, dose diária. Simples assim.", tag: "direta" },
  { text: "Você que sabe mais do que ninguém: consistência é tudo. Remédio agora.", tag: "farmácia" },
  { text: "Um comprimido. Dois segundos. Nenhuma desculpa.", tag: "direta" },
  { text: "Kamilly, cuida de você hoje. O remédio é o começo.", tag: "carinhosa" },
  { text: "Antes de abrir o app de treino, antes de abrir o livro: remédio.", tag: "rotina" },
  { text: "Webber, você é boa demais em cuidar das pessoas. Não esqueça de ser boa também pra você.", tag: "carinhosa" },
  { text: "Hora do remédio, Kamizinha. Pode confiar no processo.", tag: "simples" },
  { text: "A sequência não vai quebrar sozinha — e você também não vai deixar. Vai lá.", tag: "sequência" },
  { text: "Cada dia é uma escolha de se cuidar. Você já está fazendo certo.", tag: "motivacional" },
  { text: "Farmácia hospitalar de dia, remédio próprio na hora certa. Perfeito.", tag: "farmácia" },
  { text: "Webber, o comprimido não corre atrás de você. Mas você corre — então vai buscá-lo.", tag: "engraçada" },
  { text: "Kamilly, sua saúde é o alicerce de tudo que você faz. Cuida bem.", tag: "carinhosa" },
  { text: "Marca mais um dia. A sequência agradece.", tag: "sequência" },
  { text: "Nem toda rotina precisa ser difícil. Essa aqui é fácil: remédio, check.", tag: "simples" },
  { text: "Webber, remédio primeiro. Depois o mundo.", tag: "direta" },
  { text: "Você que orienta o paciente a não pular dose — então não pula.", tag: "farmácia" },
  { text: "Kamizinha, cuida de você com o mesmo carinho que você cuida dos outros.", tag: "carinhosa" },
  { text: "Mais um dia, mais um passo na direção certa. Remédio tomado.", tag: "motivacional" },
];

const STORAGE_KEY = "kamilly_taken_days";
const TIME_KEY = "kamilly_notif_time";

function getState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch { return {}; }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getDayMessage() {
  const d = new Date();
  const dayOfYear = Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000);
  return MESSAGES[dayOfYear % MESSAGES.length];
}

function computeStreak(state) {
  let streak = 0;
  const d = new Date();
  while (true) {
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (state[key]) { streak++; d.setDate(d.getDate()-1); }
    else break;
  }
  return streak;
}

function computeMonth(state) {
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();
  const today = now.getDate();
  let count = 0;
  for (let d = 1; d <= today; d++) {
    const key = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    if (state[key]) count++;
  }
  return { count, total: today };
}

function renderCal() {
  const state = getState();
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth();
  const today = now.getDate();
  const daysInMonth = new Date(y, m+1, 0).getDate();
  const firstDow = new Date(y, m, 1).getDay();

  const months = ["janeiro","fevereiro","março","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"];
  document.getElementById('cal-title').textContent = `${months[m]} ${y}`;

  const grid = document.getElementById('cal-grid');
  grid.innerHTML = '';

  for (let i = 0; i < firstDow; i++) {
    grid.appendChild(Object.assign(document.createElement('div'), { className: 'cal-day' }));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const el = document.createElement('div');
    el.className = 'cal-day';
    el.textContent = d;
    if (d > today) el.classList.add('future');
    else if (d === today) el.classList.add(state[key] ? 'taken' : 'today');
    else if (state[key]) el.classList.add('taken');
    grid.appendChild(el);
  }
}

function renderStats() {
  const state = getState();
  document.getElementById('streak-val').textContent = computeStreak(state);
  const { count, total } = computeMonth(state);
  document.getElementById('month-val').textContent = count;
  document.getElementById('month-sub').textContent = `de ${total} dias`;
}

function markTaken() {
  const key = todayKey();
  const state = getState();
  if (state[key]) return;
  state[key] = true;
  saveState(state);

  const btn = document.getElementById('take-btn');
  btn.classList.add('done');
  btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;"><polyline points="20 6 9 17 4 12"/></svg> tomado hoje`;

  renderCal();
  renderStats();
  showToast("Anotado! Mais um dia cuidando de você.");
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

function saveTime(val) {
  localStorage.setItem(TIME_KEY, val);
  showToast(`Horário salvo: ${val}`);
  scheduleNotification(val);
}

async function requestNotif() {
  if (!('Notification' in window)) {
    showToast("Notificações não disponíveis neste navegador.");
    return;
  }
  if (!navigator.standalone && /iPhone|iPad|iPod/.test(navigator.userAgent)) {
    document.getElementById('install-banner').classList.add('visible');
    return;
  }
  const perm = await Notification.requestPermission();
  if (perm === 'granted') {
    document.getElementById('notif-btn').textContent = 'notificações ativas';
    document.getElementById('notif-btn').disabled = true;
    const time = localStorage.getItem(TIME_KEY) || '08:30';
    scheduleNotification(time);
    showToast("Notificações ativadas!");
  } else {
    showToast("Permissão negada. Habilite nas configurações.");
  }
}

function scheduleNotification(timeStr) {
  if (!('serviceWorker' in navigator)) return;
  const [h, min] = timeStr.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(h, min, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  const delay = target - now;
  navigator.serviceWorker.ready.then(reg => {
    reg.active?.postMessage({ type: 'SCHEDULE', delay, message: getDayMessage() });
  });
}

function init() {
  const msg = getDayMessage();
  document.getElementById('hero-msg').textContent = msg.text;
  document.getElementById('hero-tag').textContent = msg.tag;

  const state = getState();
  const key = todayKey();
  if (state[key]) {
    const btn = document.getElementById('take-btn');
    btn.classList.add('done');
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;"><polyline points="20 6 9 17 4 12"/></svg> tomado hoje`;
  }

  const savedTime = localStorage.getItem(TIME_KEY);
  if (savedTime) document.getElementById('notif-time').value = savedTime;

  if (Notification.permission === 'granted') {
    document.getElementById('notif-btn').textContent = 'notificações ativas';
    document.getElementById('notif-btn').disabled = true;
  }

  renderCal();
  renderStats();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
}

init();
