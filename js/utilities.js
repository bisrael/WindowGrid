var $ = function(id) {
    return document.getElementById(id);
};

var $$ = function(selector) {
    return document.querySelectorAll(selector);
}

var $new = function(tag, options) {
    if(typeof tag != "string" || !tag) return;
    options = options || {};
    var el = document.createElement(tag);
    if(options.id) {
        el.id = options.id;
    }
    if(options['class']) {
        var classes = el.getAttribute('class') + " " + options['class'];
        el.setAttribute('class', classes);
    }
    return el;
};

/* -*- Mode: javascript; tab-width: 4; c-basic-offset: 4 -*- */
/**
 * @fileOverview Provides boost-like binding for javascript
 * @author Blake Israel
 * @version 1.0
 */
// BOOST-LIKE BINDING
// Don't pollute the globe[al], work in closures!
(function() {
    /**
     * @class Helper class for the $bind function. We use this instead of a 
     * built-in type so we can easily distinguish between an instance of this
     * and anything else.
     * @private
     */
    var _$bind = function(i) {
        this._bind_arg_index = i;
        return this;
    };
    /**
     * Gets the index this bind argument represents
     * @private
     */
    _$bind.prototype.getArgIndex = function() {
        return this._bind_arg_index;
    }
    /**
     * The # of arguments that will be created for binding.
     * this controls how many of _1, _2, ... _8, etc. are made.
     * @private
     */
    var _$bind_max = 9;
    // Creates those globals
    for(var i = 0; i < _$bind_max; ++i) {
        window["_" + (i+1)] = new _$bind(i);
    }
    
    /**
     * A boost::bind-like bind function, which can mix and match parameters in the resulting function to
     * any combo of params in the bound function. Also can change the "this" in the resulting function.
     * @param {Object} func The function to bind to. 
     * @param {Object} bind The new "this" to use in the called function, or null.
     * @param {Mixed} params A mixed list of params (not as an arry, just sequenced in the function call)
     * Use the globals _1, _2, ..., _9 to signal the first, second up to ninth params in the resulting function (one-based index).
     * @public
     */
    window['$bind'] = function(func, bind, params) {
        var bind_arguments = arguments;
        return function() {
            var args = [];
            // we start at 2 b/c we skip over the original function and the 'this' to bind to.
            for(var i = 2; i < bind_arguments.length; ++i) {
                var arg = bind_arguments[i];
                if(arg instanceof _$bind) {
                    args.push(arguments[arg.getArgIndex()]);
                } else {
                    args.push(arg);
                }
            }
            return func.apply(bind, args);
        }
    };
})();