# Variable Prefixes
CpExtra allows you to create variables with special behaviour. What kind of behaviour they will have is dependant on their prefix. A prefix is the first letters of a name or label.

::: tip
If you wish one of these variables to sort to the top of the variable's list you can put an underscore (\_) in front of the name and it will still work. Both of these are valid variable names:
- LS_local_storage_variable
- _LS_local_storage_variable
::: 

## LS_ for Local Storage
Any variable whose name starts with **LS_** (not case sensitive) will be treated as a **local storage variable.**

**Local storage** is a feature of modern browsers that allows a site to store information about previous visits. This information is **stored on the learner's browser** not in a remote server. So there is no breach in privacy to use this technology.

Let's say you have a variable called **LS_local_storage_variable** and you assign this variable the value **Hello World**.

```
Assign | LS_local_storage_variable with Hello World
```

If you close down the project, re-open it and read LS_local_storage_variable, it's value will *still* be: Hello World.

Local Storage is held site by site, not page by page. That means if you upload another Captivate project's export to the same website domain, you will be able to read local storage variables set by other Captivate projects.

Let's say Captivate **Project-A** and **Project-B** define the variable **LS_learner_name**. The learner first watches Project-A, setting the LS_learner_name variable to 'John Smith'. When the learner moves to Project-B, LS_learner_name will have the value 'John Smith' from the very beginning.

You can use this feature to persist data between course modules. From module #2 you could read if the learner successfully passed the quiz in module #1 and display different content on that basis. Likewise you could record in module #1 whether the learner is an employee, supervisor, or manager and show them customized content across the course.

::: warning Note
This information is recorded **by browser**. If the learner logs into an LMS with one browser, and then logs back into the LMS on a different browser, the local storage data will not be available.

By the same token, if two people use the same browser to view the same course, the second learner will see the storage variables set by the first learner.
:::

To clear variable values out of local storage see the help for the [xcmndFlushStorage](../variables/command#xcmndflushstorage) variable.

## SS_ for Session Storage
Any variable whose name starts with **SS_** (not case sensitive) will be treated as a **session storage variable.**

**Session storage** is similiar to local storage. However, the variable values are only saved while the browser tab is open. The variables are not shared with other tabs. When you close a tab, the variable is deleted.

[See this page](https://en.wikipedia.org/wiki/Web_storage#Features) for more techincal information about Local and session storage.

## GET_ for Get Variables
Any variable whose name starts with **GET_** (not case sensitive) will be treated as a **get variable.**

**Get variables** have been around since the early days of the internet. They are still used by many websites today.

### Get Variables Example
Try this: 
1. Go to [Youtube](https://www.youtube.com)
2. Search for: **Infosemantics**
3. Look at the URL. It says: [youtube.com/results?search_query=infosemantics](https://www.youtube.com/results?search_query=infosemantics)

Notice the part that says: **?search_query=infosemantics**?

This is a GET variable. 
- The **?** indicates that the path to the webpage has ended and anything that follows is a Get variable.
- **search_query** is the name of the variable.
- **=** indicates what follows is the variable value.
- **infosemantics** is the value of the search_query variable.

Let's continue and see how we can change the value of this variable.

4. Select the URL and swap out **infosemantics** for **adobe**.
5. Follow the link.

See how the search results change to find videos related to Adobe? This technique is used all across the internet and the **GET_** variables allow you to use this technique in Captivate.

Suppose you uploaded your course to this URL: www.example.com/index.html

Then you added a get variable to the end of the URL: www.example.com/index.html**?search_query=infosemantics**

How can we access to the value of **search_query**? Create a variable called: **GET_search_query**. Now, when you read that variable's value it will be: **infosemantics**

Change the end of your URL to **?search_query=cpextra** and GET_search_query will now equal **cpextra**.

::: tip Using get variables to personalise a course
If you made one course for multiple roles (such as employees, supervisors, and managers), but with personalised information for each of those roles, when sending out the URLs to each learner, you could include the learner's role as a get variable like:

- www.example.com/index.html**?role=employee**
- www.example.com/index.html**?role=supervisor**
- www.example.com/index.html**?role=manager**
:::

### Using Multiple Get Variables
What if you wanted to include multiple get variables in a url, like...

- GET_username
- GET_userrole
- GET_usergender

...you would put an **&** between each variable. Like so:

**www.example.com/index.html?username=Karen&userrole=manager&usergender=female**

::: tip Sending GET variables to other projects
You can transfer data from the current Captivate project to the next page you will view (which could be another Captivate project) using CpExtra's [replace variable in url](./replace-var-in-url) feature.
:::
