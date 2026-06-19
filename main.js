/* ============================================
   STRANGER BIRTHDAY - Main JavaScript (v2)
   js/main.js
   ============================================ */

// ============ PHOTO LIST ============
// Filenames the page expects in /images/. Drop your 32 real .jpg files
// in with these exact names and they'll appear automatically.
const PHOTO_COUNT = 37;
const PHOTO_PATHS = Array.from({ length: PHOTO_COUNT }, (_, i) => `images/photo${i + 1}.jpg`);

// Checks if an image actually loads (vs. an empty placeholder file / 404)
function checkImage(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.naturalWidth > 0 ? path : null);
    img.onerror = () => resolve(null);
    img.src = path;
  });
}

async function getAvailablePhotos() {
  const results = await Promise.all(PHOTO_PATHS.map(checkImage));
  return results.filter(Boolean);
}


// ============ APPLY BACKGROUND PHOTOS TO SECTIONS ============
async function applyBackgroundPhotos() {
  const photos = await getAvailablePhotos();
  if (photos.length === 0) return; // nothing real uploaded yet, keep neon gradients only

  const bgTargets = document.querySelectorAll('[data-bg-slot]');
  bgTargets.forEach((el, i) => {
    const photo = photos[i % photos.length];
    el.style.setProperty('--bg-img', `url('${photo}')`);
    el.classList.add('bg-photo');
  });

  // Fill the memories polaroid strip with whatever photos are available
  const strip = document.getElementById('photo-strip');
  if (strip) {
    strip.innerHTML = '';
    photos.forEach((photo) => {
      const div = document.createElement('div');
      div.className = 'polaroid';
      div.style.setProperty('--bg-img', `url('${photo}')`);
      div.setAttribute('role', 'img');
      div.setAttribute('aria-label', 'Birthday memory photo');
      strip.appendChild(div);
    });
    document.getElementById('memories-empty-note')?.remove();
  }
}

document.addEventListener('DOMContentLoaded', applyBackgroundPhotos);


// ============ CHRISTMAS LIGHTS ============
(function initLights() {
  const colors = ['red', 'blue', 'green', 'yellow', 'pink', 'cyan', 'orange', 'purple'];
  const container = document.querySelector('.lights-container');
  if (!container) return;

  const count = Math.max(16, Math.min(30, Math.floor(window.innerWidth / 28)));

  for (let i = 0; i < count; i++) {
    const color = colors[i % colors.length];
    const bulb = document.createElement('div');
    bulb.className = 'light-bulb';
    bulb.setAttribute('role', 'button');
    bulb.setAttribute('aria-label', 'Toggle light');
    bulb.innerHTML = `
      <div class="light-stem"></div>
      <div class="light-cap"></div>
      <div class="light-glow light-${color}"></div>
    `;
    container.appendChild(bulb);

    const delay = Math.random() * 3000;
    const duration = 800 + Math.random() * 1500;

    setInterval(() => {
      const glow = bulb.querySelector('.light-glow');
      glow.classList.add('light-off');
      setTimeout(() => glow.classList.remove('light-off'), duration * 0.3);
    }, delay + duration);

    bulb.addEventListener('click', () => {
      const glow = bulb.querySelector('.light-glow');
      glow.classList.toggle('light-off');
      if (!glow.classList.contains('light-off')) {
        const rect = bulb.getBoundingClientRect();
        spawnConfettiAt(rect.left + 8, rect.top, 3);
      }
    });
  }
})();


// ============ TYPEWRITER EFFECT ============
(function initTypewriter() {
  const messages = [
    "Hi! Today is a SUPER special day...",
    "It's Margaret & Miry's Birthday! 🎉",
    "Get ready for cake, balloons,",
    "and lots of happy wishes! ✨",
    "[ TAP THE BUTTON TO CELEBRATE! ]"
  ];

  const el = document.getElementById('typed-message');
  if (!el) return;

  let msgIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = messages[msgIndex];

    if (!isDeleting) {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        if (msgIndex < messages.length - 1) {
          setTimeout(() => { isDeleting = true; type(); }, 2200);
          return;
        } else {
          return;
        }
      }
    } else {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        msgIndex++;
        setTimeout(type, 400);
        return;
      }
    }

    const speed = isDeleting ? 35 : (Math.random() * 35 + 45);
    setTimeout(type, speed);
  }

  setTimeout(type, 1000);
})();


// ============ CONFETTI SYSTEM ============
const CONFETTI_COLORS = ['#ff006e', '#00d4ff', '#ffd700', '#39ff14', '#ff8800', '#cc44ff', '#ff4444', '#00ffcc'];

