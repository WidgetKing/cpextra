package modes.stage 
{
	import com.infosemantics.components.script.Label;
	import flash.text.TextField;
	import widgetfactory.modes.StageMode;
	/**
	 * ...
	 * @author TristanWard
	 */
	public class CPExtraStageMode extends StageMode
	{
		private const WIDTH:int = 500;
		private const HEIGHT:int = 400;
		private const BUFFER:int = 15;
		
		public function CPExtraStageMode() 
		{
			
		}
		
		override protected function initiate():void 
		{
			super.initiate();
			
			var label:Label = new Label(this);
			label.text = "Create two blank slides, each lasting one second. Put them both at the start of the movie. Put this widget on the second slide.";
			label.wrapWidth = WIDTH - BUFFER * 2;
			label.labelStyle.align = "center";
			label.labelStyle.fontSize = 12;
			label.draw();
			label.y = HEIGHT - label.height - BUFFER;
			label.x = BUFFER;
			
			var logo:CpExtraLogo = new CpExtraLogo();
			addChild(logo);
			logo.y = HEIGHT / 2 - logo.height / 2;
			logo.x = WIDTH / 2 - logo.width / 2;
			
		}
		
	}

}