# Smart Object States
**Object States** are a feature of Captivate that allow a single object to have multiple appearances. For example, a **Shape Button's** rollover and down appearance are handled by giving it a rollover and down state which can be configured to alter the button's appearance as the user moves their mouse cursor over the button and presses down on the mouse button. Captivate developers would normally use Captivate's default **Change State** action to change an object's appearance.

**CpExtra Smart States** are able to *automatically* change an object's state when a specific **User Variable** has a certain value. This makes interaction design in Captivate much cleaner because you don't need to employ Advanced Actions to achieve changes to object states.

The following objects support states:
- Shapes
- Captions
- Highlight Boxes
- Images
- SVGs

## How to define a Smart State
1. Select the object that you want to have a smart state.
2. In the **Properties** panel, there are two ways to initiate creation of a new state. One way is to click the plus button beside the default state name shown.  The other way is to click the **State View** button to open the **Object State** panel (usually located in the same area as the **FilmStrip** or **Master Slide** panels) and then click the plus button beside **New State**. Either method allows you to create a new object state.
3. Think carefully about the **name** you enter for the new object state, because this name will be used to tell CpExtra this is a smart state and under what circumstances it should display. (We will discuss these names below)
4. After entering the special state name, click OK to save the new object state.

By default, this new state will be selected and any changes made in the **Properties** panel will be applied to that state.

States can also be re-named using this same dialog box if you need to change an existing state into a smart state, or to alter the name of a smart state (if it proves to be incorrect or conflict with another name).

To do this you need to enter the object's state view by selecting the object and tapping the **state view** button.

<img :src="$withBase('/img/smart-state-state-view.png')" alt="defining xcmndHide">

