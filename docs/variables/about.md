# About Variables
In this section we will explain CpExtra's command/preference/info variables.

::: tip About variable prefixes
Some CpExtra features allow you to create variables with special abilities by giving them a special prefex. Such as variables with the prefix *ls_* saving their values to local storage.
We do not discuss these features here. Instead, they are discussed under the features page.
:::

## Variable types
CpExtra breaks its variables into three catagories.

### Command Variables
These are the most frequently used variable type. Each variable represents an 'action' or command. When you assign a value to these variables, CpExtra read that value and act upon it.

For example, if you assign xcmndHide with 'SmartShape_1' CpExtra will search the project for an object name 'SmartShape\_1' and hide it.

<img :src="$withBase('/img/define-xcmndhide.png')" alt="defining xcmndHide">

Examples of commonly used command variables include:
- xcmndHide
- xcmndShow
- xcmndAddEventListener
- xcmndScore

### Preference Variables
Preferences are behaviors you want to persist for the whole project. Usually, you'll set them once and forget about them. That said, you can change them again once they are set.

Usually you'll give a preference variable its initial value in the Project > Variables... dialog.

Examples of commonly used command variables include:
- xprefDisablePlaybarScrubbing
- xprefInitAction

### Info Variables
CpExtra exposes information through these variable's values. Much like how Captivate exposes the number of the current slide through the cpInfoCurrentSlide variable. You do NOT change these variable's values.

Commonly used info variables include:
- xinfoEventTarget
- xinfoProjectElapsedMinutes
- xinfoProjectElapsedSeconds

## How do you create variables?
To use a CpExtra command/preference/info variable you must first define it.

For example, *xcmndHide* is probably CpExtra's most frequently used command variable. To define it in Captivate:
1. Go to Project > Variables...
2. Click: *Add New*
3. Write the name of the variable (in this example: xcmndHide)

<img :src="$withBase('/img/assign-xcmndhide.png')" alt="assigning to xcmndHide">

4. If you're defining a preference variable, you'll probably want to give it an initial value in the *Value:* field. For other variable types, giving the variable an initial value will not cause any behaviour.

::: danger
All variables are *case sensitive*. *xcmndhide* is not the same variable as *xcmndHide*. CpExtra ignores variables with incorrect capitalisation.
:::

::: tip
All CpExtra variables start with *x* (For e*X*tra). Therefore, when picking a variable from a drop down list the CpExtra variables will appear down the bottom.

Let's say however that there is a particular CpExtra variable you use all the time and you'd like the convenience of it storting to the *top* of the variable list.
In that case, define the CpExtra variable with an '\_' in front of its name. For example: *_xcmndHide*
CpExtra will still recognize it, and it will sort to the top of your list of variables.
:::

## Data types
Data comes in different types. For example:

- Numbers
- Strings (A fancy way of saying: Letters and words!)
- Boolean (yes or no)

Usually an action only makes sense if applied to a particular data type.

For example: xcmndRound takes a number like 3.456 and rounds it to the nearest number: 3. Would it make sense to try and round a string such as 'french fries' to it's nearest number? No, the data type is wrong.

Usually this is not something you need to worry about as CpExtra will imply the data type from what you write. But it is good to know a few bits of information about data types.

### Numbers
This counts as whole numbers (like: 2, 4, 53, 1800) and floating point numbers (1.2, 333.3333, 3.14).

However, if you're writing numbers higher than a thousand **do not** include commas like: 1,234,567. Remove the commas instead: 1234567

### String
Note that when making an assignment to a command variable, CpExtra will remove all space characters. So something like: 

<img :src="$withBase('/img/xcmndalert-with-spaces.png')" alt="assign xcmndAlert with Hello World! How Are You!">

Will effectively become:

<img :src="$withBase('/img/xcmndalert-no-spaces.png')" alt="assign xcmndAlert with HelloWorld!HowAreYou!">

To get around this, use square brackets [].
[See this page for more information.](./special-behaviour.html#for-string-values)

### Boolean
A *positive* boolean value can be written out in several ways:
- true
- yes
- 1

A *negative* boolean value can be written as follows:
- false
- no
- 0

All are equally valid.

