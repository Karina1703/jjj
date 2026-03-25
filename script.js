(() => {
  const friendName = "Anya Belozerova";
  const fromName = "я";

  const friendEl = document.getElementById("friendName");
  const fromEl = document.getElementById("fromName");
  if (friendEl) friendEl.textContent = friendName;
  if (fromEl) fromEl.textContent = fromName;

  const letterEl = document.getElementById("letter");
  const revealBtn = document.getElementById("revealBtn");
  const heartBtn = document.getElementById("heartBtn");
  const copyBtn = document.getElementById("copyBtn");
  const copyHint = document.getElementById("copyHint");
  const heartsLayer = document.getElementById("hearts");
  const stickersLayer = document.getElementById("stickers");

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")
    .matches;

  const heartEmojis = ["❤", "💗", "💖", "🩷"];
  const heartColors = ["#ff3b7a", "#ff6fb0", "#ff2d55", "#ff9ad0", "#ffd1e8"];

  function randItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function spawnHeart(xPercent) {
    if (!heartsLayer) return;
    if (prefersReducedMotion) return;

    const heart = document.createElement("span");
    heart.className = "heart";
    heart.textContent = randItem(heartEmojis);

    const size = 16 + Math.random() * 22;
    const drift = (Math.random() * 2 - 1) * 80;
    const delay = Math.random() * 0.18;
    const color = randItem(heartColors);

    heart.style.left = `${xPercent}%`;
    heart.style.fontSize = `${size}px`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.setProperty("--drift", `${drift}px`);
    heart.style.setProperty("--c", color);

    heartsLayer.appendChild(heart);
    heart.addEventListener("animationend", () => heart.remove());
  }

  function spawnBurst(count = 3) {
    for (let i = 0; i < count; i++) {
      spawnHeart(22 + Math.random() * 56);
    }
  }

  function spawnUnicorn(xPercent) {
    if (!stickersLayer) return;
    if (prefersReducedMotion) return;

    const sticker = document.createElement("span");
    sticker.className = "sticker";

    const emoji = Math.random() < 0.7 ? "🦄" : "✨";
    sticker.textContent = emoji;

    const size = emoji === "✨" ? 14 + Math.random() * 18 : 18 + Math.random() * 26;
    const drift = (Math.random() * 2 - 1) * 90;
    const delay = Math.random() * 0.14;

    sticker.style.left = `${xPercent}%`;
    sticker.style.fontSize = `${size}px`;
    sticker.style.animationDelay = `${delay}s`;
    sticker.style.setProperty("--drift", `${drift}px`);

    stickersLayer.appendChild(sticker);
    sticker.addEventListener("animationend", () => sticker.remove());
  }

  function spawnUnicornBurst(count = 1) {
    for (let i = 0; i < count; i++) {
      spawnUnicorn(20 + Math.random() * 60);
    }
  }

  // Reveal letter
  if (revealBtn && letterEl) {
    revealBtn.addEventListener("click", () => {
      if (!letterEl.hidden) return;
      letterEl.hidden = false;
      revealBtn.textContent = "Письмо открыто";

      // Мягкая “прибавка” сердечек после открытия
      spawnBurst(5 + Math.floor(Math.random() * 4));
      spawnUnicornBurst(2 + Math.floor(Math.random() * 2));
      document.documentElement.classList.add("revealed");
    });
  }

  // Heart gifting
  if (heartBtn) {
    heartBtn.addEventListener("click", () => {
      spawnBurst(7 + Math.floor(Math.random() * 5));
      spawnUnicornBurst(2 + Math.floor(Math.random() * 3));
    });
  }

  // Copy letter text
  if (copyBtn && letterEl && copyHint) {
    copyBtn.addEventListener("click", async () => {
      const raw = letterEl.innerText || "";
      const text = raw.replace(/\s+/g, " ").trim();

      try {
        await navigator.clipboard.writeText(text);
        copyHint.textContent = "Скопировано. Можно вставить в сообщение.";
      } catch {
        // Fallback для старых/ограниченных браузеров
        copyHint.textContent =
          "Не удалось скопировать автоматически. Выдели текст и скопируй вручную.";
      }

      // Сброс подсказки через пару секунд
      window.setTimeout(() => {
        copyHint.textContent = "";
      }, 3000);
    });
  }

  // Ambient hearts (background)
  if (!prefersReducedMotion && heartsLayer) {
    // “Трафик” сердечек/единорогов, не мешает чтению
    window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      const r = Math.random();
      if (r < 0.62) spawnHeart(18 + Math.random() * 64);
      else if (r < 0.72) spawnUnicorn(22 + Math.random() * 56);
    }, 720);
  }
})();

