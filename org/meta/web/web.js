/*
@package org.meta.web
@require org.meta.standard, org.meta.util
@provide Cookie, Session
*/
(function( ) {

var Matcher = org.meta.util.Matcher,
	EventListener = org.meta.logic.event.EventListener ;

return {
		/**
		* Utility object for managing document cookies.
		* @link https://developer.mozilla.org/en-US/docs/DOM/document.cookie
		*/
		Cookie:
		{
				extend: 'org.meta.standard.Object',
				main: function main(entries)
				{
						this.entries = entries ;
				},
				global:
				{
						PATTERN_COOKIE: '\\s*([\\w\\-]+)=([^;]+);?',
						EXPIRATION_NEVER: 'never',
						EXPIRATION_TOMORROW: 'tomorrow',
						create: function create( )
						{
						
							// variables
							
							var entries = { },
								m,
								s,
								o ;
							
							//
							
								m = Matcher.create(this.PATTERN_COOKIE) ;

								/*Parse the cookie string and create and construct an entries object from the resulting key-value pairs.*/

								if((s = Meta.constant('DEFAULT_DOCUMENT').cookie).length > 0)
								{

										m.reset(s) ;

										while(m.lookingAt( ))
										{

												s = decodeURIComponent(m.group(2)) ;

												try { o = JSON.parse(s) ; }
												catch(error) { o = s ; }
												
												entries[m.group(1)] = {value: o} ;

										}

								}
								
							// return
							
							return new this(entries) ;
						
						}
				},
				/**
				* @param (Object) properties A property object containing at minimum the `value` property. The `expires` property must be a keyword (one of the global `org.meta.web.Cookie.EXPIRATION_<key>` properties of this object's constructor); or, a UTC time string (as obtained from `Date.prototype.toUTCString`; or, the empty string (in this case the entry expires at the end of the browser session).
				*/
				local:
				{
						/**
						* @link https://developer.mozilla.org/en-US/docs/Web/API/document.cookie
						*/
						addEntry: function addEntry(key, properties)
						{
						
							// preconditions
							
								Meta.assert(! this.hasEntry(key), 'Illegal State: entry already exists (key="%s")', key) ;
								Meta.assert(Meta.isSet('value', properties), 'Illegal Argument: argument for formal parameter `properties` does not specify required property `value`.') ;
							
							// variables
							
							var cookie,
								s,
								o ;
								
							//
								
								this.entries[key] = properties ;
								
								try { s = JSON.stringify(properties.value) ; }
								catch(error) { s = properties.value ; }
								
								cookie = key + Meta.constant('CHARACTERS').EQUALS + encodeURIComponent(s) + ';path=' + encodeURIComponent(properties.path || Meta.constant('CHARACTERS').SLASH) ;
								
								if(properties.secure) { cookie += ';secure' ; }
								if(properties.max_age) { cookie += ';max-age=' + properties.max_age ; }
								
								switch(properties.expires)
								{
								
										case this.constructor.EXPIRATION_NEVER: cookie += ';expires=Tue, 19 Jan 2038 03:14:07' ; break ;
										case this.constructor.EXPIRATION_TOMORROW: cookie += new Date(Date.now( ) + 24 * 60 * 60 * 1000).toUTCString( ) ; break ;
										default: cookie += ';expires=' + (properties.expires || '') ;
										
								}

								Meta.constant('DEFAULT_DOCUMENT').cookie = cookie ;

						},
						removeEntry: function removeEntry(key)
						{
						
							// preconditions
							
								Meta.assert(this.hasEntry(key), 'Illegal State: entry does not exist (key="%s")', key) ;
								
							//

								Meta.constant('DEFAULT_DOCUMENT').cookie = key + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/' ;
							
								delete this.entries[key] ;

						},
						hasEntry: function hasEntry(key) { return Meta.isSet(key, this.entries) ; },
						propertyOf: function propertyOf(key, property)
						{
												
							// preconditions
							
								Meta.assert(this.hasEntry(key), 'Illegal State: entry does not exist (key="%s")', key) ;
								
							// return
							
							return this.entries[key][property] || null ;
						
						},
						valueOf: function valueOf(key)
						{ throw 'Deprecated: unnecessary' ;
						
							// preconditions
							
								Meta.assert(this.hasEntry(key), 'Illegal State: entry does not exist (key="%s")', key) ;
								
							// return
							
								return this.propertyOf(key, 'value') ;

						}
				}
		},
		/**
		* A utility object for the management of user sessions.
		* @link http://tools.ietf.org/html/rfc1738
		*/
		Session:
		{
				extend: 'org.meta.logic.event.EventTarget',
				main: function main(cookie)
				{
				
						this.listeners = { } ;
						this.cookie = cookie ;

				},
				global:
				{
						EVENT_REFER: 'refer',
						EVENT_CLOSE: 'close',
						create: function create( )
						{
						
							// variables
							
							var session ;
							
							//
							
								session = new this(org.meta.web.Cookie.create( )) ;
								session.onClose(EventListener.create(function( ) { this.parameter.self.destroy( ) ; }, {self: session})) ;
								
							// return
							
							return session ;
						}
				},
				local:
				{
						destroy: function destroy( )
						{
						
								this.cookie.destroy( ) ;
								
								if(this.super.destroy) this.super.destroy(this) ;

						},
						/**
						* Refer this session to the given URL.
						* 
						* @todo polyfill
						* If a relative URI is given---starting with a slash ('/') character---the URI is supposed to be an internal referral, i.e. one that keeps the current session alive; if an aboslute URI is given---starting with a protocol and host portion, e.g. ''http://www.host.com ''---the referral is supposed to be external and the session will be closed.
						* @param uri (String) A URI to refer to.
						*/
						refer: function refer(url, options)
						{

							// variables

							var b = false,
								o,
								s ;

							//

								switch(url.charAt(0))
								{
										case Meta.constant('CHARACTERS').SLASH: b = true; s = url ; break ;
										case Meta.constant('CHARACTERS').HASH: b = true; s = Meta.constant('CHARACTERS').SLASH + url; break ;
										default: s = url;
								}

								o = {href: url} ;

								if(! b) this.triggerEvent(this.EVENT_CLOSE, o) ;
								else this.triggerEvent('refer', o) ;
								
								if(Meta.isSet('assign', Meta.constant('GLOBAL_OBJECT'))) { Meta.constant('GLOBAL_OBJECT').location.assign(s) ; }
								else { Meta.constant('GLOBAL_OBJECT').location = s ; }

						},
						onRefer: function onRefer(listener) { this.addListener(this.EVENT_REFER, listener) ; },
						onClose: function onClose(listener) { this.addListener(this.EVENT_CLOSE, listener) ; }
				}
		}
} ;
})( )