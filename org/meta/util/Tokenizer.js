/*
@identifier org.meta.util.Tokenizer
@extend org.meta.standard.Object
*/
{
		main: function main(string) { this.string = string ; },
		local:
		{
				tokenize: function tokenize(sequence, callback)
				{
				
					// variables
					
					var i1 = 0, i2 = 0, i3 = sequence.length, i4 = this.string.length, i5 = -1 ;
					
					//
					
						while((i1 = this.string.indexOf(sequence, i2)) !== -1)
						{
						
								callback.apply(null, [this.string.substring(i2, i1), ++i5]) ;
								
								i2 = i1 + i3 ;
								
						}
						
						if(i2 + 1 < i4) callback.apply(null, [this.string.substring(i2, i4), ++i5]) ;
				
				}
		}

}