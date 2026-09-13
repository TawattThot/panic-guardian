import './style.css';
import { createFallDetector, requestMotionPermission } from './sensors.js';
import { loadSettings, saveSettings } from './storage.js';

const app = document.getElementById('app');
let settings = loadSettings();
let screen = 'home'; // home | settings | countdown | sent
let countdownLeft = 0;
let countdownTimer = null;
let countdownReason = '';
let sensorsOk = false;
let lastEvent = null;

const detector = createFallDetector({
  onFall: (ev) => {
    if (!settings.fallDetect) return;
    if (screen === 'countdown' || screen === 'sent') return;
    lastEvent = ev;
    startCountdown(ev.kind === 'fall' ? 'Possible fall detected' : 'Hard impact detected');
  },
});
detector.start();

function render() {
  if (screen === 'settings') return renderSettings();
  if (screen === 'countdown') return renderCountdown();
  if (screen === 'sent') return renderSent();
  renderHome();
}

function renderHome() {
  app.innerHTML = `
    <h1>Panic Guardian</h1>
    <p class="sub">Fall / impact assist + panic SOS — confirm-gated. Not magic threat detection.</p>
    <section class="card safety">
      <h2>Hard limits</h2>
      <ul>
        <li>Cannot detect gunpoint or knife threats from sensors.</li>
        <li>Will not silently auto-call police from a guess.</li>
        <li>Always prefer a cancel window before alerts go out.</li>
      </ul>
    </section>
    <section class="card">
      <p class="status">Sensors: <span class="${sensorsOk ? 'ok' : 'bad'}">${sensorsOk ? 'ready' : 'needs permission'}</span>
      · Fall detect: <span class="${settings.fallDetect ? 'ok' : 'bad'}">${settings.fallDetect ? 'on' : 'off'}</span>
      · Last G: ${detector.lastG.toFixed(2)}</p>
      <div class="row" style="margin-top:0.75rem">
        <button class="primary" id="btn-sensors">Enable Sensors</button>
        <button class="ghost" id="btn-settings">Contacts & settings</button>
      </div>
    </section>
    <section class="card">
      <button class="danger" id="btn-panic">PANIC SOS</button>
      <p class="status" style="margin-top:0.75rem">Starts a ${settings.countdownSec}s countdown you can cancel.</p>
    </section>
  `;
  document.getElementById('btn-sensors').onclick = enableSensors;
  document.getElementById('btn-settings').onclick = () => {
    screen = 'settings';
    render();
  };
  document.getElementById('btn-panic').onclick = () => startCountdown('Manual panic');
}

function renderSettings() {
  const c0 = settings.contacts[0] || { name: '', phone: '' };
  app.innerHTML = `
    <h1>Settings</h1>
    <p class="sub">Stored only on this device (localStorage).</p>
    <section class="card">
      <label>Contact name</label>
      <input id="c-name" value="${escapeAttr(c0.name)}" />
      <label>Phone (for sms: / tel: links)</label>
      <input id="c-phone" inputmode="tel" value="${escapeAttr(c0.phone)}" placeholder="+15551234567" />
      <label>Countdown seconds</label>
      <input id="c-count" type="number" min="5" max="60" value="${settings.countdownSec}" />
      <label><input id="c-fall" type="checkbox" ${settings.fallDetect ? 'checked' : ''}/> Enable fall / hard-impact detect</label>
      <div class="row" style="margin-top:1rem">
        <button class="primary" id="btn-save">Save</button>
        <button class="ghost" id="btn-back">Back</button>
      </div>
    </section>
  `;
  document.getElementById('btn-back').onclick = () => {
    screen = 'home';
    render();
  };
  document.getElementById('btn-save').onclick = () => {
    settings.contacts = [
      {
        name: document.getElementById('c-name').value.trim() || 'Emergency contact',
        phone: document.getElementById('c-phone').value.trim(),
        note: 'Primary',
      },
    ];
    settings.countdownSec = Math.max(5, Math.min(60, Number(document.getElementById('c-count').value) || 15));
    settings.fallDetect = document.getElementById('c-fall').checked;
    saveSettings(settings);
    screen = 'home';
    render();
  };
}

function renderCountdown() {
  app.innerHTML = `
    <h1>SOS countdown</h1>
    <p class="sub">${escapeHtml(countdownReason)}</p>
    <section class="card">
      <div class="countdown" id="cd">${countdownLeft}</div>
      <p class="status">Alert will open contact actions unless you cancel.</p>
      <button class="danger" id="btn-cancel" style="background:#22c55e">CANCEL</button>
    </section>
  `;
  document.getElementById('btn-cancel').onclick = cancelCountdown;
}

function renderSent() {
  const c = settings.contacts[0] || {};
  const phone = (c.phone || '').replace(/\s+/g, '');
  const body = encodeURIComponent(
    `PANIC GUARDIAN ALERT: ${countdownReason}. I may need help. Sent from my phone.`
  );
  const sms = phone ? `sms:${phone}?&body=${body}` : null;
  const tel = phone ? `tel:${phone}` : null;
  app.innerHTML = `
    <h1>Alert ready</h1>
    <p class="sub">${escapeHtml(countdownReason)}</p>
    <section class="card">
      <p>Choose how to reach <strong>${escapeHtml(c.name || 'your contact')}</strong>. Nothing was sent automatically.</p>
      <div class="row">
        ${sms ? `<a class="btn primary" href="${sms}">Text contact</a>` : ''}
        ${tel ? `<a class="btn" href="${tel}">Call contact</a>` : ''}
        <a class="btn danger" href="tel:911">Call emergency services (US 911)</a>
      </div>
      <p class="status" style="margin-top:0.75rem">911 is only opened if you tap it. Edit the number for your region in a later build.</p>
      <button class="ghost" id="btn-home" style="margin-top:1rem">Back home</button>
    </section>
  `;
  document.getElementById('btn-home').onclick = () => {
    screen = 'home';
    render();
  };
}

function startCountdown(reason) {
  cancelCountdown(false);
  countdownReason = reason;
  countdownLeft = settings.countdownSec;
  screen = 'countdown';
  render();
  countdownTimer = setInterval(() => {
    countdownLeft -= 1;
    const el = document.getElementById('cd');
    if (el) el.textContent = String(countdownLeft);
    if (countdownLeft <= 0) {
      clearInterval(countdownTimer);
      countdownTimer = null;
      screen = 'sent';
      render();
    }
  }, 1000);
}

function cancelCountdown(rerender = true) {
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = null;
  if (rerender) {
    screen = 'home';
    render();
  }
}

async function enableSensors() {
  try {
    sensorsOk = await requestMotionPermission();
    if (sensorsOk) detector.arm();
  } catch {
    sensorsOk = false;
  }
  render();
}

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
function escapeAttr(s) {
  return escapeHtml(s).replaceAll("'", '&#39;');
}

render();
