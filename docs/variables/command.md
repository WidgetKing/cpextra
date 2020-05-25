# Command Variables

Below is a list of all the command variables offered by CpExtra in alphabetical order.

## xcmndAddEventListener

### Parameters

| (1) Slide Object Name                                       | (2) Event                                                                | (3) Interactive Object Name                              | (4) Criteria (default: success)  |
| ----------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------- | -------------------------------- |
| Name of slide object that you want to listen to an event on | Name of [event](../../features/events-list) that you want to listen for. | Name of slide object that holds a success/failure action | Which action you wish to trigger |

### Description

Adds and event listener to a slide object.

- [See this page to learn more about event listeners](../../features/event-listeners)
- [This page contains the list of available events](../../features/events-list)

::: tip
xcmndAddEventListener and #syntax are a very powerful combination which essentially allows you to create a new subset of slide object with its own special behaviour.
:::

### See Also

- [xcmndRemoveEventListener](#xcmndremoveeventlistener)

## xcmndAlert

### Parameters

| (1) String                 | (2) String    | (3) Interactive Object Name                              | (4) Criteria (default: success)                                    |
| -------------------------- | ------------- | -------------------------------------------------------- | ------------------------------------------------------------------ |
| Content of alert's message | Alert's title | Name of slide object that holds a success/failure action | Which action you wish to trigger when the alert's Ok button is hit |

### Description
Causes an alert box to appear.

<img :src="$withBase('/img/alert-hello-world.png')" alt="The default Captivate alert box">

The first parameter defines the message that appears in the main section of the alert.

For example, the following code...

```
Assign | xcmndAlert with This is my message
```

...will generate this alert:

<img :src="$withBase('/img/alert-no-spaces.png')" alt="Alert displaying: thisismymessage">

Notices how the spaces have been removed? This is because CpExtra removes all white space characters when assignments are made to command variables.

To get around this you can [use square brackets to designate a string.](./special-behaviour.html#for-string-values)

## xcmndAllowTabOut

## xcmndCallActionOn

## xcmndCeil

## xcmndChangeState

## xcmndCompleteSlide

::: warning
You may run into an issue when trying to complete a slide whose name has a space in it. This is because spaces are automatically removed in assignments. To keep the space you will need to surround the slide name in []. [See this page for more information](./special-behaviour.html#for-string-values)
:::

## xcmndDisable

## xcmndDisableMouseEvents

## xcmndEnable

## xcmndEnableMouseEvents

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
This can be done with @syntax

```
Assign | xcmndHide with SmartShape_@
```

Or by assigning multiple parameters. You can do as many as you want!

```
Assign | xcmndHide with SmartShape_1, SmartShape_2, SmartShape_3
```

:::

### See Also

- [xcmndShow](#xcmndShow)

## xcmndMaxScore

## xcmndPosX

## xcmndPosY

## xcmndPreventTabOut

## xcmndRandom

## xcmndRemoveEventListener

## xcmndReset

## xcmndRound

## xcmndRoundTo

## xcmndScore

## xcmndSetCursor

## xcmndShow

## xcmndWidth
