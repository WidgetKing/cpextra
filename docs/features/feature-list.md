# Feature List

CpExtra has an extensive list of features. **Most CpExtra features are implemented into [command variables](../variables/command/), [preference variables](../variables/preference/) and [info variables](../variables/info/)** these are covered in detail in the [Variables](../variables/about) section of the help. The features discussed in this section are primarily to do with **features NOT implemented with variables**.

However, to make it easier to navigate the documentation, here are a list of all CpExtra's features and links to the related section of the documentation.

## Common
- [Go to slide](../variables/command.html#xcmndgotoslide)
- [Mark slide complete in TOC](../variables/command.html#xcmndcompleteslide)
- [Running an Advanced Action from another Advanced Action](../variables/command.html#xcmndcallactionon)
- [Run Advanced Action when project begins](../variables/preference.html#xprefinitaction)
- [Load and run JavaScript files](../variables/command.html#xcmndloadjsfromaction)
- [Load and run JavaScript files from the very start of the movie](../variables/preference.html#xprefinitloadjsfromaction)
- [Enable/disable playbar scrubbing](../variables/preference.html#xprefdisableplaybarscrubbing)
- [Prevent mobile device screen dimming](../variables/preference.html#xprefwakelock)

## Slide object parameters
- [Hiding slide objects](../variables/command.html#xcmndhide)
- [Showing slide objects](../variables/command.html#xcmndshow)
- [Change state](../variables/command.html#xcmndchangestate)
- [Automatically show state when variable has certain value](./smart-states)
- [Disable interactive objects](../variables/command.html#xcmnddisable)
- [Enable interactive objects](../variables/command.html#xcmndenable)
- [Disable mouse interaction](../variables/command.html#xcmnddisablemouseevents)
- [Enable mouse interaction](../variables/command.html#xcmndenablemouseevents)
- [Read/write X position](../variables/command.html#xcmndposx)
- [Read/write Y position](../variables/command.html#xcmndposy)
- [Read height](../variables/command.html#xcmndheight)
- [Read width](../variables/command.html#xcmndwidth)
- [Set rollover cursor](../variables/command.html#xcmndsetcursor)
- [Run action when slide object enters/exits timeline](./events-list.html#enter)

## Quiz
- [Read/write quiz object score](../variables/command.html#xcmndscore)
- [Read object maximum score](../variables/command.html#xcmndmaxscore)
- [Set multichoice question rollover color](../variables/preference.html#xprefmultichoicerollovercolor)
- [Set multichoice question rollover opacity](../variables/preference.html#xprefmultichoicerolloveropacity)

## [Events](./event-listeners)
- [Adding Events](./event-listeners.html#creating-an-event-listener)
- [Removing Events](./event-listeners.html#removing-an-event-listener)
- [List of events](./events-list)
- [Run action when audio ends](./events-list.html#audioended)
- [Run action when video ends](./events-list.html#videoended)
- [Set delay between detecting click and double-click events](../variables/preference.html#xprefdoubleclickdelay)

## Graphic Design
- [Embed fonts](../variables/command.html#xcmndembedfontfromaction)
- [Change background color of web page](../variables/preference.html#xprefdocumentbackgroundcolor)
- [When device orientation changes, fade transition into new orientation](../variables/preference.html#xpreforientationchangetransition)

## User Variable Related
- [Reset variable to original value](../variables/command.html#xcmndreset)
- [Ensure Text Entry Box value not reset when entering slide](../variables/preference.html#xprefpreventteboverwrite)
- [Text Entry Box updates when linked variable changes](../variables/preference.html#xpreftebupdatefromvariable)

## Math
- [Round to nearest whole number](../variables/command.html#xcmndround)
- [Round to decimal point](../variables/command.html#xcmndroundto)
- [Round up](../variables/command.html#xcmndceil)
- [Round down](../variables/command.html#xcmndfloor)
- [Generate random number](../variables/command.html#xcmndrandom)

## Data persistence
- [Local storage](./variable-prefixes.html#ls-for-local-storage)
- [Session storage](./variable-prefixes.html#ss-for-session-storage)
- [Get variables](./variable-prefixes.html#get-for-get-variables)
- [Clear storage](../variables/command.html#xcmndflushstorage)

## Accessibility
- [Allow Text Entry Boxes to evaluate on press of TAB](../variables/command.html#xcmndpreventtabout)
- [Turn off Captivate mobile navigation gestures](../variables/preference.html#xprefdisablegestures)
- [Ensure web objects can hear mouse events](../variables/preference.html#xprefinteractivewebobjects)

## Debugging
- [Display alert messages](../variables/command.html#xcmndalert)
- [Debug Mode](../variables/preference.html#xprefdebugmode)
- [Set first slide of course](../variables/preference.html#xprefstartslide)
- [Read CpExtra Version](../variables/info.html#xinfoversion)
- [Read CpExtra Build](../variables/info.html#xinfobuild)

## Custom Playbar
- [Display total hours](../variables/info.html#xinfoprojecttotalhours)
- [Display total minutes](../variables/info.html#xinfoprojecttotalminutes)
- [Display total seconds](../variables/info.html#xinfoprojecttotalsedseconds)
- [Display elapsed hours](../variables/info.html#xinfoprojectelapsedhours)
- [Display elapsed minutes](../variables/info.html#xinfoprojectelapsedminutes)
- [Display elapsed seconds](../variables/info.html#xinfoprojectelapsedseconds)
- [Display 0 in front when playbar displays single digits](../variables/preference.html#xprefusedoubledigitelapsedtimevalues)

## CpMate
- [Pause Captivate playback to allow CpMate animations to play](../variables/preference.html#xprefensurecpmateload)
