/*
@identifier org.meta.logic.event.EventListener
@extend org.meta.logic.Callable
@description Basic implementation of a listener object in the event model.
*/
{
		main: function main(callback/*, parameter*/, attributes)
		{
				this.callback = callback ;
//				this.parameter = parameter ;
				this.attributes = attributes ;
		},
		global:
		{
				create: function create(callback/*, parameter*/, attributes)
				{
		
					// preconditions
					
						assert(isFunction(callback), 'Illegal Argument: Invalid type for formal parameter `callback`.') ;
					
					// variables
					
					var listener ;
					
					//
					
						listener = new this(callback, attributes || EventListener.EXCECUTE_ONCE) ;
//						listener.activate( ) ;
						
					// return
					
					return listener ;

				}
		},
		local: {
				/**
				* Handle the event this listener is registered for.
				*/
				handleEvent: function handleEvent(event) { this.call(event) ; }
		}
}