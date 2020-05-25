# Event Listeners
Event listeners are powerful tools. They are enabled through the following command variables:

- [xcmndAddEventListener](../../variables/command.html#xcmndaddeventlistener)
- [xcmndRemoveEventListener](../../variables/command.html#xcmndremoveeventlistener)

These two command variables are the powerhouse of many custom built interactions.

## What do event listeners do?
When an event occurs they trigger an action. Let's break that down:

One of the limiting factors of Captivate actions is the limited circumstances you can trigger them. Out of the box you can only run an action when:

- Entering a slide
- Exiting a slide
- Clicking a button
- Clicking outside a button (if the button's failure action is enabled)
- Validating a Text Entry Box
- Losing focus on a Text Entry Box

The limited amount of ways you can trigger an action restricts the kind of interactions you can build. Event Listeners allow you to run actions when different things happen.

However, before we get too much further, we must understand how CpExtra is able to trigger actions.

## Triggering one action from another
Go into Captivate, create a new Advanced Action, create a new action and see if there you can find the 'Execute Advanced Action' option in the drop down menu. You won't. For some reason, Captivate's developers have not included the ability to call one Advanced Action from another, despite this being a backbone principle of almost every kind of scripting.

However, thanks to CpExtra's [xcmndCallActionOn](../../variables/command.html#xcmndcallactionon) command variable, chaining Advanced Actions is now possible.

::: tip Why not trigger an Advanced Action using it's name?
Probably, you'd expect CpExtra to have a command variable called **xcmndCallAction** which when assigned the name of an Advanced Action will run that action. We agree this would be the ideal solution. However, in reality when Captivate is exported all, references to Advanced Action names are removed. Once again, we hope one day in the future the Captivate developers will change this. But for now, **xcmndCallActionOn** is the best possible workaround.
:::

**xcmndCallActionOn** takes two parameters: [(Learn more about parameters here)](../../variables/special-behaviour.html#about-parameters)
1. The name of an Interactive Object (such as a: Button, Smart Shape Button, Text Entry Box. Any object that has a success/failure criteria is considered an 'Interactive Object')
2. The name of a criteria (such as: success or failure)

Let's say we have an Advanced Action which runs the following:

```
Assign | xcmndCallActionOn with Button_1, success
```

xcmndCallActionOn will then trigger the action that was associated with Button\_1's success criteria. If that's an Advanced Action then we have successfully called one Advanced Action from another!

Now that we understand how CpExtra triggers actions (namely, that you first need to set up a button (or other Interactive Object) and associate one of its criteria with that action) we can now explain Event Listeners.

## Creating an event listener
Let's say we wanted to run an action when the learner rolled over a shape named **SmartShape\_1**. First of all, we need to set up that action. So we'll create a button called **Button\_1** and configure its success action with the behaviour we wish to happen on rollover.

Now we need a way to tell CpExtra to run Button\_1's success action when you roll over SmartShape\_1. Let's break that instruction down into four parts:
1. Watch a slide object named **SmartShape\_1**...
2. ...when it is **rolled over**
3. ...find **Button\_1**...
4. ...and trigger its **success** action.

**xcmndAddEventListener** is a command variable that takes four parameters. The four parameters are in line with the four part instruction written above. So if we ran the following...

```
Assign | xcmndAddEventListener with SmartShape_1, rollover, Button_1, success
```

...CpExtra would run Button\_1's success action when we roll over SmartShape\_1.

::: tip
The action which is run in reaction to an event is often termed an **event handler**. 

So in this documentation states something like: 'The right click event handler', it is referring to the action which is run by xcmndAddEventListener when the object is right clicked.
:::

What if we roll over it a second time? Button\_1's success action would run a second time. CpExtra will keep 'listening' for this event until we tell it to stop.

## Removing an event listener
Just how xcmndHide has it's opposite in xcmndShow, xcmndAddEventListener has it's opposite in **xcmndRemoveEventListener**.

xcmndRemoveEvent listener takes the same four parameters, and if we have an event listener set up matching those parameters, it will remove this event listener.

So if we're following the same example, if we ran...

```
Assign | xcmndRemoveEventListener with SmartShape_1, rollover, Button_1, success
```

...the original event listener would be destroyed and no action would be triggered the next time we rolled over SmartShape\_1.

::: tip
Both xcmndAddEventListener and xcmndRemoveEventListener are compatible with @syntax and #syntax. Which allows you to create some very sophiticated interactions.
:::

Of course, we can listen to many more events than just 'rollover'. A complete list is provied on the next page.
