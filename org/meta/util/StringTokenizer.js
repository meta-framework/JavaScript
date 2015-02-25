/*
@identifier org.meta.util.StringTokenizer
@extend org.meta.Object
*/
{
		main: function main(string) { this.string = string ; },
		global:
		{
				create: function create(string) { return new this(string) ; }
		},
		local:
		{
				tokenize: function tokenize(token, callback)
				{

					// variables
					
					var index = 0, last = 0, skip = token.length, counter = -1, stop,
						a = [,,,,this] ;
					
					//
					
						/*Find indexes for the given delimiter and gather leading substrings.*/
						while((index = this.string.indexOf(token, last)) !== -1)
						{
							
								a[0] = this.string.substring(last, index), a[1] = last,	a[2] = index, a[3] = ++counter ;
						
								if(callback.apply(null, a) === false) return ; // break in case the callback returns false
								
								last = index + skip ;
								
						}
					
						/*Gather a potential trailing substring after the last delimiter's index (or the start index if none was found).*/
						stop = this.string.length ;
					
						if(last + 1 < stop)
						{
						
								a[0] = this.string.substring(last, stop), a[1] = last, a[2] = stop, a[3] = ++counter ;
						
								callback.apply(null, a) ; // strictly speaking we should return upon a false return of the callback, but this is the last statement anyway
							
						}
				
				}
		}

}