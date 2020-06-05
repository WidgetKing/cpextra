# Preference Variables

Below is a list of all preference variables offered by CpExtra in alphabetical order.

## xprefDebugMode

### Parameters

| (1) Boolean (default: true)          |
| ------------------------------------ |
| Whether debug messages are on or off |

### Description

Whenever we use CpExtra there is always the potential for errors. For example, we might misspell the name of the slide object we wanted to hide, or put a number where we were supposed to put a variable. When CpExtra detects one of these mistakes it sends an alert message.

IMAGE HERE

These messages can prove very useful while building your course and its interactions. However, you likely do not want them appearing when the learner views the course.

You can turn all debugging messages off by assigning this variable to: false

```
Assign | xprefDebugMode with false
```

## xprefDisablePlaybarScrubbing

### Parameters

| (1) Boolean (default: false)                                         |
| -------------------------------------------------------------------- |
| True to disable playbar scrubbing, false to enable playbar scrubbing |

### Description

By clicking different points along the Captivate playbar you will be jumped to different parts of the movie. This presents a problem in courses with branching scenarios as the learner could easily use the playbar to navigate to slides they were not meant to view.

If you want to disable the ability to scrub the playbar, set this variable to: **true**.

::: Tip Note
Scrubbing is disabled by default on mobile devices. This is standard Captivate behaviour. Setting this variable to **false** will not allow you to scrub on a mobile device.
:::

::: Danger Feature not available in Internet Explorer
Internet Explorer does not support the **mouse-events: none** CSS style on which this feature depends. We do not currently have a work around to get this working in Internet Explorer.
:::

## xprefDoubleClickDelay

### Parameters

| (1) Number (default: 0.5)                                                                            |
| ---------------------------------------------------------------------------------------------------- |
| Number of seconds CpExtra should wait to determine if a click event is actually a double-click event |

### Description

