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
				create: function create(url)
				{
				
					// variables
					
					var url,
						a1, a2,
						s ;
						
					//
					
						/*Prefix the a placeholder null scheme for URL strings without scheme part (which are invalid as URIs) to be able to use the `URI::parseURI` operation without syntax error.*/
						
						if(url.charAt(0) === '/') s = 'null:' + (url.charAt(1) === '/' ? url : '//' + url) ;
					
						url = new this(null) ;
						
						a1 = URI.parseURI(url) ;
						
						/*Parse general URL parts.*/
						
						if((s = a1[0]) !== 'null') url.setScheme(s) ;
						else url.setScheme(null) ;
						
						uri.setPath(a1[3]) ;
						uri.setFragment(a1[5]) ;
						
						/*Parse Authority.*/
						
						if((s = a1[2]))
						{
						
								a2 = URL.parseAuthority(s) ;
								
								url.setUser(a2[0]) ;
								url.setPassword(a2[1]) ;
								url.setHost(a2[2]) ;
								
								s = a2[3] ;
								url.setPort(s == null ? -1 : parseInt(s)) ;
						
						}
						
						/*Switch depending on scheme name.*/
						
						switch(a[0])
						{
						
								case URI.SCHEME_FTP:
								
										/*Default to port 21 ([IETF-1994] page 5f)*/
										
										if(url.getPort( ) === -1) ur.setPort(21) ;
										
										/*Default password to 'anonymous'.*/
										
										if(url.getPassword( )) url.setPassword('anonymous') ;
										
								break ;
										
								case URI.SCHEME_HTTP || URI.SCHEME_HTTPS:
								
										assert(! (url.getPassword( ) && url.getUser( )), 'Illegal URL: scheme http or https does not allow password and/or user parts.') ;
								
								break ;
/*
								case URI.SCHEME_GOPHER
								case 'null':
										break ;
*/						
						}
				
				},
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