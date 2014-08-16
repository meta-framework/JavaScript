/**
Meta UI template library set-up script.
@author friedrich alexander kurz, 2013, f.a.kurz@googlemail.com
available under MIT-licencse
*/
(  function( ) {

// require

Meta.require("org.meta.web.dom.DOM") ;

// import

var DOM = org.meta.web.dom.DOM ;

// define

Meta.define(  {
		name: "Template",
		package: "org.meta.ui.template",
		type: Meta.STRING_OBJECT_TYPE_ABSTRACT,
		prototype: "org.meta.core.Object",
		main: function main(source)
		{
			this.source = source ;
		},
		global: {
				INSTRUCTION_EXPORT: "export",
				INSTRUCTION_DO: "do",
				INSTRUCTION_IF: "if",
				INSTRUCTION_OR: "or",
				INSTRUCTION_ELSE: "else",
				INSTRUCTION_EACH: "each",
				INSTRUCTION_FOR: "for",
				INSTRUCTION_WHILE: "while",
				INSTRUCTION_END: "end"
		}
}  )
.define(  {
		name: "TemplateFactory",
		package: "org.meta.ui.template",
		type: Meta.STRING_OBJECT_TYPE_ABSTRACT,
		prototype: "org.meta.core.Object",
		require: ["org.meta.ui.template.Template"],
		main: function main(source)
		{
			this.source = source ;
			this.matchers = {
					EACH: new org.meta.util.Matcher("([\\w0-9]+)\\s*(of|in)\\s*([\\w0-9]+)") ;
			} ;
		},
		global: {
				newInstance: function newInstance(source, type) { return new this(source) ; }
		},
		local: {
				newTemplate: function newTemplate( ) { Meta.error("Abstract") ; },
				evaluateBlock: function evaluateBlock(first, scope)
				{
					
					// variables
					
					var n = first ;
					
					//
					
						do {
						
								switch(DOM.typeOf(n)) {
								
										case Node.ELEMENT_NODE:
										{
										
											/*Clone the scope object before entering a new block in order to correctly to differentiate scope levels.*/
										
												this.evaluateBlock(n.firstChild, scope.clone( )) ;

											break ;

										}
										case Node.PROCESSING_INSTRUCTION_NODE:
										{
										
												this.evaluateInstruction(n, scope) ;

											break ;

										}

								}
								
						}
						while( !! (n = n.nextSibling) ) ;
						
					// return n
					
					return n ;
				
				},
				_evaluateNode: function _evaluateNode(node, scope)
				{ Meta.error("Deprecation") ;
				
					// variables
					
					var n = node ;
					
					//
						
						switch(DOM.typeOf(n)) {
						
								case Node.ELEMENT_NODE:
								{
								
									/*Clone the scope object before entering a new block in order to correctly to differentiate scope levels.*/
								
										this.evaluateBlock(n.firstChild, scope.clone( )) ;

									break ;

								}
								case Node.PROCESSING_INSTRUCTION_NODE:
								{
								
										n = this.evaluateInstruction(n, scope) ;

									break ;

								}

						}
						
					// return
					
					return n ;

				},
				evaluateInstruction: function evaluateInstruction(instruction, scope)
				{
				
					// variables
					
					var n = instruction, s ;
					
					//
					
						s = DOM.getText(instruction)
						.trim( ) ;
					
						switch(DOM.nameOf(instruction)) {
						
								case org.meta.ui.template.Template.INSTRUCTION_EXPORT:
								{

										/*`export` allows multiple variable identifiers.*/
										
										if(!!! (a = s.split(","))) { a = [s] ; }

										/*Create placeholder entries within the scope object.*/
																				
										Meta.each(a, function(i, v) { scope.set(v.trim( ), true) ; }) ;
										
									break ;
									
								}
								case org.meta.ui.template.Template.INSTRUCTION_DO:
								{
								
										this.evaluateDo(instruction, s, scope) ;
										
									break ;

								}
								case org.meta.ui.template.Template.INSTRUCTION_EACH:
								{
								
										this.evaluateEach(instruction, s, scope) ;
								
									break ;
									
								}
								case org.meta.ui.template.Template.INSTRUCTION_FOR:
								{
										this.evaluateFor(instruction, s, scope) ;
									break ;
								}
								case org.meta.ui.template.Template.INSTRUCTION_IF:
								{
								
										this.evaluateIf(instruction, s, scope) ;
										
										do {
										
												s = DOM.getText(n)
												.trim( ) ;
												
												n = this.evaluateOr(n, s, scope) ;
												
										}
										while(n !== null) ;
										
									break ;

								}
								case org.meta.ui.template.Template.INSTRUCTION_ELSE:
								{
									break ;
								}

						}

				},
				evaluateDo: function evaluateDo(instruction, text, scope)
				{
				
					// variables
					
					var s, f ;
					
					//
					
						s = text + "return [" + scope.keys( ) + "];"
						f = this.evaluateFunction(s, scope) ;
						
						DOM.setProperty(instruction, "FUNCTION", f) ;
				
				},
				/**
				Evaluates a `for` instruction which iterates over the elements an iterable object and exports its keys as variables for the given name.
				*/
				evaluateFor: function evaluateFor(instruction, text, scope)
				{

					// variables
					
					var n = instruction, a, s, i = 1;
					
					//
					
						a = text.split(":") ;
						
						Meta.assert(!! a && a.length === 2, "Invalid for instruction (instruction-text=''%1;''.", text) ;
						
						s = a[1] ;
						
						Meta.assert(scope.has(s), "Iteration target is undefined (variable-identifier=%1;)", s) ;
						
						/*Export a placeholder for the iteration variable.*/
						
						scope.set(a[0], true) ;

						while((n = n.nextSibling) !== null)
						{

								if((s = DOM.nameOf(n)) === org.meta.ui.template.Template.INSTRUCTION_END)
								{
								
										if(DOM.getText(n) === org.meta.ui.template.Template.INSTRUCTION_FOR)
										{
										
												if(--i === 0) {
										
														i = Meta.id( ) ;
								
														DOM.setProperty(instruction, "BLOCK_ID", i) ;
														DOM.setProperty(n, "BLOCK_ID", i) ;

													break ;
													
												}
											
										}

								}
								else if(s === org.meta.ui.template.Template.INSTRUCTION_FOR) { i++ ; }
								
						}
						
					// postconditions
					
						Meta.assert(n !== null, "Unmatched for instruction.") ;

				},
				/**
				Evaluates a `each` instruction which iterates over the elements an iterable object and exports its values as variables for the given name.
				*/
				evaluateEach: function evaluateEach(instruction, text, scope)
				{
				
					// variables
					
					var n = instruction, a, s, i = 1;
					
					//
					
						a = text.split(":") ;
						
						Meta.assert(!! a && a.length === 2, "Invalid each instruction (instruction-text=''%1;''.", text) ;
						
						s = a[1] ;
						
						Meta.assert(scope.has(s), "Iteration target is undefined (variable-identifier=%1;)", s) ;
						
						/*Export a placeholder for the iteration variable.*/
						
						scope.set(a[0], true) ;

						while((n = n.nextSibling) !== null)
						{

								if(DOM.nameOf(n) === org.meta.ui.template.Template.INSTRUCTION_END)
								{
								
										if(DOM.getText(n) === org.meta.ui.template.Template.INSTRUCTION_EACH)
										{
										
												if(--i === 0) {
										
														i = Meta.id( ) ;
								
														DOM.setProperty(instruction, "BLOCK_ID", i) ;
														DOM.setProperty(n, "BLOCK_ID", i) ;

													break ;
													
												}
												
										}

								}
								else if(s === org.meta.ui.template.Template.INSTRUCTION_EACH) { i++ ; }
								
						}
						
					// postconditions
					
						Meta.assert(n !== null, "Unmatched each instruction.") ;
						
				},
				evaluateIf: function evaluateIf(instruction, text, scope)
				{

					// variables
					
					var n1 = instruction, n2 = instruction, s, f, i = 1;
					
					//
					
						s = "return (" + text + ");" ;					
						f = this.evaluateFunction(s, scope) ;
						
						DOM.setProperty(instruction, "FUNCTION", f) ;
						
						while((n2 = n2.nextSibling) !== null)
						{
						
								if(DOM.nameOf(n2) === org.meta.ui.template.Template.INSTRUCTION_END)
								{
								
										if(DOM.getText(n2) === org.meta.ui.template.Template.INSTRUCTION_IF) {
										
												if(--i === 0) {
										
														i = Meta.id( ) ;

														DOM.setProperty(instruction, "BLOCK_ID", i) ;
														DOM.setProperty(n2 , "BLOCK_ID", i) ;
										
														break ;
														
												}
												
										}
										
								}
								else if(s === org.meta.ui.template.Template.INSTRUCTION_OR)
								{
								
										DOM.setProperty(n1, "NEXT", n2) ;
										
										s = "return (" + (DOM.getText(n2) || "true") + ");" ;
										f = this.evaluateFunction(s, scope) ;
										
										n1 = n2 ;

								}
								else if(s === org.meta.ui.template.Template.INSTRUCTION_IF) { i++ ; }

						}
						
					// postconditions
					
						Meta.assert(n2 !== null, "Unmatched if instruction.") ;

				},
				_evaluateOr: function _evaluateOr(instruction, text, scope)
				{ Meta.error("Deprecated") ;

					// variables
					
					var n = instruction, s, f ;
					
					//
					
						/*`or` instructions may be empty (default).*/
					
						s = "return (" + (text || "true") + ");" ;
						f = this.evaluateFunction(s, scope) ;
						
						DOM.setProperty(instruction, "FUNCTION", f) ;
						
						while((n = n.nextSibling) !== null)
						{
								if(DOM.nameOf(n) === org.meta.ui.template.Template.INSTRUCTION_OR) break ;
						}
						
						DOM.setProperty(instruction, "NEXT_BLOCK", n) ;
						
					// return
					
					return n ;

				},
				evaluateFunction: function evaluateFunction(text, scope)
				{
				
					// variables
					
					var f, a ;
					
					//
						
						a = Meta.copy(scope.keys( )) ;
						a[a.length] = text  ;
					
						f = Function.apply(null, a) ;
						
					// return f
					
					return f ;

				}
		}
}  ) ;

}  )( ) ;