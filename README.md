<html xmlns="http://www.w3.org/1999/xhtml"><script>
(function() {
    const FLASH_MIMETYPE = "application/x-shockwave-flash";
    const FUTURESPLASH_MIMETYPE = "application/futuresplash";
    const FLASH7_AND_8_MIMETYPE = "application/x-shockwave-flash2-preview";
    const FLASH_MOVIE_MIMETYPE = "application/vnd.adobe.flash.movie";
    const FLASH_ACTIVEX_CLASSID = "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000";

    class RuffleMimeTypeArray {
        constructor(mimeTypes) {
            this.__mimeTypes = [];
            this.__namedMimeTypes = {};
            if (mimeTypes) {
                for (let i = 0; i < mimeTypes.length; i++) {
                    this.install(mimeTypes[i]);
                }
            }
        }
        install(mimeType) {
            const index = this.__mimeTypes.length;
            this.__mimeTypes.push(mimeType);
            this.__namedMimeTypes[mimeType.type] = mimeType;
            this[mimeType.type] = mimeType;
            this[index] = mimeType;
        }
        item(index) {
            // This behavior is done to emulate a 32-bit uint,
            // which browsers use.
            return this.__mimeTypes[index >>> 0];
        }
        namedItem(name) {
            return this.__namedMimeTypes[name];
        }
        get length() {
            return this.__mimeTypes.length;
        }
        [Symbol.iterator]() {
            return this.__mimeTypes[Symbol.iterator]();
        }
    }
    class RufflePlugin extends RuffleMimeTypeArray {
        constructor(name, description, filename) {
            super();
            this.name = name;
            this.description = description;
            this.filename = filename;
        }
    }
    class RufflePluginArray {
        constructor(plugins) {
            this.__plugins = [];
            this.__namedPlugins = {};
            for (let i = 0; i < plugins.length; i++) {
                this.install(plugins[i]);
            }
        }
        install(plugin) {
            const index = this.__plugins.length;
            this.__plugins.push(plugin);
            this.__namedPlugins[plugin.name] = plugin;
            this[plugin.name] = plugin;
            this[index] = plugin;
        }
        item(index) {
            // This behavior is done to emulate a 32-bit uint,
            // which browsers use. Cloudflare's anti-bot
            // checks rely on this.
            return this.__plugins[index >>> 0];
        }
        namedItem(name) {
            return this.__namedPlugins[name];
        }
        refresh() {
            // Nothing to do, we just need to define the method.
        }
        [Symbol.iterator]() {
            return this.__plugins[Symbol.iterator]();
        }
        get length() {
            return this.__plugins.length;
        }
    }
    /**
     * A fake plugin designed to trigger Flash detection scripts.
     */
    const FLASH_PLUGIN = new RufflePlugin("Shockwave Flash", "Shockwave Flash 32.0 r0", "ruffle.js");
    /**
     * A fake plugin designed to allow early detection of if the Ruffle extension is in use.
     */
    const RUFFLE_EXTENSION = new RufflePlugin("Ruffle Extension", "Ruffle Extension", "ruffle.js");
    FLASH_PLUGIN.install({
        type: FUTURESPLASH_MIMETYPE,
        description: "Shockwave Flash",
        suffixes: "spl",
        enabledPlugin: FLASH_PLUGIN,
    });
    FLASH_PLUGIN.install({
        type: FLASH_MIMETYPE,
        description: "Shockwave Flash",
        suffixes: "swf",
        enabledPlugin: FLASH_PLUGIN,
    });
    FLASH_PLUGIN.install({
        type: FLASH7_AND_8_MIMETYPE,
        description: "Shockwave Flash",
        suffixes: "swf",
        enabledPlugin: FLASH_PLUGIN,
    });
    FLASH_PLUGIN.install({
        type: FLASH_MOVIE_MIMETYPE,
        description: "Shockwave Flash",
        suffixes: "swf",
        enabledPlugin: FLASH_PLUGIN,
    });
    RUFFLE_EXTENSION.install({
        type: "",
        description: "Ruffle Detection",
        suffixes: "",
        enabledPlugin: RUFFLE_EXTENSION,
    });
    function installPlugin(plugin) {
        if (!("install" in navigator.plugins) || !navigator.plugins["install"]) {
            Object.defineProperty(navigator, "plugins", {
                value: new RufflePluginArray(navigator.plugins),
                writable: false,
            });
        }
        const plugins = navigator.plugins;
        plugins.install(plugin);
        if (plugin.length > 0 &&
            (!("install" in navigator.mimeTypes) || !navigator.mimeTypes["install"])) {
            Object.defineProperty(navigator, "mimeTypes", {
                value: new RuffleMimeTypeArray(navigator.mimeTypes),
                writable: false,
            });
        }
        const mimeTypes = navigator.mimeTypes;
        for (let i = 0; i < plugin.length; i += 1) {
            mimeTypes.install(plugin[i]);
        }
    }

    installPlugin(FLASH_PLUGIN);
    installPlugin(RUFFLE_EXTENSION);
})();
</script><script>
    window[Symbol.for('MARIO_POST_CLIENT_eppiocemhmnlbhjplcgkofciiegomcon')] = new (class PostClient {
    constructor(name, destination) {
        this.name = name;
        this.destination = destination;
        this.serverListeners = {};
        this.bgRequestsListeners = {};
        this.bgEventsListeners = {};
        window.addEventListener('message', (message) => {
            const data = message.data;
            const isNotForMe = !(data.destination && data.destination === this.name);
            const hasNotEventProp = !data.event;
            if (isNotForMe || hasNotEventProp) {
                return;
            }
            if (data.event === 'MARIO_POST_SERVER__BG_RESPONSE') {
                const response = data.args;
                if (this.hasBgRequestListener(response.requestId)) {
                    try {
                        this.bgRequestsListeners[response.requestId](response.response);
                    }
                    catch (e) {
                        console.log(e);
                    }
                    delete this.bgRequestsListeners[response.requestId];
                }
            }
            else if (data.event === 'MARIO_POST_SERVER__BG_EVENT') {
                const response = data.args;
                if (this.hasBgEventListener(response.event)) {
                    try {
                        this.bgEventsListeners[data.id](response.payload);
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
            }
            else if (this.hasServerListener(data.event)) {
                try {
                    this.serverListeners[data.event](data.args);
                }
                catch (e) {
                    console.log(e);
                }
            }
            else {
                console.log(`event not handled: ${data.event}`);
            }
        });
    }
    emitToServer(event, args) {
        const id = this.generateUIID();
        const message = {
            args,
            destination: this.destination,
            event,
            id,
        };
        window.postMessage(message, location.origin);
        return id;
    }
    emitToBg(bgEventName, args) {
        const requestId = this.generateUIID();
        const request = { bgEventName, requestId, args };
        this.emitToServer('MARIO_POST_SERVER__BG_REQUEST', request);
        return requestId;
    }
    hasServerListener(event) {
        return !!this.serverListeners[event];
    }
    hasBgRequestListener(requestId) {
        return !!this.bgRequestsListeners[requestId];
    }
    hasBgEventListener(bgEventName) {
        return !!this.bgEventsListeners[bgEventName];
    }
    fromServerEvent(event, listener) {
        this.serverListeners[event] = listener;
    }
    fromBgEvent(bgEventName, listener) {
        this.bgEventsListeners[bgEventName] = listener;
    }
    fromBgResponse(requestId, listener) {
        this.bgRequestsListeners[requestId] = listener;
    }
    generateUIID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }
})('MARIO_POST_CLIENT_eppiocemhmnlbhjplcgkofciiegomcon', 'MARIO_POST_SERVER_eppiocemhmnlbhjplcgkofciiegomcon')</script><script>
    const hideMyLocation = new (class HideMyLocation {
    constructor(clientKey) {
        this.clientKey = clientKey;
        this.watchIDs = {};
        this.client = window[Symbol.for(clientKey)];
        const getCurrentPosition = navigator.geolocation.getCurrentPosition;
        const watchPosition = navigator.geolocation.watchPosition;
        const clearWatch = navigator.geolocation.clearWatch;
        const self = this;
        navigator.geolocation.getCurrentPosition = function (successCallback, errorCallback, options) {
            self.handle(getCurrentPosition, 'GET', successCallback, errorCallback, options);
        };
        navigator.geolocation.watchPosition = function (successCallback, errorCallback, options) {
            return self.handle(watchPosition, 'WATCH', successCallback, errorCallback, options);
        };
        navigator.geolocation.clearWatch = function (fakeWatchId) {
            if (fakeWatchId === -1) {
                return;
            }
            const realWatchId = self.watchIDs[fakeWatchId];
            delete self.watchIDs[fakeWatchId];
            return clearWatch.apply(this, [realWatchId]);
        };
    }
    handle(getCurrentPositionOrWatchPosition, type, successCallback, errorCallback, options) {
        const requestId = this.client.emitToBg('HIDE_MY_LOCATION__GET_LOCATION');
        let fakeWatchId = this.getRandomInt(0, 100000);
        this.client.fromBgResponse(requestId, (response) => {
            if (response.enabled) {
                if (response.status === 'SUCCESS') {
                    const position = this.map(response);
                    successCallback(position);
                }
                else {
                    const error = this.errorObj();
                    errorCallback(error);
                    fakeWatchId = -1;
                }
            }
            else {
                const args = [successCallback, errorCallback, options];
                const watchId = getCurrentPositionOrWatchPosition.apply(navigator.geolocation, args);
                if (type === 'WATCH') {
                    this.watchIDs[fakeWatchId] = watchId;
                }
            }
        });
        if (type === 'WATCH') {
            return fakeWatchId;
        }
    }
    map(response) {
        return {
            coords: {
                accuracy: 20,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                latitude: response.latitude,
                longitude: response.longitude,
                speed: null,
            },
            timestamp: Date.now(),
        };
    }
    errorObj() {
        return {
            code: 1,
            message: 'User denied Geolocation',
        };
    }
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
})('MARIO_POST_CLIENT_eppiocemhmnlbhjplcgkofciiegomcon')
  </script><head><script src="chrome-extension://fdjamakpfbbddfjaooikfcpapjohcfmg/content/pageScripts/dashlane-webauthn-page-script.js" id="dashlane_webauthn" name="forward_webauthn_ready"></script><script src="//archive.org/includes/analytics.js?v=cf34f82" type="text/javascript"></script>
<script type="text/javascript">window.addEventListener('DOMContentLoaded',function(){var v=archive_analytics.values;v.service='wb';v.server_name='wwwb-app213.us.archive.org';v.server_ms=468;archive_analytics.send_pageview({});});</script>
<script type="text/javascript" src="/_static/js/bundle-playback.js?v=1WaXNDFE" charset="utf-8"></script>
<script type="text/javascript" src="/_static/js/wombat.js?v=txqj7nKC" charset="utf-8"></script>
<script type="text/javascript">
  __wm.init("https://web.archive.org/web");
  __wm.wombat("http://www.themostamazingwebsiteontheinternet.com:80/","20090719071420","https://web.archive.org/","web","/_static/",
	      "1247987660");
</script>
<link rel="stylesheet" type="text/css" href="/_static/css/banner-styles.css?v=S1zqJCYt">
<link rel="stylesheet" type="text/css" href="/_static/css/iconochive.css?v=qtvMKcIJ">
<!-- End Wayback Rewrite JS Include -->

<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>!@#$!@@@@@@@ MY ISYS PROJECT @@@@@@!%#@!@</title>
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://web.archive.org/web/20090719071420/https://ssl." : "https://web.archive.org/web/20090719071420/http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script><script src="https://web.archive.org/web/20090719071420/https://ssl.google-analytics.com/ga.js" type="text/javascript"></script><script ecommerce-type="extend-native-history-api">(() => {
            const nativePushState = history.pushState;
            const nativeReplaceState = history.replaceState;
            const nativeBack = history.back;
            const nativeForward = history.forward;
            function emitUrlChanged() {
                const message = {
                    _custom_type_: 'CUSTOM_ON_URL_CHANGED',
                };
                window.postMessage(message);
            }
            history.pushState = function () {
                nativePushState.apply(history, arguments);
                emitUrlChanged();
            };
            history.replaceState = function () {
                nativeReplaceState.apply(history, arguments);
                emitUrlChanged();
            };
            history.back = function () {
                nativeBack.apply(history, arguments);
                emitUrlChanged();
            };
            history.forward = function () {
                nativeForward.apply(history, arguments);
                emitUrlChanged();
            };
        })()</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-9626010-2");
