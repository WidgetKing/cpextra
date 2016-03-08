package modes.propertiesdialog 
{
	import com.infosemantics.update.UpdateGlobe;
	import flash.display.MovieClip;
	import flash.net.URLLoader;
	import flash.net.URLRequest;
	import flash.text.TextField;
	import widgetfactory.modes.WidgetPropertiesDialogMode;
	import flash.text.TextFieldAutoSize;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import modes.propertiesdialog.CpExtraInterface;
	
    import com.infosemantics.widgets.ui.InfosemanticsInterfaceHeader;
	import com.infosemantics.components.skin.GlobalStyles;
	import com.adobe.serialization.json.JSON;
	
	/**
	 * ...
	 * @author TristanWard
	 */
	public class CPExtraWidgetPropertiesDialog extends WidgetPropertiesDialogMode 
	{
		
		
		public static const PROPERTIES_DIALOG_WIDTH:int = 500;
		public static const PROPERTIES_DIALOG_HEIGHT:int = 600;
		
		public static const BUFFER:int = 10;
		
		private static const GLOBE_RADIUS:int = 10;
		
		[Embed(source = "../../../lib/CpExtraLogoAnimation-1.swf")]
		public var Logo:Class;
		
		private var ui:CpExtraInterface;
		
		public function CPExtraWidgetPropertiesDialog() 
		{
			super(PROPERTIES_DIALOG_WIDTH, PROPERTIES_DIALOG_HEIGHT);
		}
		
		override protected function initiate():void 
		{
			super.initiate();
			
			drawBackground();
			
			GlobalStyles.labelStyle.fontSize = 12;
			
			ui = new modes.propertiesdialog.CpExtraInterface();
			ui.init();
			addChild(ui);
			ui.setAnimation(new Logo());
			
			
			loadVersionData();
		}
		
		private function loadVersionData():void
		{
			var loader:URLLoader = new URLLoader();
			loader.load(new URLRequest("swf/version.json"));
			loader.addEventListener(Event.COMPLETE, onVersionDataLoaded);
			loader.addEventListener(IOErrorEvent.IO_ERROR, onIOError);
		}
		
		private function onIOError(event:IOErrorEvent):void
		{
			trace(event.text);
		}
		
		private function onVersionDataLoaded(event:Event):void
		{
			
			try {
			var data:String = String(event.target.data);
			var json:Object = com.adobe.serialization.json.JSON.decode(data);
			ui.setVersionData(json);
			
			var updateGlobe:UpdateGlobe = new UpdateGlobe("http://www.infosemantics.com.au/assets/widgets/versions/cpextra.xml", json.version, this);
			updateGlobe.radius = GLOBE_RADIUS;
			updateGlobe.x = PROPERTIES_DIALOG_WIDTH - (GLOBE_RADIUS * 2) - BUFFER;
			updateGlobe.y = BUFFER + GLOBE_RADIUS;
			} catch (e:Error) {
				ui.versionLabel.text = e.message
			}
		}
		
		private function createUpdateHeader():void
        {
            var header:InfosemanticsInterfaceHeader = new InfosemanticsInterfaceHeader();
            header.width = PROPERTIES_DIALOG_WIDTH;
            header.height = PROPERTIES_DIALOG_HEIGHT;
            addChild(header);
            header.setText(new CpExtraInfo());
            header.setVersion(CPExtra.VERSION, "http://www.infosemantics.com.au/assets/widgets/versions/cpextra.xml", "help url", CPExtra.IS_TRAIL);
        }
		
	}

}