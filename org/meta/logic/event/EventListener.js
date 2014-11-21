/*
@identifier org.meta.logic.event.EventListener
@extend org.meta.standard.Callable
@require org.meta.standard.Callable, org.meta.standard.Timeout
@description Basic implementation of a listener object in the event model.
*/
{
		main: function main(callback, parameter, attributes)
		{
				this.callback = callback ;
				this.parameter = parameter ;
				this.attributes = attributes ;
		},
		global:
		{
				create: function create(callback, parameter, attributes)
				{
		
					// preconditions
					
						assert(isFunction(callback), 'Invalid type for parameter `callback`.') ;
					
					// variables
					
					var listener ;
					
					//
					
						listener = new this(callback, parameter || null, attributes || Callable.ATTRIBUTE_EXCECUTE_ONCE) ;
						listener.activate( ) ;
						
					// return
					
					return listener ;

				}
		},
		local: {
				/**
				* Handle the event this listener is registered for.
				*
				* The callback handling the event for this listener is called with context fixed to this listener instance and receives an event object characterizing the event.
				*/
				handleEvent: function handleEvent(event) { console.log(this.toString( ));this.call(event) ; }
		}
}