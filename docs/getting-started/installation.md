# Installation
First, you will need to [purchase CpExtra from the infosemantics store.](https://infosemantics.com.au/about-cpextra/buy-cpextra/)
Thereafter, you will be provided the install files for CpExtra, which include:
- Infosemantics\_CpExtra.js *(For headless installation)*
- Infosemantics\_CpExtra.wdgt *(For widget installation)*

::: danger
We **strongly** recommend you install CpExtra **headlessly** as described in the next section. This installation method avoids *many* technical issues.

However, be aware that to install headlessly you will need to access the Adobe Captivate install directory on your computer and make changes to files there. This level of access requires you have administrator privlidges on your computer. If you work in a large organisation with an IT department it is unlikely that you will have these privileges. So, you would either need to have an IT person with administrator privileges make the necessary changes, or else simply install CpExtra as a widget and accept the limitations this will bring.
:::



## Headless Installation

Headless loading installs CpExtra into the Captivate program files directory. This means whenever you publish a project to HTML5  CpExtra will be automatically included at the correct location within the published output.

::: tip Pros
- No need to insert the CpExtra widget in the .cptx project file.
- Every new project will automatically include CpExtra features.
- Courses that might not start on the first slide (such as those resumed by an LMS or using the Self-Paced Learning feature) will still successfully load CpExtra.
:::

::: danger Cons
- If you share your .cptx file with another Captivate developer, then the CpExtra features will not work when this other developer publishes the project (unless they also have CpExtra headlessly installed on their computer).
- **Every time Captivate updates** (even patch releases) you will need to update the CpExtra JavaScript files located in Program Files.
:::


### Video Instructions - Headless Loading


<iframe width="560" height="315" src="https://www.youtube.com/embed/i-px1CkiDHM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> 

### Written Instructions - Headless Loading

::: details If you're a Software Engineer who works for Adobe on the Captivate development team, please tap here!
PLEASE provide an easier way to include javascript files in Captivate projects!  It should NOT be necessary for Captivate users to load JS libraries into the Program Files directory just to have that code published with their HTML5 output.

Please.
:::

1. Locate the **Infosemantics\_CpExtra.js** file (supplied in the ZIP archive downloaded after the CpExtra purchase).
2. Navigate to the install directory for your Adobe Captivate version.

::: tip Example: Captivate Program Files location for Captivate 9 on a 64bit computer
**Windows:** C:\Program Files\Adobe\Adobe Captivate 9 x64

**MAC:** Applications/Adobe Captivate 9
:::

3. Once you are in the Captivate install directory, open the HTML/assets folder.
4. Create a new folder called **libraries**.
5. Open the libraries folder and paste in **Infosemantics\_CpExtra.js**.
6. Move back up two folders (to the HTML folder).
7. Locate the index.html file.  (This is the template file used when publishing HTML5 output.)
8. Make a copy of the index.html file and call it index\_backup.html

::: tip Why create a backup of the index_backup.html?
If something goes horribly wrong with the changes you are making, you can simply restore the original index.html file from index\_backup.html.
:::

9. Your operating system will usually prevent normal editing of files inside the Program Files folder. So you must copy the index.html file on to your desktop and open it in a **text editor** (such as notepad).
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
13. Copy the newly edited version of index.html file on your desktop and paste it back into the HTML folder in the Captivate program files (where the original unedited index.html file is located) to overwrite the file.

::: warning
As mentioned previously, you must have administrator privledges to perform this step.
:::


14. If Captivate has been open till this point, restart the application so that it will pick up the changed files.

Congratulations! Your headless installation of CpExtra is now complete and ready to use!


::: details If the Adobe Captivate Software Engineer is still reading this...
Like, perhaps make it possible to specify extra JavaScript libraries somewhere in the Project Preferences. Surely it can't be that hard.
We've been doing this since *Captivate 9* for crying out loud!
:::

## Installing CpExtra as a Widget

When you insert CpExtra as a widget, it will appear on the Captivate timeline of the slide on which it is inserted. This means that the CpExtra code will only activate when the published Captivate movie enters that part of the timeline. However, unlike most other objects on that slide, even when you move to a different slide, CpExtra will continue to work. So, you **do not** need to insert more instances of the CpExtra widget on other slides where you want to use CpExtra features.

By default the CpExtra is invisible in the HTML5 output.  So, you do not need to go to extra lengths to hide the widget. 

::: tip Pros
- If you insert CpExtra as a widget, and then share your .cptx with another Captivate developer, CpExtra will still be included inside the project file.
- The widget properties interface includes a notification to tell you when a new version of CpExtra has been released.
:::

::: danger Cons
- You will have to insert the CpExtra widget into every project in which you desire to use CpExtra features.
- LMS reloading and Self-Paced learning may cause your Captivate project to start mid-way through the course and by-pass the slide where the widget gets loaded. This would not give CpExtra's code a chance to run, causing any slides using CpExtra features to not act as expected.
- When using the 'preview next 3 slides' option in Captivate, unless one of those three slides is the one with CpExtra, then CpExtra features will not work.
- If you don't preview the project from a web server or localhost server over HTTP or HTTPS, the browser may stop the CpExtra code from executing as it believes there is a security issue. This not because CpExtra's code is insecure, it's just part of the way web browsers treat any code running in an iframe element.
:::

### Instructions for inserting CpExtra as a widget

1. Open to the desired slide in your Captivate project and from the Captivate menu choose Insert > Widget.
2. Browse to the folder on your system where you saved the **Infosemantics_CpExtra.wdgt** file and select it.
3. The Widget will be inserted into Captivate at the chosen slide, showing the **Widget Properties** window. You click 'OK' to this window. (Clicking 'Cancel' would prevent the widget from being inserted.)
4. The CpExtra widget will now appear visible on the slide.

### On which slide should the CpExtra widget be inserted?

Some developers insert the CpExtra widget on the first slide of their project, but this is not considered best practice. The most computationally intensive part of the Captivate export is the initial setup. Placing CpExtra on the very first slide may possibly add to that load.

Our personal recommendation is to:
1. Make the first slide of the project a blank slide that lasts for one or more seconds while displaying a loading message.
2. Insert CpExtra on the *second* slide of the project. This slide should also be at least one second in duration.

### Viewing the published project

As stated above, projects using the CpExtra widget must always be viewed from a web server or localhost server. 

Therefore, after you have published a project you cannot freely navigate to the export folder and view the output. This would be running the output from your file system which causes the browser to apply a different set of security restrictions to the content than it would if the same content was being delivered from a web server. 

For development purposes you will need to frequently view your content, but this must be done from a web server environment in order for CpExtra to function correctly.  Captivate providess a couple of HTML5 preview options including **Preview > HTML5 in Browser** (for non-responsive projects) and **Live Preview on Devices** (for responsive projects). These both create a temporary web server environment in which to display the content.  But to view your final published output, you would need to set up a localhost server on your computer, or upload your content to an external web server and view it from there. If the output is for LMS delivery, this is also an option since LMSs use a web server environment as well.

#### Previewing in Responsive Projects

Any preview method that creates a temporary web server environment will work. Just remember that **Preview > Next # Slides** must include the slide with CpExtra and preferably as one of the earliest slides in the group.

When you publish a project an alert box will appear at the end of the process asking if you want to view the output. You may accept this with confidence, as Captivate will generate a localhost server for you to view the output.

#### Previewing HTML5 output from Regular (non-responsive) Projects

Choose Preview > HTML5 in Browser

::: tip
You will not run into any of these previewing headaches if you load CpExtra heedlessly.
:::
