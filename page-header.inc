<!doctype html>
<!--[if IE 7]><html lang="${lang}" class="no-js ie7 oldie"><![endif]-->
<!--[if IE 8]><html lang="${lang}" class="no-js ie8 oldie"><![endif]-->
<!--[if IE 9]><html lang="${lang}" class="no-js ie9"><![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html lang="${lang}" class="no-js"> <!--<![endif]-->
<%
	// Initializing variables for the current album page
	initPage();
%>
<head>
	<meta charset="${textEncoding}">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title>${title}</title>
	<ja:if exists="descript"><meta name="description" content="${descript}"></ja:if>
	<ja:if exists="writer"><meta name="author" content="<%= cleanup(writer) %>"></ja:if>
	<ja:if test="${excludeCredits}" not value="true"><meta name="generator" content="Created with jAlbum &amp; ${skin} - <%= (license != void && license.length() > 0)? license : "unregistered" %>"></ja:if>
	<ja:if exists="keywords"><meta name="keywords" content="${keywords}"></ja:if> 
	<ja:if test="${anyShares}">
	<meta property="og:title" content="<%= cleanup(title) %>" />
	<ja:if exists="descript"><meta property="og:description" content="${descript}" /></ja:if>
	<ja:if exists="folderThumbPath"><meta property="og:image" content="${folderThumbPath}" >
	<link rel="image_src" href="${folderThumbPath}"></ja:if>
	</ja:if>
	<meta name="viewport" content="user-scalable=yes, width=${containerWidth}">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-mobile-web-app-status-bar-style" content="black">
	<meta name="format-detection" content="telephone=no">
	<meta name="robots" content="index,follow">
	<link rel="apple-touch-icon" href="${resPath}/apple-touch-icon.png">
	<link rel="shortcut icon" href="${resPath}/favicon.ico">
	<link rel="stylesheet" href="${resPath}/common.css?v=${skinVersion}">
	<link rel="stylesheet" href="${stylePath}">
	<script src="${resPath}/modernizr-2.0.6.min.js"></script>
	<ja:if test="${useSearch}"><script src="${resPath}/search.js?v=<%=Math.round(Math.random()*1000)%>"></script></ja:if>
</head>
<body id="${pageType}">
	<div id="mainbg">&nbsp;</div><ja:if test="<%= engine.isWidgetInjection() %>"><div id="widgetbg">&nbsp;</div></ja:if>
	<div id="main" role="main"<ja:if test="${skipIndex}"> class="hidden"</ja:if>><div class="container">
		<script><ja:if test="<%= !slideshowAuto || folderCount > 0 %>">if (window.location.hash && window.location.hash.length) </ja:if>document.getElementById('main').style['display']='none';</script>
		
		<%-- Page header --%>
		<header<ja:if test="${hasFolderImage}"> style="background-image:url(${folderImageFileName});"</ja:if><ja:else> class="empty"</ja:else>>
			
			<ja:if not test="${splashVertical}"><ja:include page="top-navigation.inc" /></ja:if>
			
			<%-- Page title area --%>
			<div class="title clearfix">
				<ja:if exists="uplink"><div class="upbtn"><%--
					--%><div class="parent controls"><a href="${uplink}" title="<ja:if test="${level}" not value="0"><div class=&quot;breadcrumb&quot;><%= stripQuot(breadcrumbPath) %></div></ja:if><ja:else>$text.backToHome" target="_parent</ja:else>" class="showhint">&nbsp;</a></div><%--
				--%></div></ja:if>
				<ja:if test="<%= useSearch || !isEmpty(pageHeader) || anyShares %>"><aside><%--
					--%><ja:if exists="pageHeader"><div class="about controls"><a href="javascript:void(0)" title="$text.aboutThisAlbum" class="showhint">&nbsp;</a></div></ja:if><%--
					--%><ja:if test="${anyShares}"><div class="share controls"><a href="javascript:void(0)">&nbsp;</a></div></ja:if><%--
					--%><ja:if test="${useSearch}"><div class="search controls"><a href="javascript:void(0)" title="<form class=&#34;searchpage&#34; onsubmit=&#34;Search.start(this);return false;&#34;><input type=&#34;search&#34; class=&#34;searchtext&#34; placeholder=&#34;Search...&#34;><a class=&#34;searchbtn&#34; onclick=&#34;Search.start(this.parentNode);&#34;>&nbsp;</a></form>" class="showhint">&nbsp;</a></div></ja:if><%--
				--%></aside></ja:if>
				<hgroup>
					<h1>${title}</h1>
					<ja:if test="${pageType}" value="index"><ja:if exists="descript"><h6>${descript}</h6></ja:if></ja:if>
				</hgroup>
			</div>
		</header>
		
		<ja:if test="${splashVertical}"><div class="top-nav">
			<ja:include page="top-navigation.inc" />
		</div></ja:if>
		
		<%-- The page content in a scrollable container --%>
		<div class="items">
			<div class="cont">
				<ja:if test="${pageType}" value="page"><article></ja:if>
