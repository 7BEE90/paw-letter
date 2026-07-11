/* ==================================================================
   A LETTER FROM MY DOG — SCRIPT
   Built for smooth 60fps performance on mobile (Galaxy S25 primary
   target): canvas-based falling icons instead of hundreds of DOM
   nodes, and letter reveal by phrase/sentence rather than per-word.
   ================================================================== */

/* ==================================================================
   ✏️  EASY CUSTOMIZATION — edit these, nothing else needs to change
   ================================================================== */

// The passcode mom needs to unlock the site (day the dog joined the family)
const passcode = "0125"; // e.g. "1203" for December 3rd

// The date your dog became part of the family — feeds the live timer
const familyDate = "2026-01-25T00:00:00"; // e.g. "2022-12-03T00:00:00"

// The letter. Keep the backticks. Blank line between paragraphs.
const letter = `
Привет, мамочка. 🐾❤️

Сегодня я решил написать тебе письмо.

Конечно, я не умею писать, но если бы мог, именно это я бы хотел тебе сказать.

Спасибо тебе за тот день, когда ты подарила мне настоящий дом. С того момента моя жизнь стала счастливой.

Спасибо за каждую прогулку, вкусняшку, игрушку, заботу и ласку. Спасибо, что всегда была рядом и любила меня таким, какой я есть.

Когда ты улыбаешься — радуюсь и я. Когда тебе грустно — мне хочется просто быть рядом и сделать тебя счастливее.

Ты не просто заботишься обо мне. Ты подарила мне жизнь, полную любви, тепла и счастья.

Если бы мне снова дали возможность выбрать себе семью, я бы без единого сомнения снова выбрал именно тебя.

Потому что ты — самая лучшая мама на свете. ❤️

Спасибо за каждый день, который мы проводим вместе.

Я очень тебя люблю.

Навсегда твой счастливый хвостик. 🐾
`;

// To enable background music once music.mp3 is in place, uncomment:
// document.getElementById('bg-music').play().catch(() => {});

/* ================================================================== */


document.addEventListener('DOMContentLoaded', () => {
  initLockScreen();
  initLockPaws();
  initFallCanvas();
  initLetter();
  initScrollReveal();
  initTimer();
  initTapSparkles();
});

/* ------------------------------------------------------------------
   LOCK SCREEN — passcode entry
   ------------------------------------------------------------------ */
function initLockScreen() {
  const lockScreen = document.getElementById('lock-screen');
  const dotsWrap = document.getElementById('passcode-dots');
  const dots = Array.from(dotsWrap.querySelectorAll('.dot'));
  const errorMsg = document.getElementById('lock-error');
  const keypad = document.getElementById('keypad');
  const deleteKey = document.getElementById('key-delete');
  const mainExperience = document.getElementById('main-experience');

  let entered = '';

  function renderDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('filled', i < entered.length);
      dot.textContent = i < entered.length ? '🐾' : '';
    });
  }

  function showError() {
    dotsWrap.classList.add('shake');
    errorMsg.classList.add('visible');
    setTimeout(() => {
      dotsWrap.classList.remove('shake');
      entered = '';
      renderDots();
    }, 500);
  }

  function tryUnlock() {
    if (entered === passcode) {
      unlock();
    } else {
      showError();
    }
  }

  function unlock() {
    errorMsg.classList.remove('visible');
    lockScreen.classList.add('unlocking');
    burstFromCenter();

    setTimeout(() => {
      lockScreen.classList.add('hidden');
      mainExperience.classList.add('visible');
      document.getElementById('fall-canvas').classList.add('active');
      document.body.style.overflow = 'auto';
      window.scrollTo(0, 0);
    }, 1100);
  }

  function pressKey(value) {
    if (entered.length >= 4) return;
    entered += value;
    renderDots();
    if (entered.length === 4) {
      setTimeout(tryUnlock, 200);
    }
  }

  keypad.addEventListener('click', (e) => {
    const btn = e.target.closest('.key');
    if (!btn || btn.classList.contains('key--ghost')) return;

    btn.classList.add('pressed');
    setTimeout(() => btn.classList.remove('pressed'), 150);

    if (btn === deleteKey) {
      entered = entered.slice(0, -1);
      renderDots();
      return;
    }
    pressKey(btn.dataset.key);
  });

  document.addEventListener('keydown', (e) => {
    if (lockScreen.classList.contains('hidden')) return;
    if (/^[0-9]$/.test(e.key)) pressKey(e.key);
    if (e.key === 'Backspace') {
      entered = entered.slice(0, -1);
      renderDots();
    }
  });

  document.body.style.overflow = 'hidden';
}

