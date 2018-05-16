"use strict";

var MoodItem = function (text) {
    if (text) {
        var o = JSON.parse(text);
        this.theme  = o.theme;
        this.time = o.time;
        this.picCode = o.picCode;
        this.description = o.description;
        this.author = o.author;
    } else {
        this.theme  = "";
        this.time = "";
        this.picCode = "";
        this.description = "";
        this.author = "";
    }
};

MoodItem.prototype = {
    toString : function() {
        return JSON.stringify(this);
    }
};

var StrangerMoodContract = function () {
    LocalContractStorage.defineMapProperty(this, "moodItem", {
        parse: function(text) {
            return new MoodItem(text);
        },
        stringify: function(o) {
            return o.toString();
        }
    });

    LocalContractStorage.defineMapProperty(this, "itemIndex");
    LocalContractStorage.defineProperty(this, "height");
};

StrangerMoodContract.prototype = {
    init: function() {
        this.height = 0;
    },

    save: function (theme, time, picCode, description) {
        theme = theme.trim();
        time = time.trim();
        picCode = picCode.trim();
        description = description.trim();
        if (theme === "" || time === "" || picCode === "") {
            throw new Error("empty theme / time / picCode");
        }
        if (theme.length > 64 || description.length > 64){
            throw new Error("theme / description exceed limit length");
        }
        // var a = "/^(\d{4})-(\d{2})-(\d{2})$/";
        // if (!a.test(time)) {
        //     throw new Error("time format error");
        // }

        var from = Blockchain.transaction.from;
        var moodItem = this.moodItem.get(theme);
        if(moodItem) {
            throw new Error("theme has been occupied");
        }

        moodItem = new MoodItem();
        moodItem.author = from;
        moodItem.theme = theme;
        moodItem.time = time;
        moodItem.picCode = picCode;
        moodItem.description = description;

        this.moodItem.put(theme, moodItem);

        var index = this.height;
        this.itemIndex.put(index, theme);

        this.height += 1;
    },

    get: function (theme) {
        theme = theme.trim();
        if (theme === "") {
            throw new Error("empty theme");
        }
        if (theme.length > 64){
            throw new Error("theme exceed limit length");
        }

        return this.moodItem.get(theme);
    },

    getByPage: function (page, pageSize) {
        var p = new BigNumber(page);
        var size = new BigNumber(pageSize);
        var height = this.height;
        var totalPages = height / size + 1;
        if (p < 0 || size < 1 || size > 100) {
            throw new Error("page / page_size error");
        }
        if (p > totalPages) {
            throw new Error("page is too large");
        }
        
        var result = [];
        var tempSize = size;
        var i = (p - 1) * size;
        if (p == totalPages) {
            //if it is the last page, the size should be :
            tempSize = height - i;
        }
        for (; i < size; i ++) {
            var theme = this.itemIndex.get(i);
            var obj = this.moodItem.get(theme);
            var temp = {
                index: i,
                theme: theme,
                moodItem: obj
            };

            result.push(temp);
        }

        return JSON.stringify(result);
    }
}


module.exports = StrangerMoodContract;