#!/usr/bin/env node
/**
 * vgms-cli - 维普毕业论文管理系统 CLI
 * 用法: node vgms.js <command> [options]
 *
 * 环境:
 *   VGMS_BASE_URL  - 维普系统地址，默认 https://vgms.fanyu.com
 *   VGMS_COOKIE_JAR - cookie 保存路径，默认 ~/.vgms/cookies.json
 *   VGMS_DEBUG=1   - 开启调试输出
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const BASE_URL = process.env.VGMS_BASE_URL || 'https://vgms.fanyu.com';
const DEBUG = process.env.VGMS_DEBUG === '1';
const CONFIG_DIR = path.join(os.homedir(), '.vgms');
const COOKIE_FILE = path.join(CONFIG_DIR, 'cookies.json');

// ── 工具函数 ──────────────────────────────────────────────────────────────

function log(...args) { console.log('[vgms]', ...args); }
function debug(...args) { if (DEBUG) console.log('[vgms][debug]', ...args); }
function error(...args) { console.error('[vgms][error]', ...args); }

function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

/** 从 cookie jar 读取 cookie 字符串 */
function loadCookies() {
  try {
    const jar = JSON.parse(fs.readFileSync(COOKIE_FILE, 'utf8'));
    return jar.map(c => `${c.name}=${c.value}`).join('; ');
  } catch {
    return '';
  }
}

/** 保存 cookie 到 jar */
function saveCookies(cookies) {
  ensureConfigDir();
  // cookies 是 "name=value; name2=value2" 格式
  const jar = cookies.split(';').map(s => {
    const [name, ...rest] = s.trim().split('=');
    return { name, value: rest.join('='), domain: '.fanyu.com' };
  }).filter(c => c.name);
  fs.writeFileSync(COOKIE_FILE, JSON.stringify(jar, null, 2));
}

/** 清空 cookie */
function clearCookies() {
  try {
    fs.unlinkSync(COOKIE_FILE);
    log('已清除登录状态');
  } catch {}
}

/** HTTP 请求封装 */
function request(method, urlPath, { data, headers, json = true } = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE_URL);
    const isHttps = url.protocol === 'https:';
    const lib = isHttps ? https : http;

    const options = {
      method,
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': json ? 'application/json, text/javascript, */*; q=0.01' : '*/*',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Referer': BASE_URL + '/',
        ...headers,
      },
    };

    // 带上 cookie
    const savedCookies = loadCookies();
    if (savedCookies) {
      options.headers['Cookie'] = savedCookies;
    }

    if (data) {
      const body = typeof data === 'string' ? data : new URLSearchParams(data).toString();
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
      options.headers['Content-Length'] = Buffer.byteLength(body);
      options.body = body;
    }

    debug(`${method} ${url.href}`);
    if (DEBUG && data) debug('body:', typeof data === 'string' ? data : new URLSearchParams(data).toString());

    const req = lib.request(options, (res) => {
      // 保存 set-cookie
      const setCookie = res.headers['set-cookie'];
      if (setCookie) {
        const newCookies = setCookie.map(c => c.split(';')[0]).join('; ');
        debug('set-cookie:', newCookies);
        if (newCookies.includes('JSESSIONID') || newCookies.includes('SESSION')) {
          saveCookies(newCookies);
        }
      }

      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (!json) return resolve(body);
        try {
          const parsed = JSON.parse(body);
          resolve(parsed);
        } catch {
          // 可能是 HTML 重定向
          resolve({ _raw: body, _status: res.statusCode });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(typeof data === 'string' ? data : new URLSearchParams(data).toString());
    req.end();
  });
}

function post(url, data, opts = {}) { return request('POST', url, { data, ...opts }); }
function get(url, opts = {}) { return request('GET', url, opts); }