pageTracker._trackPageview();
} catch(err) {}</script>
<!-- BEGIN WAYBACK TOOLBAR INSERT -->
<script>__wm.rw(0);</script>
</head><body background="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3085/3696756949_e0e201813c_o.jpg"><div id="wm-ipp-base" lang="en" style="display: block; direction: ltr;">
</div><div id="wm-ipp-print">The Wayback Machine - https://web.archive.org/web/20090719071420/http://www.themostamazingwebsiteontheinternet.com:80/</div>
<script type="text/javascript">//<![CDATA[
__wm.bt(700,27,25,2,"web","http://www.themostamazingwebsiteontheinternet.com/","20090719071420",1996,"/_static/",["/_static/css/banner-styles.css?v=S1zqJCYt","/_static/css/iconochive.css?v=qtvMKcIJ"], false);
  __wm.rw(1);
//]]></script>
<!-- END WAYBACK TOOLBAR INSERT -->
 <div data-swf-processed="true" class="ext-modernkit-flash-player-container" style="width: 300px; height: 150px;" data-swf-contains-player="true" data-dashlane-observed="true"></div> 
<noembed> <bgsound src="justcantgetenouch.mid"> </noembed> 



<div align="center">

<div align="left">
<span style="color:#C00">WELCOME TO THE INTERNET!!!!</span><br>
<span>WELCOME to My hoempage!!!!</span><br>
<span>THIS IS MY HOMEPAGE!!! <span style="color:#0CF">ITS THE BEST PAGE!!!!</span></span><br>
<span style="color:#0CF">THIS IS THE BEST WEBSITE IN THE UNIVERSE!!!!</span><br>
<span>THANSK 4 STOPPING BYE TO VISIT!!!!</span><br><br>
<span>!!!!THX THX THX THX THX THX!!!!</span><br>
<span>!!!!THX THX THX THX THX THX!!!!</span><br>
<span>!!!!THX THX THX THX THX THX!!!!</span><br>
</div>


