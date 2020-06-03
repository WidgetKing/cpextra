# Smart States
States are a feature of Captivate that allow a single object to have multiple appearances. For example, a Shape Button's rollover and down appearance is handled by giving it a rollover and down state which can be configured. Usually you would use the Change State action to change an object's states.

Smart states automatically display themselves when a variable has a certain value. This makes interaction design in Captivate cleaner, as you don't need to include state changing code in your Advanced Actions.

The following objects support states:
- Shapes
- Captions
- Highlight Boxes
- Images
- SVGs

## How to define a smart state
1. Select the object on which you wish to create a smart shape.
2. In the properties panel, look under the **Object State** subsection. There you will see a plus button. Click this to add a new state.
3. A dialog will appear allowing you to **name** the object state. The name you give the state will inform CpExtra whether this is a smart state and under what circumstances it should display. (We will discuss these names below)
4. After entering the special name, click OK.

By default, this new state will be selected and any changes made in the properties panel will be applied to that state.

States can also be renamed. This means you can change an existing state into a smart state or alter the name of a smart state if it proves to be incorrect.

To do this you need to enter the object's state view by selecting the object and tapping the **state view** button.

<img :src="$withBase('/img/smart-state-state-view.png')" alt="defining xcmndHide">

