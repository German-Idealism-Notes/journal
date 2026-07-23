/* ============================================
   German Idealism Notes — 全局脚本
   暗色模式 · 导航 · 回到顶部 · 折叠
   ============================================ */

(function () {
  'use strict';

  /* ---------- 暗色模式切换 ---------- */
  const html = document.documentElement;
  const STORAGE_KEY = 'gin-theme';

  function getTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleIcon(theme);
  }

  function updateToggleIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.setAttribute('aria-label', theme === 'dark' ? '切换到亮色模式' : '切换到暗色模式');
    btn.textContent = theme === 'dark' ? '☀️' : '🌙';
  }

  // 初始化时立即设置，避免闪烁
  const currentTheme = getTheme();
  html.setAttribute('data-theme', currentTheme);

  document.addEventListener('DOMContentLoaded', function () {
    updateToggleIcon(currentTheme);

    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        const newTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
      });
    }

    /* ---------- 汉堡菜单 ---------- */
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('site-nav');
    if (hamburger && nav) {
      hamburger.addEventListener('click', function () {
        const isOpen = nav.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
        hamburger.textContent = isOpen ? '✕' : '☰';
      });

      // 点击页面其他区域关闭菜单
      document.addEventListener('click', function (e) {
        if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
          nav.classList.remove('open');
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.textContent = '☰';
        }
      });
    }

    /* ---------- 回到顶部按钮 ---------- */
    const backBtn = document.getElementById('back-to-top');
    if (backBtn) {
      let scrollTicking = false;
      window.addEventListener('scroll', function () {
        if (!scrollTicking) {
          requestAnimationFrame(function () {
            if (window.scrollY > 400) {
              backBtn.classList.add('visible');
            } else {
              backBtn.classList.remove('visible');
            }
            scrollTicking = false;
          });
          scrollTicking = true;
        }
      });

      backBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    /* ---------- 摘要展开/折叠 ---------- */
    document.querySelectorAll('.abstract-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var targetId = this.getAttribute('data-target');
        var content = document.getElementById(targetId);
        if (content) {
          var isHidden = content.style.display === 'none' || !content.style.display;
          content.style.display = isHidden ? 'block' : 'none';
          this.textContent = isHidden ? '▲ 收起摘要' : '▼ 展开摘要';
        }
      });
    });

    /* ---------- 复制引用格式 ---------- */
    document.querySelectorAll('.copy-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var citeBlock = this.nextElementSibling || this.parentElement.querySelector('.cite-block');
        if (!citeBlock) return;
        var text = citeBlock.textContent.trim();
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = '✓ 已复制';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = '📋 复制';
            btn.classList.remove('copied');
          }, 2000);
        }).catch(function () {
          // 降级方案
          var ta = document.createElement('textarea');
          ta.value = text;
          ta.style.position = 'fixed';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          document.execCommand('copy');
          document.body.removeChild(ta);
          btn.textContent = '✓ 已复制';
          btn.classList.add('copied');
          setTimeout(function () {
            btn.textContent = '📋 复制';
            btn.classList.remove('copied');
          }, 2000);
        });
      });
    });

    /* ---------- 搜索筛选 (issues 页) ---------- */
    var searchInput = document.getElementById('article-search');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        var query = this.value.toLowerCase().trim();
        document.querySelectorAll('.article-table tbody tr').forEach(function (row) {
          if (row.classList.contains('abstract-row')) return;
          var text = row.textContent.toLowerCase();
          row.style.display = (query === '' || text.includes(query)) ? '' : 'none';
        });
      });
    }
  });
})();
