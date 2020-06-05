# Variable Prefixes
CpExtra allows you to create variables with special behaviour. What kind of behaviour they will have is dependant on their prefix. A prefix is the first letters of a name or label.

::: tip
If you wish one of these variables to sort to the top of the variable's list you can put an underscore (_) in front of the name and it will still work. Both of these are valid variable names:
- LS_local_storage_variable
- _LS_local_storage_variable
::: 

## LS_ for Local Storage
Any variable whose name starts with **LS_** (not case sensitive) will be treated as a local storage variable.

**Local storage** is a feature of modern browsers that allows a site to store information about previous visits. This information is **stored on the learner's browser** not in a remote server. So there is no breach in privacy to use this technology.

Let's say you have a variable called **LS_local_storage_variable**. Let's say you assign this variable the value **Hello World**.

```
Assign | LS_local_storage_variable with Hello World
```

If you close down the project, re-open it and read LS_local_storage_variable again, it's value will still be: Hello World.

Local Storage is held site by site, not page by page. That means if you upload another Captivate project's export to the same website domain, you will be able to read local storage variables set by other Captivate projects.


If project-a defines and sets a variable called LS_learner_name, project-b can read that same variable.

You can use this feature to persist data between course modules. From module #2 you could read if the learner successfully passed the quiz in module #1 and display different content on that basis. Likewise you could record in module #1 whether the learner is an employee, supervisor, or manager and show them customized content across the course.

::: tip Note
This information is recorded **by browser**. If the learner logs into an LMS with one browser, and then logs back into the LMS on a different browser, the local storage data will not be available.

By the same token, if two people use the same browser to view the same course, the second learner will see the storage variables set by the first learner.
:::

To clear variable values out of local storage see the help for the [xcmndFlushStorage](../variables/command#xcmndflushstorage) variable.

## SS_ for Session Storage

## GET_ for Get Variables
