// ==UserScript==
// @name AnimeBytes delicious user scripts
// @author aldy, potatoe, alpha, Megure
// @version 1.74
// @downloadURL https://aldy.nope.bz/scripts.user.js
// @updateURL https://aldy.nope.bz/scripts.user.js
// @description Variety of userscripts to fully utilise the site and stylesheet.
// @include *animebytes.tv/*
// @match https://*.animebytes.tv/*
// @icon http://animebytes.tv/favicon.ico
// ==/UserScript==


// Super duper important functions
// Do not delete or something might break and stuff!! :(
HTMLCollection.prototype.each = function (f) { for (var i=0, e=null; e=this[i]; i++) f.call(e, e); return this; };
HTMLElement.prototype.clone = function (o) { var n = this.cloneNode(); n.innerHTML = this.innerHTML; if (o!==undefined) for (var e in o) n[e] = o[e]; return n; };
// Thank firefox for this ugly shit. Holy shit firefox get your fucking shit together >:(
function forEach (arr, fun) { return HTMLCollection.prototype.each.call(arr, fun); }
function clone (ele, obj) { return HTMLElement.prototype.clone.call(ele, obj); }

function injectScript (content, id) {
	var script = document.createElement('script');
	if (id) script.setAttribute('id', id);
	script.textContent = content.toString();
	document.body.appendChild(script);
	return script;
}
if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported")>-1)) {
	this.GM_getValue=function (key,def) { return localStorage[key] || def; };
	this.GM_setValue=function (key,value) { return localStorage[key]=value; };
	this.GM_deleteValue=function (key) { return delete localStorage[key]; };
}
function initGM(gm, def, json, overwrite) {
	if (typeof def === "undefined") throw "shit";
	if (typeof overwrite !== "boolean") overwrite = true;
	if (typeof json !== "boolean") json = true;
	var that = GM_getValue(gm);
	if (that != null) {
		var err = null;
		try { that = ((json)?JSON.parse(that):that); }
		catch (e) { if (e.message.match(/Unexpected token .*/)) err = e; }
		if (!err && Object.prototype.toString.call(that) === Object.prototype.toString.call(def)) { return that; }
		else if (overwrite) {
			GM_setValue(gm, ((json)?JSON.stringify(def):def));
			return def;
		} else { if (err) { throw err; } else { return that; } }
	} else {
		GM_setValue(gm, ((json)?JSON.stringify(def):def));
		return def;
	}
}
function createSettingsPage() {
	function addCheckbox(title, description, varName, onValue, offValue) {
		if (typeof onValue !== "string" || typeof offValue !== "string" || onValue === offValue) onValue='true', offValue='false';
		var newLi = document.createElement('li');
		this[varName] = initGM(varName, onValue, false);
		newLi.innerHTML = "<span class='ue_left strong'>"+title+"</span>\n<span class='ue_right'><input type='checkbox' onvalue='"+onValue+"' offvalue='"+offValue+"' name='"+varName+"' id='"+varName+"'"+((this[varName]===onValue)?" checked='checked'":" ")+">\n<label for='"+varName+"'>"+description+"</label></span>";
		newLi.addEventListener('click', function(e){var t=e.target;if(typeof t.checked==="boolean"){if(t.checked){GM_setValue(t.id,t.getAttribute('onvalue'));}else{GM_setValue(t.id,t.getAttribute('offvalue'));}}});
		var poselistNode = document.getElementById('pose_list');
		poselistNode.appendChild(newLi);
		return newLi;
	}
	function relink(){$j(function(){var stuff=$j('#tabs > div');$j('ul.ue_tabs a').click(function(){stuff.hide().filter(this.hash).show();$j('ul.ue_tabs a').removeClass('selected');$j(this).addClass('selected');return false;}).filter(':first,a[href="'+window.location.hash+'"]').slice(-1)[0].click();});}
	var pose = document.createElement('div');
	pose.id = "potatoes_settings";
	pose.innerHTML = '<div class="head colhead_dark strong">User Script Settings</div><ul id="pose_list" class="nobullet ue_list"></ul>';
	var poseanc = document.createElement('li');
	poseanc.innerHTML = '&bull;<a href="#potatoes_settings">User Script Settings</a>';
	var tabsNode = document.getElementById('tabs');
	var linksNode = document.getElementsByClassName('ue_tabs')[0];
	if (document.getElementById('potatoes_settings') == null) { tabsNode.insertBefore(pose, tabsNode.childNodes[tabsNode.childNodes.length-2]); linksNode.appendChild(poseanc); document.body.removeChild(injectScript('('+relink.toString()+')();', 'settings_relink')); }
	addCheckbox("Delicious Hover Smileys", "Enable/Disable delicious smileys that appear on hover.", 'delicioussmileys');
	addCheckbox("Delicious BBCode", "Enable/Disable delicious [hide] button and modify [url] and [quote] buttons.", 'deliciousbbcode');
	addCheckbox("Delicious Better Quote", "Enable/Disable delicious better <span style='color: green; font-family: Courier New;'>&gt;quoting</span>", 'deliciousquote');
	addCheckbox("Delicious HYPER Quote", "Enable/Disable experimental HYPER quoting: select text and press CTRL+V to instant-quote. [EXPERIMENTAL]", 'delicioushyperquote');
	addCheckbox("Delicious Title Flip", "Enable/Disable delicious flipping of Forum title tags.", 'delicioustitleflip');
	addCheckbox("Disgusting Treats", "Hide/Unhide those hideous treats!", 'delicioustreats');
	addCheckbox("Disgusting Poster Info", "Hide/Unhide those despicable poster infos!", 'disgustingposterinfo');
	addCheckbox("Delicious Keyboard Shortcuts", "Enable/Disable delicious keyboard shortcuts for easier access to Bold/Italics/Underline/Spoiler/Hide and aligning.", 'deliciouskeyboard');
	addCheckbox("Delicious Title Notifications", "Display number of notifications in title.", 'delicioustitlenotifications');
	addCheckbox("Delicious Stylesheet Preview", "Allows you to easily preview and select delicious stylesheets.", 'deliciousstylesheetpreview');
}

if (/\/user\.php\?.*action=edit/i.test(document.URL)) createSettingsPage();


// A couple GM variables that need initializing
var gm_delicioussmileys = initGM('delicioussmileys', 'true', false);
var gm_deliciousbbcode = initGM('deliciousbbcode', 'true', false);
var gm_deliciousquote = initGM('deliciousquote', 'true', false);
var gm_delicioushyperquote = initGM('delicioushyperquote', 'true', false);
var gm_delicioustitleflip = initGM('delicioustitleflip', 'true', false);
var gm_delicioustreats = initGM('delicioustreats', 'true', false);
var gm_disgustingposterinfo = initGM('disgustingposterinfo', 'true', false);
var gm_deliciouskeyboard = initGM('deliciouskeyboard', 'true', false);
var gm_delicioustitlenotifications = initGM('delicioustitlenotifications', 'true', false);
var gm_deliciousstylesheetpreview = initGM('deliciousstylesheetpreview', 'true', false);


// Banners and search bar by Megure
// Fixes the placement of the search bars when a banner is in use.
if (document.getElementById('bannerimg') !== null) {
	var parent = document.getElementById('bannerimg').parentNode;
	parent.parentNode.insertBefore(document.getElementById('searchbars'), parent);
}


// Add delicious stylesheets to stylesheet dropdown menu including preview by Megure
// LINKS ARE HARDCODED TO aldy.nope.bz AND /static/styles/, CHANGE IF NECESSARY!
if (GM_getValue('deliciousstylesheetpreview', 'true') === 'true' && /\/user\.php\?.*action=edit/i.test(document.URL)) {
	var source = 'https://aldy.nope.bz/',
	    ABSource = '/static/styles/',
	    deliciousStylesheets = ['Milky Way', 'Toblerone', 'Dream', 'Tentaclebytes', 'Coaltastic'],
	    stylesheet = document.getElementById('stylesheet'),
	    currentLink = document.querySelector('link[rel=stylesheet]'),
	    originalNoSS = stylesheet.children.length,
	    styleurl = document.getElementById('styleurl'),
	    input = document.createElement('input');
	input.type = 'text';
	input.name = stylesheet.name;
	input.value = stylesheet.value;
	input.style.display = 'none';
	stylesheet.parentNode.insertBefore(input, stylesheet);
	stylesheet.removeAttribute('name');
	stylesheet.removeAttribute('onchange');
	// Store the source for all current children into attribute src
	for (var i = 0, len = stylesheet.children.length; i < len; i++) {
		var elem = stylesheet.children[i];
		elem.setAttribute('src', ABSource + elem.textContent.trim().toLowerCase() + '.css');
	}
	// Add delicious stylesheets and store source in src
	for (var i = 0, len = deliciousStylesheets.length; i < len; i++) {
		var sheet = deliciousStylesheets[i],
		    option = document.createElement('option'),
		    src = source + sheet.replace(/\s/g, '').toLowerCase() + '.css';
		option.textContent = 'Delicious ' + sheet;
		option.setAttribute('src', src);
		option.value = stylesheet.children.length + 1;
		stylesheet.appendChild(option);
		if (styleurl.value === src)
			stylesheet.value = option.value;
	}
	// Pre-load the stylesheets on focus of dropdown
	stylesheet.addEventListener('focus', function(event) {
		for (var i = 0, len = stylesheet.children.length; i < len; i++) {
			var elem = stylesheet.children[i],
			    src = elem.getAttribute('src');
			if (currentLink.href !== src) {
				var newLink = document.createElement('link');
				newLink.href = src;
				newLink.media = 'screen';
				newLink.rel = 'alternate stylesheet';
				newLink.title = elem.textContent;
				newLink.type = 'text/css';
				currentLink.parentNode.insertBefore(newLink, currentLink);
				newLink.disabled = true;
			}
		}
	});
	stylesheet.addEventListener('change', function(event) {
		var id = stylesheet.value,
		    src = stylesheet.children[parseInt(id, 10) - 1].getAttribute('src'),
		    activeLink = document.querySelector('link[href="' + src + '"]');
		if (activeLink !== null) {
			var allLinks = document.querySelectorAll('link[title][rel~="stylesheet"]');
			for (var i = 0, len = allLinks.length; i < len; i++)
				allLinks[i].disabled = true;
			activeLink.disabled = false;
		}
		if (src.indexOf(source) !== -1)
			styleurl.value = src;
		else
			styleurl.value = '';
		// Banners are only available for the original stylesheets, so default to Coaltastic "1", which has all banners
		if (parseInt(id, 10) > originalNoSS)
			id = '1';
		input.value = id;
		$j.ajax({
			url: '/banners.php',
			type: 'POST',
			data: {
				styleid: id
			},
			success: function(data) {
				var currentBanner = $j('#banner :selected').text(),
				    bannerVal = '';
				$j('#banner').children().remove();
				var BannersArray = data.split(',');
				for (i = 0; i < BannersArray.length; i += 2) {
					$j('#banner').append($j('<option></option>').val(BannersArray[i]).html(BannersArray[i + 1]));
					if (currentBanner === BannersArray[i + 1])
						bannerVal = BannersArray[i];
				}
				currentBanner = document.querySelector('#banner option[value="' + bannerVal + '"]');
				if (currentBanner === null)
					$j('#banner :first').attr('selected', 'selected');
				else
					currentBanner.selected = true;
				showBanner();
			}
		});
	});
	function showBanner() {
		var banner = document.querySelector('#bannerimg img'),
		    pseudoSS = document.querySelector('#stylesheet option[value="' + input.value + '"]');
		if (banner !== null && pseudoSS !== null)
			banner.src = "static/styles/" + pseudoSS.textContent.toLowerCase() + "/images/" + $j("#banner :selected").text() + ".png";
	}
	var banner = document.getElementById('banner');
	banner.removeAttribute('onchange');
	banner.addEventListener('change', function(event) { showBanner(); });
}


