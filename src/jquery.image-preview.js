(function($){
    function getOffset(element, lambdaForOffset) {
        var rawElement = $(element)[0];
        var result = 0;
        while (rawElement != null) {
            result += lambdaForOffset.call(rawElement);
            rawElement = rawElement.offsetParent;
        }
        return result;
    }

    function amountOf(element, attr) {
        return parseInt(/(\d+).*/.exec($(element).css(attr))[1]);
    }

    function rightBoundary(element) {
        return $(element).width() + $(element).getX();
    }

    function bottomBoundary(element) {
        return $(element).height() + $(element).getY();
    }

    $.windowHeight = function() {
        return window.innerHeight;
    }

    $.windowScrollTop = function() {
        return $(document).scrollTop();
    }

    $.fn.within = function(x, y) {
        return this.getX() < x && rightBoundary(this) > x && this.getY() < y && bottomBoundary(this) > y;
    }

    $.fn.isMouseIn = function() {
        return this.within(parseInt($('#mouseX').text()), parseInt($('#mouseY').text()));
    }

    $.fn.width = function() {
        return amountOf(this, 'width');
    };

    $.fn.height = function() {
        return amountOf(this, 'height');
    };

    $.fn.getX = function() {
        return getOffset(this, function() {
            return this.offsetLeft;
        });
    };

    $.fn.getY = function() {
        return getOffset(this, function() {
            return this.offsetTop;
        });
    };

    $.fn.topOfPreviewBox = function(targetElement) {
        var scrollTop = $.windowScrollTop();
        var bottomBoundary = $.windowHeight() + scrollTop;
        var previewBoxTopBoundary = $(targetElement).getY() - (this.height() - $(targetElement).height()) / 2;
        if(previewBoxTopBoundary < scrollTop) {
            previewBoxTopBoundary = scrollTop;
        }
        if (previewBoxTopBoundary + this.height() > bottomBoundary) {
            previewBoxTopBoundary = bottomBoundary - this.height() - amountOf(this, 'margin-top') - 10;
        }
        return previewBoxTopBoundary;
    };

    $.fn.leftOfPreviewBox = function(targetElement){
        var previewBoxLeftBoundary = $(targetElement).getX() - (this.width() - $(targetElement).width()) / 2;
        if (previewBoxLeftBoundary + this.width() > rightBoundary($.boundaryElement)) {
            previewBoxLeftBoundary = rightBoundary($.boundaryElement) - this.width();
        }
        return previewBoxLeftBoundary;
    };

    $.appendPreviewBox = function() {
        var previewBoxHtml = $("<div id='previewBox' class='hideAll'><div id='previewContent' /><div id='mouseX' class='hideAll' /><div id='mouseY' class='hideAll' /></div>");
        $('body').append(previewBoxHtml);
        return $('#previewBox');
    };

    $.fn.preview = function(options) {
        $.boundaryElement = options['boundaryElement'];
        var buildContent = options['buildContent'];

        this.mouseenter(function(e) {
            var targetElement = e.target;

            var content = buildContent(this);
            content.attr('id', 'previewContent');
            $.previewBox.find('#previewContent').replaceWith(content);

            $.previewBox.css('position', 'absolute');
            $.previewBox.css('z-index', '10');

            $.previewBox.css('top', $.previewBox.topOfPreviewBox(targetElement).toString() + 'px');
            $.previewBox.css('left', $.previewBox.leftOfPreviewBox(targetElement).toString() + 'px');

            setTimeout(function() {
                if($(targetElement).isMouseIn()) {
                    $.previewBox.show();
                }
            }, 800);
        });
    };

    $.previewBox = $.appendPreviewBox();

    $(document).mousemove(function(e) {
        $('#mouseX').text(e.pageX);
        $('#mouseY').text(e.pageY);
    });

    $.previewBox.mouseleave(function(){
        $(this).hide();
    });
})( jQuery );
