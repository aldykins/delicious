// ==UserScript==
// @name AnimeBytes delicious user scripts
// @author aldy, potatoe, alpha
// @version 1.4
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
	addCheckbox("Delicious Title Flip", "Enable/Disable delicious flipping of Forum title tags.", 'delicioustitleflip');
	addCheckbox("Disgusting Treats", "Hide/Unhide those hideous treats!", 'delicioustreats');
	addCheckbox("Delicious Keyboard Shortcuts", "Enable/Disable delicious keyboard shortcuts for easier access to Bold/Italics/Underline and aligning.", 'deliciouskeyboard');
}

if (window.location.pathname === '/user.php' && window.location.search.indexOf('action=edit') > -1) createSettingsPage();


// A couple GM variables that need initializing
var gm_delicioussmileys = initGM('delicioussmileys', 'true', false);
var gm_deliciousbbcode = initGM('deliciousbbcode', 'true', false);
var gm_deliciousquote = initGM('deliciousquote', 'true', false);
var gm_delicioustitleflip = initGM('delicioustitleflip', 'true', false);
var gm_delicioustreats = initGM('delicioustreats', 'true', false);
var gm_deliciouskeyboard = initGM('deliciouskeyboard', 'true', false);


// Banners and search bar by Potatoe
// Fixes the placement of the search bars when a banner is in use.
if (document.getElementById('bannerimg')) document.getElementById('searchbars').children[0].style.top = '-258px';


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


// Better quote by Potatoe
// Makes the quoting feature on AnimeBytes better by including links back to posts and the posted date.
// Depends on injectScript
if (GM_getValue('deliciousquote') === 'true') {
	function Quote(postid, username, surround) {
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
				var date = document.evaluate("//div[@id='post"+postid+"']/div/div/p[@class='posted_info']/span", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
				if (date) {
					date = new Date(date.title.replace(/-/g,'/')).toUTCString().substring(5, 25).split(' ');
					date = date[1]+" "+date[0]+" "+date[2]+", "+date[3].substring(0,5);
				} else { date = ""; }
				var userid = document.evaluate("//span/a[text()='"+username+"' and starts-with(@href, '/user.php?id=')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.href;
				var quoteText = '[b][user=' + userid + ']' + username + '[/user][/b] [url=' + window.location.pathname + window.location.search + '#post' + postid + ']wrote' + ((date)?' on '+date:'') + '[/url]:\n[quote]' + response + '[/quote]\n';
				if (surround && surround.length > 0) quoteText = '[' + surround + ']' + quoteText + '[/' + surround + ']';
				insert_text(quoteText, '');
			},
			error: function () {
				insert_text("error retrieving post", '');
			},
			dataType: 'html'
		});
	}
	injectScript(Quote, 'BetterQuote');
}


// Forums title inverter by Potatoe
// Inverts the forums titles.
if (GM_getValue('delicioustitleflip') === 'true' && document.title.indexOf(' > ') > -1) document.title = document.title.split(" :: ")[0].split(" > ").reverse().join(" < ") + " :: AnimeBytes";


// Hide treats by Alpha
// Hide treats on profile.
if (GM_getValue('delicioustreats') === 'true') {
	var treatsnode = document.evaluate('//*[@id="user_leftcol"]/div[@class="box" and div[@class="head" and .="Treats"]]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
	if (treatsnode) treatsnode.style.display = "none";
}


// Keyboard shortcuts by Alpha
// Enables keyboard shortcuts for forum (new post and edit) and PM
// Depends on injectScript
if (GM_getValue('deliciouskeyboard') === 'true' && (document.getElementById('quickpost') || document.evaluate('//*[@class="post"/form/textarea', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null))) {
	function keyboardshortcuts() {
		var ctrl = function(key, callback, args) {
			document.addEventListener('keydown', function (e) {
				if(!args) args=[];
				if(e.keyCode === key.charCodeAt(0) && (e.ctrlKey || e.metaKey) && (document.activeElement === document.getElementById('quickpost') || document.activeElement === document.evaluate('//*[@class="post"/form/textarea', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue)) {
					e.preventDefault();
					callback.apply(this, args);
					return false;
				}
			});
		};
		/**
		 * All keyboard shortcuts based on MS Word
		 **/

		// Bold
		var ctrlorcmd = (navigator.appVersion.indexOf('Mac') != -1) ? '&#8984;' : 'CTRL';
		document.evaluate('//*[@id="bbcode"]/img[@title="Bold"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.setAttribute('title', 'Bold (' + ctrlorcmd + '+B)');
		ctrl('B', insert_text, ['[b]', '[/b]']);
		// Italics
		document.evaluate('//*[@id="bbcode"]/img[@title="Italics"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.setAttribute('title', 'Italics (' + ctrlorcmd + '+I)');
		ctrl('I', insert_text, ['[i]', '[/i]']);
		// Underline
		document.evaluate('//*[@id="bbcode"]/img[@title="Underline"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.setAttribute('title', 'Underline (' + ctrlorcmd + '+U)');
		ctrl('U', insert_text, ['[u]', '[/u]']);
		// Align right
		ctrl('R', insert_text, ['[align=right]', '[/align]']);
		// Align left
		ctrl('L', insert_text, ['[align=left]', '[/align]']);
		// Align center
		ctrl('E', insert_text, ['[align=center]', '[/align]']);
	}
	injectScript('('+keyboardshortcuts+')();', 'keyboardshortcuts');
}
