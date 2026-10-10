// Background starfield for the hub pages. Expects <canvas id="sky">.
(() => {
  const canvas = document.getElementById("sky");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // palette: txt, blu, gold, purp
  const tints = ["229,224,255", "119,168,255", "230,204,128", "163,53,238"];

  let stars = [];
  let streak = null;
  let nextStreak = 0;
  let w = 0;
  let h = 0;
  let raf = 0;

  function seed() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.round((w * h) / 4800);
    stars = Array.from({ length: count }, () => {
      const roll = Math.random();
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: roll < 0.92 ? Math.random() * 0.9 + 0.3 : Math.random() * 1.1 + 1.2,
        a: Math.random() * 0.55 + 0.25,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.0016 + 0.0004,
        drift: Math.random() * 0.025 + 0.005,
        tint: tints[roll < 0.72 ? 0 : roll < 0.88 ? 1 : roll < 0.96 ? 2 : 3],
      };
    });
  }

  function spawnStreak(time) {
    const fromLeft = Math.random() < 0.5;
    streak = {
      x: fromLeft ? Math.random() * w * 0.5 : w * 0.5 + Math.random() * w * 0.5,
      y: Math.random() * h * 0.45,
      vx: (fromLeft ? 1 : -1) * (5 + Math.random() * 4),
      vy: 2 + Math.random() * 2,
      life: 0,
      max: 55 + Math.random() * 30,
      tint: Math.random() < 0.5 ? tints[2] : tints[1],
    };
    nextStreak = time + 7000 + Math.random() * 9000;
  }

  function draw(time) {
    ctx.clearRect(0, 0, w, h);

    for (const s of stars) {
      const twinkle = still ? 1 : 0.55 + 0.45 * Math.sin(time * s.speed + s.phase);
      const alpha = s.a * twinkle;
      ctx.fillStyle = `rgba(${s.tint},${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      // a soft cross glint on the larger stars
      if (s.r > 1.6) {
        ctx.fillStyle = `rgba(${s.tint},${alpha * 0.35})`;
        ctx.fillRect(s.x - s.r * 3, s.y - 0.5, s.r * 6, 1);
        ctx.fillRect(s.x - 0.5, s.y - s.r * 3, 1, s.r * 6);
      }

      if (!still) {
        s.x -= s.drift;
        if (s.x < -4) s.x = w + 4;
      }
    }

    if (still) return;

    if (!streak && time > nextStreak) spawnStreak(time);
    if (streak) {
      const k = streak.life / streak.max;
      const fade = k < 0.2 ? k / 0.2 : 1 - (k - 0.2) / 0.8;
      const tailX = streak.x - streak.vx * 14;
      const tailY = streak.y - streak.vy * 14;
      const grad = ctx.createLinearGradient(tailX, tailY, streak.x, streak.y);
      grad.addColorStop(0, `rgba(${streak.tint},0)`);
      grad.addColorStop(1, `rgba(${streak.tint},${0.85 * fade})`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(streak.x, streak.y);
      ctx.stroke();
      streak.x += streak.vx;
      streak.y += streak.vy;
      streak.life += 1;
      if (streak.life >= streak.max) streak = null;
    }

    raf = requestAnimationFrame(draw);
  }

  function start() {
    cancelAnimationFrame(raf);
    nextStreak = performance.now() + 2500;
    raf = requestAnimationFrame(draw);
  }

  let resizeTimer = 0;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      seed();
      start();
    }, 150);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else start();
  });

  seed();
  start();
})();
