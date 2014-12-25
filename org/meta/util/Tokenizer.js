/*
@identifier org.meta.util.Tokenizer
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
console.log('Tokenizer.tokenize(%s)', token) ;
					// variables
					
					var index = 0, last = 0, skip = token.length, counter = -1, stop ;
					
					//
					
						/*Find indexes for the given delimiter and gather leading substrings.*/
						while((index = this.string.indexOf(token, last)) !== -1)
						{
						
								if(callback.apply(null, [this.string.substring(last, index), ++counter]) === false) return ; // break in case the callback returns false
								
								last = index + skip ;
								
						}
					
						/*Gather a potential trailing substring after the last delimiter's index (or the start index if none was found).*/
						stop = this.string.length ;
					
						if(last + 1 < stop) callback.apply(null, [this.string.substring(last, stop), ++counter]) ; // strictly speaking we should return upon a false return of the callback, but this is the last statement anyway
				
				}
		}

}