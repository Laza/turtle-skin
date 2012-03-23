<%-- Page footer --%>
				<ja:if test="${pageType}" value="page"></article></ja:if>
				<%-- Index page footer --%>
				<% getFooterLinks(); %>
				<ja:if test="<%= pageFooter != void && !isEmpty(pageFooter) || footerLinks != void && !isEmpty(footerLinks) %>">
				<footer><div class="wrap">
					<ja:if exists="pageFooter"><div class="custom-footer">${pageFooter}</div></ja:if>
					<ja:if exists="footerLinks"><div class="footer-links">${footerLinks}</div></ja:if>
				</div></footer>
				</ja:if>
			</div>
		</div>
		<ja:if exists="pageHeader"><div class="header hidden">${pageHeader}</div></ja:if>
	</div></div>
	<div class="hook"><span class="hook-b">&nbsp;</span><span class="hook-c">&nbsp;</span></div>

	<%-- Background audio --%>
	<ja:if exists="backgroundAudio">
	<div id="bgaudio"<%= data("file", stripQuot(backgroundAudio)) + data("folder", useAlbumAudioAsBackground? "" : resPath) %>></div>
	</ja:if>
	
	<%-- extra JavaScript libraries --%>
	<ja:if test="${locationCount}" not value="0"><script src="http://maps.google.com/maps/api/js?sensor=false"></script></ja:if>
	<ja:if test="${googlePlus}"><script src="http://apis.google.com/js/plusone.js">{ <ja:if test="${lang}" not value="en">"lang": "${lang}", </ja:if>"parsetags": "explicit" }</script></ja:if>
	<ja:if test="${tumblrButton}"><script src="http://platform.tumblr.com/v1/share.js"></script></ja:if>
	
	<%-- jQuery library :: Google CDN first --%>
	<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery${min}.js"></script>
	<script>window.jQuery || document.write("<script src='${resPath}/jquery-1.7.1${min}.js'>\x3C/script>")</script>
	
	<%-- Page initialization scripts --%>
	<ja:include page="script-starter.inc" />
	
	<%-- Widget inclusion relocated above the Google Analytics script --%>
	<ja:widget pageType="index" />

	<%-- Google Analytics code --%>
	<ja:if exists="googleSiteID"><script>
		window._gaq = [['_setAccount','${googleSiteID}'],['_trackPageview']];
		Modernizr.load({
			load: ('https:' == location.protocol ? '//ssl' : '//www') + '.google-analytics.com/ga.js'
		});
	</script></ja:if>

	<%-- IE7- Chrome frame --%>
	<!--[if lt IE 7 ]>
		<script src="//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.3/CFInstall.min.js"></script>
		<script>window.attachEvent('onload',function(){CFInstall.check({mode:'overlay'})})</script>
	<![endif]-->
<%
	// Closing the actual page
	closePage();
%>
</body>
</html>
