# Updating
When an update to CpExtra is released you can download it by logging in to your [www.infosemantics.com.au](https://infosemantics.com.au) account. Your profile page will give you access to your downloads. Download CpExtra again to get the latest version.

## Headless Installations
1. Copy the new **Infosemantics\_CpExtra.js** file.
2. Navigate to the Captivate install files.
::: tip Example: Captivate Program Files location for Captivate 9 on a 64bit computer
**Windows:** C:\Program Files\Adobe\Adobe Captivate 9 x64

**MAC:** Applications/Adobe Captivate 9
:::
3. Drill down to: **HTML/assets/libraries**
4. Paste the new **Infosemantics\_CpExtra.js** file to overwrite the old one.
5. Open up your Captivate project and republish.

### Updating without republishing
Here's how to update your CpExtra version in an already published Captivate Project. This can save time if you have many existing projects that use CpExtra.
1. Copy the new **Infosemantics\_CpExtra.js** file.
2. Navigate to your published Captivate Project. If it is in a zip file, you will first need to unzip it.
3. Drill down to the: **assets/libraries** folder
4. Paste the new **Infosemantics\_CpExtra.js** file to overwrite the old one.

The project is now updated. However, we still recommend you test your project to ensure it works as expected with the new version. 

## Widget Installations
1. Copy the new **Infosemantics\_CpExtra.wdgt** file.
2. Navigate to where you stored your old **Infosemantics\_CpExtra.wdgt** file.
3. Paste the new **Infosemantics\_CpExtra.wdgt** over the old one.
4. Open up your Captivate project.
5. Navigate to the slide that contains the widget.
6. Right click on the widget and pick **Update** from the context menu.
7. If this does not cause the widget to update, you will need to delete this widget and import the new one.

### Updating without republishing
1. Copy the new **Infosemantics\_CpExtra.wdgt** file.
2. Navigate to your published Captivate Project. If it is in a zip file, you will first need to unzip it.
3. Open the **wr** file.
4. You may find several folders here. The names are randomly generated, so there is no way to know which folder is correct based on it's name alone. You will need to search through each folder until you find one with a **scripts** sub-folder.
5. Open the **scripts** folder and paste the new **Infosemantics\_CpExtra.wdgt** over the old one.

The project is now updated. Once again, we recommend you test the project to ensure it still works properly.