// Hover smileys by Potatoe, ported by aldy
// Hides smileys behind one button that shows them all on hover.
// Depends on HTMLElement.clone and HTMLCollection.each
if (GM_getValue('delicioussmileys') === 'true' && document.getElementById('smileys')) {
	var smileys = document.getElementById('smileys'), r = '';
	forEach(smileys.getElementsByTagName('*'), function (n) {
		var c = n.getAttribute('onclick');
		n.removeAttribute('onclick');
		n.setAttribute('style',((n.width>33)?'margin-left:'+(33-n.width)/2+'px;':'')+'margin-top:'+(33-n.height)/2+'px;');
		r += '<div class="smileyscell" onclick="'+c+'">'+n.outerHTML+'</div>';
	});
	smileys.innerHTML = r;
	smileys.setAttribute('style', 'display: none; width: 330px !important; position: absolute; top: 0; left: 0; background:rgba(0,0,0,0.75);');
	smileys.setAttribute('id', 'hoversmileys');
	document.getElementById('bbcode').innerHTML += '<span style="display:inline-block;max-width:20px;height:20px;z-index:1;position:relative;" id="smileysholdster"><style>.smileyscell{display:inline-block;overflow:hidden;width:33px;max-width:33px;height:33px;float:left}#smileysbutton img[src="/static/common/smileys/Smile.png"]{margin-top:0px!important}#smileysbutton{width:20px;height:20px}</style></div>'
	var smileysholdster = document.getElementById('smileysholdster'), smileysbutton = clone(smileys.firstElementChild, {'id':'smileysbutton'});
	smileysholdster.appendChild(smileysbutton);
	smileysholdster.appendChild(smileys);
	smileys.style.top = smileysbutton.offsetTop + 'px';
	smileys.style.left = smileysbutton.offsetLeft + 'px';
	smileysholdster.addEventListener('mouseenter', function(){ var hs = document.getElementById('hoversmileys'), sb = document.getElementById('smileysbutton'); hs.style.top = sb.offsetTop+'px'; hs.style.left = sb.offsetLeft+'px'; hs.style.display = 'block'; });
	smileysholdster.addEventListener('mouseleave', function(){ document.getElementById('hoversmileys').style.display = 'none'; });
}


