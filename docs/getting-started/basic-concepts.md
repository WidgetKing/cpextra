# Basic Concepts

## CpExtra is a multi-tool
Most tools have one use. A hammer drives in nails, a screwdriver drives in screws. They are usually designed to do just one thing, and do it well.
A multi-tool (like a swiss-army-knife) contains many tools. It is not designed to do just one thing. It is a tool which is comprised of a lot of smaller tools.
So when people ask 'what does CpExtra do', the answer is: "Lots of things! It contains many small tools which provides a wide array of solutions for any e-learning project you are creating with Adobe Captivate."

## Is CpExtra a widget?
Yes and no. A widget is a file with a .wdgt extension which can be inserted into Adobe Captivate. Once loaded the widget file will display on the Captivate stage and deliver one or more features at runtime. The **Learning Interactions** found in Captivate under **Media > HTML5 Animations** are examples of widgets. 
While CpExtra *can* be loaded into Captivate as a widget, we do not consider it to be a widget for the following reasons:
1. It doesn't need to be loaded as a widget. In fact, we **strongly** recommend you use the **headless loading** method explained in the Installation page of these help files.
2. Widgets are normally configured via a **Widget Properties** dialog interface. CpExtra does not make use of such an interface except to list the current widget version number and alert you to whether a new version has been released.
3. At runtime widgets usually add some kind of visual interaction (the learning interactions for example). CpExtra does not. It runs invisibly in the background.
So for these reasons, we prefer to consider CpExtra to be a **JavaScript library**. In programing terminology a 'library' refers to a collection of scripts which automate frequently performed tasks. We feel this is a more accurate description of what CpExtra does for Captivate.

## CpExtra is HTML5 ONLY
While Captivate is capable of publishing to several different outputs CpExtra is only compatible with HTML5. There are no plans to make it work with SWF output as Adobe has publicly stated that Flash/SWF will not be supported after 2020.  Many browser manufacturers have already stopped allowing SWF to run, and SWF cannot be used on mobile devices.

::: tip
Since [Flash Player end of life](https://www.adobe.com/products/flashplayer/end-of-life.html) happens soon, you would need to have a very good reason for developing any course for SWF output at this point in time.
:::

## How do I make CpExtra do something?
Since CpExtra does not have an interface of its own, you send orders to CpExtra in one of the following ways:

### 1. Through specially named user variables
Most of CpExtra's features are accessed through Captivate **User Variables** that have specific names. CpExtra will respond whenever it detects one of these specially-named variables is assigned a value. 
To learn more about defining these special variables, please see the [variables](/variables/about/) page.

### 2. Through variables with a certain prefix
CpExtra can automatically give Captivate variables special abilities if their name contains a certain prefix.

For example: If you give a variable a prefix **ls\_** (such as: ls\_myvar) then CpExtra will make that a local storage variable.

Recognized prefixes include:
- **ls\_** - Local Storage
- **ss\_** - Session Storage
- **get\_** - Get Variables

::: tip
These prefixes are **not** case sensitive. You can also add underscores (\_) to the start of variable names to make them sort to the top of variables lists and make them easier to find.

So all the following would be valid variable names:
- ls\_myvar
- LS\_myvar
- \_LS\_myvar
- \_ls\_myvar
:::

### 3. Slide object state names
CpExtra's **Smart Object States** feature is configured by naming states in a special way. See the [Smart States](/features/smart-states/) feature page for more information

### 4. Other areas of the Captivate interface
Some CpExtra features tie in to specific parts of the Captivate interface. As you read through this help system you'll learn more about that.
