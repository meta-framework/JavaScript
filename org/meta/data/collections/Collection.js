/*
@abstract
@extend org.meta.logic.Iterable
@identifier org.meta.data.collections.Collection
@description An abstract type defininig core collection operations.
*/
{
		main: function main(/*attributes, limit,*/ comparator)
		{
//				this.attributes = attributes ;
//				this.limit = limit ;
				this.comparator = comparator ;
		},
		local:
		{
				/**
				* @abstract
				*/
				isEmpty: function isEmpty( ) { },
				/**
				* @abstract
				*/
				length: function length( ) { },
				/**
				* @abstract
				*/
				get: function get( ) { },
				contains: function contains(value)
				{
 
					// variables
 
					var comparator,
						iterator,
						next ;
 
					//
 
						if(! (comparator = this.comparator)) comparator = function(a, b) { return a === b ? 0 : -1 ; } ;
 
						iterator = this.iterator( ) ;
						while(iterator.hasNext( ))
						{
								next = iterator.next( ) ;
								if(comparator(value, next) === 0) return true ;
						}

					// return
					
						return false ;

				},
				/**
				* @param (Function) cf A characterizing function.
				* @param (Object) context The context object.
				*/
				find: function find(cf, context)
				{
 
					// variables
 
					var iterator,
						context = context || null,
						next ;
 
					//

						iterator = this.iterator( ) ;
 
						while(iterator.hasNext( ))
						{
								next = iterator.next( ) ;
								if(cf.call(context, next.value) === true) return next.value ;
						}
 
					// return

						return null ;
 
				},
				/**
				* @abstract
				*/
				iterator: function iterator( ) { }
		}
}