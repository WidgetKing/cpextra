# Special Behaviours

All **command variables** implement the following behaviours which allow for more flexibility in use. Some of these behaviours might be seen in certain preference variables, but they are implemented on a case by case basis.

## @syntax and #syntax

Sometimes, instead of running an action on a single slide object you want to run it on multiple objects. For example, say you build an alert box out of Captivate shapes, captions and buttons. You'll want to hide and show those objects together.

The most obvious way to do thiw would be to define a Captivate Advanced Action where you hide each object individually. However, this can be time-consuming and if later you add another object that needs to be hidden you will have to track down the Advanced Action again.

@syntax gives you a better way of running an action over a group of objects.

::: warning About groups
Captivate allows you to group objects. It also allows you to name that group. You may expect to be able to assign that group name to a command variable and have the action work.

Unfortunately, when the Captivate project is exported, groups are removed. There is no record of what objects were grouped together or what the name of that group was. So there is no way for CpExtra to work with groups. @syntax is our answer to this problem.
:::

**@syntax allows you to define a query and run an action on all matching objects.** Let's look at an example. Let's say you had a slide with the following three objects:

- SmartShape_1
- SmartShape_2
- SmartShape_3

Notice how all three of these names start with **SmartShape\_**. This is a pattern. We can write a query which matches this pattern. One matching query would be: **SmartShape\_@**. The **@** symbol is a 'wild card'. It stands in place of any character or group of characters.

If we made the following assignment:

<img :src="$withBase('/img/xcmndhide-smartshape.png')" alt="assign xcmndHide with SmartShape_@">

SmartShape_1, SmartShape_2, and SmartShape_3 would all be hidden. In just one assignment action! If we added another object to the slide called SmartShape_another, we would not need to change the action to have it hide SmartShape_another as well.

::: tip Note
While @syntax is most frequently used in relation to slide objects, there are certain times where it is applied to other objects. For example, xcmndCompleteSlide uses @syntax on slide names.
:::

### #syntax

\#syntax works the same as @syntax, except it has a wider scope. @syntax queries objects on the **current slide** while #syntax queries **objects across the whole project.**

See the video below as an example:

<iframe width="560" height="315" src="https://www.youtube.com/embed/ORGM1DqBNlY" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## About Parameters

Some commands only require one piece of information. For example, xcmndHide only needs one piece of information to work: The name of a Captivate slide object.

Other commands require more information. For example xcmndChangeState. This is a command variable that makes a slide object display a different state. To work, it requires two pieces of information:

1. The name of a slide object.
2. The name of a state within that slide object.

So how can we distinguish these two pieces of information? By using parameters. Take a look at the action below:

<img :src="$withBase('/img/xcmndchangestate-parameters.png')" alt="assign xcmndChangeState with SmartShape_1, Normal">

The slide object name and the state name are separated by a comma (,). The comma indicates the end of one parameter and the start of another.

Many CpExtra command variables require more than one parameter. Some require up to 4! So in the help documentation for each variable we outline what its parameters are.

For example: Here's how we outline the parameters for xcmndChangeState:

| (1) Slide Object Name                  | (2) State Name                                    |
| -------------------------------------- | ------------------------------------------------- |
| The slide object containing the states | The name of the state that should be made visible |

The first row will list the expected data type of the parameter. The second row provides a description of how that parameter is used to carry out the action. [Learn more about data types here.](./about.html#data-type)

### Optional parameters

While an action might require multiple pieces of information, CpExtra may be smart enough to infer what some of the information is.

For example, xcmndCallActionOn runs an action attached to an Interactive Object (such as a button). It has two parameters

| (1) Interactive Object Name                              | (2) Criteria                     |
| -------------------------------------------------------- | -------------------------------- |
| Name of slide object that holds a success/failure action | Which action you wish to trigger |

So 
## \$\$ for variable values

## [] for string values

::: tip Why didn't you use quotation marks instead?
Because Captivate has a nasty habit of removing quotation marks and therefore causing unexpected behaviour.
:::

## Warning: Variable name conflicts
