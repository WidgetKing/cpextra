package modes.stage 
{
	import flash.text.TextField;
	import widgetfactory.modes.StageMode;
	/**
	 * ...
	 * @author TristanWard
	 */
	public class CPExtraStageMode extends StageMode
	{
		
		public function CPExtraStageMode() 
		{
			
		}
		
		override protected function initiate():void 
		{
			super.initiate();
			
			var textField:TextField = new TextField();
			addChild(textField);
			textField.text = "Captivate Extra";
		}
		
	}

}