// [hide] button by Potatoe
// Adds a button that inserts the [hide] BBCode into the text field.
if (GM_getValue('deliciousbbcode') === 'true') {
	var spoilersnode = document.evaluate("//img[@title='Spoilers']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (spoilersnode) {
		// [url] and [quote] buttons by aldy
		// Edits the [url] and [quote] BBCode buttons.
		document.evaluate("//img[@title='URL']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.setAttribute('onclick', "insert_text('[url]', '[/url]')");
		document.evaluate("//img[@title='Quote']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.setAttribute('onclick', "insert_text('[quote]', '[/quote]')");

		var hideimg = document.createElement('img');
		hideimg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAotJREFUeNpiYWBgaGCgImDBJaHqp6co76CmLaAkosjGw84PEvv15efHD/fe3H908PbVWxsv3semjxHdhZLGciKm+U7evDICCvhc8vnJhwenJ+7b+vzsozfI4sxA7ADjqHjryFtXeSRwCHIJE/IaOx+HgLyjmsGP998ev7v96iOGl0EuM8l1iGRiZWYD8b+9+vz83Z3X95ANYeVi4xDRlNBmZmfhAPFBakF6vr74NAfmUrCBjIyMDOYlLv7MbCzsMM1XV5zZc2vDxXvoLuOW4Ntj1+DjK6QmpgX2IlAPSO/GqPlz////D/GyWoC+koKzhi2yxv9//39RcFJX0ou3sFYPNNBX9tBWZ2Jh+vHizKPXz888vKcRbGgDUwuMNL4fH78/fnvj5XuwC+XtVbXRXSJjpWSNLsYvL6QEdHUn0Is/QEHCJcYrCZMDmQHyERNYoaKIIsnpjZOVA8UyqBksMCcTMuDT4/f3Hu67eRbEFtWVEmTj5RBEloeZwQIJr39/GZmYmdENeXLs3tGDNZv2oIubZDu44M0pv77+/MwhgDvtAWOWQ9pCUQqYZCSBtDG660Dg99efn+AGfnn28Sk+A0GGmeY5xhIIksfgtAkiHu6/dQmbIlBCBiUpkMsIhfGDfTcvwV14c92Fuxohhk+4xflkkBUJKosocQpzC7Kws3DiM+zry09Pbq2/eBfuQlAKP9mzZ+PfX39+Iit8dfnZtc3xCxeDcg0uw0B6Tvbt3QgyA24gCIDy4pnJB5b/+/33F7FpEaQWpOf56Ydv8BZfoLyJ7n1s3gT5Cr34YsRWYoMKC7VAfWU5WxUtUAHLys3O///fv7+gAvbTw3ePHh2+cw0UZjBvEjSQEgAQYABZyQWIL1ugrwAAAABJRU5ErkJggg==";
		hideimg.title = hideimg.alt="Hide";
		hideimg.setAttribute('onclick', "insert_text('[hide]', '[/hide]')");
		spoilersnode.parentNode.insertBefore(hideimg, spoilersnode.nextSibling);
		spoilersnode.insertAdjacentHTML('afterend', '\n');
	}
}


// Better quote by Potatoe, multi-quote by Megure
// Makes the quoting feature on AnimeBytes better by including links back to posts and the posted date.
// Depends on injectScript
if (GM_getValue('deliciousquote') === 'true') {
	var quotes = document.querySelectorAll('a[onclick^="Quote"]');
	for (var i = 0, len = quotes.length; i < len; i++) {
		var elem = quotes[i],
		    args = elem.getAttribute('onClick').match(/Quote\s*\((?:\s*'([^']*)'\s*)?(?:,\s*'([^']*)'\s*)?(?:,\s*'([^']*)'\s*)?\)/i),
		    cb = document.createElement('input');
		cb.type = 'checkbox';
		cb.className = 'com-quote-multiquoteCB';
		if (args[1] === undefined) args[1] = '';
		if (args[2] === undefined) args[2] = '';
		if (args[3] === undefined) args[3] = '';
		cb.setAttribute('postid', args[1]);
		cb.setAttribute('username', args[2]);
		cb.setAttribute('surround', args[3]);
		// Hide it if usercomment
		if (/usercomment/i.test(elem.className))
			cb.style.display = 'none';
		elem.parentNode.insertBefore(cb, elem);
	}
	function Quote(postid, username, surround) {
		var result = [],
		    results = 0,
		    multiQuote,
		    temp = document.querySelector('input.com-quote-multiquoteCB[postid="' + postid + '"]');
		if (temp !== null)
			temp.checked = true;
		multiQuote = document.querySelectorAll('.com-quote-multiquoteCB:checked');
		if (multiQuote.length > 0) {
			for (var i = 0, len = multiQuote.length; i < len; i++) {
				var elem = multiQuote[i],
						postid = elem.getAttribute('postid'),
						username = elem.getAttribute('username'),
						surround = elem.getAttribute('surround');
				retrievePost(postid, username, surround, i);
			}
		} else {
			multiQuote = [document.createElement('input')];
			retrievePost(postid, username, surround, 0);
		}
		function checkResult() {
			if (multiQuote.length === ++results) {
				insert_text(result.join('\n\n\n'), '');
				for (var i = 0, len = multiQuote.length; i < len; i++)
					multiQuote[i].checked = false;
			}
		}
		function retrievePost(postid, username, surround, index) {
			$j.ajax({
				url: window.location.pathname,
				data: {
					action: 'get_post',
					post: postid
				},
				success: function (response) {
					function replaceImg(text){if(text.match(/^([^]*)(\[img\][^\[]+\[\/img\])([^]*)$/mi)!=null){return text.replace(/^([^]*)(\[img\][^\[]+\[\/img\])([^]*)$/mi,function(full,$1,$2,$3){var tmp="BQTMPBQ"+new Date().getTime()+"BQTMPBQ",ssm=$1.match(/\[hide(=[^\]]*)?\]/mgi),sem=$1.match(/\[\/hide\]/mgi),esm=$3.match(/\[hide(=[^\]]*)?\]/mgi),eem=$3.match(/\[\/hide\]/mgi),ssm=(ssm!=null)?ssm.length:0,sem=(sem!=null)?sem.length:0,esm=(esm!=null)?esm.length:0,eem=(eem!=null)?eem.length:0,hsm=ssm-sem,hem=esm-eem,tmptxt=replaceImg($1+tmp+$3);$1=tmptxt.substring(0,tmptxt.search(tmp));$3=tmptxt.substring(tmptxt.search(tmp)+tmp.length,tmptxt.length);if(hsm>=hem&&hsm>0)return $1+$2+$3;return $1+'[hide=Image]'+$2+'[/hide]'+$3})}return text}
					function replaceYouTube(text){if(text.match(/^([^]*)(\[youtube\][^\[]+\[\/youtube\])([^]*)$/mi)!=null){return text.replace(/^([^]*)(\[youtube\][^\[]+\[\/youtube\])([^]*)$/mi,function(full,$1,$2,$3){var tmp="BQTMPBQ"+new Date().getTime()+"BQTMPBQ",ssm=$1.match(/\[hide(=[^\]]*)?\]/mgi),sem=$1.match(/\[\/hide\]/mgi),esm=$3.match(/\[hide(=[^\]]*)?\]/mgi),eem=$3.match(/\[\/hide\]/mgi),ssm=(ssm!=null)?ssm.length:0,sem=(sem!=null)?sem.length:0,esm=(esm!=null)?esm.length:0,eem=(eem!=null)?eem.length:0,hsm=ssm-sem,hem=esm-eem,tmptxt=replaceYouTube($1+tmp+$3);$1=tmptxt.substring(0,tmptxt.search(tmp));$3=tmptxt.substring(tmptxt.search(tmp)+tmp.length,tmptxt.length);if(hsm>=hem&&hsm>0)return $1+$2+$3;return $1+'[hide=YouTube Video]'+$2+'[/hide]'+$3})}return text}
					response = replaceYouTube(replaceImg(response));
					var date = document.querySelector('div#post' + postid + ' > div > div > p.posted_info > span');
					if (date === null)
						date = document.querySelector('div#post' + postid + ' > div > span > span.usercomment_posttime');
					if (date !== null) {
						date = new Date(date.title.replace(/-/g,'/')).toUTCString().split(' ');
						date = date[1] + ' ' + date[2] + ' ' + date[3] + ', ' + date[4].substring(0,5) + ' ' + date[5];
					}
					var userid = document.evaluate("//span/a[text()='"+username+"' and starts-with(@href, '/user.php?id=')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.href;
					var quoteText = '[b][user=' + userid + ']' + username + '[/user][/b] [url=' + window.location.pathname + window.location.search + '#post' + postid + ']wrote' + ((date !== null) ? ' on ' + date : '') + '[/url]:\n[quote]' + response + '[/quote]\n';
					if (surround && surround.length > 0) quoteText = '[' + surround + ']' + quoteText + '[/' + surround + ']';
					result[index] = quoteText;
					checkResult();
				},
				error: function () {
					result[index] = 'error retrieving post #' + postid;
					checkResult();
				},
				dataType: 'html'
			});
		}
	}
	injectScript(Quote, 'BetterQuote');
}


// HYPER QUOTE by Megure
// Select text and press CTRL+V to quote
if (GM_getValue('delicioushyperquote') === 'true' && document.getElementById('quickpost') !== null) {
	function formattedUTCString(date, timezone) {
		var creation = new Date(date);
		if (isNaN(creation.getTime()))
			return date;
		else {
			creation = creation.toUTCString().split(' ');
			return creation[1] + ' ' + creation[2] + ' ' + creation[3] + ', ' + creation[4].substring(0, 5) + (timezone !== false ? ' ' + creation[5] : '');
		}
	}

	function QUOTEALL() {
		var sel = window.getSelection();
		for(var i = 0; i < sel.rangeCount; i++)
			QUOTEMANY(sel.getRangeAt(i));
	}

	function QUOTEMANY(range) {
		function removeChildren(node, prev) {
			if (node === null || node.parentNode === null) return;
			if (prev === true)
				while (node.parentNode.firstChild !== node)
					node.parentNode.removeChild(node.parentNode.firstChild);
			else
				while (node.parentNode.lastChild !== node)
					node.parentNode.removeChild(node.parentNode.lastChild);
			removeChildren(node.parentNode, prev);
		}
		function inArray(arr, elem) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] === elem)
					return i;
			}
			return -1;
		}

		if (range.collapsed === true) return;

		var html1, html2, copy, res, start = [], end = [], startNode, endNode;
		html1 = range.startContainer;
		while (html1.parentNode !== null) {
			start.push(inArray(html1.parentNode.childNodes, html1));
			html1 = html1.parentNode;
		}
		html2 = range.endContainer;
		while (html2.parentNode !== null) {
			end.push(inArray(html2.parentNode.childNodes, html2));
			html2 = html2.parentNode;
		}
		if (html1 !== html2 || html1 === null) return;
		copy = html1.cloneNode(true);

		startNode = copy;
		for (var i = start.length - 1; i >= 0; i--) {
			if (start[i] === -1) return;
			startNode = startNode.childNodes[start[i]];
		}
		endNode = copy;
		for (var i = end.length - 1; i >= 0; i--) {
			if (end[i] === -1) return;
			endNode = endNode.childNodes[end[i]];
		}

		if (endNode.nodeType === 3)
			endNode.data = endNode.data.substr(0, range.endOffset);
		else if (endNode.nodeType === 1)
			for (var i = endNode.childNodes.length; i > range.endOffset; i--)
				endNode.removeChild(endNode.lastChild);
		if (range.startOffset > 0) {
			if (startNode.nodeType === 3)
				startNode.data = startNode.data.substr(range.startOffset);
			else if (startNode.nodeType === 1)
				for (var i = 0; i < range.startOffset; i++)
					startNode.removeChild(startNode.firstChild);
		}

		removeChildren(startNode, true);
		removeChildren(endNode, false);

		var posts = copy.querySelectorAll('div[id^="post"],div[id^="msg"]');
		for (var i = 0; i < posts.length; i++)
			QUOTEONE(posts[i]);
	}


	function QUOTEONE(post) {
		function HTMLtoBB(str) {
			// Order is somewhat relevant
			var ret = str.replace(/<strong><a.*?>.*?<\/a><\/strong> <a.*?>wrote on (.*?)<\/a>/ig, function(html, dateString) {
						return html.replace(dateString, formattedUTCString(dateString));
					}).
					replace(/<span class="smiley-.+?" title="(.+?)"><\/span>/ig, function(html, smiley) {
						var smileyNode = document.querySelector('img[alt="' + smiley + '"]');
						if (smileyNode === null)
							smileyNode = document.querySelector('img[src$="' + smiley + '.png"]');
						if (smileyNode === null)
							smileyNode = document.querySelector('img[src$="' + smiley.replace(/-/g, '_') + '.png"]');
						if (smileyNode === null)
							smileyNode = document.querySelector('img[src$="' + smiley.replace(/-/g, '_').toLowerCase() + '.png"]');
						if (smileyNode === null)
							smileyNode = document.querySelector('img[src$="' + smiley.replace(/face/g, '~_~') + '.png"]');
						if (smileyNode !== null && smileyNode.parentNode !== null) {
							smileyNode = smileyNode.parentNode.getAttribute('onclick').match(/'(.+?)'/i);
							if (smileyNode !== null)
								return smileyNode[1];
						}
						return ':' + smiley + ':';
					}).
					replace(/<iframe.*?src="([^?"]*).*?".*?><\/iframe>/ig, '[youtube]$1[/youtube]').
					replace(/<([^\s>]+)[^>]*>\s*<\/([^>]+?)>/ig, function(html, match1, match2) {
						if (match1 === match2)
							return '';
						return html;
					}).
					replace(/<ul><li>(.+?)<\/li><\/ul>/ig, '[*]$1').
					replace(/<br.*?>/ig, '').
					replace(/<a.*?href="(.*?)".*?>([\s\S]*?)<\/a>/ig, '[url=$1]$2[/url]').
					replace(/<strong>([\s\S]*?)<\/strong>/ig, '[b]$1[/b]').
					replace(/<em>([\s\S]*?)<\/em>/ig, '[i]$1[/i]').
					replace(/<u>([\s\S]*?)<\/u>/ig, '[u]$1[/u]').
					replace(/<s>([\s\S]*?)<\/s>/ig, '[s]$1[/s]').
					replace(/<div style="text-align: center;">([\s\S]*?)<\/div>/ig, '[align=center]$1[/align]').
					replace(/<div style="text-align: left;">([\s\S]*?)<\/div>/ig, '[align=left]$1[/align]').
					replace(/<div style="text-align: right;">([\s\S]*?)<\/div>/ig, '[align=right]$1[/align]').
					replace(/<span style="color:\s*(.*?);?">([\s\S]*?)<\/span>/ig, '[color=$1]$2[/color]').
					replace(/<span class="size(.*?)">([\s\S]*?)<\/span>/ig, '[size=$1]$2[/size]').
					replace(/<blockquote class="blockquote">([\s\S]*?)<\/blockquote>/ig, '[quote]$1[/quote]').
					replace(/<div class="spoilerContainer"><input.*?><div class="spoiler">([\s\S]*?)<\/div><\/div>/ig, '[spoiler]$1[/spoiler]').
					replace(/<div class="spoilerContainer hideContainer"><input.*?value="Show (.*?)".*?><div class="spoiler">([\s\S]*?)<\/div><\/div>/ig, '[hide=$1]$2[/hide]').
					replace(/<img.*?src="(.*?)".*?>/ig, '[img]$1[/img]').
					replace(/<span class="last-edited">[\s\S]*$/ig, '');
			if (ret !== str) return HTMLtoBB(ret);
			else {
				// Decode HTML
				var tempDiv = document.createElement('div');
				tempDiv.innerHTML = ret;
				return tempDiv.textContent.trim();
			}
		}

		var res = HTMLtoBB(post.querySelector('div.post,div.body').innerHTML),
		    author, creation, postid;
		if (res === '') return;

		postid = post.id.match(/post\d+|msg\d+/i);
		if (postid !== null)
			postid = postid[0];
		else
			return;

		author = post.className.match(/user_(\d+)/i);
		if (author !== null)
			author = '[b][user]' + author[1] + '[/user][/b] ';
		else {
			author = document.querySelector('#' + postid + ' a[href^="/user.php?"]');
			if (author !== null) {
				author = author.href.match(/id=(\d+)/i);
				if (author !== null)
					author = '[b][user]' + author[1] + '[/user][/b] ';
				else
					author = '';
			}
			else
				author = '';
		}
		creation = document.querySelector('#' + postid + ' p.posted_info > span');
		if (creation !== null)
			creation = ' on ' + formattedUTCString(creation.title.replace(/-/g,'/'));
		else
			creation = '';

		res = author + '[url=' + window.location.pathname + window.location.search + '#' + postid + ']wrote' + creation + '[/url]:\n[quote]' + res + '[/quote]\n\n';

		document.getElementById('quickpost').value += res;

		sel = document.getElementById('quickpost');
		if (sel !== null)
			sel.scrollIntoView();
	}

	var postRefs = document.querySelectorAll('#content a[href^="/"]');
	for (var i = postRefs.length - 1; i > 0; i--) {
		var elem = postRefs[i];
		if (/^wrote on /.test(elem.textContent)) {
			var text = elem.textContent.split('wrote on ')[1],
			    newText = new Date(text + (/GMT$/i.test(elem.textContent) ? '' : ' GMT'));
			if (!isNaN(newText.getTime()))
				// Manually subtract timezone
				elem.textContent = elem.textContent.replace(text, formattedUTCString(newText.getTime() - 60000 * newText.getTimezoneOffset(), false));
		}
	}

	document.addEventListener('keydown', function (e) {
		if((e.ctrlKey || e.metaKey) && e.keyCode === 'V'.charCodeAt(0))
			QUOTEALL();
	});
}


