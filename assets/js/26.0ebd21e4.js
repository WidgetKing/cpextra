(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{379:function(e,t,a){"use strict";a.r(t);var s=a(42),o=Object(s.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"info-variables"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#info-variables"}},[e._v("#")]),e._v(" Info Variables")]),e._v(" "),a("p",[e._v("Below is an alphabetical list of all CpExtra "),a("RouterLink",{attrs:{to:"/variables/about.html#info-variables"}},[e._v("info variables")]),e._v(".")],1),e._v(" "),a("h2",{attrs:{id:"xinfobuild"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#xinfobuild"}},[e._v("#")]),e._v(" xinfoBuild")]),e._v(" "),a("p",[e._v("Each CpExtra version has a unique build number which is independent of the major or minor (dot.point) version number. If you ever need to report an issue for Infosemantics to debug, we may need to ask what Captivate build you are using. The build number can be found by defining this variable and displaying it in a caption.")]),e._v(" "),a("h3",{attrs:{id:"see-also"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#see-also"}},[e._v("#")]),e._v(" See Also")]),e._v(" "),a("ul",[a("li",[a("a",{attrs:{href:"#xinfoversion"}},[e._v("xinfoVersion")])])]),e._v(" "),a("h2",{attrs:{id:"xinfoeventtarget"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#xinfoeventtarget"}},[e._v("#")]),e._v(" xinfoEventTarget")]),e._v(" "),a("p",[e._v("This variable displays the name of the last slide object to dispatch a run-time event. To understand this variable, you must first understand what event listeners are and how they work. "),a("a",{attrs:{href:"../features/event-listeners"}},[e._v("Click here to learn more about event listeners.")])]),e._v(" "),a("h3",{attrs:{id:"use-cases"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#use-cases"}},[e._v("#")]),e._v(" Use cases")]),e._v(" "),a("p",[e._v("Let's say you added an event listener to a group of objects using "),a("strong",[e._v("@syntax")]),e._v(" to select object names.")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("Assign | xcmndAddEventListener with SmartShape_@, click, action\n")])])]),a("p",[e._v("The above code will run whatever action is triggered by a click event on all objects whose name begins with "),a("strong",[e._v("SmartShape_")]),e._v(".")]),e._v(" "),a("p",[e._v("However, suppose we wanted to hide the object that was just clicked. How would we determine which object to hide? "),a("strong",[e._v("xinfoEventTarget")]),e._v(" can automatically supply this data.  All we have to do is run the following code right after the above-mentioned event handler:")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("Assign | xcmndHide with xinfoEventTarget\n")])])]),a("p",[e._v("::: note\nxinfoEventTarget only updates to reflect what objects triggered xcmndAddEventListener actions. So, for example, if in Captivate's properties panel you configure a button's "),a("strong",[e._v("success action")]),e._v(" to run an Advanced Action, upon clicking that button xinfoEventTarget "),a("strong",[e._v("will not")]),e._v(" update. Instead, use xcmndAddEventListener to listen for a click event on that button.\n:::")]),e._v(" "),a("h3",{attrs:{id:"video"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#video"}},[e._v("#")]),e._v(" Video")]),e._v(" "),a("iframe",{attrs:{width:"560",height:"315",src:"https://www.youtube.com/embed/BizZLF5-lQ0",frameborder:"0",allow:"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",allowfullscreen:""}}),e._v(" "),a("h3",{attrs:{id:"see-also-2"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#see-also-2"}},[e._v("#")]),e._v(" See Also")]),e._v(" "),a("ul",[a("li",[a("RouterLink",{attrs:{to:"/variables/command.html#xcmndaddeventlistener"}},[e._v("xcmndAddEventListener")])],1)]),e._v(" "),a("h2",{attrs:{id:"xinfoprojectelapsedhours"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#xinfoprojectelapsedhours"}},[e._v("#")]),e._v(" xinfoProjectElapsedHours")]),e._v(" "),a("p",[e._v("Displays how many hours of course content the learner has already viewed. This variable is useful for displaying time-based information on screen or in a custom playbar.")]),e._v(" "),a("h3",{attrs:{id:"see-also-3"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#see-also-3"}},[e._v("#")]),e._v(" See Also")]),e._v(" "),a("ul",[a("li",[a("RouterLink",{attrs:{to:"/variables/info.html#xprefusedoubledigitelapsedtimevalues"}},[e._v("xprefUseDoubleDigitElapsedTimeValues")])],1)]),e._v(" "),a("h2",{attrs:{id:"xinfoprojectelapsedminutes"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#xinfoprojectelapsedminutes"}},[e._v("#")]),e._v(" xinfoProjectElapsedMinutes")]),e._v(" "),a("p",[e._v("Displays how many minutes of the current hour of course content the learner has already viewed. This variable is useful for displaying time-based information on screen or in a custom playbar.")]),e._v(" "),a("h3",{attrs:{id:"see-also-4"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#see-also-4"}},[e._v("#")]),e._v(" See Also")]),e._v(" "),a("ul",[a("li",[a("RouterLink",{attrs:{to:"/variables/info.html#xprefusedoubledigitelapsedtimevalues"}},[e._v("xprefUseDoubleDigitElapsedTimeValues")])],1)]),e._v(" "),a("h2",{attrs:{id:"xinfoprojectelapsedseconds"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#xinfoprojectelapsedseconds"}},[e._v("#")]),e._v(" xinfoProjectElapsedSeconds")]),e._v(" "),a("p",[e._v("Displays how many seconds of the current minute of course content the learner has already viewed. This variable is useful for displaying time-based information on screen or in a custom playbar.")]),e._v(" "),a("h3",{attrs:{id:"see-also-5"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#see-also-5"}},[e._v("#")]),e._v(" See Also")]),e._v(" "),a("ul",[a("li",[a("RouterLink",{attrs:{to:"/variables/info.html#xprefusedoubledigitelapsedtimevalues"}},[e._v("xprefUseDoubleDigitElapsedTimeValues")])],1)]),e._v(" "),a("h2",{attrs:{id:"xinfoprojecttotalhours"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#xinfoprojecttotalhours"}},[e._v("#")]),e._v(" xinfoProjectTotalHours")]),e._v(" "),a("p",[e._v("Displays the total number of hours of content in a course module. This variable is useful for displaying time-based information on screen or in a custom playbar.")]),e._v(" "),a("h3",{attrs:{id:"see-also-6"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#see-also-6"}},[e._v("#")]),e._v(" See Also")]),e._v(" "),a("ul",[a("li",[a("RouterLink",{attrs:{to:"/variables/info.html#xprefusedoubledigitTotaltimevalues"}},[e._v("xprefUseDoubleDigitTotalTimeValues")])],1)]),e._v(" "),a("h2",{attrs:{id:"xinfoprojecttotalminutes"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#xinfoprojecttotalminutes"}},[e._v("#")]),e._v(" xinfoProjectTotalMinutes")]),e._v(" "),a("p",[e._v("Displays the total number of minutes of content in a course module (values above 59 will wrap back around to 0). This variable is useful for displaying time-based information on screen or in a custom playbar.")]),e._v(" "),a("h3",{attrs:{id:"see-also-7"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#see-also-7"}},[e._v("#")]),e._v(" See Also")]),e._v(" "),a("ul",[a("li",[a("RouterLink",{attrs:{to:"/variables/info.html#xprefusedoubledigitTotaltimevalues"}},[e._v("xprefUseDoubleDigitTotalTimeValues")])],1)]),e._v(" "),a("h2",{attrs:{id:"xinfoprojecttotalseconds"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#xinfoprojecttotalseconds"}},[e._v("#")]),e._v(" xinfoProjectTotalSeconds")]),e._v(" "),a("p",[e._v("Displays the number of seconds of content contained in the course (values above 59 will wrap back around to 0). This variable is useful for displaying time-based information on screen or in a custom playbar.")]),e._v(" "),a("h3",{attrs:{id:"see-also-8"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#see-also-8"}},[e._v("#")]),e._v(" See Also")]),e._v(" "),a("ul",[a("li",[a("RouterLink",{attrs:{to:"/variables/info.html#xprefusedoubledigitTotaltimevalues"}},[e._v("xprefUseDoubleDigitTotalTimeValues")])],1)]),e._v(" "),a("h2",{attrs:{id:"xinfoversion"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#xinfoversion"}},[e._v("#")]),e._v(" xinfoVersion")]),e._v(" "),a("p",[e._v("Displays the version number of the CpExtra library currently published with the output playing in the web browser. (CpExtra is continually being updated and versions can change several times within a short period during rapid development cycles.) Each public release will be under a new version number. If you want to check if your CpExtra is the current version, you can display this variable in a caption, and then check the "),a("RouterLink",{attrs:{to:"/getting-started/changelog.html"}},[e._v("changelog")]),e._v(" to see if a newer version is available for download.")],1),e._v(" "),a("p",[e._v("If there is a new version, you can log back in to "),a("a",{attrs:{href:"http://www.infosemantics.com.au",target:"_blank",rel:"noopener noreferrer"}},[e._v("www.infosemantics.com.au"),a("OutboundLink")],1),e._v(" and download it from your account page.")]),e._v(" "),a("h3",{attrs:{id:"see-also-9"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#see-also-9"}},[e._v("#")]),e._v(" See Also")]),e._v(" "),a("ul",[a("li",[a("a",{attrs:{href:"#xinfobuild"}},[e._v("xinfoBuild")])])])])}),[],!1,null,null,null);t.default=o.exports}}]);