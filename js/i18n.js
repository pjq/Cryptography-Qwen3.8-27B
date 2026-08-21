/* i18n — EN / 中文, auto-detect locale, persisted */
(function () {
  var LANGS = {
    en: {
      app_title: "CryptoWorld 3D",
      lang_btn: "中文",
      map: "Map",
      map_title: "Choose an island",
      map_desc: "Tap a world to fly there",
      sound: "Sound",
      start: "Start",
      prev: "Prev",
      next: "Next",
      complete_title: "World complete!",
      complete_sub: "You unlocked the island. Explore the map or keep experimenting.",
      go_map: "Open Map",
      back: "Back to world",
      hint_orbit: "Drag to orbit · pinch / wheel to zoom",
      hint_tap: "Tap the machine to begin",
      load1: "Unlocking the world…",
      load2: "Aligning rotors…",
      load3: "Generating keys…",
      load4: "Almost there…",
      islands: {
        gate:   { name: "Cipher Gate",      sub: "Prologue · what is cryptography?",        desc: "The gate" },
        caesar: { name: "Caesar Keep",      sub: "Classical ciphers · substitution",          desc: "Shift ciphers" },
        rail:   { name: "Rail Fence Dunes", sub: "Classical ciphers · transposition",          desc: "Reorder ciphers" },
        enigma: { name: "Enigma Island",    sub: "Electromechanical rotor machines, 1918",    desc: "The machine" },
        aes:    { name: "AES Citadel",      sub: "Modern symmetric cryptography, 1977→1997",  desc: "Block cipher" },
        rsa:    { name: "RSA Beacon",       sub: "Asymmetric crypto · public keys, 1977",     desc: "Numbers" },
        quantum:{ name: "Quantum Reef",     sub: "Shor, Grover & post-quantum crypto",        desc: "The future" }
      }
    },
    zh: {
      app_title: "密码学世界 3D",
      lang_btn: "EN",
      map: "地图",
      map_title: "选择岛屿",
      map_desc: "点击世界飞过去",
      sound: "声音",
      start: "开始",
      prev: "上一个",
      next: "下一个",
      complete_title: "世界通关！",
      complete_sub: "你解锁了这座岛屿。可以打开地图继续探索，或继续实验。",
      go_map: "打开地图",
      back: "回到世界",
      hint_orbit: "拖拽旋转 · 双指/滚轮缩放",
      hint_tap: "点击机器开始",
      load1: "正在解锁世界…",
      load2: "校准转子…",
      load3: "生成密钥…",
      load4: "即将完成…",
      islands: {
        gate:   { name: "密码之门",     sub: "序章 · 什么是密码学？",       desc: "大门" },
        caesar: { name: "凯撒城堡",     sub: "古典密码 · 替换密码",         desc: "移位密码" },
        rail:   { name: "栅栏沙丘",     sub: "古典密码 · 换位密码",         desc: "重排密码" },
        enigma: { name: "恩尼格玛岛",   sub: "机电转子密码机，1918",        desc: "机器" },
        aes:    { name: "AES 城堡",     sub: "现代对称加密，1977→1997",     desc: "分组密码" },
        rsa:    { name: "RSA 灯塔",     sub: "非对称加密 · 公钥，1977",     desc: "数学" },
        quantum:{ name: "量子珊瑚礁",   sub: "Shor、Grover 与后量子密码",   desc: "未来" }
      }
    }
  };
  var stored = null;
  try { stored = localStorage.getItem("crypto3d-lang"); } catch (e) {}
  var cur = stored;
  if (!cur || !LANGS[cur]) {
    var nav = (navigator.language || "en");
    cur = /^zh/i.test(nav) ? "zh" : "en";
  }
  function t(key) {
    var parts = key.split("."), node = LANGS[cur];
    for (var i = 0; i < parts.length; i++) {
      if (node && typeof node === "object") node = node[parts[i]];
    }
    return (node === undefined || node === null) ? key : node;
  }
  window.I18N = {
    get lang() { return cur; },
    set lang(v) {
      if (!LANGS[v]) return;
      cur = v;
      try { localStorage.setItem("crypto3d-lang", v); } catch (e) {}
      document.documentElement.lang = (cur === "zh") ? "zh-CN" : "en";
    },
    toggle: function () { this.lang = (cur === "zh") ? "en" : "zh"; },
    t: t,
    has: function (key) {
      var parts = key.split("."), node = LANGS[cur];
      for (var i = 0; i < parts.length; i++) {
        if (node && typeof node === "object") node = node[parts[i]]; else return false;
      }
      return node !== undefined && node !== null;
    }
  };
})();