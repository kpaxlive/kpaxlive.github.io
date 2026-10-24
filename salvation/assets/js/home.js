/* The home page's phones: the app's three tabs, live.
   - Verses of the Day: today's verses, worked out like the app does
     (its 84-day list, counted from 2026-01-01 by local date).
   - Prayer Room: the prayer everyone in the app sees right now (5-minute
     slots from the Unix epoch) and the time it has left.
   - Quran: Al-Fatiha, each word lighting up on the recitation's timings;
     silent until the visitor presses play, then with the real audio. */
(function () {
  "use strict";

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const t = (key, vars) => window.I18N.t(key, vars);
  const lang = () => window.I18N.lang;

  const SCREENS = ["verses", "prayer", "quran"];
  const DESIGN_WIDTH = 402;
  const FEED_PAGE = 470; // .feed height
  const FEED_STEP = 5200; // ms a verse stays
  const SLOT = 5 * 60 * 1000;

  const escape = (text) =>
    String(text).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const mss = (ms) => {
    const s = Math.max(0, Math.round(ms / 1000));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  };

  // ------------------------------------------------------------ data

  const data = {};
  const load = (name) =>
    fetch(`assets/data/${name}.json`)
      .then((response) => response.json())
      .then((json) => (data[name] = json));

  // ------------------------------------------------------------ phones

  /** { root, ui, slot, screen, visible } */
  const phones = [];

  function createPhones() {
    const template = $("#phone-template");
    if (!template) return;
    $$("[data-phone-slot]").forEach((slot, n) => {
      const fragment = template.content.cloneNode(true);
      const root = fragment.querySelector(".phone");
      // Ids must stay unique across the copies (the card's clip path).
      for (const el of $$("[id]", root)) {
        const id = el.id;
        el.id = `${id}-${n}`;
        $$(`[clip-path="url(#${id})"]`, root).forEach((user) => user.setAttribute("clip-path", `url(#${id}-${n})`));
      }
      slot.prepend(fragment);
      const phone = { root, ui: $(".ui", root), slot: slot.dataset.phoneSlot, screen: null, visible: false };
      phones.push(phone);
      setScreen(phone, phone.slot === "all" ? "verses" : phone.slot);
    });

    const resize = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const phone = phones.find((p) => p.root.contains(entry.target));
        const width = entry.contentRect.width;
        if (phone && width) {
          phone.ui.style.setProperty("--k", (width / DESIGN_WIDTH).toFixed(5));
          if (!phone.fitted) {
            phone.fitted = true;
            fitAll(phone);
          }
        }
      }
    });
    phones.forEach((phone) => resize.observe($(".phone__screen", phone.root)));

    const seen = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const phone = phones.find((p) => p.root === entry.target);
          if (!phone) continue;
          phone.visible = entry.isIntersecting;
          if (phone.visible) fitAll(phone);
        }
      },
      { rootMargin: "120px 0px" },
    );
    phones.forEach((phone) => seen.observe(phone.root));
  }

  function setScreen(phone, name) {
    if (phone.screen === name) return;
    phone.screen = name;
    for (const screen of $$("[data-screen]", phone.root)) screen.classList.toggle("on", screen.dataset.screen === name);
    const index = SCREENS.indexOf(name);
    $(".tabbar", phone.root).style.setProperty("--tab", index);
    for (const tab of $$("[data-tab]", phone.root)) tab.classList.toggle("on", tab.dataset.tab === name);
    if (phone.slot === "all") {
      for (const glow of $$("[data-glow]")) glow.classList.toggle("on", glow.dataset.glow === name);
    }
    fitAll(phone);
    placeAminHint();
  }

  const isOn = (phone, name) => phone.visible && phone.screen === name;

  /** Shrinks [text]'s --fs until [box] holds it (≥ 0.62), like the app's
   *  fitTextScale. Needs the phone laid out. */
  function fit(box, measure, limit) {
    if (!box || !box.offsetParent) return;
    let scale = 1;
    box.style.setProperty("--fs", scale);
    while (measure() > limit() && scale > 0.62) {
      scale -= 0.04;
      box.style.setProperty("--fs", scale.toFixed(2));
    }
  }

  function fitAll(phone) {
    if (!phone.visible && phone.fitted) return;
    for (const verse of $$(".verse", phone.root)) {
      const inner = $(".verse__inner", verse);
      fit(verse, () => inner.offsetHeight, () => FEED_PAGE - 8);
    }
    const text = $(".pcard__text", phone.root);
    const p = $("[data-prayer-text]", phone.root);
    fit(text, () => p.offsetHeight, () => text.clientHeight);
    const recite = $("[data-recite]", phone.root);
    fit(recite, () => recite.scrollHeight, () => recite.clientHeight);
  }

  function clock() {
    const now = new Date();
    const text = `${now.getHours() % (lang() === "en" ? 12 : 24) || 12}:${String(now.getMinutes()).padStart(2, "0")}`;
    $$("[data-clock]").forEach((el) => (el.textContent = text));
  }

  /** Little images that rise from [from] and fade, like the app's reactions. */
  function burst(phone, from, src, count = 5, size = 26) {
    if (reduceMotion) return;
    const ui = phone.ui;
    const k = parseFloat(getComputedStyle(ui).getPropertyValue("--k")) || 1;
    const a = from.getBoundingClientRect();
    const b = ui.getBoundingClientRect();
    const x = (a.left + a.width / 2 - b.left) / k;
    const y = (a.top - b.top) / k;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("i");
      el.className = "float";
      const s = size * (0.7 + Math.random() * 0.5);
      el.style.cssText = `left:${x - s / 2}px;top:${y}px;width:${s}px;height:${s}px;background-image:url('${src}');--dx:${(Math.random() - 0.5) * 120}px;--rot:${(Math.random() - 0.5) * 50}deg;animation-delay:${i * 90}ms`;
      ui.append(el);
      setTimeout(() => el.remove(), 1900 + i * 90);
    }
  }

  // ------------------------------------------------------------ verses of the day

  const feed = { items: [], day: null, index: 0, clock: 0, liked: new Set() };

  function todaysVerses() {
    const now = new Date();
    const dayNumber = Math.round(
      (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(2026, 0, 1)) / 86400000,
    );
    const days = data.daily.days;
    const keys = days[((dayNumber % days.length) + days.length) % days.length];
    return {
      day: now.toDateString(),
      items: keys.map((key) => ({ key, n: Number(key.split(":")[1]), ...data.daily.verses[key] })),
    };
  }

  function dateLabel() {
    const now = new Date();
    const locale = lang() === "en" ? "en-US" : "tr-TR";
    const day = now.toLocaleDateString(locale, { day: "numeric", month: "long" });
    const weekday = now.toLocaleDateString(locale, { weekday: "long" });
    return t("ui.date_pattern", { day, weekday });
  }

  function renderFeed() {
    if (!data.daily) return;
    const today = todaysVerses();
    if (today.day !== feed.day) {
      feed.day = today.day;
      feed.items = today.items;
      feed.index = 0;
      feed.clock = 0;
      feed.liked.clear();
    }
    const html = feed.items
      .map(
        (v, i) => `
        <div class="verse" style="top:${i * FEED_PAGE}px">
          <div class="verse__inner">
            <img class="verse__ornate" src="assets/img/divider-ornate.webp" alt="">
            <div class="ref">${escape(t("ui.ref", { s: v.s, n: v.n }))}</div>
            <p class="verse__ar" lang="ar">${escape(v.a)}</p>
            <div class="badge-row"><span class="ayah-badge">${v.n}</span></div>
            <p class="verse__meal">${escape(v[lang()] || v.tr)}</p>
            <img class="verse__diamond" src="assets/img/divider-diamond.webp" alt="">
          </div>
        </div>`,
      )
      .join("");
    for (const phone of phones) {
      $("[data-feed-track]", phone.root).innerHTML = html;
      fitAll(phone);
    }
    showFeedIndex(false);
  }

  function showFeedIndex(animate = true) {
    const total = data.daily ? data.daily.perDay : 10;
    const next = feed.items[feed.index + 1] || feed.items[0];
    for (const phone of phones) {
      const track = $("[data-feed-track]", phone.root);
      if (!animate) track.style.transition = "none";
      track.style.transform = `translateY(${-feed.index * FEED_PAGE}px)`;
      if (!animate) {
        track.offsetHeight; // apply before restoring the transition
        track.style.transition = "";
      }
      $("[data-feed-date]", phone.root).textContent = `${dateLabel()} · ${feed.index + 1}/${total}`;
      if (next) {
        $("[data-peek-ref]", phone.root).textContent = t("ui.ref", { s: next.s, n: next.n });
        $("[data-peek-ar]", phone.root).textContent = next.a;
      }
      $("[data-like]", phone.root).classList.toggle("liked", feed.liked.has(feed.index));
    }
  }

  function likeVerse(phone) {
    const act = $(".screen--verses [data-like]", phone.root);
    feed.liked.add(feed.index);
    act.classList.add("pressed");
    setTimeout(() => act.classList.remove("pressed"), 180);
    for (const p of phones) $(".screen--verses [data-like]", p.root).classList.add("liked");
    if (isOn(phone, "verses")) burst(phone, act, "assets/img/icon-heart-filled.webp", 4, 24);
  }

  function stepFeed(dt) {
    const watching = phones.filter((phone) => isOn(phone, "verses"));
    if (!watching.length || !feed.items.length || reduceMotion) return;
    const before = feed.clock;
    feed.clock += dt;
    // Halfway through every other verse, a like.
    if (feed.index % 2 === 0 && before < FEED_STEP * 0.5 && feed.clock >= FEED_STEP * 0.5 && !feed.liked.has(feed.index)) {
      watching.forEach(likeVerse);
    }
    if (feed.clock < FEED_STEP) return;
    feed.clock = 0;
    if (feed.index < feed.items.length - 1) {
      feed.index += 1;
      showFeedIndex(true);
    } else {
      // Back to the first: fade rather than scroll back up.
      for (const phone of phones) $("[data-feed-track]", phone.root).style.opacity = "0";
      setTimeout(() => {
        feed.index = 0;
        feed.liked.clear();
        showFeedIndex(false);
        for (const phone of phones) $("[data-feed-track]", phone.root).style.opacity = "";
      }, 450);
    }
  }

  // ------------------------------------------------------------ prayer room

  const room = { slot: null, amined: new Set() };

  function currentPrayer(slot) {
    const { order, prayers } = data.prayers;
    const id = order[((slot % order.length) + order.length) % order.length];
    return prayers[id];
  }

  function renderPrayer(animate) {
    if (!data.prayers) return;
    const prayer = currentPrayer(room.slot);
    const fill = () => {
      const topic = t(`cat.${prayer.c}`);
      for (const phone of phones) {
        $("[data-prayer-topic]", phone.root).textContent = topic;
        $("[data-prayer-text]", phone.root).textContent = `“${prayer[lang()] || prayer.tr}”`;
        $("[data-amin-foot]", phone.root).textContent = t(room.amined.has(room.slot) ? "ui.you_amin" : "ui.first_amin");
        $("[data-pcard-body]", phone.root).classList.remove("fading");
        fitAll(phone);
      }
      $$("[data-live-topic]").forEach((el) => (el.textContent = topic));
      placeAminHint();
    };
    if (!animate) return fill();
    for (const phone of phones) $("[data-pcard-body]", phone.root).classList.add("fading");
    setTimeout(fill, 500);
  }

  function tickPrayer() {
    if (!data.prayers) return;
    const now = Date.now();
    const slot = Math.floor(now / SLOT);
    if (slot !== room.slot) {
      const first = room.slot === null;
      room.slot = slot;
      renderPrayer(!first);
    }
    const left = mss(SLOT - (now % SLOT));
    $$("[data-prayer-left], [data-live-left]").forEach((el) => {
      if (el.textContent !== left) el.textContent = left;
    });
  }

  function sayAmin(phone, button) {
    button.classList.remove("ripple");
    button.offsetWidth; // restart the ring
    button.classList.add("ripple", "pressed");
    setTimeout(() => button.classList.remove("pressed"), 160);
    burst(phone, button, "assets/img/gold-hands.webp", 6, 30);
    room.amined.add(room.slot);
    for (const p of phones) $("[data-amin-foot]", p.root).textContent = t("ui.you_amin");
    placeAminHint();
  }

  /** The "tap to say ameen" note beside the big phone, at its button. */
  function placeAminHint() {
    const hint = $("[data-amin-hint]");
    const phone = phones.find((p) => p.slot === "all");
    if (!hint || !phone) return;
    const show = phone.screen === "prayer" && room.slot !== null && !room.amined.has(room.slot);
    hint.classList.toggle("on", show);
    if (!show) return;
    const stage = hint.parentElement.getBoundingClientRect();
    const button = $(".screen--prayer [data-amin]", phone.root).getBoundingClientRect();
    const frame = phone.root.getBoundingClientRect();
    if (!button.width) return;
    hint.style.top = `${button.top + button.height / 2 - stage.top - hint.offsetHeight / 2}px`;
    hint.style.right = `${stage.right - frame.left + 18}px`;
  }

  // ------------------------------------------------------------ quran player

  const GAP = 700; // silent pause between ayahs, as RecitationLoop
  const player = { ayah: 0, t: 0, playing: false, audio: null, shown: -1, word: -2, amp: 0.5 };

  const ayahs = () => (data.fatiha ? data.fatiha.ayahs : []);
  const lengthOf = (ayah) => ayah.t[ayah.t.length - 1];
  const total = () => ayahs().reduce((sum, a) => sum + lengthOf(a), 0);

  /** Words as the app counts them: tokens, a waqf mark joining the word before. */
  function tokens(arabic) {
    let word = -1;
    return arabic.split(" ").map((token) => {
      const pause = [...token].every((c) => c.codePointAt(0) >= 0x06d6 && c.codePointAt(0) <= 0x06dc);
      if (!pause) word++;
      return { token, word };
    });
  }

  function wordAt(ayah, ms) {
    const times = ayah.t;
    if (ms < times[0]) return -1;
    for (let i = times.length - 2; i >= 0; i--) if (ms >= times[i]) return i;
    return -1;
  }

  function renderAyah(animate) {
    const ayah = ayahs()[player.ayah];
    if (!ayah) return;
    player.shown = player.ayah;
    player.word = -2;
    const html = tokens(ayah.a)
      .map(({ token, word }) => `<span data-w="${word}">${escape(token)}</span>`)
      .join(" ");
    const fill = () => {
      for (const phone of phones) {
        $("[data-recite-ar]", phone.root).innerHTML = html;
        $("[data-recite-meal]", phone.root).textContent = ayah[lang()] || ayah.tr;
        $("[data-player-status]", phone.root).innerHTML = t("ui.listening", { n: ayah.n });
        $("[data-player-surah]", phone.root).textContent = t("ui.surah", { s: lang() === "en" ? "Al-Fatiha" : "Fâtiha" });
        $("[data-recite]", phone.root).classList.remove("swap");
        fitAll(phone);
      }
      highlight();
    };
    if (!animate || reduceMotion) return fill();
    for (const phone of phones) $("[data-recite]", phone.root).classList.add("swap");
    setTimeout(fill, 260);
  }

  function highlight() {
    const ayah = ayahs()[player.ayah];
    if (!ayah || player.shown !== player.ayah) return;
    const word = wordAt(ayah, player.t);
    if (word !== player.word) {
      player.word = word;
      player.amp = 0.45 + Math.random() * 0.55;
      for (const phone of phones) {
        for (const span of $$("[data-recite-ar] span", phone.root)) {
          const w = Number(span.dataset.w);
          span.classList.toggle("now", w === word);
          span.classList.toggle("up", w > word);
        }
      }
    }
    const before = ayahs()
      .slice(0, player.ayah)
      .reduce((sum, a) => sum + lengthOf(a), 0);
    const elapsed = before + Math.min(player.t, lengthOf(ayah));
    const progress = elapsed / total();
    for (const phone of phones) {
      if (!isOn(phone, "quran")) continue;
      $("[data-seek]", phone.root).style.setProperty("--p", progress.toFixed(4));
      $("[data-time-now]", phone.root).textContent = mss(elapsed);
      $("[data-time-left]", phone.root).textContent = `-${mss(total() - elapsed)}`;
    }
  }

  function waves(now) {
    // Recitation: jumps with every word, settling in between; silent: a
    // slow breath.
    const target = player.playing ? player.amp : 0.4 + 0.12 * Math.sin(now / 600);
    player.amp += (0.32 - player.amp) * (player.playing ? 0.04 : 0);
    for (const phone of phones) {
      if (!isOn(phone, "quran")) continue;
      for (const [i, wave] of $$(".emblem__wave", phone.root).entries()) {
        const jitter = player.playing ? 0.08 * Math.sin(now / 90 + i * 2) : 0;
        wave.style.setProperty("--amp", (target + jitter).toFixed(3));
      }
    }
  }

  function stepPlayer(dt) {
    if (!data.fatiha) return;
    if (player.playing && player.audio) {
      player.t = player.audio.currentTime * 1000;
    } else if (!reduceMotion && phones.some((phone) => isOn(phone, "quran"))) {
      player.t += dt;
      const ayah = ayahs()[player.ayah];
      if (player.t > lengthOf(ayah) + GAP) {
        player.ayah = (player.ayah + 1) % ayahs().length;
        player.t = 0;
        renderAyah(true);
      }
    }
    highlight();
  }

  function audioUrl(index) {
    return `assets/audio/fatiha/${String(index + 1).padStart(3, "0")}.mp3`;
  }

  function playAyah(index) {
    player.ayah = index;
    player.t = 0;
    renderAyah(player.shown !== index);
    const audio = player.audio;
    audio.src = audioUrl(index);
    audio.play().catch(() => setPlaying(false));
    // Fetch the next one now, so it starts without a gap.
    if (index + 1 < ayahs().length) fetch(audioUrl(index + 1)).catch(() => {});
  }

  function setPlaying(playing) {
    player.playing = playing;
    $$("[data-play], [data-listen]").forEach((button) => button.setAttribute("aria-pressed", String(playing)));
    $$("[data-listen-label]").forEach((el) => (el.textContent = t(playing ? "ch3.pause" : "ch3.listen")));
  }

  function togglePlay() {
    if (!data.fatiha) return;
    if (!player.audio) {
      player.audio = new Audio();
      player.audio.preload = "auto";
      player.audio.addEventListener("ended", () => {
        if (!player.playing) return;
        if (player.ayah + 1 < ayahs().length) playAyah(player.ayah + 1);
        else {
          setPlaying(false);
          player.ayah = 0;
          player.t = 0;
          renderAyah(true);
        }
      });
    }
    if (player.playing) {
      player.audio.pause();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    // Fresh start from the first ayah, or carry on mid-ayah after a pause.
    if (player.audio.src && player.audio.currentTime > 0 && !player.audio.ended && player.audio.src.endsWith(audioUrl(player.ayah))) {
      player.audio.play().catch(() => setPlaying(false));
    } else {
      playAyah(player.audio.src ? player.ayah : 0);
    }
  }

  // ------------------------------------------------------------ chapters & stage

  function setupStage() {
    const stagePhone = phones.find((phone) => phone.slot === "all");
    if (!stagePhone || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setScreen(stagePhone, entry.target.dataset.chapter);
        }
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    $$("[data-chapter]").forEach((chapter) => observer.observe(chapter));

    // The phone leans a little towards the pointer.
    const tabs = $("[data-tabs]");
    if (!reduceMotion && matchMedia("(hover: hover)").matches) {
      tabs.addEventListener("pointermove", (event) => {
        const x = event.clientX / innerWidth - 0.5;
        const y = event.clientY / innerHeight - 0.5;
        stagePhone.root.style.setProperty("--ry", `${(-7 + x * 8).toFixed(2)}deg`);
        stagePhone.root.style.setProperty("--rx", `${(3 - y * 6).toFixed(2)}deg`);
      });
      tabs.addEventListener("pointerleave", () => {
        stagePhone.root.style.removeProperty("--ry");
        stagePhone.root.style.removeProperty("--rx");
      });
    }
  }

  function setupInteractions() {
    document.addEventListener("click", (event) => {
      const phone = phones.find((p) => p.root.contains(event.target));
      if (event.target.closest("[data-listen]") || (phone && event.target.closest("[data-play]"))) {
        togglePlay();
        return;
      }
      if (!phone) return;
      const amin = event.target.closest("[data-amin]");
      if (amin) return sayAmin(phone, amin);
      const like = event.target.closest("[data-like]");
      if (like) {
        if (like.closest(".screen--verses")) return likeVerse(phone);
        like.classList.toggle("liked");
        like.classList.add("pressed");
        setTimeout(() => like.classList.remove("pressed"), 180);
        if (like.classList.contains("liked")) burst(phone, like, "assets/img/icon-heart-filled.webp", 4, 22);
      }
    });
  }

  // ------------------------------------------------------------ loop

  let last = performance.now();
  let lastSecond = 0;
  function frame(now) {
    const dt = Math.min(100, now - last);
    last = now;
    stepFeed(dt);
    stepPlayer(dt);
    waves(now);
    if (now - lastSecond > 250) {
      lastSecond = now;
      tickPrayer();
    }
    requestAnimationFrame(frame);
  }

  // ------------------------------------------------------------ start

  document.addEventListener("DOMContentLoaded", () => {
    if (!$("#phone-template")) return;
    createPhones();
    window.I18N.apply(); // the copies' texts
    setupStage();
    setupInteractions();
    clock();
    setInterval(clock, 20000);
    addEventListener("resize", placeAminHint);

    Promise.all([load("daily"), load("prayers"), load("fatiha")])
      .catch(() => {})
      .then(() => {
        renderFeed();
        tickPrayer();
        renderAyah(false);
        requestAnimationFrame(frame);
      });
  });

  document.addEventListener("langchange", () => {
    if (!phones.length) return;
    clock();
    renderFeed();
    if (room.slot !== null) renderPrayer(false);
    if (player.shown >= 0) renderAyah(false);
    setPlaying(player.playing);
  });
})();
