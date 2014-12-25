/*
@identifier org.meta.web.dom.event.Events
@extend org.meta.Object
@require org.meta.web.dom.DOM
*/
{
		global:
		{
				CANCELABLE_EVENT: 1,
				BUBBLING_EVENT: 1 << 1,
//				EVENT_DOCUMENT_READY: 'ready',
				EVENT_WINDOW_LOAD: 'load',
				EVENT_WINDOW_BEFORE_UNLOAD: 'beforeunload',
				EVENT_WINDOW_UNLOAD: 'unload',
				/**
				* @deprecated
				*/
				EVENT_LOCATION_HASHCHANGE: 'hashchange',
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget.addEventListener
				* @link https://developer.mozilla.org/en-US/docs/DOM/event
				* @link http://msdn.microsoft.com/en-us/library/ie/ms535863%28v=vs.85%29.aspx
				* @oaram event (String) The String identifier of the event type (e.g. 'load').
				* @param listener (Function, org.meta.web.dom.event.EventListener) A listener object.
				* @param target (Element, Window) The target of the the event listener registration.
				* @todo: capture, legacy (?)
				*/
				addListener: (function( ) {
						if(isSet('addEventListener', DEFAULT_DOCUMENT)) return function addListener(target, event, listener)
						{
					
							//
							

								target.addEventListener(event, listener, false) ;
								
						}
						else if(isSet('attachEvent', DEFAULT_DOCUMENT)) return function addListener(target, event, listener)
						{
						
							//
							
								target.attachEvent('on' + event, listener) ;

						}
						else error('Unknown DOM event model implementation.') ;
				})( ),
				/**
				* @todo: capture, legacy (?)
				*/
				removeListener: (function( ) {
						if(isSet('removeEventListener', DEFAULT_DOCUMENT)) return function removeListener(target, event, listener)
						{
					
							//
							

								target.removeEventListener(event, listener, false) ;
								
						}
						else if(isSet('detachEvent', DEFAULT_DOCUMENT)) return function removeListener(target, event, listener)
						{
						
							//
							
								target.detachEvent('on' + event, listener) ;

						}
						else error('Unknown DOM event model implementation.') ;
				})( ),
				/**
				* @link https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events
				* @link https://developer.mozilla.org/en-US/docs/Web/API/document.createEvent
				* @link https://developer.mozilla.org/en-US/docs/Web/API/Event
				*/
				triggerEvent: (function( ) {
						if(isSet('CustomEvent', GLOBAL_OBJECT)) return function triggerEvent(target, event, properties)
						{
								target.dispatchEvent(new CustomEvent(event, properties)) ;
						}
						else if(isSet('Event', GLOBAL_OBJECT)) return function triggerEvent(target, event, properties)
						{
error('Not implemented') ;
						}
						else if(iSet('createEvent', DEFAULT_DOCUMENT)) return function triggerEvent(target, event, properties)
						{
error('Not implemented') ;
						}
				})( ),
				onLoad: function onLoad(window, callback)
				{
				
					// preconditions
					
						assert(isWindow(window), 'Invalid Argument: Argument for formal parameter "window" must be window object.') ;
						
					//
					
						Events.addListener(window, Events.EVENT_WINDOW_LOAD, callback) ;

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

								this.addListener(window, Events.EVENT_WINDOW_BEFORE_UNLOAD, function(data) { (data || window.event).returnValue = message ; callback.call(null, data) ; return message ; }) ;

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
					
						Events.addListener(window, Events.EVENT_WINDOW_UNLOAD, callback) ;

				},
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
												Events.removeListener('DOMContentLoaded', listener, document) ;
												callback.call(null, event) ;
												
										}).bind(null, listener, callback) ;

										Events.addListener('DOMContentLoaded', listener, document) ;
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
														Events.removeListener('readystatechange', listener, document) ;
														callback.call(null, event) ;
														
												},
												[listener, callback]
										) ;

										Events.addListener('readystatechange', listener, document) ;
								}

						}
						else error('Unknown DOM event model implementation.') ;
				})( )
		}
}