[As explained here](../features/events-list.html#click) if a click event and a double-click event are added to the same object, CpExtra must wait a few milliseconds to determine whether a click or double-click event occured. By default it will wait half a second. If your target audience is not very technology literate, then they might not complete a double click in 0.5 seconds. You can increase (or decrease) the time allowed for a double-click by changing this preference variable. For example, to change the delay to three quarters of a second you would write:

```
Assign | xprefDoubleClickDelay with 0.75
```

## xprefInitAction

### Parameters

| (1) Interactive Object                                   | (2) Criteria (default: success)  |
| ---------------------------------------                  | -----------------------------    |
| Name of slide object that holds a success/failure action | Which action you wish to trigger |

### Description
Runs an action at the start of the movie, no matter what slide it starts on.

To make this work, create a button (or shape button or click box or any other interactive object) and configure its success or failure action to be the action you wish to run.

Then in the Project > Variables dialog, change **xprefInitAction**'s initial value to point to that object and action. For example, if the action is associated to **Button_1**'s success action then you'd write:

```
Button_1, success
```

This essentially a one shot **xcmndCallActionOn** that runs right at the start of the movie. This is better than putting an advanced action at the start of the movie because an LMS or self-paced-learning may cause the movie to start mid-way into the movie.

::: warning
If you are finding this variable is not working when using Captivate's Preview Next 3 Slides or Preview From this Slide features, it is probably because the slides you are previewing do not include the Interactive Object that holds the action.
If CpExtra can't find it, it can't run it.
:::

### See Also
- [xcmndCallActionOn](./command.html#xcmndcallactionon)

## xprefMultichoiceRolloverColor

### Parameters

| (1) Hexadecimal colour                                                                                      |
| ------------------------------------                                                                        |
| The hexadecimal code of the colour you wish to appear when rolling over a multiple-choice question's answer |

### Description
When you roll over any answer in a **Multiple Choice** or **True / False** question type, you will see the answer's background change to a gray colour.

IMAGE HERE

Assigning **xprefMultichoiceRolloverColor** a hexadecimal colour will change the colour of this highlight.

For example, to change the highlight's colour to a green, you would assign the following:

```
#00FF00
```

IMAGE HERE

Ensure the colour code starts with a #.

### See Also
- xprefMultichoiceRolloverOpacity[#xprefmultichoicerolloveropacity]

## xprefMultichoiceRolloverOpacity

### Parameters

| (1) Number                                                                                               |
| ------------------------------------                                                                     |
| The percentage opacity of the background displayed when rolling over a multiple-choice question's answer |

### Description
When you roll over any answer in a **Multiple Choice** or **True / False** question type, you will see the answer's background highlight appear. By default this will be a solid gray colour.

To give this background transparency, assign xprefMultichoiceRolloverOpacity with a number between 0 and 100. 100 would be 100% opaque and 0 would be completely transparent.

### See Also
- xprefMultichoiceRolloverColor[#xprefmultichoicerollovercolor]

## xprefPreventTEBOverwrite

### Parameters

| (1) Boolean (default: false)                                                        |
| ------------------------------------                                                |
| Whether text entry boxes will always display the value of their associated variable |
| (1) Boolean (default: false)                                                        |
| ------------------------------------                                                |
| Whether text entry boxes will always display the value of their associated variable |

### Description
All text entry boxes (or TEBs) have a **linked variable**, which can be found here:

IMAGE HERE

Any text the learner types into the TEB will be saved in that variable.

However, TEBs also have **default text**, which is entered here:

IMAGE HERE

If you entered text into a TEB, then moved to another slide, then back to the slide with the TEB, what text would you expect to appear? The **linked variable text** or the **default text**.

Captivate's default behaviour is to show the **default text**, which is not always what developers or learners expect to happen. If you had an interaction using TEBs where you wrote out a lot of information in a form, after exiting that slide and returning many learners would be frustrated to find all the information they had painstakingly written out had been erased.

Fortunately, by setting xprefPreventTEBOverwrite to true, TEBs will always show their linked variable value instead of the default text.

### See Also
- [xprefTEBUpdateFromVariable](xpreftebupdatefromvariable)

## xprefTEBUpdateFromVariable

### Parameters

| (1) Boolean (default: false)                                                                  |
| ------------------------------------                                                          |
| Whether text entry boxes will automatically display the latest value of their linked variable |

### Description
Text entry boxes (or TEBs) all have a linked variable.

IMAGE HERE

Enter text into the TEB and the variable will update. However, this does not work both ways. By default, if you change the value of the linked variable the TEB's text will not update to show that change.

Setting xprefTEBUpdateFromVariable to true will ensure all TEBs update to display the current value of their linked variable.

### See Also
- [xprefPreventTEBOverwrite](#xprefpreventteboverwrite)

## xprefUseDoubleDigitElapsedTimeValues

### Parameters

| (1) String (default: none)                                                                                    |
| ------------------------------------                                                                          |
| Which increments of time **(hours, minutes, seconds)** should total time info variables display double digits |

### Description
xprefUseDoubleDigitTotalTimeValues has a special relationship with the following info variables:
- [xinfoProjectTotalSeconds](./info.html#xinfoprojecttotalseconds)
- [xinfoProjectTotalMinutes](./info.html#xinfoprojecttotalminutes)
- [xinfoProjectTotalHours](./info.html#xinfoprojecttotalhours)

These variables are typically used to create custom playbars.

Each variable will display a number between 0 and 59. When the time is between 0-9 the variable will display one digit. When it is between 10-59 the variable displays two digits. This might cause the playbar clock to continually change size, which may be distracting.

The way to get around this is to have digits 0-9 show a '0' in front of their values (like: 00, 01, 02, 03, ...). You may wish this to happen when displaying seconds but not for minutes. xprefUseDoubleDigitTotalTimeValues gives you this flexibility.

The default is: None. Which looks like so:

IMAGE HERE

To make double digits appear for the minutes and seconds value you'd assign: 

```
Assign |xprefUseDoubleDigitTotalTimeValues with Minutes, Seconds
```

IMAGE HERE

The three valid values are:
- Hours
- Minutes
- Seconds

### See Also
- [xprefUseDoubleDigitElapsedTimeValues](#xprefusedoubledigitelapsedtimevalues)
- [xinfoProjectTotalSeconds](./info.html#xinfoprojecttotalseconds)
- [xinfoProjectTotalMinutes](./info.html#xinfoprojecttotalminutes)
- [xinfoProjectTotalHours](./info.html#xinfoprojecttotalhours)

## xprefUseDoubleDigitTotalTimeValues

| (1) String (default: none)                                                                                      |
| ------------------------------------                                                                            |
| Which increments of time **(hours, minutes, seconds)** should elapsed time info variables display double digits |

### Description
xprefUseDoubleDigitElapsedTimeValues has a special relationship with the following info variables:
- [xinfoProjectElapsedSeconds](./info.html#xinfoprojectelapsedseconds)
- [xinfoProjectElapsedMinutes](./info.html#xinfoprojectelapsedminutes)
- [xinfoProjectElapsedHours](./info.html#xinfoprojectelapsedhours)

These variables are typically used to create custom playbars.

Each variable will display a number between 0 and 59. When the time is between 0-9 the variable will display one digit. When it is between 10-59 the variable displays two digits. This might cause the playbar clock to continually change size, which may be distracting.

The way to get around this is to have digits 0-9 show a '0' in front of their values (like: 00, 01, 02, 03, ...). You may wish this to happen when displaying seconds but not for minutes. xprefUseDoubleDigitElapsedTimeValues gives you this flexibility.

The default is: None. Which looks like so:

IMAGE HERE

To make double digits appear for the minutes and seconds value you'd assign: 

```
Assign |xprefUseDoubleDigitElapsedTimeValues with Minutes, Seconds
```

IMAGE HERE

The three valid values are:
- Hours
- Minutes
- Seconds

### See Also
- [xprefUseDoubleDigitTotalTimeValues](#xprefusedoubledigittotaltimevalues)
- [xinfoProjectElapsedSeconds](./info.html#xinfoprojectelapsedseconds)
- [xinfoProjectElapsedMinutes](./info.html#xinfoprojectelapsedminutes)
- [xinfoProjectElapsedHours](./info.html#xinfoprojectelapsedhours)
