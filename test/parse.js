var test = require("tap").test,
    parseUrl = require('../').parseUrl,
    generateUrl = require('../').generateUrl,
    deepEqual = require('deep-equal');

var testCases =  [
    {
        obj: {
            base : 'http://www.sorter.com',
            cmd : 'sort',
        },
        url : 'http://www.sorter.com/sort',
        msg : 'no args no pipes'
    },

    {
        obj : {
            base : 'http://www.sorter.com',
            cmd : 'sort',
            args : [
            ],
        },
        url : 'http://www.sorter.com/sort',
        msg : 'empty list args, no pipes',
        testObjToUrlOnly : 1
    },
    {
        obj : {
            base : 'http://www.sorter.com',
            cmd : 'sort',
            args : null
        },
        url : 'http://www.sorter.com/sort',
        msg : 'null args, no pipes',
        testObjToUrlOnly : 1
    },
    {
        url : 'http://www.sorter.com/sort?',
        obj : {
            base : 'http://www.sorter.com',
            cmd : 'sort'
        },
        msg : 'hanging ?',
        testUrlToObjOnly : 1
    },
    {
        url : 'http://www.sorter.com/sort?args=',
        obj : {
            base : 'http://www.sorter.com',
            cmd : 'sort'
        },
        msg : 'hanging args=',
        testUrlToObjOnly : 1
    },
    {
        url : 'http://www.sorter.com/sort?pipes=',
        obj : {
            base : 'http://www.sorter.com',
            cmd : 'sort'
        },
        msg : 'hanging pipes=',
        testUrlToObjOnly : 1
    },
    {
        url : 'http://www.sorter.com/sort?args=-r&args=-n&args=-t&args=%2C&args=-k&args=3',
        obj : {
            base : 'http://www.sorter.com',
            cmd : 'sort',
            args : [ '-r', '-n', '-t',',','-k','3' ],
        },
        msg : 'lots of args',
    },
    {
        url : 'http://www.sorter.com/sort?args=-r&args=-n&args=-t&args=%2C&args=-k&args=3&pipes=http%3A%2F%2Fcater.com%2Fcat&pipes=http%3A%2F%2Fawker.com%2Fawk%3Fargs%3D%257B%2520print%2520%25241%253B%2520%257D&pipes=http%3A%2F%2Fgreper.com%2Fgrep%3Fargs%3Dboo',
        obj : {
            base : 'http://www.sorter.com',
            cmd : 'sort',
            args : [ '-r', '-n', '-t',',','-k','3' ],
            pipes : [
                {
                    base : 'http://cater.com',
                    cmd : 'cat',
                },
                {
                    base : 'http://awker.com',
                    cmd : 'awk',
                    args : [ '{ print $1; }' ],
                },
                {
                    base : 'http://greper.com',
                    cmd : 'grep',
                    args : [ 'boo' ],
                },
            ],
        },
        msg : 'lots of args and pipes',
    },
];

function deepDelete(obj,key) {
    if (!obj || (typeof obj) != 'object') return;
    delete obj[key];
    for(var k in obj) deepDelete(obj[k], key);
}

testCases.forEach(function(tcase) { 
    test(tcase.msg,function(t) {
        var testObjToUrl = true,
            testUrlToObj = true;
        if (tcase.testObjToUrlOnly) testUrlToObj = false;
        if (tcase.testUrlToObjOnly) testObjToUrl = false;
        if (testUrlToObj) {
            var obj = parseUrl(tcase.url);
            deepDelete(obj,'parsedUrl');
            var ok = deepEqual(obj,tcase.obj);
            if (!ok) {
                console.log('Oject Looked like this:');
                console.log(obj);
                console.log('Oject should have looked like this instead:');
                console.log(tcase.obj);
            }
            t.ok(ok,tcase.msg+' (urlParse)');
        }
        if (testObjToUrl) {
            var url = generateUrl(tcase.obj);
            t.equal(url,tcase.url,tcase.msg+' (urlGenerate)');
        }
        t.end();
    });
});
