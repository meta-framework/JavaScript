/*
@identifier org.meta.web.URI
@extend org.meta.standard.Object
@require org.meta.util.Matcher, org.meta.util.Tokenizer
@description An object representation of a URL.
@link [IETF-2005] http://www.ietf.org/rfc/rfc3986.txt
@link [IETF-1994] http://tools.ietf.org/html/rfc1738
@todo optional URI validation
*/
(function( ) {

	var URI = { } ;
	
		URI.GEN_DELIMS = [':', '/', '?', '#', '[', ']', '@'] ;
		URI.SUB_DELIMS = ['!', '$', '&', '\'', '(', ')', '*', '+', ',', ';', '='] ;
		URI.RESERVED = URI.GEN_DELIMS.concat(URI.SUB_DELIMS) ;
		URI.UNRESERVED = ['\\w', '\\d', '-', '.', '_', '~'] ;
		URI.PCHAR = URI.UNRESERVED.concat(URI.SUB_DELIMS).concat(['%', 'a-f', 'A-F', ':', '@']) ; // this does not include validation of pct-encoded chars
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


		URI.PATTERN_SCHEME = '\\w[\\w0-9+-.]*';

		URI.PATTERN_AUTHORITY = stringFormat('(?:[%s]*@)?[^/]+(?::\\d*)?', URI.UNRESERVED.concat(URI.SUB_DELIMS).concat(['%', 'a-fA-F', '\\d', ':']).join('')) ; // this is a quick, non validating parser, for the authority part 

		URI.PATTERN_URI = stringFormat('(%s):(//[^/]*)?(/?[^?]*)(?:\\?([^#]))?(?:#(.*))?', URI.PATTERN_SCHEME) ; // this is a quick, non-validating, parser for URIs

var o = {
		global:
		{
				/**
				* The general delimiters.
				* @link [IETF-2005] page 12
				* @deprecated
				*/
				GEN_DELIMS: arrayCopy(URI.GEN_DELIMS, 0, URI.GEN_DELIMS.length),
				/**
				* The sub delimiters.
				* @link [IETF-2005] page 12
				* @deprecated
				*/
				SUB_DELIMS: arrayCopy(URI.SUB_DELIMS, 0, URI.SUB_DELIMS.length),
				/**
				* The general delimiters and sub delimiters combined.
				* @link [IETF-2005] page 12
				* @deprecated
				*/
				RESERVED: arrayCopy(URI.RESERVED, 0, URI.RESERVED.length),
				/**
				* @link [IETF-2005] page 12
				* @deprecated
				*/
				UNRESERVED: arrayCopy(URI.UNRESERVED, 0, URI.UNRESERVED.length),
				/**
				* @link [IETF-2005] page 22
				* @deprecated
				*/
				PCHAR: arrayCopy(URI.PCHAR, 0, URI.PCHAR.length),
				/**
				* @link [IETF-2005] page 15
				*/
				PATTERN_URI: URI.PATTERN_URI,
				/**
				* @link [IETF-2005] page 16
				* @deprecated
				*/
				PATTERN_SCHEME: URI.PATTERN_SCHEME,
				/**
				* @link [IETF-2005] page 17
				*/
				PATTERN_AUTHORITY: URI.PATTERN_AUTHORITY,
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
				create: function create(uri)
				{
				
					// variables
					
					var uri,
						a1, a2,
						s ;
					
					//

						uri = new this(null) ;

						a1 = URI.parseURI(uri) ;
												
						uri.setScheme(a1[0]) ;
						uri.setPath(a1[3]) ;
						uri.setFragment(a1[5]) ;
						
						/*Parse Authority*/

						if((s = a1[1]))
						{
						
								a2 = URI.parseAuthority(s) ;

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
												
						assert(m.matches( ), 'URI Syntax Error: URI string has invalid syntax.') ;
						
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
				parseQuery: function parseQuery(query)
				{
				
					// variables
					
					var query = { },
						a ;
					
					//
					
						Tokenizer.create(query)
						.tokenize('&', function(string) {

								a = string.split('=') ;
								
								query[decodeURIComponent(a[0])] = decodeURIComponent(a[1]) ;
								
						}) ;
						
					// return
					
					return query ;
						
				}
		},
		local:
		{
				scheme: null,
				userinfo: null,
				host: null,
				port: -1,
				path: null,
				query: null,
				fragment: null,
				setScheme: function setScheme(scheme) { this.scheme = scheme ; },
				getScheme: function getScheme( ) { return this.scheme ; },
				setUserinfo: function setUserinfo(userinfo) { this.userinfo = userinfo ; },
				getUserinfo: function getUserinfo( ) { return this.userinfo ; },
				setHost: function setHost(host) { this.host = host ; },
				getHost: function getHost( ) { return this.host ; },
				setPort: function setPort(port) { this.port = port ; },
				getPort: function getPort( ) { return this.port ; },
				setPath: function setPath(path) { this.path = path ; },
				getPath: function getPath( ) { return this.path ; },
				setQueryParameter: function setQueryParameter(name, value) { this.query[name] = value ; },
				getQueryParameter: function getQueryParameter(name) { return this.query[name] ; },
				setFragment: function setFragment( ) { this.fragment = fragment ; },
				getFragment: function getFragment( ) { return this.fragment ; },
				toURIString: function toURIString( )
				{
						throw '...' ;
				}
		}
} ;

	objectEach(URI, function(value, name) { delete URI[name] ; }) ;
	
	delete URI ;
	
return o ;

})( )