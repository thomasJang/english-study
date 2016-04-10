var fnObj = {
    pageStart: function () {
        var _this = this;
        this["app-layout"] = $("#app-layout");

        $('[data-group-handle]').click(function () {
            var groupName = this.getAttribute("data-group-handle");
            var opend = this.getAttribute("data-group-opend");

            if (opend == "true") _this["app-layout"].addClass("closed-" + groupName);
            else  _this["app-layout"].removeClass("closed-" + groupName);
            this.setAttribute("data-group-opend", (opend == "true") ? "false":"true");
        });
    }
};

$(document.body).ready(function () {
    fnObj.pageStart();
});