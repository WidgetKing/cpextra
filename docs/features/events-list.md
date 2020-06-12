# Event List
Below is a list of all the events you can listen for using **xcmndAddEventListener**. To learn more about event listening, please view the previous help page.

These events would be passed in as the second parameter for either **xcmndAddEventListener** or **xcmndRemoveEventListener's**. For example, if you're using the **videoended** event, you'd pass it in like so:

```
Assign | xcmndAddEventListener with Video_1, videoended, Button_1, success
```

::: tip Regarding mobile device events
If you're coming from a JavaScript background, you probably know that if you are listening for a *mousedown* on a computer you would listen for a *touchstart* for a mobile device. This is a common gotcha for those who are not in the know. So CpExtra will first detect whether the learner is watching on a personal computer or a mobile device and then choose the correct event behind the scenes.

Therefore, CpExtra's **mousedown event is the same as a touchstart event**. The same goes for other events which have mobile equivalents such as: mouseup and mousemove.
:::

## mousedown
Triggered when the learner pushes the mouse down (on a normal computer) or places their finger on the object (if using a touch screen device).

::: tip
The 'click' event is similiar to the mouse down event, but is more popular because it also ensures the learner releases the mouse on the same object.
:::


## mouseup
Triggered when the learner releases the mouse or lifts their finger from an object.

::: tip Note
Someone could mouse down OUTSIDE an object and while holding their mouse down move it over the object you're listening to and then release their mouse, thereby triggering a mouseup event. Often, this is not the interaction you are expecting. What you probably expect is for mouseup to only trigger if the learner first did a mousedown on the same object. To detect this, what you'd do is first listen for the mousedown event. Then when mousedown is triggered, add your mouseup listener.

For this to work, remember to *stop* listening for mouseup in the mouseup event handler.
:::

## rollover
Triggered when the learner's mouse slides into an object's space or hit area.

::: warning
On mobile devices the rollover event is usually not incorporated. That's because in the real world people don't drag their finger over the screen to get to a button. They tap a location on screen and immediately move their finger off.

With the advent of the **iPad Pro Magic Keyboard** however, we may start to see more support for rollover on mobile devices in the future.
:::

## rollout
Triggered when the learner's mouse slides out of an object's space or hit area.

::: warning
Like with rollover, this event is not generally supported on mobile devices.
:::

## mousemove
Triggered when the learner's mouse or finger moves over an object. 

This event differs to a **rollover** in that once a rollover event has fired, it will wait for the learner to move their mouse outside of the shape before another rollover event can happen.

By contrast, the mousemove event triggers every time the mouse changes locations while staying within the bounds of the object. This could happen multiple times a second.

Why is this useful? Take drag and drop events as an example. You need to know whenever the mouse changes location so that the object you're draging can update its location in response.

## click
Triggered when the mouse (or finger) presses down and releases on the same object. 

::: tip Special relationship with the doubleclick event
Often, clicking or double-clicking the same part of a user interface causes a different action to occur. If you are listening to a click AND a doubleclick event on the same object, how can CpExtra tell which event has happened? Functionally a doubleclick is the same as *two* click events.

In this case, when CpExtra detects a single click, it won't immediately trigger the click event. Instead, it will wait to see if another click happens. If it does, then the doubleclick event is triggered rather than the click event. If the time elapses and no second click happens, a click event is dispatched.

How long will CpExtra wait to see if a doubleclick happens? That can be configured by you with the [xprefDoubleClickDelay](../../variables/preference.html#xprefdoubleclickdelay) preference variable. By default, it's 400 miliseconds.
:::


## double click
Triggered when the mouse (or finger) presses down and releases on the same object in a short amount of time.

## rightclick
Triggered when the right mouse button presses down and releases on the same object.

::: warning
This is another event which has no mobile equivalent.
:::

## enter
Triggered when an object enters the Captivate timeline.

<img :src="$withBase('/img/event-enter.png')" alt="when an object appears on the timeline the enter event is triggered">

### Video
<iframe width="560" height="315" src="https://www.youtube.com/embed/U8z4mSTkMX4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## exit
Triggered when an object exits the Captivate timeline.

<img :src="$withBase('/img/event-exit.png')" alt="when an object no longer appears on the timeline the exit event is triggered">

::: tip
Pairing the enter, exit and xcmndAddEventListener features can allow you to make set special behaviours which only occur during the time an object appears on the timeline.
:::

## videoended
Triggered when a video object has finished playing.

## audioended
Triggered when a sound attached to a slide object finishes playing.
<img :src="$withBase('/img/add-audio.png')" alt="Adding audio to a slide object">

::: warning
The audioended event only works for audio added to slide objects. It is currently not able to detect when slide audio finshes or when audio triggered by an action finishes.
:::


