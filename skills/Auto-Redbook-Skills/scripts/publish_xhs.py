#!/usr/bin/env python3
"""
小红书自动发布脚本 - 支持本地运行和API模式

用法示例：
    # 本地模式（需要安装 xhs 库）
    python publish_xhs.py --title "标题" --desc "描述" --images cover.png card_1.png

    # API 模式
    python publish_xhs.py --title "标题" --desc "描述" --images cover.png card_1.png --api-mode

依赖安装：
    pip install xhs python-dotenv requests
"""

import argparse
import os
import sys
import json
from pathlib import Path
from typing import List, Optional, Dict, Any

try:
    from dotenv import load_dotenv
    import requests
except ImportError as e:
    print(f"缺少依赖: {e}")
    print("请执行安装: pip install python-dotenv requests")
    sys.exit(1)


def load_cookie() -> str:
    """从 .env 文件加载 Cookie"""
    env_paths = [
        Path.cwd() / '.env',
        Path(__file__).parent.parent / '.env',
        Path(__file__).parent.parent.parent / '.env',
    ]

    for env_path in env_paths:
        if env_path.exists():
            load_dotenv(env_path)
            break

    cookie = os.getenv('XHS_COOKIE')
    if not cookie:
        print("❌ 错误：未找到 XHS_COOKIE 环境变量")
        print("请在 .env 文件中配置，格式如下：")
        print("XHS_COOKIE=your_cookie_string_here")
        print("\nCookie 获取步骤：")
        print("1. 打开浏览器访问 https://www.xiaohongshu.com")
        print("2. 按 F12 打开开发者工具")
        print("3. 切换到 Network 标签页")
        print("4. 刷新页面并找到任意请求的 Cookie")
        sys.exit(1)

    return cookie


def parse_cookie(cookie_string: str) -> Dict[str, str]:
    """解析 Cookie 字符串为字典"""
    cookies = {}
    for item in cookie_string.split(';'):
        item = item.strip()
        if '=' in item:
            key, value = item.split('=', 1)
            cookies[key.strip()] = value.strip()
    return cookies


def validate_cookie(cookie_string: str) -> bool:
    """验证 Cookie 是否包含必要字段"""
    cookies = parse_cookie(cookie_string)
    required_fields = ['a1', 'web_session']
    missing = [f for f in required_fields if f not in cookies]

    if missing:
        print(f"⚠️  Cookie 缺少必要字段: {', '.join(missing)}")
        print("请确保 Cookie 包含 a1 和 web_session 字段")
        return False

    return True


def validate_images(image_paths: List[str]) -> List[str]:
    """验证图片文件是否存在"""
    valid_images = []
    for path in image_paths:
        if os.path.exists(path):
            valid_images.append(os.path.abspath(path))
        else:
            print(f"⚠️  图片不存在: {path}")

    if not valid_images:
        print("❌ 错误：没有有效的图片文件")
        sys.exit(1)

    return valid_images


class LocalPublisher:
    """本地发布器 - 使用 xhs 库直接操作"""

    def __init__(self, cookie: str):
        self.cookie = cookie
        self.client = None

    def init_client(self):
        """初始化 xhs 客户端"""
        try:
            from xhs import XhsClient
            from xhs.help import sign as local_sign
        except ImportError:
            print("❌ 错误：未安装 xhs 库")
            print("请执行: pip install xhs")
            sys.exit(1)

        cookies = parse_cookie(self.cookie)
        a1 = cookies.get('a1', '')

        def sign_func(uri, data=None, a1_param="", web_session=""):
            return local_sign(uri, data, a1=a1 or a1_param)

        self.client = XhsClient(cookie=self.cookie, sign=sign_func)

    def get_user_info(self) -> Optional[Dict[str, Any]]:
        """获取用户信息"""
        try:
            info = self.client.get_self_info()
            print(f"👤 当前登录用户: {info.get('nickname', '未知')}")
            return info
        except Exception as e:
            print(f"⚠️  获取用户信息失败: {e}")
            return None

    def publish(self, title: str, desc: str, images: List[str],
                is_private: bool = True, post_time: str = None) -> Dict[str, Any]:
        """发布笔记"""
        print(f"\n📝 开始准备发布笔记...")
        print(f"   📌 标题: {title}")
        print(f"   📝 描述: {desc[:50]}..." if len(desc) > 50 else f"   📝 描述: {desc}")
        print(f"   🖼️  图片数量: {len(images)}")

        try:
            result = self.client.create_image_note(
                title=title,
                desc=desc,
                files=images,
                is_private=is_private,
                post_time=post_time
            )

            print("\n✅ 笔记发布成功！")
            if isinstance(result, dict):
                note_id = result.get('note_id') or result.get('id')
                if note_id:
                    print(f"   🆔 笔记ID: {note_id}")
                    print(f"   🔗 查看链接: https://www.xiaohongshu.com/explore/{note_id}")

            return result

        except Exception as e:
            error_msg = str(e)
            print(f"\n❌ 发布失败: {error_msg}")
            if 'sign' in error_msg.lower() or 'signature' in error_msg.lower():
                print("\n💡 可能是签名问题，请检查 Cookie 或尝试 --api-mode")
            elif 'cookie' in error_msg.lower():
                print("\n💡 Cookie 问题：可能已过期，请重新获取")
            raise


