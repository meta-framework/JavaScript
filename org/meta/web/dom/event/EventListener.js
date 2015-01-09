/*
@identifier org.meta.web.dom.event.EventListener
@extend org.meta.logic.event.EventListener
*/
{
		global:
		{
//				EXECUTE_ONCE: EventListener.EXECUTE_ONCE,
				PROPAGATE_EVENT: EventListener.EXECUTE_ONCE << 1,
				PREVENT_DEFAULT: EventListener.EXECUTE_ONCE << 2
		},
		local:
		{
				/**
				* @link http://www.quirksmode.org/js/events_order.html
				* @link http://www.quirksmode.org/js/events_access.html
				* @link http://stackoverflow.com/questions/1000597/event-preventdefault-function-not-working-in-ie
				*/
				handleEvent: (function( ) {
						if(IS_IE && IE_VERSION < 9.0) return function handleEvent( )
						{
						
							// variables
							
							var event = DEFAULT_WINDOW.event ;
							
							//
							
//								event_object = event || DEFAULT_WINDOW.event ;
								
								if(! this.hasAttribute(EventListener.PROPAGATE_EVENT)) event.cancelBubble = true ;
								if(this.hasAttribute(EventListener.PREVENT_DEFAULT)) event.returnValue = false ;
								
								this.callback.call(null, event) ;
				
						}
						else return function handleEvent(event)
						{
						
							//
console.dir(event) ;
								if(! this.hasAttribute(EventListener.PROPAGATE_EVENT)) event.stopPropagation( ) ;
								if(this.hasAttribute(EventListener.PREVENT_DEFAULT)) event.preventDefault( ) ;
								
								this.callback.call(null, event) ;
						
						}
				})( )
		}
}