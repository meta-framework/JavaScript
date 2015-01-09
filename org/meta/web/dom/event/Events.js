/*
@identifier org.meta.web.dom.event.Events
@extend org.meta.Object
@require org.meta.web.dom.DOM, org.meta.web.dom.event.EventListener
@todo All listeners should by default be removed after the first call in order to avoid redundant listener registrations.
*/
{
		global:
		{
				EVENT_CLICK: 'click',
				EVENT_DOCUMENT_DOM_CONTENT_LOADED: 'DOMContentLoaded',
				EVENT_DOCUMENT_READY_STATE_CHANGE: 'readystatechange',
				EVENT_WINDOW_HASH_CHANGE: 'hashchange',
				EVENT_WINDOW_LOAD: 'load',
				EVENT_WINDOW_BEFORE_UNLOAD: 'beforeunload',
				EVENT_WINDOW_UNLOAD: 'unload',
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener
				* @link https://developer.mozilla.org/en-US/docs/DOM/event
				* @link http://msdn.microsoft.com/en-us/library/ie/ms536343%28v=vs.85%29.aspx
				* @link http://msdn.microsoft.com/en-us/library/ie/ms535863%28v=vs.85%29.aspx
				* @param target (Element, Window) The target of the the event listener registration.
				* @oaram type (String) The String identifier of the event type (e.g. 'load').
				* @param listener (Function, org.meta.web.dom.event.EventListener) A listener object.
				* @todo: polyfill; capture/ bubble
				*/
				addListener: (function( ) {
						if(isSet('addEventListener', DEFAULT_DOCUMENT)) return function addListener(target, type, listener)
						{

							// preconditions
							
								assert(isFunction(listener) || isInstanceOf(EventListener, listener), 'Invalid Argument: Argument for formal parameter "listener" must be `Function` or instance of `org.meta.web.dom.event.EventListener`') ;
								
							//

								target.addEventListener(type, listener) ;
								
						}
						else error('Not implemented.') ;
				})( ),
				/**
				* @param target (Element, Window) The target of the the event listener registration.
				* @oaram type (String) The String identifier of the event type (e.g. 'load').
				* @param listener (Function, org.meta.web.dom.event.EventListener) A listener object.
				* @todo: polyfill; capture/ bubble
				*/
				removeListener: (function( ) {
						if(isSet('removeEventListener', DEFAULT_DOCUMENT)) return function removeListener(target, type, listener)
						{
					
							// preconditions
							
								assert(isFunction(listener) || isInstanceOf(EventListener, listener), 'Invalid Argument: Argument for formal parameter "listener" must be  `Function` or instance of `org.meta.web.dom.event.EventListener`') ;
								
							//

								target.removeEventListener(type, listener) ;
								
						}
						else error('Not implemented.') ;
				})( ),
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
				* @link https://developer.mozilla.org/en-US/docs/Web/API/document.createEvent
				* @link https://developer.mozilla.org/en-US/docs/Web/API/Event
				*/
				triggerEvent: (function( ) {
						if(isSet('CustomEvent', GLOBAL_OBJECT)) return function triggerEvent(target, type, properties)
						{
// console.log('Events#triggerEvent (%s)', type) ;
// console.log('\t> properties:') ; console.dir(properties) ;
								target.dispatchEvent(new CustomEvent(type, properties)) ;
						}
						else if(isSet('Event', GLOBAL_OBJECT)) return function triggerEvent(target, type, detail)
						{
error('Not implemented') ;
						}
						else if(iSet('createEvent', DEFAULT_DOCUMENT)) return function triggerEvent(target, type, detail)
						{
error('Not implemented') ;
						}
				})( ),
				onLoad: function onLoad(window, callback)
				{
				
					// preconditions
					
						assert(isWindow(window), 'Invalid Argument: Argument for formal parameter "window" must be window object.') ;
						
					//
					
						this.addListener(window, this.EVENT_WINDOW_LOAD, callback) ;

				},
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/Events/beforeunload
				* @link http://msdn.microsoft.com/en-us/library/ms536907%28VS.85%29.aspx
				* @param (String) message An optional confirmation message to be displayed to the user in a modal dialogue.
				* @todo full polyfill
				* @todo allow only one listener (using memo function technique)
				*/
				onBeforeUnload: (function( ) {
						if(isSet('onbeforeunload', DEFAULT_WINDOW)) return function(window, callback, message) // the `onbeforeunload` property is initialized to null, if it's not there it's `undefined`
						{
						
							// preconditions
							
								assert(isWindow(window), 'Invalid Argument: Argument for formal parameter "window" must be DOM window.') ;
								
							//

								this.addListener(window, this.EVENT_WINDOW_BEFORE_UNLOAD, function(event) { (event || window.event).returnValue = message ; callback.call(null, event) ; return message ; }) ;

						}
						error('Not implemented.') ;
				})( ),
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/Events/unload
				* @link http://msdn.microsoft.com/en-us/library/ie/ms536973%28v=vs.85%29.aspx
				*/
				onUnload: function onUnload(window, callback)
				{
				
					// preconditions
					
						assert(isWindow(window), 'Invalid Argument: Argument for formal parameter "window" must be DOM window.') ;
						
					//
					
						this.addListener(window, this.EVENT_WINDOW_UNLOAD, callback) ;

				},
				onHashChange: (function( ) {
						if(isSet('onhashchange', DEFAULT_WINDOW)) return function onHashChange(window, callback)
						{
				
							// preconditions
							
								assert(isWindow(window), 'Invalid Argument: Argument for formal parameter "window" must be DOM window.') ;
								
							//

								this.addListener(window, this.EVENT_WINDOW_HASH_CHANGE, callback) ;

						}
						else error('Not implemented') ;
				})( ),
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/API/document.readyState
				* @link http://stackoverflow.com/questions/9899372/pure-javascript-equivalent-to-jquerys-ready-how-to-call-a-function-when-the
				* @todo test the bound functions arguments
				*/
				onReady: (function ( ) {
						if(isSet('addEventListener', DEFAULT_DOCUMENT)) return function onReady(document, callback)
						{
						
							// preconditions
							
								assert(DOM.isDocument(document), 'Invalid Argument: Object for formal parameter "document" must be DOM Document.') ;
								
							// variables
							
							var listener ;
							
							//
							
								/*If the document is ready, call the callback immediately. Otherwise register an event listener*/
								if(document.readyState === 'complete') callback.call(null, null) ;
								else
								{
								
										listener = (function(event, listener, callback) {
console.log('document-ready-listener:')
Array.prototype.forEach(arguments, function(argument, index) {console.log('argument #%s: %s', index, argument);}) ;
												Events.removeListener(Events.EVENT_DOCUMENT_DOM_CONTENT_LOADED, listener, document) ;
												callback.call(null, event) ;
												
										}).bind(null, listener, callback) ;

										this.addListener('DOMContentLoaded', listener, document) ;
								}

						}
						else if(isSet('attachEvent', DEFAULT_DOCUMENT)) return function onReady(document, callback)
						{
						
							// preconditions
							
								assert(DOM.isDocument(document), 'Invalid Argument: Object for formal parameter "document" must be DOM Document.') ;

							// variables
							
							var listener ;
							
							//
							
								/*If the document is ready, call the callback immediately. Otherwise register an event listener*/
								if(document.readyState === 'complete') callback.call(null, null) ;
								else
								{
								
										listener = Function.prototype.bind.apply(
												function(event, listener, callback) {
console.log('document-ready-listener:')
Array.prototype.forEach(arguments, function(argument, index) {console.log('argument #%s: %s', index, argument);}) ;
														Events.removeListener(Events.EVENT_DOCUMENT_READY_STATE_CHANGE, listener, document) ;
														callback.call(null, event) ;
														
												},
												[listener, callback]
										) ;

										this.addListener('readystatechange', listener, document) ;
								}

						}
						else error('Unknown DOM event model implementation.') ;
				})( )
		}
}