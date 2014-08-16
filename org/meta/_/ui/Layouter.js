/*@Deprecated*/
Meta.define(  {
		/**
		`Layouter` calculates CSS style data for a given root `Element` `Node` and its descendants and posts the results to a given `org.meta.ui.StyleSheet` `Object`.
		If the `layout(Node)` `Function` property of this `Object` is passed an `Element` `Node` or `Element` `Node` tree, `Layouter` will calculate and post an exact
		(static) layout according to the `Node`(s) layouting properties (e.g. ``layout'', ``height'', ``width'',``align'', ``padding'', ``margin'', ``style''). To create
		an adaptive page layout, the `layout(Node)` `Function` property must be bound to a resize handler.
		@Note Future implementations of this `Object`'s functionality should aim at replacing DOM structures with a single ``CANVAS'' `Element` containing a drawing of 
		DOM structure.
		*/
		name: "Layouter",
		package: "org.meta.ui",
		prototype: "org.meta.logic.Eventable",
		init: function init( )
		{
		
			// set this

				this.LAYOUTS = {
						block: {
								position: "absolute",
								display: "block",
								height: "100%",
								width: "100%"
						},
						"list-block": {
								position: "absolute",
								display: "block",
								width: "100%",
								"list-style-type": "none"
						},
						flow: {
								position: "relative",
								display: "block",
								height: "auto",
								width: "100%"
						},
						"inline-flow": {
								position: "relative",
								display: "inline-block",
								height: "auto",
								width: "auto"
						},
						text: {
								position: "relative",
								display: "inline"
						},
						image: {
								position: "relative",
								display: "block",
								height: "100%",
								width: "auto"
						}
				} ;
				
				this.MATCHER_BORDER = new RegExp(this.PATTERN_BORDER,"g") ;
				this.MATCHER_SHADOW = new RegExp(this.PATTERN_SHADOW,"g") ;
				this.MATCHER_CLIP = new RegExp(this.PATTERN_CLIP,"g") ;
				this.MATCHER_GRADIENT = new RegExp(this.PATTERN_GRADIENT,"g") ;
				this.MATCHER_BACKGROUND = new RegExp(this.PATTERN_BACKGROUND,"g") ;

		},
		main: function main(root,sheet)
		{
		
			// set variables
			
			var o ;
			
			// set this

				this.sheet = ( sheet || new org.meta.ui.StyleSheet( {type: "text/css", media: "screen"} )  ) ;
				this.static = new org.meta.ui.StyleSheet( {type: "text/css", media: "screen"} ) ;
				
				this.handlers = new org.meta.logic.Eventable.Handlers( ) ;

				this.static.addRule(
						"*{"
						+ "overflow:hidden;"
						+ "margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;"
						+ "padding-top:0;padding-right:0;padding-bottom:0;padding-left:0;"
						+ "border-top-width:0;border-right-width:0;border-bottom-width:0;border-left-width:0;"
						+ "outline: 0;"
						+ "font-size: inherit;"
						+ "line-height: inherit;"
						+ "text-decoration: none;"
						+ "font-family: inherit;"
						+ "color: inherit;"
						+ "background-color: transparent;"
						+ "}"
				) 
				.addRule("html,body{height:100%;width:100%;}")
				.addRule("body{font-size:0.625em;}") ;
				
				Meta.each(
						this.LAYOUTS,
						function(name,value) {
								this.static.addRule(
										( "." + name + "{" + org.meta.ui.CSS.writeRuleSet(value) + "}" )
								) ;
						},
						this
				) ;

		},
		global: {
				PATTERN_BORDER: "([0-9.]+[a-z%]*)\\s(#[a-fA-F0-9]{3,6}|(?:rgb|hsl|rgba|hsla)\\([0-9,.]+\\))?\\s*([a-z]+)?\\s*\\|?",
				PATTERN_SHADOW: "((?:[0-9.\\-\\s]+%?)+)\\s(#[a-fA-F0-9]{3,6}|(?:rgb|hsl|rgba|hsla)\\([0-9,.]+\\))",
				PATTERN_CLIP: "([a-z]+)\\s*:\\s*((?:[0-9.\\-\\s]+%?)+)",
				PATTERN_GRADIENT: "(horizontal|vertical)\\s+(#[a-fA-F0-9]{3,6}|(?:rgb|hsl|rgba|hsla)\\([0-9,.]+\\))\\s+(#[a-fA-F0-9]{3,6}|(?:rgb|hsl|rgba|hsla)\\([0-9,.]+\\))",
				PATTERN_BACKGROUND: "(?:(cover|contain|auto)\\s+url\\((['\"])([^'\"]+)\\2\\))|(#[a-fA-F0-9]{3,6}|(?:rgb|hsl|rgba|hsla)\\([0-9,.]+\\))",
				PROPERTY_NAME_GLOBAL_HEIGHT: "global-height",
				PROPERTY_NAME_GLOBAL_WIDTH: "global-width",
				PROPERTY_NAME_LOCAL_HEIGHT: "local-height",
				PROPERTY_NAME_LOCAL_WIDTH: "local-width",
				PROPERTY_LAYOUT: "layout",
				PROPERTY_MARGIN: "margin",
				PROPERTY_SHADOW: "shadow",
				PROPERTY_BORDER: "border",
				PROPERTY_PADDING: "padding",
				PROPERTY_HEIGHT: "height",
				PROPERTY_WIDTH: "width",
				PROPERTY_ALIGN: "align",
				PROPERTY_SHAPE: "shape",
				PROPERTY_CLIP: "clip",
				PROPERTY_STYLE: "style",
				LAYOUT_BLOCK: "block",
				LAYOUT_INLINE_BLOCK: "inline-block",
				LAYOUT_FLOW: "flow",
				LAYOUT_INLINE_FLOW: "inline-flow",
				LAYOUT_TEXT: "text",
				ALIGN_LEFT: "left",
				ALIGN_RIGHT: "right",
				ALIGN_TOP: "top",
				ALIGN_BOTTOM: "bottom",
				ALIGN_CENTER: "center",
				//..
				SHAPE_SQUARE: "square",
				SHAPE_OBLONG: "oblong",
				//..
				parseLengthValue: function parseLengthValue(length)
				{
					
					// set variables
					
					var a1 = [ ], a2 ;
					
					// set a
					
						a2 = length.split("\\s*\\|\\s*") ;
						
						Meta.each(
								a2,
								function(index,value) { a1.push( org.meta.ui.CSS.parseLengthValue(value) ) ; }
						) ;
					
					// return a1
					
					return a1 ;

				},
				parseBorderValue: function parseBorderValue(border)
				{
				
					// set variables
					
					var a1 = [ ], a2 ;
					
					// set a

						this.MATCHER_BORDER.lastIndex = 0 ;
						
						while(  !! ( a2 = this.MATCHER_BORDER.exec(border) )  ) { a1.push(a2) ; }
					
					// return a1
					
					return a1 ;

				},
				parseShadowValue: function parseShadowValue(shadow)
				{
				
					// set variables
					
					var a1 = [ ], a2, a3 ;
					var s ;
					var i ;
					var n ;
					
					// set a1
Meta.log("> parseShadowValue (``%1;'')",shadow) ;
						this.MATCHER_SHADOW.lastIndex = 0 ;

						a2 = this.MATCHER_SHADOW.exec(shadow) ;
Meta.log("%t;>> matched: {%1;}",a2) ;
						a3 = Meta.trim( a2[1] )
						.split(Meta.CHARACTER_SPACE) ;

						i = a3.length - 1 ;
Meta.log("%t;>> split (%1;): {%2;}",i,a3) ;
						n = a1[0] = Meta.parseNumber( a3[0] ) / 100 ;
						a1[4] = Meta.parseNumber( a3[i] ) / 100 ;
						a1[5] = a2[2] ;
						
						if(i === 1) { a1[1] = a1[2] = a1[3] = n ; }
						else if(i === 2) {
						
								a1[2] = n ;
								a1[1] = a1[3] = Meta.parseNumber( a3[1] ) / 100 ;
								
						}
						else if(i === 4) {
								a1[1] = Meta.parseNumber( a3[1] ) / 100 ;
								a1[2] = Meta.parseNumber( a3[2] ) / 100 ;
								a1[3] = Meta.parseNumber( a3[3] ) / 100 ;
						}
Meta.log("%t;>> parsed (%1;): {%2;}",i,a1) ;
					// return a1

					return a1 ;

				},
				parseClipValue: function parseClipValue(clip)
				{
				
					// set variables
					
					var a1 = [ ], a2, a3 ;
					var n ;
					var i ;
					
					// set a1
Meta.log("> parseClipValue (``%1;'')",clip) ;
						this.MATCHER_CLIP.lastIndex = 0 ;
						
						if(  !!  ( a2 = this.MATCHER_CLIP.exec(clip) )  ) {
								
								a1[0] = a2[1] ;
								
								a3 = a2[2]
								.split(Meta.CHARACTER_SPACE) ;
								
								n = a1[1] = Meta.parseNumber( a3[0] ) / 100 ;

								if( (i = a3.length) === 1 ) { a1[2] = a1[3] = a1[4] = n ; }
								else if(i === 2) {
								
										a1[2] = a1[4] = Meta.parseNumber( a3[1] ) / 100 ;
										a1[3] = n ;

								}
								else if(i === 4) {
										a1[2] = Meta.parseNumber( a3[1] ) / 100 ;
										a1[3] = Meta.parseNumber( a3[2] ) / 100 ;
										a1[4] = Meta.parseNumber( a3[3] ) / 100 ;
								}
								
						}								
						else { Meta.logWarning("Invalid clip value (clip-value=``" + clip + "'')",this.reflect.identifier,"parseClipValue") ; }

Meta.log("%t;>> split(length=%1;): {%2;}",i,a3) ;
					// return a1

					return a1 ;

				},
				parseGradientValue: function parseGradientValue(gradient)
				{
				
					// set variables
					
					 var a = [] ;
					 
					 // set a
Meta.log("> parseGradientValue(``%1;'')",gradient) ;
						this.MATCHER_GRADIENT.lastIndex = 0 ;
						
						if(  !!  ( a = this.MATCHER_GRADIENT.exec(gradient) )  ) { a = a.slice(1) ; }
						else { Meta.logWarning("Invalid gradient value (gradient-value=``" + gradient + "'')",this.reflect.identifier,"parseGradientValue") ; }
Meta.log("%t;>> parsed: %1;",a) ;
					 // return a
					 
					 return a ;

				},
				parseBackgroundValue: function parseBackgroundValue(background)
				{
				
					// set variables
					
					var a1 = null, a2 ;
					
					// set a
					
						this.MATCHER_BACKGROUND.lastIndex = 0 ;
						
						if(  !!  ( a2 = this.MATCHER_BACKGROUND.exec(background) )  ) { a1 = [ a2[1], a2[3], a2[4] ] ; }
						else { Meta.logWarning("Invalid background value (background-value=``" + background + "'')",this.reflect.identifier,"parseBackgroundValue") ; }
						
					// return a1
					
					return a1 ;

				}
		},
		local: {
				globalHeight: null,
				layout: function(node)
				{
				
					// set variables
					
					var o = { } ;
					var s ;

					// set sheet
Meta.log(" ")
.log("> layout (``%1;'')",org.meta.web.dom.DOM.getProperty("node_id",node)) ;
						this.evaluateLayout(o,node) ;

						if( ! Meta.isEmpty(o) ) {

								s = org.meta.web.dom.DOM.getName(node)
								+ "[class~=\""
								+ org.meta.web.dom.DOM.getProperty("node_id",node)
								+ "\"] {"
								+ org.meta.ui.CSS.writeRuleSet(o)
								+ "}" ;

								this.sheet.replaceRule(s) ;
Meta.log("%t;>> rule-set: %1;",s) ;
								org.meta.web.dom.Document.select(node)
								.addClass( org.meta.web.dom.DOM.getProperty("node_id",node) ) ;

						}

						org.meta.web.dom.Document.select(node) ;

						if(  !!  ( s = org.meta.web.dom.DOM.getProperty(this.PROPERTY_LAYOUT,node) )  ) {
								org.meta.web.dom.Document.addClass(s) ;
						}

						org.meta.web.dom.Document.children( ) ;
						
						if(  !!  ( a = org.meta.web.dom.Document.getSelection( ) )  ) {

								Meta.each(
										a,
										function(index,node) { this.layout(node) ; },
										this
								) ;

						}					

				},
				evaluateLayout: function evaluateLayout(set,node)
				{

					// set variables
					
					var o1, o2 ;
					var s1, s2 ;
					
					// set style
						
						org.meta.web.dom.Document.select(node)
						.parent( ) ;
						
						o1 = {
								"local-height": org.meta.web.dom.Document.getHeight( ),
								"local-width": org.meta.web.dom.Document.getWidth( )
						} ;
					
						// offset (offset-height/offset-width,margin,border,shadow,border) 
					
						this.evaluateOffset(o1,set,node) ;

						if(  !!  ( o2 = org.meta.web.dom.DOM.getProperty(this.PROPERTY_STYLE,node) )  ) {
								this.evaluateStyle(o2,o1,set,node) ;
						}

					// return true
					
					return true ;

				},
				evaluateOffset: function evaluateOffset(context,set,node)
				{

					// set variables
					
					var s ;
					var a ;
					var n ;
					
					// set context

						// offset-height, offset-width, height, width
Meta.log("> evaluateOffset") ;
						if(  !!  ( s = org.meta.web.dom.DOM.getProperty(this.PROPERTY_HEIGHT,node) )  ) {

								a = org.meta.ui.CSS.parseLengthValue(s) ;

								n = Meta.parseNumber( a[2] )
								/ 100
								* context["local-height"] ;

						}
						else { n = context["local-height"] ; }

						context["offset-height"] = context.height = n ;

						if(  !!  ( s = org.meta.web.dom.DOM.getProperty(this.PROPERTY_WIDTH,node) )  ) {

								a = org.meta.ui.CSS.parseLengthValue(s) ;
										
								n = Meta.parseNumber( a[2] )
								/ 100
								* context["local-width"] ;

						}
						else { n = context["local-width"] ; }

						context["offset-width"] = context.width = n ;
						
						// shape, align
						
						if(  !!  ( s = org.meta.web.dom.DOM.getProperty(this.PROPERTY_SHAPE,node) )  ) {
								this.evaluateShape(s,context,set) ;
						}

						if(  !!  ( s = org.meta.web.dom.DOM.getProperty(this.PROPERTY_ALIGN,node) )  ) {
								this.evaluateAlign(s,context,set) ;
						}
						
						// margin, shadow, border, padding
						
						if(  !!  ( s = org.meta.web.dom.DOM.getProperty(this.PROPERTY_MARGIN,node) )  ) {
								this.evaluateMargin(s,context,set) ;
						}

						if(  !!  ( s = org.meta.web.dom.DOM.getProperty(this.PROPERTY_SHADOW,node) )  ) {
								this.evaluateShadow(s,context,set) ;
						}
						
						if(  !!  ( s = org.meta.web.dom.DOM.getProperty(this.PROPERTY_BORDER,node) )  ) {
								this.evaluateBorder(s,context,set) ;
						}
						
						if(  !!  ( s = org.meta.web.dom.DOM.getProperty(this.PROPERTY_PADDING,node) )  ) {
								this.evaluatePadding(s,context,set) ;
						}

						// height, width

						if( (n = context.height) !== context["local-height"] ) { // set.height = "100%" ; }
						/*else {*/set.height = n + "px" ; }

						if( (n = context.width) !== context["local-width"] ) { // set.width = "100%" ; }
						/*else {*/set.width = n + "px" ; }

					// return true

					return true ;
				
				},
				evaluateShape: function evaluateShape(shape,context,set)
				{
					
					// set variables
					
					var o ;

					// set true
Meta.log("> evaluateShape (``%1;'')",shape) ;
						switch(shape) {
								case this.SHAPE_SQUARE: { this.evaluateSquareShape(context,set) ; break ; }
								case this.SHAPE_OBLONG: { this.evaluateOblongShape(context,set) ; break ; }
								//..
								default: { Meta.logWarning("Undefined shape parameter (shape=\"" + shape + "\").") ; }
						}
						
					// return true
					
					return true ;

				},
				evaluateSquareShape: function evaluateSquareShape(context,set)
				{

					// set variables

					var n1, n2 ;

					// set true

						if(  ( n1 = context["offset-height"] )  >=  ( n2 = context["offset-width"] )  ) { context["offset-height"] = context.height = n2 ; }
						else { context["offset-width"] = context.width = n1 ; }
Meta.log("> evaluateSquareShape: %1; x %2;",context["offset-height"],context["offset-width"]) ;
					// return true
					
					return true ;

				},
				evaluateOblongShape: function evaluateOblongShape(context,set)
				{

					// set variables

					var n1, n2 ;

					// set true

						if(  ( n1 = context["offset-height"] )  >=  ( n2 = context["offset-width"] )  ) {
						
								context["offset-height"] = context.height = n2 ;
								set.width = "100%" ;

						}
						else {

								context["offset-width"] = context.width = n1 ;
								set.height = "100%" ;

						}
						
					// return true
					
					return true ;

				},
				evaluateAlign: function evaluateAlign(align,context,set)
				{

					// set style

						switch(align) {
								case this.ALIGN_LEFT: { set.left = 0 ; break ; }
								case this.ALIGN_RIGHT: { set.right = 0 ; break ; }
								case this.ALIGN_TOP: { set.top = 0 ; break ; }
								case this.ALIGN_BOTTOM: { set.bottom = 0 ; break ; }
								case this.ALIGN_CENTER: { set.margin = "auto" ; }
								default: { break ; }
						}
					
					// return true
					
					return true ;

				},
				/**
				@link https://developer.mozilla.org/en-US/docs/CSS/margin
				@link http://dev.w3.org/csswg/css3-box/#the-margin-properties
				*/
				evaluateMargin: function evaluateMargin(margin,context,set)
				{

					// set variables

					var s = "" ;
					var a1, a2 ;
					var i1 = -1, i2 = 4, i3, i4 ;
					var o ;
					var n ;
					
					// set context, set
					
						a1 = this.parseLengthValue(margin) ;
						
						for( i3 = a1.length ; ++i1 < i2 ; ) {
							
								i4 = Math.ceil( (i1 % 2) ) ;

								a2 = ( i3 === 4 ? a1[i1] : i3 === 2 ? a1[i4] : a1[0] ) ;

								n = Meta.parseNumber( a2[2] ) / 100 ;

								if( (i3 % 2) === 0 ) { n = ( i3 === 0 ? context["offset-height"] * n : context["offset-width"] * n ) ; }
								else { n = context["offset-height"] * n ; }
								
								if(i4 === 0) { context.height -= n ; }
								else { context.width -= n ; }
								
								s += ( i1 > 0 ? " " + n + "px" : n + "px" ) ;

						} 

						set.margin = s ;

					// return true
					
					return true

				},
				evaluateShadow: function evaluateShadow(shadow,context,set)
				{
				
					// set variables
					
					var a ;
					var i1 = -1, i2 ;
					
					// set context, set
					
						a = this.parseShadowValue(shadow) ;
Meta.log("> evaluateShadow (``%1;'')",shadow)
.log("%t;>> parsed: {%1;}",a) ;
						if(  !!  ( n = a[0] )  ) {
						
								a[0] = context["offset-height"] * n ;
								context.height -= a[4] * context["offset-height"] ;
								
						}
						if(  !!  ( n = a[1] )  ) {
						
								a[1] = context["offset-width"] * n ;
								context.width -= a[4] * context["offset-width"] ;
								
						}
						if(  !!  ( n = a[2] )  ) {
						
								a[2] = context["offset-height"] * n ;
								context.height -= a[4] * context["offset-height"] ;
								
						}
						if(  !!  ( n = a[3] )  ) {
						
								a[3] = context["offset-width"] * n ;
								context.width -= a[4] * context["offset-width"] ;

						}
						if(  !!  ( n = a[4] )  ) { a[4] = context["offset-height"] * n ; }
/*
						context.height -= 2 * a[4] ;
						context.width -= 2 * a[4] ;
*/
						o = org.meta.ui.CSS.CONVERTER_BOX_SHADOW.apply(Meta.DEFAULT_VIEW,a) ;
						
						org.meta.ui.CSS.mergeRuleSet(set,o) ;
					
					// return true
					
					return true ;
					
				},
				evaluateBorder: function evaluateBorder(border,context,set)
				{
				
					// set variables
					
					var a1, a2, a3 = [ ] ;
					var i1 = -1, i2 = 4, i3, i4 ;
					var s1 = "", s2 = "", s3 = "" ;
					
					// set context, set
					
						a1 = this.parseBorderValue(border) ;
						i3 = a1.length ;

						for( ; ++i1 < i2 ; ) {
						
								i4 = Math.ceil( (i1 % 2) ) ;
						
								a2 = ( i3 === 4 ? a1[i1] : ( i3 === 2 ? a1[i4] : a1[0] ) ) ;

								n = Meta.parseNumber( a2[1] ) / 100 ;

								if( (i3 % 2) === 0 ) { n = ( i3 === 0 ? context["offset-height"] * n : context["offset-width"] * n ) ; }
								else { n = context["offset-height"] * n ; }

								a2[1] = n ;

								if(i4 === 0) { context.height -= n ; }
								else { context.width -= n ; }
								
								a3.push(a2) ;
						
						}
						
						for( i1 = -1, i2 = 4 ; ++i1 < i2 ; ) {
						
								a2 = a3[i1] ;

								s1 += (i1 > 0 ? " " : "") + a2[1] + "px" ;
								s2 += (i1 > 0 ? " " : "") + ( a2[2] || "transparent" ) ;
								s3 += (i1 > 0 ? " " : "") + ( a2[3] || "solid" ) ;
								
						}
						
						set["border-width"] = s1 ;
						set["border-color"] = s2 ;
						set["border-style"] = s3 ;
					
					// return true
					
					return true ;
					
				},
				evaluatePadding: function evaluatePadding(padding,context,set)
				{

					// set variables

					var s = "" ;
					var a1, a2 ;
					var i1 = -1, i2 = 4, i3, i4 ;
					var o ;
					var n ;
					
					// set context, style
					
						a1 = this.parseLengthValue(padding) ;
						
						for( i3 = a1.length ; ++i1 < i2 ; ) {
							
								i4 = Math.ceil( (i1 % 2) ) ;

								a2 = ( i3 === 4 ? a1[i1] : i3 === 2 ? a1[i4] : a1[0] ) ;

								n = Meta.parseNumber( a2[2] ) / 100 ;
								
								if( (i3 % 2) === 0 ) { n = (i3 === 0 ? context["offset-height"] * n : context["offset-width"] * n ) ; }
								else { n = context["offset-height"] * n ; }
								
								if(i4 === 0) { context.height -= n ; }
								else { context.width -= n ; }
								
								s += ( i1 > 0 ? " " + n + "px" : n + "px" ) ;

						} 

						set.padding = s ;

					// return true
					
					return true

				},
				/**
				Evaluate the complementary style data for the given `Node`. 
				@ToDo The ``font-size'' and ``line-height'' property evaluations need to address the ``write-direction'' property.
				*/
				evaluateStyle: function evaluateStyle(style,context,set,node)
				{
				
					// set variables
					
					var s ;
					var a ;
					var n1, n2 ;
					
					// set

						// font
						
						org.meta.web.dom.Document.select(node) ;
						
						if( org.meta.web.dom.Document.hasText( ) && ! org.meta.web.dom.DOM.isContainer(node) ) {
								this.evaluateFontSize(context,set) ;
						}
						
						// rest

						Meta.merge(
								set,
								style,
								Meta.bind(  function(key,set,style) {
								
									var o ;
									
										o = style[key] ;
								
										switch(key) {
												case "clip": { this.evaluateClip(o,context,set) ; break ; }
												case "opacity": { this.evaluateOpacity(o,context,set) ; break ;  }
												case "gradient": { this.evaluateGradient(o,context,set) ; break ;  }
												case "background": { this.evaluateBackground(o,context,set) ; break ; }
												case "text-shadow": { this.evaluateTextShadow(o,context,set) ; break ; }
												default: { set[key] = style[key] ; break ; }
										}

								},
								this  )
						) ;
						
					// return true
					
					return true ;

				},
				evaluateFontSize: function evaluateFontSize(context,set)
				{
				
					// set variables
					
					var s ;
					var n1, n2 ;
					
					// set set, context
						
						s = org.meta.web.dom.Document.select(Meta.DEFAULT_DOCUMENT.body)
						.getStyle("font-size") ;

						n1 = Meta.parseNumber(s) ;

						if(  !!  ( s = set["font-size"] )  ) { n2 = Meta.parseNumber(s) / 100 ; }
						else { n2 = 1 ; }
						
						context["font-size"] = n2 * context.height ;
						set["font-size"] = ( (n2 * context.height) / n1 ) + "em" ;

						if(  !!  ( s = set["line-height"] )  ) { n2 = Meta.parseNumber(s) / 100 ; }
						else { n2 = 1 ; }

						set["line-height"] = n2 + "em" ;
								
					// return true
					
					return true ;

				},
				evaluateClip: function evaluateClip(clip,context,set)
				{
				
					// set variables
					
					var a ;
					var o ;
					
					// set context, set
					
						a = this.parseClipValue(clip) ;
Meta.log("> evaluateClip (``%1;'')",clip)
.log("%t;>> parsed: {%1;}",a) ;
						a[1] = a[1] * context.height ;
						a[2] = context.width * ( 1 - a[2] ) ;
						a[3] = context.height * ( 1 - a[3] ) ;
						a[4] = a[4] * context.width ;
						
						o = org.meta.ui.CSS.CONVERTER_CLIP.apply(Meta.DEFAULT_VIEW,a) ;
						
						org.meta.ui.CSS.mergeRuleSet(set,o) ;
					
					// return true
					
					return true ;

				},
				evaluateOpacity: function evaluateOpacity(opacity,context,set)
				{
				
					// set variables
					
					var n ;
					
					// set set
					
						n = Meta.parseNumber(opacity) ;
						o = org.meta.ui.CSS.CONVERTER_OPACITY(n) ;
						
						org.meta.ui.CSS.mergeRuleSet(set,o) ;
						
					// return true
					
					return true ;

				},
				evaluateGradient: function evaluateGradient(gradient,context,set)
				{
				
					// set variables
					
					var a ;
					
					// set set
					
						a = this.parseGradientValue(gradient) ;
Meta.log("> evaluateGradient")
.log("%t;>> parsed: {%1;}",a) ;
						o = org.meta.ui.CSS.CONVERTER_GRADIENT.apply(Meta.DEFAULT_VIEW,a) ;
						
						org.meta.ui.CSS.mergeRuleSet(set,o) ;
					
					// return true
					
					return true ;

				},
				evaluateBackground: function evaluateBackground(background,context,set)
				{
				
					// set variables
					
					var a ;
					var o ;
					
					// set context,set
					
						a = this.parseBackgroundValue(background) ;
						o = org.meta.ui.CSS.CONVERTER_BACKGROUND.apply(Meta.DEFAULT_VIEW,a) ;
					
						org.meta.ui.CSS.mergeRuleSet(set,o) ;
					
					// return true
					
					return true ;

				},
				evaluateTextShadow: function evaluateTextShadow(value,context,set)
				{
				
					// set variables
					
					var a ;
					var n1, n2, n3 ;
					var s ;
					var o ;
					
					// set set
/*
						a = this.parseShadowValue(value) ;
						
						n1 = ( Meta.parseNumber( a[1] ) / 100 ) * context["font-size"] ;
						n2 = ( Meta.parseNumber( a[2] ) / 100 ) * context["font-size"] ;
						n3 = ( Meta.parseNumber( a[3] ) / 100 ) * context["font-size"] ;
						s = a[4] ;

						o = org.meta.ui.CSS.CONVERTER_TEXT_SHADOW(n1,n2,n3,s) ;

						org.meta.ui.CSS.mergeRuleSet(set,o) ;
*/
					// return true
					
					return true ;

				}
		}
}  ) ;