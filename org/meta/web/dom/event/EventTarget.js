/*
@identifier org.meta.web.dom.event.EventTarget
@extend org.meta.logic.event.EventTarget
@require org.meta.web.dom.event.Events, org.meta.web.dom.event.EventListener
*/
{
		main: function main(target)
		{
		
				this.target = target ;
//				this.listeners = { } ;

		},
		global:
		{
				create: function create(target)
				{
					
					// preconditions
					
						assert(DOM.isElement(target) || DOM.isDocument(target) || isWindow(target), 'Invalid Argument: Argument for formal parameter "target" must be DOM element, DOM document or DOM window.') ;

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
				/**
				* @param (String) type The event name to register the given listener for.
				* @param (EventListener) listener An event listener instance.
				*/
				addListener: function addListener(type, listener)
				{
					
					//
					
						/*Add the listener to the listener collection.*/
						org.meta.web.dom.event.EventTarget.super.invoke('addListener', this, type, listener) ;

						/*Add the event listener to the DOM object.*/
						Events.addListener(this.target, type, listener) ;
				
				},
				/**
				* @param (String) type The event name to remove the given listener for.
				* @param (EventListener) listener An event listener instance.
				*/
				removeListener: function removeListener(type, listener)
				{
				
					//

						/*Remove the listener from the listener collection.*/
						org.meta.web.dom.event.EventTarget.super.invoke('removeListener', this, type, listener) ;
					
						/*Remove the listener from the DOM object.*/
						Events.removeListener(this.target, type, listener) ;
					
				},
				/**
				* {@see org.meta.web.dom.event.Events}
				* @link https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
				* @param (String) type The event type.
				* @param (Object) properties An object containing properties characterizing the event.
				*/
				triggerEvent: function triggerEvent(type, properties)
				{
// console.log('%s#triggerEvent (%s)', this.constructor.getType( ), type) ;
						Events.triggerEvent(
								this.target,
								type,
								properties/*
								{
										bubbles: ((attributes & Events.EVENT_BUBBLES) === 1),
										cancelable: ((attributes & Event.EVENT_CANCELABLE) === 1),
										detail: detail
								}*/
						) ;
				}
		}
}