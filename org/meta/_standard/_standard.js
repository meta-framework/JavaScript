/*
@package org.meta.standard
@provide Object, Settable, Iterable, Iterator
*/
{
		Object:
		{
				global:
				{
						create: function create( ) { return new this( ) ; },
						/**
						* Reflectively call a function within this object's prototype using the given context object (or `null`) and passing the given parameter list (or null).
						* @param parameter (Object, Array) The parameter list for the reflective call to the function for the given name. If an array was passed, the function is called using `Function.prototype.apply`; `Function.prototype.call` otherwise. If you want to pass an array as the single parameter you need to wrap it in another array (e.g. `<constructor>.invoke(<name>, <context>, [a])` if `a` refers to an array type).
						* @return (?) The return of the reflectively called function.
						*/
/*@todo: for a null context value, invoke the constructor function (if applicable).*/
						invoke: function invoke(name, context, parameter)
						{

							// variables
							
							var f ;
							
							//

								if(! Meta.isSet(name, this.prototype)) throw new ReferenceError('Function is undefined (name="' + name + '")')
								else f = this.prototype[name] ;

								if(Meta.isArray(parameter)) return f.apply(context, parameter) ;
								else return f.call(context, parameter) ;
						
						}
				},
				local:
				{
						/**
						* Destroy this object.
						*
						* The general contract of this function is:
						* (0) the signature is `destroy(): void` (i.e. `destroy` has a void return and doesn't take any arguments);
						* (1) all properties of the instance should be deleted using the `delete` operator (e.g. `delete this.property`);
						* (2) where applicable, objects associated with the instance should be recursively destroyed (composition);
						* (3) the `destroy` function on the super object should be called on this object (if it exists); typically this call to the super object's `destroy` function has to be called last to keep references to associated objects in order to destroy them;
						* The `for <> in <>` control is used in order to delete all enumerable properties (including those inherited from the prototype object).
						*/
						destroy: function destroy( )
						{
						
								/*Iterate over all properties and delete them.*/
								
								for(var key in this) delete this[key] ;
								
						},
						copy: function copy( )
						{
								return new this(null) ;
						},
						toString: function( ) { return '[object ' + this.constructor.name + ']' ; }
				}
		},

		/**An abstract type providing an attribute bit map and related utility functions.*/		
		Settable: {
				type: Meta.constant('CONSTRUCTOR_TYPE_ABSTRACT'),
				extend: 'org.meta.standard.Object',
				local: {
						attributes: 0,
						setAttribute: function setAttribute(attribute)
						{

							//
							
								this.attributes |= attribute ;

							// return
							
							return this ;

						},
						hasAttribute: function hasAttribute(attribute)
						{
							return ((this.attributes & attribute) !== 0) ;
						},
						/**@todo: test*/
						removeAttribute: function removeAttribute(attribute)
						{
							
							//
							
								this.attributes &= ~(~this.attributes | attribute) ;
										
							// return
							
							return this ;

						}
				}
		},

		Iterable:
		{
				type: Meta.constant('CONSTRUCTOR_TYPE_ABSTRACT'),
				extend: 'org.meta.standard.Object',
				main: function main(elements)
				{
				
					//
					
						this.elements = elements ;

				},
				local:
				{
						get: function get(index) { return this.elements[index] ; },
						length: function length( ) { return this.elements.length ; },
						iterator: function iterator( ) { }
				}
		},
				
		Iterator:
		{
				type: Meta.constant('CONSTRUCTOR_TYPE_ABSTRACT'),
				extend: 'org.meta.standard.Object',
				main: function main(iterable)
				{
				
					// preconditions
					
						Meta.assert(Meta.instanceOf(org.meta.standard.Iterable, iterable), 'Invalid type for argument `iterable`.') ;
						
					//
					
						this.iterable = iterable ;

				},
				local:
				{
						iterable: null,
						current: -1,
						next: function next( )
						{
						
							// variables
							
							var i ;
							
							//
							
								if((i = ++this.current) < this.iterable.length( )) return this.iterable.get(i) ;
								else throw new Error('Index out of bounds.') ;
								
							// return
							
							return null ;

						},
						hasNext: function hasNext( )
						{
							return this.current + 1 < this.iterable.length( ) ;
						},
						forEach: function forEach(callback, context)
						{
						
							// variables
							
							var a ;
							
							//
							
								a = [,,this.iterable] ;

								while(this.hasNext( ))
								{

										a[0] = this.next( ), a[1] = this.current ;

										callback.apply(context, a) ;
										
								}

						}
				}
		}
		
}
