const MESSAGES = [
  { text: "Kamilly, medicamento. Agora. Antes de você abrir qualquer outra coisa.", tag: "direta" },
  { text: "Webber, você orienta paciente sobre medicamento o dia todo e esquece do seu. A ironia tá gritando.", tag: "farmácia 😅" },
  { text: "Kamizinha, o comprimido não vai se tomar sozinho. Infelizmente.", tag: "simples" },
  { text: "Antes do treino, antes do café, antes do TikTok: medicamento. Nessa ordem.", tag: "academia" },
  { text: "Webber, mais um dia, mais um comprimido, mais um dia sem você me dar trabalho. Ótimo.", tag: "sequência" },
  { text: "Você que sabe a farmacocinética de cabeça — então sabe que horário importa. Toma logo.", tag: "farmácia 🧪" },
  { text: "Kamilly, a Kamilinha que corre, estuda e ainda arranja tempo pra tudo merece se sentir bem. Começa aqui.", tag: "carinhosa" },
  { text: "Você decorou bula de medicamento que nem é da sua área. Toma o seu logo.", tag: "engraçada" },
  { text: "Nem o livro, nem a corrida, nem nada começa antes do medicamento. Regra da casa.", tag: "rotina" },
  { text: "Kamizinha, você cuida de paciente, de estudo, de treino. Bora cuidar de você também, né.", tag: "carinhosa" },
  { text: "Webber, dose diária. Sem drama, sem enrolação.", tag: "direta" },
  { text: "Medicamento tomado = você pode arrasar sem culpa o resto do dia. Lógica impecável.", tag: "motivacional" },
  { text: "Um comprimido. Dois segundos. Você gastou mais tempo lendo isso.", tag: "direta 😬" },
  { text: "Farmacêutica sem tomar o próprio medicamento é tipo nutricionista comendo mal. Não faz sentido, Webber.", tag: "farmácia" },
  { text: "Kamilly, o comprimido tá te esperando. Ele é fiel assim.", tag: "simples" },
  { text: "Webber, antes de abrir o app de treino: medicamento. Antes de abrir o livro: medicamento. Antes de qualquer coisa: medicamento.", tag: "rotina" },
  { text: "Você é boa demais em cuidar dos outros. Que tal ser boa em cuidar de você também? Começa pelo comprimido.", tag: "carinhosa" },
  { text: "Kamizinha, toma o medicamento. Não precisa de motivação, precisa de água e dois segundos.", tag: "direta" },
  { text: "A sequência tá linda, Webber. Não vai estragar agora por preguiça, vai?", tag: "sequência 👀" },
  { text: "Você estuda, treina, trabalha e ainda cuida de todo mundo. O mínimo que você merece é se sentir bem. Vai lá.", tag: "carinhosa" },
  { text: "Kamilly, tomar medicamento todo dia é consistência. Você que ama consistência — então isso aqui é pra você.", tag: "motivacional" },
  { text: "Farmácia hospitalar de dia, medicamento próprio em dia. Esse é o combo certo.", tag: "farmácia" },
  { text: "Webber, o comprimido não corre atrás de você. Mas você corre 5km por lazer então vai lá buscá-lo.", tag: "engraçada 🏃" },
  { text: "Kamilly, um dia você vai agradecer por não ter pulado nenhum. Hoje é mais um desses dias.", tag: "sequência" },
  { text: "Nem toda rotina precisa ser complicada. Essa aqui é literalmente um comprimido. Vai.", tag: "simples" },
  { text: "Webber, medicamento primeiro. O mundo pode esperar dois segundos.", tag: "direta" },
  { text: "Você orienta paciente a não pular dose com aquela cara séria. Então não pula o seu.", tag: "farmácia 😤" },
  { text: "Kamizinha, cuida de você com metade do carinho que você cuida dos outros. Já tá ótimo.", tag: "carinhosa" },
  { text: "Mais um dia, Webber. Mais um comprimido. Mais uma versão sua que se cuidou.", tag: "motivacional" },
  { text: "Kamilly, você já abriu esse app — o mais difícil já foi. Toma o medicamento e fecha.", tag: "simples" },
  { text: "Webber, os corações não regeneram sozinhos. A menos que você tome o medicamento.", tag: "minezinho ❤️" },
  { text: "Fazer cama no minezinho é chato mas você faz por garantia. Medicamento é a mesma lógica, Kamilly.", tag: "minezinho 🛏️" },
  { text: "Poção de velocidade, resistência, força — tudo ótimo. Mas o buff mais importante é o medicamento diário. Vai.", tag: "minezinho 🧪" },
  { text: "Em Stardew Valley sem energia você não planta, não minera, não faz nada. Na vida real funciona igual. Medicamento primeiro.", tag: "stardew ⚡" },
  { text: "Webber, aqui não tem como desmaiar na pesca e acordar de boas em casa no dia seguinte. Cuida do seu HP antes.", tag: "stardew ⛏️" },
  { text: "Pierre não abre domingo mas o seu comprimido tá disponível 24/7. Nenhuma desculpa, Kamilly.", tag: "stardew 🌻" },
  { text: "Isso é melhor que Joja Cola, Kamilly. Toma o medicamento.", tag: "stardew 🌟" },
];

