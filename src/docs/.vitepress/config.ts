import { defineConfig, Plugin } from "vitepress"
import { apiSidebar } from "./sidebar/api.mts"
import { groupIconMdPlugin, groupIconVitePlugin } from "vitepress-plugin-group-icons"

export default defineConfig({
  title: "OpenCloud",
  description: "Typed SDK for Roblox Open Cloud",
  lastUpdated: true,
  cleanUrls: true,
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }]
  ],

  themeConfig: {
    logo: "/logo.svg",
    siteTitle: false,
    nav: [
      { text: "Guide", link: "/guide/getting-started" },
      { text: "API Reference", link: "/api/" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "Guide",
          items: [
            { text: "Getting Started", link: "/guide/getting-started" },
            { text: "Authentication", link: "/guide/authentication" },
            { text: "Error Handling", link: "/guide/error-handling" },
            { text: "Pagination", link: "/guide/pagination" },
            { text: "Rate Limiting", link: "/guide/rate-limiting" },
            { text: "TypeScript", link: "/guide/typescript" },
            { text: "Migration Guide", link: "/guide/migration" },
          ]
        },
        {
          text: "Resources",
          items: [
            { text: "Users", link: "/guide/resources/users" },
            { text: "Groups", link: "/guide/resources/groups" },
          ]
        }
      ],
      ...apiSidebar
    },
    outline: [2, 3],
    socialLinks: [
      { icon: "github", link: "https://github.com/relatiocc/opencloud" },
      { icon: "discord", link: "https://relatio.cc/discord" }
    ],
    search: {
      provider: "local"
    },
    editLink: {
      pattern: "https://github.com/relatiocc/opencloud/edit/main/src/docs/:path"
    }
  },
  markdown: {
    theme: {
      light: "github-light",
      dark: "github-dark"
    },
    config(md) {
      md.use(groupIconMdPlugin)
    }
  },
  vite: {
    plugins: [groupIconVitePlugin() as Plugin]
  }
})
