# Command Variables
This is the command variables readme.

## xcmndAddEventListener

### Parameters
| (1) Slide Object Name  | (2) Event  | (3) Interactive Object Name | (4) Criteria (default: success)  |
| --          | --- |-------------------------------------------------------- | ----------------------------- |  
| Name of slide object that you want to listen to an event on | Name of event that you want to listen for. | Name of slide object that holds a success/failure action | Which action you wish to trigger | 
::: tip
xcmndAddEventListener and #syntax are a very powerful combination which essentially allows you to create a new subset of slide object with its own special behaviour.
:::

## xcmndAlert
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
| --------------------------------------                           |
| The slide object you want to hide. @syntax and #syntax available |

### Description
Assign the name of a slide object and that slide object will be hidden.

The slide object does not have to be on the current slide.

::: tip Hide multiple objects in one assignment
This can be done with @syntax

```
Assign xcmndHide with SmartShape_@
```

Or by assigning multiple parameters. You can do as many as you want!

```
Assign xcmndHide with SmartShape_1, SmartShape_2, SmartShape_3
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