function spawnConfettiAt(x, y, count = 12) {
  const frag = document.createDocumentFragment();
  const pieces = [];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const size = 6 + Math.random() * 8;
    const xOffset = (Math.random() - 0.5) * 140;
    const duration = 1.4 + Math.random() * 1.2;
    const delay = Math.random() * 250;

    el.style.cssText = `
      left: ${x + xOffset}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      box-shadow: 0 0 6px ${color};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-delay: ${delay}ms;
      animation-duration: ${duration}s;
    `;
    frag.appendChild(el);
    pieces.push(el);
  }

  document.body.appendChild(frag);
  pieces.forEach((el, i) => {
    setTimeout(() => el.remove(), 2000 + i * 5);
  });
}

function spawnFullConfetti() {
  const w = window.innerWidth;
  for (let i = 0; i < 60; i++) {
    const x = Math.random() * w;
    setTimeout(() => spawnConfettiAt(x, window.innerHeight * 0.3, 1), Math.random() * 800);
  }
}

// ============ CELEBRATE BUTTON ============
document.getElementById('celebrate-btn')?.addEventListener('click', function () {
  spawnFullConfetti();

  const flash = document.createElement('div');
  flash.style.cssText = `
    position:fixed; inset:0; background:white; opacity:0.15;
    pointer-events:none; z-index:9997; transition:opacity 0.4s;
  `;
  document.body.appendChild(flash);
  setTimeout(() => { flash.style.opacity = '0'; setTimeout(() => flash.remove(), 400); }, 100);

  const original = this.textContent;
  this.textContent = '🎉 HAPPY BIRTHDAY!! 🎉';
  this.style.background = 'var(--neon-pink)';
  this.style.color = '#000';
  setTimeout(() => {
    this.textContent = '★ CELEBRATE AGAIN! ★';
    this.style.background = 'transparent';
    this.style.color = 'var(--neon-pink)';
  }, 2200);

  setTimeout(() => {
    const demon = document.getElementById('demogorgon');
    if (demon) {
      demon.classList.add('peek');
      const msg = document.getElementById('demogorgon-msg');
      if (msg) msg.style.display = 'block';
      setTimeout(() => {
        demon.classList.remove('peek');
        if (msg) msg.style.display = 'none';
      }, 3800);
    }
  }, 900);
});


// ============ DEMOGORGON EASTER EGG ============
document.getElementById('demogorgon')?.addEventListener('click', function () {
  const rect = this.getBoundingClientRect();
  spawnConfettiAt(rect.left, rect.top, 16);
  this.style.transform = 'scale(1.15)';
  setTimeout(() => { this.style.transform = 'scale(1)'; }, 300);
});


// ============ STAR FIELD ============
(function initStars() {
  const bg = document.querySelector('.stars-bg');
  if (!bg) return;

  const frag = document.createDocumentFragment();
  const count = 70;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star-dot';
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = Math.random() > 0.85 ? 3 : 2;
    const delay = Math.random() * 4;
    const duration = 2 + Math.random() * 3;

    star.style.cssText = `
      left:${x}%; top:${y}%; width:${size}px; height:${size}px;
      opacity:${0.2 + Math.random() * 0.6};
      animation-duration:${duration}s; animation-delay:${delay}s;
    `;
    frag.appendChild(star);
  }
  bg.appendChild(frag);
})();


// ============ SCROLL REVEAL ============
(function initScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


// ============ BALLOONS ============
(function initBalloons() {
  document.querySelectorAll('.balloon').forEach((b, i) => {
    const duration = 3 + Math.random() * 3;
    const delay = i * 0.3;
    b.style.animationDuration = `${duration}s`;
    b.style.animationDelay = `${delay}s`;

    b.addEventListener('click', () => {
      const rect = b.getBoundingClientRect();
      spawnConfettiAt(rect.left + rect.width / 2, rect.top, 14);
      b.style.transition = 'transform 0.2s, opacity 0.3s';
      b.style.transform = 'scale(0.3)';
      b.style.opacity = '0';
      setTimeout(() => {
        b.style.transform = 'scale(1)';
        b.style.opacity = '1';
      }, 1200);
    });
  });
})();


// ============ KONAMI CODE EASTER EGG ============
(function initKonami() {
  const code = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === code[pos]) {
      pos++;
      if (pos === code.length) {
        pos = 0;
        for (let i = 0; i < 4; i++) setTimeout(() => spawnFullConfetti(), i * 300);
        alert('🕹️ SECRET CODE FOUND!\nHappy Birthday Margaret & Miry! 🎉');
      }
    } else {
      pos = (e.key === code[0]) ? 1 : 0;
    }
  });
})();