const SPECIAL_DAYS = {
  "2026-05-27": { text: "Kamilly, hoje é dia de prova. Você estudou, você sabe a matéria, e tomou o medicamento — tecnicamente você tá mais preparada que a maioria. Vai lá, Webber.", tag: "prova 🎓" },
};

const STORAGE_KEY = "kamilly_taken_days";
const TIME_KEY = "kamilly_notif_time";

let deferredInstallPrompt = null;

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
  const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  if (SPECIAL_DAYS[key]) return SPECIAL_DAYS[key];
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
    grid.appendChild(Object.assign(document.createElement('div'), { className: 'cal-day empty' }));
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const key = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const el = document.createElement('div');
    el.className = 'cal-day';
    el.textContent = d;
    if (d > today) {
      el.classList.add('future');
    } else {
      el.classList.add('clickable');
      el.onclick = () => toggleDay(key);
      if (d === today) el.classList.add(state[key] ? 'taken' : 'today');
      else if (state[key]) el.classList.add('taken');
    }
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

function setHappy(happy) {
  const hk = document.getElementById('hk-wrap');
  if (hk) hk.classList.toggle('taken', happy);
}

function setBtnTaken(taken) {
  const btn = document.getElementById('take-btn');
  const svg = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="width:21px;height:21px;"><polyline points="20 6 9 17 4 12"/></svg>`;
  if (taken) {
    btn.classList.add('done');
    btn.innerHTML = `${svg} tomado hoje`;
  } else {
    btn.classList.remove('done');
    btn.innerHTML = `${svg} tomei hoje`;
  }
}

function toggleDay(dateKey) {
  const state = getState();
  if (state[dateKey]) delete state[dateKey];
  else state[dateKey] = true;
  saveState(state);

  if (dateKey === todayKey()) {
    setBtnTaken(!!state[dateKey]);
    setHappy(!!state[dateKey]);
  }

  renderCal();
  renderStats();
  showToast(state[dateKey] ? "Dia marcado ✓" : "Dia desmarcado");
}

function markTaken() {
  const key = todayKey();
  const state = getState();
  if (state[key]) return;
  state[key] = true;
  saveState(state);

  setBtnTaken(true);
  setHappy(true);
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

function initInstall() {
  const isStandalone = navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
  if (isStandalone) {
    const row = document.getElementById('install-row');
    if (row) row.style.display = 'none';
    return;
  }

  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    const btn = document.getElementById('btn-install');
    if (btn) btn.style.display = 'block';
    return;
  }

  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    deferredInstallPrompt = e;
    const btn = document.getElementById('btn-install');
    if (btn) btn.style.display = 'block';
  });

  window.addEventListener('appinstalled', () => {
    const row = document.getElementById('install-row');
    if (row) row.style.display = 'none';
    showToast("App instalado! ♡");
  });
}

async function installApp() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    const { outcome } = await deferredInstallPrompt.userChoice;
    if (outcome === 'accepted') {
      document.getElementById('install-row').style.display = 'none';
    }
    deferredInstallPrompt = null;
  } else if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    document.getElementById('install-banner').classList.add('visible');
  }
}

function init() {
  const msg = getDayMessage();
  document.getElementById('hero-msg').textContent = msg.text;
  document.getElementById('hero-tag').textContent = msg.tag;

  const state = getState();
  const key = todayKey();
  if (state[key]) {
    setBtnTaken(true);
    setHappy(true);
  }

  const savedTime = localStorage.getItem(TIME_KEY);
  if (savedTime) document.getElementById('notif-time').value = savedTime;

  if (Notification.permission === 'granted') {
    document.getElementById('notif-btn').textContent = 'notificações ativas';
    document.getElementById('notif-btn').disabled = true;
  }

  renderCal();
  renderStats();
  initInstall();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
}

init();
