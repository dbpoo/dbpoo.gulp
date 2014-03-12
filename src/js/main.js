require.config({
    baseUrl: '/js/',
    paths: {
        zepto: 'libs/zepto'
    }
});

require(['vendor/a'], function(a){
    console.log(a.total(5,10));

})