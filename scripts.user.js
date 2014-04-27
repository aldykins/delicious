// ==UserScript==
// @name AB delicious user scripts
// @author Compiled and in some cases ported by aldy, mostly written by potatoe
// @version 1.1
// @description Variety of userscripts to fully utilise the site and stylesheet.
// @include *animebytes.tv/*
// @icon http://animebytes.tv/favicon.ico
// ==/UserScript==

// Banners and search bar by Potatoe
// Fixes the placement of the search bars when a banner is in use.
if (document.getElementById('bannerimg')) document.getElementById('searchbars').children[0].style.top = '-258px';

// Hover smileys by Potatoe, ported by aldy
// Hides smileys behind one button that shows them all on hover.
function injectScript (content, id) {
	var script = document.createElement('script');
	if (id) script.setAttribute('id', id);
	script.textContent = content.toString();
	document.body.appendChild(script);
	return script;
}

if (document.getElementById('smileys')) {
	var smileys = document.getElementById('smileys'), nodearray = smileys.getElementsByTagName('*'), r = '';
	for (var i=0; n=nodearray[i]; i++) {
		var c = n.getAttribute('onclick');
		n.removeAttribute('onclick');
		n.setAttribute('style',((n.width>33)?'margin-left:'+(33-n.width)/2+'px;':'')+'margin-top:'+(33-n.height)/2+'px;');
		r += '<div class="smileyscell" onclick="'+c+'">'+n.outerHTML+'</div>';
	}
	smileys.innerHTML = r;

	smileys.setAttribute('style', 'display: none; width: 350px !important; position: fixed; top: 0; left: 0;');
    smileys.setAttribute('id', 'hsmileys')

	smileysbutton = smileys.firstElementChild.cloneNode();
	smileysbutton.innerHTML = smileys.firstElementChild.innerHTML;
	smileysbutton.setAttribute('id','smileysbutton');
	smileysbutton.setAttribute('style','width: 20px !important; height: 20px !important;');

	document.getElementById('bbcode').innerHTML += '<span style="display:inline-block;width:20px;height:20px;z-index:1;position:relative" id="smileysholdster"><style>.smileyscell{display:inline-block;overflow:hidden;width:33px;max-width:33px;height:33px;background:rgba(0,0,0,0.75);float:left}#smileysbutton img[src="/static/common/smileys/Smile.png"]{margin-top:0px!important}</style><div id="smileysblank" style="width: 35px; height: 35px; display: none;"></div>'+smileysbutton.outerHTML+'</div>'

	document.getElementById('smileysholdster').appendChild(smileys);

	injectScript('('+function(){
		$('#smileysholdster').hover(function(){
                $('#hsmileys').css({'position':'fixed', 'top':'0', 'left':'0'});
                $('#hsmileys').offset($('#smileysbutton').offset());
                $('#hsmileys').show();
            }, function(){ $('#hsmileys').hide(); });
	}.toString()+')();', 'hoversmiley');
}

// [hide] button by Potatoe
// Adds a button that inserts the [hide] BBCode into the text field.
var spoilersnode = document.evaluate("//img[@title='Spoilers']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
if (spoilersnode) {
var hideimg = document.createElement('img');
hideimg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAotJREFUeNpiYWBgaGCgImDBJaHqp6co76CmLaAkosjGw84PEvv15efHD/fe3H908PbVWxsv3semjxHdhZLGciKm+U7evDICCvhc8vnJhwenJ+7b+vzsozfI4sxA7ADjqHjryFtXeSRwCHIJE/IaOx+HgLyjmsGP998ev7v96iOGl0EuM8l1iGRiZWYD8b+9+vz83Z3X95ANYeVi4xDRlNBmZmfhAPFBakF6vr74NAfmUrCBjIyMDOYlLv7MbCzsMM1XV5zZc2vDxXvoLuOW4Ntj1+DjK6QmpgX2IlAPSO/GqPlz////D/GyWoC+koKzhi2yxv9//39RcFJX0ou3sFYPNNBX9tBWZ2Jh+vHizKPXz888vKcRbGgDUwuMNL4fH78/fnvj5XuwC+XtVbXRXSJjpWSNLsYvL6QEdHUn0Is/QEHCJcYrCZMDmQHyERNYoaKIIsnpjZOVA8UyqBksMCcTMuDT4/f3Hu67eRbEFtWVEmTj5RBEloeZwQIJr39/GZmYmdENeXLs3tGDNZv2oIubZDu44M0pv77+/MwhgDvtAWOWQ9pCUQqYZCSBtDG660Dg99efn+AGfnn28Sk+A0GGmeY5xhIIksfgtAkiHu6/dQmbIlBCBiUpkMsIhfGDfTcvwV14c92Fuxohhk+4xflkkBUJKosocQpzC7Kws3DiM+zry09Pbq2/eBfuQlAKP9mzZ+PfX39+Iit8dfnZtc3xCxeDcg0uw0B6Tvbt3QgyA24gCIDy4pnJB5b/+/33F7FpEaQWpOf56Ydv8BZfoLyJ7n1s3gT5Cr34YsRWYoMKC7VAfWU5WxUtUAHLys3O///fv7+gAvbTw3ePHh2+cw0UZjBvEjSQEgAQYABZyQWIL1ugrwAAAABJRU5ErkJggg==";
hideimg.title = hideimg.alt="Hide";
hideimg.setAttribute('onclick', "insert_text('[hide]', '[/hide]')");
spoilersnode.parentNode.insertBefore(hideimg, spoilersnode.nextSibling);
spoilersnode.insertAdjacentHTML('afterend', '\n');
}

// [url] and [quote] buttons by aldy
// Edits the [url] and [quote] BBCode buttons. 
urlnode=document.evaluate("//img[@title='URL']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
urlnode.setAttribute('onclick', "insert_text('[url]', '[/url]')");

quotenode=document.evaluate("//img[@title='Quote']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
quotenode.setAttribute('onclick', "insert_text('[quote]', '[/quote]')");

// Better quote by Potatoe
// Makes the quoting feature on AnimeBytes better by including links back to posts and the posted date.
function injectScript (content, id) {
	var script = document.createElement('script');
	if (id) script.setAttribute('id', id);
	script.textContent = content.toString();
	document.body.appendChild(script);
	return script;
}

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

// Forums title inverter by Potatoe
// Inverts the forums titles.
var otitle=document.title.split(" :: ")[0].split(" > ");
var ntitle="";
for (var i=otitle.length-1; i>=0; i--) {
	ntitle+=otitle[i]+" < ";
}
document.title=ntitle.substring(0, ntitle.length-2)+":: AnimeBytes";

// Hide treats by Alpha
// Hide treats on profile.
var hideTreats = function() {
  jQuery('#user_leftcol > div.box > div.head:contains("Treats")').parent().hide();
}
var script = document.createElement("script");
script.textContent = "(" + hideTreats.toString() + ")();";
document.body.appendChild(script);