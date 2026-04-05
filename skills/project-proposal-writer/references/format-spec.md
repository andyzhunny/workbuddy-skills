# 输出格式规范

## Word文档格式要求

### 页面设置

| 参数 | 数值 |
|------|------|
| 纸张大小 | A4 |
| 页边距-上 | 2.54cm |
| 页边距-下 | 2.54cm |
| 页边距-左 | 3.17cm |
| 页边距-右 | 3.17cm |
| 行距 | 1.5倍 |
| 段落间距 | 段前0行，段后0行 |

### 字体字号

| 元素 | 中文字体 | 英文字体 | 字号 | 对齐方式 |
|------|---------|---------|------|---------|
| 文档标题 | 黑体 | Arial | 二号(22pt) | 居中 |
| 一级标题 | 黑体 | Arial | 三号(16pt) | 左对齐 |
| 二级标题 | 黑体 | Arial | 四号(14pt) | 左对齐 |
| 三级标题 | 黑体 | Arial | 小四(12pt) | 左对齐 |
| 正文 | 宋体 | Times New Roman | 小四(12pt) | 两端对齐 |
| 表格内容 | 宋体 | Times New Roman | 五号(10.5pt) | 居中/左对齐 |

### 段落格式

| 元素 | 设置 |
|------|------|
| 首行缩进 | 2字符（约0.74cm） |
| 段前间距 | 0行 |
| 段后间距 | 0行 |
| 行距 | 1.5倍 |
| 对齐方式 | 两端对齐 |

### 标题编号格式

```
一、研究的意义和目的          （一级标题：汉字数字+顿号）
（一）研究意义               （二级标题：括号+汉字数字+括号）
1. 社会意义                 （三级标题：阿拉伯数字+点号）
（1）具体要点               （四级标题：括号+阿拉伯数字+括号）
```

## 文档结构顺序

```
[封面页]
  └── 项目名称
  └── 申报单位
  └── 日期

[正文]
  一、研究的意义和目的
    （一）研究意义
      1. 社会意义
      2. 学术意义
      3. 实践意义
    （二）研究目的

  二、该研究的文献综述
    （一）国内相关研究现状
    （二）国外相关研究现状
    （三）研究现状评述与本研究创新点

  三、研究的主要内容及方法
    （一）研究主要内容
    （二）研究方法

  四、研究的绩效考核内容
    （一）学术成果
    （二）实践成果
    （三）成果验收要求
```

## minimax-docx 调用参数

```csharp
// 创建文档时的关键参数
var doc = WordprocessingDocument.Create(filename, WordprocessingDocumentType.Document);

// 页面设置
var sectPr = new SectionProperties(
    new PageSize { Width = 11906, Height = 16838 },  // A4
    new PageMargin { Top = 1440, Right = 1800, Bottom = 1440, Left = 1800 }  // 单位：twips
);

// 字体设置（中文）
var runProps = new RunProperties(
    new RunFonts { Ascii = "Times New Roman", HighAnsi = "Times New Roman", EastAsia = "宋体" },
    new FontSize { Val = "24" },  // 12pt = 24 half-points
    new FontSizeComplexScript { Val = "24" }
);

// 标题字体（黑体）
var headingRunProps = new RunProperties(
    new RunFonts { Ascii = "Arial", HighAnsi = "Arial", EastAsia = "黑体" },
    new Bold(),
    new FontSize { Val = "32" }  // 16pt = 三号
);
```

## 文件命名规范

```
[项目名称]申报书.docx

示例：
- 肇庆五大文化诗词研究与英译传播项目申报书.docx
- 佛山陶瓷文化典籍整理与英译项目申报书.docx
- 潮汕非遗民俗文献数字化项目申报书.docx
```

## 质量检查清单

生成文档后检查：
- [ ] 所有标题层级正确（一、（一）、1.、（1））
- [ ] 中文字体为宋体/黑体，非西文字体
- [ ] 首行缩进2字符
- [ ] 行距1.5倍
- [ ] 页边距符合规范
- [ ] 无空白页
- [ ] 文件名正确
