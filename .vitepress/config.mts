import { defineConfig } from 'vitepress'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const BASE = process.env.VITE_BASE ?? '/'
const withBase = (path: string) =>
  `${BASE.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`

const asunGrammar = JSON.parse(
  readFileSync(
    resolve(__dirname, './asun.tmLanguage.json'),
    'utf-8'
  )
)

const enNav = [
  { text: 'Guide', link: '/guide/what-is-asun' },
  { text: 'Syntax', link: '/reference/syntax' },
  { text: 'Performance', link: '/reference/performance' },
  {
    text: 'Languages',
    items: [
      { text: 'Rust', link: '/languages/rust' },
      { text: 'Go', link: '/languages/go' },
      { text: 'Python', link: '/languages/python' },
      { text: 'Swift', link: '/languages/swift' },
      { text: 'C#', link: '/languages/csharp' },
      { text: 'Dart', link: '/languages/dart' },
      { text: 'JS / TS', link: '/languages/js' },
      { text: 'PHP', link: '/languages/php' },
      { text: 'C', link: '/languages/c' },
      { text: 'C++', link: '/languages/cpp' },
      { text: 'Java', link: '/languages/java' },
      { text: 'Zig', link: '/languages/zig' },
    ],
  },
  { text: 'Spec', link: '/spec' },
  { text: 'Playground', link: '/tools/converter' },
]

const zhNav = [
  { text: '指南', link: '/zh/guide/what-is-asun' },
  { text: '语法', link: '/zh/reference/syntax' },
  { text: '性能', link: '/zh/reference/performance' },
  {
    text: '语言',
    items: [
      { text: 'Rust', link: '/zh/languages/rust' },
      { text: 'Go', link: '/zh/languages/go' },
      { text: 'Python', link: '/zh/languages/python' },
      { text: 'Swift', link: '/zh/languages/swift' },
      { text: 'C#', link: '/zh/languages/csharp' },
      { text: 'Dart', link: '/zh/languages/dart' },
      { text: 'JS / TS', link: '/zh/languages/js' },
      { text: 'PHP', link: '/zh/languages/php' },
      { text: 'C', link: '/zh/languages/c' },
      { text: 'C++', link: '/zh/languages/cpp' },
      { text: 'Java', link: '/zh/languages/java' },
      { text: 'Zig', link: '/zh/languages/zig' },
    ],
  },
  { text: '规范', link: '/zh/spec' },
  { text: 'Playground', link: '/zh/tools/converter' },
]

const enSidebar = {
  '/guide/': [
    {
      text: 'Introduction',
      items: [
        { text: 'What is ASUN?', link: '/guide/what-is-asun' },
        { text: 'Getting Started', link: '/guide/getting-started' },
        { text: 'Why ASUN over JSON?', link: '/guide/why-asun' },
      ],
    },
    {
      text: 'Concepts',
      items: [
        { text: 'Schema & Data', link: '/guide/schema-and-data' },
        { text: 'LLM Integration', link: '/guide/llm-integration' },
        { text: 'Binary Format', link: '/guide/binary-format' },
      ],
    },
  ],
  '/reference/': [
    {
      text: 'Reference',
      items: [
        { text: 'Syntax', link: '/reference/syntax' },
        { text: 'Data Types', link: '/reference/data-types' },
        { text: 'Performance', link: '/reference/performance' },
        { text: 'Benchmark Notes', link: '/reference/benchmark-notes' },
      ],
    },
  ],
  '/languages/': [
    {
      text: 'Language Guides',
      items: [
        { text: 'Rust', link: '/languages/rust' },
        { text: 'Go', link: '/languages/go' },
        { text: 'Python', link: '/languages/python' },
        { text: 'Swift', link: '/languages/swift' },
        { text: 'C#', link: '/languages/csharp' },
        { text: 'Dart', link: '/languages/dart' },
        { text: 'JS / TS', link: '/languages/js' },
        { text: 'PHP', link: '/languages/php' },
        { text: 'C', link: '/languages/c' },
        { text: 'C++', link: '/languages/cpp' },
        { text: 'Java', link: '/languages/java' },
        { text: 'Zig', link: '/languages/zig' },
      ],
    },
  ],
}

