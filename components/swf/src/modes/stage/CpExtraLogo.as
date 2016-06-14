package modes.stage 
{
	import flash.display.Sprite;
	import flash.display.DisplayObject;
	/**
	 * ...
	 * @author TristanWard
	 */
	public class CpExtraLogo extends Sprite
	{
		
		[Bindable]
        [Embed(source="../../../lib/CpExtraLogo_400x249.png")]
        private var logo:Class;

        public function CpExtraLogo()
        {
            addChild(new logo() as DisplayObject);
        }
		
	}

}