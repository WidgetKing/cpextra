# Frequently Asked Questions

Below are some common questions regarding CpExtra.

## Which versions of Captivate are supported?
All versions of Captivate from version 9 onward should work. We always keep CpExtra up to date with the latest versions.

## Which web browsers are supported?
All modern HTML5-compatible browsers are supported. The only HTML5 browser you are likely to run into issues with is **Internet Explorer**. See the [known issues page](./known-issues) for more information.

## Are all features supported on mobile device browsers?
All the features that make sense are. Here are some that don't, and therefore, aren't.

### xcmndSetCursor
At the time of writing mobile devices don't typically have a mouse cursor. So, CpExtra can't change its shape. However, as modern tablets become more and more like computers some are even showing features that look suspiciously like cursors. So, stay tuned...

### xprefDisablePlaybarScrubbing
Playbar scrubbing is **already disabled on mobile devices**, and for good reason. If the learner was allowed to skip to any slide in the movie on a whim it would mess with the preloading which make cause the web page to crash.

There are no plans for CpExtra to enable playbar scrubbing.

### xcmndAddEventListener's Rollover and Rollout events
With the exception of the iPad's magic keyboard cursor, there is really no way to 'rollover' things on a mobile device.  

### Session Storage
Session storage variables are cleared when a browser 'session' has ended. On desktop browsers the session is considered to have ended when the browser shuts down. However, on mobile browsers what is considered a 'session' is much less consistent. For this reason we recommend using local storage variables if your audience is primarily mobile-based.

