/*
@identifier org.meta.web.URI
@extend org.meta.Object
@require org.meta.util.Matcher, org.meta.util.Tokenizer, org.meta.util.StringBuilder
@description An object representation of a URL.
@link [IETF-2005] http://www.ietf.org/rfc/rfc3986.txt
@link [IETF-1994] http://tools.ietf.org/html/rfc1738
@todo tests, optional URI validation
*/
(function( ) {

	var GEN_DELIMS = [':', '/', '?', '#', '[', ']', '@'],
		SUB_DELIMS = ['!', '$', '&', '\'', '(', ')', '*', '+', ',', ';', '='],
		RESERVED = GEN_DELIMS.concat(SUB_DELIMS),
		UNRESERVED = ['\\w', '\\d', '-', '.', '_', '~'],
		PCHAR = UNRESERVED.concat(SUB_DELIMS).concat(['%', 'a-f', 'A-F', ':', '@']), // this does not include validation of pct-encoded chars
//		URI.PATTERN_DEC_OCTET = '\d|[1-9]\d|2[0-4]\d|25[0-5]' ;

				
//		URI.PATTERN_PCT_ENCODED = '%[a-fA-F\d]{2}',
		/*
		URI.PATTERN_PATH = stringFormat('(?:/[%s]*)*', URI.PCHAR.join('')),
				
		URI.PATTERN_HIER_PART = stringFormat('//(?:%s)?%s', URI.PATTERN_AUTHORITY, URI.PATTERN_PATH) ; // reduced path matching
*/
/*
		URI.PATTERN_QUERY = stringFormat('[%s]*', URI.PCHAR.concat(['/', '?']).join(''))  ;
		URI.PATTERN_FRAGMENT = stringFormat('[%s]*', URI.PCHAR.concat(['/', '?']).join('')) ;
*/		
//		URI.PATTERN_AUTHORITY = stringFormat('(?:(%s))?%s(?::(%s))?', URI.PATTERN_USERINFO, URI.PATTERN_HOST, URI.PATTERN_PORT) ;
/*
		URI.PATTERN_HOST = stringFormat('%s|%s|%s', URI.PATTERN_IP_LITERAL, URI.PATTERN_IPV4_ADDRESS, URI.PATTERN_REG_NAME) ;
		URI.PATTERN_AUTHORITY = stringFormat('(?:(%s))?%s(?::(%s))?', URI.PATTERN_USERINFO, URI.PATTERN_HOST, URI.PATTERN_PORT) ;
		URI.PATTERN_URI = stringFormat('(%s):[/]{2}(%s(?:%s)?|%s|%s|%s)(?:\?%s)?(?:#%s)?', URI.PATTERN_SCHEME, URI.PATTERN_AUTHORITY, URI.PATTERN_PATH_ABSOLUTE, URI.PATTERN_PATH_ABSOLUTE_EMPTY, URI.PATTERN_PATH_ROOTLESS, URI.PATTERN_PATH_EMPTY) ;
		
		URI.RESERVED = arrayCopy(URI.GENERAL, 0, URI.GENERAL.length).concat(arrayCopy(URI.SUB, 0, URI.SUB.length)) ;
*/
		PATTERN_SCHEME = '\\w[\\w0-9+-.]*',
		PATTERN_AUTHORITY = stringFormat('(?:[%s]*@)?[^/]+(?::\\d*)?', UNRESERVED.concat(SUB_DELIMS).concat(['%', 'a-fA-F', '\\d', ':']).join('')), // this is a quick---non validating parser---for the authority part
		PATTERN_URI = stringFormat('(%s):(//[^/]*)?(/?[^?]*)(?:\\?([^#]))?(?:#(.*))?', PATTERN_SCHEME) ; // this is a quick---non-validating--- parser for URIs

	return {
			main: function main(string_value)
			{
					this.string_value = string_value ;
					this.parameter = { } ;
			},
			global:
			{
					/**
					* The general delimiters.
					* @link [IETF-2005] page 12
					* @deprecated
					*/
					GEN_DELIMS: arrayCopy(GEN_DELIMS, 0, GEN_DELIMS.length),
					/**
					* The sub delimiters.
					* @link [IETF-2005] page 12
					* @deprecated
					*/
					SUB_DELIMS: arrayCopy(SUB_DELIMS, 0, SUB_DELIMS.length),
					/**
					* The general delimiters and sub delimiters combined.
					* @link [IETF-2005] page 12
					* @deprecated
					*/
					RESERVED: arrayCopy(RESERVED, 0, RESERVED.length),
					/**
					* @link [IETF-2005] page 12
					* @deprecated
					*/
					UNRESERVED: arrayCopy(UNRESERVED, 0, UNRESERVED.length),
					/**
					* @link [IETF-2005] page 22
					* @deprecated
					*/
					PCHAR: arrayCopy(PCHAR, 0, PCHAR.length),
					/**
					* @link [IETF-2005] page 15
					*/
					PATTERN_URI: PATTERN_URI,
					/**
					* @link [IETF-2005] page 16
					* @deprecated
					*/
					PATTERN_SCHEME: PATTERN_SCHEME,
					/**
					* @link [IETF-2005] page 17
					*/
					PATTERN_AUTHORITY: PATTERN_AUTHORITY,
					/**
					* @link [IETF-1994] page 4
					*/
					SCHEME_FTP: 'ftp',
					/**
					* @link [IETF-1994] page 4
					*/
					SCHEME_HTTP: 'http',
					/**
					* @link [IETF-1994] page 4
					*/
					SCHEME_HTTPS: 'https',
					/**
					* @link [IETF-1994] page 4
					*/
					SCHEME_GOPHER: 'gopher',
					/**
					* @link [IETF-1994] page 4
					*/
					SCHEME_MAILTO: 'mailto',
					/**
					* @link [IETF-1994] page 4
					*/
					SCHEME_NEWS: 'news',
					/**
					* @link [IETF-1994] page 4
					*/
					SCHEME_NNTP: 'nntp',
					/**
					* @link [IETF-1994] page 4
					*/
					SCHEME_TELNET: 'telnet',
					/**
					* @link [IETF-1994] page 4
					*/
					SCHEME_WAIS: 'wais',
					/**
					* @link [IETF-1994] page 4
					*/
					SCHEME_FILE: 'file',
					/**
					* @link [IETF-1994] page 4
					*/
					SCHEME_PROSPERO: 'prospero',
					/**
					* Create a `URI` instance from a URI string.
					*/
					create: function create(uri_string)
					{
					
						// variables
						
						var uri,
							a1, a2,
							s ;
						
						//

							uri = new this(null) ;
console.log('URI::create') ;
							a1 = URI.parseURI(uri_string) ;
													
							uri.setScheme(a1[0]) ;
							uri.setPath(a1[3]) ;
							uri.setFragment(a1[5]) ;
							
							/*Parse Authority*/
							if((s = a1[1]))
							{
							
									a2 = URI.parseAuthority(s) ;

									uri.setAuthority(s) ;
									uri.setUserinfo(a2[0]) ;
									uri.setHost(a2[1]) ;
									uri.setPort(a2[2] || -1) ;
							
							}
							
							if((s = a1[4])) objectEach(URI.parseQuery(s), function(value, name) { uri.setQueryParameter(name, decodeURIComponent(value)) ; }) ;
							
						// return
						
						return uri ;
							
					},
					parseURI: function parseURI(uri)
					{

						// variables
						
						var parsed,
							m ;
						
						//
							
							m = Matcher.create(URI.PATTERN_URI) ;
							m.reset(uri) ;
													
							assert(m.matches( ), 'URI Syntax Error: URI string has invalid syntax (uri-string=%s).', uri) ;
							
							parsed = [m.group(1), m.group(2), m.group(3), m.group(4), m.group(5)] ;
							
							m.destroy( ) ;
							
						// return
						
						return parsed ;

					},
					parseAuthority: function parseAuthority(authority)
					{
					
						// variables
						
						var parsed,
							m ;
						
						//
						
							m = Matcher.create(URI.PATTERN_AUTHORITY) ;
							m.reset(authority) ;
							
							assert(m.matches( ), 'Authority Syntax Error: authority string has invalid syntax.') ;
							
							parsed = [m.group(1), m.group(2), m.group(3)] ;
							
							m.destroy( ) ;
							
						// return
						
						return parsed ;
							
					},
					parseQuery: function parseQuery(query_string)
					{
					
						// variables
						
						var query = { },
							t,
							a ;
						
						//
						
							t = Tokenizer.create(query_string) ;
							t.tokenize('&', function(string) {

									a = string.split('=') ;

									query[decodeURIComponent(a[0])] = decodeURIComponent(a[1]) ;
									
							}) ;
 
							t.destroy( ) ;
							
						// return
						
						return query ;
							
					}
			},
			local:
			{
					scheme: null,
					authority: null,
					userinfo: null,
					host: null,
					port: -1,
					path: null,
					query: null,
					parameter: null,
					fragment: null,
					setScheme: function setScheme(scheme) { this.scheme = scheme ; },
					getScheme: function getScheme( ) { return this.scheme ; },
					setAuthority: function setAuthority(authority) { this.authority = authority ; },
					getAuthority: function getAuthority( ) { return this.authority ; },
					setUserinfo: function setUserinfo(userinfo) { this.userinfo = userinfo ; },
					getUserinfo: function getUserinfo( ) { return this.userinfo ; },
					setHost: function setHost(host) { this.host = host ; },
					getHost: function getHost( ) { return this.host ; },
					setPort: function setPort(port) { this.port = port ; },
					getPort: function getPort( ) { return this.port ; },
					setPath: function setPath(path) { this.path = path ; },
					getPath: function getPath( ) { return this.path ; },
					setQuery: function setQuery(query) { this.query = query ; },
					getQuery: function getQuery( ) { return this.query ; },
					setQueryParameter: function setQueryParameter(name, value) { this.parameter[name] = value ; },
					getQueryParameter: function getQueryParameter(name) { return this.parameter[name] ; },
					setFragment: function setFragment(fragment) { this.fragment = fragment ; },
					getFragment: function getFragment( ) { return this.fragment ; },
					/**
					* Get the URI substring which identifies the requested file.
					* @contract This operation is ought to concatenate the file path, query and fragment components of the URI.
					*/
					getFileIdentifier: function getFileIdentifier( )
					{

						// variables

						var builder,
							s ;

						//
							if((s = this.getPath( )))
							{
							
									builder = new StringBuilder(s) ;

									if((s = this.getQuery( ))) builder.append('?')
									.append(s) ;
									if((s = this.getFragment( ))) builder.append('#')
									.append(s) ;
								
									return builder.build( ) ;
								
							}
						
						// return

							return null ;

					},
					toURIString: function toURIString( )
					{
							return this.string_value ;
					}
			}
	} ;

})( )