/* ------------------------------------------------------------------
   Tiny floating paw prints behind the lock screen (kept minimal)
   ------------------------------------------------------------------ */
function initLockPaws() {
  const container = document.getElementById('lock-paws');
  const count = window.innerWidth < 500 ? 10 : 16;

  for (let i = 0; i < count; i++) {
    const paw = document.createElement('span');
    paw.className = 'mini-paw';
    paw.textContent = '🐾';
    paw.style.left = Math.random() * 100 + '%';
    paw.style.fontSize = (10 + Math.random() * 14) + 'px';
    const duration = 9 + Math.random() * 10;
    paw.style.animationDuration = duration + 's';
    paw.style.animationDelay = (Math.random() * duration) + 's';
    container.appendChild(paw);
  }
}

/* ------------------------------------------------------------------
   FALLING CELEBRATION — single canvas, reused particle objects.
   Much cheaper than DOM nodes; scales fine on mid-range phones.
   ------------------------------------------------------------------ */
function initFallCanvas() {
  const canvas = document.getElementById('fall-canvas');
  const ctx = canvas.getContext('2d');
  const glyphs = ['🐾', '❤️', '✨', '🦴'];
  // weight paws/hearts more common than bones/sparkles
  const weightedGlyphs = ['🐾', '🐾', '🐾', '❤️', '❤️', '✨', '🦴'];

  let particles = [];
  let width, height;
  let running = true;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  function makeParticle() {
    return {
      x: Math.random() * width,
      y: -20 - Math.random() * height * 0.6,
      size: 14 + Math.random() * 12,
      speed: 0.4 + Math.random() * 1.0,
      drift: (Math.random() - 0.5) * 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.012,
      glyph: weightedGlyphs[Math.floor(Math.random() * weightedGlyphs.length)],
      opacity: 0.4 + Math.random() * 0.4
    };
  }

  // Low particle count — this is a canvas so it stays cheap either way,
  // but a light touch keeps it "subtle and elegant" per the brief.
  const COUNT = window.innerWidth < 500 ? 16 : 24;
  for (let i = 0; i < COUNT; i++) particles.push(makeParticle());

  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.y += p.speed;
      p.x += p.drift;
      p.rotation += p.rotationSpeed;
      if (p.y > height + 20) {
        Object.assign(p, makeParticle(), { y: -20 });
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      ctx.font = p.size + 'px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.glyph, 0, 0);
      ctx.restore();
    }
    requestAnimationFrame(tick);
  }

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) requestAnimationFrame(tick);
  });

  requestAnimationFrame(tick);
}

