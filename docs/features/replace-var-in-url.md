# Replace Var in URL
Whenever you use the **Open URL or File** action, this feature allows you to include Captivate Variable values in the URL. When you enter the URL, include a variable name surrounded with double dollar signs ($$) where you wants it's value to be included.

So if you...

1. Had a variable called **MyVar** with a value of **MyValue**
2. Set an Open URL or File action to open the link: **www.example.com/$$MyVar$$.html**

...the url that would be opened is: **www.example.com/MyValue.html**

<img :src="$withBase('/img/replace-var-in-url.png')" alt="A button's score set to 10">

### Why would you use this?
Consider one example. Let's say you had four Captivate modules uploaded to these addresses:
- **www.example.com/knowledge_check.html**
- **www.example.com/good.html**
- **www.example.com/average.html**
- **www.example.com/bad.html**

The learner is first taken to **www.example.com/knowledge_check.html**. That module takes them through a quiz which checks how much knowledge they already have on a topic. After the quiz we check the learner's score and give them a grade:
- Good (they are knowledgeable and require little instruction)
- Average (they have some knowledge, but require more instruction)
- Bad (they have almost no knowledge, and require extensive instruction)

We save that grade into a variable named: **USR_GRADE**

We then trigger a Open URL or file action with the following link: **www.example.com/$$USR_GRADE$$.html**

They will automatically be taken to the module that gives them the level of instruction required to pass the whole course.

### Synergy with get variables
This features works well in combination with **get variables**. [The GET_ prefix for Get Variables](./variable-prefixes.html#get-for-get-variables) feature help explains the get variables concept. Variables with a **GET_** prefix allow you to **read** get variables. The replace var in URL allows you to **send** get variables.

First off, you could use take advantage of get variables on other websites. Let's say you...
1. Had a text entry box linked to the **Text_Entry_Box_1** variable.
2. Had with a button with an Open URL or file action. 

When you clicked the button, you wanted to open a Google search of whatever you entered in the text entry box. You can take advantage of the **www.google.com/search** page's **q** get variable. Just make the button open this URL: **www.google.com/search?q=$$Text_Entry_Box_1$$**

On the other hand, you could also use this feature to pass information from one Captivate module to another. 

Let's say you have a course with two modules. They are uploaded to the following URLs:
- **www.example.com/module1.html**
- **www.example.com/module2.html**

**In module #1** you recorded the learner's name in a variable named: **learner_name**

At the end of module #1 you use the Open URL or file action to move to module #2. You send the value of the learner_name variable by opening the following URL: **www.example.com/module2.html?learner_name=$$learner_name$$**

**In module 2** you define a variable called: **GET_learner_name**

GET_learner_name will now allow you to read the learner's name as specified in module #1.
::: tip
If you're after this kind of data persistance, you probably want to check if [local storage](./variable-prefixes.html#ls-for-local-storage) or [session storage](./variable-prefixes.html#ss-for-session-storage) variables are a better fit.
:::
