# Installation
First, you will need to [purchase CpExtra from the infosemantics store.](www.infosemantics.com.au/?q=adobe-captivate-widgets/cpextra)
Thereafter, you will be provided the install files for CpExtra, which include:
- Infosemantics\_CpExtra.js *(For headless installation)*
- Infosemantics\_CpExtra.wdgt *(For widget installation)*

::: danger
We **strongly** recommend you install CpExtra **headlessly**. This avoids *many* technical issues.

However, to install headlessly you will need admin privlidges on your computer. Not everyone has these. Under these circumstances you may have no other choice but to install CpExtra as a widget.
:::



## Headless Installation

Headless loading installs CpExtra into the Captivate program files. This means whenever you export a html project CpExtra will be automatically included.

::: tip Pros
- No need to include the CpExtra widget.
- Every new project will automatically include CpExtra features.
- Courses that might not start on the first slide (such as those resumed by an LMS or using the Self-Paced Learning feature) will still successfully load CpExtra.
:::

::: danger Cons
- If you share your .cptx file with another Captivate developer, then the CpExtra features will not work when they publish the project (unless they have CpExtra installed as well).
- **Every time Captivate updates** (even patch releases) you will need to re-install CpExtra.
:::


### Video Instructions

<iframe width="560" height="315" src="https://www.youtube.com/embed/i-px1CkiDHM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 

### Written Instructions

::: details If you're a Captivate Software Engineer and reading this, tap here!
Please provide an easier way to include javascript files in Captivate projects.

Please.
:::

1. Locate the **Infosemantics\_CpExtra.js** file (Part of the CpExtra purchase)
2. Open the Captivate Program files.

::: tip Captivate Program Files location
**Windows:** C:\Program Files\Adobe\Adobe Captivate 9 x64

**MAC:** Applications/Adobe Captivate 9
:::

3. Open the HTML/assets folder.
4. Create a new folder called **libraries**.
5. Open the libraries folder and paste in **Infosemantics\_CpExtra.js**.
6. Move back up two folders (to the HTML folder)
7. Locate the index.html file.
8. Make a copy of the index.html file and call it index\_backup.html

::: tip What is the purpose of the index_backup.html?
To backup the original index.html file. If something goes horribly wrong with the install you can now restore the original index.html file from index\_backup.html.
:::

9. Copy the index.html file on to your desktop and open it in a **text editor** (such as notepad).
10. Find the following line of code: 

``` js
var lJSFiles = [ @JSFILES_ARRAY ]; 
``` 

11. Change it to: 

``` js
var lJSFiles = [ @JSFILES_ARRAY , 'assets/libraries/Infosemantics_CpExtra.js' ]; 
``` 

::: danger Make sure of the following otherwise the install will fail:
1. **Leave the space** between the end of **@JSFILES\_ARRAY** and the comma (,). 
2. Use **forward slashes** (/) in the assets/libraries/Infosemantics\_CpExtra.js file path. Back slashes (\\) will **not** work.
:::

12. Save and exit index.html
13. Copy the index.html file on your desktop and paste it back into the HTML folder in the Captivate program files (Where you originally got the index.html file from in step 8)

::: warning
You will need administrator privledges for this step.
:::


14. If Captivate is open. Restart it.

Congratulations! Your install is now complete. CpExtra is now ready to use!


::: details If the Captivate Software Engineer is still reading this...
Like, somewhere in the project preferences. Surely it can't be that hard.
We've been doing this since *Captivate 9*.
:::

## Widget Installation

When you insert CpExtra as a widget, it will appear on the Captivate timeline. Once the published Captivate movie enters that part of the timeline the CpExtra code will run activate. Even once you move out of that slide CpExtra will continue to work. So you **do not** just put a CpExtra widget on the slides you want to use CpExtra features.

Therefore, you would put CpExtra on the first or second slide. Of your project.

::: tip Pros
- If you share your .cptx with another Captivate developer, CpExtra will still be included.
- The widget properties interface includes a notification to tell you when a new version of CpExtra has been released.
:::

::: danger Cons
- LMS reloading and Self-Paced learning may cause your Captivate project to start mid-way through the course. This does not give the CpExtra code a chance to run. Any slides using CpExtra features will not act as expected.
- When using the 'preview next 3 slides' option in Captivate, unless one of those three slides is the one with CpExtra, then CpExtra features will not work.
- You will have to insert the CpExtra widget into every project that you desire to use CpExtra features in.
- If you don't preview the project from a server or local host server, the browser may stop the CpExtra code from executing as it believes there is a security issue. This not because the code is insecure, it's just part of the way the browser treats any code running in an iframe element.
:::

### Instructions for importing

1. In your Captivate project choose Insert > Widget
2. Browse to the Infosemantics_CpExtra.wdgt file and select it.
3. The Widget will be inserted into Captivate, showing the Widget Properties window. You click 'OK' to this window. Clicking 'Cancel' will prevent the widget from importing.
4. The CpExtra widget will now appear on the slide.

### Where should the CpExtra widget be placed?

Some place the CpExtra widget on the first slide of their project, but this is not considered best practice. The most computationally intensive part of the Captivate export is the initial setup. Placing CpExtra on the first slide may possibly add to that load.

Our personal recommendation is to:
1. Make the first slide of the project last for one or more seconds and display a loading message.
2. Insert CpExtra on the *second* slide of the project. This slide should be at least one second in duration.

### Viewing the exported project

As stated above, projects using the CpExtra widget must always be viewed from a server or local host server. 

Therefore, after you have published a project you can not freely navigate to the export folder and view the output. This would be running the export from your file system which causes the browser to apply a different set of restrictions to the content. To safely view this export, you would need to set up a local host server on your computer or upload the export to a web server and view it from there.

Additionally, certain preview options in Captivate will generate a local host server on the fly for you to view the content, while others will not.

#### Previewing in Responsive Projects

Any preview method will work. Just remember that Preview > Next 3 Slides must include the slide with CpExtra.

When you publish a project an alert box will appear at the end of the process asking if you want to view the output. You may accept this with confidence, as Captivate will generate a local host server for you to view the output.

#### Previewing in Regular Projects

Choose Preview > HTML5 in Browser

::: tip
You will not run into any of these previewing headaches if you load CpExtra heedlessly.
:::