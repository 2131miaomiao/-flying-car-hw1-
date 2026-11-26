/* =========================================================
   陆地航母 · 交互脚本
   ========================================================= */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- scroll progress + nav state ---------- */
  var progress = document.getElementById('progress');
  var nav = document.getElementById('nav');

  function onScroll() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var p = max > 0 ? (h.scrollTop || document.body.scrollTop) / max : 0;
    if (progress) progress.style.width = (p * 100).toFixed(2) + '%';
    if (nav) nav.classList.toggle('scrolled', (h.scrollTop || document.body.scrollTop) > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- reveal ---------- */
  var revealEls = [].slice.call(document.querySelectorAll('.reveal'));
  if (reduce || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
    animateAll();
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          ro.unobserve(e.target);
          activateInside(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { ro.observe(el); });
  }

  function activateInside(root) {
    root.querySelectorAll('.fill[data-w], .bar i[data-w], [data-count]').forEach(function (el) {
      if (el.hasAttribute('data-count')) countUp(el);
      else el.style.width = el.getAttribute('data-w') + '%';
    });
  }

  function animateAll() {
    document.querySelectorAll('.fill[data-w], .bar i[data-w]').forEach(function (el) {
      el.style.width = el.getAttribute('data-w') + '%';
    });
    document.querySelectorAll('[data-count]').forEach(function (el) {
      el.textContent = fmt(el.getAttribute('data-count'), el) + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- counters ---------- */
  function fmt(n, el) {
    var v = parseFloat(n);
    var dec = (el && el.getAttribute('data-dec')) ? parseInt(el.getAttribute('data-dec'), 10) : 0;
    if (dec) return v.toFixed(dec);
    return Math.round(v).toLocaleString('en-US');
  }

  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = '1';
    var target = parseFloat(el.getAttribute('data-count'));
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var dec = String(target).indexOf('.') > -1 ? 1 : 0;
    var dur = 1300, start = null;

    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var e = 1 - Math.pow(1 - p, 3);
      var v = target * e;
      el.textContent = prefix + (dec ? v.toFixed(1) : Math.round(v).toLocaleString('en-US')) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = prefix + (dec ? target.toFixed(1) : Math.round(target).toLocaleString('en-US')) + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ---------- sections / active nav ---------- */
  var sections = [].slice.call(document.querySelectorAll('main section[id]'));
  var links = [].slice.call(document.querySelectorAll('.nav nav a'));

  if ('IntersectionObserver' in window && sections.length) {
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.id;
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { so.observe(s); });
  }

  /* ---------- tabs ---------- */
  var tabs = [].slice.call(document.querySelectorAll('.tab'));
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('active'); });
      t.classList.add('active');
      document.querySelectorAll('.panel').forEach(function (p) { p.classList.remove('active'); });
      var panel = document.getElementById(t.getAttribute('data-tab'));
      if (panel) panel.classList.add('active');
    });
  });

  /* ---------- product hotspots ---------- */
  var DETAIL = {
    duct: {
      k: '01 / LIFT SYSTEM',
      h: '六旋翼 · 双涵道',
      p: '两具大直径涵道包裹 6 副旋翼。涵道把叶尖涡流约束在环内：悬停效率更高、噪声更集中、桨叶被包住更安全。代价是结构增重与巡航阻力，因此它只服务于“垂直起降段”。'
    },
    dock: {
      k: '02 / DOCKING',
      h: '自动分离与结合',
      p: '全流程约 5 分钟：驻车调平 → 舱盖开启、机械锁止释放 → 机臂展开并自检 → 电气与冷却快接断开 → 飞控接管。对接精度与重复插拔寿命，是这个构型最容易被低估的可靠性难点。'
    },
    wheel: {
      k: '03 / CHASSIS',
      h: '6×6 全轮驱动 · 5.5 m',
      p: '陆行体走乘用车逻辑：车长 5.5 米、C 照可驾、增程续航 1000 公里以上。六轮的意义不只是越野通过性，更是把“满载飞行器 + 电池”的载荷稳稳送到起降点。'
    },
    range: {
      k: '04 / ENERGY',
      h: '增程 + 车对机补能',
      p: '陆行体可给飞行体充电约 6 次，相当于把“充电网络”变成了“油箱”。这是分体式最被低估的商业价值：它让飞行不依赖城市级充电基建，营地、景区、自家院子就能形成闭环。'
    },
    cabin: {
      k: '05 / COCKPIT',
      h: '双座座舱与飞控',
      p: '双座布局、一键起降与自主航线，把“驾驶”降级为“监控”。这既是让 C 照用户敢上手的前提，也是事故责任界定的关键：当机器接管得越多，人机责任边界就越需要写进运行规章。'
    }
  };

  var readout = document.getElementById('readout');
  var pins = [].slice.call(document.querySelectorAll('.hotspot'));

  function showDetail(key) {
    var d = DETAIL[key];
    if (!d || !readout) return;
    readout.innerHTML =
      '<div class="card"><p class="k">' + d.k + '</p><h4>' + d.h + '</h4><p>' + d.p + '</p></div>' +
      '<div class="card flat" style="border-style:dashed"><p class="k">操作提示</p><h4 style="font-size:15px">点击图中编号切换</h4><p>1 升力系统 · 2 对接机构 · 3 底盘 · 4 能源 · 5 座舱。编号对应左侧侧视图中的圆点。</p></div>';
    pins.forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-key') === key); });
  }

  pins.forEach(function (pin) {
    var key = pin.getAttribute('data-key');
    pin.addEventListener('click', function () { showDetail(key); });
    pin.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showDetail(key); }
    });
    pin.addEventListener('mouseenter', function () {
      pins.forEach(function (p) { p.classList.remove('active'); });
      pin.classList.add('active');
    });
  });
  showDetail('duct');

  /* ---------- hero counters on load ---------- */
  function startHeroCounters() {
    [].slice.call(document.querySelectorAll('.hero-stat [data-count]')).forEach(function (el, i) {
      if (reduce) {
        var t = parseFloat(el.getAttribute('data-count'));
        var dec = String(t).indexOf('.') > -1 ? 1 : 0;
        el.textContent = (el.getAttribute('data-prefix') || '') +
          (dec ? t.toFixed(1) : t.toLocaleString('en-US')) +
          (el.getAttribute('data-suffix') || '');
        return;
      }
      setTimeout(function () { countUp(el); }, 260 + i * 90);
    });
  }
  if (document.readyState === 'complete') startHeroCounters();
  else window.addEventListener('load', startHeroCounters);
})();
