(function() { const FLASH\_MIMETYPE = "application/x-shockwave-flash"; const FUTURESPLASH\_MIMETYPE = "application/futuresplash"; const FLASH7\_AND\_8\_MIMETYPE = "application/x-shockwave-flash2-preview"; const FLASH\_MOVIE\_MIMETYPE = "application/vnd.adobe.flash.movie"; const FLASH\_ACTIVEX\_CLASSID = "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"; class RuffleMimeTypeArray { constructor(mimeTypes) { this.\_\_mimeTypes = \[\]; this.\_\_namedMimeTypes = {}; if (mimeTypes) { for (let i = 0; i &lt; mimeTypes.length; i++) { this.install(mimeTypes\[i\]); } } } install(mimeType) { const index = this.\_\_mimeTypes.length; this.\_\_mimeTypes.push(mimeType); this.\_\_namedMimeTypes\[mimeType.type\] = mimeType; this\[mimeType.type\] = mimeType; this\[index\] = mimeType; } item(index) { // This behavior is done to emulate a 32-bit uint, // which browsers use. return this.\_\_mimeTypes\[index &gt;>> 0\]; } namedItem(name) { return this.\_\_namedMimeTypes\[name\]; } get length() { return this.\_\_mimeTypes.length; } \[Symbol.iterator\]() { return this.\_\_mimeTypes\[Symbol.iterator\](); } } class RufflePlugin extends RuffleMimeTypeArray { constructor(name, description, filename) { super(); this.name = name; this.description = description; this.filename = filename; } } class RufflePluginArray { constructor(plugins) { this.\_\_plugins = \[\]; this.\_\_namedPlugins = {}; for (let i = 0; i &lt; plugins.length; i++) { this.install(plugins\[i\]); } } install(plugin) { const index = this.\_\_plugins.length; this.\_\_plugins.push(plugin); this.\_\_namedPlugins\[plugin.name\] = plugin; this\[plugin.name\] = plugin; this\[index\] = plugin; } item(index) { // This behavior is done to emulate a 32-bit uint, // which browsers use. Cloudflare's anti-bot // checks rely on this. return this.\_\_plugins\[index &gt;>> 0\]; } namedItem(name) { return this.\_\_namedPlugins\[name\]; } refresh() { // Nothing to do, we just need to define the method. } \[Symbol.iterator\]() { return this.\_\_plugins\[Symbol.iterator\](); } get length() { return this.\_\_plugins.length; } } /** * A fake plugin designed to trigger Flash detection scripts. */ const FLASH\_PLUGIN = new RufflePlugin("Shockwave Flash", "Shockwave Flash 32.0 r0", "ruffle.js"); /** * A fake plugin designed to allow early detection of if the Ruffle extension is in use. */ const RUFFLE\_EXTENSION = new RufflePlugin("Ruffle Extension", "Ruffle Extension", "ruffle.js"); FLASH\_PLUGIN.install({ type: FUTURESPLASH\_MIMETYPE, description: "Shockwave Flash", suffixes: "spl", enabledPlugin: FLASH\_PLUGIN, }); FLASH\_PLUGIN.install({ type: FLASH\_MIMETYPE, description: "Shockwave Flash", suffixes: "swf", enabledPlugin: FLASH\_PLUGIN, }); FLASH\_PLUGIN.install({ type: FLASH7\_AND\_8\_MIMETYPE, description: "Shockwave Flash", suffixes: "swf", enabledPlugin: FLASH\_PLUGIN, }); FLASH\_PLUGIN.install({ type: FLASH\_MOVIE\_MIMETYPE, description: "Shockwave Flash", suffixes: "swf", enabledPlugin: FLASH\_PLUGIN, }); RUFFLE\_EXTENSION.install({ type: "", description: "Ruffle Detection", suffixes: "", enabledPlugin: RUFFLE\_EXTENSION, }); function installPlugin(plugin) { if (!("install" in navigator.plugins) || !navigator.plugins\["install"\]) { Object.defineProperty(navigator, "plugins", { value: new RufflePluginArray(navigator.plugins), writable: false, }); } const plugins = navigator.plugins; plugins.install(plugin); if (plugin.length > 0 && (!("install" in navigator.mimeTypes) || !navigator.mimeTypes\["install"\])) { Object.defineProperty(navigator, "mimeTypes", { value: new RuffleMimeTypeArray(navigator.mimeTypes), writable: false, }); } const mimeTypes = navigator.mimeTypes; for (let i = 0; i < plugin.length; i += 1) { mimeTypes.install(plugin\[i\]); } } installPlugin(FLASH\_PLUGIN); installPlugin(RUFFLE\_EXTENSION); })(); window\[Symbol.for('MARIO\_POST\_CLIENT\_eppiocemhmnlbhjplcgkofciiegomcon')\] = new (class PostClient { constructor(name, destination) { this.name = name; this.destination = destination; this.serverListeners = {}; this.bgRequestsListeners = {}; this.bgEventsListeners = {}; window.addEventListener('message', (message) => { const data = message.data; const isNotForMe = !(data.destination && data.destination === this.name); const hasNotEventProp = !data.event; if (isNotForMe || hasNotEventProp) { return; } if (data.event === 'MARIO\_POST\_SERVER\_\_BG\_RESPONSE') { const response = data.args; if (this.hasBgRequestListener(response.requestId)) { try { this.bgRequestsListeners\[response.requestId\](response.response); } catch (e) { console.log(e); } delete this.bgRequestsListeners\[response.requestId\]; } } else if (data.event === 'MARIO\_POST\_SERVER\_\_BG\_EVENT') { const response = data.args; if (this.hasBgEventListener(response.event)) { try { this.bgEventsListeners\[data.id\](response.payload); } catch (e) { console.log(e); } } } else if (this.hasServerListener(data.event)) { try { this.serverListeners\[data.event\](data.args); } catch (e) { console.log(e); } } else { console.log(\`event not handled: ${data.event}\`); } }); } emitToServer(event, args) { const id = this.generateUIID(); const message = { args, destination: this.destination, event, id, }; window.postMessage(message, location.origin); return id; } emitToBg(bgEventName, args) { const requestId = this.generateUIID(); const request = { bgEventName, requestId, args }; this.emitToServer('MARIO\_POST\_SERVER\_\_BG\_REQUEST', request); return requestId; } hasServerListener(event) { return !!this.serverListeners\[event\]; } hasBgRequestListener(requestId) { return !!this.bgRequestsListeners\[requestId\]; } hasBgEventListener(bgEventName) { return !!this.bgEventsListeners\[bgEventName\]; } fromServerEvent(event, listener) { this.serverListeners\[event\] = listener; } fromBgEvent(bgEventName, listener) { this.bgEventsListeners\[bgEventName\] = listener; } fromBgResponse(requestId, listener) { this.bgRequestsListeners\[requestId\] = listener; } generateUIID() { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/\[xy\]/g, function (c) { const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); }); } })('MARIO\_POST\_CLIENT\_eppiocemhmnlbhjplcgkofciiegomcon', 'MARIO\_POST\_SERVER_eppiocemhmnlbhjplcgkofciiegomcon') const hideMyLocation = new (class HideMyLocation { constructor(clientKey) { this.clientKey = clientKey; this.watchIDs = {}; this.client = window\[Symbol.for(clientKey)\]; const getCurrentPosition = navigator.geolocation.getCurrentPosition; const watchPosition = navigator.geolocation.watchPosition; const clearWatch = navigator.geolocation.clearWatch; const self = this; navigator.geolocation.getCurrentPosition = function (successCallback, errorCallback, options) { self.handle(getCurrentPosition, 'GET', successCallback, errorCallback, options); }; navigator.geolocation.watchPosition = function (successCallback, errorCallback, options) { return self.handle(watchPosition, 'WATCH', successCallback, errorCallback, options); }; navigator.geolocation.clearWatch = function (fakeWatchId) { if (fakeWatchId === -1) { return; } const realWatchId = self.watchIDs\[fakeWatchId\]; delete self.watchIDs\[fakeWatchId\]; return clearWatch.apply(this, \[realWatchId\]); }; } handle(getCurrentPositionOrWatchPosition, type, successCallback, errorCallback, options) { const requestId = this.client.emitToBg('HIDE\_MY\_LOCATION\_\_GET\_LOCATION'); let fakeWatchId = this.getRandomInt(0, 100000); this.client.fromBgResponse(requestId, (response) => { if (response.enabled) { if (response.status === 'SUCCESS') { const position = this.map(response); successCallback(position); } else { const error = this.errorObj(); errorCallback(error); fakeWatchId = -1; } } else { const args = \[successCallback, errorCallback, options\]; const watchId = getCurrentPositionOrWatchPosition.apply(navigator.geolocation, args); if (type === 'WATCH') { this.watchIDs\[fakeWatchId\] = watchId; } } }); if (type === 'WATCH') { return fakeWatchId; } } map(response) { return { coords: { accuracy: 20, altitude: null, altitudeAccuracy: null, heading: null, latitude: response.latitude, longitude: response.longitude, speed: null, }, timestamp: Date.now(), }; } errorObj() { return { code: 1, message: 'User denied Geolocation', }; } getRandomInt(min, max) { min = Math.ceil(min); max = Math.floor(max); return Math.floor(Math.random() * (max - min + 1)) + min; } })('MARIO\_POST\_CLIENT_eppiocemhmnlbhjplcgkofciiegomcon') (() =\> { const nativePushState = history.pushState; const nativeReplaceState = history.replaceState; const nativeBack = history.back; const nativeForward = history.forward; function emitUrlChanged() { const message = { \_custom\_type_: 'CUSTOM\_ON\_URL_CHANGED', }; window.postMessage(message); } history.pushState = function () { nativePushState.apply(history, arguments); emitUrlChanged(); }; history.replaceState = function () { nativeReplaceState.apply(history, arguments); emitUrlChanged(); }; history.back = function () { nativeBack.apply(history, arguments); emitUrlChanged(); }; history.forward = function () { nativeForward.apply(history, arguments); emitUrlChanged(); }; })() window.addEventListener('DOMContentLoaded',function(){var v=archive\_analytics.values;v.service='wb';v.server\_name='wwwb-app219.us.archive.org';v.server\_ms=299;archive\_analytics.send_pageview({});}); \_\_wm.init("https://web.archive.org/web"); \_\_wm.wombat("http://www.themostamazingwebsiteontheinternet.com:80/","20090719071420","https://web.archive.org/","web","/_static/", "1247987660");  !@#$!@@@@@@@ MY ISYS PROJECT @@@@@@!%#@!@ var gaJsHost = (("https:" == document.location.protocol) ? "https://web.archive.org/web/20090719071420/https://ssl." : "https://web.archive.org/web/20090719071420/http://www."); document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));   try { var pageTracker = \_gat.\_getTracker("UA-9626010-2"); pageTracker._trackPageview(); } catch(err) {} __wm.rw(0);

The Wayback Machine - https://web.archive.org/web/20090719071420/http://www.themostamazingwebsiteontheinternet.com:80/

//&lt;!\[CDATA\[ \_\_wm.bt(700,27,25,2,"web","http://www.themostamazingwebsiteontheinternet.com/","20090719071420",1996,"/\_static/",\["/\_static/css/banner-styles.css?v=S1zqJCYt","/\_static/css/iconochive.css?v=qtvMKcIJ"\], false); __wm.rw(1); //\]\]&gt;

&lt;bgsound src="justcantgetenouch.mid"&gt;

WELCOME TO THE INTERNET!!!!  
WELCOME to My hoempage!!!!  
THIS IS MY HOMEPAGE!!! ITS THE BEST PAGE!!!!  
THIS IS THE BEST WEBSITE IN THE UNIVERSE!!!!  
THANSK 4 STOPPING BYE TO VISIT!!!!  
  
!!!!THX THX THX THX THX THX!!!!  
!!!!THX THX THX THX THX THX!!!!  
!!!!THX THX THX THX THX THX!!!!  

THIS IS ALSO MY HOMEPAGE!!!!  

![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3474/3696757227_0b1b19597b_o.gif) ![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3474/3696757227_0b1b19597b_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3474/3696757227_0b1b19597b_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3474/3696757227_0b1b19597b_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3474/3696757227_0b1b19597b_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3474/3696757227_0b1b19597b_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3474/3696757227_0b1b19597b_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3474/3696757227_0b1b19597b_o.gif)

![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2466/3696756981_7c94065bbc_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2466/3696756981_7c94065bbc_o.gif)

![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3430/3696756991_ba7b154e6c_o.png)

!!!!WELCOME TO MY HOMEPAGE I MADE FOR ISYS 202 PROJECT!!!!(hope you like)

![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif) ![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif)![](https://web.archive.org/web/20090719071420im_/http://www.freefever.com/animatedgifs/animated/gsdfn2.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif)![](https://web.archive.org/web/20090719071420im_/http://www.freefever.com/animatedgifs/animated/gunsdf2.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif)![](https://web.archive.org/web/20090719071420im_/http://www.freefever.com/animatedgifs/animated/gunsdf2.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2514/3697567176_e539814357_o.gif)

I LIKE GUNZ DO YOU?!? FILL OUT MY GUN FORM!:  

DO YOU LIKE GUNS???? 

(ps. im still learning how to do forms)

profile:

![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3655/3697567160_5d8fc857b5_o.jpg) this is me (jk its not but i dont wanna put a real pix on the web)

my name is chris ;)

  
  
  
  
I found this questionair instead of writting a boring profile LOL!  
  
  
1\. What is your favorite food?           Spaggettios!!  
2\. What was your happiest moment when you were a child?          When we got our first computer!!  
3\. Where is the place that you want to go the most?          The Shire!!  
4\. When is your birthday?           SHHH!!  
5\. When you encounter a sad moment, what do you do?           I live my life and i dont be sad except for sometimes  
6\. What are you afraid to lose the most?           hmm probably my cell phone duh  
7\. If you win $1 million, what would you do?           make more websuites!!  
8\. What is the saddest moment for you last year (2007)?            when someone made an fml.com entry about me  
9\. Which actor/actress would you like to play you in a movie?           dunno  
10\. How do you cope with boredom?            i like art, design, and web design, and architecture  
11\. Till now, what is the moment that you regret the most?            dont know  
12\. What type of person do you hate the most?            i odnt have anyone  
13\. What is your ambition?            to win at everything  
14\. If you had one wish, what would you wish for?           ummm lots and lots of aba zabbas lol LOL LOL~~!!  
15\. How did you celebrate New Year?            with myself! and my cat carl  
16\. What has been the craziest thing you’ve ever done in your whole life?            i dont know yet im not that crazy lol LOL!  
17\. Do you still remember your first love?            no  
18\. What do you look forward for this year(2004)?           duh its 2not 2004  
19\. What is your inspiration in life?           guns  
20\. My Q : What do you love MOST about being special?            im confused  
/font>

![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2459/3696757035_a8f1c93dd8_o.jpg)  
this section fulfills requirement 4a, its the part where i put what im interested in k!

IM TAKING A PHOTOGRAPHY CLASS, I THINK IM GETTING BETTER DONT YOU!?  
![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3601/3696757041_b7d66efa60_o.jpg)  
FOOD  
![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3484/3696757249_d353f90a53_o.gif)  
![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2434/3696757049_678af4cd40_o.jpg)  
ART  
![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3484/3696757249_d353f90a53_o.gif)  
![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3427/3697566974_100e0f9935_o.jpg)  
CATS!!!  
![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3484/3696757249_d353f90a53_o.gif)  
![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3581/3697566988_85d40c1674_o.jpg)  
ART  
![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3484/3696757249_d353f90a53_o.gif)  

![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2673/3697567218_0743136867_o.gif)THIS CAR DRIVES... .. NOT!!

  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
BEEP BOP BEEOP BOP BOP BEEP BEOP BOP BOP BOOOP!!!!  
![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3484/3696757249_d353f90a53_o.gif) ![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2423/3700096523_05257f9651_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3484/3696757249_d353f90a53_o.gif)  
WATCH MY CAT CARL AND HIS FRIEND GARY DANCE!!!!  
  
  
  
JK!! JK!! LOL!! LOLZ!!  
  
  
  
  
  
  
  
  
  
  
this is just for funny

![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif) ![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif)![](/web/20090719071420im_/http://www.themostamazingwebsiteontheinternet.com/dowdfge.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif)![](/web/20090719071420im_/http://www.themostamazingwebsiteontheinternet.com/dowdfge.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2634/3697567018_e02bac7abc_o.gif)

  
  
  
![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2548/3697567024_2ba90e4745_o.png)  
  
  
HERE I PUT (at least 3 of) MY FAVORITE MOVIES AND TV SHOWS! \[requirement 4b\]  
![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3051/3697567230_663c88d816_o.gif)  
HAHAHA I LOVE ALF LOL LOL! no but seriously he was funny! LOLZ!  
  
  
![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2529/3697567046_d292d3041e_o.jpg)  
IM A BIG FULL HOUSE FAN. FOR SURE THURSDAY NIGHTS WITH MY CAT CARL WE WATCH AT LEAST 1 EPISODE. ITS GREAT!!!  
  
  

![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3463/3697567246_c1131e9c11_o.jpg)  
WHEN I WAS YOUNGER (NOT!) I USED TO WATCH THIS SHOW./ ITS SOOO GREAT, and SHE IS REALLY PRETTY NICE...BUT SHE DOESNT REALLY EXPLAIN ALL OF IT LULZ

  
  
  
  

  
  

![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3491/3696757145_989a4b6b7c_o.png)  
now this is where i make a game to play!! \[requirement 5a .. almost done!\]  
  
  
  
  
...  
  
  
  
  
  
  
  
  
....  
  
  
ready??  
  
  
  
  
  
  
  
  
  
  
  
CLICK THE MEL GIBSON!!  
  
  
[![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3556/3697567084_e779c4aa14_o.jpg)](https://web.archive.org/web/20090719071420/http://www.cccoe.k12.ca.us/bats/good.htm)

CAN YOU DO IT?? 

its really hard, i cant do it, i tried  
  
  
  
  
  
  
  
THIS IS THE NEXT PART!!! MY SKILLz AT PROGRAMMING CODE!?!! \[requiremnt 6a\]  
  
lol i practid a lot. so here it goes:  

&lt;!\-\- google\_ad\_client = "pub-8833209311942677"; /* 468x60, created 7/10/09, amazingsite */ google\_ad\_slot = "7545384449"; google\_ad\_width = 468; google\_ad\_height = 60; //--&gt; google\_protectAndRun("ads\_core.google\_render\_ad", google\_handleError, google\_render_ad);

  
  
  
  
  
  
now for the NEXT PART!  
  
![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2422/3697567114_cbc1af930a_o.png)  
FINALLY THE END!!!  
THis is the part where i talk about my favorite person. It's all about my hero and someone who i admire. this is the last requirement for our website project  
  
NOW IM AN OFFICAL WEBSTIE DESIGNER!!!  
MY HERO IS:  
  
  
  
![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2428/3697567130_6f8657d051_o.png)  
![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2612/3697567360_fda988095b_o.jpg) ![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2485/3696757433_73c450ee71_o.jpg)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2494/3697567342_83d0f81faf_o.jpg)![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3664/3696757381_da57dc8449_o.jpg)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3534/3696757373_22e9882d8b_o.jpg)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2649/3696757361_2a3862e188_o.jpg)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2519/3696757303_ca79b0e409_o.jpg)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif)  
![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2628/3697567134_826aabb296_o.gif)  
  
  
  
  
  
  
KTHNX BYE!!!  
\[roy and conrad\]  
  

 ![](https://web.archive.org/web/20090719071420im_/https://www.paypal.com/en_US/i/scr/pixel.gif)

![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2467/3700906760_cf77c1f2f4_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2467/3700906760_cf77c1f2f4_o.gif)CLICK THE FLOATING MAIL BOX TO EMAIL A SPECIAL MESSAGE TO A FRIEND!!! ITS FUN!!!![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2467/3700906760_cf77c1f2f4_o.gif)![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2467/3700906760_cf77c1f2f4_o.gif)  
[![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2467/3700906760_cf77c1f2f4_o.gif)](https://web.archive.org/web/20090719071420/http://www.babble.com/CS/blogs/famecrawler/2008/02/23-End/gary-busey-batshit-crazy.jpg)  
  
  
  
  
PS PS PS PS PS PS PS PS PS (e.g. means post script, just like i want to say more haha l.o.l.!!!  
  
  
![](https://web.archive.org/web/20090719071420im_/http://farm3.static.flickr.com/2585/3706895228_58d8b5e99f_o.jpg) TO MY FRIEND...YOU MAY KNOW HIM....TOM CRUISE!!!!  
![](https://web.archive.org/web/20090719071420im_/http://farm4.static.flickr.com/3498/3706895242_0c4b5a93de_o.jpg)  
ANYWAY!!. He IS A WIZZARD!!! CAN YOU BELIEVE THAT?!?.! i didnt, but then i did when he said it, i thought, well its TC! and TC is never wrong. ever!.  
SO i was like. hey TC!  
and he was like: "wut"  
and i was all, i made a website for my isys project and i got lots and lots of people to look at it and they think i am a good designer now.  
IM GONNA MAKE BIG BUCKS!!!!!!  
  
  
AND THEN TC WAS LIKE .. "PEOPLE TO SUPPPORT YOU TO MAKE BIG BUCKS AS A BIG INTERNET-WEB MAN!!  
SO TO ALL YOU KEWL DEWDS OUT THERE!  
i signed UP FOR AN EMAIL ACCOUNTS! .. NOW WE CAN CHAT!  
[mostamazingwebsiteoninternet@gmail.com](https://web.archive.org/web/20090719071420/mailto:mostamazingwebsiteoninternet@gmail.com)  
  
  
p.s. tom cruise isnt actually a wizzard. but dont tell him, he likes it that way. ;(