const zhSidebar = {
  '/zh/guide/': [
    {
      text: '入门',
      items: [
        { text: 'ASUN 是什么？', link: '/zh/guide/what-is-asun' },
        { text: '快速开始', link: '/zh/guide/getting-started' },
        { text: '为什么选择 ASUN？', link: '/zh/guide/why-asun' },
      ],
    },
    {
      text: '核心概念',
      items: [
        { text: 'Schema 与数据', link: '/zh/guide/schema-and-data' },
        { text: 'LLM 集成', link: '/zh/guide/llm-integration' },
        { text: '二进制格式', link: '/zh/guide/binary-format' },
      ],
    },
  ],
  '/zh/reference/': [
    {
      text: '参考文档',
      items: [
        { text: '语法参考', link: '/zh/reference/syntax' },
        { text: '数据类型', link: '/zh/reference/data-types' },
        { text: '性能基准', link: '/zh/reference/performance' },
        { text: '基准说明', link: '/zh/reference/benchmark-notes' },
      ],
    },
  ],
  '/zh/languages/': [
    {
      text: '语言指南',
      items: [
        { text: 'Rust', link: '/zh/languages/rust' },
        { text: 'Go', link: '/zh/languages/go' },
        { text: 'Python', link: '/zh/languages/python' },
        { text: 'Swift', link: '/zh/languages/swift' },
        { text: 'C#', link: '/zh/languages/csharp' },
        { text: 'Dart', link: '/zh/languages/dart' },
        { text: 'JS / TS', link: '/zh/languages/js' },
        { text: 'PHP', link: '/zh/languages/php' },
        { text: 'C', link: '/zh/languages/c' },
        { text: 'C++', link: '/zh/languages/cpp' },
        { text: 'Java', link: '/zh/languages/java' },
        { text: 'Zig', link: '/zh/languages/zig' },
      ],
    },
  ],
}

export default defineConfig({
  base: BASE,
  title: 'ASUN',
  titleTemplate: ':title — ASUN',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: withBase('/logo.svg') }],
    ['meta', { name: 'theme-color', content: '#007AFF' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'ASUN' }],
    ['meta', { property: 'og:image', content: withBase('/og-image.png') }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: withBase('/og-image.png') }],
  ],

  sitemap: {
    hostname: 'https://asun-format.dev',
  },

  markdown: {
    shikiSetup: async (shiki) => {
      await shiki.loadLanguage({
        ...asunGrammar,
        name: 'asun',
        scopeName: 'source.asun',
      } as any)
    },
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      description:
        'ASUN (Array-Schema Object Notation) — a high-performance serialization format with 65% token savings over JSON, ideal for LLM interaction and large-scale data exchange.',
      themeConfig: {
        nav: enNav,
        sidebar: enSidebar,
        editLink: {
          pattern: 'https://github.com/asunLab/asun/edit/main/website/:path',
          text: 'Edit this page on GitHub',
        },
        footer: {
          message: 'Released under the MIT License.',
          copyright: 'Copyright © 2024-present ASUN Contributors',
        },
      },
    },
    zh: {
      label: '中文',
      lang: 'zh-CN',
      link: '/zh/',
      description:
        'ASUN（数组模式对象符号）—— 高性能序列化格式，相比 JSON 节省 65% Token，专为 LLM 交互与大规模数据传输设计。',
      themeConfig: {
        nav: zhNav,
        sidebar: zhSidebar,
        editLink: {
          pattern: 'https://github.com/asunLab/asun/edit/main/website/:path',
          text: '在 GitHub 上编辑此页',
        },
        footer: {
          message: '基于 MIT 许可证发布。',
          copyright: 'Copyright © 2024-present ASUN Contributors',
        },
        docFooter: {
          prev: '上一页',
          next: '下一页',
        },
        outline: {
          label: '本页目录',
        },
        lastUpdated: {
          text: '最后更新于',
        },
        returnToTopLabel: '回到顶部',
        sidebarMenuLabel: '菜单',
        darkModeSwitchLabel: '主题',
      },
    },
  },

  themeConfig: {
    logo: withBase('/logo.svg'),
    siteTitle: 'ASUN',

    socialLinks: [
      { icon: 'github', link: 'https://github.com/asunLab/asun' },
    ],

    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: { selectText: '选择', navigateText: '切换', closeText: '关闭' },
              },
            },
          },
        },
      },
    },
  },
})
