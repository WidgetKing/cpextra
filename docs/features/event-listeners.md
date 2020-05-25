# Event Listeners
Event handling is a powerful and important tool. It is specifically related to the following command variables:

- [xcmndAddEventListener](../command-variables.html#xcmndAddEventListener)
- [xcmndRemoveEventListener](../command-variables.html#xcmndRemoveEventListener)

These two command variables are the powerhouse of many custom built interactions.

## What do Event Listeners do?
They trigger an action when an event happens. Let's break that down:

One of the limiting factors of Captivate actions is when you can run them. Out of the box you can only run an action on one of the following events:

- Entering a slide
- Exiting a slide
- Clicking a button
- Clicking outside a button (if the button's failure action is enabled)
- Validating a Text Entry Box
- Losing focus on a Text Entry Box

The limited amount of ways you can trigger an action limits the kind of interactions you can build. This is where CpExtra's event handling features come in to save the day.

But before we get too much further there is one other thing we need to talk about.

## Triggering one action from another
Captivate does not allow you to chain Advanced Actions. You can only execute one at a time. CpExtra allows you to trigger one Advanced Action from another using the **xcmndCallActionOn** command variable.

# Event List

## click

## doubleclick