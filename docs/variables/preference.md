# Preference Variables

Below is a list of all preference variables offered by CpExtra in alphabetical order.

## xprefDebugMode

### Parameters

| Expected Value | Default Value |
| -------------- | ------------- |
| Boolean        | True          |

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

| Expected Value | Default Value |
| -------------- | ------------- |
| Boolean        | False         |

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

| Expected Value                | Default Value |
| --------------                | ------------- |
| Number (representing seconds) | 0.5           |

### Description
[As explained here](../features/events-list.html#click) if a click event and a double-click event are added to the same object, CpExtra must wait a few milliseconds to determine whether a click or double-click event occured. By default it will wait half a second. If your target audience is not very technology literate, then they might not complete a double click in 0.5 seconds. You can increase (or decrease) the time allowed for a double-click by changing this preference variable. For example, to change the delay to three quarters of a second you would write:

```
Assign | xprefDoubleClickDelay with 0.75
```

## xprefInitAction

### Parameters

| Expected Value | Default Value |
| -------------- | ------------- |
| Boolean        | False         |

### Description

## xprefMultichoiceRolloverColor

### Parameters

| Expected Value | Default Value |
| -------------- | ------------- |
| Boolean        | False         |

### Description

## xprefMultichoiceRolloverOpacity

### Parameters

| Expected Value | Default Value |
| -------------- | ------------- |
| Boolean        | False         |

### Description

## xprefPreventTEBOverwrite

### Parameters

| Expected Value | Default Value |
| -------------- | ------------- |
| Boolean        | False         |

### Description

## xprefTEBUpdateFromVariable

### Parameters

| Expected Value | Default Value |
| -------------- | ------------- |
| Boolean        | False         |

### Description

## xprefUseDoubleDigitElapsedTimeValues

### Parameters

| Expected Value | Default Value |
| -------------- | ------------- |
| Boolean        | False         |

### Description

## xprefUseDoubleDigitTotalTimeValues

### Parameters

| Expected Value | Default Value |
| -------------- | ------------- |
| Boolean        | False         |

### Description