// Forums title inverter by Potatoe
// Inverts the forums titles.
if (GM_getValue('delicioustitleflip') === 'true' && document.title.indexOf(' > ') > -1) document.title = document.title.split(" :: ")[0].split(" > ").reverse().join(" < ") + " :: AnimeBytes";


// Hide/Show forum poster info by Megure
// Hide/Show #posts, join date, icons
if (GM_getValue('disgustingposterinfo') !== 'true') {
	var info = document.querySelectorAll('.user_fields.nobullet');
	for (var _i = 0, _len = info.length; _i < _len; _i++)
		info[_i].style.display = 'inherit';
}


// Hide treats by Alpha
// Hide treats on profile.
if (GM_getValue('delicioustreats') === 'true') {
	var treatsnode = document.evaluate('//*[@id="user_leftcol"]/div[@class="box" and div[@class="head" and .="Treats"]]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (treatsnode) treatsnode.style.display = "none";
}


// Keyboard shortcuts by Alpha, mod by Megure
// Enables keyboard shortcuts for forum (new post and edit) and PM
if (GM_getValue('deliciouskeyboard') === 'true' && document.querySelector('textarea') !== null) {
	function custom_insert_text(open, close) {
		var elem = document.activeElement;
		if (elem.selectionStart || elem.selectionStart == '0') {
			var startPos = elem.selectionStart;
			var endPos = elem.selectionEnd;
			elem.value = elem.value.substring(0, startPos) + open + elem.value.substring(startPos, endPos) + close + elem.value.substring(endPos, elem.value.length);
			elem.selectionStart = elem.selectionEnd = endPos + open.length + close.length;
			elem.focus();
			if (close.length == 0)
				elem.setSelectionRange(startPos + open.length, startPos + open.length);
			else
				elem.setSelectionRange(startPos + open.length, endPos + open.length);
		} else if (document.selection && document.selection.createRange) {
			elem.focus();
			sel = document.selection.createRange();
			sel.text = open + sel.text + close;
			if (close.length != 0) {
				sel.move("character", -close.length);
				sel.select();
			}
			elem.focus();
		} else {
			elem.value += open;
			elem.focus();
			elem.value += close;
		}
	}
	function ctrl(key, callback, args) {
		document.addEventListener('keydown', function (e) {
			if((e.ctrlKey || e.metaKey) && e.keyCode === key.charCodeAt(0) && document.activeElement.tagName.toLowerCase() === 'textarea') {
				e.preventDefault();
				callback.apply(this, args);
				return false;
			}
		});
	}
	/**
	* All keyboard shortcuts based on MS Word
	**/

	var img, ctrlorcmd = (navigator.appVersion.indexOf('Mac') != -1) ? '⌘' : 'CTRL';
	// Bold
	ctrl('B', custom_insert_text, ['[b]', '[/b]']);
	img = document.querySelector('#bbcode img[title="Bold"]');
	if (img !== null) img.title += ' (' + ctrlorcmd + '+B)';
	// Italics
	ctrl('I', custom_insert_text, ['[i]', '[/i]']);
	img = document.querySelector('#bbcode img[title="Italics"]');
	if (img !== null) img.title += ' (' + ctrlorcmd + '+I)';
	// Underline
	ctrl('U', custom_insert_text, ['[u]', '[/u]']);
	img = document.querySelector('#bbcode img[title="Underline"]');
	if (img !== null) img.title += ' (' + ctrlorcmd + '+U)';
	// Align right
	ctrl('R', custom_insert_text, ['[align=right]', '[/align]']);
	// Align left
	ctrl('L', custom_insert_text, ['[align=left]', '[/align]']);
	// Align center
	ctrl('E', custom_insert_text, ['[align=center]', '[/align]']);
	// Spoiler
	ctrl('S', custom_insert_text, ['[spoiler]', '[/spoiler]']);
	img = document.querySelector('#bbcode img[title="Spoilers"]');
	if (img !== null) img.title += ' (' + ctrlorcmd + '+S)';
	// Hide
	ctrl('H', custom_insert_text, ['[hide]', '[/hide]']);
	img = document.querySelector('#bbcode img[title="Hide"]');
	if (img !== null) img.title += ' (' + ctrlorcmd + '+H)';
}


// Title Notifications by Megure
// Will prepend the number of notifications to the title
if(GM_getValue('delicioustitlenotifications') === 'true') {
	var new_count = 0, _i, cnt, notifications = document.querySelectorAll('#alerts .new_count'), _len = notifications.length;
	for(_i = 0; _i < _len; _i++) {
		cnt = parseInt(notifications[_i].textContent, 10);
		if (!isNaN(cnt))
			new_count += cnt;
	}
	if (new_count > 0)
		document.title = '(' + new_count + ') ' + document.title;
}


// Three more scripts by Megure; the headers are still included
// Search for UserScript or visit https://github.com/tubersan/AnimeBytes-Userscripts/ for details
if((/^http.*:\/\/animebytes\.tv/i.test(document.URL))){
// ==UserScript==
// @name        Enhanced Torrent View
// @namespace   Megure@AnimeBytes.tv
// @description Shows how much yen you would receive if you seeded torrents; shows required seeding time
// @include     http*://animebytes.tv*
// @version     0.8
// @grant       GM_getValue
// @grant       GM_setValue
// @icon        http://animebytes.tv/favicon.ico
// ==/UserScript==

(function() {
    var showYen = GM_getValue('ABTorrentsShowYen', 'true'), // true / false: activate / deactivate display of yen production per hour
        reqTime = GM_getValue('ABTorrentsReqTime', 'true'), // true / false: activate / deactivate display of required seeding time
        fa = 1;

    function unitPrefix (prefix) {
        switch (prefix.toUpperCase()) {
            case '':  return 1 / 1073741824;
            case 'K': return 1 / 1048576;
            case 'M': return 1 / 1024;
            case 'G': return 1;
            case 'T': return 1024;
            case 'P': return 1048576;
            case 'E': return 1073741824;
            default:  return 0;
        }
    }

    function countCols (row) {
        var cells = row.cells, cols = 0, _i = 0, _len = cells.length;
        for (; _i < _len; _i++) {
            cols += cells[_i].colSpan;
        }
        return cols;
    }

    function dur2string (duration) {
        var durationString = '',
            tempH = Math.floor(duration),
            tempM = Math.ceil((duration * 60) % 60);
        if (tempM === 60) {
            tempH += 1;
            tempM = 0;
        }
        durationString += tempH + ' hours';
        if (tempM > 0)
            durationString += ' and ' + tempM + ' minutes';
        durationString += ' (~' + (Math.round(10 * duration / 24) / 10) + ' days)';
        return durationString;
    }

    function fu (myDuration) {
        return Math.pow(2, duration / (24 * 365.25));
    }

    function fs (mySize) {
        return Math.max(0.1, Math.sqrt(mySize)) / 4;
    }

    function ft (mySeeders) {
        return Math.min(1.0, 3 / Math.sqrt(mySeeders + 4));
    }

    function f (mySize, mySeeders, myDuration) {
        return fs(mySize) * fu(myDuration) * ft(mySeeders) * fa;
    }

    function createTitle (start, end, mySize, myDuration) {
        start = Math.max(start, 5);
        end   = Math.min(start + 4, Math.max(end, 5));
        var res = '';
        for (var j = start; j <= end; j++) {
            res += '¥' + f(mySize, j, myDuration).toPrecision(6) + '\t';
            if (j === 5)
                res += '≤';
            res += j + '\n';
        }
        return res;
    }

    if (showYen.toString() === 'true' || reqTime.toString() === 'true') {
        var torrents, cells, seeders, leechers, size, sizeIndex, sizeRe, andRe, durationRe, torrentId, newCell, header, newHeader, lastHeaderCell, sum = 0, seedingTime, duration;
        
        torrents = document.querySelectorAll('tr.torrent,tr.group_torrent');
        sizeRe = /^([\d\.,]+)\s([A-Z]?)B$/i;
        andRe = /(and|\s|,)/ig;
        durationRe = /^(?:(\d+)years?)?(?:(\d+)months?)?(?:(\d+)weeks?)?(?:(\d+)days?)?(?:(\d+)hours?)?(?:(\d+)minutes?)?(?:(\d+)seconds?)?$/i;
        
        fa = 2 - 1 / (1 + Math.exp(5 - ((new Date()).getTime() - GM_getValue('creation', 0)) / 1728000000)); // milliseconds per 20 days

        for (var i = 0; i < torrents.length; i++) {
            cells = torrents[i].cells;
            size = null;
            if (cells.length === 5) {
                seeders = parseInt(cells[3].textContent, 10);
                leechers = parseInt(cells[4].textContent, 10);
                size = cells[1].textContent.match(sizeRe);
                sizeIndex = 1;
            }
            else if (cells.length === 9) {
                seeders = parseInt(cells[6].textContent, 10);
                leechers = parseInt(cells[7].textContent, 10);
                size = cells[4].textContent.match(sizeRe);
                sizeIndex = 4
            }
            if (size === null || isNaN(seeders) || isNaN(leechers))
                continue;

            if (reqTime.toString() === 'true') {
                size = parseFloat(size[1].replace(/,/g, '')) * unitPrefix(size[2]);
                seedingTime = Math.max(0, size - 10) * 5 + 72;
                cells[sizeIndex].title = 'You need to seed this torrent for at least\n' + dur2string(seedingTime) + '\nor it will become a hit and run!';

                torrentId = torrents[i].querySelector('a[title="Download"]');
                if (torrentId != null) {
                    torrentId = torrentId.href.match(/id=(\d+)/i);
                    if (torrentId != null) {
                        torrentId = document.getElementById('torrent_' + torrentId[1]);
                        if (torrentId != null) {
                            torrentId = torrentId.querySelector('blockquote');
                            if (torrentId != null) {
                                torrentId.appendChild(document.createElement('br'));
                                torrentId.innerHTML += 'You need to seed this torrent for at least <span class="r01">' + dur2string(seedingTime) + '</span> or it will become a hit and run!';
                            }
                        }
                    }
                }
            }

            if (showYen.toString() === 'true') {
                duration = 0;
                if (document.URL.indexOf('type=seeding') >= 0) {
                    duration = cells[3].textContent.replace(andRe, '').match(durationRe);
                    if (duration != null) {
                        duration = (function() {
                            var _i, _len, _results, _num;
                            _results = [];
                            for (_i = 1, _len = duration.length; _i < _len; _i++) {
                                _num = duration[_i];
                                if (_num != null) {
                                    _results.push(parseInt(_num, 10));
                                } else {
                                    _results.push(0);
                                }
                            }
                            return _results;
                        })();
                        duration = 24 * (duration[0] * 365.25 + duration[1] * 30.4375 + duration[2] * 7 + duration[3]) + duration[4] + duration[5] / 60 + duration[6] / 3600;
                    }
                }
                sum += f(size, seeders, duration);

                newCell = document.createElement('td');
                newCell.textContent = '¥' + f(size, seeders, duration).toFixed(2);
                newCell.title = '¥' + fs(size).toPrecision(6)                      + '  \tbase for size';
                if ((100 * (fa           - 1)).toFixed(1) !== '0.0')
                    newCell.title += '\n+' + (100 * (fa           - 1)).toFixed(1) + '% \tfor your account\'s age';
                if ((100 * (fu(duration) - 1)).toFixed(1) !== '0.0')
                    newCell.title += '\n+' + (100 * (fu(duration) - 1)).toFixed(1) + '% \tfor seeding time';
                if ((100 * (ft(seeders)  - 1)).toFixed(1) !== '0.0')
                    newCell.title += '\n'  + (100 * (ft(seeders)  - 1)).toFixed(1) + '% \tfor number of seeders';
                newCell.title += '\n\n¥ per hour \t#seeders\n' + createTitle(seeders - 1, seeders + leechers + 1, size, duration);
                torrents[i].appendChild(newCell);
                header = torrents[i].parentNode.firstChild;
                if (countCols(header) + 1 === countCols(torrents[i])) {
                    newHeader = header.children[1].cloneNode(true);
                    newHeader.title = '¥ per hour';
                    if (newHeader.textContent !== '') {
                        if (newHeader.children.length > 0)
                            newHeader.children[0].textContent = '¥/h';
                        else
                            newHeader.textContent = '¥/h';
                    }
                    header.appendChild(newHeader);
                }
            }
        }

        if (showYen.toString() === 'true') {
            var myColSpan;
            console.log("Sum of Yen for all torrents on this site:", sum);

            torrents = document.querySelectorAll('tr.edition_info,tr.pad,tr[id^="group_"]');
            for (var i = 0; i < torrents.length; i++) {
                lastHeaderCell = torrents[i].cells[torrents[i].cells.length - 1];
                lastHeaderCell.colSpan += 1;
            }
        }

        if (document.URL.indexOf('user.php') >= 0 && document.URL.indexOf('preview=true') >= 0) {
            var _temp = null;
            try {
                _temp = document.getElementById('first_wrapper_outer').getElementsByClassName('userstatsleft')[0].getElementsByTagName('span')[0].title;
            } catch (e) {}
            if (_temp != null)
                GM_setValue('creation', Date.parse(_temp));
        }
    }

}).call(this);

}

if((/^http.*:\/\/animebytes\.tv.*alltorrents\.php/i.test(document.URL))){
// Generated by CoffeeScript 1.6.3
/*
// ==UserScript==
// @name        Hit&Run Detector
// @namespace   Megure@AnimeBytes.tv
// @description Highlights torrents which might become a Hit & Run; allows sorting on all history-pages
// @include     http*://animebytes.tv*alltorrents.php*
// @version     0.83
// @grant       GM_getValue
// @icon        http://animebytes.tv/favicon.ico
// ==/UserScript==
*/


(function() {
  var a1, a2, allRows, andRe, clonedNode, colorRows, curPage, currencyRe, dateTimeRe, downIndex, downRe, dur2string, durIndex, durationRe, dynamicLoad, header, headers, index, lastPage, lcNegBG, lcNegFG, lcNeuBG, lcNeuFG, lcPosBG, lcPosFG, line_color_neg, line_color_neu, line_color_pos, loadPage, multiRatio, newPagenum, nextPage, pagenum, pagenums, parseCell, parseRows, prevPage, ratioIndex, ratioRe, sizeIndex, sizeRe, sortFunctions, sortIndex, sortRows, unitPrefix, _i, _j, _len, _len1;

  colorRows = GM_getValue('ABHistColorRows', 'true');

  sortRows = GM_getValue('ABHistSortRows', 'true');

  dynamicLoad = GM_getValue('ABHistDynLoad', 'true');

  lcPosBG = GM_getValue('ABHistColorPosBG', '#B0F0B0');

  lcNeuBG = GM_getValue('ABHistColorNeuBG', '#F0F0B0');

  lcNegBG = GM_getValue('ABHistColorNegBG', '#F0B0B0');

  lcPosFG = GM_getValue('ABHistColorPosFG', 'Black');

  lcNeuFG = GM_getValue('ABHistColorNeuFG', 'Black');

  lcNegFG = GM_getValue('ABHistColorNegFG', 'Black');

  line_color_neg = [lcNegBG, lcNegFG];

  line_color_neu = [lcNeuBG, lcNeuFG];

  line_color_pos = [lcPosBG, lcPosFG];

  sizeRe = /^([\d\.]+)\s([A-Z]?)B$/i;

  downRe = /^([\d\.]+)\s([A-Z]?)B\s\(([\d\.]+)%\)$/i;

  ratioRe = /^(∞|\-\-|[\d\.]+)$/i;

  andRe = /(and|\s)/ig;

  durationRe = /^(?:(\d+)years?)?(?:(\d+)months?)?(?:(\d+)weeks?)?(?:(\d+)days?)?(?:(\d+)hours?)?(?:(\d+)minutes?)?(?:(\d+)seconds?)?$/i;

  dateTimeRe = /^(\d+)\-(\d{1,2})\-(\d{1,2})\s+(\d{1,2}):(\d{1,2})$/i;

  currencyRe = /^(?:[¥|€|£|\$]\s*)([\d\.]+)$/i;

  downIndex = null;

  sizeIndex = null;

  durIndex = null;

  ratioIndex = null;

  multiRatio = false;

  allRows = [];

  unitPrefix = function(prefix) {
    switch (prefix.toUpperCase()) {
      case '':
        return 1 / 1073741824;
      case 'K':
        return 1 / 1048576;
      case 'M':
        return 1 / 1024;
      case 'G':
        return 1;
      case 'T':
        return 1024;
      case 'P':
        return 1048576;
      case 'E':
        return 1073741824;
      default:
        return 0;
    }
  };

  dur2string = function(duration) {
    var tempH, tempM;
    tempH = Math.floor(duration);
    tempM = Math.ceil((duration * 60) % 60);
    if (tempM === 60) {
      tempH += 1;
      tempM = 0;
    }
    if (tempM === 0) {
      return '' + tempH;
    } else if (tempM < 10) {
      return '' + tempH + ':0' + tempM;
    } else {
      return '' + tempH + ':' + tempM;
    }
  };

  parseCell = function(cell, index) {
    var match, num, textContent, textContentNoComma;
    textContent = cell.textContent.trim();
    textContentNoComma = textContent.replace(/,/g, '').trim();
    match = cell.querySelector('img');
    if (cell.textContent === '' && (match != null)) {
      return match.alt.toUpperCase();
    }
    match = textContentNoComma.match(downRe);
    if (match != null) {
      downIndex = index;
      return [parseFloat(match[1]) * unitPrefix(match[2]), parseFloat(match[3])];
    }
    match = textContentNoComma.match(sizeRe);
    if (match != null) {
      sizeIndex = index;
      return parseFloat(match[1]) * unitPrefix(match[2]);
    }
    match = textContentNoComma.match(dateTimeRe);
    if (match != null) {
      match.shift();
      match = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = match.length; _i < _len; _i++) {
          num = match[_i];
          _results.push(parseInt(num, 10));
        }
        return _results;
      })();
      return new Date(match[0], match[1] - 1, match[2], match[3], match[4]);
    }
    match = textContentNoComma.replace(andRe, '').match(durationRe);
    if (match != null) {
      durIndex = index;
      match.shift();
      match = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = match.length; _i < _len; _i++) {
          num = match[_i];
          if (num != null) {
            _results.push(parseInt(num, 10));
          } else {
            _results.push(0);
          }
        }
        return _results;
      })();
      return 24 * (match[0] * 365.25 + match[1] * 30.4375 + match[2] * 7 + match[3]) + match[4] + match[5] / 60 + match[6] / 3600;
    }
    match = textContentNoComma.match(currencyRe);
    if (match != null) {
      return parseFloat(match[1]);
    }
    match = textContentNoComma.match(ratioRe);
    if (match != null) {
      if ((ratioIndex != null) && ratioIndex !== index) {
        multiRatio = true;
      }
      ratioIndex = index;
      switch (match[1]) {
        case '∞':
          return Infinity;
        case '--':
          return -0.2;
        case '0':
          return -0.1;
        default:
          return parseFloat(match[1]);
      }
    } else if (textContentNoComma === 'Never') {
      durIndex = index;
      return 0;
    } else {
      return textContent.toUpperCase();
    }
  };

  parseRows = function(myDocument) {
    var cell, completion, downloaded, index, line_color, minSeedingTime, myData, ratio, row, seedingTime, size, torrent_rows, _i, _len, _ref;
    torrent_rows = myDocument.querySelectorAll('tr[class="torrent"]');
    for (_i = 0, _len = torrent_rows.length; _i < _len; _i++) {
      row = torrent_rows[_i];
      myData = (function() {
        var _j, _len1, _ref, _results;
        _ref = row.cells;
        _results = [];
        for (index = _j = 0, _len1 = _ref.length; _j < _len1; index = ++_j) {
          cell = _ref[index];
          _results.push(parseCell(cell, index));
        }
        return _results;
      })();
      completion = 100;
      downloaded = 0;
      size = 0;
      ratio = 0;
      line_color = ['', ''];
      if (downIndex != null) {
        _ref = myData[downIndex], downloaded = _ref[0], completion = _ref[1];
        if (completion > 0) {
          size = downloaded * 100 / completion;
        } else {
          size = downloaded;
        }
        myData[downIndex] = downloaded;
      } else if (sizeIndex != null) {
        size = myData[sizeIndex];
      }
      if ((ratioIndex != null) && !multiRatio) {
        ratio = myData[ratioIndex];
      }
      if ((durIndex != null) && (document.URL.indexOf('action=history') >= 0 || document.URL.indexOf('type=seeding') >= 0)) {
        minSeedingTime = 72 + 5 * Math.max(size - 10, 0);
        seedingTime = myData[durIndex];
        if (myData[myData.length - 1] === 'EXEMPT') {
          line_color = line_color_pos;
          myData[durIndex] = Math.min(0, minSeedingTime - seedingTime);
        } else if (completion >= 10 && ratio < 1 && seedingTime < minSeedingTime) {
          line_color = line_color_neg;
          myData[durIndex] = minSeedingTime - seedingTime;
          row.cells[durIndex].innerHTML += "<br />(~" + (dur2string(minSeedingTime - seedingTime)) + "h to seed)";
        } else if (seedingTime >= minSeedingTime || ratio >= 1) {
          line_color = line_color_pos;
          myData[durIndex] = Math.min(0, minSeedingTime - seedingTime);
        } else if (seedingTime > 0) {
          line_color = line_color_pos;
          myData[durIndex] = Math.min(0, minSeedingTime - seedingTime);
        } else {
          line_color = line_color_neu;
          myData[durIndex] = Math.min(0.000001 * (completion + 1), minSeedingTime - seedingTime);
        }
        if (colorRows.toString() === 'true') {
          if (line_color[0] !== 'none') {
            row.style.backgroundColor = line_color[0];
          }
          if (line_color[1] !== 'none') {
            row.style.color = line_color[1];
          }
        }
      }
      if (headers[0] != null) {
        headers[0].parentNode.parentNode.appendChild(row);
      }
      if (sortRows.toString() === 'true') {
        allRows.push([row].concat(myData));
      }
    }
    return void 0;
  };

  sortIndex = null;

  sortFunctions = function(index, force) {
    return function(event) {
      var row, _i, _len;
      if (event != null) {
        event.stopPropagation();
        event.preventDefault();
      }
      if ((index != null) && (allRows[0] != null)) {
        if (sortIndex === index && force === false) {
          allRows.reverse();
        } else {
          sortIndex = index;
          allRows.sort(function(a, b) {
            if ((a[index + 1] != null) && (b[index + 1] != null)) {
              if (a[index + 1] > b[index + 1]) {
                return -1;
              } else if (a[index + 1] < b[index + 1]) {
                return 1;
              } else {
                return 0;
              }
            } else if ((a[index + 1] != null) && (b[index + 1] == null)) {
              return -1;
            } else if ((b[index + 1] != null) && (a[index + 1] == null)) {
              return 1;
            } else {
              return 0;
            }
          });
        }
        for (_i = 0, _len = allRows.length; _i < _len; _i++) {
          row = allRows[_i];
          row[0].parentNode.appendChild(row[0]);
        }
      }
      return void 0;
    };
  };

  headers = document.querySelector('tr.colhead');

  if (headers != null) {
    headers = headers.cells;
  } else {
    headers = [];
  }

  parseRows(document);

  if (sortRows.toString() === 'true') {
    for (index = _i = 0, _len = headers.length; _i < _len; index = ++_i) {
      header = headers[index];
      a1 = document.createElement('a');
      a1.href = '#';
      if (index === 0) {
        a1.textContent = 'Type';
      } else if ((header.querySelector('a') != null) || header.textContent.trim() === '') {
        a1.textContent = '*';
      } else {
        a1.textContent = header.textContent;
      }
      if (a1.textContent !== '*') {
        while (header.hasChildNodes()) {
          header.removeChild(header.lastChild);
        }
      }
      header.appendChild(a1);
      a1.addEventListener('click', sortFunctions(index, false), true);
    }
  }

  if (dynamicLoad.toString() === 'true') {
    curPage = document.URL.match(/page=(\d+)/i);
    curPage = curPage != null ? parseInt(curPage[1], 10) : 1;
    prevPage = curPage - 1;
    nextPage = curPage + 1;
    lastPage = 1;
    pagenums = document.querySelectorAll('div.pagenums');
    loadPage = function(prev) {
      if (prev == null) {
        prev = false;
      }
      return function(event) {
        var newPage, newURL, xhr;
        if (event != null) {
          event.stopPropagation();
          event.preventDefault();
        }
        if (prev) {
          newPage = prevPage--;
        } else {
          newPage = nextPage++;
        }
        if (newPage < 1 || newPage > lastPage) {
          return;
        }
        newURL = document.URL.split('#')[0];
        if (newURL.indexOf('page=') >= 0) {
          newURL = newURL.replace(/page=(\d+)/i, "page=" + newPage);
        } else {
          newURL += "&page=" + newPage;
        }
        xhr = new XMLHttpRequest();
        xhr.open('GET', newURL, true);
        xhr.send();
        return xhr.onreadystatechange = function() {
          var newDoc, parser;
          if (xhr.readyState === 4) {
            parser = new DOMParser();
            newDoc = parser.parseFromString(xhr.responseText, 'text/html');
            parseRows(newDoc);
            return sortFunctions(sortIndex, true)(null);
          }
        };
      };
    };
    for (_j = 0, _len1 = pagenums.length; _j < _len1; _j++) {
      pagenum = pagenums[_j];
      if (pagenum.lastChild.href != null) {
        lastPage = pagenum.lastChild.href.match(/page=(\d+)/i);
        lastPage = lastPage != null ? parseInt(lastPage[1], 10) : 1;
      } else {
        lastPage = parseInt(pagenum.lastChild.textContent, 10);
        if (isNaN(lastPage)) {
          lastPage = 1;
        }
      }
      clonedNode = pagenum.parentNode.cloneNode(true);
      newPagenum = clonedNode.querySelector('div[class="pagenums"]');
      while (newPagenum.hasChildNodes()) {
        newPagenum.removeChild(newPagenum.lastChild);
      }
      a1 = document.createElement('a');
      a1.href = '#';
      a1.className = 'next-prev';
      a1.textContent = 'Load next page dynamically →';
      a2 = document.createElement('a');
      a2.href = '#';
      a2.className = 'next-prev';
      a2.textContent = '← Load previous page dynamically';
      newPagenum.appendChild(a2);
      newPagenum.appendChild(a1);
      a1.addEventListener('click', loadPage(false), true);
      a2.addEventListener('click', loadPage(true), true);
      pagenum.parentNode.parentNode.insertBefore(clonedNode, pagenum.parentNode.nextSibling);
    }
  }

}).call(this);

}

