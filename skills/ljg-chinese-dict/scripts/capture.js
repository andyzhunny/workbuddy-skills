/**
 * 汉语新解卡片生成器
 * 1. 填充 HTML 模板
 * 2. 用 Playwright 截图
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function generateCard(options) {
  const { word, pinyin, english, japanese, explanation, outputPath } = options;

  // 读取模板
  const templatePath = path.join(__dirname, 'template.html');
  let html = fs.readFileSync(templatePath, 'utf-8');

  // 替换占位符
  html = html.replace(/\{\{WORD\}\}/g, word);
  html = html.replace(/\{\{PINYIN\}\}/g, pinyin);
  html = html.replace(/\{\{ENGLISH\}\}/g, english);
  html = html.replace(/\{\{JAPANESE\}\}/g, japanese);
  html = html.replace(/\{\{EXPLANATION\}\}/g, explanation);
  html = html.replace(/\{\{DATE\}\}/g, new Date().toISOString().split('T')[0]);

  // 生成临时 HTML 文件
  const tempDir = os.tmpdir();
  const tempHtmlPath = path.join(tempDir, `hanyu_${Date.now()}.html`);
  fs.writeFileSync(tempHtmlPath, html, 'utf-8');

  // 确定输出路径
  const output = outputPath || path.join(os.homedir(), 'Downloads', `汉语新解_${word}.png`);

  // 确保输出目录存在
  fs.mkdirSync(path.dirname(output), { recursive: true });

  // 启动浏览器并截图
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1080, height: 1350 }
  });

  await page.goto(`file://${tempHtmlPath}`, { waitUntil: 'networkidle' });

  // 等待字体加载
  await page.waitForTimeout(1000);

  // 截图
  await page.screenshot({
    path: output,
    type: 'png',
    fullPage: true
  });

  await browser.close();

  // 清理临时文件
  fs.unlinkSync(tempHtmlPath);

  return output;
}

// 命令行入口
if (require.main === module) {
  const args = process.argv.slice(2);

  const options = {
    word: '',
    pinyin: '',
    english: '',
    japanese: '',
    explanation: '',
    outputPath: null
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '-w':
      case '--word':
        options.word = args[++i];
        break;
      case '-p':
      case '--pinyin':
        options.pinyin = args[++i];
        break;
      case '-e':
      case '--english':
        options.english = args[++i];
        break;
      case '-j':
      case '--japanese':
        options.japanese = args[++i];
        break;
      case '-x':
      case '--explanation':
        options.explanation = args[++i];
        break;
      case '-o':
      case '--output':
        options.outputPath = args[++i];
        break;
    }
  }

  if (!options.word || !options.explanation) {
    console.log('Usage: node capture.js -w <word> -p <pinyin> -e <english> -j <japanese> -x <explanation> [-o <output>]');
    process.exit(1);
  }

  generateCard(options)
    .then(output => {
      console.log(`[OK] Card generated: ${output}`);
    })
    .catch(err => {
      console.error('[ERROR]', err.message);
      process.exit(1);
    });
}

module.exports = { generateCard };
