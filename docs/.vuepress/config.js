module.exports = {
  title: "CpExtra Help",
  description: "The Captivate multi-tool",
  base: "/cpextra/",
  port: 9090,
  // theme: "default-prefers-color-scheme",
  themeConfig: {
    sidebarDepth: 1,
    displayAllHeaders: true,
    // defaultTheme: "dark",
    nav: [
      { text: "Home", link: "/" },
      {
        text: "Getting Started",
        link: "/getting-started/installation/"
      },
      { text: "Features", link: "/features/" },
      { text: "Variables", link: "/variables/about/" },
      {
        text: "Buy",
        link: "https://infosemantics.com.au/about-cpextra/"
      },
      { text: "CpMate", link: "https://widgetking.github.io/cpmate/" }
    ],

    sidebar: {
      "/getting-started/": [
        "installation",
        "updating",
        "basic-concepts",
        "faq",
        "known-issues",
        "changelog"
      ],
      "/variables/": [
        "about",
        "special-behaviour",
        "command",
        "preference",
        "info"
      ],
      "/features/": [
        "about",
        "smart-states",
        "variable-prefixes",
        "replace-var-in-url",
        "event-listeners",
        "events-list"
      ]
    }

    // Sidebar as groups
    // Problem with this is that it shows a sidebar for the whole site
    // on every page rather than a custom one.
    // sidebar: [
    //   {
    //     title: "Getting Started",
    //     path: "/getting-started/",
    //     children: ["installation", "basic-concepts", "faq", "changelog"]
    //   },
    //   {
    //     title: "Variables",
    //     path: "/variables/",
    //     collapsable: false,
    //     children: [
    //       "about",
    //       "special-behaviour",
    //       "command",
    //       "preference",
    //       "info"
    //     ]
    //   },
    //   {
    //     title: "Features",
    //     path: "/features/",
    //     sidebarDepth: 2,
    //     collapsable: false,
    //     children: [
    //       "about",
    //       "smart-states",
    //       "variable-prefixes",
    //       "replace-var-in-url",
    //       "event-listeners"
    //     ]
    //   }
    // ]
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
