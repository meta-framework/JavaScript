Pulse.declare("pulse.web.social")
.define(  {
		name: "Facebook",
		package: "pulse.web.social",
		prototype: "pulse.logic.Eventable",
		type: Pulse.STRING_OBJECT_TYPE_SINGLETON,
		global: {
				SDK_URL: "http://connect.facebook.net/de_DE/all.js#xfbml=1",
				SCRIPT_ID: "facebook-jssdk",
				LAYOUT_STANDARD: "standard",
				LAYOUT_BUTTON_COUNT: "button_count",
				LAYOUT_BOX_COUNT: "box_count",
		},
		public: {
				createButton: function createShareButton(parameter) 
				{
try {
					// set variables
					
					var o ;
					var n ;
					
					// set ?
					
						pulse.dom.Document.select(parameter.path)
						.setAttribute(parameter.attributes) ;
						
						if( parameter["data-width"] === "auto" ) {
						
								s = ( pulse.dom.Document.parent( )
								.getWidth( ) || 0 ) + "px" ;
								
								parameter["data-width"] = s ;

						}
						
						pulse.dom.Document.select("//script[attribute('src')='" + pulse.web.social.Facebook.SDK_URL + "']") ;
						
						if( !! pulse.dom.Document.size( ) ) { pulse.dom.Document.remove( ) ; }
						
						pulse.dom.Document.select(  ( n = pulse.dom.DOM.createElement("script") )  )
						.setAttribute(  {
								id: pulse.web.social.Facebook.SCRIPT_ID,
								src: pulse.web.social.Facebook.SDK_URL,
								type: "text/javascript"
						}  ) 
						.select("//head/script")
						.insert(n,0) ;
} catch(error) { Pulse.logError(error) ; }
					// return this
					
					return this ;
					
				}
		},
		local: {
				main: function main( ) {

						this.properties = { } ;
						this.handlers = { } ;

						pulse.dom.Document.ready(  function( ) {
								
								pulse.dom.Document.select( pulse.dom.DOM.createElement("div") )
								.attribute("id","fb-root")
								.appendTo(Pulse.DEFAULT_DOCUMENT.body) ;

						}  ) ;

				}
		}
}  ) ;