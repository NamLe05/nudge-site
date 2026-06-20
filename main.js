/* ==========================================================================
   Nudge — main.js
   Dependency-free progressive enhancement: subtle scroll reveals,
   sticky-nav hairline state, and legal-page TOC scroll-spy.

   GROUND RULES
   - Content is fully visible by default. Motion is an ADDED layer.
   - A strict prefers-reduced-motion guard leaves everything visible & still.
   - No dependencies. No build. Subpath-safe (no absolute URLs).
   ========================================================================== */
(function () {
  "use strict";

  // Mark JS available (kept for parity; CSS reveal start-state is added by JS
  // only when motion is allowed, so no-JS users always see full content).
  document.documentElement.classList.add("js");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

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
  /* Scroll reveals — subtle, one-shot. The hidden start-state class        */
  /* (.reveal-ready) is ONLY added when motion is allowed, so no-JS and     */
  /* reduced-motion users always see fully-visible content.                 */
  /* ---------------------------------------------------------------------- */
  function initReveals() {
    var els = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
    if (!els.length) return;

    if (reduce.matches || !("IntersectionObserver" in window)) {
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
      }
    };
    if (reduce.addEventListener) reduce.addEventListener("change", handler);
    else if (reduce.addListener) reduce.addListener(handler); // Safari fallback
  }

  /* ---------------------------------------------------------------------- */
  function init() {
    initStickyNav();
    initReveals();
    initTocSpy();
    watchReduceChange();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
