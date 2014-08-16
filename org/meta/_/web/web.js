/**
* org.meta.web library set-up script
* @author Friedrich Alexander Kurz, 2013, f.a.kurz@googlemail.com
*/

(  function( ) {

Meta.define(  {
		name: "Cookie",
		package: "org.meta.web",
		prototype: "org.meta.core.Object",
		require: ["org.meta.core.Matcher"],
		main: function main(arguments)
		{
		
			// variables
			
			var m, s ;
			
			//
			
				this.entries = { } ;
			
				m = new org.meta.core.Matcher(org.meta.web.Cookie.PATTERN_COOKIE) ;
				
				while(m.lookingAt( )) {
				
						s = decodeURIComponent(m.group(2)) ;

						/*@Note(Variables found within the `cookie` property of the default document are supposed to be persistent since they have not been cleared during a previous session close event.)*/
						
						this.entries[m.group(1)] = {persistent: true, value: Meta.parse(s) || s} ;
						
						m.from(m.last( )) ;

				}
		
		},
		global: {PATTERN_COOKIE: "\\s*([\\w\\-]+)=([^;]+);?"},
		local: {
				set: function set(key,value,parameter)
				{
				
					// variables
					
					var s, o ;
					
					//

						s = key + "=" + encodeURIComponent(value) + ";path=" + encodeURIComponent("/") ;
						
						if(!! parameter) {
						
								o.persistent = !! parameter.persistent ;

								if(!!parameter.secure) { s += ";secure" ; }
								if(!!parameter.max_age) { s += ";max-age=" + parameter.max_age ; }
								if( !! (o = parameter.expires) ) {
								
										s += ";expires=" ;
										
										if( Meta.isDate(o) ) { s += o.toGMTString( ) ; }
										else if( Meta.isInteger(o) ) { s += new Date(o).toUTCString( ) ; }
										else if( Meta.isString(o) ) { s += o ; }
										
								}

								
						}

						Meta.DEFAULT_DOCUMENT.cookie = s ;
						
					// return
					
					return this ;

				},
				clear: function clear(key)
				{
				
					//
				
						Meta.DEFAULT_DOCUMENT.cookie = key + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/" ;

					// return
					
					return this ;

				}
		}
}  )
.define(  {
		/**
		* A top level object managing basic user application interaction (e.g. referals, etc.).
		* @source https://developer.mozilla.org/en-US/docs/DOM/document.cookie
		* @source http://tools.ietf.org/html/rfc1738
		*/
		name: "Session",
		package: "org.meta.web",
		prototype: "org.meta.core.Eventable",
		require: ["org.meta.core.Eventable", "org.meta.web.Cookie", "org.meta.web.dom.DOM"],
		main: function main(arguments)
		{
		
			//

				this.listeners = { } ;
				this.variables = { } ;
				this.cached = { } ;
				this.cookie = new org.meta.web.Cookie(null) ;

				/*Add a window load event listener to trigger the `Session`'s ready event.*/
				
				org.meta.web.dom.DOM.onReady({
						callback: function(session, event) { session.triggerEvent("ready", null) ; },
						parameter: this
				})
				.addListener(
						Meta.DEFAULT_VIEW,
						"unload",
						{
								callback: function(session, event) { session.triggerEvent("close", event); },
								parameter: this
						}
				) ;

		},
		local: {
				/**
				* Either returns the path sub-String of the URI or the fragment modifier sub-String---if the path is the root path.
				*/
				location: function location( )
				{
				
					// variables
					
					var s ;
					
					//
					
						if((s = Meta.DEFAULT_VIEW.location.pathname) === "/") return Meta.DEFAULT_VIEW.location.hash || s ;
						else return s ;
				
				},
				setVariable: function setVariable(key,value,parameter)
				{
						
					// variables
					
					var s ;
					
					// 
					
						this.variables[key] = !! parameter ? Meta.merge( {value:value}, parameter ) : {value: value} ;
						
						this.cookie.set(key,value,parameter) ;

					// return
					
					return this ;

				},
				getVariable: function getVariable(key)
				{

					// variables
					
					var o ;
					
					//

						if(  !!  ( o = this.variables[key] )  ) { return o.value ; }
						
					// return
					
					return null ;

				},
				clearVariable: function clearVariable(key)
				{
				
					// variables
					
					var o ;
					
					//
					
						if(  !!  ( o = this.variables[key] )  ) {
						
								this.cookie.clear(key) ;
								this.variables[key] = null ;
								
						}
						
					// return
					
					return this ;

				},
				/*Store the reference for global access.*/
				cache: function cache(key, value) { this.cached[key] = value ; return this ; },
				uncache: function uncache(key)
				{
				
					// variables
					
					var o ;
					
					//
					
						o = this.cached[key] ;
						this.cached[key] = null ;
						
					// return
					 
					 return o ;
				},
				/**
				* Change the content of the browser's location URL.
				* 
				* If a relative URI is given---starting with a slash ('/') character---the URI is supposed to be an internal referral, i.e. one that keeps the current session alive; if an aboslute URI is given---starting with a protocol and host portion, e.g. ''http://www.host.com ''---the referral is supposed to be external and the session will be closed.
				* @param uri (String) A URI to refer to.
				* @return this
				*/
				refer: function refer(uri, options)
				{

					// variables

					var b, o, s ;

					//

						b = uri.charAt(0) === Meta.CHARACTER_SLASH ;
						o = {href: uri} ;
						
						/*@ToDo(The href uris need to be filtered in order to eliminate external referals; external referals cannot be history pushed using the fragment modifier. Also, external referals should trigger the Session#close event.)*/

						/*@Note(Close the current session.)*/

						if(! b) { s = uri ; this.close( ) ; }
						else { s = "/#" + uri ; }

						if(Meta.isSet("assign", Meta.DEFAULT_VIEW)) { Meta.DEFAULT_VIEW.location.assign(s) ; }
						else { Meta.DEFAULT_VIEW.location = s ; }

						this.triggerEvent("refer", o) ;

					// return 

					return this ;

				},
				close: function close( )
				{
				
					// variables
					
					var o ;

					//

						for(var key in this.variables) {
						
								o = this.variables[key] ;
								
								/*Clear non persistent variables.*/
								
								if(!!! o.persistent) { this.cookie.clear(key) ; }
						
						}
						
						this.triggerEvent("close", {variables:this.variables});
						this.variables = null ;
					
					// return
					
					return this ;
				
				},
				/*Proxy for passing a listener to `DOM.onReady`.*/
				onReady: function onReady(listener)
				{
Meta.log("Session.onReady") ;
					//

						org.meta.web.dom.DOM.onReady( new org.meta.core.Listener("ready", listener, this) ) ;

					// return

					return this ;
					
				},
				onRefer: function onRefer(listener)
				{
				
					//

						this.addListener( new org.meta.core.Listener("refer", listener, this) ) ;
						
					// return
					
					return this ;
					
				},
				onClose: function onClose(listener)
				{

					//
					
						this.addListener( new org.meta.core.Listener("close", listener, this) ) ;
						
					// return
					
					return this ;

				}
		}
}  )
.define(  {
		/**
		A public utility class for wrapping XHR (`XMLHttPRequest` or MS ActiveX counterpart) `Object`s.")
		@link https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest
		*/
		name: "Request",
		package: "org.meta.web",
		prototype: "org.meta.core.Eventable",
		main: function main(uri, parameter)
		{

			// set this
			
				this.listeners = [ ] ; // new org.meta.core.Eventable.Handlers( ) ;
				
				/*Create an XHR (`XMLHttpRequest` or MS ActiveX counterpart) `Object`.*/

				if(!! Meta.IS_IE) {
	
						Meta.each(
								this.MS_ACTIVEX_XHR,
								function(index,name) {
								
									var xhr ;

										try {

												xhr = new ActiveXObject(name) ;

												if( ! Meta.isNull(xhr) ) { this.xhr = xhr ; return false ; }

										}
										catch(error) { }

								},
								this
						) ;	
				
				}
				else if(!! document.request) { this.xhr = document.request( ) ; }
				else if(!! window.XMLHttpRequest) { this.xhr = new XMLHttpRequest( ) ; }
				else { Meta.error("Unable to create `XMLHttpRequest` `Object`.") ; }
				
				/*Set the parameter map.*/

				this.parameter = Meta.merge( parameter, Meta.copy(this.constructor.REQUEST_PARAMETER) ) ;
				this.parameter.uri = uri ;

			// return this
			
			return this ;
			
		},
		global: {
				/*Default settings.*/
				REQUEST_PARAMETER: {

						uri: null, method: "GET", mime: "application/xml", async: true, binary: false,
						cache: true, query: null, unsent: null, openend: null, received: null,
						loading: null, done: null, parameter: null, flag: true

				},
				HTTP_METHOD_GET: "GET",
				HTTP_METHOD_POST: "POST",
				HTTP_METHOD_HEADER: "HEADER",
				MIME_TEXT: "text/plain",
				MIME_CSS: "text/css",
				MIME_XML: "application/xml",
				MIME_JSON: "text/json",
				MIME_JAVASCRIPT: "application/javascript",
				XHR_STATUS_UNSENT: 0,
				XHR_STATUS_OPENEND: 1,
				XHR_STATUS_RECEIVED: 2,
				XHR_STATUS_LOADING: 3,
				XHR_STATUS_DONE: 4,
				XHR_STATUS_NAMES: ["unsent","openend","received","loading","done"],
				MS_ACTIVEX_XHR: ["Msxml2.XMLHTTP.6.0","Msxml2.XMLHTTP.3.0","Microsoft.XMLHTTP"]
		},
		local: {
				xhr: null,
				parameter: null,
				readyState: function readyState( ) { return this.xhr.readyState ; },
				status: function status( ) { return this.xhr.status ; },
				responseXML: function responseXML( ) { return this.xhr.responseXML ; },
				responseText: function responseText( ) { return this.xhr.responseText ;	},
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
						else { o = this.xhr.responseText ; }
						
					// return o
					
					return o ;

				},
				/**
				*/
				onUpload: function onUpload(task)
				{
throw  "Review." ;			
					// set xhr
					
						this.xhr.upload( Meta.bind(
								function anonymous$Request$onUpload(event) { this.triggerEvent("upload",event) ; },
								this
						)  ) ;
						
						this.addListener( new org.meta.core.Listener("upload",task,this) ) ;
						
					// return this
					
					return this ;

				},
				onUnsent: function onUnsent(listener)
				{
					
					// set this
					
						this.addListener( new org.meta.core.Listener("unsent",listener,this) ) ;
					
					// return this
					
					return this ;

				},
				onOpened: function onOpend(listener)
				{
					
					// set this
					
						this.addListener( new org.meta.core.Listener("opened",listener,this) ) ;
					
					// return this
					
					return this ;

				},
				onReceived: function onReceived(listener)
				{
					
					// set this
					
						this.addListener( new org.meta.core.Listener("received",listener,this) ) ;
					
					// return this
					
					return this ;

				},
				onLoading: function onLoading(listener)
				{
					
					// set this
					
						this.addListener( new org.meta.core.Listener("loading",listener,this) ) ;
					
					// return this
					
					return this ;

				},
				onDone: function onDone(listener)
				{

					// set this

						this.addListener(new org.meta.core.Listener("done", listener, this)) ;

					// return this
					
					return this ;

				},
				onError: function onError(listener)
				{

					// set this

						this.addListener( new org.meta.core.Listener("error",listener,this) ) ;
					
					// return this
					
					return this ;

				},
				/**
				@Link http://en.wikipedia.org/wiki/List_of_HTTP_header_fields
				*/
				send: function send( )
				{
				
					// set variables
					
					var s1 = this.parameter.method, s2 = this.parameter.uri ;

					// set xhr

						this.xhr.open(s1,s2,this.parameter.async) ;

						this.xhr.onreadystatechange = Meta.bind(
								function anonymous$Request$send(event) {

									var i, s ;

										i = this.readyState( ) ;

										if(i === this.constructor.XHR_STATUS_DONE) {
										
											/*Check for errors.*/
											
											if(this.xhr.status !== 200) {
											
													this.triggerEvent("error", event) ;
													this.xhr.abort( ) ;
											
													return true ;
													
											}
											
										}
										
										s = this.constructor.XHR_STATUS_NAMES[i] ;

										this.triggerEvent(s,event) ;
								
								},
								this												
						) ;

						if( Meta.isSet("overrideMimeType", this.xhr) ) { this.xhr.overrideMimeType(this.parameter.mime) ; }

						if(s1 === this.constructor.HTTP_METHOD_GET) { this.xhr.setRequestHeader("Content-Type","XMLHTTP/1.0") ; }
						else if(s1 === this.constructor.HTTP_METHOD_POST) { this.xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded") ; }
						else { Meta.error("Unsupported HTTP request method (method=``%1;'')",s1) ; }
						
						/*As per convention.*/
						
						if(this.parameter.flag) { this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest") ; }
						
						s1 = ( this.parameter.body || null ) ;

						if(!! this.parameter.binary) { this.xhr.sendAsBinary(s1) ; }
						else { this.xhr.send(s1) ; }

					// return this
					
					return this ;

				},
				abort: function abort( ) { this.xhr.abort( ) ; }		
		}
}  ) ;

Meta.define(  {
		name: "Style",
		package: "org.meta.web.css",
		prototype: "org.meta.core.Object",
		main: function main(element)
		{

			// preconditions
			
			Meta.assert(org.meta.web.dom.DOM.isElement(element) && org.meta.web.dom.DOM.isHTML(element), "Invalid node type.") ;
			
			//
			
				this.element = element ;
				this.layout = {} ;
				
		},
		global: {
				/**Returns the camel case of a dash-delimited style property key.*/
				camelCaseOf: function camelCaseOf(key)
				{ Meta.log("(!) untested") ;
					
					// variables
					
					var s = key, a, i ;
					
					//
					
						a = key.split("\\-") ;
				
						if( (i = a.length) > 1 ) {
								while(--i >= 0) { s = a[i].charAt(0).toLocaleUpperCase( ) + a[i].substring(1) + s ; }
						}
						
					// return
					
					return s ;
						
				}
		},
		local: {
				element: null,
				layout: null,
				/**
				* Set a single style property to the given value without converting name or value. 
				* @Param name (String) The style property name.
				* @Param value (Object) The style property value.
				* @Return this 
				*/
				set: function set(name,value)
				{

					// variables
					
					var o ;

					// 

						o = this.element.style ;

						if( Meta.isSet("setProperty",o) ) {

								/*@Note(IE 9 supports the CSSStyleDeclaration API but wants you to confirm that the changes you make
								are really honestly seriously very very important, i.e. requires you to pass ``important'' as value priority. 
								Unless we do that, the inline styling will not overwrite potential sheet style. Other browsers behave as 
								expected in that they value more specific---i.e. inline is most specific---styling properties over more generic ones.)*/

								if(Meta.IS_IE) {

										try { o.setProperty(name,value,"important") ; }
										catch(error) { }

								}
								else { o.setProperty(name,value,"") ; }

						}
						else {

								name = this.constructor.camelCaseOf(name);

								try { o[name] = value ; }
								catch(error) { }

						}

					// return 
					
					return this ;

				},
				/**
				* Retrieve the value for the given style property.
				* @Param property (String) The name of the CSS property.
				* @Return Object
				*/
				get: function style(property)
				{
				
					// variables
					
					var o ;

					// 

						o = this.currentStyle(property) ;
						
						if( Meta.isNull(o) ) { o = this.getDeclaredStyle(property) ; }

					// return 

					return o ;

				},
				setLayout: function setLayout(selector,rules,override)
				{
				
					// variables
					
					var o ;
					
					//
					
						if( ! Meta.isSet(selector,this.layout) ) { o = this.layout[selector] = { } ; }
						else { o = this.layout[selector] ; }

						Meta.merge(o, rules, !!override) ;

					//
					
					return this ;
				
				},
				getLayout: function getLayout( ) { return this.layout ; },
				setLayoutProperty: function setLayoutProperty(selector, property, value)
				{
				
					// preconditions
					
					Meta.assert(Meta.isSet(selector,this.layout), "Layout for selector is undefined (selector=%1;)", selector) ;
					
					// variables
					
						this.layout[selector][property] = value ;
					
					// return
					
					return this ;
				
				},
				removeLayoutProperty: function setLayoutProperty(selector, property, value)
				{
				
					// preconditions
					
					Meta.assert(Meta.isSet(selector,this.layout), "Layout for selector is undefined (selector=%1;)", selector) ;
					
					//
					
						delete this.layout[selector][property] ;
					
					// return
					
					return this ;
				
				},
				removeLayout: function removeLayout(selector)
				{

						delete this.layout[selector] ;
				
					return this ;

				},
				/**
				* Retrieve the value for the given style property name as declared in the ``style'' attribute.
				* @Param property (String) the Name of the CSS property.
				* @Return Object
				*/
				declaredStyle: function declaredStyle(property)
				{
				
					// variables
					
					var o1, o2 ;
					var s ;

					// 

						if( !! (o2 = this.element.style) ) {
							
								if(!! o2.getPropertyValue) { o1 = o2.getPropertyValue(property) ; }
								else { s = Meta.toCamelCase ; o1 = ( o2[s] || null ) ; }

						}

					// return 
					
					return o1 ;

				},
				/**
				* Retrieve the computed style for the given css property name.
				* @Param property (String) The css property name whose value is to be returned.
				* @Return Object
				*/
				currentStyle: function currentStyle(property)
				{
					
					// variables
					
					var o1 = null, o2 ;
					var n ;
					var s ;
					
					// 

						n = this.element ;
						
						if( !! (o2 = Meta.DEFAULT_VIEW.getComputedStyle) ) { //!! W3
						
								o1 = o2(n,null)
								.getPropertyValue(property) ;
								
						}
						else if( !! (o2 = n.currentStyle) ) { //!! IE
					
								s = Meta.toCamelcase(property) ;
								o1 = ( o2[s] || null ) ;

						}

						if( Meta.isString(o1) && o1.length === 0 ) { o1 = null ; }

					// return 

					return o1 ;
					
				},
				scrollHeight: function scrollHeight( )
				{
					return ( this.element.scrollHeight || null ) ;
				},
				scrollWidth: function scrollWidth( )
				{
					return ( this.element.scrollWidth || null ) ;
				},
				/*
				*Return the height of the selected `Node` (if applicable).
				*@Return Float
				*/
				height: function height( )
				{ 

					// variables
					
					var n, s ;

					// 

						if(Meta.IS_IE) {

								n = this.element.height ;
								
								if( Meta.isNull(n) ) {

										s = this.getStyle("height") ;

										if( org.meta.web.dom.DOM.nameOf(this.element) === "body"  &&  s === "100%" ) { n = org.meta.web.css.CSS.viewportHeight( ) ; }
										else { n = Meta.parseNumber(s) ; }
									
								}

						}
						else { n = Meta.parse( this.getStyle("height") ) ; }

					// return 

					return ( isNaN(n) ? null : n ) ;

				},
				/*
				*Return the width of the selected `Node` (if applicable).
				*@Return Float
				*/
				width: function width( )
				{ 
				
					// variables

					var n1 = -1 ;
					var n2 ;
					var s ;

					// 

						n2 = this.element ;

						if(  ( s = Meta.typeOf(n2) ) === Meta.STRING_TYPE_WINDOW  ||  org.meta.web.dom.DOM.isDocument(n2)  ) {
								n1 = org.meta.web.css.CSS.viewportWidth( ) ;
						}
						else if(s === Meta.STRING_TYPE_NODE) {
						
								if(Meta.IS_IE) {

										if(  Meta.isNull( (n1 = n2.width) )  ) {

												s = this.getStyle("width") ;

												if( org.meta.web.dom.DOM.nameOf(n2) === "body"  && s === "100%" ) { n1 = org.meta.web.css.CSS.viewportWidth( ) ; }
												else { n1 = Meta.parseNumber(s) ; }

										}

								}
								else { n1 = Meta.parseNumber( this.getStyle("width") ) ; }
								
						}

					// return 

					return ( isNaN(n1) ? null : n1 ) ;

				},
				/**
				* Return an `Integer` value corresponding to the total height demanded by the currently selected `Node` including
				* margin and decorative properties (such as box shadows). 
				* This method may yield a different aggregate value than the `Element.offsetHeight` property for two reasons: (1) it 
				* includes margins; (2) it does not round values.
				* @Return Integer
				*/
				offsetHeight: function offsetHeight( )
				{
				
					// variables
					
					var i1 = 0 ;
					var s ;
					
					// 
						
						a = ["height","margin-top","margin-bottom","border-top-width","border-bottom-width","padding-top","padding-bottom"] ;

						Meta.each(
								a,
								function(index,property) { i1 += Meta.parseNumber(  ( this.currentStyle(property) || 0 )  ) ; },
								this
						) ;
						
						/*@note("Some UAs like FF will compensate calculated overflow with a negative bottom position value. This must subtracted
						from the aggregate value in order to return an accurate result.")*/
/*
						i2 = Meta.parseNumber(  ( this.getCurrentStyle("bottom") || 0 )  ) ;

						if(i2 < 0) { i1 += i2 ; }
*/
						/*@toDo("Implement box shadow calculations")*/
					
					// return 
					
					return i1 ;
				
				},
				/**
				* Return an `Integer` value corresponding to the total height demanded by the currently selected `Node` including
				* margin and decorative properties (such as box shadows). 
				* This method may yield a different aggregate value than the `Element.offsetHeight` property for two reasons: (1) it 
				* includes margins; (2) it does not round values.
				* @Return Integer
				*/
				offsetWidth: function offsetWidth( )
				{
				
					// variables
					
					var i = 0 ;
					var s ;
					
					// 
						
						a = ["width","margin-right","margin-left","border-right-width","border-left-width","padding-right","padding-left"] ;
						
						Meta.each(
								a,
								function(index,property) { i += Meta.parseNumber(  ( this.currentStyle(property) || 0 )  ) ; },
								this
						) ;
						
						/*@note("Some UAs like FF will compensate calculated overflow with a negative right position value. This must subtracted
						from the aggregate value in order to return an accurate result.")*/
/*
						i2 = Meta.parseNumber(  ( this.getCurrentStyle("right") || 0 )  ) ;
						
						if(i2 < 0) { i1 += i2 ; }
*/
						/*@toDo("Implement box shadow calculations")*/
					
					// return 
					
					return i ;
				
				},
				/**
				* Determine the aggregate height of the currently selected `Node`s.
				* @Param stop [optional] (Integer) Strictly positive `Integer` value that manually limits the child `Node`
				* list iteration to the `Node` at the given index (i.e. the `Node` at the given index is to be the last one).
				* @Return Double
				*/
				compoundHeight: function compoundHeight(stop)
				{
				
					// variables
					
					var i = 0 ;
					
					// 

						this.each(
								function(index,node) {

										i += this.getOffsetHeight( ) ;
								
										if(!! stop && index === stop) { return false ; }
								}
						) ;
					 
					// return 
					
					return i ;
				
				},
				/**
				* Determine the aggregate width of the currently selected `Node`s.
				* @Param stop [optional] (Integer) Strictly positive `Integer` value that manually limits the child `Node`
				* list iteration to the `Node` at the given index (i.e. the `Node` at the given index is to be the last one).
				* @Return Double
				*/
				compoundWidth: function compoundHeight(stop)
				{
				
					// variables
					
					var i = 0 ;
					
					// 
					
						this.each(
								function(index,node) {
						
										i += this.getOffsetWidth( ) ;

										if(!! stop && index === stop) { return false ; }
										
								}
						) ;
						
					// return 
					
					return i ;

				},
				/**
				* Return a strictly positive Integer indicating the offset of the currently selected Node from the top content edge
				* of the next ancestor `Node` with a content edge (also called ``offset parent'').
				* @Return Integer
				*/
				offsetTop: function offsetTop( )
				{
				
					// variables
					
					var i ;
					
					// 
					
						i = this.element.offsetTop ;
						
					// return i ;
						
					return (i < 0 ? 0 : i) ;
					
				},
				/**
				* Return a strictly positive Integer indicating the offset of the currently selected Node from the left content edge
				* of the next ancestor `Node` with a content edge (also called ``offset parent'').
				* @Return Integer
				*/
				offsetLeft: function offsetLeft( )
				{
			
					// variables
					
					var i ;
					
					// 
					
						i = this.element.offsetLeft ;
						
					// return i ;
						
					return (i < 0 ? 0 : i) ;
					
				},
				/**
				* Return the vertical offset of the currently selected `Node` from the root Element.
				* @Return Double
				*/
				globalOffsetTop: function globalOffsetTop( )
				{
				
					// 
					
					var f1 = 0.0, f2 ;
					var n ;

					// 
					
						n = this.element ;
						
						do {
						
								f2 = n.offsetTop ;
								f1 += ( f2 > 0 ? f2 : 0 ) ;

						}
						while( !! (n = n.offsetParent) ) ;
					
					// return 
					
					return f1 ;
					
				},
				/**
				* Return the horizontal offset of the currently selected `Node` from the root Element.
				* @Return Double
				*/
				globalOffsetLeft: function globalOffsetLeft( )
				{
				
					// 
					
					var f1 = 0.0, f2 ;
					var n ;

					// 
					
						n = this.element ;

						do {
						
								f2 = n.offsetLeft ;
								f1 += ( f2 > 0 ? f2 : 0 ) ;

						}
						while( !! (n = n.offsetParent) ) ;
					
					// return 
					
					return f1 ;
					
				},
				setClass: function setClass(name)
				{
				
					//

						this.element.className = name ;
						
					// return

					return this ;

				},
				/**
				* Get the ``class'' attribute of the selected `Node`.
				* @return String
				*/
				getClass: function getClass( ) { return this.element.className ; },
				hasClass: function hasClass(name)
				{
				
					// variables
					
					var n, s, a, i ;
					
					// 
					
						if( Meta.isSet("classList",this.element) ) { return this.element.classList.contains(name) ; }
						else {
						
								if( !! (s = this.element.className) ) {
								
										a = s.split(Meta.CHARACTER_SPACE) ;
										i = a.length ;
										
										while(--i >= 0) {
										
												s = a[i] ;
												
												if(s === name) { return true ; }

										}

								}
						
						}
						
					// return
					
					return false ;
					
				},
				/**
				*Add a class identifier to the ``class'' attribute of the selected `Node` if it does not exist yet by appending
				*the given class name to the ``class'' attribute's value or using the `classList` Object's methods.
				*@param name (String) The class name to add.
				*@return this
				*/
				addClass: function addClass(name)
				{
				
					// variables

					var s ;
					
					// 

						if( ! this.hasClass(name) ) {

								if(  Meta.isSet("classList",this.element) ) { this.element.classList.add(name) ; }
								else {
								
										s = this.getClass( ) ;
										s = s === null ? name : s + " " + name ;

										this.setClass(s) ;
								
								}

						}
						
					// return
					
					return this ;

				},
				/**
				* Remove a class name from the value of the selected `Node`'s ``class'' attribute.
				* @link https://developer.mozilla.org/en-US/docs/DOM/element.classList
				* @param name (String) The class name to remove.
				* @return this
				*/
				removeClass: function removeClass(name)
				{
				
					// variables
					
					var s1, s2, a, i ;
					
					// 
					
						if(  !!  ( s1 = this.getClass( ) )  ) {
						
								if( Meta.isSet("classList",this.element) ) { this.element.classList.remove(name) ; }
								else {
								
										a = s1.split(Meta.CHARACTER_SPACE) ;
										i = a.length ;
										s1 = "" ;
										
										while(--i >= 0) {
												if(  ( s2 = a[i] )  !==  name  ) { s1 += i > 0 ? " " + s2 : s2 ; }
										}
										
										this.setClass(s1) ;
										
								}
						
						}
						
					// return 
					
					return this ;
					
				},
				toggleClass: function toggleClass(name)
				{
					
					// 
					
						if( this.hasClass(name) ) { this.removeClass(name) ; }
						else { this.addClass(name) ; }

					// return
					
					return this ;

				}
		}
}  )
.define(  {
		/**
		An `Object` wrapper for a `CSSStyleSheet` `Object`.
		@Note Giving a ``STYLE'' `Element` a ``title'' attribute will prevent the application of the contained rules in MOZ.
		@Link http://msdn.microsoft.com/en-us/library/hh772065%28v=vs.85%29.aspx (MSDN DOM style API overview)
		@Link https://developer.mozilla.org/en-US/docs/Web/API/CSSStylesheet
		*/
		name: "StyleSheet",
		package: "org.meta.web.css",
		prototype: "org.meta.core.Object",
		require: ["org.meta.web.dom.DOM"],
		main: function main(attributes)
		{

			// variables
			
			var e, o, l ;
			
			// 
			
				this.rules = { } ;

				e = DOM.createElement(Meta.DEFAULT_DOCUMENT, "style") ;
				o = {media:"screen", type:"text/css", id: this.instanceId()} ;

				if(!! attributes) { Meta.merge(attributes,o) ; }
				else { attributes = o ; }
				
				for(var key in attributes) { DOM.setAttribute(e, key, attributes[key]) ; }

				DOM.appendTo(Meta.DEFAULT_DOCUMENT.head,e) ;

				l = Meta.DEFAULT_DOCUMENT.styleSheets ;

				this.sheet = l.item(l.length - 1) ;

			// return
			
			return this ;

		
		},
		local: {
				sheet: null,
				/*Contains boolean values indicating whether there is a rule set for that selector.*/
				rules: null,
				/**
				@Link http://msdn.microsoft.com/en-us/library/ms535871%28v=vs.85%29.aspx
				@Link http://msdn.microsoft.com/en-us/library/ie/hh453740.aspx
				@Link http://msdn.microsoft.com/en-us/library/ie/ms535871(v=vs.85).aspx
				@Link http://msdn.microsoft.com/en-us/library/aa768647(v=vs.85).aspx
				@Link https://developer.mozilla.org/en/DOM/stylesheet
				@Link https://developer.mozilla.org/en/DOM/CSSRuleList
				@Param (String) selector A CSS selector String (this is used as a key to map CSS rules)
				@Param (Object) rules An Object containing CSS property-value pairs. Values may be Arrays in case a single property has multiple values.
				*/
				addRules: function addRules(selector,rules)
				{

					// variables
					
					var o, s, l, i ;
					
					//
					
						/*@Note(To avoid unnecessary complexity, existing rules for a selector are replaced.)*/
					
						if( !! this.rules[selector] ) { this.removeRule(selector) ; }

						s = selector + "{" ;
						l = this.sheet.cssRules || this.sheet.rules ;
						
						for(var property in rules) {
						
								o = rules[property] ;

								
								if(Meta.isArray(o)) {
								
										i = o.length ;
										
										while(--i >= 0) { s += property + ":" + o[i] + ";" ; }
								
								}
								else { s += property + ":" + o + ";" ; }
						
						}

						s += "}";

						if( Meta.isSet("insertRule",this.sheet) ) { this.sheet.insertRule(s,l.length) ; }
						else if( Meta.isSet("addRule",this.sheet) ) { this.sheet.addRule(s,l.length) ; }
						
						this.rules[selector] = true ;
					
					// return
					
					return this ;
				
				},
				/**
				@Link http://msdn.microsoft.com/en-us/library/ie/ff975162(v=vs.85).aspx
				@Param (String) selector A CSS selector String.
				@Return String
				*/
				removeRule: function removeRule(selector)
				{
				
					// variables
					
					var l, i, r, s ;
					
					//
					
						l = this.sheet.cssRules || this.sheet.rules ;
						i = l.length ;
						
						while(--i >= 0) {
						
								r = l.item(i) ;
								s = Meta.isSet("cssText",r) ? r.cssText : r.selectorText ;
								
								if( s.indexOf(selector) === 0 ) {
								
										if( Meta.isSet("deleteRule",this.sheet) ) { this.sheet.deleteRule(i) ; }
										else if( Meta.iSet("removeRule",this.sheet) ) { this.sheet.removeRule(i) ; }
										
										return s ;
										
								}
						
						}
						
					// return 
					
					return null ;
				
				},
				hasRule: function hasRule(selector) { return !! this.rules[selector] ; },
				/**
				Add a CSS rule to the rule list of this `StyleSheet` Object.
				@Param rule (String) A String containing both the CSS selector and the set of CSS entries (e.g.``html{height:100%;width:100%;font-size:1em}'').
				@link http://msdn.microsoft.com/en-us/library/ms535871%28v=vs.85%29.aspx
				@link http://msdn.microsoft.com/en-us/library/ie/hh453740.aspx
				@link http://msdn.microsoft.com/en-us/library/ie/ms535871(v=vs.85).aspx
				@link http://msdn.microsoft.com/en-us/library/aa768647(v=vs.85).aspx
				@link https://developer.mozilla.org/en/DOM/stylesheet
				@link https://developer.mozilla.org/en/DOM/CSSRuleList
				@Return this
				*/				
				_addRule: function addRule(rule)
				{ Meta.error("Deprecation") ;
					
					// variables
					
					var l, i, a, s1, s2 ;
					
					// 

						l = (this.sheet.rules || this.sheet.cssRules) ;
						i = (!! l) ? l.length : 0 ;
						
						a = this.constructor.parseRuleString(rule) ;
						s1 = a[0], s2 = a[1] ;
						
						this.rules[s1] = { rule: rule, body: s2, index: i } ;

						if(!! this.sheet.insertRule) { this.sheet.insertRule(rule,i) ; } // W3 compliant browsers and modern IE versions
						else if(!! this.sheet.addRule) { this.sheet.addRule(s1,s2,-1) ; } // vintage IE versions
						
					// return 
					
					return this ;

				},
				/**
				* Add a set of CSS rules.
				* @Param set (Array) An `Array` containing CSS rule `String`s.
				* @Return this
				*/
				_addRuleSet: function addRuleSet(set)
				{ 
					
					// variables
					
					var l ;
					var i ;
					var s1, s2 ;
					
					// 

						if(Meta.IS_IE) { this.sheet.cssText += set.join("") ; }
						else {

								Meta.each(
										set,
										function(index,rule) { this.addRule(rule) ; },
										this
								) ;

						}
						
					// return 
					
					return this ;

				},
				_replaceRule: function replaceRule(rule)
				{

					// variables
					
					var a ;
					var s1, s2 ;
					var o ;
					var i ;
					
					// 
				
						a = org.meta.web.css.CSS.parseRuleString(rule) ;
						s1 = a[0], s2 = a[1] ;

						if(  !!  ( o = this.rules[s1] )  ) {

								i = o.index ;

								if(!! this.sheet.insertRule) { // W3 compliant browsers and modern IE versions
								
										this.clearRule(i) ;
										this.sheet.insertRule(rule,i) ;
										
								}
								else if(!! this.sheet.addRule) { this.clearRule(i) ; this.sheet.addRule( a[0], a[1], i ) ; } // vintage IE verisons

								this.rules[s1] = { rule: rule, body: s2, index: i } ;
						
						}
						else { this.addRule(rule) ; }
				
					// return 
					
					return this ;

				},
				_replaceRuleSet: function replaceRuleSet(set)
				{

					// 

						Meta.each(
								set,
								function(index,rule) { this.replaceRule(rule) ; },
								this
						) ;

					// return 
					
					return this ;

				},
				/**
				* Clear CSS rule for a given index within the given `StyleSheet` `Object`.
				* @Param sheet (StyleSheet) A `StyleSheet` `Object`.
				* @Param index (Integer) The index of the rule to clear.
				* @link http://msdn.microsoft.com/en-us/library/ie/ff975162(v=vs.85).aspx
				* @Return this 
				*/
				_clearRule: function clearRule(index)
				{
				
					// variables

					var l ;
					var r ;
					var s ;
					var a ;
					
					// 

						l = ( this.sheet.cssRules || this.sheet.rules ) ;

						if(  !!  ( r = l.item(index) )  ) {

								s = ( r.cssText || r.selectorText + "{" + r.style.cssText + "}" ) ;

								a = org.meta.web.css.CSS.parseRuleString(s) ;
								
								if(!! this.sheet.deleteRule) { this.sheet.deleteRule(index) ; } // W3 compliant browsers and modern IE versions
								else if(!! this.sheet.removeRule) { this.sheet.removeRule(index) ; } // vintage IE versions

								this.rules[ a[0] ] = null ;
								
						}

					// return 
					
					return this ;
				
				},
				/**
				* Return the `CSSRule` `String` for the given selector `String`.
				* @Param selector (String) A selector `String`.
				* @Return String
				*/
				_getRule: function getRule(selector) { return ( this.rules[selector] || null ) ; },
				/**
				* Clear this `StyleSheet` `Object`, i.e. remove all associated rules. This is a short-hand method for iterated calls to
				* `org.meta.web.css.CSS.clearRule`.
				* @Param sheet (StyleSheet) A `StyleSheet` `Object`.
				* @Return this 
				*/
				_clear: function clear( )
				{
				
					// variables
					
					var i ;
					var l ;

					// 
						//<> removing text probably more performant
						l = this.sheet.rules || this.sheet.cssRules ;
						i = (!! l) ? l.length : 0 ;

						if(!! this.sheet.deleteRule) { for( ; --i >= 0 ; ) { this.sheet.deleteRule(i) ; } } // W3 compliant and modern IE versions
						else if(!! this.sheet.removeRule) { for( ; --i >= 0 ; ) { this.sheet.removeRule(i) ; } } // vintage IE versions
						
					// return 
					
					return this ;
				
				},
				_getStyleSheetElement: function getStyleSheetElement( ) { return this.element ; },
				_getStyleSheetObject: function getStyleSheetObject( ) { return this.sheet ; },
				_getStyleSheetRules: function getStyleSheetNode( ) { return this.rules ; },
				_cssText: function cssText( )
				{
					
					// variables
					
					var s = null ; 
					
					// 
					
						if( Meta.isNull( (s = this.sheet.cssText) )  ) {
					
								s = "" ;

								Meta.each( 
										this.sheet.cssRules,
										function(index,rule) { s += rule.cssText ; }
								) ;
						
						}
					
					// return 
					
					return s ;
				
				}
		}
}  )
.define(  {
		name: "CSS",
		package: "org.meta.web.css",
		prototype: "org.meta.core.Object",
		require: ["org.meta.web.css.StyleSheet"],
		/**Initialize.*/
		init: function init( )
		{

			//

				this.MATCHER_CSS_LENGTH = new RegExp(this.PATTERN_CSS_LENGTH,"g") ;
				this.MATCHER_CSS_ENTRY = new RegExp(this.PATTERN_CSS_ENTRY,"g") ;
				this.MATCHER_COLOR_VALUE = new RegExp(this.PATTERN_COLOR_VALUE,"g") ;
			
		},
		/**
		@link (MS filter ``direction'' parameter) http://msdn.microsoft.com/en-us/library/ms532866(v=vs.85).aspx
		*/
		global: {
				PATTERN_CSS_LENGTH: "([+-])?\\s*([0-9.]+)\\s*([a-z%]+)",
				PATTERN_CSS_ENTRY: "([\\w0-9_\\-]+)\\s*:\\s*([\\w0-9\\s,:.\\-()#]+)\\s*;?",
				/**
				* @link http://www.w3.org/TR/2011/REC-css3-color-20110607/#colorunits
				*/
				PATTERN_COLOR_VALUE: "(#)([0-9a-fA-F]{3,8})|(rgb|rgba|hsl|hsla)\\(([0-9.,%\\s]+)\\)",
				MATCHER_CSS_ENTRY: null,
				MATCHER_COLOR_VALUE: null,
				VENDOR_PREFIXES: ["-moz","-webkit","-o","-ms"],
				PX_TO_POINT: 12/16,
				PX_TO_EM: 1/16,
				ABSOLUTE_MEASURES: { PIXEL: "px", POINT: "pt"/*, ... */ }, // tentative
				RELATIVE_MEASURES: { PERCENT: "%", EM: "em"/*, ... */ },
				COLOR_MODEL_IDENTIFIERS: { HEXADECIMAL: "#", RGB: "rgb", RGBA: "rgba", HSL: "hsl", HSLA: "hsla" },
				PROPERTIES_SPATIAL_OFFSET: [
						"margin-top",
						"margin-right",
						"margin-bottom",
						"margin-left",
						"border-top-width",
						"border-right-width",
						"border-bottom-width",
						"border-left-width",
						"padding-top",
						"padding-right",
						"padding-bottom",
						"padding-left"
				],
				PROPERTIES_SPATIAL_EXTENSION: [
						"box-shadow-top",
						"box-shadow-right",
						"box-shadow-bottom",
						"box-shadow-left",
						"box-shadow-blur",
						"box-glow",
						"text-shadow-blur",
						"text-shadow-top",
						"text-shadow-right",
						"text-shadow-bottom",
						"text-shadow-left",
						"clip-top",
						"clip-right",
						"clip-bottom",
						"clip-left",
						"border-radius-top-left",
						"border-radius-top-right",
						"border-radius-bottom-right",
						"border-radius-bottom-left"
				],
				PROPERTIES_SPATIAL_SUPPLEMENTAL: [
						"top",
						"right",
						"bottom",
						"left",
						"line-height",
						"font-size",
						"letter-spacing"/*,
						...
						*/
				],
				PROPERTIES_EXTENSION: [
						"background-gradient-orientation",
						"background-gradient-start",
						"background-gradient-stop",
						"background-image-url",
						"background-sizing-mode",
						"box-shadow-color",
						"box-glow-color",
						"text-shadow-color"/*,
						...
						*/
				],
				/**
				Clipping may only be applied to `Element`s with absolute positioning.
				@link https://developer.mozilla.org/en-US/docs/CSS/clip
				@link http://www.w3.org/TR/CSS2/visufx.html#clipping
				*/
				CONVERTER_CLIP: function CONVERTER_CLIP(shape,top,right,bottom,left)
				{ 

					var o = { } ;
					var s ;

						s = shape + "("
						+ (top === 0 ? "auto " : top + "px ")
						+ (right === 0 ? "auto " : right + "px ")
						+ (bottom === 0 ? "auto " : bottom + "px ")
						+ (left === 0 ? "auto)" : left + "px)") ;

						o.clip = s ;

					return o ;

				},
				CONVERTER_GRADIENT: function(direction,from,to)
				{ 
					
					var o = { };
					var s1, s2, s3 ;
					var i ;
					
						o["background-image"] = [
								"-moz-linear-gradient(" + ( direction === "vertical" ? "top" : "left" ) + ", " + from + ", " + to + ")",
								"-webkit-gradient(linear, " + ( direction === "vertical" ? "top center, bottom center" : "left center, right center" ) + ", from(" + from + "), to(" + to + "))",
								"-o-linar-gradient(linear, " + ( direction === "vertical" ? "top center, bottom center" : "left center, right center" ) + ", from(" + from + "), to(" + to + "))",
								"-ms-linear-gradient(linear, " + ( direction === "vertical" ? "top center, bottom center" : "left center, right center" ) + ", from(" + from + "), to(" + to + "))"
						] ;

						if(Meta.IS_IE) {

								i = ( direction === "vertical" ) ? 0 : 1 ;
								s2 = org.meta.web.css.CSS.convertColorToHex(from) ;
								s3 = org.meta.web.css.CSS.convertColorToHex(to) ;

								s1 = "progid:DXImageTransform.Microsoft.Gradient(GradientType=" + i + ", StartColorStr=" + s2 + ", EndColorStr=" + s3 + ")" ;
								o["-ms-filter"] = o.filter = s1 ;

						}

					return o ;

				},
				/**
				@Param opacity (Double) An opacity value.
				*/
				CONVERTER_OPACITY: function(opacity)
				{ 

					var o = { } ;
					var s ;

						o.opacity = opacity ;

						if(Meta.IS_IE) {
							
								s = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + (opacity * 100) +")" ;
								o["-ms-filter"] = s ;
								o.filter = s ;

						}

					 return o ;

				},
				CONVERTER_BOX_SHADOW: function CONVERTER_BOX_SHADOW(top,right,bottom,left,blur,color)
				{

					var o = { } ;
					var s ;
					
						s = top + "px " + right + "px " + blur + "px " + color ;
						
						if(!! bottom && !!left) { s += "," + bottom + "px " + left + "px " + blur + "px " + color ; }

						 o = {
								"box-shadow": s,
								"-moz-box-shadow": s,
								"-webkit-box-shadow": s,
								"-o-box-shadow": s
						} ;

						if(Meta.IS_IE) {
								/*@Note("Support is dropped temporarily because of bad visual quality.")*/
								/*@ToDo("Try a PIE CSS approach adding an Element with a blur filter behind the target Element.")*/
								/*
								n2 = values["offset-width"] ;
								n3 = Math.atan2(n1,n2) ;
								n4 = (n3 / Math.PI) * 180,
								n5 = 90 + org.meta.math.Math.ceilTo(n4,[0,45,90,135,180,225,270,315,360]) ;
								s1 = org.meta.web.css.CSS.convertColorToHex( style["box-shadow-color"] ) ;
								
								o["-ms-filter"] = (  !!  ( s2 =  values["-ms-filter"]  ) ? s2 + " " : "" ) + "progid:DXImageTransform.Microsoft.Shadow(Color="+s1+",Direction="+n5+",Strength=" + ( values["box-shadow-blur"] || 0 ) + "px)" ;
								*/
						}
						
					return o ;

				},
				CONVERTER_BACKGROUND: function(sizing,url,color)
				{

					var o1 = { }, o2 ;
					var s ;

						if(!!! color) {
								o1.background = "url(" + url + ") no-repeat top left",
								o1["background-size"] = sizing ;
						}
						else { o1.background = color ; }

						if(Meta.IS_IE && ! Meta.IS_IE_9) {

								if(!!! color) {
								
										/*@Note("Clear the CSS3 properties to prevent collisions.")*/

										o1 = { background: "url(" + url + ") no-repeat top left" } ;

										switch(sizing) {
												case "cover": { sizing = "scale" ; break ; }
												case "crop": { sizing = "contain" ; break ; }
												default: { sizing = "image" ; break ; }
										}

										s = "progid:DXImageTransform.Microsoft.AlphaImageLoader(Src=" + url + ",SizingMethod=" + sizing + ")" ;

										o1.filter = o1["-ms-filter"] = s ;
										
								}
								else {

										o2 = org.meta.web.css.CSS.parseColorValue(s) ;

										if( Meta.IS_IE && ! Meta.IS_IE_9 ) {
												o1["background-color"] = "rgb(" + o2.rgb[0] + ", " + o2.rgb[1] + ", " + o2.rgb[2] + ")" ;
										}
										else { o1["background-color"] = s ; }

								}

						}

					return o1 ;

				},

				/**
				@Param horizontal (Number) Horizontal extension of the required box shadow.
				@Param vertical (Number) Vertical extension of the required box shadow.
				@Param blur (Number) Blur extension of the required box shadow.
				@Param color (String) CSS color value for the required box shadow.
				*/
				CONVERTER_TEXT_SHADOW: function CONVERTER_TEXT_SHADOW(horizontal,vertical,blur,color)
				{

					// variables

					var o = { } ;
					var s ;
					
					// 

						o["text-shadow"] = horizontal + "px " + vertical + "px " + blur + "px " + color ;
						
						if(Meta.IS_IE) {
								Meta.error("Awaiting implementation.") ;
						}
						
					// return 
					
					return o ;
/*
					var o ;
					var n1, n2, n3, n4, n5 ;
					var s1, s2, s3 ;

						n1 = Meta.isNumber( values["text-shadow-right"] ) ? values["text-shadow-right"] : ( Meta.isNumber( values["text-shadow-left"] ) ? -values["text-shadow-left"] : 0 ) ;
						n2 = Meta.isNumber( values["text-shadow-bottom"] ) ? values["text-shadow-bottom"] : ( Meta.isNumber( values["text-shadow-top"] ) ? -values["text-shadow-top"] : 0 ) ;

						n3 = values["text-shadow-blur"]
						s1 = values["text-shadow-color"];

						o = { "text-shadow": (n1 + "px " + n2 + "px " + n3 + "px " + s1) } ;

						if( Meta.IS_IE) {

								n2 = ( values["offset-width"] || 0 ) ;
								n3 = Math.atan2(n1,n2) ;
								n4 = (n3 / Math.PI) * 180 ;
								n5 = 90 + org.meta.math.Math.ceilTo(n4,[0,45,90,135,180,225,270,315,360]) ;
								s2 = org.meta.web.css.CSS.convertColorToHex(s1) ;
								s1 = "progid:DXImageTransform.Microsoft.Shadow(Color=" + s2 + ",Direction=" + n5 + ",Strength=" + n3 + "px)" ;

								if(  !!  ( s2 = values["-ms-filter"] )  ) { o["-ms-filter"] = s2 + " " + s1 ; }
								else { o["-ms-filter"] = s1 ; }

								o["filter"] = (  !!  ( s2 = values["filter"] ) ? s2 + " " + s1 : s1 )  ;

						}

					return o ;
*/
				},
				/**
				* @link (MS filter ``direction'' parameter) http://msdn.microsoft.com/en-us/library/ms532866(v=vs.85).aspx
				*/
				PROPERTY_ADAPTERS: {
						BORDER_RADIUS_TOP_LEFT: function(style,parent,self,global,index,length)
						{ Meta.error("Deprecation.") ;
							
							var o ;
							var s ;

								s = self["border-radius-top-left"] + "px" ;
							
								o = {
										"border-top-left-radius": s,
										"-moz-border-radius-topleft": s,
										"-webkit-border-radius-top-left": s,
										"-o-border-radius-top-left": s
								} ;
								
							return o ;

						},
						BORDER_RADIUS_TOP_RIGHT: function(style,parent,self,global,index,length)
						{ Meta.error("Deprecation.") ;

							var o ;
							var s ;

								s = self["border-radius-top-right"] + "px" ;

								o = {
										"border-top-right-radius": s,
										"-moz-border-radius-topright": s,
										"-webkit-border-radius-top-right": s,
										"-o-border-radius-top-right": s
								} ;

							return o ;

						},
						BORDER_RADIUS_BOTTOM_RIGHT: function(style,parent,self,global,index,length)
						{ Meta.error("Deprecation.") ;

							var o ;
							var s ;

								s = self["border-radius-bottom-right"] + "px" ;

								o = {
									"border-bottom-right-radius": s,
									"-moz-border-radius-bottomright": s,
									"-webkit-border-radius-bottom-right": s,
									"-o-border-radius-bottom-right": s
								} ;

							return o ;

						},
						BORDER_RADIUS_BOTTOM_LEFT: function(style,parent,self,global,index,length)
						{ Meta.error("Deprecation.") ;

							var o ;
							var s ;

								s = self["border-radius-bottom-left"] + "px" ;

								o = {
									"border-bottom-left-radius": s,
									"-moz-border-radius-bottomleft": s,
									"-webkit-border-radius-bottom-left": s,
									"-o-border-radius-bottom-left": s
								} ;

							return o ;

						}

				},
				/**
				* Return the height of the viewport.
				* @Return Integer
				*/
				viewportHeight: function viewportHeight( ) { return (Meta.DEFAULT_VIEW.innerHeight || document.documentElement.clientHeight) ; },
				/*
				* Return the width of the viewport.
				* @Return Integer
				*/
				viewportWidth: function viewportWidth( ) { return (Meta.DEFAULT_VIEW.innerWidth || document.documentElement.clientWidth) ; },
				viewportArea: function viewportArea( ) { return ( org.meta.web.css.CSS.viewportHeight( ) * org.meta.web.css.CSS.viewportWidth( ) ) ; },
				/**
				* Return a `Boolean` value indicating whether the given unit `String` suffix is an absolute unit of measure.
				* @Param unit (String) A unit `String` suffix (e.g. ``px'')
				* @Return Boolean
				*/
				isAbsoluteMeasure: function(unit)
				{
				
					// variables
					
					var b = false ;
					 
					// 
					
						Meta.each( 
								org.meta.web.css.CSS.ABSOLUTE_MEASURES,
								function(key,value) { if(value === unit) { b = true ; return false ; } } 		
						) ;
						
					// return 

					return b ;

				},
				/** 
				* Return a `Boolean` value indicating whether the given unit `String` suffix is a relative unit of measure. 
				* @Param unit (String) A unit `String` suffix (e.g. ``%'').
				* @Return Boolean
				*/
				isRelativeMeasure: function(unit)
				{
				
					// variables
					
					var b = false ;
					 
					// 
					
						Meta.each( 
								org.meta.web.css.CSS.RELATIVE_MEASURES,
								function(key,value) { if(value === unit) { b = true ; return false ; } } 		
						) ;
						
					// return 

					return b ;

				},
				parseRuleString: function parseRuleString(rule)
				{
				
					// variables
					
					var a = null ;
					var s1, s2 ;

					// 
					
						s1 = rule.substring( 0, rule.indexOf("{") ) ;
						s2 = rule.substring( (rule.indexOf("{") + 1),  ( rule.lastIndexOf("}") )  ) ;

						a = [s1,s2] ;
						
					// return 
					
					return a ;						

				},
				/**
				* Parse a CSS rule set into a map of properties and values.
				* @Param string (String) The CSS style String to parse.
				* @Return Object
				*/
				parseRuleSet: function(string)
				{

					// variables

					var o = null ;
					var a ;

					/* set: o */

						o = { } ;

						while(  !!  ( a = this.MATCHER_CSS_ENTRY.exec(string) )  ) { o[ a[1] ] = a[2] ; }

					/* return: o */

					return o ;

				},
				writeRuleSet: function writeRuleSet(set)
				{
				
					// variables
					
					var s = "" ;
					
					// 
					
						Meta.each(
								set,
								function(name,value) {
								
									var a ;
										
										if( Meta.isArray(value) ) { a = value ; }
										else { a = [value] ; }
										
										if( name === "filter") { s += ( name + ":" + a.join(" ") + ";" ) ; }
										else if(name === "-ms-filter") { s += ( name + ":'" + a.join(" ") + "';" ) ; }
										else {
												
												Meta.each(
														a,
														function(index,value) {
																s += ( name + ":" + value.toString( ) + ";" ) ;
														}
												) ;
												
										}

								}
						) ;
					
					// return 
					
					return s ;

				},
				/**
				@Param a (Object) A style set.
				@Param b (Object) Another style set.
				@Return Object
				*/
				mergeRuleSet: function mergeRuleSet(a,b)
				{

					// 
					
						Meta.merge(
								a,
								b,
								function(key,a,b) {
								
									var o1, o2 ;
									
										o1 = b[key] ;
									
										if(  !!  ( o2 = a[key] )  ) {
										
												if( Meta.isArray(o2) ) {
														if( ! Meta.contains(o1,o2) ) { o2.push(o1) ; }
												}
												else {
														if( ! Meta.equals(o1,o2) ) { a[key] = [o2,o1] ; }
												}
												
										}
										else { a[key] = o1 ; }

								}
						) ;

					// return 
					
					return a ;

				},
				parseLengthValue: function parseLengthValue(length)
				{
				
						this.MATCHER_CSS_LENGTH.lastIndex = 0 ;
					
					return this.MATCHER_CSS_LENGTH.exec(length) ;

				},
				/**
				* Parse a given color value into a map view detailling its model, rgb value, and opacity.
				* @Param color A CSS color value.
				* @Return Object
				*/
				parseColorValue: function parseColorValue(color)
				{

					  // variables

					  var o = null ;
					  var a1, a2, a3 ;
					  var s1, s2 ;
					  var i = -1 ;
					  var f1, f2 ;

					  // 

						this.MATCHER_COLOR_VALUE.lastIndex = 0 ;

						if( !! ( a1 = this.MATCHER_COLOR_VALUE.exec(color) ) ) {

								o = { value: a1[0], model: ( a1[1] || a1[3] ), rgb: [ ], opacity: 1 } ;

								if( (s1 = o.model) === org.meta.web.css.CSS.COLOR_MODEL_IDENTIFIERS.HEXADECIMAL) {

									if( ( s2 = a1[2] ).length  ===  3  ) { a2 = s2.match(/[0-9a-f]/ig) ; }
									else { a2 = s2.match(/[0-9a-f]{2}/ig) ; }

									Meta.each(
										a2,
										function(index,value) {
										
										var n ;

											n = parseInt(value,16) ;
											o.rgb[index] = (value.length === 1) ? (n * 16 + n) : n ;

										}
									) ;

								}
								else {

									a2 = a1[4].split(Meta.CHARACTER_COMMA) ;

									if(  !!  ( s2 = a2[3] )  ) { o.opacity = Meta.parseNumber(s2) ; }

									if(s1 === org.meta.web.css.CSS.COLOR_MODEL_IDENTIFIERS.RGB || s1 === org.meta.web.css.CSS.COLOR_MODEL_IDENTIFIERS.RGBA) {
											for( ; ++i < 3 ; ) { o.rgb[i] = parseInt( a2[i] ) ; }
									}
									else if(s1 === org.meta.web.css.CSS.COLOR_MODEL_IDENTIFIERS.HSL || s1 === org.meta.web.css.CSS.COLOR_MODEL_IDENTIFIERS.HSLA) {

											/*@Note("The hue value")*/
											i = parseInt( a2[0] ) ;
											/*@Note("The saturation value")*/
											f1 = parseInt( a2[1] ) / 100 ;
											/*@Note("The lightness value")*/
											f2 = parseInt( a2[2] ) / 100 ;

											o.rgb = this.convertHSLToRGB(i,f1,f2) ;

									}


								}

						}

					  //return 

					  return o ;

				},
				/**
				* Convert a HSL (hue, saturation, lightness) triplet to an `Array` containing the equivalent RGB
				* (red, green, blue) values.
				* @link https://developer.mozilla.org/en/CSS/color_value#Specifications
				* @link http://www.w3.org/TR/2011/REC-css3-color-20110607/#colorunits
				* @link http://en.wikipedia.org/wiki/HSL_and_HSV#Converting_to_RGB
				* @link http://www5.informatik.tu-muenchen.de/lehre/vorlesungen/graphik/info/csc/COL_26.htm#topic25
				* @Param hue (Integer) The hue value (between zero and 360).
				* @Param saturation (Float) The saturation value (between zero and one).
				* @Param lightness (Float) The lightness value (between zero and one).
				* return Array
				*/
				convertHSLToRGB: function convertHSLToRGB(hue,saturation,lightness)
				{ Meta.error("Awaiting implementation.");

					// variables

					var a = null ;
					var i ;

					// 

					a = [ ] ;

					//return 

					return a ;

				},
				/**
				* Convert a given CSS color value to its hexadecimal equivalent.
				* @Param color (String) A CSS color value.
				* @Return String
				*/
				convertColorToHex: function convertColorToHex(color)
				{

					// variables

					var s ;
					var o ;

					// 

						if(  ( o = this.parseColorValue(color) )  ) {

								s = Meta.CHARACTER_HASH ;
								s += o.rgb[0].toString(16) ;
								s += o.rgb[1].toString(16) ;
								s += o.rgb[2].toString(16) ;

						}

					// return 

					return s ;

				}
		}
}  ) ;

}  )( ) ;