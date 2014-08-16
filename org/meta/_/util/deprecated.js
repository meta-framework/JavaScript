.define(  {
		name: "Math",
		package: "org.meta.util",
		prototype: "org.meta.Object",
		require: ["org.meta.Object"],
		global: {
				FUNCTION_BEZIER_CUBIC: function(time,p0,p1,p2,p3)
				{

					// set variables
					
					var n1 = null, n2 ;
					
					// set n1
					
						n2 = (1 - time) ;
					
						n1 = ( 
								( Math.pow(n2,3) * p0 ) + 
								( 3 * Math.pow(n2,2) * time * p1 ) + 
								( 3 * n2 * Math.pow(time,2) * p2 ) + 
								( Math.pow(time,3) * p3 ) 
						) ;
						
					// return n1
					
					return n1 ;

				},
				/**
				* Round a given `Number` value to the closest value in the given set of `Number` values.
				* @param number (Number) A `Number` value.
				* @param values (Array) An ordered set of possible values to round to.
				*/
				roundTo: function roundTo(number,values)
				{

					// set variables

					var n1 = 0, n2 ;

					// set n1

						Meta.each(
							values,
							function(index,value) {
								/*@note("If the difference between the given `Number` value and a value in the given `Number` set is zero they are identical and we may break iteration.")*/
								if( (n2 = Math.abs(number - value)) === 0 ) { n1 = value ; return false ; }
								/*@note("If the difference between the given `Number` value and a value in the given `Number` set is smaller than that of the closest `Number` value thus far, set `n1` to this value.")*/
								else if( n2 < (number - n1) ) { n1 = value ; }
							}
						) ;

					// return n1

					return n1 ;

				},
				roundToPrecision: function roundToPrecision(number,decimals)
				{
				
					// set variables
					
					var n ;
					var i ;
					
					// set n
					
						i = Math.pow(10,decimals) ;
						n = Math.round( (number * i) ) / i ;
					
					// return n
					
					return n ;

				},
				/**
				* Round a given `Number` value to the closest higher value in the given ordered set of `Number` values. If no `Number`
				* value within the given set of `Number`s is higher than the given `Number` value this method ill return the given
				* `Number` itself.
				* @param number (Number) A `Number` value.
				* @param values (Array) An ordered set of possible values to round to.
				*/
				ceilTo: function ceilTo(number,values)
				{

					// set variables

					var n1 = number, n2 = Number.POSITIVE_INFINITY ;

					// set n1

						Meta.each(
							values,
							function(index,value) {

								if(value > number) {
										if( Math.abs(number - value)  <  Math.abs(number - n2)  ) { n2 = value ; n1 = value ; }
								}

							}
						) ;

					// return n1

					return n1 ;

				},
				ceilToPrecision: function ceilToPrecision(number,decimals)
				{
				
					// set variables
					
					var n ;
					var i ;
					
					// set n
					
						i = Math.pow(10,decimals) ;
						n = Math.ceil( (number * i) ) / i ;
					
					// return n
					
					return n ;

				}
		}
}  ) ;
