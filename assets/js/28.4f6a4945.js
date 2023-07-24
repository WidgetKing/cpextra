(window.webpackJsonp=window.webpackJsonp||[]).push([[28],{381:function(e,a,t){"use strict";t.r(a);var s=t(42),o=Object(s.a)({},(function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[t("h1",{attrs:{id:"special-behaviours"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#special-behaviours"}},[e._v("#")]),e._v(" Special Behaviours")]),e._v(" "),t("p",[e._v("All "),t("strong",[e._v("command variables")]),e._v(" implement the following behaviours which allow for more flexibility in use. Some of these behaviours might be seen in certain preference variables, but they are implemented on a case by case basis.")]),e._v(" "),t("h2",{attrs:{id:"syntax-and-syntax"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#syntax-and-syntax"}},[e._v("#")]),e._v(" @syntax and #syntax")]),e._v(" "),t("p",[e._v("Sometimes, instead of running an action on a single slide object you want to run it on multiple objects. For example, say you build an alert box out of Captivate shapes, captions and buttons. You'll want to hide and show those objects together.")]),e._v(" "),t("p",[e._v("The most obvious way to do this would be to define a Captivate Advanced Action where you hide each object individually. However, this can be time-consuming and if later you add another object that needs to be hidden you will have to track down the Advanced Action again.")]),e._v(" "),t("p",[e._v("@syntax gives you a better way of running an action over a group of objects.")]),e._v(" "),t("div",{staticClass:"custom-block warning"},[t("p",{staticClass:"custom-block-title"},[e._v("About groups")]),e._v(" "),t("p",[e._v("Captivate allows you to group objects. It also allows you to name that group. You may expect to be able to assign that group name to a command variable and have the action work.")]),e._v(" "),t("p",[e._v("Unfortunately, when the Captivate project is exported, groups are removed. There is no record of what objects were grouped together or what the name of that group was. So there is no way for CpExtra to work with groups. @syntax is our answer to this problem.")])]),e._v(" "),t("p",[t("strong",[e._v("@syntax allows you to define a query and run an action on all matching objects.")]),e._v(" Let's look at an example. Let's say you had a slide with the following three objects:")]),e._v(" "),t("ul",[t("li",[e._v("SmartShape_1")]),e._v(" "),t("li",[e._v("SmartShape_2")]),e._v(" "),t("li",[e._v("SmartShape_3")])]),e._v(" "),t("p",[e._v("Notice how all three of these names start with "),t("strong",[e._v("SmartShape_")]),e._v(". This is a pattern. We can write a query which matches this pattern. One matching query would be: "),t("strong",[e._v("SmartShape_@")]),e._v(". The "),t("strong",[e._v("@")]),e._v(" symbol is a 'wild card'. It stands in place of any character or group of characters.")]),e._v(" "),t("p",[e._v("If we made the following assignment:")]),e._v(" "),t("img",{attrs:{src:e.$withBase("/img/xcmndhide-smartshape.png"),alt:"assign xcmndHide with SmartShape_@"}}),e._v(" "),t("p",[e._v("SmartShape_1, SmartShape_2, and SmartShape_3 would all be hidden. In just one assignment action! If we added another object to the slide called SmartShape_another, we would not need to change the action to have it hide SmartShape_another as well.")]),e._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[e._v("Note")]),e._v(" "),t("p",[e._v("While @syntax is most frequently used in relation to slide objects, there are certain times where it is applied to other objects. For example, xcmndCompleteSlide uses @syntax on slide names.")])]),e._v(" "),t("h3",{attrs:{id:"syntax"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#syntax"}},[e._v("#")]),e._v(" #syntax")]),e._v(" "),t("p",[e._v("#syntax works the same as @syntax, except it has a wider scope. @syntax queries objects on the "),t("strong",[e._v("current slide")]),e._v(" while #syntax queries "),t("strong",[e._v("objects across the whole project.")])]),e._v(" "),t("p",[e._v("See the video below as an example:")]),e._v(" "),t("iframe",{attrs:{width:"560",height:"315",src:"https://www.youtube.com/embed/ORGM1DqBNlY",frameborder:"0",allow:"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",allowfullscreen:""}}),e._v(" "),t("h2",{attrs:{id:"about-parameters"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#about-parameters"}},[e._v("#")]),e._v(" About parameters")]),e._v(" "),t("p",[e._v("Some commands only require one piece of information. For example, xcmndHide only needs one piece of information to work: The name of a Captivate slide object.")]),e._v(" "),t("p",[e._v("Other commands require more information. For example xcmndChangeState. This is a command variable that makes a slide object display a different state. To work, it requires two pieces of information:")]),e._v(" "),t("ol",[t("li",[e._v("The name of a slide object.")]),e._v(" "),t("li",[e._v("The name of a state within that slide object.")])]),e._v(" "),t("p",[e._v("So how can we distinguish these two pieces of information? By using parameters. Take a look at the action below:")]),e._v(" "),t("img",{attrs:{src:e.$withBase("/img/xcmndchangestate-parameters.png"),alt:"assign xcmndChangeState with SmartShape_1, Normal"}}),e._v(" "),t("p",[e._v("The slide object name and the state name are separated by a comma (,). The comma indicates the end of one parameter and the start of another.")]),e._v(" "),t("p",[e._v("Many CpExtra command variables require more than one parameter. Some require up to 4! So in the help documentation for each variable we outline what its parameters are.")]),e._v(" "),t("p",[e._v("For example: Here's how we outline the parameters for xcmndChangeState:")]),e._v(" "),t("table",[t("thead",[t("tr",[t("th",[e._v("(1) Slide Object Name")]),e._v(" "),t("th",[e._v("(2) State Name")])])]),e._v(" "),t("tbody",[t("tr",[t("td",[e._v("The slide object whose state you wish to change (@syntax and #syntax available)")]),e._v(" "),t("td",[e._v("The name of the state that should be made visible")])])])]),e._v(" "),t("p",[e._v("The first row will list the expected data type of the parameter. The second row provides a description of how that parameter is used to carry out the action. "),t("RouterLink",{attrs:{to:"/variables/about.html#data-type"}},[e._v("Learn more about data types here.")])],1),e._v(" "),t("h3",{attrs:{id:"optional-parameters"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#optional-parameters"}},[e._v("#")]),e._v(" Optional parameters")]),e._v(" "),t("p",[e._v("While an action might require multiple pieces of information, CpExtra may be smart enough to infer what some of the information is.")]),e._v(" "),t("p",[e._v("For example, xcmndCallActionOn runs an action attached to an Interactive Object (such as a button). It has two parameters")]),e._v(" "),t("table",[t("thead",[t("tr",[t("th",[e._v("(1) Interactive Object Name")]),e._v(" "),t("th",[e._v("(2) Criteria")])])]),e._v(" "),t("tbody",[t("tr",[t("td",[e._v("Name of slide object that holds a success/failure action")]),e._v(" "),t("td",[e._v("Which action you wish to trigger")])])])]),e._v(" "),t("p",[e._v("The criteria parameter could be:")]),e._v(" "),t("ul",[t("li",[e._v("success")]),e._v(" "),t("li",[e._v("failure")]),e._v(" "),t("li",[e._v("focuslost (For Text Entry Boxes)")])]),e._v(" "),t("p",[e._v("However, in practice most people use "),t("strong",[e._v("success")]),e._v(". Therefore, if we do not provide CpExtra the criteria parameter it will assume we want to trigger the success action. This results in less code for us to write.")]),e._v(" "),t("p",[e._v("If a parameter is optional, then it will be marked so in this documentation by stating what the default value will be if no parameter is provided.")]),e._v(" "),t("table",[t("thead",[t("tr",[t("th",[e._v("(1) Interactive Object Name")]),e._v(" "),t("th",[e._v("(2) Criteria "),t("strong",[e._v("(default: success)")])])])]),e._v(" "),t("tbody",[t("tr",[t("td",[e._v("Name of slide object that holds a success/failure action")]),e._v(" "),t("td",[e._v("Which action you wish to trigger")])])])]),e._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),t("p",[e._v("For command variables where only one parameter is required, providing multiple parameters will run that action multiple times as if you had called it separately for each parameter.")]),e._v(" "),t("p",[e._v("For example, running:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("Assign | xcmndHide with SmartShape_1\nAssign | xcmndHide with SmartShape_2\n")])])]),t("p",[e._v("Could be accomplished in one line of code by using parameters like so:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("Assign | xcmndHide with SmartShape_1, SmartShape_2\n")])])])]),e._v(" "),t("h2",{attrs:{id:"for-string-values"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#for-string-values"}},[e._v("#")]),e._v(" [] for string values")]),e._v(" "),t("p",[e._v("CpExtra tries to interpret when you want to use variables. For example, lets say you have the following set-up:")]),e._v(" "),t("ul",[t("li",[e._v("A slide with an object labelled: SmartShape_1")]),e._v(" "),t("li",[e._v("A variable called: ObjectToHide (value: SmartShape_1)")])]),e._v(" "),t("p",[e._v("If you ran:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("Assign | xcmndHide with ObjectToHide\n")])])]),t("p",[e._v("Then CpExtra would look to the value of the ObjectToHide "),t("strong",[e._v("variable")]),e._v(", discover it is 'SmartShape_1' and then proceed to hide SmartShape_1.")]),e._v(" "),t("p",[e._v("But now suppose you had the following set-up:")]),e._v(" "),t("ul",[t("li",[e._v("A slide with objects labelled: SmartShape_1 AND ObjectToHide")]),e._v(" "),t("li",[e._v("A variable called: ObjectToHide (value: SmartShape_1)")])]),e._v(" "),t("p",[e._v("Now when you run:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("Assign | xcmndHide with ObjectToHide\n")])])]),t("p",[e._v("What will be hidden?")]),e._v(" "),t("ul",[t("li",[e._v("If CpExtra thinks ObjectToHide is pointing to the "),t("strong",[e._v("slide object")]),e._v(", that will be hidden.")]),e._v(" "),t("li",[e._v("If CpExtra thinks ObjectToHide is pointing to the "),t("strong",[e._v("variable")]),e._v(", then SmartShape_1 will be hidden.")])]),e._v(" "),t("p",[e._v("In this particular case CpExtra will assume this is a variable and hide SmartShape_1. But let's say we wanted to hide the slide object called ObjectToHide instead?")]),e._v(" "),t("p",[e._v("Then we can write the following:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("Assign | xcmndHide with [ObjectToHide]\n")])])]),t("p",[e._v("When CpExtra sees square brackets, it knows this MUST be a string and NOT a variable.")]),e._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[e._v("White space")]),e._v(" "),t("p",[e._v("White space characters include spaces and tabs. CpExtra automatically removes whitespace characters when an assignment is made to a variable. However, this sometimes causes unintended behaviour, as can be seen with the "),t("RouterLink",{attrs:{to:"/command.html#xcmndalert"}},[e._v("xcmndAlert")]),e._v(" and the "),t("RouterLink",{attrs:{to:"/command.html#xcmndcompleteslide"}},[e._v("xcmndCompleteSlide")]),e._v(" variables.")],1),e._v(" "),t("p",[e._v("Square brackets allow you to get around this as any white space inside the brackets will be maintained. See the above command variable's help to see examples of this.")])]),e._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[e._v("Why didn't you use quotation marks instead?")]),e._v(" "),t("p",[e._v("Because Captivate has a nasty habit of removing quotation marks and therefore causing unexpected behaviour.")])]),e._v(" "),t("h2",{attrs:{id:"for-variable-values"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#for-variable-values"}},[e._v("#")]),e._v(" $$ for variable values")]),e._v(" "),t("p",[e._v("Conversely if you came across a situation where you absolutely wanted a variable's value to be used as a parameter you can explicitly state that by surrounding the parameter with dollar signs. Here's an example:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("Assign | xcmndAddEventListener with $$SLIDE_OBJECT$$, $$EVENT$$, $$ACTION$$, $$CRITERIA$$\n")])])]),t("p",[e._v("Here we see all four parameters are gaining their value from variables.")]),e._v(" "),t("div",{staticClass:"custom-block warning"},[t("p",{staticClass:"custom-block-title"},[e._v("WARNING")]),e._v(" "),t("p",[e._v("Do not try to define more than one parameter with a variable. For example this "),t("strong",[e._v("would not work")]),e._v(":")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("Assign | ALL_PARAMETERS with SmartShape_1, click, Button_1, success\nAssign | xcmndAddEventListener with $$ALL_PARAMETERS$$\n")])])])]),e._v(" "),t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[e._v("Variable values as part of a parameter")]),e._v(" "),t("p",[e._v("Conversely, "),t("strong",[e._v("for certain parameters")]),e._v(" double-dollar variables can be used as "),t("strong",[e._v("part")]),e._v(" of a parameter. For example, let's say we wanted to use xcmndAlert to send us a message saying what the current value of the variable "),t("strong",[e._v("My_Var")]),e._v(" is. We could write:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("Assign | xcmndAlert with My_Var: $$My_Var$$\n")])])]),t("p",[e._v("Assuming the value of "),t("strong",[e._v("My_Var")]),e._v(" is "),t("strong",[e._v("Hello World!")]),e._v(" we would see:")]),e._v(" "),t("img",{attrs:{src:e.$withBase("/img/alert-my-var-no-space.png"),alt:"Alert box displaying: MyVar:Hello World!"}}),e._v(" "),t("p",[e._v("Notice how we've lost the space between the colon and the variable value? We can fix this by mixing square brackets and double dollar signs together like so:")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("Assign | xcmndAlert with [My_Var: $$My_Var$$]\n")])])]),t("p",[e._v("Here's what we get:")]),e._v(" "),t("img",{attrs:{src:e.$withBase("/img/alert-my-var-with-space.png"),alt:"Alert box displaying: MyVar: Hello World!"}})]),e._v(" "),t("h2",{attrs:{id:"unexpected-behaviour-of-variable-names"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#unexpected-behaviour-of-variable-names"}},[e._v("#")]),e._v(" Unexpected behaviour of variable names")]),e._v(" "),t("p",[e._v("When making assignments, Captivate also attempts to replace variables with their variable values. Except the way it does it is really annoying.")]),e._v(" "),t("p",[e._v("Say you had the following set-up:")]),e._v(" "),t("ul",[t("li",[e._v("A variable named var_number (value: 4.44)")]),e._v(" "),t("li",[e._v("A variable names var_to_round (value: var_number)")])]),e._v(" "),t("p",[e._v("What would you expect the following code to do?")]),e._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[e._v("Assign | xcmndRound with var_to_round\n")])])]),t("p",[e._v("Logically, nothing. var_to_round's value is not a number. However, if you checked var_number's value after running the above action you would find that it is now: 4")]),e._v(" "),t("p",[e._v("So what happened? When you assigned var_to_round to xcmndRound, Captivate 'var_to_round' with the variable's value: var_number")]),e._v(" "),t("p",[e._v("CpExtra then ran its action against the var_number variable.")]),e._v(" "),t("p",[e._v("This "),t("strong",[e._v("only happens")]),e._v(" when assigning a literal value to a variable, where that literal value exactly matches the name of a variable. When making the above assignment to xcmndRound if we simply added a space before var_to_round it would have resulted in the expected behaviour.")]),e._v(" "),t("p",[e._v("Just another one of those gotchas of working with Captivate.")])])}),[],!1,null,null,null);a.default=o.exports}}]);