/*
*
* mads - version 2.00.01
* Copyright (c) 2015, Ninjoe
* Dual licensed under the MIT or GPL Version 2 licenses.
* https://en.wikipedia.org/wiki/MIT_License
* https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
*
*/
var mads = function (options) {

    var _this = this;

    this.render = options.render;

    /* Body Tag */
    this.bodyTag = document.getElementsByTagName('body')[0];

    /* Head Tag */
    this.headTag = document.getElementsByTagName('head')[0];

    /* json */
    if (typeof json == 'undefined' && typeof rma != 'undefined') {
        this.json = rma.customize.json;
    } else if (typeof json != 'undefined') {
        this.json = json;
    } else {
        this.json = '';
    }

    /* fet */
    if (typeof fet == 'undefined' && typeof rma != 'undefined') {
        this.fet = rma.customize.fet;
    } else if (typeof json != 'undefined') {
        this.fet = fet;
    } else {
        this.fet = [];
    }

    this.fetTracked = false;

    /* load json for assets */
    this.loadJs(this.json, function () {
        _this.data = json_data;

        _this.render.render();
    });

    /* Get Tracker */
    if (typeof custTracker == 'undefined' && typeof rma != 'undefined') {
        this.custTracker = rma.customize.custTracker;
    } else if (typeof custTracker != 'undefined') {
        this.custTracker = custTracker;
    } else {
        this.custTracker = [];
    }

    /* CT */
    if (typeof ct == 'undefined' && typeof rma != 'undefined') {
        this.ct = rma.ct;
    } else if (typeof ct != 'undefined') {
        this.ct = ct;
    } else {
        this.ct = [];
    }

    /* CTE */
    if (typeof cte == 'undefined' && typeof rma != 'undefined') {
        this.cte = rma.cte;
    } else if (typeof cte != 'undefined') {
        this.cte = cte;
    } else {
        this.cte = [];
    }

    /* tags */
    if (typeof tags == 'undefined' && typeof tags != 'undefined') {
        this.tags = this.tagsProcess(rma.tags);
    } else if (typeof tags != 'undefined') {
        this.tags = this.tagsProcess(tags);
    } else {
        this.tags = '';
    }

    /* Unique ID on each initialise */
    this.id = this.uniqId();

    /* Tracked tracker */
    this.tracked = [];
    /* each engagement type should be track for only once and also the first tracker only */
    this.trackedEngagementType = [];
    /* trackers which should not have engagement type */
    this.engagementTypeExlude = [];
    /* first engagement */
    this.firstEngagementTracked = false;

    /* RMA Widget - Content Area */
    this.contentTag = document.getElementById('rma-widget');

    /* URL Path */
    this.path = typeof rma != 'undefined' ? rma.customize.src : '';

    /* Solve {2} issues */
    for (var i = 0; i < this.custTracker.length; i++) {
        if (this.custTracker[i].indexOf('{2}') != -1) {
            this.custTracker[i] = this.custTracker[i].replace('{2}', '{{type}}');
        }
    }
};

/* Generate unique ID */
mads.prototype.uniqId = function () {

    return new Date().getTime();
}

mads.prototype.tagsProcess = function (tags) {

    var tagsStr = '';

    for(var obj in tags){
        if(tags.hasOwnProperty(obj)){
            tagsStr+= '&'+obj + '=' + tags[obj];
        }
    }

    return tagsStr;
}

/* Link Opner */
mads.prototype.linkOpener = function (url) {

	if(typeof url != "undefined" && url !=""){

		if (typeof mraid !== 'undefined') {
			mraid.open(url);
		}else{
			window.open(url);
		}
	}
}

/* tracker */
mads.prototype.tracker = function (tt, type, name, value) {

    /*
    * name is used to make sure that particular tracker is tracked for only once
    * there might have the same type in different location, so it will need the name to differentiate them
    */
    name = name || type;

    if ( tt == 'E' && !this.fetTracked ) {
        for ( var i = 0; i < this.fet.length; i++ ) {
            var t = document.createElement('img');
            t.src = this.fet[i];

            t.style.display = 'none';
            this.bodyTag.appendChild(t);
        }
        this.fetTracked = true;
    }

    if ( typeof this.custTracker != 'undefined' && this.custTracker != '' && this.tracked.indexOf(name) == -1 ) {
        for (var i = 0; i < this.custTracker.length; i++) {
            var img = document.createElement('img');

            if (typeof value == 'undefined') {
                value = '';
            }

            /* Insert Macro */
            var src = this.custTracker[i].replace('{{rmatype}}', type);
            src = src.replace('{{rmavalue}}', value);

            /* Insert TT's macro */
            if (this.trackedEngagementType.indexOf(tt) != '-1' || this.engagementTypeExlude.indexOf(tt) != '-1') {
                src = src.replace('tt={{rmatt}}', '');
            } else {
                src = src.replace('{{rmatt}}', tt);
                this.trackedEngagementType.push(tt);
            }

            /* Append ty for first tracker only */
            if (!this.firstEngagementTracked && tt == 'E') {
                src = src + '&ty=E';
                this.firstEngagementTracked = true;
            }

            /* */
            img.src = src + this.tags + '&' + this.id;

            img.style.display = 'none';
            this.bodyTag.appendChild(img);

            this.tracked.push(name);
        }
    }
};

