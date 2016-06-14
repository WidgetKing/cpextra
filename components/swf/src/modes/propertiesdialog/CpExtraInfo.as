package modes.propertiesdialog 
{
	import com.infosemantics.widgets.ui.IBasicWidgetInfo;
	
	/**
	 * ...
	 * @author TristanWard
	 */
	public class CpExtraInfo implements IBasicWidgetInfo 
	{
		
		public function CpExtraInfo() 
		{
			
		}
		
		
        public function get title():String {
			return "CpExtra";
		}

        public function get version():String {
			return "Version: ";
		}
		
	}

}