/* ==========================================================================
   Nudge — main.js
   Dependency-free progressive enhancement: scroll reveals, sticky-nav hairline,
   the hero device build-in + pointer tilt + IO-gated mic pulse, and the
   legal-page TOC scroll-spy.

   GROUND RULES
   - Content is fully visible by default. Motion is an ADDED layer.
   - A strict prefers-reduced-motion guard leaves everything visible & still.
   - No dependencies. No build. Subpath-safe (no absolute URLs).
   - Animate transform/opacity only. will-change set during a transition only.
   ========================================================================== */
(function () {
  "use strict";

  // Mark JS available. CSS start-states (.reveal-ready / .build-ready) are
  // added by JS only when motion is allowed, so no-JS users see full content.
  document.documentElement.classList.add("js");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var motionOK = !reduce.matches && "IntersectionObserver" in window;

  /* ---------------------------------------------------------------------- */
  /* Sticky-nav hairline — IntersectionObserver on a 1px sentinel.          */
  /* ---------------------------------------------------------------------- */
  function initStickyNav() {
    var header = document.querySelector(".site-header");
    var sentinel = document.querySelector(".nav-sentinel");
    if (!header || !sentinel || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      header.classList.toggle("is-stuck", !entries[0].isIntersecting);
    }, { threshold: 0 });
    io.observe(sentinel);
  }

  /* ---------------------------------------------------------------------- */
  /* Scroll reveals — subtle, one-shot, with index-based stagger per group. */
  /* The hidden start-state class (.reveal-ready) is ONLY added when motion  */
  /* is allowed, so no-JS and reduced-motion users see fully-visible content.*/
  /* ---------------------------------------------------------------------- */
  function initReveals() {
    var els = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    if (!els.length) return;

    if (!motionOK) {
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

    // Index-based stagger: any group wrapper marked [data-reveal-group] gives
    // its [data-reveal] children an incremental delay. Ungrouped elements keep
    // any inline --reveal-delay already authored in the HTML.
    var groups = Array.prototype.slice.call(document.querySelectorAll("[data-reveal-group]"));
    groups.forEach(function (group) {
      var kids = Array.prototype.slice.call(group.querySelectorAll("[data-reveal]"));
      kids.forEach(function (el, i) {
        el.style.setProperty("--reveal-delay", (i * 70) + "ms");
      });
    });

    els.forEach(function (el) { el.classList.add("reveal-ready"); });

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          obs.unobserve(entry.target); // one-shot
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------------------- */
  /* Hero device build-in — interior rows cascade in once, IO-triggered.    */
  /* ---------------------------------------------------------------------- */
  function initHeroBuild() {
    var device = document.querySelector(".device--planned");
    if (!device || !motionOK) return;

    device.classList.add("build-ready");

    var io = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-built");
          obs.unobserve(entry.target); // one-shot
        }
      });
    }, { threshold: 0.25 });
    io.observe(device);
  }

  /* ---------------------------------------------------------------------- */
  /* Hero device pointer tilt — rAF-throttled, hover-capable pointers only.  */
  /* ---------------------------------------------------------------------- */
  function initHeroTilt() {
    var stage = document.querySelector(".device-stage");
    var device = document.querySelector(".device--planned");
    if (!stage || !device || !motionOK) return;
    if (!window.matchMedia("(hover:hover)").matches) return;

    var raf = 0;
    var pending = null;

    function apply() {
      raf = 0;
      if (!pending) return;
      device.style.setProperty("--ry", pending.ry.toFixed(2) + "deg");
      device.style.setProperty("--rx", pending.rx.toFixed(2) + "deg");
    }

    stage.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      var r = stage.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5;   // -0.5..0.5
      var py = (e.clientY - r.top) / r.height - 0.5;
      var clamp = function (v) { return Math.max(-4, Math.min(4, v)); };
      pending = { ry: clamp(px * 8), rx: clamp(-py * 8) };
      if (!raf) raf = requestAnimationFrame(apply);
    });

    stage.addEventListener("pointerleave", function () {
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      device.style.setProperty("--ry", "0deg");
      device.style.setProperty("--rx", "0deg");
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Mic listening pulse — ONE element, gated on the hero being on-screen.  */
  /* ---------------------------------------------------------------------- */
  function initMicPulse() {
    var device = document.querySelector(".device--planned");
    if (!device || !motionOK) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        device.classList.toggle("is-live", entry.isIntersecting);
      });
    }, { threshold: 0.2 });
    io.observe(device);
  }

  /* ---------------------------------------------------------------------- */
  /* Legal-page TOC scroll-spy (only present on doc pages). Runs regardless */
  /* of motion prefs — it's a state indicator, not animation.              */
  /* ---------------------------------------------------------------------- */
  function initTocSpy() {
    var toc = document.querySelector(".doc-toc");
    if (!toc || !("IntersectionObserver" in window)) return;
    var links = Array.prototype.slice.call(toc.querySelectorAll("a[href^='#']"));
    if (!links.length) return;
    var map = {};
    var targets = [];
    links.forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      var sec = document.getElementById(id);
      if (sec) { map[id] = a; targets.push(sec); }
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("is-current"); });
          var cur = map[entry.target.id];
          if (cur) cur.classList.add("is-current");
        }
      });
    }, { rootMargin: "-20% 0px -70% 0px", threshold: 0 });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------------------------------------------------------------------- */
  /* If the user flips reduced-motion ON mid-session, force the final state. */
  /* ---------------------------------------------------------------------- */
  function watchReduceChange() {
    var handler = function () {
      if (!reduce.matches) return;
      document.querySelectorAll("[data-reveal]").forEach(function (el) {
        el.classList.remove("reveal-ready");
        el.classList.add("is-in");
      });
      var device = document.querySelector(".device--planned");
      if (device) {
        device.classList.remove("build-ready", "is-live");
        device.classList.add("is-built");
        device.style.removeProperty("--rx");
        device.style.removeProperty("--ry");
      }
    };
    if (reduce.addEventListener) reduce.addEventListener("change", handler);
    else if (reduce.addListener) reduce.addListener(handler); // Safari fallback
  }

  /* ---------------------------------------------------------------------- */
  function init() {
    initStickyNav();
    initReveals();
    initHeroBuild();
    initHeroTilt();
    initMicPulse();
    initTocSpy();
    watchReduceChange();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
