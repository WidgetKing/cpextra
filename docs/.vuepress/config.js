module.exports = {
  title: "CpExtra Help",
  description: "The Captivate multi-tool",
  base: "/cpextra/",
  // theme: "default-prefers-color-scheme",
  themeConfig: {
    sidebarDepth: 2,
    // defaultTheme: "dark",
    nav: [
      { text: "Home", link: "/" },
      // {text: "Getting Started", link: "/getting-started/purpose"},
      { text: "Variables", link: "/variables/" },
      {
        text: "Buy",
        link:
          "https://www.infosemantics.com.au/?q=adobe-captivate-widgets/cpextra"
      }
    ],

    sidebar: {
      "/variables/": ["preference"]
    }
  },

  plugins: [
    [
      "@vuepress/search",
      {
        searchMaxSuggestions: 10
      }
    ]
  ]
};
