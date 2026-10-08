#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_notes.py —— 把 notes/ 目录下的 Markdown 笔记编译成 notes-data.json

用法（在项目根目录执行）：
    python build_notes.py

原理：
    扫描 notes/ 下的所有 .md 文件，解析文件头部的 YAML front matter（--- 之间的
    title / date / tags / minutes / excerpt 字段），正文作为 Markdown 原文保留，
    统一输出到 notes-data.json，供网页运行时读取渲染。

笔记文件格式（示例见 notes/ 目录）：
    ---
    title: 笔记标题
    date: 2026-09-28
    minutes: 12
    tags: [AI, RAG]
    excerpt: 一句话摘要（可省略，缺省时取正文第一行）
    ---
    正文（Markdown 语法）……

字段均可省略：title 缺省用文件名；date 缺省用文件修改日期；minutes 缺省按正文字数估算；
tags 缺省为空；excerpt 缺省取正文第一行。
"""
import ast
import json
import re
import sys
from pathlib import Path

BASE = Path(__file__).resolve().parent
NOTES_DIR = BASE / "notes"
OUT = BASE / "notes-data.json"

FRONT_MATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)


def parse_value(raw):
    """解析 front matter 字段值：支持字符串、数字、[a, b, c] 列表等"""
    raw = raw.strip()
    if raw.startswith("[") and raw.endswith("]"):
        inner = raw[1:-1].strip()
        if not inner:
            return []
        return [parse_value(item) for item in inner.split(",")]
    try:
        return ast.literal_eval(raw)
    except (ValueError, SyntaxError):
        return raw.strip("'\"").strip()


def parse_front_matter(text):
    """返回 (meta_dict, body_text)。无 front matter 时返回 ({}, 全文)"""
    m = FRONT_MATTER_RE.match(text)
    if not m:
        return {}, text
    meta = {}
    for line in m.group(1).splitlines():
        line = line.strip()
        if not line or ":" not in line:
            continue
        key, _, value = line.partition(":")
        meta[key.strip()] = parse_value(value)
    body = text[m.end():].lstrip("\n")
    return meta, body


def first_line_as_excerpt(body, limit=80):
    line = next((ln.strip() for ln in body.splitlines() if ln.strip()), "")
    line = re.sub(r"[#*`>\[\]()!-]", "", line).strip()
    return line[:limit] + ("…" if len(line) > limit else "")


def build_note(path):
    meta, body = parse_front_matter(path.read_text(encoding="utf-8"))
    text_len = len(re.sub(r"\s", "", body))
    return {
        "id": path.stem,
        "title": str(meta.get("title", path.stem)),
        "date": str(meta.get("date", "") or __import__("time").strftime("%Y-%m-%d", __import__("time").localtime(path.stat().st_mtime))),
        "minutes": int(meta.get("minutes", 0) or max(1, text_len // 400)),
        "tags": meta.get("tags", []),
        "excerpt": str(meta.get("excerpt", "") or first_line_as_excerpt(body)),
        "body": body,
    }


def main():
    if not NOTES_DIR.is_dir():
        print("错误：找不到 notes/ 目录（当前目录：" + str(BASE) + "）")
        sys.exit(1)
    files = sorted(NOTES_DIR.glob("*.md"))
    if not files:
        print("提示：notes/ 目录下还没有 .md 笔记，生成空列表。")
    notes = [build_note(f) for f in files]
    notes.sort(key=lambda n: n["date"], reverse=True)
    OUT.write_text(json.dumps(notes, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"完成：共 {len(notes)} 篇笔记 → {OUT.relative_to(BASE)}")
    for n in notes:
        print(f"  - [{n['date']}] {n['title']}（{n['minutes']} 分钟）")


if __name__ == "__main__":
    main()
