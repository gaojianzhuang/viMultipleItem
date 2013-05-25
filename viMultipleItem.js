/// <reference path="../../baseJs/jquery-1.8.3.js" />

; (function ($, window) {
    var ViMultipleItem = function (element, options) {
        var defaults = {
            leastOne: true,
            item: "tr",
            itemsContainer: "table",
            allowMaxCount: 20,
            addTrigger: ".addlink",
            removeTrigger: ".deletelink:not(.disabled)",
            init: function (inst) { },
            itemTemplate: function (item, itemIndex) { },
            insertitemCall: function (item, itemIndex) { },
            beforeRemoveItemCall: function (item, itemIndex) { },
            removeitemCall: function (itemIndex) { }
        };

        this.vars = {
            maxIndex: 0
        };

        this.settings = $.extend({}, defaults, options);
        this.viMultipleItem = element;
        this.initialize();
    };

    ViMultipleItem.prototype = {
        initialize: function () {
            var that = this,
  			settings = that.settings,
                vars = that.vars,
                addTrigger = settings.addTrigger,
                removeTrigger = settings.removeTrigger,
				viMultipleItem = that.viMultipleItem;

            that.items = that._getItems();
            that.itemsContainer = $(settings.itemsContainer);

            vars.maxIndex = that.items.length;

            viMultipleItem.delegate(addTrigger, "click", function () {
                var allItems = that._getItems();

                var item = $(this).closest(settings.item);
                var itemIndex = vars.maxIndex;

                that.insertItem(item, itemIndex);

                return false;
            });

            viMultipleItem.delegate(removeTrigger, "click", function () {
                var allItems = that._getItems();

                var item = $(this).closest(settings.item);
                var itemIndex = that.getItemIndex(item);

                that.removeItem(item, itemIndex);

                return false;
            });

            that._checkItem();

            settings.init && settings.init.call(that);
        },

        _getItems: function () {
            var that = this,
				settings = that.settings;

            return $(settings.itemsContainer).children(settings.item);
        },

        _checkItem: function () {
            var that = this,
				settings = that.settings;

            if (settings.leastOne) {
                var items = that.items,
                    itemsCount = items.length,
                    itemsContainer = that.itemsContainer,
                    removeTriggerEls = itemsContainer.find(settings.removeTrigger);

                if (itemsCount === 1) {
                    removeTriggerEls.hide();
                } else if (itemsCount === 0) {
                    that.insertItem(null, 0);

                    items = that.items;
                    var firstItem = items.first();
                    firstItem.find(settings.removeTrigger).hide();
                } else {
                    removeTriggerEls.show();
                }
            }
        },

        getItemIndex: function (item) {
            var that = this,
                settings = that.settings;

            if (item.is(settings.item)) {
                return that.items.index(item);
            } else {
                return 0;
            }
        },

        insertItem: function (item, itemIndex) {
            var that = this,
				settings = that.settings,
                vars = that.vars;

            if (that.items.length > settings.allowMaxCount) {
                return;
            }

            var itemHtml = settings.itemTemplate(item, itemIndex);
            var newItem = null;

            if (item) {
                item.after(itemHtml);
                newItem = item.next();
            } else {
                that.itemsContainer.append(itemHtml);
                newItem = that._getItems().last();
            }

            vars.maxIndex++;
            that.items = that._getItems();
            that._checkItem();

            settings.insertItemCall && settings.insertItemCall.call(that, newItem, itemIndex);
        },

        removeItem: function (item, itemIndex) {
            var that = this,
				settings = that.settings;

            settings.beforeRemoveItemCall && settings.beforeRemoveItemCall.call(that, item, itemIndex);

            if (item) {
                item.remove();
            }

            that.items = that._getItems();
            that._checkItem();

            settings.removeItemCall && settings.removeItemCall.call(that, itemIndex);
        }
    };

    $.fn.viMultipleItem = function (options) {
        return this.each(function (i, n) {
            var element = $(n);
            if (element.data("viMultipleItem")) {
                return element.data("viMultipleItem");
            }
            var viMultipleItem = new ViMultipleItem(element, options);
            element.data("viMultipleItem", viMultipleItem);
        });
    };
})(jQuery, window);
