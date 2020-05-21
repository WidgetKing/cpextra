# Special Behaviours

All **command variables** implement the following behaviours which allow for more flexibility in use. Some of these behaviours might be seen in certain preference variables, but they are implemented on a case by case basis.

## @syntax and #syntax

Sometimes, instead of running an action on a single slide object you want to run it on multiple objects. For example, say you build an alert box out of Captivate shapes, captions and buttons. You'll want to hide and show those objects together.

The most obvious way to do this would be to define a Captivate Advanced Action where you hide each object individually. However, this can be time-consuming and if later you add another object that needs to be hidden you will have to track down the Advanced Action again.

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

The criteria parameter could be:
- success
- failure
- focuslost (For Text Entry Boxes)

However, in practice most people use **success**. Therefore, if we do not provide CpExtra the criteria parameter it will assume we want to trigger the success action. This results in less code for us to write.

If a parameter is optional, then it will be marked so in this documentation by stating what the default value will be if no parameter is provided.

| (1) Interactive Object Name                              | (2) Criteria **(default: success)** |
| -------------------------------------------------------- | --------------------------------    |
| Name of slide object that holds a success/failure action | Which action you wish to trigger    |

::: tip
For command variables where only one parameter is required, providing multiple parameters will run that action multiple times as if you had called it separately for each parameter.

For example, running:

```
Assign xcmndHide with SmartShape_1
Assign xcmndHide with SmartShape_2
```

Could be accomplished in one line of code by using parameters like so:

```
Assign xcmndHide with SmartShape_1, SmartShape_2
```
:::



## [] for string values

CpExtra tries to interpret when you want to use variables. For example, lets say you have the following set-up:

- A slide with an object labelled: SmartShape_1
- A variable called: ObjectToHide (value: SmartShape_1)

If you ran:

```
Assign xcmndHide with ObjectToHide
```

Then CpExtra would look to the value of the ObjectToHide **variable**, discover it is 'SmartShape_1' and then proceed to hide SmartShape_1.

But now suppose you had the following set-up:
- A slide with objects labelled: SmartShape_1 AND ObjectToHide
- A variable called: ObjectToHide (value: SmartShape_1)

Now when you run:

```
Assign xcmndHide with ObjectToHide
```

What will be hidden?
- If CpExtra thinks ObjectToHide is pointing to the **slide object**, that will be hidden.
- If CpExtra thinks ObjectToHide is pointing to the **variable**, then SmartShape_1 will be hidden.

In this particular case CpExtra will assume this is a variable and hide SmartShape_1. But let's say we wanted to hide the slide object called ObjectToHide instead?

Then we can write the following:

```
Assign xcmndHide with [ObjectToHide]
```

When CpExtra sees square brackets, it knows this MUST be a string and NOT a variable.

::: tip Why didn't you use quotation marks instead?
Because Captivate has a nasty habit of removing quotation marks and therefore causing unexpected behaviour.
:::

## $$ for variable values

Conversely if you came across a situation where you absolutely wanted a variable's value to be used as a parameter you can explicitly state that by surrounding the parameter with dollar signs. Here's an example:

```
Assign xcmndAddEventListener with $$SLIDE_OBJECT$$, $$EVENT$$, $$ACTION$$, $$CRITERIA$$
```

Here we see all four parameters are gaining their value from variables.

::: warning
Do not try to define more than one parameter with a variable. For example this **would not work**:

```
Assign ALL_PARAMETERS with SmartShape_1, click, Button_1, success
Assign xcmndAddEventListener with $$ALL_PARAMETERS$$
```
:::

::: tip Variable values as part of a parameter

Conversely, double-dollar variables CAN be used as part of a parameter. For example, let's say we wanted to use xcmndAlert to send us a message saying what the current value of the variable **My_Var** is. We could write:

```
Assign xcmndAlert with My_Var: $$My_Var$$
```

Assuming the value of **My_Var** is **Hello World!** we would see:

** INSERT IMAGE HERE **

Notice how we've lost the space between the colon and the variable value? We can fix this by mixing square brackets and double dollar signs together like so:

```
Assign xcmndAlert with [My_Var: $$My_Var$$]
```

Here's what we get:
** INSERT IMAGE HERE**

:::

## Unexpected behaviour of variable names

When making assignments, Captivate also attempts to replace variables with their variable values. Except the way it does it is really annoying.

Say you had the following set-up:
- A variable named var_number (value: 4.44)
- A variable names var_to_round (value: var_number)

What would you expect the following code to do?

```
Assign xcmndRound with var_to_round
```

Logically, nothing. var_to_round's value is not a number. However, if you checked var_number's value after running the above action you would find that it is now: 4

So what happened? When you assigned var_to_round to xcmndRound, Captivate 'var_to_round' with the variable's value: var_number

CpExtra then ran its action against the var_number variable.

This **only happens** when assigning a literal value to a variable, where that literal value exactly matches the name of a variable. When making the above assignment to xcmndRound if we simply added a space before var_to_round it would have resulted in the expected behaviour.

Just another one of those gotchas of working with Captivate.
