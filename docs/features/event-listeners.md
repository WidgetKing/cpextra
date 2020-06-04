# Event Listeners
Event listeners are powerful tools provided by CpExtra because they extend Captivate's range of run-time events, thus making it possible for e-learning developers to create interactions that were previously impossible with default Captivate functionality. 

Event listeners are enabled through the following command variables:

- [xcmndAddEventListener](../../variables/command.html#xcmndaddeventlistener)
- [xcmndRemoveEventListener](../../variables/command.html#xcmndremoveeventlistener)

These two command variables are the powerhouse of many custom-built interactions.

## What do event listeners do?
When a run-time event occurs they trigger an action. Let's break that down:

One of the limiting factors of Captivate's default actions is the small number of circumstances you can use to trigger actions. Out of the box you can only run an action when:

- Entering a slide
- Exiting a slide
- Clicking a button
- Clicking outside a button (if the button's failure action is enabled)
- Validating a Text Entry Box
- Losing focus on a Text Entry Box
- Successfully answering a quiz question
- Unsuccessfully answering a quiz question and reaching the maximum allowed number of retries
- Successfully passing the quiz
- Failing the quiz
(There are a few other events you can use but these are by far the most common.)

The limited amount of ways you can trigger actions restricts the kind of interactions you can build with Adobe Captivate. Event Listeners allow you to run actions when lots of other things happen.

However, before we get too much further, we must understand how CpExtra is able to trigger actions.

## Triggering one action from another
Open Adobe Captivate, create a new **Advanced Action**, on a new **Action** line see if you can find any option in the drop-down menu there to **Execute Advanced Action**. You won't find this option anywhere on the **Advanced Actions** dialog. For some reason, Captivate's developers have not included the ability to call one **Advanced Action** from another, despite this being a backbone principle of almost every kind of scripting and programming.

However, thanks to CpExtra's **[xcmndCallActionOn](../../variables/command.html#xcmndcallactionon) Command Variable**, chaining of Advanced Actions is now possible.

**xcmndCallActionOn** takes two parameters: [(Learn more about parameters here)](../../variables/special-behaviour.html#about-parameters)
1. The name of an Interactive Object (such as a: Button, Smart Shape Button, Text Entry Box. Any object that has a success/failure criteria is considered an 'Interactive Object')
2. The name of a criteria (such as: success or failure)

Let's say we have an Advanced Action which runs the following:

```
Assign | xcmndCallActionOn with Button_1, success
```

xcmndCallActionOn will then trigger the action that was associated with Button\_1's success criteria. If that's an Advanced Action then we have successfully called one Advanced Action from another!

:::tip Note 
To trigger an action in this way the Interactive Object **does not** need to be on the current slide. It just needs to be present *somewhere* in the movie.

A good practice is to include a slide in the course which is never seen by the learners. This can not be accomplished by hiding the slide inside of Captivate, because hidden slides are not included in the final export. Rather, you'll have to make it so the slide is skipped over by the course playback.

Also, to keep things clean, label the button/smart shape the same as its name. This helps you find the object should you need to locate it again in the future.
:::

::: tip Why not trigger an Advanced Action using just it's name?
Probably, you'd expect CpExtra to have a command variable called **xcmndCallAction** which when assigned the name of an Advanced Action will run that action. We agree this would be the ideal solution. However, in reality when Captivate is exported all, references to Advanced Action names are removed. Once again, we hope one day in the future the Captivate developers will change this. But for now, **xcmndCallActionOn** which calls the **Advanced Action** executed by an interactive object is the best possible workaround we have.
:::

Now that we understand how CpExtra triggers actions (namely, that you first need to set up a button (or other Interactive Object) and associate one of its criteria with that action) we can now explain Event Listeners.

## Creating an event listener
Let's say we wanted to run an action when the learner rolled over a shape named **SmartShape\_1**. First of all, we need to set up that action. So we'll create a button called **Button\_1** and configure its success action with the behaviour we wish to happen on rollover.

Now we need a way to tell CpExtra to run **Button\_1's** success action when you roll over **SmartShape\_1**. Let's break that instruction down into four parts:
1. Watch for a slide object named **SmartShape\_1**...
2. ...when it is **rolled over**
3. ...find **Button\_1**...
4. ...and trigger its **success** action.

**xcmndAddEventListener** is a CpExtra **Command Variable** that takes four parameters. The four parameters are in line with the four part instruction written above. So if we ran the following...

```
Assign | xcmndAddEventListener with SmartShape_1, rollover, Button_1, success
```

...CpExtra would run **Button\_1's** success action when we roll over **SmartShape\_1**.

::: tip
The action which is run in reaction to an event is often termed an **event handler**. 

So, if this documentation states something like: 'The right-click event handler', it is referring to the action which is run by **xcmndAddEventListener** when the object is right-mouse-clicked.
:::

What if we roll over it a second time? **Button\_1's** success action would run a second time. CpExtra will just keep 'listening' for this run-time event until we tell it to stop listening. That requires 'removing' the event listener.

## Removing an event listener
Just as **xcmndHide** has it's opposite in **xcmndShow**, **xcmndAddEventListener** has it's opposite in **xcmndRemoveEventListener**.

**xcmndRemoveEventListener** takes the same four parameters as its twin brother, and if we have an event listener set up matching those parameters, it will remove this event listener.

So if we're following the same example, if we ran...

```
Assign | xcmndRemoveEventListener with SmartShape_1, rollover, Button_1, success
```

...the original event listener would be destroyed and no action would be triggered the next time we rolled over **SmartShape\_1**.

::: tip
Both **xcmndAddEventListener** and **xcmndRemoveEventListener** are compatible with **@syntax** and **#syntax**. Which allows you to create some very sophisticated interactions.
:::

Of course, we can listen for many more events than just **rollover**. A complete list is provied on the next page.