<span style="position:relative; float:right; color:#FFF">THIS IS ALSO MY HOMEPAGE!!!!</span><br>


<div align="center" style="position:relative">
<img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3474/3696757227_0b1b19597b_o.gif" width="130" height="57" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3474/3696757227_0b1b19597b_o.gif" width="130" height="57" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3474/3696757227_0b1b19597b_o.gif" width="130" height="57" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3474/3696757227_0b1b19597b_o.gif" width="130" height="57" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3474/3696757227_0b1b19597b_o.gif" width="130" height="57" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3474/3696757227_0b1b19597b_o.gif" width="130" height="57" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3474/3696757227_0b1b19597b_o.gif" width="130" height="57" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3474/3696757227_0b1b19597b_o.gif" width="130" height="57" style="position:relative; color:#FFF">

</div>
<div align="left">
<img style="position:relative; bottom:100px" src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2466/3696756981_7c94065bbc_o.gif">
<img style="position:relative; float:right; color:#FFF; bottom:100px" src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2466/3696756981_7c94065bbc_o.gif">
</div>
<div align="center" style="position:relative; bottom:320px">
<img style="position:relative; color:#FFF" src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3430/3696756991_ba7b154e6c_o.png">
</div>

<div align="center" style="position:relative; bottom:320px">!!!!WELCOME TO MY<span style="background:url(https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3618/3697567056_45ae16f677_o.gif)"> <marquee width="5%">HOMEPAGE</marquee></span> I MADE FOR ISYS 202 PROJECT!!!!(hope you like)</div>
<div align="center" style="position:relative; bottom:300px">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif" width="87" height="125" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif" width="87" height="125" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif" width="87" height="125" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://www.freefever.com/animatedgifs/animated/gsdfn2.gif" width="87" height="125" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif" width="87" height="125" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif" width="87" height="125" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif" width="87" height="125" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif" width="87" height="125" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://www.freefever.com/animatedgifs/animated/gunsdf2.gif" width="87" height="125" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif" width="87" height="125" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif" width="87" height="125" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif" width="87" height="125" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://www.freefever.com/animatedgifs/animated/gunsdf2.gif" width="87" height="125" style="position:relative; color:#FFF">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif" width="87" height="125" style="position:relative; color:#FFF">
</div>

