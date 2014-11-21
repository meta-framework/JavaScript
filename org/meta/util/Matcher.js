/*
@identifier org.meta.util.Matcher
@extend org.meta.standard.Object
@description An Object wrapper for the RegExp core object.
*/
{
		main: function(expression)
		{

			//
			
				this.expression = expression ;

		},
		global:
		{
				create: function create(pattern)
				{
				
					// preconditions
					
						assert(isString(pattern) && pattern.length > 0, 'Illegal Argument: argument for formal parameter `pattern` must be non-empty string.') ;
				
					// return
					
					return new this(new RegExp(pattern, 'g')) ;

				}
		},
		local: {
				/**@type RegEx*/
				expression: null,
				match: null,
				string: null,
				pattern: function pattern( ) { return this.expression.source ; },
				reset: function reset(string)
				{

						this.string = string ;
						this.index = 0 ;
						this.expression.lastIndex = 0 ;
						
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

						if((o = this.expression.exec(this.string)) && o.length !== 0) {

								this.match = o ;
								this.index = this.last( ) ;

								// return

								return true ;

						}

					// return
					
					return false ;

				},
				/**
				* Find a match which starts at the current index.
				*
				* @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
				*/
				lookingAt: function lookingAt( )
				{

					// variables
					
					var i ;
					
					//
					
						i = this.last( ) ;
						
						/*If a match was found the first index of the match must be equal to next index (the index to continue at---if possible) as determined by the last matching operation.*/

						if(this.find( )) return i === this.first( ) ;

					// return
					
					return false ;
				
				},
				matches: function matches( )
				{
				
						this.expression.lastIndex = 0 ;
						
					// return
						
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
					
						if((i = this.start(index)) !== -1) { i += !! (s = this.match[index]) ? s.length : 0 ; }
					
					// return
					
					return i ;
				
				}
		}
		
}