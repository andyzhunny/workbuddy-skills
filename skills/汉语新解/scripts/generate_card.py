# 汉语新解卡片生成器

from PIL import Image, ImageDraw, ImageFont
import os

def load_font(size, font_path=None):
    """加载字体"""
    # 尝试加载系统字体
    font_paths = [
        "C:/Windows/Fonts/simli.ttf",       # 华文隶书
        "C:/Windows/Fonts/simhei.ttf",       # 黑体
        "C:/Windows/Fonts/simsun.ttc",       # 宋体
        "C:/Windows/Fonts/arial.ttf",         # Arial
        "C:/Windows/Fonts/msgothic.ttc",      # 日文
    ]
    
    for fp in font_paths:
        if os.path.exists(fp):
            try:
                return ImageFont.truetype(fp, size)
            except:
                continue
    
    # 默认字体
    return ImageFont.load_default()

def create_chinese_card(word, pinyin, english, japanese, explanation, output_path="card.png"):
    """生成汉语新解风格卡片"""
    
    # 画布尺寸
    width, height = 400, 600
    margin = 20
    
    # 颜色定义 - 蒙德里安风格
    colors = {
        'red': '#E53935',
        'yellow': '#FDD835', 
        'blue': '#1E88E5',
        'white': '#FAFAFA',
        'black': '#212121',
        'text': '#424242',
        'gray': '#9E9E9E'
    }
    
    # 创建白色背景图像
    img = Image.new('RGB', (width, height), colors['white'])
    draw = ImageDraw.Draw(img)
    
    # 加载字体
    font_title = load_font(32, "simli.ttf")
    font_word = load_font(52, "simli.ttf")
    font_pinyin = load_font(18, "arial.ttf")
    font_lang = load_font(14, "arial.ttf")
    font_exp = load_font(20, "simli.ttf")
    font_small = load_font(12, "arial.ttf")
    
    # 绘制蒙德里安风格几何色块装饰
    draw.rectangle([margin, margin, margin+65, margin+45], fill=colors['red'])
    draw.rectangle([width-margin-55, margin, width-margin, margin+65], fill=colors['blue'])
    draw.rectangle([margin, height-margin-35, margin+85, height-margin], fill=colors['yellow'])
    draw.rectangle([width-margin-45, height-margin-45, width-margin, height-margin], fill=colors['black'])
    
    # 标题
    draw.text((width//2, 75), "汉语新解", fill=colors['black'], font=font_title, anchor="mm")
    
    # 分隔线
    draw.line([(60, 105), (width-60, 105)], fill=colors['gray'], width=1)
    
    # 词汇（大字）
    draw.text((width//2, 170), word, fill=colors['black'], font=font_word, anchor="mm")
    
    # 拼音
    draw.text((width//2, 225), pinyin, fill=colors['gray'], font=font_pinyin, anchor="mm")
    
    # 英文/日文
    draw.text((width//2, 265), f"EN: {english}", fill=colors['gray'], font=font_lang, anchor="mm")
    draw.text((width//2, 295), f"JP: {japanese}", fill=colors['gray'], font=font_lang, anchor="mm")
    
    # 分隔装饰
    draw.text((width//2, 345), "─────────", fill=colors['gray'], font=font_small, anchor="mm")
    
    # 解释（核心内容）- 智能换行
    max_width = width - 2 * margin - 20
    lines = wrap_text(explanation, max_width, font_exp, draw)
    
    y = 390
    for line in lines:
        draw.text((width//2, y), line, fill=colors['text'], font=font_exp, anchor="mm")
        y += 32
    
    # 底部波浪装饰
    draw.text((width//2, 540), "～～ ～～ ～～", fill=colors['gray'], font=font_small, anchor="mm")
    
    # 底部信息
    draw.text((width//2, 580), "汉语新解 · 一词一世界", fill=colors['gray'], font=font_small, anchor="mm")
    
    img.save(output_path)
    print(f"[OK] Card generated: {os.path.abspath(output_path)}")
    return os.path.abspath(output_path)

def wrap_text(text, max_width, font, draw):
    """智能换行"""
    lines = []
    current_line = ""
    
    for char in text:
        test_line = current_line + char
        bbox = draw.textbbox((0, 0), test_line, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current_line = test_line
        else:
            if current_line:
                lines.append(current_line)
            current_line = char
    
    if current_line:
        lines.append(current_line)
    
    return lines if lines else [text]

if __name__ == "__main__":
    # 测试：「内卷」
    create_chinese_card(
        word="内卷",
        pinyin="nèi juǎn",
        english="Involution",
        japanese="内巻き",
        explanation="电影院里第一排的人站起来了，逼得所有人都得站着。",
        output_path="neijuan_card.png"
    )
