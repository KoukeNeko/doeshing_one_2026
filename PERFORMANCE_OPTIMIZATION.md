# 博客性能优化说明

## 已实现的优化

### 1. 数据缓存优化 (src/lib/blog.ts)

已为所有主要的数据库查询函数添加了 Next.js `unstable_cache`:

- **getPublishedPosts**: 对于无搜索和标签过滤的查询启用缓存(60秒)
- **getFeaturedPosts**: 全局缓存特色文章(60秒)
- **getPostBySlug**: 缓存单篇文章(60秒)
- **getTagsWithCount**: 缓存标签列表(120秒)

### 2. Markdown 渲染缓存 (src/lib/mdx.ts)

- **renderMarkdown**: 基于内容哈希缓存渲染结果(3600秒)
- **loadProjectContent**: 缓存项目内容加载(3600秒)

这将大幅减少重复的 Markdown 解析和渲染开销。

### 3. ISR (增量静态再生成)

已为关键页面添加 `revalidate` 配置:

- **首页** ([src/app/(site)/page.tsx](src/app/(site)/page.tsx)): 60秒
- **博客列表页** ([src/app/(site)/archive/page.tsx](src/app/(site)/archive/page.tsx)): 60秒
- **博客详情页** ([src/app/(site)/blog/[slug]/page.tsx](src/app/(site)/blog/[slug]/page.tsx)): 60秒

### 4. 数据库索引优化 (prisma/schema.prisma)

添加了以下复合索引以优化常见查询:

```prisma
@@index([published, publishedAt(sort: Desc)])  // 优化按发布时间排序
@@index([published, views(sort: Desc)])        // 优化按浏览量排序
@@index([authorId])                            // 优化作者关联查询
```

## 需要手动执行的步骤

### 应用数据库迁移

由于数据库连接问题,您需要手动运行迁移:

```bash
# 方法1: 在有数据库连接的环境中运行
npx prisma migrate dev --name add_post_performance_indexes

# 方法2: 在生产环境部署时运行
npx prisma migrate deploy
```

### 清理缓存标签 (可选)

如果您需要在更新内容后手动清理缓存,可以使用 Next.js 的 revalidate 功能:

```typescript
import { revalidateTag } from 'next/cache';

// 清理所有文章缓存
revalidateTag('posts');

// 清理特定文章缓存
revalidateTag('post-{slug}');

// 清理标签缓存
revalidateTag('tags');

// 清理 Markdown 渲染缓存
revalidateTag('markdown');
```

## 预期性能提升

1. **首次访问**: 会稍慢(需要生成缓存)
2. **后续访问**: 应该快很多(直接使用缓存)
3. **60秒内的重复请求**: 几乎瞬时响应
4. **数据库查询**: 通过索引优化,查询速度提升 2-10 倍

## 缓存策略说明

- **短期缓存(60秒)**: 用于频繁变化的内容(文章列表、文章详情)
- **中期缓存(120秒)**: 用于较少变化的内容(标签)
- **长期缓存(3600秒)**: 用于计算密集型操作(Markdown 渲染)

## 监控建议

1. 使用 Next.js 的 built-in analytics 监控页面加载时间
2. 监控数据库查询性能
3. 如果发现缓存过期时间不合适,可以调整 `revalidate` 值

## 注意事项

- `unstable_cache` 虽然名字带 "unstable",但在 Next.js 14+ 中已经相当稳定
- 如果使用 Vercel 部署,这些优化会自动工作
- 本地开发时,缓存可能不太明显(dev server 会禁用某些缓存)
