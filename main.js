/* ==========================================================================
   Nudge — main.js
   Dependency-free progressive enhancement: scroll reveals, sticky-nav state,
   the signature "sentence -> schedule" hero timeline, magnetic CTA, card glow,
   and legal-page TOC scroll-spy.

   GROUND RULES
   - Content is fully visible by default. Motion is an ADDED layer.
   - A strict prefers-reduced-motion guard leaves everything visible & still:
     init either early-returns or jumps to the resolved end-state.
   - No dependencies. No build. Subpath-safe (no absolute URLs).
   ========================================================================== */
(function () {
  "use strict";

  // Mark JS as available so CSS hides motion-start states (e.g. the hero
  // slide-in task) ONLY when we can animate them back in. If main.js never
  // loads, the class is absent and all content stays visible (no-JS safe).
  document.documentElement.classList.add("js");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------------------------------------------------------------- */
  /* Sticky-nav state — IntersectionObserver on a 1px sentinel (no scroll   */
  /* geometry reads, zero layout thrash). Runs regardless of motion prefs.  */
  /* ---------------------------------------------------------------------- */
  function initStickyNav() {
    var header = document.querySelector(".site-header");
    var sentinel = document.querySelector(".nav-sentinel");
    if (!header || !sentinel || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      // sentinel visible == at top of page
      header.classList.toggle("is-stuck", !entries[0].isIntersecting);
    }, { threshold: 0 });
    io.observe(sentinel);
  }

  /* ---------------------------------------------------------------------- */
  /* Scroll reveals — IntersectionObserver. The hidden start-state class    */
  /* (.reveal-ready) is ONLY added when motion is allowed, so no-JS and     */
  /* reduced-motion users always see fully-visible content.                 */
  /* ---------------------------------------------------------------------- */
  function initReveals() {
    var els = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    if (!els.length) return;

    if (reduce.matches || !("IntersectionObserver" in window)) {
      // make sure nothing is hidden; no observers
      els.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }

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
  /* Privacy shield checkmark line-draw.                                    */
  /* ---------------------------------------------------------------------- */
  function initShield() {
    var shield = document.querySelector("[data-draw]");
    if (!shield) return;
    if (reduce.matches || !("IntersectionObserver" in window)) {
      shield.classList.add("is-drawn");
      return;
    }
    var io = new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) {
        shield.classList.add("is-drawn");
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(shield);
  }

  /* ---------------------------------------------------------------------- */
  /* Card cursor-following glow (pointer-only, cosmetic).                    */
  /* ---------------------------------------------------------------------- */
  function initCardGlow() {
    if (reduce.matches) return;
    if (!window.matchMedia("(hover: hover)").matches) return;
    var cards = document.querySelectorAll(".card");
    cards.forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        card.style.setProperty("--mx", (e.clientX - r.left) + "px");
        card.style.setProperty("--my", (e.clientY - r.top) + "px");
      });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Magnetic primary CTA — subtle pointer pull (<=0.28).                    */
  /* ---------------------------------------------------------------------- */
  function initMagnetic() {
    if (reduce.matches) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var els = document.querySelectorAll(".magnetic");
    els.forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        // Gentle pull, clamped so the button never detaches from its label.
        var clamp = function (v) { return Math.max(-8, Math.min(8, v)); };
        var dx = clamp((e.clientX - (r.left + r.width / 2)) * 0.16);
        var dy = clamp((e.clientY - (r.top + r.height / 2)) * 0.16);
        el.style.transform = "translate(" + dx + "px," + dy + "px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  /* ---------------------------------------------------------------------- */
  /* Signature hero timeline: a spoken line types into the transcript chip, */
  /* the run re-times 8 -> 7, a focus block slides in from the mic origin,  */
  /* and a teal confirm tick blinks. Origin-aware, motion-safe only.        */
  /* ---------------------------------------------------------------------- */
  var HERO_LINE = "Push my run to 7 a.m. and add a focus block after lunch.";

  function setHeroResolvedState() {
    var txt = document.getElementById("transcript-text");
    var runTime = document.getElementById("run-time");
    var focus = document.getElementById("task-focus");
    if (txt) txt.textContent = HERO_LINE;
    if (runTime) runTime.textContent = "7:00 AM · 30 min";
    if (focus) { focus.classList.remove("slide-in"); focus.classList.add("shown"); }
    var caret = document.querySelector("#transcript .caret");
    if (caret) caret.style.display = "none";
  }

  function runHeroTimeline() {
    var txt = document.getElementById("transcript-text");
    var runTime = document.getElementById("run-time");
    var focus = document.getElementById("task-focus");
    var caret = document.querySelector("#transcript .caret");
    if (!txt || !runTime || !focus) { setHeroResolvedState(); return; }

    // ensure clean start state
    txt.textContent = "";
    if (caret) caret.style.display = "";
    runTime.textContent = "8:00 AM · 30 min";
    focus.classList.add("slide-in");
    focus.classList.remove("shown");

    var i = 0;
    function type() {
      if (i <= HERO_LINE.length) {
        txt.textContent = HERO_LINE.slice(0, i);
        i++;
        setTimeout(type, 34);
      } else {
        afterTyping();
      }
    }

    function afterTyping() {
      // re-time the run 8:00 -> 7:00 with a brief accent flash
      setTimeout(function () {
        runTime.classList.add("flash");
        runTime.textContent = "7:00 AM · 30 min";
        setTimeout(function () { runTime.classList.remove("flash"); }, 600);
      }, 360);

      // slide the focus block in from the mic origin
      setTimeout(function () {
        focus.classList.add("shown");
      }, 760);

      // settle the waveform / confirm with a tick pop on the breakfast row
      setTimeout(function () {
        var tick = document.getElementById("walk-tick");
        if (tick) {
          tick.classList.add("pop");
          setTimeout(function () { tick.classList.remove("pop"); }, 360);
        }
        if (caret) caret.style.display = "none";
        // Runs once when the hero scrolls into view, then rests — no perpetual
        // loop (a calm planner shouldn't have a restless typewriter in it).
      }, 1300);
    }

    type();
  }

  function initHero() {
    var phone = document.getElementById("hero-phone");
    if (!phone) return;
    if (reduce.matches) { setHeroResolvedState(); return; }

    // Clear the no-JS transcript fallback now (before reveal) so the line
    // types in cleanly instead of briefly flashing the full sentence.
    var t0 = document.getElementById("transcript-text");
    if (t0) t0.textContent = "";

    // start once the hero is in view (and fonts settled)
    var start = function () { runHeroTimeline(); };
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) { obs.disconnect(); start(); }
      }, { threshold: 0.4 });
      io.observe(phone);
    } else {
      start();
    }
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
  /* If the user flips reduced-motion ON mid-session, force everything in.  */
  /* ---------------------------------------------------------------------- */
  function watchReduceChange() {
    var handler = function () {
      if (reduce.matches) {
        document.querySelectorAll("[data-reveal]").forEach(function (el) {
          el.classList.remove("reveal-ready");
          el.classList.add("is-in");
        });
        var shield = document.querySelector("[data-draw]");
        if (shield) shield.classList.add("is-drawn");
        setHeroResolvedState();
      }
    };
    if (reduce.addEventListener) reduce.addEventListener("change", handler);
    else if (reduce.addListener) reduce.addListener(handler); // Safari fallback
  }

  /* ---------------------------------------------------------------------- */
  function init() {
    initStickyNav();
    initReveals();
    initShield();
    initCardGlow();
    initMagnetic();
    initHero();
    initTocSpy();
    watchReduceChange();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
