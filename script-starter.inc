<%-- Script starter --%>
	<script src="${resPath}/skin${min}.js?v=${skinVersion}"></script>
	<script>
		var _jaWidgetBarColor = '${widgetBarColor}';
		
		jQuery.fx.interval = $.support.touch? 20 : 50;
		
		$(document).ready(function() {
			if ($.browser.msie && $.browser.version <= 7) { 
				$('.container').height($('body').height());
			}
			var enableKeys = <%= (enableKeyboard? "function() { return typeof _jaWidgetFocus === 'undefined' || !_jaWidgetFocus; };" : enableKeyboard) %>;
			if (/mobile/i.test(navigator.userAgent) && !location.hash) {
				setTimeout(function () { 
					window.scrollTo(0, 0); 
					window.orientationchange = function() {
						window.scrollTo(0, 0);
					};
				}, 100);
			}
			
			var t = $('#main');
			
			<ja:if exists="pageHeader">t.find('.about > a').click(function() {
				$($('.header').contents().clone()).alertBox({
					width: (t.find('.items').width() - 160)
				});
			});</ja:if>
			
			t.find('.items > .cont').addScroll({
				enableMouseWheel: ${enableMouseWheel}, 
				enableKeyboard: ${enableKeyboard}
			});
						
			<ja:if test="${pageType}" value="index">
			var	i = t.find('.thumbs'), 
				f = t.find('.folders > ul > li');
			if ( t.is(':visible') ) {
				f.equalHeight();
				<ja:if test="${captionPlacement}" value="below">i.find('ul>li').equalHeight();</ja:if>
			}
			if ( i.length ) {
				i.turtleGallery({
					resPath: '${resPath}',
					relPath: '${relPath}',
					header: '#main header',
					level: ${level},
					skipIndex: ${skipIndex},
					uplink: '${uplink}',
					slideshowDelay: ${shDelay},
					slideshowLoop: ${slideshowLoop},
					slideshowAuto: ${slideshowAuto},
					afterLast: '${afterLast}',
					infoOn: ${infoPanelVisible},
					thumbsOn: ${thumbnailsVisible},
					shareOn: ${anyShares},
					showImageNumbers: <ja:if test="${showImageNumbers}" value="false">false</ja:if><ja:else>true</ja:else>,
					preScale: <ja:if test="${transitionType}" value="crossFade">false</ja:if><ja:else>0.95</ja:else>,
					speed: ${transitionSpeed},
					transitions: <ja:if test="${transitionType}" value="none">false</ja:if><ja:else>true</ja:else>,
					fitImage: ${fitImages},
					fitShrinkonly: ${fitShrinkonly},
					slides: 'slides',
					thumbs: 'thumbs',
					loadImg: 'load.gif',
					thumbHeight: ${maxThumbHeight},
					rightClickProtect: ${rightClickProtect},
					markNewDays: ${newDaysCount},
					<ja:if test="${videoCount}" not value="0">
					videoAuto: ${videoAutoPlay},
					videoWidth: ${videoWidth},
					videoHeight: ${videoHeight},
					</ja:if>
					<ja:if test="${locationCount}" not value="0">
					mapType: '${mapType}',
					mapZoom: ${mapZoom},
					mapAll: ${mapAll},
					markerPath: '${resPath}/marker.png',
					</ja:if>
					<ja:if test="${shopCount}" not value="0">
					shopGateway: '${shopGateway}',
					shopId: '${shopId}',
					shopCurrency: '${shopCurrency}',
					shopHandling: '${shopHandling}',
					</ja:if>
					enableKeyboard: ${enableKeyboard},
					enableMouseWheel: ${enableMouseWheel},
					<ja:if test="${anyShares}">
					shares: { ${shareArray} },
					</ja:if>
					licensee: '${license}',
					numberLinks: <%= (numberLinks != void && numberLinks)? "true" : "false" %>
				}, {
					${jsTexts},
					${helpTexts}
				});
			}
			<ja:if test="${newDaysCount}" not value="0">
			if ( f.length ) {
				f.find('aside img').markFoldersNew({
					markNewDays: ${newDaysCount},
					newLabel: '<span class="newlabel"><%= getText("newItem") %></span>'
				});
			}</ja:if>
			</ja:if>
			
			var alignCtr = {
			<ja:if test="${splashVertical}">
				posX: 2, 
				posY: 1, 
				toX: 0, 
				toY: 1
			</ja:if><ja:else> 
				posX: 1, 
				posY: 0, 
				toX: 1,
				toY: 2 
			</ja:else>};
			$('header .showhint, .homelink .showhint').addHint(alignCtr);
			$('footer .showhint').addHint();

			<ja:if test="${anyShares}">
			t.find('.share > a').shareIt({ 
				useHash: false,
				pos: alignCtr,
				${shareArray}
			});</ja:if>

			<ja:if exists="backgroundAudio">
			$('#bgaudio').addPlayer({ 
				swf: 'audioplay.swf',
				resPath: '${resPath}',
				auto: ${backgroundAudioAutoPlay}, 
				loop: ${backgroundAudioLoop},
				width: 60,
				height: 20
			});</ja:if>
			
			<ja:if test="${useSearch}">
			if ( typeof Search !== 'undefined' ) {
				Search.rootPath = '${rootPath}';
			}
			</ja:if>
		});
	</script>
