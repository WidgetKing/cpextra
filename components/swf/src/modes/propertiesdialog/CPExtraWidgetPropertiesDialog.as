package modes.propertiesdialog 
{
	import flash.text.TextField;
	import widgetfactory.modes.WidgetPropertiesDialogMode;
	import flash.text.TextFieldAutoSize;
	
	/**
	 * ...
	 * @author TristanWard
	 */
	public class CPExtraWidgetPropertiesDialog extends WidgetPropertiesDialogMode 
	{
		
		public static const PROPERTIES_DIALOG_WIDTH:int = 350;
		public static const PROPERTIES_DIALOG_HEIGHT:int = 100;
		
		public static const BUFFER:int = 10;
		
		public function CPExtraWidgetPropertiesDialog() 
		{
			super(PROPERTIES_DIALOG_WIDTH, PROPERTIES_DIALOG_HEIGHT);
		}
		
		override protected function initiate():void 
		{
			super.initiate();
			
			drawBackground();
			
			var message:TextField = new TextField();
			message.width = PROPERTIES_DIALOG_WIDTH - BUFFER * 2;
			//message.autoSize = TextFieldAutoSize.LEFT;
			message.multiline = true;
			message.wordWrap = true;
			addChild(message);
			message.htmlText = "Captivate Extra does not currently have any features that can be customized in the Widget Properties Dialog. <br><a href='http://www.google.com/'><u><font color='#0000FF'>CLICK HERE to read the documentation for Captivate Extra</font></u></a>";

			message.x = BUFFER;
			message.y = BUFFER;
			
		}
		
	}

}