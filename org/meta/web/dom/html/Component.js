/*
@identifier org.meta.web.dom.html.Component
@extend org.meta.web.dom.Component
@require org.meta.web.dom.html.HTML, org.meta.web.dom.event.EventTarget
*/
{
		extend: 'org.meta.web.dom.Component',
		main: function main(root, target)
		{
				this.root = root ;
				this.target = target ;
				this.children = [ ] ;
		},
		global:
		{
				create: function create(root)
				{
				
					// preconditions

						assert(DOM.isElement(root) && HTML.namespaceOf(root) === HTML.NAMESPACE_URI, 'Illegal Argument: Invalid type for formal parameter `root`.') ;
				
					// return
					
					return new this(root, EventTarget.create(root)) ;
					
				}
		},
		local:
		{
				/**
				* @type EventTarget
				*/
				target: null,
				destroy: function destroy( )
				{
				
						/*Destroy the event target instance releasing all listeners.*/

						this.target.destroy( ) ;
						
						if(this.super.destroy) this.super.destroy.call(this) ;
				
				},
				setClass: function addClass(name) { HTML.setClass(name, this.root) ; },
				getClass: function getClass( ) { return	HTML.getClass(this.root) ; },
				addClass: function addClass(name) { HTML.addClass(name, this.root) ; },
				removeClass: function removeClass(name) { HTML.removeClass(name, this.root) ; },
				toggleClass: function toggleClass(name) { HTML.toggleClass(name, this.root) ; },
				/**
				* Register a 'load' handler for this component.
				*
				* @param (String) name The event name to register the given action.
				* @param (EventListener) listener An event listener.
				*/
				onEvent: function onEvent(name, listener)
				{
console.log('Component.onEvent("%s", %s)', name, listener) ;
					//
					
						this.target.addListener(name, listener) ;
				
				},
				/**
				* Listen to the document ready event.
				*/
				onReady: (function( ) {				
						if(isSet('readyState', constant('DEFAULT_DOCUMENT'))) return function onReady(listener)
						{
						
							// variables
							
							var component = this,
								d ;
							
							//
							
								this.target.super.addListener.apply(this.target, ['ready', listener]) ;
							
								if((d = constant('DEFAULT_DOCUMENT')) !== 'complete') d.onreadystatechange = function( ) { if(d.readyState === 'complete') component.target.triggerEvent('ready', null) ; } ;

						
						}
						else return function onReady(listener)
						{
						
							// variables
							
							var component = this,
								t ;
							
							//
						
								this.target.super.addListener.apply(this.target, ['ready', listener]) ;
								
								t = EventTarget.create(this.document) ;
								t.addListener(
										'DOMContentLoaded',
										EventListener.create(
												function( ) {

														component.triggerEvent('ready', null) ;
														
														t.destroy( ) ;
														
												},
												null,
												EventListener.ATTRIBUTE_EXECUTE_ONCE
										)
								) ;
								
						}
				})( )
		}
}