class ApiPublisher:
    """API 发布器 - 通过 xhs-api 服务端发布"""

    def __init__(self, cookie: str, api_url: str = None):
        self.cookie = cookie
        self.api_url = api_url or os.getenv('XHS_API_URL', 'http://localhost:5005')
        self.session_id = 'md2redbook_session'

    def init_client(self):
        """初始化 API 客户端"""
        print(f"🔌 连接 API 服务: {self.api_url}")

        try:
            resp = requests.get(f"{self.api_url}/health", timeout=5)
            if resp.status_code != 200:
                raise Exception("API 服务不可用")
        except requests.exceptions.RequestException as e:
            print(f"❌ 无法连接 API 服务: {e}")
            print("\n💡 请确保 xhs-api 服务已启动：")
            print("   cd xhs-api && python app_full.py")
            sys.exit(1)

        try:
            resp = requests.post(
                f"{self.api_url}/init",
                json={"session_id": self.session_id, "cookie": self.cookie},
                timeout=30
            )
            result = resp.json()

            if resp.status_code == 200 and result.get('status') == 'success':
                print("✅ API 客户端初始化成功")
                user_info = result.get('user_info', {})
                if user_info:
                    print(f"👤 当前登录用户: {user_info.get('nickname', '未知')}")
            elif result.get('status') == 'warning':
                print(f"⚠️  {result.get('message')}")
            else:
                raise Exception(result.get('error', '客户端初始化失败'))

        except Exception as e:
            print(f"❌ API 初始化失败: {e}")
            sys.exit(1)

    def publish(self, title: str, desc: str, images: List[str],
                is_private: bool = True, post_time: str = None) -> Dict[str, Any]:
        """通过 API 发布笔记"""
        print(f"\n📝 开始通过 API 发布笔记...")
        print(f"   📌 标题: {title}")
        print(f"   📝 描述: {desc[:50]}..." if len(desc) > 50 else f"   📝 描述: {desc}")
        print(f"   🖼️  图片数量: {len(images)}")

        try:
            payload = {
                "session_id": self.session_id,
                "title": title,
                "desc": desc,
                "files": images,
                "is_private": is_private
            }
            if post_time:
                payload["post_time"] = post_time

            resp = requests.post(
                f"{self.api_url}/publish/image",
                json=payload,
                timeout=120
            )
            result = resp.json()

            if resp.status_code == 200 and result.get('status') == 'success':
                print("\n✅ 笔记发布成功！")
                publish_result = result.get('result', {})
                if isinstance(publish_result, dict):
                    note_id = publish_result.get('note_id') or publish_result.get('id')
                    if note_id:
                        print(f"   🆔 笔记ID: {note_id}")
                        print(f"   🔗 查看链接: https://www.xiaohongshu.com/explore/{note_id}")
                return publish_result
            else:
                raise Exception(result.get('error', '发布失败'))

        except Exception as e:
            print(f"\n❌ 发布失败: {e}")
            raise


def main():
    parser = argparse.ArgumentParser(
        description='小红书自动发布工具',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog='''
示例用法：
  python publish_xhs.py -t "文章标题" -d "文章描述" -i cover.png card_1.png card_2.png

  # 公开发布
  python publish_xhs.py -t "文章标题" -d "文章描述" -i *.png --public

  # 使用 API 模式
  python publish_xhs.py -t "文章标题" -d "文章描述" -i *.png --api-mode

  # 定时发布
  python publish_xhs.py -t "文章标题" -d "文章描述" -i *.png --post-time "2024-12-01 10:00:00"
'''
    )
    parser.add_argument('--title', '-t', required=True, help='笔记标题（必填）')
    parser.add_argument('--desc', '-d', default='', help='笔记描述/正文内容')
    parser.add_argument('--images', '-i', nargs='+', required=True, help='图片文件路径（支持多张图片）')
    parser.add_argument('--public', action='store_true', help='公开发布（默认为私密草稿）')
    parser.add_argument('--post-time', default=None, help='定时发布时间，格式：2024-01-01 12:00:00')
    parser.add_argument('--api-mode', action='store_true', help='使用 API 模式发布，需要启动 xhs-api 服务端')
    parser.add_argument('--api-url', default=None, help='API 服务地址，默认 http://localhost:5005')
    parser.add_argument('--dry-run', action='store_true', help='仅模拟运行不实际发布')

    args = parser.parse_args()

    if len(args.title) > 20:
        print(f"⚠️  标题过长，将被截断至20字符")
        args.title = args.title[:20]

    cookie = load_cookie()
    validate_cookie(cookie)
    valid_images = validate_images(args.images)

    if args.dry_run:
        print("\n🔍 模拟运行模式 - 将执行以下操作：")
        print(f"   📌 标题: {args.title}")
        print(f"   📝 描述: {args.desc}")
        print(f"   🖼️  图片: {valid_images}")
        print(f"   🔒 可见性: {'公开' if args.public else '私密'}")
        print(f"   ⏰ 定时时间: {args.post_time or '无'}")
        print(f"   🔧 模式: {'API' if args.api_mode else '本地'}")
        print("\n✅ 模拟运行完成")
        return

    if args.api_mode:
        api_url = args.api_url or os.getenv('XHS_API_URL', 'http://localhost:5005')
        publisher = ApiPublisher(cookie, api_url)
    else:
        publisher = LocalPublisher(cookie)

    publisher.init_client()

    try:
        publisher.publish(
            title=args.title,
            desc=args.desc,
            images=valid_images,
            is_private=not args.public,
            post_time=args.post_time
        )
    except Exception:
        sys.exit(1)


if __name__ == '__main__':
    main()
