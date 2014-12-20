/*
@identifier org.meta.logic.Setable
@type abstract
@extend org.meta.Object
@description An abstract type providing an attribute bit map and related utility functions.
*/
{
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
				/**
				* Remove bits from the attributes bitmap.
				*
				* @implementation Let `a` denote the `attributes` bitmap and `b` denote the given bitmap; let a_i or b_i be the i-th bit of a or b. The following algorithm is used
				*	(1) `~a` [invert the `attributes` bitmap (any bit which was one is now zero and v.v.)]
				*	(2) `c:=~a|b`;  let `c_i:=(~a|b)_i` [perform a logical disjunction on the inverted `attributes` bitmap and the given bitmap]
				*		(2.1) `b_i = 1` [Bit is set on the given bitmap]:
							(2.1.1) `a_i=1` [Bit was set on the `attribute` bitmap]: `c_i=1` [`~1|1=1`]
							(2.1.1) `a_i=0` [Bit was not set on the `attribute` bitmap]: `c_i=1` [`~0|1`]
						(2.2) `b_i=0` [Bit is not set on the given bitmap]:
							(2.2.1) `a_i=1` [Bit was set on the `attribute` bitmap]: `c_i=0` [`~1|0`]
							(2.2.1) `a_i=0` [Bit was not set on the `attribute` bitmap]: `c_i=1` [`~0|0`]
					(3) invert the bitmap which is the result of "(2)"
				* As can be seen from the above, only the bits which were set on the `attribute` bitmap but not on the given bitmap are retained all others are zero.
				*
				* @todo: test
				*/
				removeAttribute: function removeAttribute(attribute)
				{
					
					//
					
						this.attributes &= ~(~this.attributes | attribute) ;
								
					// return
					
					return this ;

				}
		}
}