/* Load JS File */
mads.prototype.loadJs = function (js, callback) {
    var script = document.createElement('script');
    script.src = js;

    if (typeof callback != 'undefined') {
        script.onload = callback;
    }

    this.headTag.appendChild(script);
}

/* Load CSS File */
mads.prototype.loadCss = function (href) {
    var link = document.createElement('link');
    link.href = href;
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');

    this.headTag.appendChild(link);
}

var eniOil = function () {
    /* pass in object for render callback */
    this.app = new mads({
        'render' : this
    });

    this.style();
    this.render();
    this.events();
}

eniOil.prototype.render = function () {
    this.app.contentTag.innerHTML =
        '<div class="container"> \
            <div id="layer-1" class="layer"> \
                <img src="' + this.app.path + 'images/Andalan-banner-x.png"/> \
                <form id="form" class="form"> \
                    <input type="number" id="no" placeholder="HP" required> \
                    <div class="last"> \
                        <button id="submit" class="btn">KIRIM</button> \
                    </div> \
                </form> \
            </div> \
            <div id="layer-2" class="layer"> \
                <img src="' + this.app.path + 'images/eo-img-03-01.png"/> \
            </div> \
        </div>';
}

eniOil.prototype.style = function () {
    var css = 'body { margin: 0; } .container { position: relative; width: 320px; height: 480px; overflow: hidden; margin: 0; padding: 0; } ';
    css += '#layer-1 { display: block; }';
    css += '#layer-2 { display: none; } ';
    css += '.layer { width: 320px; height: 480px; position: absolute; top: 0; left: 0;} ';
    css += '.form { position: absolute; bottom: 52px; left: 0; text-align: center; width: 320px; } .form input { width: 208px; height: 30px; border: 1px solid #9b71b1; outline: none; box-shadow: none; -webkit-appearance: none; -moz-appearance: none;  padding: 0 10px; font-size: 16px; } .form .last { margin-top: 10px; } ';
    css += '.btn { background: #9b71b1; border: 0; color: #fff; padding: 5px 40px; border-radius: 30px; font-size: 20px; font-weight: bolder; }';

    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
}

eniOil.prototype.events = function () {
    var _this = this;
    this.layer1 = document.getElementById('layer-1');
    this.layer2 = document.getElementById('layer-2');
    this.form = document.getElementById('form');
    this.submitBtn = document.getElementById('submit');

    this.form.addEventListener('submit', function (e) {
        e.preventDefault();

        var noEl = document.getElementById('no')
        noEl.style.border = '';

        var no = noEl.value;

        if (/^\d+$/.test(no) && /\S/.test(no)) {
            // string is not empty and not just whitespace
            //var url = 'https://www.mobileads.com/api/save_lf?contactEmail=dickale@imx.co.id,karima@imx.co.id,adhie@mobileads.com&gotDatas=1&element=[{%22fieldname%22:%22text_1%22,%22value%22:%22' + name + '%22},{%22fieldname%22:%22text_2%22,%22value%22:%22' + hp +  '%22}]&user-id=2901&studio-id=203&tab-id=1&trackid=2066&referredURL=Sample%20Ad%20Unit&callback=leadGenCallback';
            var url = 'http://www.mobileads.com/api/save_lf?contactEmail=dickale@imx.co.id,karima@imx.co.id,adhie@mobileads.com,jeff@mobileads.com&gotDatas=1&element=[{%22fieldname%22:%22text_1%22,%22value%22:%22'+no+'%22}]&user-id=2901&studio-id=226&tab-id=1&trackid=2089&referredURL=Sample%20Ad%20Unit&callback=leadGenCallback'
            /* tracker */
            _this.app.tracker('E', 'form_submit');

            _this.app.loadJs(url)
        } else {
            if (!/\S/.test(no)) {
                noEl.style.border = '1px solid red';
            }
        }
    })
}

eniOil.prototype.onSubmit = function () {
    this.layer1.style.display = 'none';
    this.layer2.style.display = 'block';
}

var leadGenCallback = function (obj) {
    console.log(obj);
    app.onSubmit();
}

var app = new eniOil ();