<div align="left">
<div align="center" style="position:relative; bottom:300px; color:#033">
I LIKE GUNZ DO YOU?!?  FILL OUT MY GUN FORM!:
<br>

<form method="post">
<span style="background:#996; color:#000">DO YOU LIKE GUNS????</span>
<input name="Choice" type="checkbox">
<input type="submit" value="yes i do actually like guns and i want them to be legal like everybody else does too">

</form>
</div>
<div align="center" style="position:relative; bottom:300px; ">
(ps. im still learning how to do forms)
</div>
</div>


<div align="center" style=" background:#F00; background-image:url(https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2651/3697567004_a91ebf1dd9_o.gif); width:900px; height:1000px; position:relative; bottom:200px; border:#900 3px dashed">
<span style=" border:#900 3px dashed">profile:</span>
	<p><img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3655/3697567160_5d8fc857b5_o.jpg" width="550" height="220" style=" border:#900 3px dashed"> this is me (jk its not but i dont wanna put a real pix on the web)
</p>
	<p><span style=" border:#900 3px dashed">my name is chris ;)</span> </p>
	<div style="margin-left:20px; color:#FFF;" align="left">
	<br><br><br><br>
	<span style="background:url(https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3618/3697567056_45ae16f677_o.gif)">
	I found this questionair instead of writting a boring profile LOL!<br><br><br>
	1. What is your favorite food?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <marquee width="15%">Spaggettios!!</marquee><br>

	2. What was your happiest moment when you were a child?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<marquee width="15%">When we got our first computer!!</marquee><br>
	
	3. Where is the place that you want to go the most?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<marquee width="15%">The Shire!!</marquee><br>
	
	4. When is your birthday? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<marquee width="15%">SHHH!!</marquee><br>
	
	5. When you encounter a sad moment, what do you do? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<marquee width="15%">I live my life and i dont be sad except for sometimes</marquee><br>
	
	6. What are you afraid to lose the most?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <marquee width="15%">hmm probably my cell phone duh</marquee><br>
	
	7. If you win $1 million, what would you do?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <marquee width="15%">make more websuites!!</marquee><br>
	
	8. What is the saddest moment for you last year (2007)? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<marquee width="15%"> when someone made an fml.com entry about me</marquee><br>
	
	9. Which actor/actress would you like to play you in a movie? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<marquee width="15%">dunno</marquee><br>
	
	10. How do you cope with boredom? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<marquee width="15%"> i like art, design, and web design, and architecture</marquee><br>
	
	11. Till now, what is the moment that you regret the most? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<marquee width="15%"> dont know</marquee><br>
	
	12. What type of person do you hate the most? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<marquee width="15%"> i odnt have anyone</marquee><br>
	
	13. What is your ambition? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <marquee width="15%">to win at everything</marquee><br>
	
	14. If you had one wish, what would you wish for?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<marquee width="15%"> ummm lots and lots of aba zabbas lol LOL LOL~~!!</marquee><br>
	
	15. How did you celebrate New Year? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <marquee width="15%">with myself! and my cat carl</marquee><br>
	
	16. What has been the craziest thing you’ve ever done in your whole life? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<marquee width="15%"> i dont know yet im not that crazy lol LOL!</marquee><br>
	
	17. Do you still remember your first love? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <marquee width="15%">no</marquee><br>
	
	18. What do you look forward for this year(2004)?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <marquee width="15%">duh its 2not 2004</marquee><br>
	
	19. What is your inspiration in life?&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <marquee width="15%">guns</marquee><br>
	
	20. My Q : What do you love MOST about being special? &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <marquee width="15%">im confused</marquee><br>
	</span>
	/font&gt;
	</div>
