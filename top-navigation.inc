			<%-- Top navigation --%>
			<ja:if test="<%= showTopNavigation && !isEmpty(topNavigation) %>"><div id="navigation">
				<ja:if test="${logo}" not value=""><div class="logo">
				<a href="${rootPath}/index.html" title="$text.backToHome"><img src="${resPath}/${logo}" alt="${albumName}"></a>
				</div></ja:if>
				<%-- Main menu --%>
				<nav>${topNavigation}</nav>
			</div></ja:if>

