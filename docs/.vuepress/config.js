module.exports = {
  title: "CpExtra Help",
  description: "The Captivate multi-tool",
  base: "/cpextra/",
  // theme: "default-prefers-color-scheme",
  themeConfig: {
    sidebarDepth: 2,
    displayAllHeaders: true,
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
    ]

    // sidebar: {
    //   "/variables/": [
    //     {
    //       title: "Command Variables",
    //       path: "/command/",
    //       collapsable: false,
    //       sidebarDepth: 1,
    //       children: []
    //     },
    //     {
    //       title: "Preference Variables",
    //       path: "/preference/",
    //       collapsable: false,
    //       sidebarDepth: 1,
    //       children: []
    //     }
    //   ]
    // }
	  
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
