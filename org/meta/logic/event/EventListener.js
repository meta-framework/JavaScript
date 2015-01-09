/*
@identifier org.meta.logic.event.EventListener
@extend org.meta.logic.Setable
@description Basic implementation of a listener object in the event model.
*/
{
		main: function main(callback, attributes)
		{
				this.callback = callback ;
				this.attributes = attributes || 0 ;
		},
		global:
		{
				EXECUTE_ONCE: 1,
				create: function create(callback, attributes)
				{
		
					// preconditions
					
						assert(isFunction(callback), 'Illegal Argument: Argument for formal parameter "callback" must be function.') ;
					
					// return
					
						return new this(callback, attributes) ;

				}
		},
		local: {
				/**
				* @type Function
				*/
				callback: null,
				/**
				* Handle the event this listener is registered for.
				*
				* @param (Object) event An event object.
				*/
				handleEvent: function handleEvent(event) { this.callback.call(this, event) ; }
		}
}