# Basic Concepts

## CpExtra is a multi-tool
Most tools have one use. A hammer drives in nails, a screwdriver drives in screws. They are designed to do one thing, and do it well.
A multi-tool (like a swiss-army-knife) contains many tools. It is not designed to do just one thing. It is a tool which holds a lot of smaller tools.
So when people ask 'what does CpExtra do', the answer is: "No one thing. It contains many small tools which are helpful for any project you are making."

## Is CpExtra a widget?
A widget is a file with a .wdgt extension which can be loaded into Captivate. Once loaded they will display on the stage and provide a feature at runtime. The learning interactions in Captivate are examples of widgets. 
While CpExtra can be loaded into Captivate as a widget, we do not consider CpExtra to be a widget for the following reasons:
1. It doesn't have to be loaded as a widget. In fact, we **strongly** recommend you do not load it as a widget, but rather headlessly.
2. Widgets were configured through a 'widget properties' window. CpExtra does not make use of that window except to list the current version number and alert you to whether a new version has been released.
3. At runtime widgets usually added some kind of visual interaction (the learning interactions for example). CpExtra does not. It runs invisibly in the background.
Instead, we consider CpExtra to be a **library**. In programing circles a library is considered as a collection of scripts which automate frequently performed tasks. We feel this is a more accurate description of what CpExtra does for Captivate.

## How do I make CpExtra do something?
CpExtra does not have an interface. You send orders to CpExtra in one of the following ways:

### 1. Through specially named user variables
Most of CpExtra's features are accessed through Captivate user variables that have a fixed name. CpExtra will respond whenever it detects one of these special variables is assigned a value. 
To learn more about defining these special variables, please see the [variables](/variables/about/) page.

### 2. Through variables with a certain prefix
CpExtra can give Captivate Variables special abilities if their name contains a certain prefix.

For example: If you give a variable a prefix **ls\_** (such as: ls\_myvar) then CpExtra will make that a local storage variable.

Recognized prefixes include:
- **ls\_** - Local Storage
- **ss\_** - Session Storage
- **get\_** - Get Variables

::: tip
These prefixes are **not** case sensitive. You can also add underscores (\_) to the start of their names to make them sort to the top of variables lists.

So all the following would be valid variable names:
- ls\_myvar
- LS\_myvar
- \_LS\_myvar
- \_ls\_myvar
:::

### 3. Slide object state names
CpExtra's Smart States feature is configured by naming states in a special way. See the [Smart States](/features/smart-states/) feature page for more information

### 4. Other areas of the Captivate interface
Some CpExtra features tie in to specific parts of the Captivate interface. As you read through this help system you'll learn more about that.
