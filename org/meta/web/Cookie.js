/*
@identifier org.meta.web.Cookie
@extend org.meta.standard.Object
@require org.meta.util.Matcher
@description Utility object for managing document cookies.
@link https://developer.mozilla.org/en-US/docs/DOM/document.cookie
*/
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

						if((s = constant('DEFAULT_DOCUMENT').cookie).length > 0)
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
				addEntry: function addEntry(key, properties)
				{
				
					// preconditions
					
						assert(! this.hasEntry(key), 'Illegal State: entry already exists (key="%s")', key) ;
						assert(isSet('value', properties), 'Illegal Argument: argument for formal parameter `properties` does not specify required property `value`.') ;
					
					// variables
					
					var cookie,
						s,
						o ;
						
					//
						
						this.entries[key] = properties ;
						
						try { s = JSON.stringify(properties.value) ; }
						catch(error) { s = properties.value ; }
						
						cookie = key + constant('CHARACTERS').EQUALS + encodeURIComponent(s) + ';path=' + encodeURIComponent(properties.path || constant('CHARACTERS').SLASH) ;
						
						if(properties.secure) { cookie += ';secure' ; }
						if(properties.max_age) { cookie += ';max-age=' + properties.max_age ; }
						
						switch(properties.expires)
						{
						
								case this.constructor.EXPIRATION_NEVER: cookie += ';expires=Tue, 19 Jan 2038 03:14:07' ; break ;
								case this.constructor.EXPIRATION_TOMORROW: cookie += new Date(Date.now( ) + 24 * 60 * 60 * 1000).toUTCString( ) ; break ;
								default: cookie += ';expires=' + (properties.expires || '') ;
								
						}

						constant('DEFAULT_DOCUMENT').cookie = cookie ;

				},
				removeEntry: function removeEntry(key)
				{
				
					// preconditions
					
						assert(this.hasEntry(key), 'Illegal State: entry does not exist (key="%s")', key) ;
						
					//

						constant('DEFAULT_DOCUMENT').cookie = key + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/' ;
					
						delete this.entries[key] ;

				},
				hasEntry: function hasEntry(key) { return isSet(key, this.entries) ; },
				propertyOf: function propertyOf(key, property)
				{
										
					// preconditions
					
						assert(this.hasEntry(key), 'Illegal State: entry does not exist (key="%s")', key) ;
						
					// return
					
					return this.entries[key][property] || null ;
				
				},
				valueOf: function valueOf(key)
				{ throw 'Deprecated: unnecessary' ;
				
					// preconditions
					
						assert(this.hasEntry(key), 'Illegal State: entry does not exist (key="%s")', key) ;
						
					// return
					
						return this.propertyOf(key, 'value') ;

				}
		}
}