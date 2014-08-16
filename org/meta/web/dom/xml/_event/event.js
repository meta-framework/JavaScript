/*
@package org.meta.web.dom.event
@require org.meta.standard, org.meta.web.dom
@provide Events, EventListener
*/
(function( ) {

var DOM = org.meta.web.dom.DOM ;

return {

		Events:
		{
				type: Meta.constant('CONSTRUCTOR_TYPE_SINGLETON'),
				extend: 'org.meta.standard.Object',
				local: {
						/**
						* @link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener
						* @link https://developer.mozilla.org/en-US/docs/DOM/event
						* @link http://msdn.microsoft.com/en-us/library/ie/ms535863%28v=vs.85%29.aspx
						* @link name (String) The String identifier of the Event type (e.g. 'load').
						* @link listener (Function, org.meta.web.dom.event.EventListener) A listener object.
						* @link target (Element, Window) The target of the the event listener registration.
						* @todo: capture, legacy (?)
						*/
						addListener: function addListener(name, listener, target)
						{					
							
							//
							

								target.addEventListener(name, listener, false) ;

						},
						/**
						* @todo: capture, legacy (?)
						*/
						removeListener: function removeListener(name, listener, target)
						{

							//

								target.removeEventListener(name, listener, false) ;

						}
				}
		},
		
		/**
		* {@link org.meta.ui.event.EventTarget}
		*/
		EventTarget:
		{
				extend: 'org.meta.ui.event.EventTarget',
				main: function main(target) { this.listeners = [ ] ; this.target = target ; },
				global:
				{
						create: function create(target, listeners)
						{
							
							// preconditions
							
								Meta.assert(DOM.isElement(target) || Meta.isWindow(target), 'Invalid type for formal parameter `target`.') ;

							// return
						
							return new this(target) ;

						}
				},
				local:
				{
						addListener: function addListener(name, listener)
						{
							
							//

								this.super.addListener.call(this, name, listener) ;

								/*Add the event listener to the target.*/

								org.meta.web.dom.event.Events.addListener(name, listener, this.target) ;
						
						},
						removeListener: function removeListener(name, listener)
						{
						
							//
							
								this.super.removeListener.call(this, name, listener) ;
								
								org.meta.web.dom.event.Events.removeListener(name, listener, this.target) ;
							
						},
						/**
						* Remove all listeners for a given name.
						*/
						removeAllListeners: function removeAllListeners(name)
						{

							// variables
							
							var a,
								i,
								l ;
								
							//

								if((a = this.listeners[name]))
								{
								
										i = a.length ;
										
										while(--i >= 0)
										{
										
												l = a[i] ;

												org.meta.web.dom.event.Events.removeListener(name, l, this.target) ;
												
										}
										
								}
								
								delete this.listeners[name] ;

						}
				}
		},
		
		/**
		* {@link org.meta.ui.event.Listener}
		* @stub
		* @source https://dvcs.w3.org/hg/dom3events/raw-file/tip/html/DOM3-Events.html#interface-EventListener
		*/
		EventListener:
		{
				extend: 'org.meta.ui.event.EventListener'
		}

} ;
})( )