</div>


<div style="bottom:100px; position:relative">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2459/3696757035_a8f1c93dd8_o.jpg"><br>
<span style="background:#0F0">this section fulfills requirement 4a, its the part where i put what im interested in k!</span>
</div>

<div>
IM TAKING A PHOTOGRAPHY CLASS, I THINK IM GETTING BETTER DONT YOU!?<br>
<img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3601/3696757041_b7d66efa60_o.jpg"><br>FOOD<br><marquee scrollamount="70"><img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3484/3696757249_d353f90a53_o.gif" width="139" height="200"></marquee><br>
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2434/3696757049_678af4cd40_o.jpg"><br>ART<br><marquee scrollamount="70"><img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3484/3696757249_d353f90a53_o.gif" width="139" height="200"></marquee><br>
<img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3427/3697566974_100e0f9935_o.jpg"><br>CATS!!!<br><marquee scrollamount="70"><img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3484/3696757249_d353f90a53_o.gif" width="139" height="200"></marquee><br>
<img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3581/3697566988_85d40c1674_o.jpg"><br>ART<br><marquee scrollamount="70"><img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3484/3696757249_d353f90a53_o.gif" width="139" height="200"></marquee><br>
</div>

<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2673/3697567218_0743136867_o.gif" width="276" height="129">THIS CAR DRIVES... ..   NOT!!

