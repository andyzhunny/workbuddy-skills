#!/usr/bin/env node
/**
 * 小红书图文笔记渲染器 V2 - Node.js Markdown渲染
 *
 * 使用方法:
 *    node render_xhs_v2.js <markdown_file> [options]
 *
 * 安装依赖:
 *    npm install marked js-yaml playwright
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const { marked } = require('marked');
const yaml = require('js-yaml');

// 配置路径
const SCRIPT_DIR = path.dirname(__dirname);
const ASSETS_DIR = path.join(SCRIPT_DIR, 'assets');

// 卡片尺寸
const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1440;
const SAFE_HEIGHT = CARD_HEIGHT - 120 - 100 - 80 - 40;

// 主题样式
const STYLES = {
    purple: {
        name: '紫色',
        cover_bg: "linear-gradient(180deg, #3450E4 0%, #D266DA 100%)",
        card_bg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        accent_color: "#6366f1",
    },
    xiaohongshu: {
        name: '小红书',
        cover_bg: "linear-gradient(180deg, #FF2442 0%, #FF6B81 100%)",
        card_bg: "linear-gradient(135deg, #FF2442 0%, #FF6B81 100%)",
        accent_color: "#FF2442",
    },
    mint: {
        name: '薄荷绿',
        cover_bg: "linear-gradient(180deg, #43e97b 0%, #38f9d7 100%)",
        card_bg: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        accent_color: "#43e97b",
    },
    sunset: {
        name: '日落',
        cover_bg: "linear-gradient(180deg, #fa709a 0%, #fee140 100%)",
        card_bg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        accent_color: "#fa709a",
    },
    ocean: {
        name: '海洋',
        cover_bg: "linear-gradient(180deg, #4facfe 0%, #00f2fe 100%)",
        card_bg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        accent_color: "#4facfe",
    },
    elegant: {
        name: '优雅',
        cover_bg: "linear-gradient(180deg, #f5f5f5 0%, #e0e0e0 100%)",
        card_bg: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)",
        accent_color: "#333333",
    },
    dark: {
        name: '暗夜',
        cover_bg: "linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)",
        card_bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        accent_color: "#e94560",
    },
};

// 解析命令行参数
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {
        input: null,
        output: process.cwd(),
        style: 'purple',
        list: false,
    };

    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-o' || args[i] === '--output') {
            options.output = args[++i];
        } else if (args[i] === '-s' || args[i] === '--style') {
            options.style = args[++i];
        } else if (args[i] === '--list' || args[i] === '-l') {
            options.list = true;
        } else if (!args[i].startsWith('-')) {
            options.input = args[i];
        }
    }

    return options;
}

// 列出所有主题
function listStyles() {
    console.log('\n可用主题：');
    Object.entries(STYLES).forEach(([key, style]) => {
        console.log(`  ${key.padEnd(15)} - ${style.name}`);
    });
    console.log('');
}

// 解析 Markdown 文件
function parseMarkdown(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');

    const yamlMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
    let metadata = {};
    let body = content;

    if (yamlMatch) {
        try {
            metadata = yaml.load(yamlMatch[1]) || {};
        } catch (e) {
            console.warn('YAML 解析失败:', e.message);
        }
        body = content.slice(yamlMatch[0].length).trim();
    }

    return { metadata, body };
}

// 提取标签
function extractTags(mdContent) {
    const tagPattern = /((?:#[\w\u4e00-\u9fa5]+)+)$/gm;
    const tagsMatch = tagPattern.exec(mdContent);
    let tagsHtml = '';

    if (tagsMatch) {
        const tagsStr = tagsMatch[1];
        const tags = [...tagsStr.matchAll(/#([\w\u4e00-\u9fa5]+)/g)].map(m => m[1]);

        if (tags.length > 0) {
            tagsHtml = '<div class="tags-container">';
            tags.forEach(tag => {
                tagsHtml += `<span class="tag">#${tag}</span>`;
            });
            tagsHtml += '</div>';
        }

        mdContent = mdContent.slice(0, tagsMatch.index).trim();
    }

    return { mdContent, tagsHtml };
}

// 转换 Markdown 为 HTML
function convertMarkdown(mdContent) {
    const { mdContent: cleanMd, tagsHtml } = extractTags(mdContent);
    const html = marked.parse(cleanMd);
    return html + tagsHtml;
}

// 生成封面 HTML
function generateCoverHtml(metadata, style, width = CARD_WIDTH, height = CARD_HEIGHT) {
    const s = STYLES[style] || STYLES.purple;
    const emoji = metadata.emoji || '📖';
    const title = metadata.title || '无标题';
    const subtitle = metadata.subtitle || '';

    const titleLen = title.length;
    let titleSize;
    if (titleLen <= 6) titleSize = Math.floor(width * 0.14);
    else if (titleLen <= 10) titleSize = Math.floor(width * 0.12);
    else if (titleLen <= 18) titleSize = Math.floor(width * 0.09);
    else titleSize = Math.floor(width * 0.07);

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=${width}, height=${height}">
    <title>小红书封面</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Noto Sans SC', 'Source Han Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
            width: ${width}px;
            height: ${height}px;
            overflow: hidden;
        }
        .cover-container {
            width: ${width}px;
            height: ${height}px;
            background: ${s.cover_bg};
            position: relative;
            overflow: hidden;
        }
        .cover-inner {
            position: absolute;
            width: ${Math.floor(width * 0.88)}px;
            height: ${Math.floor(height * 0.91)}px;
            left: ${Math.floor(width * 0.06)}px;
            top: ${Math.floor(height * 0.045)}px;
            background: #F3F3F3;
            border-radius: 25px;
            display: flex;
            flex-direction: column;
            padding: ${Math.floor(width * 0.074)}px ${Math.floor(width * 0.079)}px;
        }
        .cover-emoji {
            font-size: ${Math.floor(width * 0.167)}px;
            line-height: 1.2;
            margin-bottom: ${Math.floor(height * 0.035)}px;
        }
        .cover-title {
            font-weight: 900;
            font-size: ${titleSize}px;
            line-height: 1.4;
            background: ${s.cover_bg};
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            flex: 1;
            display: flex;
            align-items: flex-start;
            word-break: break-all;
        }
        .cover-subtitle {
            font-weight: 350;
            font-size: ${Math.floor(width * 0.067)}px;
            line-height: 1.4;
            color: #000000;
            margin-top: auto;
        }
    </style>
</head>
<body>
    <div class="cover-container">
        <div class="cover-inner">
            <div class="cover-emoji">${emoji}</div>
            <div class="cover-title">${title}</div>
            <div class="cover-subtitle">${subtitle}</div>
        </div>
    </div>
</body>
</html>`;
}

// 生成卡片 HTML
function generateCardHtml(content, style, pageNum, totalPages, width = CARD_WIDTH, height = CARD_HEIGHT) {
    const s = STYLES[style] || STYLES.purple;
    const htmlContent = convertMarkdown(content);
    const pageText = totalPages > 1 ? `${pageNum}/${totalPages}` : '';

    return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=${width}">
    <title>小红书卡片</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700;900&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Noto Sans SC', 'Source Han Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
            width: ${width}px;
            overflow: hidden;
            background: transparent;
        }
        .card-container {
            width: ${width}px;
            min-height: ${height}px;
            background: ${s.card_bg};
            position: relative;
            padding: 50px;
            overflow: hidden;
        }
        .card-inner {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 60px;
            min-height: calc(${height}px - 100px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
        }
        .card-content {
            color: #1e293b;
            font-size: 42px;
            line-height: 1.7;
        }
        .card-content h1 {
            font-size: 72px;
            font-weight: 700;
            color: ${s.accent_color};
            margin-bottom: 40px;
            line-height: 1.3;
        }
        .card-content h2 {
            font-size: 56px;
            font-weight: 600;
            color: #334155;
            margin: 50px 0 25px 0;
            line-height: 1.4;
        }
        .card-content h3 {
            font-size: 48px;
            font-weight: 600;
            color: #475569;
            margin: 40px 0 20px 0;
        }
        .card-content p { margin-bottom: 35px; }
        .card-content strong { font-weight: 700; color: #1e293b; }
        .card-content em { font-style: italic; color: ${s.accent_color}; }
        .card-content a { color: ${s.accent_color}; text-decoration: none; border-bottom: 2px solid ${s.accent_color}; }
        .card-content ul, .card-content ol { margin: 30px 0; padding-left: 60px; }
        .card-content li { margin-bottom: 20px; line-height: 1.6; }
        .card-content blockquote {
            border-left: 8px solid ${s.accent_color};
            padding: 25px 40px;
            background: #f1f5f9;
            margin: 35px 0;
            color: #64748b;
            font-style: italic;
            border-radius: 0 12px 12px 0;
        }
        .card-content code {
            background: #f1f5f9;
            padding: 6px 16px;
            border-radius: 8px;
            font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
            font-size: 38px;
            color: ${s.accent_color};
        }
        .card-content pre {
            background: #1e293b;
            color: #e2e8f0;
            padding: 40px;
            border-radius: 16px;
            margin: 35px 0;
            overflow-x: visible;
            overflow-wrap: break-word;
            white-space: pre-wrap;
            font-size: 36px;
            line-height: 1.5;
        }
        .card-content img {
            max-width: 100%;
            height: auto;
            border-radius: 16px;
            margin: 35px auto;
            display: block;
        }
        .card-content hr {
            border: none;
            height: 2px;
            background: #e2e8f0;
            margin: 50px 0;
        }
        .tags-container { margin-top: 50px; padding-top: 30px; border-top: 2px solid #e2e8f0; }
        .tag {
            display: inline-block;
            background: ${s.accent_color};
            color: white;
            padding: 12px 28px;
            border-radius: 30px;
            font-size: 34px;
            margin: 10px 15px 10px 0;
            font-weight: 500;
        }
        .page-number {
            position: absolute;
            bottom: 80px;
            right: 80px;
            font-size: 36px;
            color: rgba(255, 255, 255, 0.8);
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="card-container">
        <div class="card-inner">
            <div class="card-content">${htmlContent}</div>
        </div>
        <div class="page-number">${pageText}</div>
    </div>
</body>
</html>`;
}

// 渲染 HTML 到图片
async function renderToImage(html, outputPath, width = CARD_WIDTH, height = CARD_HEIGHT) {
    const browser = await chromium.launch();
    const page = await browser.newPage({
        viewport: { width, height: height * 2 },
        device_scale_factor: 2
    });

    const tempFile = path.join(require('os').tmpdir(), `redbook_${Date.now()}.html`);
    fs.writeFileSync(tempFile, html, 'utf-8');

    try {
        await page.goto(`file:///${tempFile}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);

        const contentHeight = await page.evaluate(() => {
            const c = document.querySelector('.card-container');
            return c ? c.scrollHeight : document.body.scrollHeight;
        });

        const actualHeight = Math.max(height, contentHeight);

        await page.screenshot({
            path: outputPath,
            clip: { x: 0, y: 0, width, height: actualHeight },
            type: 'png'
        });

        console.log(`✅ 已生成: ${outputPath} (${width}x${actualHeight})`);
    } finally {
        fs.unlinkSync(tempFile);
        await browser.close();
    }
}

// 主函数
async function main() {
    const options = parseArgs();

    if (options.list) {
        listStyles();
        return;
    }

    if (!options.input) {
        console.error('用法: node render_xhs_v2.js <markdown_file> [-o output_dir] [-s style] [--list]');
        console.error('示例: node render_xhs_v2.js note.md -o ./output -s xiaohongshu');
        process.exit(1);
    }

    if (!fs.existsSync(options.input)) {
        console.error(`❌ 文件不存在: ${options.input}`);
        process.exit(1);
    }

    if (!STYLES[options.style]) {
        console.error(`❌ 未知主题: ${options.style}`);
        listStyles();
        process.exit(1);
    }

    console.log(`\n📝 处理文件: ${options.input}`);
    console.log(`   🎨 主题: ${STYLES[options.style].name}`);
    console.log(`   📏 尺寸: ${CARD_WIDTH}x${CARD_HEIGHT}`);

    const { metadata, body } = parseMarkdown(options.input);
    const cards = body.split(/\n---\n/).filter(s => s.trim());

    if (!fs.existsSync(options.output)) {
        fs.mkdirSync(options.output, { recursive: true });
    }

    // 生成封面
    if (metadata.emoji || metadata.title) {
        console.log('   🎨 生成封面...');
        const coverHtml = generateCoverHtml(metadata, options.style);
        const coverPath = path.join(options.output, 'cover.png');
        await renderToImage(coverHtml, coverPath);
    }

    // 生成卡片
    for (let i = 0; i < cards.length; i++) {
        console.log(`   📄 生成卡片 ${i + 1}/${cards.length}...`);
        const cardHtml = generateCardHtml(cards[i].trim(), options.style, i + 1, cards.length);
        const cardPath = path.join(options.output, `card_${i + 1}.png`);
        await renderToImage(cardHtml, cardPath);
    }

    console.log(`\n✨ 完成！输出目录: ${options.output}`);
}

main().catch(e => {
    console.error('渲染失败:', e);
    process.exit(1);
});
