#!/usr/bin/env python3
"""
汉语新解 SVG 卡片生成器
生成格式精美的词汇解释卡片
"""

import argparse
import os
from pathlib import Path


def generate_svg(word, pinyin, english, japanese, explanation, output_path=None):
    """生成汉语新解 SVG 卡片"""

    # 卡片尺寸
    width = 400
    height = 600
    margin = 30

    # 颜色配置 - 蒙德里安风格深色主题
    bg_color = "#0d0f12"  # 深色背景
    accent_color = "#4a9eff"  # 蓝调强调色
    secondary_accent = "#ff6b6b"  # 红色点缀
    text_primary = "#e8e8e8"  # 主文字 - 粉笔灰
    text_secondary = "#888888"  # 次要文字
    divider_color = "#333333"  # 分隔线

    # SVG 模板
    svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
  <defs>
    <!-- 渐变背景 -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0d0f12;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1d23;stop-opacity:1" />
    </linearGradient>
    <!-- 装饰线条 -->
    <pattern id="decoPattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="1" fill="#4a9eff" opacity="0.3"/>
    </pattern>
  </defs>

  <!-- 背景 -->
  <rect width="{width}" height="{height}" fill="url(#bgGradient)" rx="12"/>

  <!-- 装饰点阵 -->
  <rect x="0" y="0" width="{width}" height="{height}" fill="url(#decoPattern)" opacity="0.5"/>

  <!-- 顶部装饰线 -->
  <line x1="{margin}" y1="20" x2="{margin + 60}" y2="20" stroke="{accent_color}" stroke-width="2" stroke-linecap="round"/>

  <!-- 标题 -->
  <text x="{width // 2}" y="60" text-anchor="middle" font-family="Georgia, 'Noto Serif SC', serif" font-size="14" fill="{text_secondary}" letter-spacing="8">
    汉语新解
  </text>

  <!-- 分隔线 -->
  <line x1="{margin + 40}" y1="85" x2="{width - margin - 40}" y2="85" stroke="{divider_color}" stroke-width="1"/>

  <!-- 词汇 -->
  <text x="{width // 2}" y="160" text-anchor="middle" font-family="Georgia, 'Noto Serif SC', serif" font-size="48" fill="{text_primary}" font-weight="bold">
    {word}
  </text>

  <!-- 拼音 -->
  <text x="{width // 2}" y="195" text-anchor="middle" font-family="Georgia, serif" font-size="14" fill="{text_secondary}" letter-spacing="2">
    {pinyin}
  </text>

  <!-- 翻译信息框 -->
  <rect x="{margin}" y="220" width="{width - 2*margin}" height="70" rx="8" fill="#1a1d23" stroke="{divider_color}" stroke-width="1"/>

  <!-- 英文 -->
  <text x="{margin + 20}" y="250" font-family="Georgia, serif" font-size="12" fill="{text_secondary}">
    EN
  </text>
  <text x="{margin + 50}" y="250" font-family="Georgia, serif" font-size="14" fill="{text_primary}">
    {english}
  </text>

  <!-- 日文 -->
  <text x="{margin + 20}" y="275" font-family="Georgia, serif" font-size="12" fill="{text_secondary}">
    JP
  </text>
  <text x="{margin + 50}" y="275" font-family="Georgia, serif" font-size="14" fill="{text_primary}">
    {japanese}
  </text>

  <!-- 分隔线 -->
  <line x1="{margin + 20}" y1="310" x2="{width - margin - 20}" y2="310" stroke="{accent_color}" stroke-width="2" stroke-linecap="round" opacity="0.5"/>

  <!-- 解释标签 -->
  <text x="{margin + 20}" y="340" font-family="Georgia, 'Noto Serif SC', serif" font-size="11" fill="{accent_color}" letter-spacing="2">
    释义
  </text>

  <!-- 解释内容 - 多行处理 -->
  <foreignObject x="{margin}" y="350" width="{width - 2*margin}" height="180">
    <div xmlns="http://www.w3.org/1999/xhtml" style="
      font-family: Georgia, 'Noto Serif SC', serif;
      font-size: 18px;
      line-height: 1.8;
      color: {text_primary};
      text-align: justify;
      word-break: break-word;
    ">
      {explanation}
    </div>
  </foreignObject>

  <!-- 底部装饰 -->
  <line x1="{width - margin - 60}" y1="{height - 30}" x2="{width - margin}" y2="{height - 30}" stroke="{secondary_accent}" stroke-width="2" stroke-linecap="round"/>

  <!-- 装饰圆点 -->
  <circle cx="{margin + 15}" cy="{height - 25}" r="3" fill="{accent_color}" opacity="0.6"/>
  <circle cx="{margin + 30}" cy="{height - 25}" r="3" fill="{accent_color}" opacity="0.4"/>
  <circle cx="{margin + 45}" cy="{height - 25}" r="3" fill="{accent_color}" opacity="0.2"/>
</svg>'''

    # 保存文件
    if output_path is None:
        output_path = Path.home() / "Downloads" / f"汉语新解_{word}.svg"

    # 确保目录存在
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)

    return output_path


def main():
    parser = argparse.ArgumentParser(description='汉语新解 SVG 卡片生成器')
    parser.add_argument('--word', '-w', required=True, help='要解释的词汇')
    parser.add_argument('--pinyin', '-p', required=True, help='拼音')
    parser.add_argument('--english', '-e', required=True, help='英文翻译')
    parser.add_argument('--japanese', '-j', required=True, help='日文翻译')
    parser.add_argument('--explanation', '-x', required=True, help='解释文本')
    parser.add_argument('--output', '-o', help='输出文件路径')

    args = parser.parse_args()

    output_path = generate_svg(
        word=args.word,
        pinyin=args.pinyin,
        english=args.english,
        japanese=args.japanese,
        explanation=args.explanation,
        output_path=args.output
    )

    print(f"[OK] Card generated: {output_path}")


if __name__ == '__main__':
    main()