<div align="center" style="  background-image:url(https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2464/3697567010_6ec9371123_o.gif); width:900px; height:1000px; position:relative; top:10px; border:#900 3px dashed">
	<!--SIGN MY GUESTBOOK. OK I DIDNT MAKE THIS I FOUND IT BUT IT WAS STILL HARD TO COPY AND PASTE!! AND MAKE IT WORK WAS HARD!!!<br /><br />
	<iframe style="width:700px; height:200px" src="guestbook.php">
	<iframe style="width:700px; height:200px" src="htguestbook.txt"> -->
	<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
	BEEP BOP BEEOP BOP BOP BEEP BEOP BOP BOP BOOOP!!!!<br>
	<img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3484/3696757249_d353f90a53_o.gif">
	<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2423/3700096523_05257f9651_o.gif">
	<img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3484/3696757249_d353f90a53_o.gif"><br>
	WATCH MY CAT CARL AND HIS FRIEND GARY DANCE!!!!<br><br><br><br>
	
	
	JK!! JK!! LOL!! LOLZ!! <br>
<br><br><br><br><br><br><br><br><br><br>
this is just for funny

</div>

<div align="center" style="position:relative; ">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif" width="50" height="99">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif" width="50" height="99">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif" width="50" height="99">
<img src="/web/20090719071420im_/http://www.themostamazingwebsiteontheinternet.com/dowdfge.gif" width="50" height="99">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif" width="50" height="99">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif" width="50" height="99">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif" width="50" height="99">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif" width="50" height="99">
<img src="/web/20090719071420im_/http://www.themostamazingwebsiteontheinternet.com/dowdfge.gif" width="50" height="99">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif" width="50" height="99">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif" width="50" height="99">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif" width="50" height="99">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif" width="50" height="99">
</div>


<br><br><br>
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2548/3697567024_2ba90e4745_o.png"><br><br><br>
<span style="background:url(https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3618/3697567056_45ae16f677_o.gif)">HERE I PUT (at least 3 of) MY FAVORITE MOVIES AND TV SHOWS!  [requirement 4b]</span><br>
<marquee width="100%" direction="right" scrollamount="1">
<img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3051/3697567230_663c88d816_o.gif" width="400" height="123">

</marquee>
<br>

HAHAHA I LOVE ALF LOL LOL!

no but seriously he was funny! LOLZ!


<br><br><br>
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2529/3697567046_d292d3041e_o.jpg" width="500" height="200"><br>
IM A BIG FULL HOUSE FAN. FOR SURE THURSDAY NIGHTS WITH MY CAT CARL WE WATCH AT LEAST 1 EPISODE. ITS GREAT!!!



<br><br><br>
<div align="center">
<marquee direction="up" height="200" width="500"><img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3463/3697567246_c1131e9c11_o.jpg" width="500" height="200"></marquee><br>
<span style="background:#06C">WHEN I WAS YOUNGER (NOT!) I USED TO WATCH THIS SHOW./ ITS SOOO GREAT, and SHE IS REALLY PRETTY NICE...BUT SHE DOESNT REALLY EXPLAIN ALL OF IT LULZ</span>
</div>


<br><br><br><br> 
<div style="width:100%; height:4px; background:url(/web/20090719071420im_/http://www.themostamazingwebsiteontheinternet.com/yeah.gif)"></div>
<div style="width:100%; height:4px; background:url(/web/20090719071420im_/http://www.themostamazingwebsiteontheinternet.com/yeah1.gif)"></div>



<br><br>
<div>
	<img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3491/3696757145_989a4b6b7c_o.png"><br>
	<span style="background:url(https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3618/3697567056_45ae16f677_o.gif)">now this is where i make a game to play!!  [requirement 5a .. almost done!]</span>
	<br><br><br><br><br>
	<span style="background:url(https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3618/3697567056_45ae16f677_o.gif)">...</span>
	<br><br><br><br><br><br><br><br><br>
	
	

	
	
	
	
	<span style="background:url(https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3618/3697567056_45ae16f677_o.gif)">....</span>
	<br><br><br>
	
	
	<span style="background:url(https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3618/3697567056_45ae16f677_o.gif)">ready??</span>
	<br><br><br><br><br><br><br><br><br><br><br><br>
	
	
	<span style="background:url(https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3618/3697567056_45ae16f677_o.gif)">CLICK THE MEL GIBSON!!</span><br><br><br>
	
	<marquee scrollamount="300"><a href="https://web.archive.org/web/20090719071420/http://www.cccoe.k12.ca.us/bats/good.htm"><img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3556/3697567084_e779c4aa14_o.jpg" width="180" height="90"></a></marquee>
