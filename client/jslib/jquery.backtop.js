// Main
function backTop(options) {
    backTop.init(options);
}

// Function
backTop.init = function(options) {
    var o = $.extend({}, backTop.defaults, options),

    // Creat element
    $self;
    $self = $("<a/>" , {
        id: o.scrollName,
        href: "#top"
    });
    $self.appendTo("body");

    // Minimum CSS to make the magic happen
    $self.css({
        position: "fixed",
        zIndex: o.zIndex
    });

    // Switch animation type
    var animIn, animOut, animSpeed, scrollDis;

    switch (o.animation) {
        case "fade":
            animIn  = "fadeIn";
            animOut = "fadeOut";
            animSpeed = o.animationInSpeed;
            break;
        case "slide":
            animIn  = "slideDown";
            animOut = "slideUp";
            animSpeed = o.animationInSpeed;
            break;
        default:
            animIn  = "show";
            animOut = "hide";
            animSpeed = 0;
    }

    scrollDis = o.scrollDistance;

    // Trigger visible false by default
    var triggerVisible = false;

    scrollEvent = $(window).scroll(function() {
        if ( $(window).scrollTop() > scrollDis ) {
            if (!triggerVisible) {
                $self[animIn](animSpeed);
                triggerVisible = true;
            }
        } else {
            if (triggerVisible) {
                $self[animOut](animSpeed);
                triggerVisible = false;
            }
        }
    });

    var scrollTarget;
    if (o.scrollTarget) {
        if (typeof o.scrollTarget === "number") {
            scrollTarget = o.scrollTarget;
        } else if (typeof o.scrollTarget === "string") {
            scrollTarget = Math.floor($(o.scrollTarget).offset().top);
        }
    } else {
        scrollTarget = 0;
    }

    // To the top
    $self.click(function(e) {
        e.preventDefault();

        $("html, body").animate({
            scrollTop: scrollTarget
        }, o.scrollSpeed, o.easingType);
    });

};

// Default settings for the plugin
backTop.defaults = {
    scrollName: "scrollUp",
    scrollDistance: 200,
    easingType: "linear",
    animation: "fade",
    animationInSpeed: 200,
    animationOutSpeed: 200,
    scrollTarget: false,
    zIndex: 1080
};