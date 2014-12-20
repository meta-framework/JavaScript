/*
@identifier org.meta.Object
@type abstract
*/
{
		global:
		{
				create: function create( ) { return new this(null) ; },
				/**
				* Reflectively call a function within this object's prototype using the given context object (or `null`) and passing the given parameter list (or null).
				* @param parameter (Object, Array) The parameter list for the reflective call to the function for the given name. If an array was passed, the function is called using `Function.prototype.apply`; `Function.prototype.call` otherwise. If you want to pass an array as the single parameter you need to wrap it in another array (e.g. `<constructor>.invoke(<name>, <context>, [a])` if `a` refers to an array type).
				* @return (?) The return value of the reflectively called function.
				*/
/*@todo: for a null context value, invoke the constructor function (if applicable).*/
				invoke: function invoke(name, context, parameter)
				{

					// variables
					
					var f ;
					
					//

						if(! isSet(name, this.prototype)) throw new ReferenceError('Function is undefined (name="' + name + '")')
						else f = this.prototype[name] ;

						if(isArray(parameter)) return f.apply(context, parameter) ;
						else return f.call(context, parameter) ;
				
				},
				getName: function getName( ) { return this.reflect.name ; },
				getType: function getType( ) { return this.reflect.identifier ; }
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
				* (3) the `destroy` function on the super object should be invoked on this object (if it exists); typically this call to the super object's `destroy` function has to be called last to keep references to associated objects in order to destroy them;
				* The `for <> in <>` control is used via `objectDestroy` in order to delete all enumerable properties (including those inherited from the prototype object).
				*/
				destroy: function destroy( ) { objectDestroy(this) ; },
				copy: function copy( ) { return new this(null) ; },
				toString: function( ) { return '[object ' + this.constructor.name + ']' ; }
		}
}