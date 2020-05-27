# Command Variables

Below is a list of all the command variables offered by CpExtra in alphabetical order.

## xcmndAddEventListener

### Parameters

| (1) Slide Object Name                                       | (2) Event                                                                | (3) Interactive Object Name                              | (4) Criteria (default: success)  |
| ----------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------- | -------------------------------- |
| Name of slide object that you want to listen to an event on | Name of [event](../../features/events-list) that you want to listen for. | Name of slide object that holds a success/failure action | Which action you wish to trigger |

### Description

Adds and event listener to a slide object.

-   [See this page to learn more about event listeners](../../features/event-listeners)
-   [This page contains the list of available events](../../features/events-list)

::: tip
xcmndAddEventListener and #syntax are a very powerful combination which essentially allows you to create a new subset of slide object with its own special behaviour.
:::

### See Also

-   [xcmndRemoveEventListener](#xcmndremoveeventlistener)

## xcmndAlert

### Parameters

| (1) String                 | (2) String    | (3) Interactive Object Name                              | (4) Criteria (default: success)                                    |
| -------------------------- | ------------- | -------------------------------------------------------- | ------------------------------------------------------------------ |
| Content of alert's message | Alert's title | Name of slide object that holds a success/failure action | Which action you wish to trigger when the alert's Ok button is hit |

### Description

Causes an alert box to appear.

<img :src="$withBase('/img/alert-hello-world.png')" alt="The default Captivate alert box">

The **first parameter** defines the message that appears in the main section of the alert.

For example, the following code...

```
Assign | xcmndAlert with This is my message
```

...will generate this alert:

<img :src="$withBase('/img/alert-no-spaces.png')" alt="Alert displaying: thisismymessage">

Notice how the spaces have been removed? This is because CpExtra removes all white space characters when assignments are made to command variables.

To get around this you can [use square brackets to designate a string.](./special-behaviour.html#for-string-values)

```
Assign | xcmndAlert with [This is my message]
```

<img :src="$withBase('/img/alert-with-spaces.png')" alt="Alert displaying: This is my message">

If you don't want the title of the alert box to always be 'CpExtra Alert' you can change the title with the **second parameter**.

```
Assign | xcmndAlert with [This is my message], [This is my title]
```

<img :src="$withBase('/img/alert-with-title.png')" alt="Alert with custom title">

Alert boxes are usually used for debugging Advanced Actions. Often you want to know what the value of a variable was during a certain point of the Advanced Action.

To assist with this both the first and second parameters allow you to include variable values as part of their parameters.

Let's say we have a variable called **MyVar**. We can use double dollar signs to trace out the value of MyVar.

```
Assign | xcmndAlert with [Value of MyVar: $$MyVar$$]
```

From the result below we can see that **MyVar** currently equals **16**

<img :src="$withBase('/img/alert-with-variable.png')" alt="Alert displaying: Value of MyVar: 16">

It's possible that you want a special action to run after tapping the alert's Ok button. [As explained here](../../features/event-listeners.html#triggering-one-action-from-another) CpExtra can only call an action if it is associated with an interactive object's criteria.

The **third parameter** allows you to specify the name of the interactive object.

The **fourth parameter** allows you to specify which of the interactive object's criteria you wish to trigger. This will default to **success**. Essentially the third and fourth parameters are the same as [xcmndCallActionOn](#xcmndcallactionon).

## xcmndAllowTabOut

### Parameters

| (1) Text Entry Box Name                                                              |
| -----------------------------------------------------------------                    |
| The text entry box you want to stop using xcmndPreventTabOut's special functionality |

### Description
This command variable exists purely to turn of **xcmndPreventTabOut's** functionality. Please see that variable's help for more information.

### See Also
- [xcmndPrevenTabOut](#xcmndPreventTabOut)

## xcmndCallActionOn

### Parameters

| (1) Interactive Object Name                              | (2) Criteria                     |
| -------------------------------------------------------- | -------------------------------- |
| Name of slide object that holds a success/failure action | Which action you wish to trigger |

### Description
This command variable was created so that you could chain Advanced Actions, by calling one from another. [This page explains the reasons why Advanced Action chaining needs to be set up this way](../features/event-listeners.html#triggering-one-action-from-another)

::: tip Criteria types
Most interactive objects come with two criteria types:
- success
- failures

However, text entry boxes come with a third criteria:
- onfocuslost

Although not common, you can still trigger a text entry box's onfocuslost criteria like so:

```
Assign | xcmndCallActionOn with Text_Entry_Box_1, onfocuslost
```
:::


## xcmndCeil

## xcmndChangeState

### Parameters

| (1) Slide Object Name                                                           | (2) State Name                                    |
| ------------------------------------------------------------------------------- | ------------------------------------------------- |
| The slide object whose state you wish to change (@syntax and #syntax available) | The name of the state that should be made visible |

### Description

Change the state of a slide object. You will need to define the state beforehand.

If had a shape called **SmartShape_1** and you gave it a new state called **MyNewState**, you can change SmartShape_1 to MyNewState with the following:

```
Assign | xcmndChangeState with SmartShape_1, MyNewState
```

:::tip Why wouldn't I just use Captivate's change state action?
For one, xcmndChangeState can use @syntax, allowing you to change the state of multiple objects with one assignment.

Secondly, xcmndChangeState allows you to use variables to dynamically pick the object or state you wish to change. For example, you could use [xinfoEventTarget](./info.html#xinfoeventtarget) to change the state of an object you just clicked.
:::

::: tip Pssst!
Have you tried CpExtra's [Smart States](../../features/smart-states)? They're really good.
:::

### See also

-   [Smart States](../../features/smart-states)

## xcmndCompleteSlide

### Parameters

| (1) Number/Number Range/Slide Label/Slide label range |
| ----------------------------------------------------- |
| The slide or slides you wish to mark complete         |

### Description

This variable marks a slide complete. A completed slide will appear with a tick mark next to it in the table of contents. The slide will also be considered complete for the sake of SCORM completion evaluation.

If you assign a number, such as 5...

```
Assign | xcmndCompleteSlide with 5
```

The fifth slide in the project will be marked complete.

To mark the fifth and tenth slide as complete you could set another parameter like so:

```
Assign | xcmndCompleteSlide with 5, 10
```

To mark all the slides between five and ten complete you could set a number range like so:

```
Assign | xcmndCompleteSlide with 5 - 10
```

As you add and remove slides from your course however, slide numbers can change. This means you might have to edit these numbers regularly. A much more stable way of working is by assigning slide labels.

For example, if you want to mark a slide called **MenuPage** complete you'd write the following:

```
Assign | xcmndCompleteSlide with MenuPage
```

You can also define the start and end of a range of slides using slide labels.

```
Assign | xcmndCompleteSlide with MenuPage - Conclusion
```

You will find this command variable most useful on courses using branching scenarios. You can ensure that even though the learner did not visit every slide, if they completed the scenario you are able to mark all slides as visited and therefore avoid unexpected behaviours in the TOC and SCORM LMS.

::: tip The 'all' keyword
xcmndCompleteSlide recognizes a special keyword: **all**
This keyword allows you to mark all the slides in the course as complete with just one assignment.
You can use it like so:

```
Assign | xcmndCompleteSlide with all
```

:::

::: warning Warning: Slide labels including spaces
You may run into an issue when trying to complete a slide whose name has a space in it. This is because spaces are automatically removed in assignments. To keep the space you will need to surround the slide name in []. [See this page for more information](./special-behaviour.html#for-string-values)
:::

## xcmndDisable

### Parameters

| (1) Interactive Object Name                                                |
| -------------------------------------------------------------------------- |
| The interactive object you want to disable (@syntax and #syntax available) |

### Description

Interactive objects are objects that have success/failure criteria. They include:

-   Buttons
-   Shape buttons (A smart shape marked as a button)
-   Click boxes
-   Text entry boxes

Interactive objects can be disabled, which means that the ability to interact with them is disabled.

-   Disabling a button, shape button or click box will cause them to ignore any clicks.
-   Text entry boxes will not allow the learner to enter text.

Assign xcmndDisable a slide object name, a list of names, or an @syntax query to disable those objects.

### See also

-   [xcmndEnable](#xcmndEnable)

## xcmndDisableMouseEvents

### Parameters

| (1) Slide Object Name                                                                 |
| ------------------------------------------------------------------------------------- |
| The slide object you want to ignore mouse interaction (@syntax and #syntax available) |

### Description

Assigning a slide object name to xcmndDisableMouseEvents will cause that slide object to ignore all mouse interaction.

Let's say you had two slide objects, one on top of the other:

-   Button_top
-   Button_bottom

Normally, if you click Button_top, it would hear the mouse click, respond to it, and block Button_bottom from responding to it (because visually Button_top appears on top).

However, if you disabled Button_top's mouse events with:

```
Assign | xcmndDisableMouseEvents with Button_top
```

The next time you click on Button_top it will completely ignore the mouse click. Button_bottom will then respond to the click because it wasn't blocked by Button_top.

xcmndDisableMouseEvents is quite different to [xcmndDisable](#xcmndDisable). With xcmndDisable the slide objects will still hear mouse events (such as through xcmndAddEventListener), but they will not respond to them.

::: warning Regarding xcmndAddEventListener

When a slide object's mouse events have been disabled, event listeners listening for the following events will not respond:

-   mousedown
-   mouseup
-   rollover
-   rollout
-   mousemove
-   click
-   doubleclick
-   rightclick

:::

::: danger Internet Explorer incompatibility
xcmndDisableMouseEvents requires a CSS style which is part of the HTML5 standard. Internet Explorer does not implement this part of the HTML5 standard. Therefore, this command variable does not work with Internet Explorer.
:::

### See Also

-   [xcmndEnableMouseEvents](#xcmndenablemouseevents)

## xcmndEnable

### Parameters

| (1) Interactive Object Name                                               |
| ------------------------------------------------------------------------- |
| The interactive object you want to enable (@syntax and #syntax available) |

### Description

The opposite of [xcmndDisable](#xcmndDisable). It enables an interactive object after it has been disabled.

### See also

-   [xcmndDisable](#xcmndDisable)

## xcmndEnableMouseEvents

### Parameters

| (1) Slide Object Name                                                                     |
| ----------------------------------------------------------------------------------------- |
| The slide object you want to respond to mouse interaction (@syntax and #syntax available) |

### Description

If an object's mouse events have been disabled with [xcmndDisableMouseEvents](#xcmnddisablemouseevents), then this variable can reactive their mouse events.

## xcmndFloor

## xcmndFlushStorage

## xcmndHeight

## xcmndHide

### Parameters

| (1) Slide Object Name                                            |
| ---------------------------------------------------------------- |
| The slide object you want to hide. @syntax and #syntax available |

### Description

Assign the name of a slide object and that slide object will be hidden.

The slide object does not have to be on the current slide.

::: tip Hide multiple objects in one assignment
This can be done with [@syntax](../special-behaviour.html#syntax-and-syntax)

```
Assign | xcmndHide with SmartShape_@
```

Or by assigning multiple parameters. You can do as many as you want!

```
Assign | xcmndHide with SmartShape_1, SmartShape_2, SmartShape_3
```

:::

### See Also

-   [xcmndShow](#xcmndShow)

## xcmndMaxScore

## xcmndPosX

## xcmndPosY

## xcmndPreventTabOut

### Parameters

| (1) Text Entry Box Name                                             |
| -----------------------------------------------------------------   |
| The text entry box you want to evaluate when pressing the 'tab' key |

### Description

The TAB key is used in many software as an accessibility feature, allowing the user to navigate from one input field to another without using a mouse. This is true of the browser that displays the Captivate export. This feature can cause some unexpected behaviour.

For example, let's say you're building a software simulation where you are trying to simulate the above mentioned behaviour. Namely, you want the learner to:
1. Select a text entry box
2. Enter a string
3. Press TAB to move to the next box

On step 3 you may wish to evaluate the text entered in step 2 to ensure it is correct. To do so you may set up the text entry box's shortcut field to evaluate when pressing the Tab key.

SHOW IMAGE HERE

However, in practice what will happen when you test this is the TAB key will move keyboard focus to the next input element (perhaps the browser search bar) rather than triggering the text entry box's evaluation. This is a timing issue. The keyboard focus leaves the text entry box before the keyboard event is registered on the text entry box.

**xcmndPreventTabOut** fixes this issue. Just assign it the name of the text entry box like so (assuming the name of your text entry box is **MyTextEntryBox**):

```
Assign | xcmndPreventTabOut with MyTextEntryBox
```

This stops the TAB key shifting keyboard focus for this object. Therefore, the text entry box picks up that the tab key was pressed and evaluation happens as expected. Captivate will then trigger the text entry box's success or failure criteria.

::: note
Only one text entry box at a time can be enabled with xcmndPreventTabOut's special behaviour.
:::

## xcmndRandom

## xcmndRemoveEventListener

## xcmndReset

## xcmndRound

## xcmndRoundTo

## xcmndScore

## xcmndSetCursor

### Parameters

| (1) Slide Object Name                                                               | (2) CSS Mouse Cursor ID                                                                                                                    |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| The slide object you want to display a custom cursor. @syntax and #syntax available | The ID of the cursor you want to display. [Click here to see a list of valid ids](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor) |

When you move your mouse cursor around the screen you will often find it changes shape. For example, if you roll over a button it will often turn into a hand cursor. If you roll over a text field it will turn into an I-beam. This gives you hints as to how you can interact with the user interface.

xcmndSetCursor allows you to set what kind of cursor will appear when the learner rolls over a slide object. To set this correctly, you'll need to know the CSS id of the cursor you wish to display. [Click here to see a list of valid CSS cursorids.](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)

Let's say you want a hand cursor to appear when you roll over an object named SmartShape_1. You could accomplish that with the following code:

```
Assign | xcmndSetCursor with SmartShape_1, pointer
```

If you wanted the cursor to show a loading animation when you roll over SmartShape_1 you could do so with:

```
Assign | xcmndSetCursor with SmartShape_1, wait
```

If you wanted to make the cursor invisible when rolling over SmartShape_1 you could use:

```
Assign | xcmndSetCursor with SmartShape_1, none
```

::: warning
Currently browsers do not support this feature on mobile devices. The technology to change the shape of the learner's finger is still in development.
:::

## xcmndShow

### Parameters

| (1) Slide Object Name                                            |
| ---------------------------------------------------------------- |
| The slide object you want to show. @syntax and #syntax available |

Assign the name of a slide object to show that object. The usage is exactly the same as xcmndHide.

### See also

-   [xcmndHide](#xcmndHide)

## xcmndWidth
