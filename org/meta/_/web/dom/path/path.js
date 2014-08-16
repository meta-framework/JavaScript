/**
* org.meta.web.dom.path library set-up script
* @author Friedrich Alexander Kurz, 2013, f.a.kurz@googlemail.com
*/

(function( ) {

/*-----The Path, Step, Predicate and Expression Objects for DOM traversal-----*/

Meta.define({
		name: "Expression",
		package: "org.meta.web.dom.path",
		prototype: "org.meta.core.Object",
		main: function main(expression)
		{
		
			// preconditions
			
			Meta.assert(Meta.isObject(expression), "Invalid type for parameter expression.") ;
			
			//
			
				this.source = expression.source ;
				this.invert = expression.invert ;
				this.comparator = expression.comparator ;
				this.key = expression.key ;
				this.value = expression.value ;
				this.parameter = expression.parameter ;
		
		},
		global: {
				TOKENS_COMPARISON: ["=","<",">","<=",">=","!=","~=","^=","$="],
				COMPARATOR_EQ: 0,
				COMPARATOR_LESS: 1,
				COMPARATOR_MORE: 2,
				COMPARATOR_LE: 3,
				COMPARATOR_GE: 4,
				COMPARATOR_NEQ: 5,
				COMPARATOR_CONTAINS: 6,
				COMPARATOR_STARTS_WITH: 7,
				COMPARATOR_ENDS_WITH: 8
		},
		local: {
				invert: null,
				comparator: null,
				key: null,
				value: null,
				parameter: null
		}
})
.define(  {
		name: "Predicate",
		package: "org.meta.web.dom.path",
		prototype: "org.meta.core.Object",
//		prototype: "org.meta.core.Settable",
//		require: ["org.meta.web.dom.Path.Expression"],
		main: function main(part)
		{

				if( Meta.isNull(part) ) { this.parts = [] ; }
				else if( Meta.instanceOf(Expression,part) || Meta.instanceOf(this.constructor,part) ) { this.parts = [part] ; }
				else { Meta.error("Invalid type for argument parts.") ; }

		},
		global: {
				TOKENS_PREDICATE: [],
				TOKEN_VARIABLE: "%",
				TOKEN_START: "[",
				TOKEN_STOP: "]",
				TOKEN_DISJUNCT: "|",
				TOKEN_CONJUNCT: "&",
				TOKEN_INVERT: "!",
				JUNCTOR_DISJUNCT: 0,
				JUNCTOR_CONJUNCT: 1
		},
		local: {
				parts: null,
				size: function size( ) { return this.parts.length ; }
		}		
})
.define({
		name: "Step",
		package: "org.meta.web.dom.path",
		prototype: "org.meta.core.Object",
		main: function main(step)
		{

			this.access = step.access ;
			this.namespace = step.namespace ;
			this.name = step.name ;
			this.predicate = step.predicate ;
			this.source = step.source ;

		},
		global: {
		
				ACCESS_DESCENDANT: 0,
				ACCESS_CHILD: 1,
				ACCESS_PARENT: 2,
				ACCESS_ANCESTOR: 3,
				TOKENS_ACCESS: ["","/","./",".."],

				NAME_ANY: "*",
				NAME_TYPE: "#"

		},
		local: {
				access: null,
				namespace: null,
				name: null,
//				axis: null,
				predicate: null,
				source: null,
				toString: function toString( ) { return "[object Step[source='" + this.source + "']]" ; }
		}
})
.define(  {
		name: "Path",
		package: "org.meta.web.dom.path",
		prototype: "org.meta.core.Object",
		require: ["org.meta.core.Matcher","org.meta.web.dom.Collection"],
		init: function init( )
		{

			//
			
				this.MATCHERS = { } ;
				
				for(var s in this.PATTERNS) { this.MATCHERS[s] = new Matcher( this.PATTERNS[s] ) ; }

		},
		main: function main(steps,source,variables)
		{
			
			//

				this.steps = steps ;
				this.source = source ;
				this.variables = variables ;
		
		},
		global: {
				PATTERNS: {
						STEP: "(/|\\./|\\.{2})?(?:([\\w\\-]+)\\:)?(\\*|#?[\\w\\-]+)(\\[[^\\s]+\\])?",
						EXPRESSION: "(!)?([\\w\\-]+)(\\([^()]*\\))?(?:([<>!~=\\$\\^]{1,2})(%?[\\w\\-0-9]+))?"
				},
				MATCHERS: null,
				/*A global constructor function for a path string and a variable object.*/
				newInstance: function newInstance(path,variables)
				{

					// variables
					
					var p = null, a, m, i, o, s, p ;
					
					//

						a = [] ;
						m = this.MATCHERS.STEP
						.reset(path) ;

						while( m.lookingAt( ) ) {

								o = {
										access: this.parseAccess( m.group(1) || null ),
										namespace: m.group(2),
										name: m.group(3),
										axis: null,
										predicate: null,
										source: m.group(0)
								} ;

								if(  !!  ( s = m.group(4) )  ) { o.predicate = this.parsePredicate(s,variables) ; }

								a[a.length] = new Step(o) ;

								/*Continue or break.*/

								i = m.end(0) ;
								
								if( path.charAt(i) === " " ) { m.from(i + 1) ; }
								else {

										if(i < path.length) { Meta.error("Syntax error at index %1;: ``...%2;''",i,path.substr(i)) ; }
										else { break ; }

								}

						}

						p = new this(a,path,variables) ;

					// return

					return p ;
				
				},
				parseAccess: function parseAccess(access)
				{

					// variables
					
					var i = Step.ACCESS_DESCENDANT ;
					
					//

						Meta.each(
								Step.TOKENS_ACCESS,
								function(index,token) {
										if(token === access) { i = index ; return false ; }
								}
						) ;
						
						if(i === -1) { Meta.error("Invalid access token (token=%1;)",access) ; }
						
					// return 
					
					return i ;
				
				},
				parseAxis: function parseAxis(axis)
				{ Meta.error("Deprecation") ;
				
					// variables
					
					var i = DOM.XML_NODE_TYPES.length, s ;
					
					//
					
						s = "#" + axis ;

						while(--i >= 0) {
								if( s === DOM.XML_NODE_TYPES[i] ) { break ; }
						}

					// return
					
					return i ;					
					
				},
				parsePredicate: function parsePredicate(string,variables)
				{

					// variables
					
					var stack, i = -1, s, a, p, o, e ;
//var j = -1 ;
					//
					
						stack = [ ] ;
						
						while(++i < string.length) {

								if(  ( s = string.charAt(i) )  ===  Predicate.TOKEN_START  ) { stack[stack.length] = new Predicate(null) ; }
								else if(s === Predicate.TOKEN_STOP) {

										/*Try to condense the stack, i.e. add the peek element to the previous element.*/

										if( !! ( p = stack[stack.length - 2] )  ) {
										
												a = p.parts ;
												a[a.length] = stack.pop( ) ;
												
										}

								}
								else if(s === Predicate.TOKEN_DISJUNCT || s === Predicate.TOKEN_CONJUNCT) {

										p = stack[stack.length - 1] ;

										if(s === Predicate.TOKEN_CONJUNCT) { p.junctor === 1 ; }
										else if(s === Predicate.TOKEN_DISJUNCT) { p.junctor === 0 ; }
										else { Meta.error("Syntax error.") ; }

								}
								else {
						
										e = new Expression( this.parseExpression(string,i,variables) ) ;

										p = stack[stack.length - 1] ;
										a = p.parts ;
										a[a.length] = new Predicate(e) ;

										i += e.source.length - 1 ;

								}
//Meta.log("%t;stack: %1;",stack[stack.length - 1].toSource()) ;
						}
						
						p = stack[0] ;
						

					// return

					return p ;

				},
				parseExpression: function parseExpression(string,index,variables)
				{

					// variables
					
					var o = null, m = this.MATCHERS.EXPRESSION, a, i1, i2, s ;
					
					//

						m = this.MATCHERS.EXPRESSION.reset(string)
						.from(index) ;

						if( m.lookingAt( ) ) {

								o = {
										source: m.group(0),
										invert: m.group(1) === Predicate.TOKEN_INVERT,
										key: m.group(2),
										parameter: null,
										comparator: !! ( s = m.group(4) ) ? this.parseComparator(s) : null,
										value: null
								} ;
								
								if(  !!  ( s = m.group(3) )  ) {
								
										a = s.substring(1,s.length - 1)
										.split(",") ;
										
										for( i1 = -1, i2 = a.length ; ++i1 < i2 ; ) {

												if( ( s = a[i1] ).charAt(0) === Predicate.TOKEN_VARIABLE ) { a[i1] = variables[s.substr(1)] ; }
												else { a[i1] = Meta.parse(s) ; }
												
										}
								
										o.parameter = a ;

								}

								if(  !!  ( s = m.group(5) )  ) {
								
										if( s.charAt(0) === Predicate.TOKEN_VARIABLE ) { o.value = !! variables ? variables[ s.substr(1) ] : null ; }
										else { o.value = Meta.parse(s) ; }

								}

						}
						else { Meta.error("Syntax error. ``...%1;''",string.substr(index)) ; }
						
						//m = this.MATCHERS.EXPRESSION.reset(string) ;

					// return o

					return o ;

				},
				parseComparator: function parseComparator(string)
				{
				
					// variables
					
					var i = -1 ;
					
					//
					
						Meta.each(
								Expression.TOKENS_COMPARISON,
								function(index,comparator) {
										if(string === comparator) { i = index ; return false ; }
								}
						) ;
						
						if(i === -1) { Meta.error("Invalid comparator string (string=%1;)",string) ; }
						
					// return 
					
					return i ;
					
				}
		},
		local: {
				steps: null,
				source: null,
				parameter: null,
				evaluate: function evaluate(context)
				{

					// preconditions

					Meta.assert(this.steps.length > 0, "Path is empty.") ;
					Meta.assert(Meta.isNode(context), "Invalid type for parameter context.") ;

					// variables
					
					var c = null, d, a = null, i1 = -1, i2 = this.steps.length, s ;
					
					//
					
						d = DOM.isDocument(context) ? context : context.ownerDocument ;
						s = this.steps[0] ;

						/*Since it's not possible to directly access non-element Nodes via DOM methods (if not using XPath), we have to get a context element list for a first step which searches descendant non element nodes.*/

						if(s.name.charAt(0) === Step.NAME_TYPE && s.access === Step.ACCESS_DESCENDANT) { a = DOM.findElements(d,Step.NAME_ANY,s.namespace) ; }
						else { a = [context] ; }

						while(++i1 < i2) {
						
								s = this.steps[i1] ;

								if(  ( a = this.evaluateStep(s,a,d) ).length  ===  0  ) { break ; }

						}
						
						c = new Collection(a) ;

					// return

					return c ;
				
				},
				evaluateStep: function evaluateStep(step,context,document)
				{

					// variables
					
					var result = [], i = context.length, a, n, s, p ;
					
					//
						
						/*Iterate the context node array.*/

						while(--i >= 0) {

								n = context[i] ;
								
								switch(step.access) {
								
										case Step.ACCESS_CHILD: {
										
												a = DOM.findChildren(n, step.name, document.lookupNamespaceURI(step.namespace)) ;

												if(a.length > 0) { result = a.concat(result) ;/*.concat(a) ;*/ }
												
											break ;
										
										}
										case Step.ACCESS_DESCENDANT: {

												if( (s = step.name).charAt(0) === Step.NAME_TYPE ) { a = DOM.findChildren(n, s, document.lookupNamespaceURI(step.namespace) ) ; }
												else { a = DOM.findElements(n, step.name, document.lookupNamespaceURI(step.namespace)) ; }

												if(a.length > 0) { result = a.concat(result) ;/*.concat(a) ;*/ }
												
											break ;
											
										}
										case Step.ACCESS_PARENT: { Meta.error("Awaiting implementation.") ;		}
										case Step.ACCESS_ANCESTOR: { Meta.error("Awaiting implementation.") ; }
										default: { Meta.error("Invalid access token (access=%1;).", Step.TOKENS_ACCESS[step.access]) ; }

								}

						}

						/*Predicate.*/

						if( (i = result.length) > 0 && !! (p = step.predicate) ) {
						
								a = [] ;

								while(--i >= 0 ) {
								
										n = result[i] ;
										
										if( this.evaluatePredicate(n,p) ) { a[a.length] = n ; }
								
								}
								
								result = a ;
								
						}

					// return
					
					return result ;
					
				},
				evaluateAxis: function evaluateAxis(context,axis)
				{

					// variables
					
					var result, i = context.length, a, n ;
					
					//
					
						result = [] ;
						
						while(--i >= 0) {
						
								n = context[i] ;
								 
								if(  ( a = DOM.findChildren(n,axis) ).length  >  0  ) { result = result.concat(a) ; }

						}
					
					// return
					
					return result ;
				
				},
				evaluatePredicate: function evaluatePredicate(node,predicate)
				{

					// variables
					
					var b = true, a, i = 0, p, s, o ;
					
					//
					
						a = predicate.parts ;
						
						/*Recursion ends when the `parts` `Array` of the `Predicate` only contains a single expression in which case it cannot nest other `Predicate`s.*/

						if( a.length === 1  &&  Meta.instanceOf(this.constructor.Expression, a[0]) ) { b = this.evaluateExpression( node, a[0] ) ; }
						else {

								i = a.length ;
								
								while(--i >= 0) {
								
										p = a[i] ;
										b = p.junctor === this.constructor.JUNCTOR_CONJUNCT ? b && this.evaluatePredicate(node,p) : b || this.evaluatePredicate(node,p) ;
								
								}
								
						}
						
					// return
					
					return b ;

				},
				evaluateExpression: function evaluateExpression(node,expression)
				{
					
					// variables
					
					var b = false, a, c, o, s ;
					
					//

						/*Attribute or function expression.*/
						
						if( !! (a = expression.parameter) ) {
						
								/*Function name.*/
								
								switch(expression.key) {
										case "value": { o = node.nodeValue ;/*@ToDo(fix error;returns DOM)*//*o = DOM.valueOf(node) ; */break }
										case "position": { o = DOM.positionOf(node) ; break ; }
										case "empty": { o = DOM.isEmpty(node) ; break ; }
										case "contains": {

												c = this.constructor.newInstance( expression.parameter[0], this.variables )
												.evaluate(node) ;
												o = ! c.isEmpty( ) ;

												break ;

										}
										/*...*/
								}
						
						}
						else { o = DOM.isElement(node) ? DOM.getAttribute(node,expression.key) : null ; }

						Meta.assert(! Meta.isVoid(o), "Predicate evaluation error.") ;

						if( ! Meta.isNull(expression.comparator) ) {

								s = expression.value ;

								if(!!! o) { b = false ; }
								else {

										switch(expression.comparator) {
												case Expression.COMPARATOR_EQ: { b = o === s ; break ; }
												case Expression.COMPARATOR_LESS: { b = o > s ; break ; }
												case Expression.COMPARATOR_MORE: { b = o < s ; break ; }
												case Expression.COMPARATOR_GE: { b = o >= s ; break ; }
												case Expression.COMPARATOR_LE: { b = o <= s ; break ; }
												case Expression.COMPARATOR_CONTAINS: { b = o .indexOf(s) !== -1 ; break ; }
												case Expression.COMPARATOR_STARTS_WITH: { b = o.indexOf(s) === 0 ; break ; }
												case Expression.COMPARATOR_ENDS_WITH: { b = o.length > s.length ? o.indexOf(s) === o.length - s.length : false ; break ; }
												default: Meta.error("Invalid comparator") ;
										}
										
								}
								
						}
						else { b = !! o ; }

						if(expression.invert) { b = !b ; }
										
					// return

					return b ;

				},
				toString: function toString( ) { return "[object Path[source='" + this.source + "']]" ; }
		}
}) ;

})( ) ;