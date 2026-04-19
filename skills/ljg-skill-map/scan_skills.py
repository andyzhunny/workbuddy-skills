"""Scan all skills and output JSON for skill map"""
import os, json, re

SKILLS_DIR = os.path.expanduser("~/.workbuddy/skills")
results = []

for name in os.listdir(SKILLS_DIR):
    skill_file = os.path.join(SKILLS_DIR, name, "SKILL.md")
    if not os.path.isfile(skill_file):
        continue
    try:
        with open(skill_file, encoding="utf-8") as f:
            content = f.read()
    except Exception:
        continue

    # Extract frontmatter
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        continue
    fm = match.group(1)

    def get_fm(key):
        m = re.search(rf'^{key}:\s*(.+?)(?:\n[a-z_]+:|$)', fm, re.MULTILINE)
        if m:
            val = m.group(1).strip().strip('"').strip("'")
            # multi-line
            if val in ('>', '|'):
                block_start = fm.find(f'{key}:')
                nl = content.find('\n', block_start)
                rest = []
                i = nl + 1
                while i < len(content):
                    line = content[i]
                    if line and not line[0].isspace() and ':' in line and not line.startswith('#'):
                        break
                    rest.append(line.strip())
                    i += 1
                val = ' '.join(r.strip() for r in rest if r.strip())
                val = re.sub(r'^[>|]\s*', '', val).strip()
            return val
        return ''

    skill_name = get_fm('name') or name
    version = get_fm('version') or '-'
    invocable = get_fm('user_invocable').lower() == 'true'
    desc = get_fm('description') or get_fm('desc') or ''
    # truncate to first sentence
    desc_short = re.split(r'[.。]', desc)[0][:80]

    results.append({
        'name': skill_name,
        'version': version,
        'invocable': invocable,
        'desc': desc_short,
        'dir': name
    })

# Categorize
categories = {
    '◆ 认知原子': [],
    '▲ 输出铸造': [],
    '● 联网触达': [],
    '■ 系统运维': [],
    '★ 环境部署': [],
    '◎ 教学学术': [],
    '✦ 创业管理': [],
    '△ 移动开发': [],
    '◇ 内容创作': [],
    '□ 其他': [],
}

for r in results:
    name = r['name'].lower()
    d = r['dir'].lower()
    desc = r['desc'].lower()

    if any(p in d for p in ['ljg-plain','ljg-word','ljg-learn','ljg-writes','ljg-paper','ljg-paper-flow','ljg-translation','trans-brainstorming','thesis-review','thesis']):
        cat = '◆ 认知原子'
    elif any(p in d for p in ['ljg-card','ljg-chinese-dict','ljg-infograph','zsw-word','ljg-word-flow','gif-sticker','xhs','xhs-note']):
        cat = '▲ 输出铸造'
    elif any(p in d for p in ['web-access','browser','tavily','search','gstack','semantic','semanticscholar','paper','arxiv']):
        cat = '● 联网触达'
    elif any(p in d for p in ['skill','superpower','memory','datetime','save-conversation','using-git','systematic','debugging','test-driven','verification','receiving','requesting','finishing','subagent','dispatching','writing-plans','executing','brainstorming','project-brainstorming']):
        cat = '■ 系统运维'
    elif any(p in d for p in ['android','ios','react-native','flutter','fullstack','frontend','backend','heroku','deploy','miaoda','openspec','frontend-dev','fullstack-dev','android-native','ios-app','react-native-dev','flutter-dev','shader','nuwa']):
        cat = '△ 移动开发'
    elif any(p in d for p in ['edu','teaching','ppt','pptx','minimax-pdf','minimax-docx','minimax-xlsx','document','vocation']):
        cat = '◎ 教学学术'
    elif any(p in d for p in ['pua','talent','finding-skill','skill-vetter','skill-builder','writing-skill','invest','roundtable','relationship','rank','word','travel']):
        cat = '◇ 内容创作'
    elif any(p in d for p in ['auto','redbook','vgms','xu-yuanchong','khazix','workbuddy','find-skill','p10','p7','p9','edu-brainstorming']):
        cat = '□ 其他'
    else:
        cat = '□ 其他'

    categories[cat].append(r)

# Print
for cat, items in categories.items():
    if not items:
        continue
    print(f"\n{cat}")
    for item in sorted(items, key=lambda x: x['name']):
        inv = '/' if item['invocable'] else ''
        ver = item['version']
        desc = item['desc'][:50]
        print(f"  {item['name']:<30} v{ver:<8} {inv} {desc}")

total = len(results)
invocable_total = sum(1 for r in results if r['invocable'])
print(f"\n{'='*60}")
print(f"总数: {total} | 可直接调用: {invocable_total} | 分类数: {sum(1 for v in categories.values() if v)}")