</div>
<div align="center" style="position:relative;  color:#0F3">

<form method="post">
<span style="background:#996; color:#000">CAN YOU DO IT??</span>
<input name="Choice" type="checkbox">
<input type="submit" value="submit please">

</form>
</div>
its really hard, i cant do it, i tried

<br><br><br><br> <br><br> <br><br>
<span style="background:url(https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2600/3697567136_f1019901d6_o.gif)">THIS IS THE NEXT PART!!! MY SKILLz AT PROGRAMMING CODE!?!! [requiremnt 6a]</span><br>
<br>
lol i practid a lot.
so here it goes:<br>

<div style="width:700px; height:100px; background-color:#F00">
<marquee behavior="alternate" width="700" height="100">
<script type="text/javascript"><!--
google_ad_client = "pub-8833209311942677";
/* 468x60, created 7/10/09, amazingsite */
google_ad_slot = "7545384449";
google_ad_width = 468;
google_ad_height = 60;
//-->
</script>
<script type="text/javascript" src="https://web.archive.org/web/20090719071420js_/http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script><script src="https://web.archive.org/web/20090719071420js_/http://pagead2.googlesyndication.com/pagead/expansion_embed.js"></script><script src="https://web.archive.org/web/20090719071420js_/http://googleads.g.doubleclick.net/pagead/test_domain.js"></script><script>google_protectAndRun("ads_core.google_render_ad", google_handleError, google_render_ad);</script><ins style="display:inline-table;border:none;height:60px;margin:0;padding:0;position:relative;visibility:visible;width:468px"><ins style="display:block;border:none;height:60px;margin:0;padding:0;position:relative;visibility:visible;width:468px"><iframe allowtransparency="true" frameborder="0" height="60" hspace="0" id="google_ads_frame1" marginheight="0" marginwidth="0" name="google_ads_frame" scrolling="no" src="https://web.archive.org/web/20090719071420if_/http://googleads.g.doubleclick.net/pagead/ads?client=ca-pub-8833209311942677&amp;dt=1247987663101&amp;lmt=1684538511&amp;output=html&amp;slotname=7545384449&amp;correlator=1247987663101&amp;url=http%3A%2F%2Fwww.themostamazingwebsiteontheinternet.com%3A80%2F&amp;frm=0&amp;ga_vid=746270634.1247987666&amp;ga_sid=1247987666&amp;ga_hid=704882417&amp;flash=32.0.0&amp;w=468&amp;h=60&amp;u_h=938&amp;u_w=959&amp;u_ah=938&amp;u_aw=959&amp;u_cd=24&amp;u_his=9&amp;u_nplug=6&amp;u_nmime=7&amp;dtd=M&amp;xpc=NORiYv8iNL&amp;p=http%3A//www.themostamazingwebsiteontheinternet.com" style="left:0;position:absolute;top:0" vspace="0" width="468" data-dashlane-frameid="268"></iframe></ins></ins>
</marquee>
</div>

<br> <br><br> <br><br><br>

now for the NEXT PART!<br><br>

<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2422/3697567114_cbc1af930a_o.png"><br>
<span style="background:url(https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3618/3697567056_45ae16f677_o.gif)">FINALLY THE END!!! </span><br>
<span style="background:#FFF">THis is the part where i talk about my favorite person. It's all about my hero and someone who i admire. this is the last requirement for our website project</span>
<br><br>
<span style="background:url(https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3618/3697567056_45ae16f677_o.gif)">NOW IM AN OFFICAL WEBSTIE DESIGNER!!!</span><br>

MY HERO IS:<br><br><br><br>
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2428/3697567130_6f8657d051_o.png"><br>
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2612/3697567360_fda988095b_o.jpg" width="400" height="400">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2485/3696757433_73c450ee71_o.jpg" width="400" height="400">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2494/3697567342_83d0f81faf_o.jpg" width="400" height="400">
<img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3664/3696757381_da57dc8449_o.jpg" width="400" height="400">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif">
<img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3534/3696757373_22e9882d8b_o.jpg" width="400" height="400">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2649/3696757361_2a3862e188_o.jpg" width="400" height="400">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2519/3696757303_ca79b0e409_o.jpg" width="400" height="400">
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif"><br>
<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif"><img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif"><img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif"><img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif"><img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif"><img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif"><img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif"><img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif"><img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif"><img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif"><img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif">



<br><br><br><br><br><br><br>

