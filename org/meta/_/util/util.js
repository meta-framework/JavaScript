/**
(c) Friedrich Alexander Kurz, 2013, f.a.kurz@googlemail.com
available under MIT-License

@Info Set-up script for the org.meta.util library.
@Info Some notes on the code layout (these are not rules but an overview over the way the code was written and--implicitely---suggestions on how to write aditional code):
(1) comments/documentation
(1.1) multi-line comments (/*...*\/) are used to describe or annotate the code, single-line comments are used to seperate pivotal code blocks;
(1.2) multi-line comments may include annotations headed by the at sign ('@'), most of these explain themselves, e.g. '@Note', '@ToDo';
(1.3) references to code are wrapped within back-ticks ('`...`') to keep things succinct;
(1.4) functions may be headed by a java-style code documentation block (`/** ... *\/`, double asterisk after the first slash) describing---among other things---the signature of the function and notes on implementation and usage (the first line should contain an informal code description, while the following lines should contain a more formal description using self-explanatory keys preceded by the at sign, e.g. '@Note', '@Usage', '@Param', '@Return');
(1.5) when referring to types uppercase names are used (e.g. 'Object' instead of object) in order to keep ambiguity at a minimum;
(2) layout/style
(2.1) copious amounts of whitespace are used for indentation and code seperation to achieve a readable and clear code layout;
(2.2) functions are generally seperated into (a) variable declaration, (b) logic and (c) return portions;
(2.3) variable names do not speak unless it's sensible to do so, i.e. for the most part only lowercase initials for the type are used (e.g. `f` for a Function type or `o` for an Object type).
(2.4) spaces are used to seperate between language tokens wherever possible and/or sensible in terms of readability (e.g. `var a = [] ;`)
*/

(  function( ) {

Meta.define(  {
		/**An Object wrapper for the RegExp core Object.*/
		name: "Matcher",
		package: "org.meta.util",
		prototype: "org.meta.core.Object",
		main: function(pattern)
		{

			// preconditions
			
			Meta.assert(Meta.isString(pattern), "Invalid type for parameter pattern.") ;
			
			//
			
				this.expression = new RegExp(pattern,"g") ;
				this.range = [0,0] ;

		},
		local: {
				expression: null,
				match: null,
				string: null,
				pattern: function pattern( ) { return this.expression.source ; },
				reset: function reset(string)
				{

						this.string = string ;
						this.index = 0 ;
						
					// return
					
					return this ;
				
				},
				from: function from(index)
				{
				
					//

						this.index = index ;
						
					// return
						
					return this ;
						
				},
				find: function find( )
				{

					// variables
					
					var o ;
					
					//
					
						this.expression.lastIndex = this.index ;

						if(  !!  ( o = this.expression.exec(this.string) )  &&  o.length !== 0  ) {

								this.match = o ;
								this.index = this.last( ) ;

								return true ;

						}

					// return
					
					return false ;

				},
				lookingAt: function lookingAt( )
				{

					// variables
					
					var o, i ;

					//

						i = this.expression.lastIndex = this.index ;

						/*@Note(The `Object` returned by `RegExp` is an augmented `Array` which contains the `input` and `index` properties; we are using the `index` property---i.e. the first index of the match---to evaluate whether the match begins at the specified start index for this matching operation. This nets a `lookingAt` operation without using an expression with a start-of-line ('^') token.*/

						if(  !!  ( o = this.expression.exec(this.string) )  &&  o.length !== 0  ) {

								if(o.index === i) {

										this.match = o ;
										this.index = this.last( ) ;

										return true ;
										
								}

						}
						
					// return
					
					return false ;
				
				},
				matches: function matches( )
				{
				
						this.expression.lastIndex = 0 ;
						
					return this.expression.test(this.string) ;
						
				},
				first: function first( ) { return !! this.match ? this.match.index : 0 ; },
				last: function last( ) { return this.expression.lastIndex ; },
				group: function group(index) { return !! this.match ? this.match[index] || null : null ; },
				/**Return the start index of the group for the given index.*/
				start: function start(index)
				{

					// variables
					
					var i1 = i2 = -1, s;
					
					//

						if(!! this.match && index <= this.match.length) {
						
								i1 = this.first( ) ;
								
								for( ; ++i2 < index ; ) { i1 += !! ( s = this.match[i2] ) ? s.length : 0 ; }
						
						}
						
					// return
					
					return i1 ;
				
				},
				end: function end(index)
				{
				
					// variables
					
					var i = -1, s ;
					
					//
					
						if(  ( i = this.start(index) )  !==  -1  ) { i += !! ( s = this.match[index] ) ? s.length  : 0 ; }
					
					// return
					
					return i ;
				
				}
		}
}  ) ;

}  )( ) ;