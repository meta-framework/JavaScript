/*
@identifier org.meta.web.Request
@extend org.meta.logic.event.EventTarget
@description An object wrapper for the XMLHttpRequest object (or similar implementation of XHR).
@todo [1] full list of HTTP headers
@deprecated: refactored into core functions `request*`
*/
{
		main: function main(request)
		{

				this.request = request ;
				this.listeners = { } ;
				
				this.headers = { } ;			

		}, 
		global: {
				EVENT_REQUEST_ERROR: 'requestError',
				EVENT_TIMEOUT: 'timeOut',
				/**@deprecated*/
				EVENT_READY_STATE_CHANGE: 'readyStateChanage',
				/**
				* Default settings.
				* @deprecated
				*/
				REQUEST_PARAMETER: {
						uri: null, method: 'GET', mime: 'application/xml', async: true, binary: false,
						cache: true, query: null, unsent: null, openend: null, received: null,
						loading: null, done: null, parameter: null, flag: true
				},
				ATTRIBUTE_ASYNCHRONOUS: 1,
				ATTRIBUTE_BINARY: 1 << 1,
				ATTRIBUTE_CACHE: 1 << 2,
				ATTRIBUTE_FLAG: 1 << 3,
				HTTP_METHOD_GET: 'GET',
				HTTP_METHOD_POST: 'POST',
				HTTP_METHOD_HEADER: 'HEADER',
				//[1]
				HTTP_REQUEST_METHODS: ['GET', 'POST', 'HEADER'],
				MIME_TEXT: 'text/plain',
				MIME_CSS: 'text/css',
				MIME_XML: 'application/xml',
				MIME_JSON: 'text/json',
				MIME_JAVASCRIPT: 'application/javascript',
				READY_STATE_UNSENT: 0,
				READY_STATE_OPENEND: 1,
				READY_STATE_RECEIVED: 2,
				READY_STATE_LOADING: 3,
				READY_STATE_DONE: 4,
				READY_STATE_NAMES: ['unsent','openend','received','loading','done'],
				MS_ACTIVEX_XHR: ['Msxml2.XMLHTTP.6.0','Msxml2.XMLHTTP.3.0','Microsoft.XMLHTTP'],
				MS_ACTIVEX_XHR_IMPLEMENTATION: null,
				createRequestObject: (function( ) {
				
					// variables
					
					var r ;
					
					//
					
						if((r = GLOBAL_OBJECT.XMLHttpRequest)) return function createRequestObject( ) { return new r( ) ; } ;
						else if(IS_IE)
						{
						
								arraySome(Request.MS_ACTIVEX_XHR, function(name) {
								
										try { if(! isNull(new ActiveXObject(name))) { Request.MS_ACTIVEX_XHR_IMPLEMENTATION = name ; return true ; } }
										catch(e) { }
										
								}) ;
								
								assert(isSet(Request, 'MS_ACTIVEX_XHR_IMPLEMENTATION'), 'Illegal State: unable to identify XMLHTTP implementation.') ;

								return function createRequestObject( ) { return new ActiveXObject(Request.MS_ACTIVEX_XHR_IMPLEMENTATION) ; }
						}
						else throw new Error('Unknown XHR implementation.') ;

				})( ),
				create: function create(attributes)
				{
				
					// variables
					
					var request,
						r ;
					 
					//
console.log('Request::create(%s)', attributes) ;
						request = new this((r = Request.createRequestObject( ))) ;
						
//						request.setURI(uri) ;
						
						if(attributes) request.setAttributes(attributes) ;
						else
						{
						
								request.setAttribute(Request.ATTRIBUTE_ASYNCHRONOUS) ;
								request.setAttribute(Request.ATTRIBUTE_CACHE) ;
								request.setAttribute(Request.ATTRIBUTE_FLAG) ;

						}

						request.setMethod(Request.HTTP_METHOD_GET) ;
						request.setMIMEType(Request.MIME_XML) ;
						
						/*Never time out.*/

						request.setTimeout(0) ;
						
						r.onreadystatechange = function( ) {
						
							// variables
							
							var status,
								state ;
						
								if((status = request.getStatus( ) - 400 > 0)) request.triggerEvent(Request.EVENT_ERROR, {status: status}) ;
								else switch((state = request.getReadyState( )))
								{
										case Request.READY_STATE_DONE:
												if(status === 200) request.triggerEvent(Request.READY_STATE_NAMES[state]) ;
												else request.triggerEvent(Request.Event_Error, {status: status}) ;
										break ;
										default: request.triggerEvent(Request.READY_STATE_NAMES[state], null) ;
								}
								
						}
						
						r.ontimeout = function( ) { request.triggerEvent(Request.EVENT_REQUEST_TIMEOUT, null) ; }

					// return
					
					return request ;
					
				}
		},
		local: {
				request: null,
				uri: null,
				method: null,
				headers: null,
				body: null,
				/*@deprecated*/
				parameter: null,
				setURI: function setURI(uri) { this.uri = uri ; },
				getURI: function getURI( ) { return this.uri ; },
				setMethod: function setMethod(method)
				{
				
					// preconditions
					
						assert(Request.HTTP_REQUEST_METHODS.indexOf(method) !== -1, 'Illegal Argument: invalid HTTP request method (request-method="%s")', method) ;
						
					//
				
						this.method = method ;
						
				},
				getMethod: function getMethod( ) { return this.method ; },
				setHeader: function setHeader(name, value)
				{
				
					// variables
					
					var a ;
					
					//
					
						if((a = this.headers[name])) a[a.length] = value ;
						else this.headers[name] = [value] ;

				},
				getHeaders: function getHeaders(name)
				{
					return this.headers[name] || null ;
				},
				setTimeout: function setTimeout(timeout) { this.timeout = timeout ; },
				getTimeout: function getTimeout( ) { return this.timeout ; },
				setMIMEType: function setMIMEType(mime) { this.mime = mime },
				getMIMEType: function getMIMEType( ) { return this.mime ; },
				setRequestBody: function setRequestBody(body) { this.body = body ; },
				getRequestBody: function getRequestBody( ) { return this.body ; },
				getStatus: function getStatus( ) { return this.request.status ; },
				getReadyState: function getReadyState( ) { return this.request.readyState ; },
				getStatus: function getStatus( ) { return this.request.status ; },
				/**
				* @deprecated
				* @todo refactor into `Response` type.
				*/
				responseXML: function responseXML( ) { return this.request.responseXML ; },
				/**
				* @deprecated
				* @todo refactor into `Response` type.
				*/
				responseText: function responseText( ) { return this.request.responseText ;	},
				/**
				@Link http://en.wikipedia.org/wiki/List_of_HTTP_header_fields
				*/
				send: function send( )
				{

					// set xhr
console.log('Request.send') ;
console.log('uri: "%s"', this.getURI( )) ;
console.log('method: "%s"', this.getMethod( )) ;
console.log('async: "%s"', this.hasAttribute(Request.ATTRIBUTE_ASYNCHRONOUS)) ;
						this.request.open(this.getMethod( ), this.getURI( ), this.hasAttribute(Request.ATTRIBUTE_ASYNCHRONOUS)) ;
/*@deprecated
						this.request.onreadystatechange = Meta.bind(
								function anonymous$Request$send(event) {

									var i, s ;

										i = this.readyState( ) ;

										if(i === this.constructor.READY_STATE_DONE) {
										
											/*Check for errors.*
											
											if(this.request.status !== 200) {
											
													this.triggerEvent("error", event) ;
													this.request.abort( ) ;
											
													return true ;
													
											}
											
										}
										
										s = this.constructor.READY_STATE_NAMES[i] ;

										this.triggerEvent(s,event) ;
								
								},
								this												
						) ;
*/
console.log('mime: "%s"', this.mime) ;
						this.request.overrideMimeType(this.mime) ;

						switch(this.method)
						{
								case Request.HTTP_METHOD_GET: this.request.setRequestHeader('Content-Type', 'XMLHTTP/1.0') ; break ;
								case Request.HTTP_METHOD_POST: this.request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded') ;
								default: error('Unsupported Operation: HTTP method currently not supported (method="%s")', this.method) ;
						}
						
						/*Add headers.*/
						
						objectEach(this.headers, function(values, header) {
								arrayEach(values, function(value) { this.request.setRequestHeader(header, value) ; }, this) ;
						}, this) ;
/*@deprecated
						if(s1 === this.constructor.HTTP_METHOD_GET) { this.request.setRequestHeader("Content-Type","XMLHTTP/1.0") ; }
						else if(s1 === this.constructor.HTTP_METHOD_POST) { this.request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded") ; }
						else { Meta.error("Unsupported HTTP request method (method=``%1;'')",s1) ; }
*/
						/*As per convention.*/
						
						if(this.hasAttribute(Request.ATTRIBUTE_FLAG)) this.request.setRequestHeader('X-Requested-With', 'XMLHttpRequest') ;
						
//						if(this.parameter.flag) { this.request.setRequestHeader("X-Requested-With", "XMLHttpRequest") ; }
/*@deprecated
						s1 = ( this.parameter.body || null ) ;

						if(!! this.parameter.binary) { this.request.sendAsBinary(s1) ; }
						else { this.request.send(s1) ; }
*/
						if(this.hasAttribute(Request.ATTRIBUTE_BINARY)) this.request.sendAsBinary(this.body) ;
						else this.request.send(this.body) ;

				},
				abort: function abort( ) { this.request.abort( ) ; },
				/**
				* @deprecated
				* @todo refactor into `Response` type.
				*/
				result: function result( )
				{

					// set variables
					
					var o = null, s ;

					// set o
					
						if( (s = this.parameter.mime) === this.constructor.MIME_TEXT ) { o = this.responseText( ) ; }
						else if(s === this.constructor.MIME_XML) { o = this.responseXML( ) ; }
						else if(s === this.constructor.MIME_JSON) {
								if(  !!  ( s = this.responseText( ) )  ) { o = Meta.parse(s) ; }
						}
						else { o = this.request.responseText ; }
						
					// return o
					
					return o ;

				},
				/**
				* @deprecated
				*/
				onUpload: function onUpload(task)
				{
throw  "Review." ;			
					// set xhr
					
						this.request.upload( Meta.bind(
								function anonymous$Request$onUpload(event) { this.triggerEvent("upload",event) ; },
								this
						)  ) ;
						
						this.addListener( new org.meta.core.Listener("upload",task,this) ) ;
						
					// return this
					
					return this ;

				},
				onUnsent: function onUnsent(listener) { this.addListener(Request.READY_STATE_NAMES[Request.READY_STATE_UNSENT], listener) ; },
				onOpened: function onOpened(listener) { this.addListener(Request.READY_STATE_NAMES[Request.READY_STATE_OPENEND], listener) ; },
				onReceived: function onReceived(listener) { this.addListener(Request.READY_STATE_NAMES[Request.READY_STATE_RECEIVED], listener) ; },
				onLoading: function onLoading(listener) { this.addListener(Request.READY_STATE_NAMES[Request.READY_STATE_LOADING], listener) ; },
				onDone: function onDone(listener) { this.addListener(Request.READY_STATE_NAMES[Request.READY_STATE_DONE], listener) ; },
				onError: function onError(listener) { this.addListener(Request.EVENT_REQUEST_ERROR, listener) ; },
				onTimeout: function onTimeout(listener) { this.addListener(Request.EVENT_REQUEST_TIMEOUT, listener) ; }
		}
}
