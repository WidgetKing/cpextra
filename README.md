# CpExtra

This project is a work in progress for creating the Adobe Captivate CpExtra extension plugin.

As a future reference to myself, this project was started back in the node 8.12 days and still uses node 8.12.0 to compile.

## Workflow Commands
List of all workflow commands used with node and gulp. Ordered from most commonly used to least often used.

### gulp compileProductionEverything
- Runs compileProductionWidget
- Copy development compiled file to production folder
- Copy effect to production folder

### gulp compileProductionWidget
- Runs compileJSOutput.
- Ensures the latest CpExtra is in widget folder.
- Adds SWF to widget folder.
- Updates SWF widget JSON.
- Updates Widget XML description.
- Create zipped .wdgt file.

### gulp compileJSOutput
- Increments build number.
- Compiles CpExtra files into javascript file in development folder.
- Writes a copy to the Widget folder.

