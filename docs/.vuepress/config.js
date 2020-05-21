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
                link:
                    "https://www.infosemantics.com.au/?q=adobe-captivate-widgets/cpextra"
            }
        ],

        sidebar: {
            "/getting-started/": [
                "installation",
                "basic-concepts",
				"faq",
				"changelog"
            ],
            "/variables/": ["about", "special-behaviour", "event-listeners", "command", "preference", "info"]
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
