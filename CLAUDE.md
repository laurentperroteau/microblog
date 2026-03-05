# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run build` - Build static site to `_site/` (use to verify the build works)

## Creating a new post

- Create file in `src/posts/` with format `YYYY-MM-DD-slug.md`
- Frontmatter requires `title` (quoted if contains `:`) and `date`
- Posts are displayed on a single page, newest first
- Do not use `---` (horizontal rule) in post content as it's used as visual separator between posts
- Can commit and push directly, but never force push
