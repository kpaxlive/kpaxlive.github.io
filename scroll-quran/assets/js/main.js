/* Shared by every page: the nav, the phone menu, the language switch, the
   contact dialog, and the scroll effects (reveals, split headings, the
   manifesto lighting up, parallax). */
(function () {
  "use strict";

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  // ------------------------------------------------------------ split words

  /** Wraps every word of [el] (inner elements kept) in .word > span. */
  function splitWords(el, className = "word", inner = true) {
    const words = [];
    const walk = (node) => {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === Node.TEXT_NODE) {
          const fragment = document.createDocumentFragment();
          for (const part of child.textContent.split(/(\s+)/)) {
            if (!part) continue;
            if (/^\s+$/.test(part)) {
              fragment.append(" ");
              continue;
            }
            const word = document.createElement("span");
            word.className = className;
            if (inner) {
              const span = document.createElement("span");
              span.textContent = part;
              word.append(span);
            } else {
              word.textContent = part;
            }
            fragment.append(word);
            words.push(word);
          }
          child.replaceWith(fragment);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          walk(child);
        }
      }
    };
    walk(el);
    return words;
  }

  function splitHeadings() {
    for (const el of $$("[data-split]")) {
      if (el.querySelector(".word")) continue;
      splitWords(el).forEach((word, i) => word.style.setProperty("--i", i));
      el.classList.add("split");
      if (el.hasAttribute("data-split-hero")) el.style.setProperty("--d", "350ms");
    }
  }

  // ------------------------------------------------------------ reveals

  const revealed = new WeakSet();
  const revealObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              entry.target.classList.add("is-in");
              revealed.add(entry.target);
              revealObserver.unobserve(entry.target);
            }
          },
          { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
        )
      : null;

  function observeReveals() {
    for (const el of $$("[data-reveal], [data-split]:not([data-split-hero])")) {
      if (revealed.has(el)) {
        el.classList.add("is-in");
        continue;
      }
      if (!revealObserver || reduceMotion) el.classList.add("is-in");
      else revealObserver.observe(el);
    }
  }

  // ------------------------------------------------------------ manifesto

  let manifestoWords = [];
  function prepareManifesto() {
    const el = $("[data-manifesto]");
    if (!el) return;
    manifestoWords = el.querySelector(".w") ? $$(".w", el) : splitWords(el, "w", false);
  }
  function updateManifesto(viewport) {
    if (!manifestoWords.length) return;
    const el = $("[data-manifesto]");
    const rect = el.getBoundingClientRect();
    // Lit from when its top passes 80% of the screen until its bottom
    // reaches 45%.
    const start = viewport * 0.8;
    const end = viewport * 0.45;
    const progress = (start - rect.top) / (rect.height + start - end);
    const lit = reduceMotion ? manifestoWords.length : Math.round(Math.min(1, Math.max(0, progress)) * manifestoWords.length);
    manifestoWords.forEach((word, i) => word.classList.toggle("on", i < lit));
  }

  // ------------------------------------------------------------ hero

  // The light fills the screen over this stretch of the hero's scroll
  // (hero.js uses the same numbers for the camera).
  const LIGHT_FROM = 0.55;
  const LIGHT_TO = 0.9;
  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  function updateHero(y, viewport) {
    const hero = $("[data-hero]");
    if (!hero) return;
    const progress = clamp01((y - hero.offsetTop) / Math.max(1, hero.offsetHeight - viewport));
    hero.style.setProperty("--hp", progress.toFixed(4));
    hero.style.setProperty("--lk", clamp01((progress - LIGHT_FROM) / (LIGHT_TO - LIGHT_FROM)).toFixed(4));
    hero.classList.toggle("is-past", progress > 0.2);
  }

  /** The light's lower edge: two sine waves sliding past each other, as
   *  the app's splash veil. */
  function setupWave() {
    const svg = $("[data-hero-wave]");
    if (!svg) return;
    const [glow, fill, rim] = $$("path", svg);
    // In the 1000 × 100 viewBox.
    const edge = (x, t) => {
      const u = (x / 1000) * Math.PI * 2;
      return 48 + 16 * Math.sin(u * 1.15 + t * 0.9) + 9 * Math.sin(u * 2.7 - t * 0.7 + 2.1);
    };
    const draw = (t) => {
      const points = [];
      for (let x = 0; x <= 1000; x += 20) points.push(`${x} ${edge(x, t).toFixed(1)}`);
      const line = `M${points.join("L")}`;
      glow.setAttribute("d", line);
      rim.setAttribute("d", line);
      fill.setAttribute("d", `M0 0${line.replace("M", "L")}L1000 0Z`);
    };
    draw(0);
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    let visible = false;
    const loop = (now) => {
      if (!visible) return;
      draw(now / 1000);
      requestAnimationFrame(loop);
    };
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      if (visible) requestAnimationFrame(loop);
    }).observe(svg);
  }

  // ------------------------------------------------------------ scroll loop

  const nav = $("[data-nav]");
  let lastY = window.scrollY;
  let ticking = false;
  const parallax = $$("[data-parallax]");

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const y = window.scrollY;
      const viewport = window.innerHeight;
      if (nav) {
        nav.classList.toggle("is-scrolled", y > 24);
        const menuOpen = document.body.classList.contains("menu-open");
        const goingDown = y > lastY + 4;
        const goingUp = y < lastY - 4;
        if (!menuOpen && goingDown && y > viewport * 0.9) nav.classList.add("is-hidden");
        if (goingUp || y < viewport * 0.5) nav.classList.remove("is-hidden");
      }
      lastY = y;
      updateHero(y, viewport);
      updateManifesto(viewport);
      if (!reduceMotion) {
        for (const el of parallax) {
          const rect = el.getBoundingClientRect();
          if (rect.bottom < -200 || rect.top > viewport + 200) continue;
          const offset = (rect.top + rect.height / 2 - viewport / 2) * parseFloat(el.dataset.parallax);
          el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        }
      }
    });
  }

  // ------------------------------------------------------------ menu

  function setupMenu() {
    const toggle = $(".nav__toggle");
    const menu = $("[data-menu]");
    if (!toggle || !menu) return;
    const set = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      document.body.style.overflow = open ? "hidden" : "";
      if (open) nav.classList.remove("is-hidden");
    };
    toggle.addEventListener("click", () => set(toggle.getAttribute("aria-expanded") !== "true"));
    menu.addEventListener("click", (event) => {
      if (event.target.closest("a, [data-contact]")) set(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") set(false);
    });
    matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
      if (event.matches) set(false);
    });
  }

  // ------------------------------------------------------------ contact

  function setupContact() {
    const dialog = $("[data-contact-dialog]");
    if (!dialog) return;
    document.addEventListener("click", (event) => {
      if (event.target.closest("[data-contact]")) {
        event.preventDefault();
        if (typeof dialog.showModal === "function") dialog.showModal();
        else location.href = $("a[href^='mailto:']", dialog).href;
      }
    });
    $("[data-contact-close]", dialog).addEventListener("click", () => dialog.close());
    // A click on the backdrop (outside the card) closes it.
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    const copy = $("[data-contact-copy]", dialog);
    copy.addEventListener("click", async () => {
      const email = $("[data-contact-email]", dialog).textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        copy.textContent = window.I18N.t("contact.copied");
        setTimeout(() => (copy.textContent = window.I18N.t("contact.copy")), 1800);
      } catch (_) {
        const range = document.createRange();
        range.selectNodeContents($("[data-contact-email]", dialog));
        getSelection().removeAllRanges();
        getSelection().addRange(range);
      }
    });
  }

  // ------------------------------------------------------------ language

  function setupLanguage() {
    document.addEventListener("click", (event) => {
      const button = event.target.closest("[data-lang]");
      if (button) window.I18N.set(button.dataset.lang);
    });
  }

  // ------------------------------------------------------------ legal contents

  function buildToc() {
    const toc = $("[data-toc]");
    if (!toc) return;
    const article = $(".paper article:not([hidden])");
    if (!article) return;
    const headings = $$("h2", article);
    toc.innerHTML = "";
    toc.lang = article.lang;
    toc.dir = article.dir;
    headings.forEach((heading, i) => {
      heading.id ||= `${article.dataset.langBlock}-${i + 1}`;
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${heading.id}`;
      a.textContent = heading.textContent;
      li.append(a);
      toc.append(li);
    });
    if (!("IntersectionObserver" in window)) return;
    const links = $$("a", toc);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          links.forEach((link) => link.classList.toggle("on", link.hash === `#${entry.target.id}`));
        }
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    headings.forEach((heading) => observer.observe(heading));
    buildToc.observer?.disconnect();
    buildToc.observer = observer;
  }

  // ------------------------------------------------------------ start

  function refresh() {
    splitHeadings();
    prepareManifesto();
    observeReveals();
    buildToc();
    onScroll();
  }

  document.addEventListener("DOMContentLoaded", () => {
    refresh();
    setupMenu();
    setupContact();
    setupLanguage();
    setupWave();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);

    const hero = $("[data-hero]");
    const start = () => hero && hero.classList.add("is-in");
    if (hero) {
      // Fonts first, so the words don't rise in one face and land in another.
      Promise.race([document.fonts?.ready, new Promise((r) => setTimeout(r, 700))]).then(() =>
        requestAnimationFrame(() => {
          start();
          $$("[data-split-hero]").forEach((el) => el.classList.add("is-in"));
        }),
      );
    }
  });

  // Text replaced by the language switch: split and reveal it again.
  document.addEventListener("langchange", () => {
    if (document.readyState === "loading") return;
    refresh();
    $$("[data-split-hero]").forEach((el) => {
      if ($("[data-hero]")?.classList.contains("is-in")) requestAnimationFrame(() => el.classList.add("is-in"));
    });
  });

  window.Site = { splitWords };
})();
