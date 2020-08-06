# Known Issues

## Adobe Captivate Prime
Currently Adobe Captivate Prime has a bug which causes [Captivate's documented Javascript Interface](https://helpx.adobe.com/au/captivate/using/common-js-interface.html) to work incorrectly. Specifically, the CPAPI\_VARIABLEVALUECHANGED event which CpExtra relies upon to power it's command variables. **This breaks most of CpExtra's features.**

[This issue has been raised with Adobe](https://community.adobe.com/t5/captivate-prime/captivate-javascript-interface-not-working-when-uploaded-to-captivate-prime/m-p/11340178?page=1) but at the time of writing we have received no response. Without Adobe's Action there isn't anything we can do to fix this issue. If this causes you incovenience, we recommend you [post here](https://community.adobe.com/t5/captivate-prime/captivate-javascript-interface-not-working-when-uploaded-to-captivate-prime/m-p/11340178?page=1) to help Adobe get an idea of how many people this issue effects.

## Internet Explorer
The following features do not work in Internet Explorer because it does not implement the required web standards.

- xcmndDisableMouseEvents
- xprefDisablePlaybarScrubbing

::: tip Yes we know IE is still common in the workplace
A lot of businesses around the world still use Internet Explorer (usually IE 11) due to their need to support legacy software that won't run on modern browsers such as Edge or Chrome. We have spent many hours trying to find other ways to get xprefDisablePlaybarScrubbing working with Internet Explorer. Unfortunately, it is a nut we have still yet to crack.  But since IE is dying gradually and most businesses will sooner or later be forced to abandon it, we see no option except to move on and support the modern browsers that will replace it.
:::

## Can't type the @ symbol when trying to set up @syntax
You probably have a non-standard keyboard, such as a non-English keyboard or AZERTY keyboard. You may need to change the keyboard to 'English' inside your computer's settings, or find what key combination is linked to the @ symbol for your keyboard model.

