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


