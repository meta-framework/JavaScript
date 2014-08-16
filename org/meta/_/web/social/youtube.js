Pulse.declare("pulse.web.social")
.define(  {
		/**
		* Object wrapper for the YouTube SDK and additional utility methods.
		*/
		/*@toDo("Fill.")*/
		name: "Youtube",
		package: "pulse.web.social",
		type: Pulse.STRING_OBJECT_TYPE_SINGLETON,
		prototype: "pulse.logic.Eventable",
		global: {
				YT_SDK_URL: "..."
		},
		local: {
				main: function main( ) {
						//
				}
		}
}  )
.define(  {
		/** 
		* YouTube implementation for the `pulse.media.Player` abstract `Object`. 
		* @link https://developers.google.com/youtube/js_api_reference#Events
		*/
		name: "YoutubePlayer",
		package: "pulse.web.social",
		type: Pulse.STRING_OBJECT_TYPE_CONSTRUCTABLE,
		prototype: "pulse.media.Player",
		global: {
				YT_PLAYER_STATE_UNSTARTED: -1,
				YT_PLAYER_STATE_ENDED: 0,
				YT_PLAYER_STATE_PLAYING: 1,
				YT_PLAYER_STATE_PAUSED: 2,
				YT_PLAYER_STATE_BUFFERING: 3,
				YT_PLAYER_STATE_CUED: 5,
				YT_PLAYER_ERROR_INVALID_PARAMETER: 2,
				YT_PLAYER_ERROR_NOT_FOUND: 100,
				YT_PLAYER_ERROR_RESTRICTED: 101,
				YT_PLAYER_ERROR_NOT_FOUND_EITHER: 150,
				YT_PLAYER_TYPE_CHROMELESS: "chromeless",
				YT_PLAYER_TYPE_EMBEDDED: "embedded",
				YT_URL_CHROMELESS_PLAYER: "http://youtube.googleapis.com/apiplayer",
				YT_URL_EMBEDDED_PLAYER: "http://www.youtube.com/embed"
		},
		public: {
				/**
				* Jump to the given time index in miliseconds. This overrides `pulse.media.Player.jump` in order to account for the 
				* addition `Boolean` parameter the YouTube player expects.
				* @param time (Integer) Time index to jump to.
				* @return this
				*/
				jump: function jump(time)
				{

					// set variables
					
					var i ;
					var o ;
					var s ;

					// set this
Pulse.log("--- Player#jump (%1)",time)
.log("\t> player-state: %1",this.getPlayerState());
						if(  
								( i = this.getPlayerState( ) )  ===  pulse.media.Player.PLAYER_STATE_PLAYING  ||
								i === pulse.media.Player.PLAYER_STATE_PAUSED || i === pulse.media.Player.PLAYER_STATE_STOPPED ||
								i === pulse.media.Player.PLAYER_STATE_LOADED
						)
						{
Pulse.log("\t> will-jump") ;
								o = this.properties.player.object ;
								s = this.properties.player.methods.jump ;
							
								o[s].apply( o, [time,true] ) ;

						}
						
					// return this
					
					return this ;
					
				}
		},
		local: {
				box: null,
				controls: null,
				schedule: null,
				main: function main(root,parameter)
				{

					// set variables
					
					var s ;

					// set this
					
					this.root = root ;
					this.parameter = parameter ;
					
					this.handlers = { } ;
					this.properties = {
							state: pulse.media.Player.PLAYER_STATE_IDLE, 
							player: { 
									object: null,
									methods: { 
											"load": "loadVideoById",
											"play": "playVideo",
											"pause": "pauseVideo",
											"volume": "setVolume",
											"jump": "seekTo",
											"duration": "getDuration",
											"time": "getCurrentTime"
									}
							}
					} ;
					
					this.components = { } ;
		
					this.setPlayerContainer(  {
							root: parameter.player_container,
							type: parameter.player_type,
							id: parameter.player_id
					}  )
					.setMenuControl(  { root: parameter.menu_control }  )
					.setVolumeControl(  {
							root: parameter.volume_control,
							meter: parameter.volume_control_meter,
							display: parameter.volume_control_meter_display,
							toggle: parameter.volume_control_toggle
					}  )
					.setProgressControl(  {
							root: parameter.progress_control,
							handle: parameter.progress_control_handle,
							bar: parameter.progress_control_bar,
							lock_vertical: true
					}  )
					.setSchedule( ) ;
					
					//<> pause and resume on play and stop/pause
/*
					this.schedule = pulse.logic.Schedule(1000)
					.add(  { target: this, action: function( ) { this.update( ) ; } }  ) ;
*/					
					this.pushState(pulse.ui.Module.STATE_IDLE,this.components) ;
					
					// return this

					return this ;
				
				},
				setPlayerContainer: function setPlayerContainer(parameter)
				{
				
					// set variables
					
					var n ;
					
					// set ?
					
						n = pulse.dom.Document.select(this.root)
						.find(parameter.root)
						.getCurrent( ) ;

						this.components.box = pulse.ui.Box(n) ;
						
						if( (s = parameter.type) === pulse.web.social.YoutubePlayer.YT_PLAYER_TYPE_CHROMELESS ) { this.setChromelessPlayer( ) ; }
						else if(s === pulse.web.social.YoutubePlayer.YT_PLAYER_TYPE_EMBEDDED) { this.setEmbeddedPlayer( ) ; }
						else { Pulse.error("Missing required parameter property.\n\t> name: ``player_type''") ; }
					
						
					// return this
					
					return this ;

				},
				setChromelessPlayer: function setChromelessPlayer( )
				{

					// set variables
					
					var o ;
					var n ;

					// set container
					
						this.setEventListeners( ) ;

						/* Create a dummy player Node. */
						
						if( !! (s = this.parameter.player_id) && s.search(/[.\-+*/]/) !== -1 ) {
								Pulse.error("Player id contains invalid character(s) (`.-+*/`).") ;
						}
						else if( !!! s) { Pulse.error("Missing required parameter.\n\t> name: ``player_id''") ; }

						n = pulse.dom.Document.select( pulse.dom.DOM.createElement("div") )
						.attribute("id",this.parameter.player_id)
						.getCurrent( ) ;

						pulse.dom.Document.select(this.root)
						.find(this.parameter.player_container)
						.click(  { target: this, action: "toggle" }  )
//						.doubleClick(  {target: pulse.ui.UI, action: "toggleFullScreen", parameter: pulse.dom.Document.getCurrent( ) }  )
						.append(n) ;
						
						swfobject.embedSWF(
								pulse.web.social.YoutubePlayer.YT_URL_CHROMELESS_PLAYER,
								this.parameter.player_id,
								"100%", 
								"100%", 
								"10.0.0",
								false,
								{ enablejsapi: 1, version: 3, object_id: this.parameter.player_id },
								{ wmode: "transparent", allowfullscreen: "true", allowscriptaccess: "always" },
								{ height: "100%", width: "100%", id: this.parameter.player_id },
								Pulse.bind( function(event) { 

										if(!!! event.success) { throw Error("Player setup failed.") ; }
										else { this.properties.player.object = event.ref ; }
										
								}, this )
						) ;

				},
				setEmbeddedPlayer: function setEmbeddedPlayer( )
				{
					throw Error("Currently not supported.") ;
					
					/*
							pulse.dom.Document.createElement("div")
							.setStyle(  { height: "100%", width: "100%" }  )
							.appendTo(this.properties.nodes.container)
							.html("<iframe width=\"100%\" height=\"100%\" src=\"http://www.youtube.com/embed?listType=user_uploads&list=maxmonumentmusic\" frameborder=\"0\" allowfullscreen></iframe>") ;
							
					*/

				},
				setEventListeners: function setEventListeners( )
				{

					// set ?
					
						/*@note("Create the global callback Functions as required by the YouTube player `Object`.")*/
						
						Pulse.DEFAULT_VIEW.onYouTubePlayerReady = Pulse.bind( function( ) {

							var o ;
							var s ;

								o = this.properties.player.object ;

								if(!! Pulse.DEBUG_MODE) { Pulse.log("(!) DEBUG: pulse.web.social.YoutubePlayer: ready") ; }
								
								Pulse.DEFAULT_VIEW.onYouTubePlayerStateChange = Pulse.bind(
										function(state) {
												
											var i = -1 ;

												/*@note("Translate YouTube player state `Integer`s into `pulse.media.Player` state `Integer`s").*/
											
												if(state === pulse.web.social.YoutubePlayer.YT_PLAYER_STATE_UNSTARTED) { i = pulse.media.Player.PLAYER_STATE_IDLE ; }
												else if(state === pulse.web.social.YoutubePlayer.YT_PLAYER_STATE_ENDED) { i = pulse.media.Player.PLAYER_STATE_STOPPED ; }
												else if(state === pulse.web.social.YoutubePlayer.YT_PLAYER_STATE_PLAYING) { i = pulse.media.Player.PLAYER_STATE_PLAYING ; }
												else if(state === pulse.web.social.YoutubePlayer.YT_PLAYER_STATE_PAUSED) { i = pulse.media.Player.PLAYER_STATE_PAUSED ; }
												else if(state === pulse.web.social.YoutubePlayer.YT_PLAYER_STATE_BUFFERING) { i = pulse.media.Player.PLAYER_STATE_LOADING ; }
												else if(state === pulse.web.social.YoutubePlayer.YT_PLAYER_STATE_CUED) { i = pulse.media.Player.PLAYER_STATE_LOADED ; }												
												
												/*@note("Pass the state `Integer` to `onStateChange` in order to raise a state change event.")*/

												this.setPlayerState(i) ;
												
										},
										this
								) ;
								
								Pulse.DEFAULT_VIEW.onYouTubePlayerError = Pulse.bind(
										function(error) {
										
											var i = -1 ;

												if(error === pulse.web.social.YoutubePlayer.YT_PLAYER_ERROR_INVALID_PARAMETER) {
														i = pulse.web.av.Player.PLAYER_ERROR_INVALID_REQUEST ;
												}
												else if(error === pulse.web.social.YoutubePlayer.YT_PLAYER_ERROR_NOT_FOUND || pulse.web.social.YoutubePlayer.YT_PLAYER_ERROR_NOT_FOUND_EITHER) {
														i = pulse.web.av.Player.PLAYER_ERROR_NOT_FOUND ;
												}
												else if(error === pulse.web.social.YT_PLAYER_ERROR_RESTRICTED) {
														i = pulse.web.av.Player.PLAYER_ERROR_RESTRICTED ;
												}
												
												this.onPlayerError(  { error: i }  ) ;

										},
										this
								) ;
/*@note("Awaiting implementation.")
								Pulse.DEFAULT_VIEW.onYouTubePlayerPlaybackQualityChange = function( ) {
										Pulse.log("@playback change") ;
								} ;								
								
								Pulse.DEFAULT_VIEW.onYouTubePlayerApiChange = function( ) {
										Pulse.log("@api change") ;
								} ;
*/
								o.addEventListener("onStateChange","onYouTubePlayerStateChange") ;
								o.addEventListener("onError","onYouTubePlayerError") ;
/*@note("Awaiting implementation.")
								o.addEventListener("onPlaybackQualityChange","onYouTubePlayerPlaybackQualityChange") ;
								o.addEventListener("onApiChange","onYouTubePlayerApiChange") ;
*/
								if( !! (s = this.parameter.auto_play) ) { this.load(s) ; }

						}, this ) ;
						
					// return this
					
					return this ;

				}
		}
}  ) ;