/** 检查登录状态 */
async function checkLogin() {
  try {
    const res = await get('/admin/index', { json: false });
    // 如果是 HTML 但不包含登录表单，说明已登录
    if (typeof res._raw === 'string' && !res._raw.includes('账号登录') && !res._raw.includes('login')) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ── 命令实现 ──────────────────────────────────────────────────────────────

/** login - 登录 */
async function cmdLogin(schoolCode, username, password) {
  if (!schoolCode || !username || !password) {
    error('用法: vgms login <学校代码> <用户名> <密码>');
    error('');
    error('示例: vgms login 112704 学号 password');
    error('');
    log('常用学校代码:');
    log('  112704 - 肇庆医学高等专科学校');
    log('  112707 - 重庆大学');
    log('  112696 - 中山大学');
    log('  110001 - 安徽大学');
    log('  (完整列表见 https://vgms.fanyu.com/js/schools-*.js)');
    process.exit(1);
  }

  log(`正在登录: 学校=${schoolCode} 用户=${username}`);

  // 步骤1: 验证用户
  const verifyRes = await post('/loginVerify?username=' + schoolCode + '_' + username, {
    code: schoolCode,
    password: password,
    captcha: '',
    phoneCodeInfo: ''
  }, { json: true });

  debug('verifyRes:', JSON.stringify(verifyRes));

  if (verifyRes._raw) {
    // 返回了 HTML，可能是直接登录成功
    if (typeof verifyRes._raw === 'string' && verifyRes._raw.includes('admin')) {
      log('✅ 登录成功！');
      return;
    }
    error('登录失败，响应异常');
    log(verifyRes._raw.substring(0, 500));
    return;
  }

  if (verifyRes.success) {
    // 直接成功，跳转到 zoneHost
    const zoneHost = verifyRes.data.zoneHost || '';
    log('✅ 登录成功！');
    log('学校域名:', zoneHost || '(主站)');
    return;
  }

  // 需要二次验证
  const verifyType = verifyRes.data?.verifyType;
  const zoneHost = verifyRes.data?.zoneHost || '';

  if (verifyType === '1002') {
    log('📱 需要手机号验证');
    log('   校区:', zoneHost || '(主站)');
    log('   手机号:', verifyRes.data.verifyNumber);
    log('   请在浏览器中完成验证，或使用 --phone-code 选项');
  } else if (verifyType === '1003') {
    log('📧 需要邮箱验证');
    log('   邮箱:', verifyRes.data.verifyNumber);
  } else if (verifyType === '1004') {
    log('👤 需要姓名验证');
    log('   请在浏览器中打开验证页面完成认证');
  } else {
    log('⚠️  需要额外验证或输入验证码');
    log('   提示:', verifyRes.message || '(无)');
  }
}

/** logout - 登出 */
async function cmdLogout() {
  clearCookies();
  log('已退出登录');
}

/** status - 查看状态 */
async function cmdStatus() {
  const cookies = loadCookies();
  if (!cookies) {
    log('❌ 未登录');
    return;
  }
  const loggedIn = await checkLogin();
  if (loggedIn) {
    log('✅ 已登录');
  } else {
    log('❌ Cookie 存在但可能已过期，请重新登录');
  }
}

/** me - 当前用户信息 */
async function cmdMe() {
  const res = await post('/manage/user/info', {});
  if (res.success) {
    log('用户名:', res.data.username);
    log('姓名:', res.data.realname || res.data.name);
    log('学校:', res.data.schoolName || res.data.school);
    log('角色:', res.data.roleName || res.data.role);
  } else {
    log('获取用户信息失败，请先登录');
  }
}

/** schools - 列出学校列表 */
async function cmdSchools(search) {
  log('正在获取学校列表...');
  try {
    const res = await get('/js/schools-f5c5a22dc5b21db7c4f64994a61a3a1d.js', { json: false });
    if (typeof res === 'string') {
      // 提取学校代码
      const matches = res.matchAll(/["'](\d{4,})["']\s*:\s*["']([^"']+)["']/g);
      let schools = [];
      for (const m of matches) {
        schools.push({ code: m[1], name: m[2] });
      }
      if (search) {
        const q = search.toLowerCase();
        schools = schools.filter(s => s.name.includes(q) || s.code.includes(q));
      }
      schools.forEach(s => log(`${s.code}\t${s.name}`));
      log(`\n共 ${schools.length} 所学校`);
    }
  } catch (e) {
    error('获取失败:', e.message);
  }
}

// ── 主入口 ──────────────────────────────────────────────────────────────

const [cmd, ...args] = process.argv.slice(2);

const commands = {
  login: cmdLogin,
  logout: cmdLogout,
  status: cmdStatus,
  me: cmdMe,
  schools: cmdSchools,
  help: () => {
    log(`
vgms - 维普毕业论文管理系统 CLI

用法:
  vgms login <学校代码> <用户名> <密码>    登录
  vgms logout                               登出
  vgms status                               查看登录状态
  vgms me                                   当前用户信息
  vgms schools [关键词]                     列出/搜索学校
  vgms help                                 显示帮助

环境变量:
  VGMS_BASE_URL   维普系统地址，默认 https://vgms.fanyu.com
  VGMS_DEBUG=1    开启调试输出
  VGMS_COOKIE_JAR cookie 保存路径

示例:
  node vgms.js schools 肇庆
  node vgms.js login 112704 2020123456 mypassword
    `.trim());
  }
};

if (!cmd || cmd === 'help') {
  commands.help();
} else if (commands[cmd]) {
  commands[cmd](...args).catch(e => { error(e.message); process.exit(1); });
} else {
  error(`未知命令: ${cmd}`);
  commands.help();
  process.exit(1);
}
