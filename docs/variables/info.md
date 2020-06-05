# Info Variables

Below is a list of all [info variables](./about.html#info-variables) offered by CpExtra in alphabetical order.

## xinfoBuild

Each CpExtra version has a unique build number which is independent to the version number. When reporting an issue for Infosemantics to debug, we may ask what build you are using. The build number can be found by defining this variable and displaying it in a caption.

### See Also

-   [xinfoVersion](#xinfoversion)

## xinfoEventTarget

Displays the name of the last object to dispatch an event. To understand this variable, you must first understand event listeners. [Click here to learn more about event listeners.](../features/event-listeners)

Let's say you added an event listener to a group of objects using @syntax.

```
Assign | xcmndAddEventListener with SmartShape_@, click, action
```

With the above code, we will run an action whenever we click on an object who's name starts with 'SmartShape\_'.

Suppose when we want to hide the object we just clicked. How do we know which object that is? **xinfoEventTarget** will tell us.

All we have to do is run the following code in the event handler:

```
Assign | xcmndHide with xinfoEventTarget
```

### See Also

-   [xcmndAddEventListener](./command.html#xcmndaddeventlistener)

## xinfoProjectElapsedHours
Displays how many hours of course content the learner has already viewed. This variable is useful for creating your own playbar.

### See Also

-   [xprefUseDoubleDigitElapsedTimeValues](./info.html#xprefusedoubledigitelapsedtimevalues)

## xinfoProjectElapsedMinutes

Displays how many minutes of the current hour of course content the learner has already viewed. This variable is useful for creating your own playbar.

### See Also

-   [xprefUseDoubleDigitElapsedTimeValues](./info.html#xprefusedoubledigitelapsedtimevalues)

## xinfoProjectElapsedSeconds

Displays how many seconds of the current minute of course content the learner has already viewed. This variable is useful for creating your own playbar.

### See Also

-   [xprefUseDoubleDigitElapsedTimeValues](./info.html#xprefusedoubledigitelapsedtimevalues)

## xinfoProjectTotalHours

Displays in total how many hours of content is contained in the course. This variable is useful for creating your own playbar.

### See Also

-   [xprefUseDoubleDigitTotalTimeValues](./info.html#xprefusedoubledigitTotaltimevalues)

## xinfoProjectTotalMinutes

Displays in total how many minutes (values above 59 will wrap back around to 0) of content is contained in the course. This variable is useful for creating your own playbar.

### See Also

-   [xprefUseDoubleDigitTotalTimeValues](./info.html#xprefusedoubledigitTotaltimevalues)

## xinfoProjectTotalSeconds

Displays in total how many seconds (values above 59 will wrap back around to 0) of content is contained in the course. This variable is useful for creating your own playbar.
### See Also

-   [xprefUseDoubleDigitTotalTimeValues](./info.html#xprefusedoubledigitTotaltimevalues)

## xinfoVersion

CpExtra is continually being updated. Each public release will be under a new version number. If you want to check if your CpExtra is the current version, you can display this variable in a caption, and then check the [changelog](../getting-started/changelog.html) to see if a newer version is available.

If there is a new version, you can log back in to [www.infosemantics.com.au](http://www.infosemantics.com.au) and download it from your account page.

### See Also
- [xinfoBuild](#xinfobuild)
