// ax5.ui.toast
(function (root, _SUPER_) {

    /**
     * @class ax5.ui.toast
     * @classdesc
     * @version 0.2.4
     * @author tom@axisj.com
     * @example
     * ```
     * var my_toast = new ax5.ui.toast();
     * ```
     */

    var U = ax5.util;

    //== UI Class
    var axClass = function () {
        var
            self = this,
            cfg,
            toastSeq = 0, toastSeqClear = null;

        if (_SUPER_) _SUPER_.call(this); // 부모호출
        this.toastContainer = null;
        this.queue = [];
        this.config = {
            clickEventName: "click", //(('ontouchstart' in document.documentElement) ? "touchstart" : "click"),
            theme: 'default',
            width: 300,
            icon: '',
            closeIcon: '',
            msg: '',
            lang: {
                "ok": "ok", "cancel": "cancel"
            },
            displayTime: 3000,
            animateTime: 250,
            containerPosition: "bottom-left"
        };

        cfg = this.config;

        var
            onStateChanged = function (opts, that) {
                if (opts && opts.onStateChanged) {
                    opts.onStateChanged.call(that, that);
                }
                else if (this.onStateChanged) {
                    this.onStateChanged.call(that, that);
                }

                opts = null;
                that = null;
                return true;
            },
            getContentTmpl = function () {
                return `
                <div id="{{toastId}}" data-ax5-ui="toast" class="ax5-ui-toast {{theme}}">
                    {{#icon}}
                    <div class="ax-toast-icon">{{{.}}}</div>
                    {{/icon}}
                    <div class="ax-toast-body">{{{msg}}}</div>
                    {{#btns}}
                    <div class="ax-toast-buttons">
                        <div class="ax-button-wrap">
                        {{#@each}}
                        <button type="button" data-ax-toast-btn="{{@key}}" class="btn btn-{{@value.theme}}">{{{@value.label}}}</button>
                        {{/@each}}
                        </div>
                    </div>
                    {{/btns}}
                    {{^btns}}
                    <a class="ax-toast-close" data-ax-toast-btn="ok">{{{closeIcon}}}</a>
                    {{/btns}}
                    <div style="clear:both;"></div>
                </div>
                `;
            },
            getContent = function (toastId, opts) {
                var
                    data = {
                        toastId: toastId,
                        theme: opts.theme,
                        icon: opts.icon,
                        msg: (opts.msg || "").replace(/\n/g, "<br/>"),
                        btns: opts.btns,
                        closeIcon: opts.closeIcon
                    };

                try {
                    return ax5.mustache.render(getContentTmpl(), data);
                }
                finally {
                    toastId = null;
                    data = null;
                }
            },
            open = function (opts, callBack) {
                if (toastSeqClear) clearTimeout(toastSeqClear);

                var
                    toastBox,
                    box = {
                        width: opts.width
                    };

                opts.id = 'ax5-toast-' + self.containerId + '-' + (++toastSeq);
                if (jQuery('#' + opts.id).get(0)) return this;

                if (U.left(cfg.containerPosition, '-') == 'bottom') {
                    this.toastContainer.append(getContent(opts.id, opts));
                }
                else {
                    this.toastContainer.prepend(getContent(opts.id, opts));
                }

                toastBox = jQuery('#' + opts.id);
                toastBox.css({width: box.width});
                opts.toastBox = toastBox;
                this.queue.push(opts);

                onStateChanged.call(this, opts, {
                    self: this,
                    state: "open",
                    toastId: opts.id
                });

                if (opts.toastType === "push") {
                    // 자동 제거 타이머 시작
                    setTimeout((function () {
                        this.close(opts, callBack);
                    }).bind(this), cfg.displayTime);

                    toastBox.find("[data-ax-toast-btn]").on(cfg.clickEventName, (function (e) {
                        btnOnClick.call(this, e || window.event, opts, toastBox, callBack);
                    }).bind(this));
                }
                else if (opts.toastType === "confirm") {
                    toastBox.find("[data-ax-toast-btn]").on(cfg.clickEventName, (function (e) {
                        btnOnClick.call(this, e || window.event, opts, toastBox, callBack);
                    }).bind(this));
                }

                box = null;
            },
            btnOnClick = function (e, opts, toastBox, callBack, target, k) {
                target = U.findParentNode(e.target, function (target) {
                    if (target.getAttribute("data-ax-toast-btn")) {
                        return true;
                    }
                });

                if (target) {
                    k = target.getAttribute("data-ax-toast-btn");

                    var that = {
                        key: k, value: (opts.btns) ? opts.btns[k] : k,
                        toastId: opts.id,
                        btn_target: target
                    };

                    if (opts.btns && opts.btns[k].onClick) {
                        opts.btns[k].onClick.call(that, k);
                    }
                    else if (opts.toastType === "push") {
                        if (callBack) callBack.call(that, k);
                        this.close(opts, toastBox);
                    }
                    else if (opts.toastType === "confirm") {
                        if (callBack) callBack.call(that, k);
                        this.close(opts, toastBox);
                    }
                }

                e = null;
                opts = null;
                toastBox = null;
                callBack = null;
                target = null;
                k = null;
            };

        /**
         * Preferences of toast UI
         * @method ax5.ui.toast.set_config
         * @param {Object} config - 클래스 속성값
         * @returns {ax5.ui.toast}
         * @example
         * ```
         * ```
         */
        //== class body start
        this.init = function () {
            this.onStateChanged = cfg.onStateChanged;
            // after set_config();
            self.containerId = ax5.getGuid();
            var styles = [];
            if (cfg.zIndex) {
                styles.push("z-index:" + cfg.zIndex);
            }
            jQuery(document.body).append('<div class="ax5-ui-toast-container ' + cfg.containerPosition + '" data-toast-container="' +
                '' + self.containerId + '" style="' + styles.join(";") + '"></div>');
            this.toastContainer = jQuery('[data-toast-container="' + self.containerId + '"]');
        };

        /**
         * @method ax5.ui.toast.push
         * @param opts
         * @param callBack
         * @returns {ax5.ui.toast}
         */
        this.push = function (opts, callBack) {
            if (!self.containerId) {
                this.init();
            }
            if (U.isString(opts)) {
                opts = {
                    title: cfg.title,
                    msg: opts
                }
            }
            opts.toastType = "push";

            self.dialogConfig = {};
            jQuery.extend(true, self.dialogConfig, cfg, opts);
            opts = self.dialogConfig;

            open.call(this, opts, callBack);

            opts = null;
            callBack = null;
            return this;
        };

        /**
         * @method ax5.ui.toast.confirm
         * @param opts
         * @param callBack
         * @returns {ax5.ui.toast}
         */
        this.confirm = function (opts, callBack) {
            if (!self.containerId) {
                this.init();
            }
            if (U.isString(opts)) {
                opts = {
                    title: cfg.title,
                    msg: opts
                }
            }
            opts.toastType = "confirm";

            self.dialogConfig = {};
            jQuery.extend(true, self.dialogConfig, cfg, opts);
            opts = self.dialogConfig;

            if (typeof opts.btns === "undefined") {
                opts.btns = {
                    ok: {label: cfg.lang["ok"], theme: opts.theme}
                };
            }
            open.call(this, opts, callBack);

            opts = null;
            callBack = null;
            return this;
        };

        /**
         * close the toast
         * @method ax5.ui.toast.close
         * @returns {ax5.ui.toast}
         * @example
         * ```
         * my_toast.close();
         * ```
         */
        this.close = function (opts, callBack) {
            if (typeof opts === "undefined") {
                opts = U.last(this.queue);
            }

            var toastBox = opts.toastBox;
            toastBox.addClass((opts.toastType == "push") ? "removed" : "destroy");
            this.queue = U.filter(this.queue, function () {
                return opts.id != this.id;
            });
            setTimeout((function () {
                var that = {
                    toastId: opts.id
                };

                toastBox.remove();
                if (callBack) callBack.call(that);

                that = {
                    self: this,
                    state: "close",
                    toastId: opts.id
                };
                onStateChanged.call(this, opts, that);

                // 3초후에도 아무 일이 없다면 완전히 제거
                if (this.queue.length === 0) {
                    if (toastSeqClear) clearTimeout(toastSeqClear);
                    toastSeqClear = setTimeout((function () {
                        /// console.log("try clear seq");
                        if (this.queue.length === 0) toastSeq = 0;
                    }).bind(this), 3000);
                }

                that = null;
                opts = null;
                callBack = null;
                toastBox = null;
            }).bind(this), cfg.animateTime);

            return this;
        };

        // 클래스 생성자
        this.main = (function () {
            if (arguments && U.isObject(arguments[0])) {
                this.setConfig(arguments[0]);
            }
        }).apply(this, arguments);
    };
    //== UI Class

    root.toast = (function () {
        if (U.isFunction(_SUPER_)) axClass.prototype = new _SUPER_(); // 상속
        return axClass;
    })(); // ax5.ui에 연결

})(ax5.ui, ax5.ui.root);