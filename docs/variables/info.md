# Info Variables

Below is an alphabetical list of all CpExtra [info variables](./about.html#info-variables).

## xinfoBuild

Each CpExtra version has a unique build number which is independent of the major or minor (dot.point) version number. If you ever need to report an issue for Infosemantics to debug, we may need to ask what Captivate build you are using. The build number can be found by defining this variable and displaying it in a caption.

### See Also

-   [xinfoVersion](#xinfoversion)

## xinfoEventTarget

This variable displays the name of the last slide object to dispatch a run-time event. To understand this variable, you must first understand what event listeners are and how they work. [Click here to learn more about event listeners.](../features/event-listeners)

### Use cases
Let's say you added an event listener to a group of objects using **@syntax** to select object names.

```
Assign | xcmndAddEventListener with SmartShape_@, click, action
```

The above code will run whatever action is triggered by a click event on all objects whose name begins with **SmartShape\_**.

However, suppose we wanted to hide the object that was just clicked. How would we determine which object to hide? **xinfoEventTarget** can automatically supply this data.  All we have to do is run the following code right after the above-mentioned event handler:

```
Assign | xcmndHide with xinfoEventTarget
```

::: note
xinfoEventTarget only updates to reflect what objects triggered xcmndAddEventListener actions. So, for example, if in Captivate's properties panel you configure a button's **success action** to run an Advanced Action, upon clicking that button xinfoEventTarget **will not** update. Instead, use xcmndAddEventListener to listen for a click event on that button.
:::

### Video

<iframe width="560" height="315" src="https://www.youtube.com/embed/BizZLF5-lQ0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### See Also

-   [xcmndAddEventListener](./command.html#xcmndaddeventlistener)

## xinfoProjectElapsedHours
Displays how many hours of course content the learner has already viewed. This variable is useful for displaying time-based information on screen or in a custom playbar.

### See Also

-   [xprefUseDoubleDigitElapsedTimeValues](./info.html#xprefusedoubledigitelapsedtimevalues)

## xinfoProjectElapsedMinutes

Displays how many minutes of the current hour of course content the learner has already viewed. This variable is useful for displaying time-based information on screen or in a custom playbar.

### See Also

-   [xprefUseDoubleDigitElapsedTimeValues](./info.html#xprefusedoubledigitelapsedtimevalues)

## xinfoProjectElapsedSeconds

Displays how many seconds of the current minute of course content the learner has already viewed. This variable is useful for displaying time-based information on screen or in a custom playbar.

### See Also

-   [xprefUseDoubleDigitElapsedTimeValues](./info.html#xprefusedoubledigitelapsedtimevalues)

## xinfoProjectTotalHours

Displays the total number of hours of content in a course module. This variable is useful for displaying time-based information on screen or in a custom playbar.

### See Also

-   [xprefUseDoubleDigitTotalTimeValues](./info.html#xprefusedoubledigitTotaltimevalues)

## xinfoProjectTotalMinutes

Displays the total number of minutes of content in a course module (values above 59 will wrap back around to 0). This variable is useful for displaying time-based information on screen or in a custom playbar.

### See Also

-   [xprefUseDoubleDigitTotalTimeValues](./info.html#xprefusedoubledigitTotaltimevalues)

## xinfoProjectTotalSeconds

Displays the number of seconds of content contained in the course (values above 59 will wrap back around to 0). This variable is useful for displaying time-based information on screen or in a custom playbar.

### See Also

-   [xprefUseDoubleDigitTotalTimeValues](./info.html#xprefusedoubledigitTotaltimevalues)

## xinfoVersion

Displays the version number of the CpExtra library currently published with the output playing in the web browser. (CpExtra is continually being updated and versions can change several times within a short period during rapid development cycles.) Each public release will be under a new version number. If you want to check if your CpExtra is the current version, you can display this variable in a caption, and then check the [changelog](../getting-started/changelog.html) to see if a newer version is available for download.

If there is a new version, you can log back in to [www.infosemantics.com.au](http://www.infosemantics.com.au) and download it from your account page.

### See Also
- [xinfoBuild](#xinfobuild)
