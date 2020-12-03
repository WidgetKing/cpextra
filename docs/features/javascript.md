# JavaScript
JavaScript programming is quickly becoming an essential skill for Adobe Captivate course development. Here we list the CpExtra features which enable a convenient JavaScript workflow with Adobe Captivate.

## Loading Javascript files into Captivate
At the time of writing, Captivate does not provide a method of loading and running JavaScript files. JavaScript files are the prefered place to store JavaScript code for many reasons. A few being:
- Your code can be consolidated in one location.
- You can use a dedicated program to write JavaScript code rather than Captivate's limited JavaScript panel.
- You can easily include third-party JavaScript libraries.
- Once a Captivate project has been published, its export folder will include the JavaScript file. By replacing that JavaScript file you can update your code without needing to republish the Captivate project.
- JavaScript files can be loaded from remote servers, allowing you to have automatic access to the latest version of the library.

Therefore, CpExtra includes the **[xcmndLoadJSFromAction](../variables/command.html#xcmndloadjsfromaction)** command variable which allows you to load and run JavaScript files in Adobe Captivate.

Here's how.

### Loading Local JavaScript Files
Firstly, we must ensure Captivate includes our JavaScript file in the project export. For this, we can make use of the **Open URL or File** action.

1. Add an interactive object (button, shape button, text entry box, click box) to your project. 
2. Give this object a meaningful name. We'll use it later.
3. Set this object's **success/failure/on focus lost** action to **Open URL or file**.
4. Click the folder icon. In the browser window that appears, navigate to your JavaScript file and select it. This slide object is now fully configured.

<img :src="$withBase('/img/open-url-or-file-browse.png')" alt="the open url or file action">

5. Work out when you want to run this JavaScript file. Is this a file that you want to run from the start of the movie? [Then go to the xprefInitAction action](#loading-javascript-when-the-captivate-movie-begins). What if you wanted the JavaScript file to run every time you entered the current slide? Then go to the slide enter action.
6. Add an assign action as below, replacing **interactive_object** with the name you gave the object in **step 2**.

<img :src="$withBase('/img/load-js-from-enter-slide.png')" alt="load file in slide enter action">

7. When you publish and view the export, CpExtra will load and run the JavaScript file in Captivate.

If you later update and save the JavaScript file and publish again, the new version of the JavaScript file will be included in Captivate.

If you go to the root folder of your Captivate export, you will see the JavaScript file has been included there.

::: warning When sharing projects with other developers
Suppose you created a Captivate project where we point the **Open URL or file** action to the path: **C:\\_RESOURCES\js\mycode.js**

If someone takes your Captivate project and publishes it on their computer, Captivate will attempt to locate the **C:\\_RESOURCES\js\mycode.js** file on *their* computer. If they have not created this file, then it will fail to load.

Therefore, when working with other Captivate developers, it is important to specify a standard of where to put your JavaScript files, so you don't need to update your **Open URL or file** actions when receiving the Captivate project from a team mate.
:::

#### Interactive Object Location
Likely you will not want the interactive object with the **Open URL or file** actions to be seen by the learner. This is because if the learner triggers the **Open URL or file** action, their browser will navigate away from the course and display all the code in the JavaScript file. Likely, not what you have in mind.

There are a number of ways you can hide the interactive object. You could set it to be invisible in output.

<img :src="$withBase('/img/invisible-in-output.png')" alt="set interactive object to be invisible in output">

You could also place this interactive object on a slide which is never visited by the learner.

However, your JavaScript file **will not** be included in the export if the interactive object is placed on a **hidden slide**. Also, if you use Captivate's **Next 5 Slides** preview option, and the interactive object is not included in those 5 slides, then the JavaScript will fail to run.

<img :src="$withBase('/img/publish-next-5-slides.png')" alt="Publish next 5 slides option">

Therefore, instead of using Preview Next 5 Slides, we recommend always previewing the whole project, and then using **[xprefStartSlide](../variables/preference.html#xprefstartslide)** to immediately jump to the slide you wish to test.

### Loading Remote JavaScript Files
JavaScript developers often reference third-party JavaScript libraries (which are also JavaScript files) from a remote server. This allows them to ensure they are always using the latest version of a particular library. For example, the popular [Sweet Alert 2](https://sweetalert2.github.io/) library is available from this link:

```
https://cdn.jsdelivr.net/npm/sweetalert2@10
```

We can also load this remote file using **xcmndLoadJSFromAction**. Follow the same steps as above, but instead when you get to **step 4** don't click the folder icon to browse for a local file. Instead, paste the remote JavaScript file's URL into the action's text field.

<img :src="$withBase('/img/load-js-remotely.png')" alt="loading sweet alert library from remote URL">

When you publish the project, the JavaScript file **will not** be included in the export folder. When the Captivate movie runs, CpExtra will load the file from the remote server and run it.

::: warning
If you have a client who is concerned about security you may need to gain permission before including any third-party JavaScript libraries. This would likely be true regardless of whether they are loaded locally or from a remote server.
:::

### Loading JavaScript When the Captivate Movie Begins
Often, we want our JavaScript to be loaded as soon as the Captivate export start playing, so our code is available to all slides. 

Loading JavaScript files when the Captivate movie begins is not as simple as running **xcmndLoadJSFromAction** on the first slide of the course. This is because Self-Paced Learning and SCORM compliant LMSs may cause the course to begin from any slide. Also, if the learner were to revisit the first slide of the course, CpExtra would then load and run all the JavaScript for a likely unintended second time.

Therefore, it is best to use CpExtra's **[xprefInitAction](../variables/preference.html#xprefinitaction)** feature. **xprefInitAction** allows us to run an action from the beginning of the movie, regardless of where self-paced learning or the LMS causes the movie to start.

If we point **xprefInitAction** to an advanced action, then we can add a line where we assign **xcmndLoadJSFromAction** the names of all relevant interactive objects.

```
Assign | xcmndLoadJSFromAction with javascript_loader_object_1, javascript_loader_object_2
```

Of course, we could simplify the above line by using #syntax to load JavaScript files from across the project.

```
Assign | xcmndLoadJSFromAction with javascript_loader_object_#
```

Note that [none of these methods can 100% ensure in what order the JavaScript files will run.](https://stackoverflow.com/questions/8996852/load-and-execute-order-of-scripts) That is dependant on how long it takes the browser to download the JavaScript files. Therefore, if your JavaScript code is dependant on another JavaScript file being loaded first, we suggest you write your code in such a way that it first checks whether its required libraries have already loaded.

Better yet, use workflow tools like [Node.js](https://nodejs.org/en/) and [Webpack](https://webpack.js.org/) to bundle all your required JavaScript into a single JavaScript file. That way you can be confident of the loading order.

### Loading with CpMate
[CpMate's](https://infosemantics.com.au/about-cpmate/) JavaScript api includes the [X.runInCaptivateWindow()](https://widgetking.github.io/cpmate/features/javascript-api/run-in-captivate-window.html) function. With this you can use CpMate to load JavaScript libraries into Captivate. Though for most people, **xcmndLoadJSFromAction** will be preferable. 

However, CpMate's **X.runInCaptivateWindow()** method comes with one notable benefit. When publishing from Adobe Animate, the JavaScript files will be included in the OAM file. That OAM file will be subsequently included in the Adobe Captivate project. So when you share projects from one developer to another, you need only provide the Captivate Project. This is of course assuming the other developer has CpExtra installed on their system.
