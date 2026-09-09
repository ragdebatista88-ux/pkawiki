/* PKA Wiki i18n — catálogo JSON ES / PT-BR, optimizado para carga rápida y sin recargar. */
(() => {
  'use strict';
  const STORAGE_KEY = 'pka-wiki-language';
  const SUPPORTED = new Set(['es', 'pt-BR']);
  const jsonCache = new Map();
  let lang = SUPPORTED.has(localStorage.getItem(STORAGE_KEY)) ? localStorage.getItem(STORAGE_KEY) : 'es';
  let catalogs = { es: {}, 'pt-BR': {} };
  let reverse = {};
  let dynamicReady = false;
  let applying = false;
  let observerQueued = false;
  const pendingRoots = new Set();
  const page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';

  async function getJSON(url) {
    if (jsonCache.has(url)) return jsonCache.get(url);
    const promise = fetch(url, { cache: 'force-cache' })
      .then(r => r.ok ? r.json() : {})
      .catch(() => ({}));
    jsonCache.set(url, promise);
    return promise;
  }

  async function loadBaseCatalogs() {
    const pagePath = `lang/${lang}/pages/${page}.json`;
    const targetPaths = [`lang/${lang}/common.json`, pagePath];
    const target = await Promise.all(targetPaths.map(getJSON));
    catalogs[lang] = Object.assign({}, ...target);

    if (lang === 'es') {
      catalogs.es = catalogs.es && Object.keys(catalogs.es).length ? { ...catalogs.es, ...catalogs[lang] } : catalogs[lang];
      reverse = {};
      dynamicReady = false;
      return;
    }

    const source = await Promise.all([
      getJSON('lang/es/common.json'),
      getJSON(`lang/es/pages/${page}.json`)
    ]);
    catalogs.es = Object.assign({}, ...source);
    rebuildReverse();
    dynamicReady = false;
  }

  function rebuildReverse() {
    reverse = {};
    Object.entries(catalogs.es || {}).forEach(([k, v]) => {
      if (typeof v === 'string') reverse[v.trim()] = k;
    });
  }

  async function loadDynamicCatalogs() {
    if (lang === 'es' || dynamicReady) return;
    const [sourceDynamic, targetDynamic] = await Promise.all([
      getJSON('lang/es/dynamic.json'),
      getJSON(`lang/${lang}/dynamic.json`)
    ]);
    catalogs.es = Object.assign({}, catalogs.es, sourceDynamic);
    catalogs[lang] = Object.assign({}, catalogs[lang], targetDynamic);
    rebuildReverse();
    dynamicReady = true;
  }

  function tKey(key) {
    return catalogs[lang]?.[key] ?? catalogs.es?.[key] ?? key;
  }

  function tText(text) {
    if (!text || lang === 'es') return text;
    const s = text.trim();
    const k = reverse[s];
    if (!k) return text;
    return text.replace(s, tKey(k));
  }

  function applyKeyed(root = document) {
    if (root.nodeType === 1 && root.matches?.('[data-i18n]')) root.textContent = tKey(root.dataset.i18n);
    root.querySelectorAll?.('[data-i18n]').forEach(el => el.textContent = tKey(el.dataset.i18n));
    root.querySelectorAll?.('[data-i18n-placeholder]').forEach(el => el.setAttribute('placeholder', tKey(el.dataset.i18nPlaceholder)));
    root.querySelectorAll?.('[data-i18n-title]').forEach(el => el.setAttribute('title', tKey(el.dataset.i18nTitle)));
    root.querySelectorAll?.('[data-i18n-aria-label]').forEach(el => el.setAttribute('aria-label', tKey(el.dataset.i18nAriaLabel)));
  }

  function translateDynamic(root = document.body) {
    if (!root || lang === 'es' || !dynamicReady) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(n => {
      const p = n.parentElement;
      if (!p || p.closest('[data-no-i18n],script,style,pre,code,textarea,.languageSwitcher,[data-i18n]')) return;
      const out = tText(n.nodeValue);
      if (out !== n.nodeValue) n.nodeValue = out;
    });
    root.querySelectorAll?.('[placeholder],[title],[aria-label]').forEach(el => {
      if (el.closest('[data-no-i18n],.languageSwitcher')) return;
      ['placeholder', 'title', 'aria-label'].forEach(a => {
        if (el.hasAttribute(a)) el.setAttribute(a, tText(el.getAttribute(a)));
      });
    });
  }

  function injectSwitcher() {
    if (document.querySelector('.languageSwitcher')) return;
    const shell = document.querySelector('.topbar');
    if (!shell) return;
    const wrap = document.createElement('label');
    wrap.className = 'languageSwitcher';
    wrap.setAttribute('data-no-i18n', '');
    wrap.innerHTML = '<span class="languageIcon" aria-hidden="true">🌐</span><select id="wikiLanguageSelect" aria-label="Idioma"><option value="es">ES · Español</option><option value="pt-BR">BR · Português</option></select>';
    shell.appendChild(wrap);
    const select = wrap.querySelector('select');
    select.value = lang;
    select.addEventListener('change', e => setLanguage(e.target.value));
  }

  async function applyDynamicWhenIdle() {
    if (lang === 'es') return;
    await loadDynamicCatalogs();
    const work = () => {
      applying = true;
      translateDynamic(document.body);
      applying = false;
    };
    if ('requestIdleCallback' in window) requestIdleCallback(work, { timeout: 250 });
    else setTimeout(work, 0);
  }

  async function render() {
    applying = true;
    document.documentElement.lang = lang;
    await loadBaseCatalogs();
    applyKeyed();
    const select = document.querySelector('#wikiLanguageSelect');
    if (select) select.value = lang;
    applying = false;

    // La interfaz visible queda lista primero; el catálogo dinámico grande se carga después.
    document.dispatchEvent(new CustomEvent('pka:languagechange', { detail: { language: lang } }));
    applyDynamicWhenIdle();
  }

  async function setLanguage(next) {
    lang = SUPPORTED.has(next) ? next : 'es';
    localStorage.setItem(STORAGE_KEY, lang);
    dynamicReady = false;
    await render();
  }

  function flushPending() {
    observerQueued = false;
    if (applying) return;
    applying = true;
    const roots = [...pendingRoots];
    pendingRoots.clear();
    roots.forEach(root => {
      if (root.nodeType === 1) {
        applyKeyed(root);
        translateDynamic(root);
      } else if (root.nodeType === 3 && root.parentElement && lang !== 'es' && dynamicReady) {
        const out = tText(root.nodeValue);
        if (out !== root.nodeValue) root.nodeValue = out;
      }
    });
    applying = false;
  }

  const observer = new MutationObserver(mutations => {
    if (applying) return;
    mutations.forEach(m => m.addedNodes.forEach(n => pendingRoots.add(n)));
    if (!observerQueued && pendingRoots.size) {
      observerQueued = true;
      requestAnimationFrame(flushPending);
    }
  });

  async function init() {
    injectSwitcher();
    observer.observe(document.body, { childList: true, subtree: true });
    await render();
  }

  window.PKAI18N = {
    setLanguage,
    getLanguage: () => lang,
    t: tText,
    tKey,
    refresh: render
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