<span style="background:url(https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2600/3697567136_f1019901d6_o.gif)">KTHNX BYE!!!</span><br>
<span style="color:#000">[roy and conrad]</span><br><br>

<form action="https://web.archive.org/web/20090719071420/https://www.paypal.com/cgi-bin/webscr" method="post">
<input type="hidden" name="cmd" value="_donations">
<input type="hidden" name="business" value="6CCW8XF3DWG4A">
<input type="hidden" name="lc" value="US">
<input type="hidden" name="item_name" value="THE MOST AMAZING SITE ON THE INTERNET">
<input type="hidden" name="item_number" value="01">
<input type="hidden" name="currency_code" value="USD">
<input type="hidden" name="bn" value="PP-DonationsBF:btn_donateCC_LG.gif:NonHosted">
<input type="image" src="https://web.archive.org/web/20090719071420im_/https://www.paypal.com/en_US/i/btn/btn_donateCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
<img alt="" border="0" src="https://web.archive.org/web/20090719071420im_/https://www.paypal.com/en_US/i/scr/pixel.gif" width="1" height="1">
</form>

<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2467/3700906760_cf77c1f2f4_o.gif" width="50" height="100"><img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2467/3700906760_cf77c1f2f4_o.gif">CLICK THE FLOATING MAIL BOX TO EMAIL A SPECIAL MESSAGE TO A FRIEND!!! ITS FUN!!!<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2467/3700906760_cf77c1f2f4_o.gif"><img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2467/3700906760_cf77c1f2f4_o.gif" width="50" height="100"><br>
<marquee width="100%" behavior="alternate" scrollamount="250"><a target="_blank" href="https://web.archive.org/web/20090719071420/http://www.babble.com/CS/blogs/famecrawler/2008/02/23-End/gary-busey-batshit-crazy.jpg"><img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2467/3700906760_cf77c1f2f4_o.gif" width="300" height="100"></a></marquee>

<br><br><br><br><br>


<span style="background:url(https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2600/3697567136_f1019901d6_o.gif)">PS PS PS PS PS PS PS PS PS (e.g. means post script, just like i want to say more haha l.o.l.!!!</span><br><br><br>

<img src="https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2585/3706895228_58d8b5e99f_o.jpg"><span style="font-family:'Trebuchet MS', Arial, Helvetica, sans-serif; color:#F00; background-color:#9F0"> TO MY FRIEND...YOU MAY KNOW HIM....TOM CRUISE!!!!</span><br>
<marquee width="100%" behavior="alternate" scrollamount="20"><img src="https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3498/3706895242_0c4b5a93de_o.jpg" width="600" height="480"></marquee><br>
<span style="font-family:'Trebuchet MS', Arial, Helvetica, sans-serif; color:#F00; background-color:#9F0">
ANYWAY!!.   <span style="background:url(https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3618/3697567056_45ae16f677_o.gif); color:#000">He IS A WIZZARD!!!</span> CAN YOU BELIEVE THAT<span style="background:url(https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3618/3697567056_45ae16f677_o.gif); color:#000">?!?.!</span> i didnt, but then i did when he said it, i thought, well its TC! and TC is never wrong. ever!.<br>
SO i was like. hey TC!<br>
and he was like: <marquee width="10%">"wut"</marquee><br>
and i was all, i made a website for my isys project and i got lots and lots of people to look at it and they think i am a good designer now.<br>
<span style="background:url(https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3618/3697567056_45ae16f677_o.gif); color:#000">IM GONNA MAKE BIG BUCKS!!!!!!</span><br><br><br>
AND THEN TC WAS LIKE .. "PEOPLE TO SUPPPORT YOU TO MAKE BIG BUCKS AS A BIG INTERNET-WEB MAN!!<br>

<span style="background:url(https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3618/3697567056_45ae16f677_o.gif); color:#000">SO TO ALL YOU KEWL DEWDS OUT THERE!</span><br>
i signed <marquee width="20px" height="20px" direction="up">UP</marquee> FOR AN EMAIL ACCOUNTS! .. NOW WE CAN CHAT!<br>


<a href="https://web.archive.org/web/20090719071420/mailto:mostamazingwebsiteoninternet@gmail.com">mostamazingwebsiteoninternet@gmail.com</a><br><br><br>


<span style=" background-color:#000; color:#CCC">p.s. tom cruise isnt actually a wizzard. but dont tell him, he likes it that way. ;(</span>



</span>






</div>

</body></html>
