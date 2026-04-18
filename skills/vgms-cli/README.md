# vgms-cli

维普毕业论文（设计）管理系统 CLI 工具，通过命令行操作论文系统。

## 安装

```bash
# 方式一：直接运行
node vgms.js <command>

# 方式二：全局安装
npm install -g
# 然后用 vgms 命令
```

## 依赖

- Node.js >= 18

## 命令

### `vgms login <学校代码> <用户名> <密码>`

登录系统。

```bash
node vgms.js login 112704 2020123456 mypassword
```

学校代码可从 `vgms schools` 命令获取。

**注意**：部分学校需要二次验证（手机/邮箱/姓名），目前需在浏览器中完成首次验证。

### `vgms logout`

清除登录状态。

### `vgms status`

查看当前登录状态。

### `vgms me`

查看当前登录用户信息。

### `vgms schools [关键词]`

列出/搜索学校。

```bash
# 列出所有学校
node vgms.js schools

# 搜索学校
node vgms.js schools 肇庆
node vgms.js schools 北京
```

## 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `VGMS_BASE_URL` | `https://vgms.fanyu.com` | 维普系统地址 |
| `VGMS_DEBUG` | `0` | 设为 `1` 开启调试输出 |
| `VGMS_COOKIE_JAR` | `~/.vgms/cookies.json` | Cookie 保存路径 |

## API 协议说明

登录流程基于以下发现（2025-04-17 逆向分析）：

**基础信息**

- 系统地址：`https://vgms.fanyu.com`
- 框架：jQuery + LayUI + MD5 + CryptoJS
- 加密密钥：`SECRET_KEY = "dkNDdkJaUjBDVUV5WW0yRzRoTHFRZz09"`（AES-256-CBC）

**登录 API**

```
# 无学校用户首次登录
POST /loginVerify?username={schoolCode}_{username}
  code: schoolCode
  password: password
  captcha: ''（可选）
  phoneCodeInfo: ''

# 有学校用户登录
POST /manage/login
  username: schoolCode_username
  password: password
  captcha: ''（可选）
  changePeriod: ...
  currentPeriodid: ...

# 验证码图片
GET /captcha?username={uuid}&{timestamp}
```

**响应字段**

- `success=true`：直接登录成功，跳转 `/admin/index`
- `verifyType="1002"`：需手机号验证
- `verifyType="1003"`：需邮箱验证
- `verifyType="1004"`：需姓名验证
- `data.zoneHost`：学校专属域名（某些学校）

## 开发说明

- 纯 Node.js 标准库，无外部依赖
- Cookie 保存在 `~/.vgms/cookies.json`
- 会话基于 JSESSIONID Cookie

## 免责声明

本工具仅用于技术研究，请勿用于任何商业或违规用途。
