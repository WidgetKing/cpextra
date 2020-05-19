# Frequently Asked Questions

Below are some common questions regarding CpExtra.

## Which versions of Captivate are supported?
All versions of Captivate from version 9 up should work. We keep CpExtra up to date with the latest versions.

## Which web browsers are supported?
All modern browsers are supported. The only browser you are likely to run into issues with is **Internet Explorer**.

The following features do not work in Internet Explorer because it does not implement the required standards.

- xcmndDisableMouseEvents
- xprefDisablePlaybarScrubbing

::: tip Yes we know
A lot of businesses out there still use Internet Explorer due to their need to support legacy software. We have spent hours trying to find other ways to get xprefDisablePlaybarScrubbing working with Internet Explorer. Unfortunately, it is a nut we have still yet to crack.
:::

## Are all features supported on mobile device browsers?
All the features that make sense are. Here are some that don't, and therefore, aren't.

### xcmndSetCursor
At the time of writing mobile devices don't typically have a mouse cursor. So CpExtra can't change its shape.

### xprefDisablePlaybarScrubbing
Playbar scrubbing is **already disabled on mobile devices**, and for good reason. If the learner was allowed to skip to any slide in the movie on a whim it would mess with the preloading which make cause the web page to crash.

There are no plans for CpExtra to enable playbar scrubbing.

### xcmndAddEventListener's Rollover and Rollout events
With the exception of the iPad's magic keyboard cursor, there is really no way to 'rollover' things on a mobile device.

### Session Storage
Session storage variables are cleared when a browser 'session' has edned. On desktop browsers the session is considered to have ended when the browser shuts down. However, on mobile browsers what is considered a 'session' is much less consistent. For this reason we recommend using local storage variables if your audience is primarily mobile based.

## Can't type the @ symbol
You probably have a non-standard keyboard, such as a non-English keyboard or AZERTY keyboard. You may need to change the keyboard to 'English' inside your computer's settings, or find what key combination is linked to the @ symbol for your keyboard model.

