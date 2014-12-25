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
						objectEach(this.listeners, function(listeners, event) {
						
							var next ;

								next = listeners ;

								do Events.removeListener(this.target, event, next.listener) ;
								while((next = next.next) !== listeners) ;
								
						}, this) ;
					
						/*Destroy this object.*/
						objectDestroy(this) ; // call to super's destroy operation is skipped since it contains redundant event listener removal

				},
				addListener: function addListener(event, listener)
				{
					
					//

						/*Add the listener to the listener collection.*/
						org.meta.web.dom.event.EventTarget.super.invoke('addListener', this, [event, listener]) ;

						/*Add the event listener to the DOM object.*/
						Events.addListener(this.target, event, listener) ;
				
				},
				removeListener: function removeListener(event, listener)
				{
				
					//

						/*Remove the listener from the listener collection.*/
						org.meta.web.dom.event.EventTarget.super.invoke('removeListener', this, [event, listener]) ;
					
						/*Remove the listener from the DOM object.*/
						Events.removeListener(this.target, event, listener) ;
					
				},
				/**
				* {@see org.meta.web.dom.event.Events}
				* @link https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
				* @param (String) event The event name.
				* @param (Object) detail An object the properties of which characterize the event.
				* @param (Integer) attribute An attribute bitmap containing bit flags for certain event properties
				*/
				triggerEvent: function triggerEvent(event, detail, attributes)
				{

						Events.triggerEvent(
								this.target,
								event,
								{
										bubbles: ((attributes & Events.EVENT_BUBBLES) === 1),
										cancelable: ((attributes & Event.EVENT_CANCELABLE) === 1),
										detail: detail
								}
						) ;
				}
		}
}