function burstFromCenter() {
  const layer = document.getElementById('sparkle-layer');
  const glyphs = ['🐾', '❤️', '✨'];
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  // Small, capped burst — kept light for low-end devices
  for (let i = 0; i < 14; i++) {
    const el = document.createElement('span');
    el.className = 'cursor-heart';
    el.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    const angle = Math.random() * Math.PI * 2;
    const dist = 50 + Math.random() * 180;
    el.style.left = cx + 'px';
    el.style.top = cy + 'px';
    el.style.fontSize = (14 + Math.random() * 14) + 'px';
    el.style.transition = 'transform 1s cubic-bezier(0.22,1,0.36,1), opacity 1s ease-out';
    layer.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(1.2)`;
      el.style.opacity = '0';
    });

    setTimeout(() => el.remove(), 1100);
  }
}

/* ------------------------------------------------------------------
   LETTER — reveals in small phrase/sentence chunks (NOT per word)
   for smooth performance even on longer letters.
   ------------------------------------------------------------------ */
function initLetter() {
  const target = document.getElementById('letter-text');
  const paragraphs = letter.trim().split(/\n\s*\n/);

  // Split each paragraph into chunks of ~4-6 words (roughly phrase-sized)
  function chunkify(text) {
    const words = text.trim().split(/\s+/);
    const chunks = [];
    const chunkSize = 4;
    for (let i = 0; i < words.length; i += chunkSize) {
      chunks.push(words.slice(i, i + chunkSize).join(' '));
    }
    return chunks;
  }

  const chunkEls = [];

  paragraphs.forEach((para) => {
    const p = document.createElement('p');
    const chunks = chunkify(para);
    chunks.forEach((chunk, i) => {
      const span = document.createElement('span');
      span.className = 'chunk';
      span.textContent = chunk + (i < chunks.length - 1 ? ' ' : '');
      p.appendChild(span);
      chunkEls.push(span);
    });
    target.appendChild(p);
  });

  let triggered = false;
  const section = document.getElementById('letter-section');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !triggered) {
        triggered = true;
        revealChunks(chunkEls);
      }
    });
  }, { threshold: 0.2 });

  observer.observe(section);
}

function revealChunks(chunkEls) {
  // Timed reveal using setTimeout batches rather than CSS animation-delay
  // on every node — keeps the browser's work minimal per frame.
  let delay = 0;
  chunkEls.forEach((el) => {
    setTimeout(() => el.classList.add('shown'), delay);
    delay += 220; // pacing between phrase groups, feels like live writing
  });
}

/* ------------------------------------------------------------------
   SCROLL REVEAL — fade/slide elements into view
   ------------------------------------------------------------------ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach((el) => observer.observe(el));

  const heroEls = document.querySelectorAll('#hero .reveal');
  const mainExperience = document.getElementById('main-experience');
  const heroObserver = new MutationObserver(() => {
    if (mainExperience.classList.contains('visible')) {
      heroEls.forEach((el, i) => {
        setTimeout(() => el.classList.add('in-view'), i * 150);
      });
      heroObserver.disconnect();
    }
  });
  heroObserver.observe(mainExperience, { attributes: true, attributeFilter: ['class'] });
}

/* ------------------------------------------------------------------
   FAMILY TIMER — live countup since familyDate
   ------------------------------------------------------------------ */
function initTimer() {
  const startDate = new Date(familyDate);
  const daysEl = document.getElementById('timer-days');
  const hoursEl = document.getElementById('timer-hours');
  const minutesEl = document.getElementById('timer-minutes');
  const secondsEl = document.getElementById('timer-seconds');

  function pad(n) { return String(n).padStart(2, '0'); }

  function update() {
    const now = new Date();
    let diff = Math.max(0, now - startDate);

    const days = Math.floor(diff / 86400000);
    diff -= days * 86400000;
    const hours = Math.floor(diff / 3600000);
    diff -= hours * 3600000;
    const minutes = Math.floor(diff / 60000);
    diff -= minutes * 60000;
    const seconds = Math.floor(diff / 1000);

    daysEl.textContent = days;
    hoursEl.textContent = pad(hours);
    minutesEl.textContent = pad(minutes);
    secondsEl.textContent = pad(seconds);
  }

  update();
  setInterval(update, 1000);
}

/* ------------------------------------------------------------------
   Tap sparkles — lightweight, capped per interaction
   ------------------------------------------------------------------ */
function initTapSparkles() {
  const layer = document.getElementById('sparkle-layer');
  const glyphs = ['✨', '🐾'];

  document.addEventListener('click', (e) => {
    if (e.target.closest('.key')) return;

    for (let i = 0; i < 3; i++) {
      const sparkle = document.createElement('span');
      sparkle.className = 'sparkle';
      sparkle.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist = 18 + Math.random() * 32;
      sparkle.style.left = (e.clientX + Math.cos(angle) * dist) + 'px';
      sparkle.style.top = (e.clientY + Math.sin(angle) * dist) + 'px';
      layer.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 800);
    }
  });
}
