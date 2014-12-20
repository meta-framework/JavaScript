/*
@identifier org.meta.web.dom.event.EventTarget
@extend org.meta.logic.event.EventTarget
@require org.meta.web.dom.event.Events, org.meta.web.dom.event.EventListener
*/
{
		main: function main(target)
		{
		
				this.target = target ;
				this.listeners = { } ;

		},
		global:
		{
				create: function create(target)
				{
					
					// preconditions
					
						assert(DOM.isElement(target) || DOM.isDocument(target) || isWindow(target), 'Invalid type for formal parameter `target`.') ;

					// return
				
						return new this(target) ;

				}
		},
		local:
		{
				destroy: function destroy( )
				{

						/*Unregister this event target's event listeners from the underlying DOM event target.*/
						objectEach(this.listeners, function(list, event){
								list.forEach(function(listener) { Events.removeListener(this.target, event, listener) ; }) ;
						}) ;
					
						org.meta.web.dom.event.EventTarget.super.invoke('destroy', this) ; // implicitely destroys `.listeners`

				},
				addListener: function addListener(event, listener)
				{
					
					//

						/*Add the listener to the listener collection.*/
						EventTarget.super.invoke('addListener', this, [event, listener]) ;

						/*Add the event listener to the DOM object.*/
						Events.addListener(this.target, event, listener) ;
				
				},
				removeListener: function removeListener(event, listener)
				{
				
					//

						/*Remove the listener from the listener collection.*/
						EventTarget.super.invoke('removeListener', this, [event, listener]) ;
					
						/*Remove the listener from the DOM object.*/
						Events.removeListener(this.target, event, listener) ;
					
				},
				/**
				* @param (String) event The event name.
				* @param (Object) data An object containing event data.
				*/
				triggerEvent: function triggerEvent(event, data, attributes)
				{

						Events.triggerEvent(
								this.target,
								event,
								{
										bubbles: ((attributes & Events.EVENT_BUBBLES) === 1),
										cancelable: ((attributes & Event.EVENT_CANCELABLE) === 1),
										detail: data
								}
						) ;
				}
		}
}