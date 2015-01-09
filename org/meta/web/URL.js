/*
@identifier org.meta.web.URL
@extend org.meta.web.URI
@require org.meta.web.URI
@description An object representation of a URL. URLs are a subset of URIs with a reduced syntax rule set.
@link [IETF-1994] http://tools.ietf.org/html/rfc1738
@todo optional URL validation
@todo use `URL` object where possible (http://url.spec.whatwg.org/#dom-url )
*/
{
		global:
		{
				/**@todo test polyfill; additional URL validation; revision on the homogenization branch for this constructor.*/
				create: (function( ) {
						if(isSet('URL', GLOBAL_OBJECT)) return function create(url_string)  // use the `URL` object if it exists
						{
// console.log('URL::create') ;
							// variables
							
							var url,
								u,
								s,/*
								builder,*/
								a ;
							
							//

								url = new this(url_string) ;
								u = new GLOBAL_OBJECT.URL(url_string) ;
						 
								/*Set the protocol scheme of the URL.*/
								url.setScheme(u.protocol) ;
						 
								/*Set the (components of the) authority part of the URL.*/
//								builder = new StringBuilder('') ;
						 
								if(! stringEmpty((s = u.username))) url.setUser(s) ;
								else url.setUser(null) ;
						 
								if(! stringEmpty((s = u.password))) url.setPassword(s) ;
								else url.setPassword(null) ;
						 
								url.setHost((s = u.host)) ;
						 
								if(! stringEmpty((s = u.port))) url.setPort(parseInt(s, 10)) ;
								else url.setPort(-1) ;
						 
/*
								url.setUser(u.username === '' ? null : u.username) ;
								url.setPassword(u.password === '' ? null : u.password) ;
								url.setHost(u.host) ;
								url.setPort(u.port === '' ? -1 : parseInt(u.port)) ;
*/
								url.setAuthority(u.hostname) ;
						 
								/*Set the file path part of the URL.*/
								url.setPath(u.pathname) ;
						 
								/*Set the query part of the URL.*/
						 
								if(! stringEmpty((s = u.search)))
								{

										url.setQuery(u.search.substring(1)) ;
						 
										objectEach(URI.parseQuery(url.getQuery( )), function(v, k) { url.setQueryParameter(k, v) ; }) ;
						 
								}
						 
								/*Set the fragment part of the URL.*/
								//url.setFragment(u.hash === '' ? null : u.hash.substring(1)) ;
								if(! stringEmpty((s = u.hash))) url.setFragment(s) ;
								else url.setFragment(null) ;
						 
								/*Set defaults depending on protocol scheme name and validate the URL.*/
								switch(url.getScheme( ))
								{
								
										case URI.SCHEME_FTP:
										
												/*Default to port 21 ([IETF-1994] page 5f)*/
												if(url.getPort( ) === -1) url.setPort(21) ;
												
												/*Default password to 'anonymous'.*/
												if(url.getPassword( )) url.setPassword('anonymous') ;
												
										break ;
												
										case URI.SCHEME_HTTP || URI.SCHEME_HTTPS:
										
												assert(! (url.getPassword( ) && url.getUser( )), 'Illegal URL: scheme http or https does not allow password and/or user parts.') ;
										
										break ;
						 
										//...
								}

							// return
							
								return url ;

						}
						else return function create(url_string) {
						
							// variables
							
							var url,
								s,
								a1, a2 ;
								
							//
							
								/*Prefix the a placeholder null scheme for URL strings without scheme part (which are invalid as URIs) to be able to use the `URI::create` constructor operation (implicitely, the `URI::parseURI` operation) without syntax error. Basically we're cheating URI to accept the URL string as an URI string. Don't tell anyone. ;-)*/
								if(url_string.charAt(0) === '/') s = 'null:' + (url_string.charAt(1) === '/' ? url_string : '//' + url_string) ;
								else s = url_string ;
// console.log('URL::create') ;
								/*Call the URI constructor on this constructor.*/
								url = URI.create.call(this, url_string) ;
// console.log('new-url:') ;
// console.dir(url) ;
/*
								a1 = URI.parseURI(s) ;
console.log('parsed-url (%s): %s', url_string, a1) ;
								/*Create a URL instance.*
								url = new this(null) ;
								
								/*Parse general URL parts.*
								if((s = a1[0]) !== 'null') url.setScheme(s) ;
								else url.setScheme(null) ;
								
								url.setPath(a1[3]) ;
								url.setFragment(a1[5]) ;
								
								/*Parse Authority.*
								if((s = a1[2]))
								{
								
										a2 = URL.parseAuthority(s) ;
										
										url.setUser(a2[0]) ;
										url.setPassword(a2[1]) ;
										url.setHost(a2[2]) ;
										
										s = a2[3] ;
										url.setPort(s == null ? -1 : parseInt(s)) ;
								
								}
								
								/*Set defaults depending on scheme name.*/
								switch(a[0])
								{
								
										case URI.SCHEME_FTP:
										
												/*Default to port 21 ([IETF-1994] page 5f)*/
												if(url.getPort( ) === -1) url.setPort(21) ;
												
												/*Default password to 'anonymous'.*/
												if(url.getPassword( )) url.setPassword('anonymous') ;
												
										break ;
												
										case URI.SCHEME_HTTP || URI.SCHEME_HTTPS:
										
												assert(! (url.getPassword( ) && url.getUser( )), 'Illegal URL: scheme http or https does not allow password and/or user parts.') ;
										
										break ;
/*@todo: continue
										case URI.SCHEME_GOPHER
										case 'null':
												break ;
*/
								}

						}
						
				})( ),
				parseAuthority: function parseAuthority(authority)
				{
				
					// variables
					
					var parsed,
						a,
						s ;
						
					//
					
						a = URI.parseAuthority(authority) ;
						
						parsed[2] = a[1] ;
						parsed[3] = a[2] ;
						
						/*Parse a potenital user name and password part.*/
						
						if((s = a[0]))
						{
								if((a = stringTokenize(s, ':')).length === 1) parsed[1] = s, parsed[2] = null ;
								else parsed[0] = a[0], parsed[1] = a[1] ;
						}
						
					// return
					
					return parsed ;
				
				}
		},
		local:
		{
				user: null,
				password: null,
				setUser: function setUser(user) { this.user = user ; },
				getUser: function getUser( ) { return this.user ; },
				setPassword: function setPassword(password) { this.password = password ; },
				getPassword: function getPassword( ) { return this.password ; }
		}
}