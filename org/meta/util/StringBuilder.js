/*
@identifier org.meta.util.StringBuilder
@extend org.meta.Object
*/
{
		main: function main(initial) { this.parts = isString(initial) ? [initial] : [ ] ; },
		local:
		{
				append: function append(string, substitute/*...*/)
				{
				
					// variables
					
					var length ;
					
					//
					
						if((length = arguments.length) > 1) this.parts[this.parts.length] = stringFormat(string, arrayCopy(arguments, 1, length)) ;
						else this.parts[this.parts.length] = string ;
					
					// return
					
					return this ;

				},
				prepend: function prepend(string, substitute/*...*/)
				{
				
					// variables
					
					var length ;
					
					//
					
						if((length = arguments.length) > 1) this.parts.unshift(stringFormat(string, arrayCopy(arguments, 1, length))) ;
						else this.parts.unshift(string) ;
					
					// return
					
					return this ;
						
				},
				clear: function clear( )
				{
				
						this.parts = [ ] ;
					
					// return
					
					return this ;
	
				},
				build: function build( ) { return String.prototype.concat.apply('', this.parts) ; }
		}
}