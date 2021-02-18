# Changelog
## Version 1.5.2
### Released 11 February 2021
- Command Variables
    - xcmndEmbedFontFromAction - Embeds a font file. Similiar to xcmndLoadJSFromAction.
- Preference Variables
	- xprefOrientationChangeTransition - When a screen orientation occurs, smoothly transition from one state to the other
	- xprefDocumentBackgroundColor - Change the color of the HTML document background
	
## Version 1.5.1
### Released 1 December 2020
- Command Variables
	- xcmndLoadJSFromAction - Assign an interactive object. If any of its criteria uses a Open URL or File action to load a .js file, CpExtra will run that Javascript file in Captivate.

## Version 1.5.0
### Released November 2020
- Compatibility with CpMate
- Command Variables
	- xcmndGotoSlide (Number or slide label) - Like cpCmndGotoSlide, but it works with slide labels as well.
	- xcmndAddEventListener - New events for Web Objects
		- loaded - Dispatches when the Web Object has loaded all its assets
		- error - Dispatches when a Web Object fails to load
- Preference Variables
	- xprefStartSlide (Number or slide label) Assign a slide label (or slide number). When the movie is run, CpExtra will jump to that slide immediately. Can assign @syntax query. CpExtra will jump to the first slide matching that query. Runs after xprefInitAction.
	- xprefInteractiveWebObjects (Boolean) - Allows Web Objects to hear click events. If you have another object overlapping the iFrame's space, that area of the Web Object will not be able to hear click events. Enabled by default.
	- xprefWakeLock (Boolean) - Prevents mobile screens from dimming and turning off.
	- xprefDisableGestures (Boolean) - Turns off Captivate's mobile gestures, such as swiping to move one slide forwards and backwards.
	- xprefEnsureCpMateLoad (@syntax query) - All Web Objects with names matching the @syntax query will be assumed to include CpMate. When one such Web Object appears on stage, CpExtra will pause the slide until Adobe Animate is ready to play the animation.
		 
## Version 1.4.3
### Released 32 October 2019
- Bug fixes
    - Fixed issue with videoended event.
## Version 1.4.2 
### Released 14 January 2019
- Bug fixes
    - Fixed issue where Edge and Internet Explorer would freeze when entering slides with rarely occurring object types (such as knowledge check slides).
    - Fixed issue where xprefDisablePlaybarScrubbing would not work in projects where the play icon had to be clicked first.
    - Fixed various issues with tab recognition.
## Version 1.4.1 
### Released 23 March 2018
- Critical bug fix which stops many crashes.
## Version 1.4 
### Released 11 September 2017
- Info Variables (Intended to be used to create custom playbars)
    - xinfoProjectElapsedSeconds
    - xinfoProjectElapsedMinutes
    - xinfoProjectElapsedHours
    - xinfoProjectTotalSeconds
    - xinfoProjectTotalMinutes
    - xinfoProjectTotalHours
- Preference Variables
    - xprefInitAction - Designate an action to be run when the movie starts (even if you do not start from the first slide in the project)
    - xprefUseDoubleDigitTotalTimeValues - Configures xinfoProjectTotalSeconds, xinfoProjectTotalMinutes and xinfoProjectTotalHours
    - xprefUseDoubleDigitElapsedTimeValues - Configures xinfoProjectElapsedSeconds, xinfoProjectElapsedMinutes and xinfoProjectElapsedHours
- Command Variables
    - xcmndAlert - Opens up a message in an alert window (Use of $$variable$$ in the first and second parameters are replaced with those variable's values)
    - xcmndRound - Rounds a decimal to its nearest whole number 
    - xcmndRoundTo - Rounds a decimal to a particular decimal point
    - xcmndFloor - Rounds a decimal number DOWN
    - xcmndCeil - Rounds a decimal number UP
    - xcmndRandom - Generates a random number
    - xcmndPreventTabOut - Targets a text entry box, when that text box has keyboard focus, the TAB key will not move its focus away (Allows you to use the TAB key to trigger text entry box evaluation)
    - xcmndAllowTabOut - Cancels xcmndPreventTabOut
    - xcmndScore - Get/Set the score of a slide object which reports to the quiz.
    - xcmndMaxScore - Get/Set the maximum score of a slide object which reports to the quiz. 
- Other
    - Can explicitly state a parameter as a...
        - ...String: By surrounding it with [square braces] Example: [Slide Label With Spaces]
        - ...Variable: By surrounding it with double $$dollar$$ signs. Example: $$MyVariable$$

<iframe width="560" height="315" src="https://www.youtube.com/embed/dp1yPv--0fc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Version 1.3.2 
### Released 27 June 2016
- Bug fixes
    - Fixed audioended event not firing when the movie is playing
    - Fixed headless loading not working in a SCORM project
    - Fixed enhanced object states not working on first slide when using headless loading
    - Fixed xcmndPosX and xcmndPoxY working unpredictably with shapes
## Version 1.3 
### Released 29 May 2016
- CpExtra can be installed into your Captivate program files so it is included in every project (Headless loading)
- Added #syntax, new version of @syntax which applies across the whole project.
- xcmndAddEventListener can now listen for...
    - Enter - Triggered when the target slide object enters the timeline
    - Exit - Triggered when the target slide object exits the timeline
- Added xinfoEventTarget - A variable which tells us what slide object dispatched the current event.
- When using the Open URL or file action in Captivate, if you surround a variable name with two $ characters (example: $$MyVar$$) CpExtra will replace that phrase with the value of the the variable.
- The following command variables now allow you to assign them variable names. They will act on the variable's value
    - xcmndShow
    - xcmndHide
    - xcmndEnable
    - xcmndDisable
    - xcmndChangeState (First parameter only) 
- Bug Fixes
    - Drag and drop objects no longer stop working after being dragged to an incorrect target
    - Fixed issue of xprefPreventTEBOverwrite not working when xprefTEBUpdateFromVariable was enabled.
    - Fixes issue with click boxes not working with xcmndSetCursor
    - Fixed the ROLLOUT event not dispatching on shape buttons
    - Fixed the ROLLOUT event not dispatching on buttons
    - The following command variables will now throw a CV001 error if you assign them incorrect slide object names
        - xcmndShow
        - xcmndHide
        - xcmndEnable
        - xcmndDisable
        - xcmndChangeState
## Version 1.2 
### Released 23 February 2016
- xcmndCompleteSlide - Replicates functionality previously only available with SWF widgets.
- xprefMultichoiceRolloverColor - Changes color of rollover highlight shown on Multichoice or True / False questions
- xprefMultichoiceRolloverOpacity - Changes transparency of rollover highlight shown on Multichoice or True / False questions
- New events for xcmndAddEventListener
    - audioended
    - videoended
- CpExtra object states can now appear when...
    - A variable is greater than a value
    - A variable is lesser than a value
    - A variable is greater than or equal to a value
    - A variable is lesser than or equal to a value
    - A variable does not equal a value
- Various bug fixes
## Version 1.0 
### Released 2 February 2016
- Initial release version