if((/^http.*:\/\/animebytes\.tv\/forums\.php/i.test(document.URL)) && !/action=viewthread/i.test(document.URL)){
// Generated by CoffeeScript 1.6.3
/*
// ==UserScript==
// @name        AnimeBytes - Forum Search - Enhancement
// @namespace   Megure@AnimeBytes.tv
// @description Load posts into search results; highlight search terms; filter authors; slide through posts
// @include     http*://animebytes.tv/forums.php*
// @exclude     *action=viewthread*
// @version     0.71
// @grant       GM_getValue
// @icon        http://animebytes.tv/favicon.ico
// ==/UserScript==
*/


(function() {
  var a, allResults, background_color, button, cb, filterPost, forumIds, forumid, getFirstTagParent, hideSubSelection, index, input, linkbox1, loadPost, loadText, loadThreadPage, loadingText, myCell, myLINK, newCheckbox, newLinkBox, patt, processThreadPage, quickLink, quickLinkSubs, result, sR, searchForums, searchForumsCB, searchForumsNew, showFastSearchLinks, showPost, strong, tP, textReplace, text_color, toggleText, toggleVisibility, user_filter, user_td, user_tr, workInForumSearch, workInRestOfForum, _i, _len;

  background_color = GM_getValue('ABForumSearchHighlightBG', '#FFC000');

  text_color = GM_getValue('ABForumSearchHighlightFG', '#000000');

  toggleText = GM_getValue('ABForumToggleText', '(Toggle)');

  loadText = GM_getValue('ABForumLoadText', '(Load)');

  loadingText = GM_getValue('ABForumLoadingText', '(Loading)');

  hideSubSelection = GM_getValue('ABForumSearchHideSubfor', 'true') === 'true';

  workInForumSearch = GM_getValue('ABForumSearchWorkInFS', 'true') === 'true' && document.URL.indexOf('action=search') >= 0;

  workInRestOfForum = GM_getValue('ABForumEnhWorkInRest', 'false') === 'true' && (document.URL.indexOf('action=viewforum') >= 0 || document.URL.indexOf('?') === -1);

  showFastSearchLinks = GM_getValue('ABForumEnhFastSearch', 'true') === 'true' && document.URL.indexOf('action=viewforum') >= 0;

  user_filter = [];

  sR = [];

  tP = [];

  cb = [];

  getFirstTagParent = function(elem, tag) {
    while (elem !== null && elem.tagName !== 'BODY' && elem.tagName !== tag) {
      elem = elem.parentNode;
    }
    if (elem === null || elem.tagName !== tag) {
      return null;
    } else {
      return elem;
    }
  };

  textReplace = function(elem) {
    var node, regExp, walk;
    if (patt !== '' && (background_color !== 'none' || text_color !== 'none')) {
      walk = document.createTreeWalker(elem, NodeFilter.SHOW_TEXT, null, false);
      node = walk.nextNode();
      regExp = new RegExp('(' + patt + ')', 'i');
      while (node != null) {
        node.textContent.replace(regExp, function(term) {
          var args, newSpan, newTextNode, offset;
          args = [].slice.call(arguments);
          offset = args[args.length - 2];
          newTextNode = node.splitText(offset);
          newTextNode.textContent = newTextNode.textContent.substr(term.length);
          newSpan = document.createElement('span');
          if (background_color !== 'none') {
            newSpan.style.backgroundColor = background_color;
          }
          if (text_color !== 'none') {
            newSpan.style.color = text_color;
          }
          newSpan.appendChild(document.createTextNode(term));
          node.parentNode.insertBefore(newSpan, newTextNode);
          return node = walk.nextNode();
        });
        node = walk.nextNode();
      }
    }
  };

  processThreadPage = function(id, threadid, page, parent, link) {
    return function() {
      var cell, linkbox, myColsp, nextPost, pagenums, post, prevPost, td, threadPage, tr, user_id, _i, _j, _k, _len, _len1, _ref, _ref1;
      threadPage = "threadid=" + threadid + "&page=" + page;
      link.textContent = toggleText;
      sR[id] = [];
      sR[id].parent = parent;
      sR[id].index = 0;
      sR[id].page = page;
      sR[id].threadid = threadid;
      _ref = tP[threadPage];
      for (_i = _j = 0, _len = _ref.length; _j < _len; _i = ++_j) {
        post = _ref[_i];
        if (post.id === id) {
          sR[id].index = _i;
        }
      }
      user_id = tP[threadPage][sR[id].index].className.split('_');
      user_id = user_id[user_id.length - 1];
      sR[id].user = tP[threadPage][sR[id].index].querySelector('a[href="/user.php?id=' + user_id + '"]').textContent;
      linkbox = document.createElement('div');
      pagenums = document.createElement('div');
      linkbox.className = 'linkbox';
      pagenums.className = 'pagenums';
      prevPost = document.createElement('a');
      nextPost = document.createElement('a');
      prevPost.href = '#';
      nextPost.href = '#';
      prevPost.className = 'page-link';
      nextPost.className = 'page-link';
      prevPost.textContent = '← Prev';
      nextPost.textContent = 'Next →';
      pagenums.appendChild(prevPost);
      pagenums.appendChild(nextPost);
      linkbox.appendChild(pagenums);
      prevPost.addEventListener('click', showPost(id, true), true);
      nextPost.addEventListener('click', showPost(id, false), true);
      tr = document.createElement('tr');
      td = document.createElement('td');
      myColsp = 0;
      _ref1 = parent.cells;
      for (_k = 0, _len1 = _ref1.length; _k < _len1; _k++) {
        cell = _ref1[_k];
        myColsp += cell.colSpan;
      }
      td.colSpan = myColsp;
      td.appendChild(linkbox);
      td.appendChild(tP[threadPage][sR[id].index]);
      tr.appendChild(td);
      sR[id].td = td;
      sR[id].parent.parentNode.insertBefore(tr, sR[id].parent.nextSibling);
    };
  };

  loadThreadPage = function(threadid, page) {
    var threadPage, xhr;
    threadPage = "threadid=" + threadid + "&page=" + page;
    tP[threadPage] = 'Loading';
    cb[threadPage] = [];
    xhr = new XMLHttpRequest();
    xhr.open('GET', "https://animebytes.tv/forums.php?action=viewthread&" + threadPage, true);
    xhr.send();
    xhr.onreadystatechange = function() {
      var callback, parser, post, _i, _j, _len, _len1, _ref, _ref1;
      if (xhr.readyState === 4) {
        parser = new DOMParser();
        tP[threadPage] = (parser.parseFromString(xhr.responseText, 'text/html')).querySelectorAll('div[id^="post"]');
        _ref = tP[threadPage];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          post = _ref[_i];
          textReplace(post);
        }
        _ref1 = cb[threadPage];
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          callback = _ref1[_j];
          callback();
        }
        return delete cb[threadPage];
      }
    };
  };

  loadPost = function(link, index, filtered) {
    return function(event) {
      var cell, id, match, newLink, node, page, threadPage, threadid;
      if (event != null) {
        event.stopPropagation();
        event.preventDefault();
      }
      newLink = link.previousSibling;
      cell = link.parentNode;
      node = getFirstTagParent(link, 'TR');
      threadid = link.href.match(/threadid=(\d+)/i);
      threadid = threadid != null ? threadid[1] : '0';
      match = link.href.match(/([^#]*)(?:#post(\d+))?/i);
      if (match != null) {
        id = match[2] != null ? 'post' + match[2] : id = index + link.href;
      } else {
        return;
      }
      if (id in sR) {
        if (filtered === true) {
          filterPost(id)();
        } else {
          toggleVisibility(id);
        }
      } else {
        page = link.href.match(/page=(\d+)/i);
        page = page != null ? parseInt(page[1], 10) : 1;
        link.previousSibling.textContent = loadingText;
        threadPage = "threadid=" + threadid + "&page=" + page;
        if (threadPage in tP) {
          if (tP[threadPage] === 'Loading') {
            cb[threadPage].push(processThreadPage(id, threadid, page, node, newLink));
            if (filtered === true) {
              cb[threadPage].push(filterPost(id));
            }
          } else {
            processThreadPage(id, threadid, page, node, newLink)();
            if (filtered === true) {
              filterPost(id)();
            }
          }
        } else {
          loadThreadPage(threadid, page);
          cb[threadPage].push(processThreadPage(id, threadid, page, node, newLink));
          if (filtered === true) {
            cb[threadPage].push(filterPost(id));
          }
        }
      }
    };
  };

  toggleVisibility = function(id) {
    var elem;
    elem = sR[id];
    if (elem.td.parentNode.style.visibility === 'collapse') {
      showPost(id, null)();
      return elem.td.parentNode.style.visibility = 'visible';
    } else {
      return elem.td.parentNode.style.visibility = 'collapse';
    }
  };

  showPost = function(id, prev) {
    return function(event) {
      var elem, nextTP, prevTP, threadPage;
      elem = sR[id];
      threadPage = "threadid=" + elem.threadid + "&page=" + elem.page;
      nextTP = "threadid=" + elem.threadid + "&page=" + (elem.page + 1);
      prevTP = "threadid=" + elem.threadid + "&page=" + (elem.page - 1);
      if (event != null) {
        event.stopPropagation();
        event.preventDefault();
      }
      if (prev === true) {
        if (elem.index === 0 && elem.page > 1) {
          if (prevTP in tP) {
            if (tP[prevTP] === 'Loading') {
              cb[prevTP].push(showPost(id, prev));
            } else {
              elem.page = elem.page - 1;
              elem.index = tP[prevTP].length - 1;
              elem.td.replaceChild(tP[prevTP][elem.index], elem.td.lastChild);
            }
          } else {
            loadThreadPage(elem.threadid, elem.page - 1);
            cb[prevTP].push(showPost(id, prev));
          }
        } else {
          elem.index = Math.max(elem.index - 1, 0);
          if (elem.td.children.length === 2) {
            elem.td.replaceChild(tP[threadPage][elem.index], elem.td.lastChild);
          } else {
            elem.td.appendChild(tP[threadPage][elem.index]);
          }
        }
      } else if (prev === false) {
        if (elem.index === 24) {
          if (nextTP in tP) {
            if (tP[nextTP] === 'Loading') {
              cb[prevTP].push(showPost(id, prev));
            } else {
              if (tP[nextTP].length > 0) {
                elem.page = elem.page + 1;
                elem.index = 0;
                elem.td.replaceChild(tP[nextTP][0], elem.td.lastChild);
              }
            }
          } else {
            loadThreadPage(elem.threadid, elem.page + 1);
            cb[nextTP].push(showPost(id, prev));
          }
        } else {
          elem.index = Math.min(elem.index + 1, tP[threadPage].length - 1);
          if (elem.td.children.length === 2) {
            elem.td.replaceChild(tP[threadPage][elem.index], elem.td.lastChild);
          } else {
            elem.td.appendChild(tP[threadPage][elem.index]);
          }
        }
      } else {
        if (elem.td.children.length === 2) {
          elem.td.replaceChild(tP[threadPage][elem.index], elem.td.lastChild);
        } else {
          elem.td.appendChild(tP[threadPage][elem.index]);
        }
      }
    };
  };

  filterPost = function(id) {
    return function() {
      var elem, toFilter, user_name, _i, _len;
      elem = sR[id];
      toFilter = true;
      for (_i = 0, _len = user_filter.length; _i < _len; _i++) {
        user_name = user_filter[_i];
        if (elem.user.toUpperCase() === user_name.toUpperCase()) {
          toFilter = false;
          break;
        }
      }
      if (toFilter) {
        elem.td.parentNode.style.visibility = 'collapse';
        elem.parent.style.visibility = 'collapse';
      }
    };
  };

  if (workInRestOfForum || workInForumSearch) {
    patt = document.querySelector('form[action=""] input[name="search"]');
    if (patt != null) {
      patt = patt.value.trim().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&').replace(/\s+/g, '|');
    } else {
      patt = '';
    }
    allResults = document.querySelectorAll('a[href^="/forums.php?action=viewthread"]');
    for (index = _i = 0, _len = allResults.length; _i < _len; index = ++_i) {
      result = allResults[index];
      textReplace(result);
      a = document.createElement('a');
      a.href = '#';
      a.textContent = loadText;
      a.addEventListener('click', loadPost(result, index, false), true);
      myCell = result.parentNode;
      myCell.insertBefore(a, result);
    }
  }

  if (workInForumSearch) {
    user_tr = document.createElement('tr');
    user_td = [];
    user_td.push(document.createElement('td'));
    user_td.push(document.createElement('td'));
    user_td[0].className = 'label';
    strong = document.createElement('strong');
    strong.textContent = 'Filter author(s):';
    user_td[0].appendChild(strong);
    input = document.createElement('input');
    input.placeholder = 'Comma- or space-separated list of authors';
    input.size = '64';
    button = document.createElement('button');
    button.textContent = 'Filter';
    button.type = 'button';
    user_td[1].appendChild(input);
    user_td[1].appendChild(button);
    user_tr.appendChild(user_td[0]);
    user_tr.appendChild(user_td[1]);
    searchForums = document.querySelector('select[name="forums[]"]').parentNode.parentNode;
    searchForums.parentNode.insertBefore(user_tr, searchForums);
    button.addEventListener('click', function(event) {
      var userName, _j, _len1, _results;
      if (input.value.replace(/[,\s]/g, '') !== '') {
        user_filter = (function() {
          var _j, _len1, _ref, _results;
          _ref = input.value.trim().replace(/[,\s]+/g, ',').split(',');
          _results = [];
          for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
            userName = _ref[_j];
            _results.push(userName.trim());
          }
          return _results;
        })();
        button.disabled = 'disabled';
        _results = [];
        for (index = _j = 0, _len1 = allResults.length; _j < _len1; index = ++_j) {
          result = allResults[index];
          _results.push(loadPost(result, index, true)());
        }
        return _results;
      }
    }, true);
    if (hideSubSelection) {
      searchForumsNew = searchForums.cloneNode(true);
      searchForums.style.visibility = 'collapse';
      searchForumsCB = searchForumsNew.cells[1];
      while (searchForumsCB.hasChildNodes()) {
        searchForumsCB.removeChild(searchForumsCB.lastChild);
      }
      newCheckbox = document.createElement('input');
      newCheckbox.type = 'checkbox';
      searchForumsCB.appendChild(newCheckbox);
      searchForumsCB.appendChild(document.createTextNode(' Show forum selection: select (sub-) forums to search in.'));
      searchForums.parentNode.insertBefore(searchForumsNew, searchForums);
      newCheckbox.addEventListener('change', function(event) {
        searchForums.style.visibility = 'visible';
        return searchForumsNew.style.visibility = 'collapse';
      }, true);
    }
  }

  if (showFastSearchLinks) {
    forumid = document.URL.match(/forumid=(\d+)/i);
    if (forumid != null) {
      forumid = parseInt(forumid[1], 10);
      quickLink = document.createElement('a');
      quickLink.textContent = ' [Search this forum] ';
      quickLink.href = "/forums.php?action=search&forums[]=" + forumid;
      linkbox1 = document.querySelector('div.linkbox');
      newLinkBox = linkbox1.cloneNode(true);
      while (newLinkBox.hasChildNodes()) {
        newLinkBox.removeChild(newLinkBox.lastChild);
      }
      linkbox1.parentNode.insertBefore(newLinkBox, linkbox1);
      newLinkBox.appendChild(quickLink);
      forumIds = document.querySelectorAll('table a[href^="/forums.php?action=viewforum&forumid="]');
      forumIds = (function() {
        var _j, _len1, _results;
        _results = [];
        for (_j = 0, _len1 = forumIds.length; _j < _len1; _j++) {
          myLINK = forumIds[_j];
          _results.push(parseInt((myLINK.href.match(/forumid=(\d*)/i))[1], 10));
        }
        return _results;
      })();
      if (forumIds.length > 0) {
        forumIds.push(forumid);
        quickLinkSubs = document.createElement('a');
        quickLinkSubs.textContent = ' [Search this forum and all direct subforums] ';
        quickLinkSubs.href = "/forums.php?action=search&forums[]=" + forumIds.join('&forums[]=');
        newLinkBox.appendChild(quickLinkSubs);
      }
    }
  }

}).call(this);

}
// Add settings
if(/\/user\.php\?.*action=edit/i.test(document.URL)){
    (function(){
    function addBooleanSetting(key, name, description, onValue, offValue, myDefault){

      var __temp = document.createElement('li');
      __temp.className = '';
      __temp.innerHTML = "<span class='ue_left strong'>" + name + "</span><span class='ue_right'><input id='Setting_" + key + "' name='Setting_" + key + "' type='checkbox'" + (GM_getValue(key, myDefault).toString() === onValue.toString() ? " checked='checked'" : "") + "> <label for='Setting_" + key + "'>" + description + "</label></span>";
      __temp.addEventListener('change', function(ev){var ch = ev.target.checked; (ch === true ? GM_setValue(key, onValue) : GM_setValue(key, offValue));});
      document.getElementById('pose_list').appendChild(__temp);
    
}

function addColorSetting(key, name, description, myDefault, deactivatable, deactiveDefault){

      var __temp = document.createElement('li');
      __temp.className = '';
      __temp.innerHTML = "<span class='ue_left strong'>" + name + "</span><span class='ue_right'>" +
    (deactivatable.toString() === 'true' ? "<input id='ColorCheckBox_" + key + "' type='checkbox' " +
		  (GM_getValue(key, myDefault).toString() !== deactiveDefault.toString() ? "checked='checked'" : "") +
    ">" : "") +
    " <input id='Setting_" + key + "' name='Setting_" + key + "' type='color' value='" + (GM_getValue(key, myDefault).toString() === deactiveDefault.toString() ? myDefault : GM_getValue(key, myDefault)) + "'>" +
    " <button type='button'>Reset</button> <label for='Setting_" + key + "'>" + description + "</label></span>";
      __temp.addEventListener('change', function(e){var a = e.target;
		  if(a.type === "checkbox"){ a.checked === false ? GM_setValue(key, deactiveDefault) : GM_setValue(key, document.getElementById('Setting_' + key).value) }
		  else if(a.type === "color"){ GM_setValue(key, a.value); document.getElementById('ColorCheckBox_' + key).checked = true; }
    });
__temp.addEventListener('click', function(e){var a = e.target;
		  if(a.type === "button"){
		  	GM_setValue(key, myDefault);
		  	document.getElementById('ColorCheckBox_' + key).checked = true;
		  	document.getElementById('Setting_' + key).value = myDefault;
		  }
    });
      document.getElementById('pose_list').appendChild(__temp);
    
}

function addTextSetting(key, name, description, myDefault, maxLength){

      var __temp = document.createElement('li');
      __temp.className = '';
      __temp.innerHTML = "<span class='ue_left strong'>" + name + "</span><span class='ue_right'><input id='Setting_" + key + "' name='Setting_" + key + "' type='text' maxlength='" + maxLength + "' value='" + GM_getValue(key, myDefault) + "'> <label for='Setting_" + key + "'>" + description + "</label></span>";
      __temp.addEventListener('keyup', function(e){var a = e.target;
		  if(a.type === "text"){ GM_setValue(key, a.value); }});
      document.getElementById('pose_list').appendChild(__temp);
    
}

    
	document.getElementById('pose_list').appendChild(document.createElement('hr'));
	addBooleanSetting('ABTorrentsShowYen', 'Show Yen production', 'Show Yen production for torrents, with detailed information when hovered.', 'true', 'false', 'true');
	addBooleanSetting('ABTorrentsReqTime', 'Show required seeding time', 'Shows minimal required seeding time for torrents in their description and when size is hovered.', 'true', 'false', 'true');
	document.getElementById('pose_list').appendChild(document.createElement('hr'));
	addBooleanSetting('ABHistColorRows', 'Color history', 'Color rows in your history according to H&R status. (Choose colors below.)', 'true', 'false', 'true');
	addColorSetting('ABHistColorPosBG', 'Color for non-H&Rs', 'Background color for torrents in your history that are no Hit & Runs.', '#B0F0B0', 'true', 'none');
	addColorSetting('ABHistColorPosFG', 'Color for non-H&Rs', 'Text color for torrents in your history that are no Hit & Runs.', '#000000', 'true', 'none');
	addColorSetting('ABHistColorNeuBG', 'Color for partial downloads', 'Background color for torrents in your history with less than 10% download.', '#F0F0B0', 'true', 'none');
	addColorSetting('ABHistColorNeuFG', 'Color for partial downloads', 'Text color for torrents in your history with less than 10% download.', '#000000', 'true', 'none');
	addColorSetting('ABHistColorNegBG', 'Color for potential H&R', 'Background color for torrents where you have not seeded enough yet.', '#F0B0B0', 'true', 'none');
	addColorSetting('ABHistColorNegFG', 'Color for potential H&R', 'Text color for torrents where you have not seeded enough yet.', '#000000', 'true', 'none');
	addBooleanSetting('ABHistSortRows', 'Sorting of history', 'Sort your history pages for any column (seed-time column is sorted for remaining required seed-time).', 'true', 'false', 'true');
	addBooleanSetting('ABHistDynLoad', 'Load history pages', 'Add buttons to dynamically load more pages into your history tables.', 'true', 'false', 'true');
	document.getElementById('pose_list').appendChild(document.createElement('hr'));
	addBooleanSetting('ABForumEnhFastSearch', 'Create links to search forums', 'Add links to search forums (including or excluding direct subforums) at the top of a forums page.', 'true', 'false', 'true');
	addBooleanSetting('ABForumSearchWorkInFS', 'Load posts into search results', 'Allows you to load posts and threads into search results, slide through posts and filter for authors.', 'true', 'false', 'true');
	addBooleanSetting('ABForumSearchHideSubfor', 'Hide subforum selection in search', 'This will hide the subforum selection in the search until a checkbox is clicked.', 'true', 'false', 'true');
	addColorSetting('ABForumSearchHighlightBG', 'Color for search terms', 'Background color for search terms within posts and headers.', '#FFC000', 'true', 'none');
	addColorSetting('ABForumSearchHighlightFG', 'Color for search terms', 'Text color for search terms within posts and headers.', '#000000', 'true', 'none');
	addBooleanSetting('ABForumEnhWorkInRest', 'Load posts into forum view', 'Allows you to load posts and threads into the general forum view.', 'true', 'false', 'false');
	addTextSetting('ABForumLoadText', 'Text for links to be loaded', 'The text to be shown for forum links that have not been loaded yet.', '(Load)', '10');
	addTextSetting('ABForumLoadingText', 'Text for loading links', 'The text to be shown for forum links that are currently being loaded.', '(Loading)', '10');
	addTextSetting('ABForumToggleText', 'Text for loaded links', 'The text to be shown for forum links that have been loaded and can now be toggled.', '(Toggle)', '10');

    }).call(this);
}

