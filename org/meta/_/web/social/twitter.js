Pulse.declare("pulse.web.social")
.define(  {
		name: "Twitter",
		package: "pulse.web.social",
		prototype: "pulse.logic.Eventable",
		type: Pulse.STRING_OBJECT_TYPE_SINGLETON,
		global: {
				WIDGETS_URL: "http://platform.twitter.com/widgets.js",
				SCRIPT_ID: "twitter-wjs"
		},
		public: {
				createButton: function createShareButton(parameter) 
				{

					// set variables
					
					var o ;
					var n ;
					
					// set ?
					
						pulse.dom.Document.select(parameter.path)
						.setAttribute(parameter.attributes) ;
						
						pulse.dom.Document.select("//script[attribute('src')='" + pulse.web.social.Twitter.WIDGETS_URL + "']") ;
						
						if( !! pulse.dom.Document.size( ) ) { pulse.dom.Document.remove( ) ; }
						
						pulse.dom.Document.select(  ( n = pulse.dom.DOM.createElement("script") )  )
						.setAttribute(  {
								id: pulse.web.social.Twitter.SCRIPT_ID,
								src: pulse.web.social.Twitter.WIDGETS_URL,
								type: "text/javascript"
						}  ) 
						.select("//head/script")
						.insert(n,0) ;

					// return this
					
					return this ;
					
				}
		},
		local: {
				main: function( ) {
						this.properties = { } ;
						this.handlers = { } ;
				}
		}
}  ) ;