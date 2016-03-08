package 
{
	import flash.display.Sprite;
	import flash.events.Event;
	import modes.stage.CPExtraStageMode;
	import modes.propertiesdialog.CPExtraWidgetPropertiesDialog;
	import widgetfactory.Widget;
	
	/**
	 * ...
	 * @author TristanWard
	 */
	public class CPExtra extends Widget 
	{
		public static const VERSION:String = "0.0.2";
		public static const IS_TRAIL:Boolean = false;
		
		public function CPExtra():void {
			
			super();
			//initiatePropertiesDialogMode();
		}
		/*public function CPExtra()
        {
            WidgetDebugger.debugger = new WidgetArthropodDebugger();

            super();
        }*/

        override protected function createWidgetModes():void
        {
            super.createWidgetModes();

            new CPExtraWidgetPropertiesDialog();
			new CPExtraStageMode();
        }
		
	}
	
}