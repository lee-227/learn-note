define(['path', 'util', 'module', 'fs', 'url', 'events', 'assert'], function (require$$0$1, util$3, require$$0$2, fs$8, url$2, require$$4, require$$6) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0$1);
    var util__default = /*#__PURE__*/_interopDefaultLegacy(util$3);
    var require$$0__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$0$2);
    var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs$8);
    var require$$4__default = /*#__PURE__*/_interopDefaultLegacy(require$$4);
    var require$$6__default = /*#__PURE__*/_interopDefaultLegacy(require$$6);

    var lee = 'lee';

    var lee$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        'default': lee
    });

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var utils$4 = createCommonjsModule(function (module, exports) {
        exports.isInteger = num => {
            if (typeof num === 'number') {
                return Number.isInteger(num);
            }
            if (typeof num === 'string' && num.trim() !== '') {
                return Number.isInteger(Number(num));
            }
            return false;
        };
        /**
         * Find a node of the given type
         */
        exports.find = (node, type) => node.nodes.find(node => node.type === type);
        /**
         * Find a node of the given type
         */
        exports.exceedsLimit = (min, max, step = 1, limit) => {
            if (limit === false)
                return false;
            if (!exports.isInteger(min) || !exports.isInteger(max))
                return false;
            return ((Number(max) - Number(min)) / Number(step)) >= limit;
        };
        /**
         * Escape the given node with '\\' before node.value
         */
        exports.escapeNode = (block, n = 0, type) => {
            let node = block.nodes[n];
            if (!node)
                return;
            if ((type && node.type === type) || node.type === 'open' || node.type === 'close') {
                if (node.escaped !== true) {
                    node.value = '\\' + node.value;
                    node.escaped = true;
                }
            }
        };
        /**
         * Returns true if the given brace node should be enclosed in literal braces
         */
        exports.encloseBrace = node => {
            if (node.type !== 'brace')
                return false;
            if ((node.commas >> 0 + node.ranges >> 0) === 0) {
                node.invalid = true;
                return true;
            }
            return false;
        };
        /**
         * Returns true if a brace node is invalid.
         */
        exports.isInvalidBrace = block => {
            if (block.type !== 'brace')
                return false;
            if (block.invalid === true || block.dollar)
                return true;
            if ((block.commas >> 0 + block.ranges >> 0) === 0) {
                block.invalid = true;
                return true;
            }
            if (block.open !== true || block.close !== true) {
                block.invalid = true;
                return true;
            }
            return false;
        };
        /**
         * Returns true if a node is an open or close node
         */
        exports.isOpenOrClose = node => {
            if (node.type === 'open' || node.type === 'close') {
                return true;
            }
            return node.open === true || node.close === true;
        };
        /**
         * Reduce an array of text nodes.
         */
        exports.reduce = nodes => nodes.reduce((acc, node) => {
            if (node.type === 'text')
                acc.push(node.value);
            if (node.type === 'range')
                node.type = 'text';
            return acc;
        }, []);
        /**
         * Flatten an array
         */
        exports.flatten = (...args) => {
            const result = [];
            const flat = arr => {
                for (let i = 0; i < arr.length; i++) {
                    let ele = arr[i];
                    Array.isArray(ele) ? flat(ele) : ele !== void 0 && result.push(ele);
                }
                return result;
            };
            flat(args);
            return result;
        };
    });
    utils$4.isInteger;
    utils$4.find;
    utils$4.exceedsLimit;
    utils$4.escapeNode;
    utils$4.encloseBrace;
    utils$4.isInvalidBrace;
    utils$4.isOpenOrClose;
    utils$4.reduce;
    utils$4.flatten;

    var stringify = (ast, options = {}) => {
        let stringify = (node, parent = {}) => {
            let invalidBlock = options.escapeInvalid && utils$4.isInvalidBrace(parent);
            let invalidNode = node.invalid === true && options.escapeInvalid === true;
            let output = '';
            if (node.value) {
                if ((invalidBlock || invalidNode) && utils$4.isOpenOrClose(node)) {
                    return '\\' + node.value;
                }
                return node.value;
            }
            if (node.value) {
                return node.value;
            }
            if (node.nodes) {
                for (let child of node.nodes) {
                    output += stringify(child);
                }
            }
            return output;
        };
        return stringify(ast);
    };

    /*!
     * is-number <https://github.com/jonschlinkert/is-number>
     *
     * Copyright (c) 2014-present, Jon Schlinkert.
     * Released under the MIT License.
     */
    var isNumber = function (num) {
        if (typeof num === 'number') {
            return num - num === 0;
        }
        if (typeof num === 'string' && num.trim() !== '') {
            return Number.isFinite ? Number.isFinite(+num) : isFinite(+num);
        }
        return false;
    };

    const toRegexRange = (min, max, options) => {
        if (isNumber(min) === false) {
            throw new TypeError('toRegexRange: expected the first argument to be a number');
        }
        if (max === void 0 || min === max) {
            return String(min);
        }
        if (isNumber(max) === false) {
            throw new TypeError('toRegexRange: expected the second argument to be a number.');
        }
        let opts = Object.assign({ relaxZeros: true }, options);
        if (typeof opts.strictZeros === 'boolean') {
            opts.relaxZeros = opts.strictZeros === false;
        }
        let relax = String(opts.relaxZeros);
        let shorthand = String(opts.shorthand);
        let capture = String(opts.capture);
        let wrap = String(opts.wrap);
        let cacheKey = min + ':' + max + '=' + relax + shorthand + capture + wrap;
        if (toRegexRange.cache.hasOwnProperty(cacheKey)) {
            return toRegexRange.cache[cacheKey].result;
        }
        let a = Math.min(min, max);
        let b = Math.max(min, max);
        if (Math.abs(a - b) === 1) {
            let result = min + '|' + max;
            if (opts.capture) {
                return `(${result})`;
            }
            if (opts.wrap === false) {
                return result;
            }
            return `(?:${result})`;
        }
        let isPadded = hasPadding(min) || hasPadding(max);
        let state = { min, max, a, b };
        let positives = [];
        let negatives = [];
        if (isPadded) {
            state.isPadded = isPadded;
            state.maxLen = String(state.max).length;
        }
        if (a < 0) {
            let newMin = b < 0 ? Math.abs(b) : 1;
            negatives = splitToPatterns(newMin, Math.abs(a), state, opts);
            a = state.a = 0;
        }
        if (b >= 0) {
            positives = splitToPatterns(a, b, state, opts);
        }
        state.negatives = negatives;
        state.positives = positives;
        state.result = collatePatterns(negatives, positives);
        if (opts.capture === true) {
            state.result = `(${state.result})`;
        }
        else if (opts.wrap !== false && (positives.length + negatives.length) > 1) {
            state.result = `(?:${state.result})`;
        }
        toRegexRange.cache[cacheKey] = state;
        return state.result;
    };
    function collatePatterns(neg, pos, options) {
        let onlyNegative = filterPatterns(neg, pos, '-', false) || [];
        let onlyPositive = filterPatterns(pos, neg, '', false) || [];
        let intersected = filterPatterns(neg, pos, '-?', true) || [];
        let subpatterns = onlyNegative.concat(intersected).concat(onlyPositive);
        return subpatterns.join('|');
    }
    function splitToRanges(min, max) {
        let nines = 1;
        let zeros = 1;
        let stop = countNines(min, nines);
        let stops = new Set([max]);
        while (min <= stop && stop <= max) {
            stops.add(stop);
            nines += 1;
            stop = countNines(min, nines);
        }
        stop = countZeros(max + 1, zeros) - 1;
        while (min < stop && stop <= max) {
            stops.add(stop);
            zeros += 1;
            stop = countZeros(max + 1, zeros) - 1;
        }
        stops = [...stops];
        stops.sort(compare);
        return stops;
    }
    /**
     * Convert a range to a regex pattern
     * @param {Number} `start`
     * @param {Number} `stop`
     * @return {String}
     */
    function rangeToPattern(start, stop, options) {
        if (start === stop) {
            return { pattern: start, count: [], digits: 0 };
        }
        let zipped = zip(start, stop);
        let digits = zipped.length;
        let pattern = '';
        let count = 0;
        for (let i = 0; i < digits; i++) {
            let [startDigit, stopDigit] = zipped[i];
            if (startDigit === stopDigit) {
                pattern += startDigit;
            }
            else if (startDigit !== '0' || stopDigit !== '9') {
                pattern += toCharacterClass(startDigit, stopDigit);
            }
            else {
                count++;
            }
        }
        if (count) {
            pattern += options.shorthand === true ? '\\d' : '[0-9]';
        }
        return { pattern, count: [count], digits };
    }
    function splitToPatterns(min, max, tok, options) {
        let ranges = splitToRanges(min, max);
        let tokens = [];
        let start = min;
        let prev;
        for (let i = 0; i < ranges.length; i++) {
            let max = ranges[i];
            let obj = rangeToPattern(String(start), String(max), options);
            let zeros = '';
            if (!tok.isPadded && prev && prev.pattern === obj.pattern) {
                if (prev.count.length > 1) {
                    prev.count.pop();
                }
                prev.count.push(obj.count[0]);
                prev.string = prev.pattern + toQuantifier(prev.count);
                start = max + 1;
                continue;
            }
            if (tok.isPadded) {
                zeros = padZeros(max, tok, options);
            }
            obj.string = zeros + obj.pattern + toQuantifier(obj.count);
            tokens.push(obj);
            start = max + 1;
            prev = obj;
        }
        return tokens;
    }
    function filterPatterns(arr, comparison, prefix, intersection, options) {
        let result = [];
        for (let ele of arr) {
            let { string } = ele;
            // only push if _both_ are negative...
            if (!intersection && !contains(comparison, 'string', string)) {
                result.push(prefix + string);
            }
            // or _both_ are positive
            if (intersection && contains(comparison, 'string', string)) {
                result.push(prefix + string);
            }
        }
        return result;
    }
    /**
     * Zip strings
     */
    function zip(a, b) {
        let arr = [];
        for (let i = 0; i < a.length; i++)
            arr.push([a[i], b[i]]);
        return arr;
    }
    function compare(a, b) {
        return a > b ? 1 : b > a ? -1 : 0;
    }
    function contains(arr, key, val) {
        return arr.some(ele => ele[key] === val);
    }
    function countNines(min, len) {
        return Number(String(min).slice(0, -len) + '9'.repeat(len));
    }
    function countZeros(integer, zeros) {
        return integer - (integer % Math.pow(10, zeros));
    }
    function toQuantifier(digits) {
        let [start = 0, stop = ''] = digits;
        if (stop || start > 1) {
            return `{${start + (stop ? ',' + stop : '')}}`;
        }
        return '';
    }
    function toCharacterClass(a, b, options) {
        return `[${a}${(b - a === 1) ? '' : '-'}${b}]`;
    }
    function hasPadding(str) {
        return /^-?(0+)\d/.test(str);
    }
    function padZeros(value, tok, options) {
        if (!tok.isPadded) {
            return value;
        }
        let diff = Math.abs(tok.maxLen - String(value).length);
        let relax = options.relaxZeros !== false;
        switch (diff) {
            case 0:
                return '';
            case 1:
                return relax ? '0?' : '0';
            case 2:
                return relax ? '0{0,2}' : '00';
            default: {
                return relax ? `0{0,${diff}}` : `0{${diff}}`;
            }
        }
    }
    /**
     * Cache
     */
    toRegexRange.cache = {};
    toRegexRange.clearCache = () => (toRegexRange.cache = {});
    /**
     * Expose `toRegexRange`
     */
    var toRegexRange_1 = toRegexRange;

    const isObject$2 = val => val !== null && typeof val === 'object' && !Array.isArray(val);
    const transform = toNumber => {
        return value => toNumber === true ? Number(value) : String(value);
    };
    const isValidValue = value => {
        return typeof value === 'number' || (typeof value === 'string' && value !== '');
    };
    const isNumber$1 = num => Number.isInteger(+num);
    const zeros = input => {
        let value = `${input}`;
        let index = -1;
        if (value[0] === '-')
            value = value.slice(1);
        if (value === '0')
            return false;
        while (value[++index] === '0')
            ;
        return index > 0;
    };
    const stringify$1 = (start, end, options) => {
        if (typeof start === 'string' || typeof end === 'string') {
            return true;
        }
        return options.stringify === true;
    };
    const pad = (input, maxLength, toNumber) => {
        if (maxLength > 0) {
            let dash = input[0] === '-' ? '-' : '';
            if (dash)
                input = input.slice(1);
            input = (dash + input.padStart(dash ? maxLength - 1 : maxLength, '0'));
        }
        if (toNumber === false) {
            return String(input);
        }
        return input;
    };
    const toMaxLen = (input, maxLength) => {
        let negative = input[0] === '-' ? '-' : '';
        if (negative) {
            input = input.slice(1);
            maxLength--;
        }
        while (input.length < maxLength)
            input = '0' + input;
        return negative ? ('-' + input) : input;
    };
    const toSequence = (parts, options) => {
        parts.negatives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
        parts.positives.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
        let prefix = options.capture ? '' : '?:';
        let positives = '';
        let negatives = '';
        let result;
        if (parts.positives.length) {
            positives = parts.positives.join('|');
        }
        if (parts.negatives.length) {
            negatives = `-(${prefix}${parts.negatives.join('|')})`;
        }
        if (positives && negatives) {
            result = `${positives}|${negatives}`;
        }
        else {
            result = positives || negatives;
        }
        if (options.wrap) {
            return `(${prefix}${result})`;
        }
        return result;
    };
    const toRange = (a, b, isNumbers, options) => {
        if (isNumbers) {
            return toRegexRange_1(a, b, Object.assign({ wrap: false }, options));
        }
        let start = String.fromCharCode(a);
        if (a === b)
            return start;
        let stop = String.fromCharCode(b);
        return `[${start}-${stop}]`;
    };
    const toRegex = (start, end, options) => {
        if (Array.isArray(start)) {
            let wrap = options.wrap === true;
            let prefix = options.capture ? '' : '?:';
            return wrap ? `(${prefix}${start.join('|')})` : start.join('|');
        }
        return toRegexRange_1(start, end, options);
    };
    const rangeError = (...args) => {
        return new RangeError('Invalid range arguments: ' + util__default['default'].inspect(...args));
    };
    const invalidRange = (start, end, options) => {
        if (options.strictRanges === true)
            throw rangeError([start, end]);
        return [];
    };
    const invalidStep = (step, options) => {
        if (options.strictRanges === true) {
            throw new TypeError(`Expected step "${step}" to be a number`);
        }
        return [];
    };
    const fillNumbers = (start, end, step = 1, options = {}) => {
        let a = Number(start);
        let b = Number(end);
        if (!Number.isInteger(a) || !Number.isInteger(b)) {
            if (options.strictRanges === true)
                throw rangeError([start, end]);
            return [];
        }
        // fix negative zero
        if (a === 0)
            a = 0;
        if (b === 0)
            b = 0;
        let descending = a > b;
        let startString = String(start);
        let endString = String(end);
        let stepString = String(step);
        step = Math.max(Math.abs(step), 1);
        let padded = zeros(startString) || zeros(endString) || zeros(stepString);
        let maxLen = padded ? Math.max(startString.length, endString.length, stepString.length) : 0;
        let toNumber = padded === false && stringify$1(start, end, options) === false;
        let format = options.transform || transform(toNumber);
        if (options.toRegex && step === 1) {
            return toRange(toMaxLen(start, maxLen), toMaxLen(end, maxLen), true, options);
        }
        let parts = { negatives: [], positives: [] };
        let push = num => parts[num < 0 ? 'negatives' : 'positives'].push(Math.abs(num));
        let range = [];
        let index = 0;
        while (descending ? a >= b : a <= b) {
            if (options.toRegex === true && step > 1) {
                push(a);
            }
            else {
                range.push(pad(format(a, index), maxLen, toNumber));
            }
            a = descending ? a - step : a + step;
            index++;
        }
        if (options.toRegex === true) {
            return step > 1
                ? toSequence(parts, options)
                : toRegex(range, null, Object.assign({ wrap: false }, options));
        }
        return range;
    };
    const fillLetters = (start, end, step = 1, options = {}) => {
        if ((!isNumber$1(start) && start.length > 1) || (!isNumber$1(end) && end.length > 1)) {
            return invalidRange(start, end, options);
        }
        let format = options.transform || (val => String.fromCharCode(val));
        let a = `${start}`.charCodeAt(0);
        let b = `${end}`.charCodeAt(0);
        let descending = a > b;
        let min = Math.min(a, b);
        let max = Math.max(a, b);
        if (options.toRegex && step === 1) {
            return toRange(min, max, false, options);
        }
        let range = [];
        let index = 0;
        while (descending ? a >= b : a <= b) {
            range.push(format(a, index));
            a = descending ? a - step : a + step;
            index++;
        }
        if (options.toRegex === true) {
            return toRegex(range, null, { wrap: false, options });
        }
        return range;
    };
    const fill = (start, end, step, options = {}) => {
        if (end == null && isValidValue(start)) {
            return [start];
        }
        if (!isValidValue(start) || !isValidValue(end)) {
            return invalidRange(start, end, options);
        }
        if (typeof step === 'function') {
            return fill(start, end, 1, { transform: step });
        }
        if (isObject$2(step)) {
            return fill(start, end, 0, step);
        }
        let opts = Object.assign({}, options);
        if (opts.capture === true)
            opts.wrap = true;
        step = step || opts.step || 1;
        if (!isNumber$1(step)) {
            if (step != null && !isObject$2(step))
                return invalidStep(step, opts);
            return fill(start, end, 1, step);
        }
        if (isNumber$1(start) && isNumber$1(end)) {
            return fillNumbers(start, end, step, opts);
        }
        return fillLetters(start, end, Math.max(Math.abs(step), 1), opts);
    };
    var fillRange = fill;

    const compile = (ast, options = {}) => {
        let walk = (node, parent = {}) => {
            let invalidBlock = utils$4.isInvalidBrace(parent);
            let invalidNode = node.invalid === true && options.escapeInvalid === true;
            let invalid = invalidBlock === true || invalidNode === true;
            let prefix = options.escapeInvalid === true ? '\\' : '';
            let output = '';
            if (node.isOpen === true) {
                return prefix + node.value;
            }
            if (node.isClose === true) {
                return prefix + node.value;
            }
            if (node.type === 'open') {
                return invalid ? (prefix + node.value) : '(';
            }
            if (node.type === 'close') {
                return invalid ? (prefix + node.value) : ')';
            }
            if (node.type === 'comma') {
                return node.prev.type === 'comma' ? '' : (invalid ? node.value : '|');
            }
            if (node.value) {
                return node.value;
            }
            if (node.nodes && node.ranges > 0) {
                let args = utils$4.reduce(node.nodes);
                let range = fillRange(...args, Object.assign({}, options, { wrap: false, toRegex: true }));
                if (range.length !== 0) {
                    return args.length > 1 && range.length > 1 ? `(${range})` : range;
                }
            }
            if (node.nodes) {
                for (let child of node.nodes) {
                    output += walk(child, node);
                }
            }
            return output;
        };
        return walk(ast);
    };
    var compile_1 = compile;

    const append = (queue = '', stash = '', enclose = false) => {
        let result = [];
        queue = [].concat(queue);
        stash = [].concat(stash);
        if (!stash.length)
            return queue;
        if (!queue.length) {
            return enclose ? utils$4.flatten(stash).map(ele => `{${ele}}`) : stash;
        }
        for (let item of queue) {
            if (Array.isArray(item)) {
                for (let value of item) {
                    result.push(append(value, stash, enclose));
                }
            }
            else {
                for (let ele of stash) {
                    if (enclose === true && typeof ele === 'string')
                        ele = `{${ele}}`;
                    result.push(Array.isArray(ele) ? append(item, ele, enclose) : (item + ele));
                }
            }
        }
        return utils$4.flatten(result);
    };
    const expand$2 = (ast, options = {}) => {
        let rangeLimit = options.rangeLimit === void 0 ? 1000 : options.rangeLimit;
        let walk = (node, parent = {}) => {
            node.queue = [];
            let p = parent;
            let q = parent.queue;
            while (p.type !== 'brace' && p.type !== 'root' && p.parent) {
                p = p.parent;
                q = p.queue;
            }
            if (node.invalid || node.dollar) {
                q.push(append(q.pop(), stringify(node, options)));
                return;
            }
            if (node.type === 'brace' && node.invalid !== true && node.nodes.length === 2) {
                q.push(append(q.pop(), ['{}']));
                return;
            }
            if (node.nodes && node.ranges > 0) {
                let args = utils$4.reduce(node.nodes);
                if (utils$4.exceedsLimit(...args, options.step, rangeLimit)) {
                    throw new RangeError('expanded array length exceeds range limit. Use options.rangeLimit to increase or disable the limit.');
                }
                let range = fillRange(...args, options);
                if (range.length === 0) {
                    range = stringify(node, options);
                }
                q.push(append(q.pop(), range));
                node.nodes = [];
                return;
            }
            let enclose = utils$4.encloseBrace(node);
            let queue = node.queue;
            let block = node;
            while (block.type !== 'brace' && block.type !== 'root' && block.parent) {
                block = block.parent;
                queue = block.queue;
            }
            for (let i = 0; i < node.nodes.length; i++) {
                let child = node.nodes[i];
                if (child.type === 'comma' && node.type === 'brace') {
                    if (i === 1)
                        queue.push('');
                    queue.push('');
                    continue;
                }
                if (child.type === 'close') {
                    q.push(append(q.pop(), queue, enclose));
                    continue;
                }
                if (child.value && child.type !== 'open') {
                    queue.push(append(queue.pop(), child.value));
                    continue;
                }
                if (child.nodes) {
                    walk(child, node);
                }
            }
            return queue;
        };
        return utils$4.flatten(walk(ast));
    };
    var expand_1 = expand$2;

    var constants$5 = {
        MAX_LENGTH: 1024 * 64,
        // Digits
        CHAR_0: '0',
        CHAR_9: '9',
        // Alphabet chars.
        CHAR_UPPERCASE_A: 'A',
        CHAR_LOWERCASE_A: 'a',
        CHAR_UPPERCASE_Z: 'Z',
        CHAR_LOWERCASE_Z: 'z',
        CHAR_LEFT_PARENTHESES: '(',
        CHAR_RIGHT_PARENTHESES: ')',
        CHAR_ASTERISK: '*',
        // Non-alphabetic chars.
        CHAR_AMPERSAND: '&',
        CHAR_AT: '@',
        CHAR_BACKSLASH: '\\',
        CHAR_BACKTICK: '`',
        CHAR_CARRIAGE_RETURN: '\r',
        CHAR_CIRCUMFLEX_ACCENT: '^',
        CHAR_COLON: ':',
        CHAR_COMMA: ',',
        CHAR_DOLLAR: '$',
        CHAR_DOT: '.',
        CHAR_DOUBLE_QUOTE: '"',
        CHAR_EQUAL: '=',
        CHAR_EXCLAMATION_MARK: '!',
        CHAR_FORM_FEED: '\f',
        CHAR_FORWARD_SLASH: '/',
        CHAR_HASH: '#',
        CHAR_HYPHEN_MINUS: '-',
        CHAR_LEFT_ANGLE_BRACKET: '<',
        CHAR_LEFT_CURLY_BRACE: '{',
        CHAR_LEFT_SQUARE_BRACKET: '[',
        CHAR_LINE_FEED: '\n',
        CHAR_NO_BREAK_SPACE: '\u00A0',
        CHAR_PERCENT: '%',
        CHAR_PLUS: '+',
        CHAR_QUESTION_MARK: '?',
        CHAR_RIGHT_ANGLE_BRACKET: '>',
        CHAR_RIGHT_CURLY_BRACE: '}',
        CHAR_RIGHT_SQUARE_BRACKET: ']',
        CHAR_SEMICOLON: ';',
        CHAR_SINGLE_QUOTE: '\'',
        CHAR_SPACE: ' ',
        CHAR_TAB: '\t',
        CHAR_UNDERSCORE: '_',
        CHAR_VERTICAL_LINE: '|',
        CHAR_ZERO_WIDTH_NOBREAK_SPACE: '\uFEFF' /* \uFEFF */
    };

    /**
     * Constants
     */
    const { MAX_LENGTH: MAX_LENGTH$1, CHAR_BACKSLASH, /* \ */ CHAR_BACKTICK, /* ` */ CHAR_COMMA: CHAR_COMMA$1, /* , */ CHAR_DOT: CHAR_DOT$1, /* . */ CHAR_LEFT_PARENTHESES: CHAR_LEFT_PARENTHESES$1, /* ( */ CHAR_RIGHT_PARENTHESES: CHAR_RIGHT_PARENTHESES$1, /* ) */ CHAR_LEFT_CURLY_BRACE: CHAR_LEFT_CURLY_BRACE$1, /* { */ CHAR_RIGHT_CURLY_BRACE: CHAR_RIGHT_CURLY_BRACE$1, /* } */ CHAR_LEFT_SQUARE_BRACKET: CHAR_LEFT_SQUARE_BRACKET$1, /* [ */ CHAR_RIGHT_SQUARE_BRACKET: CHAR_RIGHT_SQUARE_BRACKET$1, /* ] */ CHAR_DOUBLE_QUOTE, /* " */ CHAR_SINGLE_QUOTE, /* ' */ CHAR_NO_BREAK_SPACE, CHAR_ZERO_WIDTH_NOBREAK_SPACE } = constants$5;
    /**
     * parse
     */
    const parse$4 = (input, options = {}) => {
        if (typeof input !== 'string') {
            throw new TypeError('Expected a string');
        }
        let opts = options || {};
        let max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH$1, opts.maxLength) : MAX_LENGTH$1;
        if (input.length > max) {
            throw new SyntaxError(`Input length (${input.length}), exceeds max characters (${max})`);
        }
        let ast = { type: 'root', input, nodes: [] };
        let stack = [ast];
        let block = ast;
        let prev = ast;
        let brackets = 0;
        let length = input.length;
        let index = 0;
        let depth = 0;
        let value;
        /**
         * Helpers
         */
        const advance = () => input[index++];
        const push = node => {
            if (node.type === 'text' && prev.type === 'dot') {
                prev.type = 'text';
            }
            if (prev && prev.type === 'text' && node.type === 'text') {
                prev.value += node.value;
                return;
            }
            block.nodes.push(node);
            node.parent = block;
            node.prev = prev;
            prev = node;
            return node;
        };
        push({ type: 'bos' });
        while (index < length) {
            block = stack[stack.length - 1];
            value = advance();
            /**
             * Invalid chars
             */
            if (value === CHAR_ZERO_WIDTH_NOBREAK_SPACE || value === CHAR_NO_BREAK_SPACE) {
                continue;
            }
            /**
             * Escaped chars
             */
            if (value === CHAR_BACKSLASH) {
                push({ type: 'text', value: (options.keepEscaping ? value : '') + advance() });
                continue;
            }
            /**
             * Right square bracket (literal): ']'
             */
            if (value === CHAR_RIGHT_SQUARE_BRACKET$1) {
                push({ type: 'text', value: '\\' + value });
                continue;
            }
            /**
             * Left square bracket: '['
             */
            if (value === CHAR_LEFT_SQUARE_BRACKET$1) {
                brackets++;
                let next;
                while (index < length && (next = advance())) {
                    value += next;
                    if (next === CHAR_LEFT_SQUARE_BRACKET$1) {
                        brackets++;
                        continue;
                    }
                    if (next === CHAR_BACKSLASH) {
                        value += advance();
                        continue;
                    }
                    if (next === CHAR_RIGHT_SQUARE_BRACKET$1) {
                        brackets--;
                        if (brackets === 0) {
                            break;
                        }
                    }
                }
                push({ type: 'text', value });
                continue;
            }
            /**
             * Parentheses
             */
            if (value === CHAR_LEFT_PARENTHESES$1) {
                block = push({ type: 'paren', nodes: [] });
                stack.push(block);
                push({ type: 'text', value });
                continue;
            }
            if (value === CHAR_RIGHT_PARENTHESES$1) {
                if (block.type !== 'paren') {
                    push({ type: 'text', value });
                    continue;
                }
                block = stack.pop();
                push({ type: 'text', value });
                block = stack[stack.length - 1];
                continue;
            }
            /**
             * Quotes: '|"|`
             */
            if (value === CHAR_DOUBLE_QUOTE || value === CHAR_SINGLE_QUOTE || value === CHAR_BACKTICK) {
                let open = value;
                let next;
                if (options.keepQuotes !== true) {
                    value = '';
                }
                while (index < length && (next = advance())) {
                    if (next === CHAR_BACKSLASH) {
                        value += next + advance();
                        continue;
                    }
                    if (next === open) {
                        if (options.keepQuotes === true)
                            value += next;
                        break;
                    }
                    value += next;
                }
                push({ type: 'text', value });
                continue;
            }
            /**
             * Left curly brace: '{'
             */
            if (value === CHAR_LEFT_CURLY_BRACE$1) {
                depth++;
                let dollar = prev.value && prev.value.slice(-1) === '$' || block.dollar === true;
                let brace = {
                    type: 'brace',
                    open: true,
                    close: false,
                    dollar,
                    depth,
                    commas: 0,
                    ranges: 0,
                    nodes: []
                };
                block = push(brace);
                stack.push(block);
                push({ type: 'open', value });
                continue;
            }
            /**
             * Right curly brace: '}'
             */
            if (value === CHAR_RIGHT_CURLY_BRACE$1) {
                if (block.type !== 'brace') {
                    push({ type: 'text', value });
                    continue;
                }
                let type = 'close';
                block = stack.pop();
                block.close = true;
                push({ type, value });
                depth--;
                block = stack[stack.length - 1];
                continue;
            }
            /**
             * Comma: ','
             */
            if (value === CHAR_COMMA$1 && depth > 0) {
                if (block.ranges > 0) {
                    block.ranges = 0;
                    let open = block.nodes.shift();
                    block.nodes = [open, { type: 'text', value: stringify(block) }];
                }
                push({ type: 'comma', value });
                block.commas++;
                continue;
            }
            /**
             * Dot: '.'
             */
            if (value === CHAR_DOT$1 && depth > 0 && block.commas === 0) {
                let siblings = block.nodes;
                if (depth === 0 || siblings.length === 0) {
                    push({ type: 'text', value });
                    continue;
                }
                if (prev.type === 'dot') {
                    block.range = [];
                    prev.value += value;
                    prev.type = 'range';
                    if (block.nodes.length !== 3 && block.nodes.length !== 5) {
                        block.invalid = true;
                        block.ranges = 0;
                        prev.type = 'text';
                        continue;
                    }
                    block.ranges++;
                    block.args = [];
                    continue;
                }
                if (prev.type === 'range') {
                    siblings.pop();
                    let before = siblings[siblings.length - 1];
                    before.value += prev.value + value;
                    prev = before;
                    block.ranges--;
                    continue;
                }
                push({ type: 'dot', value });
                continue;
            }
            /**
             * Text
             */
            push({ type: 'text', value });
        }
        // Mark imbalanced braces and brackets as invalid
        do {
            block = stack.pop();
            if (block.type !== 'root') {
                block.nodes.forEach(node => {
                    if (!node.nodes) {
                        if (node.type === 'open')
                            node.isOpen = true;
                        if (node.type === 'close')
                            node.isClose = true;
                        if (!node.nodes)
                            node.type = 'text';
                        node.invalid = true;
                    }
                });
                // get the location of the block on parent.nodes (block's siblings)
                let parent = stack[stack.length - 1];
                let index = parent.nodes.indexOf(block);
                // replace the (invalid) block with it's nodes
                parent.nodes.splice(index, 1, ...block.nodes);
            }
        } while (stack.length > 0);
        push({ type: 'eos' });
        return ast;
    };
    var parse_1$1 = parse$4;

    /**
     * Expand the given pattern or create a regex-compatible string.
     *
     * ```js
     * const braces = require('braces');
     * console.log(braces('{a,b,c}', { compile: true })); //=> ['(a|b|c)']
     * console.log(braces('{a,b,c}')); //=> ['a', 'b', 'c']
     * ```
     * @param {String} `str`
     * @param {Object} `options`
     * @return {String}
     * @api public
     */
    const braces = (input, options = {}) => {
        let output = [];
        if (Array.isArray(input)) {
            for (let pattern of input) {
                let result = braces.create(pattern, options);
                if (Array.isArray(result)) {
                    output.push(...result);
                }
                else {
                    output.push(result);
                }
            }
        }
        else {
            output = [].concat(braces.create(input, options));
        }
        if (options && options.expand === true && options.nodupes === true) {
            output = [...new Set(output)];
        }
        return output;
    };
    /**
     * Parse the given `str` with the given `options`.
     *
     * ```js
     * // braces.parse(pattern, [, options]);
     * const ast = braces.parse('a/{b,c}/d');
     * console.log(ast);
     * ```
     * @param {String} pattern Brace pattern to parse
     * @param {Object} options
     * @return {Object} Returns an AST
     * @api public
     */
    braces.parse = (input, options = {}) => parse_1$1(input, options);
    /**
     * Creates a braces string from an AST, or an AST node.
     *
     * ```js
     * const braces = require('braces');
     * let ast = braces.parse('foo/{a,b}/bar');
     * console.log(stringify(ast.nodes[2])); //=> '{a,b}'
     * ```
     * @param {String} `input` Brace pattern or AST.
     * @param {Object} `options`
     * @return {Array} Returns an array of expanded values.
     * @api public
     */
    braces.stringify = (input, options = {}) => {
        if (typeof input === 'string') {
            return stringify(braces.parse(input, options), options);
        }
        return stringify(input, options);
    };
    /**
     * Compiles a brace pattern into a regex-compatible, optimized string.
     * This method is called by the main [braces](#braces) function by default.
     *
     * ```js
     * const braces = require('braces');
     * console.log(braces.compile('a/{b,c}/d'));
     * //=> ['a/(b|c)/d']
     * ```
     * @param {String} `input` Brace pattern or AST.
     * @param {Object} `options`
     * @return {Array} Returns an array of expanded values.
     * @api public
     */
    braces.compile = (input, options = {}) => {
        if (typeof input === 'string') {
            input = braces.parse(input, options);
        }
        return compile_1(input, options);
    };
    /**
     * Expands a brace pattern into an array. This method is called by the
     * main [braces](#braces) function when `options.expand` is true. Before
     * using this method it's recommended that you read the [performance notes](#performance))
     * and advantages of using [.compile](#compile) instead.
     *
     * ```js
     * const braces = require('braces');
     * console.log(braces.expand('a/{b,c}/d'));
     * //=> ['a/b/d', 'a/c/d'];
     * ```
     * @param {String} `pattern` Brace pattern
     * @param {Object} `options`
     * @return {Array} Returns an array of expanded values.
     * @api public
     */
    braces.expand = (input, options = {}) => {
        if (typeof input === 'string') {
            input = braces.parse(input, options);
        }
        let result = expand_1(input, options);
        // filter out empty strings if specified
        if (options.noempty === true) {
            result = result.filter(Boolean);
        }
        // filter out duplicates if specified
        if (options.nodupes === true) {
            result = [...new Set(result)];
        }
        return result;
    };
    /**
     * Processes a brace pattern and returns either an expanded array
     * (if `options.expand` is true), a highly optimized regex-compatible string.
     * This method is called by the main [braces](#braces) function.
     *
     * ```js
     * const braces = require('braces');
     * console.log(braces.create('user-{200..300}/project-{a,b,c}-{1..10}'))
     * //=> 'user-(20[0-9]|2[1-9][0-9]|300)/project-(a|b|c)-([1-9]|10)'
     * ```
     * @param {String} `pattern` Brace pattern
     * @param {Object} `options`
     * @return {Array} Returns an array of expanded values.
     * @api public
     */
    braces.create = (input, options = {}) => {
        if (input === '' || input.length < 3) {
            return [input];
        }
        return options.expand !== true
            ? braces.compile(input, options)
            : braces.expand(input, options);
    };
    /**
     * Expose "braces"
     */
    var braces_1 = braces;

    const WIN_SLASH$1 = '\\\\/';
    const WIN_NO_SLASH$1 = `[^${WIN_SLASH$1}]`;
    /**
     * Posix glob regex
     */
    const DOT_LITERAL$1 = '\\.';
    const PLUS_LITERAL$1 = '\\+';
    const QMARK_LITERAL$1 = '\\?';
    const SLASH_LITERAL$1 = '\\/';
    const ONE_CHAR$1 = '(?=.)';
    const QMARK$1 = '[^/]';
    const END_ANCHOR$1 = `(?:${SLASH_LITERAL$1}|$)`;
    const START_ANCHOR$1 = `(?:^|${SLASH_LITERAL$1})`;
    const DOTS_SLASH$1 = `${DOT_LITERAL$1}{1,2}${END_ANCHOR$1}`;
    const NO_DOT$1 = `(?!${DOT_LITERAL$1})`;
    const NO_DOTS$1 = `(?!${START_ANCHOR$1}${DOTS_SLASH$1})`;
    const NO_DOT_SLASH$1 = `(?!${DOT_LITERAL$1}{0,1}${END_ANCHOR$1})`;
    const NO_DOTS_SLASH$1 = `(?!${DOTS_SLASH$1})`;
    const QMARK_NO_DOT$1 = `[^.${SLASH_LITERAL$1}]`;
    const STAR$1 = `${QMARK$1}*?`;
    const POSIX_CHARS$1 = {
        DOT_LITERAL: DOT_LITERAL$1,
        PLUS_LITERAL: PLUS_LITERAL$1,
        QMARK_LITERAL: QMARK_LITERAL$1,
        SLASH_LITERAL: SLASH_LITERAL$1,
        ONE_CHAR: ONE_CHAR$1,
        QMARK: QMARK$1,
        END_ANCHOR: END_ANCHOR$1,
        DOTS_SLASH: DOTS_SLASH$1,
        NO_DOT: NO_DOT$1,
        NO_DOTS: NO_DOTS$1,
        NO_DOT_SLASH: NO_DOT_SLASH$1,
        NO_DOTS_SLASH: NO_DOTS_SLASH$1,
        QMARK_NO_DOT: QMARK_NO_DOT$1,
        STAR: STAR$1,
        START_ANCHOR: START_ANCHOR$1
    };
    /**
     * Windows glob regex
     */
    const WINDOWS_CHARS$1 = Object.assign({}, POSIX_CHARS$1, { SLASH_LITERAL: `[${WIN_SLASH$1}]`, QMARK: WIN_NO_SLASH$1, STAR: `${WIN_NO_SLASH$1}*?`, DOTS_SLASH: `${DOT_LITERAL$1}{1,2}(?:[${WIN_SLASH$1}]|$)`, NO_DOT: `(?!${DOT_LITERAL$1})`, NO_DOTS: `(?!(?:^|[${WIN_SLASH$1}])${DOT_LITERAL$1}{1,2}(?:[${WIN_SLASH$1}]|$))`, NO_DOT_SLASH: `(?!${DOT_LITERAL$1}{0,1}(?:[${WIN_SLASH$1}]|$))`, NO_DOTS_SLASH: `(?!${DOT_LITERAL$1}{1,2}(?:[${WIN_SLASH$1}]|$))`, QMARK_NO_DOT: `[^.${WIN_SLASH$1}]`, START_ANCHOR: `(?:^|[${WIN_SLASH$1}])`, END_ANCHOR: `(?:[${WIN_SLASH$1}]|$)` });
    /**
     * POSIX Bracket Regex
     */
    const POSIX_REGEX_SOURCE$2 = {
        alnum: 'a-zA-Z0-9',
        alpha: 'a-zA-Z',
        ascii: '\\x00-\\x7F',
        blank: ' \\t',
        cntrl: '\\x00-\\x1F\\x7F',
        digit: '0-9',
        graph: '\\x21-\\x7E',
        lower: 'a-z',
        print: '\\x20-\\x7E ',
        punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
        space: ' \\t\\r\\n\\v\\f',
        upper: 'A-Z',
        word: 'A-Za-z0-9_',
        xdigit: 'A-Fa-f0-9'
    };
    var constants$1$1 = {
        MAX_LENGTH: 1024 * 64,
        POSIX_REGEX_SOURCE: POSIX_REGEX_SOURCE$2,
        // regular expressions
        REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
        REGEX_NON_SPECIAL_CHAR: /^[^@![\].,$*+?^{}()|\\/]+/,
        REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
        REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
        REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
        REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,
        // Replace globs with equivalent patterns to reduce parsing time.
        REPLACEMENTS: {
            '***': '*',
            '**/**': '**',
            '**/**/**': '**'
        },
        // Digits
        CHAR_0: 48,
        CHAR_9: 57,
        // Alphabet chars.
        CHAR_UPPERCASE_A: 65,
        CHAR_LOWERCASE_A: 97,
        CHAR_UPPERCASE_Z: 90,
        CHAR_LOWERCASE_Z: 122,
        CHAR_LEFT_PARENTHESES: 40,
        CHAR_RIGHT_PARENTHESES: 41,
        CHAR_ASTERISK: 42,
        // Non-alphabetic chars.
        CHAR_AMPERSAND: 38,
        CHAR_AT: 64,
        CHAR_BACKWARD_SLASH: 92,
        CHAR_CARRIAGE_RETURN: 13,
        CHAR_CIRCUMFLEX_ACCENT: 94,
        CHAR_COLON: 58,
        CHAR_COMMA: 44,
        CHAR_DOT: 46,
        CHAR_DOUBLE_QUOTE: 34,
        CHAR_EQUAL: 61,
        CHAR_EXCLAMATION_MARK: 33,
        CHAR_FORM_FEED: 12,
        CHAR_FORWARD_SLASH: 47,
        CHAR_GRAVE_ACCENT: 96,
        CHAR_HASH: 35,
        CHAR_HYPHEN_MINUS: 45,
        CHAR_LEFT_ANGLE_BRACKET: 60,
        CHAR_LEFT_CURLY_BRACE: 123,
        CHAR_LEFT_SQUARE_BRACKET: 91,
        CHAR_LINE_FEED: 10,
        CHAR_NO_BREAK_SPACE: 160,
        CHAR_PERCENT: 37,
        CHAR_PLUS: 43,
        CHAR_QUESTION_MARK: 63,
        CHAR_RIGHT_ANGLE_BRACKET: 62,
        CHAR_RIGHT_CURLY_BRACE: 125,
        CHAR_RIGHT_SQUARE_BRACKET: 93,
        CHAR_SEMICOLON: 59,
        CHAR_SINGLE_QUOTE: 39,
        CHAR_SPACE: 32,
        CHAR_TAB: 9,
        CHAR_UNDERSCORE: 95,
        CHAR_VERTICAL_LINE: 124,
        CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279,
        SEP: require$$0__default['default'].sep,
        /**
         * Create EXTGLOB_CHARS
         */
        extglobChars(chars) {
            return {
                '!': { type: 'negate', open: '(?:(?!(?:', close: `))${chars.STAR})` },
                '?': { type: 'qmark', open: '(?:', close: ')?' },
                '+': { type: 'plus', open: '(?:', close: ')+' },
                '*': { type: 'star', open: '(?:', close: ')*' },
                '@': { type: 'at', open: '(?:', close: ')' }
            };
        },
        /**
         * Create GLOB_CHARS
         */
        globChars(win32) {
            return win32 === true ? WINDOWS_CHARS$1 : POSIX_CHARS$1;
        }
    };

    var utils$1$1 = createCommonjsModule(function (module, exports) {
        const win32 = process.platform === 'win32';
        const { REGEX_SPECIAL_CHARS, REGEX_SPECIAL_CHARS_GLOBAL, REGEX_REMOVE_BACKSLASH } = constants$1$1;
        exports.isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);
        exports.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str);
        exports.isRegexChar = str => str.length === 1 && exports.hasRegexChars(str);
        exports.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
        exports.toPosixSlashes = str => str.replace(/\\/g, '/');
        exports.removeBackslashes = str => {
            return str.replace(REGEX_REMOVE_BACKSLASH, match => {
                return match === '\\' ? '' : match;
            });
        };
        exports.supportsLookbehinds = () => {
            let segs = process.version.slice(1).split('.');
            if (segs.length === 3 && +segs[0] >= 9 || (+segs[0] === 8 && +segs[1] >= 10)) {
                return true;
            }
            return false;
        };
        exports.isWindows = options => {
            if (options && typeof options.windows === 'boolean') {
                return options.windows;
            }
            return win32 === true || require$$0__default['default'].sep === '\\';
        };
        exports.escapeLast = (input, char, lastIdx) => {
            let idx = input.lastIndexOf(char, lastIdx);
            if (idx === -1)
                return input;
            if (input[idx - 1] === '\\')
                return exports.escapeLast(input, char, idx - 1);
            return input.slice(0, idx) + '\\' + input.slice(idx);
        };
    });
    utils$1$1.isObject;
    utils$1$1.hasRegexChars;
    utils$1$1.isRegexChar;
    utils$1$1.escapeRegex;
    utils$1$1.toPosixSlashes;
    utils$1$1.removeBackslashes;
    utils$1$1.supportsLookbehinds;
    utils$1$1.isWindows;
    utils$1$1.escapeLast;

    const { CHAR_ASTERISK: CHAR_ASTERISK$1, /* * */ CHAR_AT: CHAR_AT$1, /* @ */ CHAR_BACKWARD_SLASH: CHAR_BACKWARD_SLASH$1, /* \ */ CHAR_COMMA: CHAR_COMMA$1$1, /* , */ CHAR_DOT: CHAR_DOT$1$1, /* . */ CHAR_EXCLAMATION_MARK: CHAR_EXCLAMATION_MARK$1, /* ! */ CHAR_FORWARD_SLASH: CHAR_FORWARD_SLASH$1, /* / */ CHAR_LEFT_CURLY_BRACE: CHAR_LEFT_CURLY_BRACE$1$1, /* { */ CHAR_LEFT_PARENTHESES: CHAR_LEFT_PARENTHESES$1$1, /* ( */ CHAR_LEFT_SQUARE_BRACKET: CHAR_LEFT_SQUARE_BRACKET$1$1, /* [ */ CHAR_PLUS: CHAR_PLUS$1, /* + */ CHAR_QUESTION_MARK: CHAR_QUESTION_MARK$1, /* ? */ CHAR_RIGHT_CURLY_BRACE: CHAR_RIGHT_CURLY_BRACE$1$1, /* } */ CHAR_RIGHT_PARENTHESES: CHAR_RIGHT_PARENTHESES$1$1, /* ) */ CHAR_RIGHT_SQUARE_BRACKET: CHAR_RIGHT_SQUARE_BRACKET$1$1 /* ] */ } = constants$1$1;
    const isPathSeparator$1 = code => {
        return code === CHAR_FORWARD_SLASH$1 || code === CHAR_BACKWARD_SLASH$1;
    };
    /**
     * Quickly scans a glob pattern and returns an object with a handful of
     * useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
     * `glob` (the actual pattern), and `negated` (true if the path starts with `!`).
     *
     * ```js
     * const pm = require('picomatch');
     * console.log(pm.scan('foo/bar/*.js'));
     * { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
     * ```
     * @param {String} `str`
     * @param {Object} `options`
     * @return {Object} Returns an object with tokens and regex source string.
     * @api public
     */
    var scan$2 = (input, options) => {
        let opts = options || {};
        let length = input.length - 1;
        let index = -1;
        let start = 0;
        let lastIndex = 0;
        let isGlob = false;
        let backslashes = false;
        let negated = false;
        let braces = 0;
        let prev;
        let code;
        let braceEscaped = false;
        let eos = () => index >= length;
        let advance = () => {
            prev = code;
            return input.charCodeAt(++index);
        };
        while (index < length) {
            code = advance();
            let next;
            if (code === CHAR_BACKWARD_SLASH$1) {
                backslashes = true;
                next = advance();
                if (next === CHAR_LEFT_CURLY_BRACE$1$1) {
                    braceEscaped = true;
                }
                continue;
            }
            if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE$1$1) {
                braces++;
                while (!eos() && (next = advance())) {
                    if (next === CHAR_BACKWARD_SLASH$1) {
                        backslashes = true;
                        next = advance();
                        continue;
                    }
                    if (next === CHAR_LEFT_CURLY_BRACE$1$1) {
                        braces++;
                        continue;
                    }
                    if (!braceEscaped && next === CHAR_DOT$1$1 && (next = advance()) === CHAR_DOT$1$1) {
                        isGlob = true;
                        break;
                    }
                    if (!braceEscaped && next === CHAR_COMMA$1$1) {
                        isGlob = true;
                        break;
                    }
                    if (next === CHAR_RIGHT_CURLY_BRACE$1$1) {
                        braces--;
                        if (braces === 0) {
                            braceEscaped = false;
                            break;
                        }
                    }
                }
            }
            if (code === CHAR_FORWARD_SLASH$1) {
                if (prev === CHAR_DOT$1$1 && index === (start + 1)) {
                    start += 2;
                    continue;
                }
                lastIndex = index + 1;
                continue;
            }
            if (code === CHAR_ASTERISK$1) {
                isGlob = true;
                break;
            }
            if (code === CHAR_ASTERISK$1 || code === CHAR_QUESTION_MARK$1) {
                isGlob = true;
                break;
            }
            if (code === CHAR_LEFT_SQUARE_BRACKET$1$1) {
                while (!eos() && (next = advance())) {
                    if (next === CHAR_BACKWARD_SLASH$1) {
                        backslashes = true;
                        next = advance();
                        continue;
                    }
                    if (next === CHAR_RIGHT_SQUARE_BRACKET$1$1) {
                        isGlob = true;
                        break;
                    }
                }
            }
            let isExtglobChar = code === CHAR_PLUS$1
                || code === CHAR_AT$1
                || code === CHAR_EXCLAMATION_MARK$1;
            if (isExtglobChar && input.charCodeAt(index + 1) === CHAR_LEFT_PARENTHESES$1$1) {
                isGlob = true;
                break;
            }
            if (code === CHAR_EXCLAMATION_MARK$1 && index === start) {
                negated = true;
                start++;
                continue;
            }
            if (code === CHAR_LEFT_PARENTHESES$1$1) {
                while (!eos() && (next = advance())) {
                    if (next === CHAR_BACKWARD_SLASH$1) {
                        backslashes = true;
                        next = advance();
                        continue;
                    }
                    if (next === CHAR_RIGHT_PARENTHESES$1$1) {
                        isGlob = true;
                        break;
                    }
                }
            }
            if (isGlob) {
                break;
            }
        }
        let prefix = '';
        let orig = input;
        let base = input;
        let glob = '';
        if (start > 0) {
            prefix = input.slice(0, start);
            input = input.slice(start);
            lastIndex -= start;
        }
        if (base && isGlob === true && lastIndex > 0) {
            base = input.slice(0, lastIndex);
            glob = input.slice(lastIndex);
        }
        else if (isGlob === true) {
            base = '';
            glob = input;
        }
        else {
            base = input;
        }
        if (base && base !== '' && base !== '/' && base !== input) {
            if (isPathSeparator$1(base.charCodeAt(base.length - 1))) {
                base = base.slice(0, -1);
            }
        }
        if (opts.unescape === true) {
            if (glob)
                glob = utils$1$1.removeBackslashes(glob);
            if (base && backslashes === true) {
                base = utils$1$1.removeBackslashes(base);
            }
        }
        return { prefix, input: orig, base, glob, negated, isGlob };
    };

    /**
     * Constants
     */
    const { MAX_LENGTH: MAX_LENGTH$1$1, POSIX_REGEX_SOURCE: POSIX_REGEX_SOURCE$1$1, REGEX_NON_SPECIAL_CHAR, REGEX_SPECIAL_CHARS_BACKREF: REGEX_SPECIAL_CHARS_BACKREF$1, REPLACEMENTS: REPLACEMENTS$1 } = constants$1$1;
    /**
     * Helpers
     */
    const expandRange$1 = (args, options) => {
        if (typeof options.expandRange === 'function') {
            return options.expandRange(...args, options);
        }
        args.sort();
        let value = `[${args.join('-')}]`;
        return value;
    };
    const negate = state => {
        let count = 1;
        while (state.peek() === '!' && (state.peek(2) !== '(' || state.peek(3) === '?')) {
            state.advance();
            state.start++;
            count++;
        }
        if (count % 2 === 0) {
            return false;
        }
        state.negated = true;
        state.start++;
        return true;
    };
    /**
     * Create the message for a syntax error
     */
    const syntaxError$1 = (type, char) => {
        return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
    };
    /**
     * Parse the given input string.
     * @param {String} input
     * @param {Object} options
     * @return {Object}
     */
    const parse$1$1 = (input, options) => {
        if (typeof input !== 'string') {
            throw new TypeError('Expected a string');
        }
        input = REPLACEMENTS$1[input] || input;
        let opts = Object.assign({}, options);
        let max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH$1$1, opts.maxLength) : MAX_LENGTH$1$1;
        let len = input.length;
        if (len > max) {
            throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
        }
        let bos = { type: 'bos', value: '', output: opts.prepend || '' };
        let tokens = [bos];
        let capture = opts.capture ? '' : '?:';
        let win32 = utils$1$1.isWindows(options);
        // create constants based on platform, for windows or posix
        const PLATFORM_CHARS = constants$1$1.globChars(win32);
        const EXTGLOB_CHARS = constants$1$1.extglobChars(PLATFORM_CHARS);
        const { DOT_LITERAL, PLUS_LITERAL, SLASH_LITERAL, ONE_CHAR, DOTS_SLASH, NO_DOT, NO_DOT_SLASH, NO_DOTS_SLASH, QMARK, QMARK_NO_DOT, STAR, START_ANCHOR } = PLATFORM_CHARS;
        const globstar = (opts) => {
            return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
        };
        let nodot = opts.dot ? '' : NO_DOT;
        let star = opts.bash === true ? globstar(opts) : STAR;
        let qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
        if (opts.capture) {
            star = `(${star})`;
        }
        // minimatch options support
        if (typeof opts.noext === 'boolean') {
            opts.noextglob = opts.noext;
        }
        let state = {
            index: -1,
            start: 0,
            consumed: '',
            output: '',
            backtrack: false,
            brackets: 0,
            braces: 0,
            parens: 0,
            quotes: 0,
            tokens
        };
        let extglobs = [];
        let stack = [];
        let prev = bos;
        let value;
        /**
         * Tokenizing helpers
         */
        const eos = () => state.index === len - 1;
        const peek = state.peek = (n = 1) => input[state.index + n];
        const advance = state.advance = () => input[++state.index];
        const append = token => {
            state.output += token.output != null ? token.output : token.value;
            state.consumed += token.value || '';
        };
        const increment = type => {
            state[type]++;
            stack.push(type);
        };
        const decrement = type => {
            state[type]--;
            stack.pop();
        };
        /**
         * Push tokens onto the tokens array. This helper speeds up
         * tokenizing by 1) helping us avoid backtracking as much as possible,
         * and 2) helping us avoid creating extra tokens when consecutive
         * characters are plain text. This improves performance and simplifies
         * lookbehinds.
         */
        const push = tok => {
            if (prev.type === 'globstar') {
                let isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
                let isExtglob = extglobs.length && (tok.type === 'pipe' || tok.type === 'paren');
                if (tok.type !== 'slash' && tok.type !== 'paren' && !isBrace && !isExtglob) {
                    state.output = state.output.slice(0, -prev.output.length);
                    prev.type = 'star';
                    prev.value = '*';
                    prev.output = star;
                    state.output += prev.output;
                }
            }
            if (extglobs.length && tok.type !== 'paren' && !EXTGLOB_CHARS[tok.value]) {
                extglobs[extglobs.length - 1].inner += tok.value;
            }
            if (tok.value || tok.output)
                append(tok);
            if (prev && prev.type === 'text' && tok.type === 'text') {
                prev.value += tok.value;
                return;
            }
            tok.prev = prev;
            tokens.push(tok);
            prev = tok;
        };
        const extglobOpen = (type, value) => {
            let token = Object.assign({}, EXTGLOB_CHARS[value], { conditions: 1, inner: '' });
            token.prev = prev;
            token.parens = state.parens;
            token.output = state.output;
            let output = (opts.capture ? '(' : '') + token.open;
            push({ type, value, output: state.output ? '' : ONE_CHAR });
            push({ type: 'paren', extglob: true, value: advance(), output });
            increment('parens');
            extglobs.push(token);
        };
        const extglobClose = token => {
            let output = token.close + (opts.capture ? ')' : '');
            if (token.type === 'negate') {
                let extglobStar = star;
                if (token.inner && token.inner.length > 1 && token.inner.includes('/')) {
                    extglobStar = globstar(opts);
                }
                if (extglobStar !== star || eos() || /^\)+$/.test(input.slice(state.index + 1))) {
                    output = token.close = ')$))' + extglobStar;
                }
                if (token.prev.type === 'bos' && eos()) {
                    state.negatedExtglob = true;
                }
            }
            push({ type: 'paren', extglob: true, value, output });
            decrement('parens');
        };
        if (opts.fastpaths !== false && !/(^[*!]|[/{[()\]}"])/.test(input)) {
            let backslashes = false;
            let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF$1, (m, esc, chars, first, rest, index) => {
                if (first === '\\') {
                    backslashes = true;
                    return m;
                }
                if (first === '?') {
                    if (esc) {
                        return esc + first + (rest ? QMARK.repeat(rest.length) : '');
                    }
                    if (index === 0) {
                        return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : '');
                    }
                    return QMARK.repeat(chars.length);
                }
                if (first === '.') {
                    return DOT_LITERAL.repeat(chars.length);
                }
                if (first === '*') {
                    if (esc) {
                        return esc + first + (rest ? star : '');
                    }
                    return star;
                }
                return esc ? m : '\\' + m;
            });
            if (backslashes === true) {
                if (opts.unescape === true) {
                    output = output.replace(/\\/g, '');
                }
                else {
                    output = output.replace(/\\+/g, m => {
                        return m.length % 2 === 0 ? '\\\\' : (m ? '\\' : '');
                    });
                }
            }
            state.output = output;
            return state;
        }
        /**
         * Tokenize input until we reach end-of-string
         */
        while (!eos()) {
            value = advance();
            if (value === '\u0000') {
                continue;
            }
            /**
             * Escaped characters
             */
            if (value === '\\') {
                let next = peek();
                if (next === '/' && opts.bash !== true) {
                    continue;
                }
                if (next === '.' || next === ';') {
                    continue;
                }
                if (!next) {
                    value += '\\';
                    push({ type: 'text', value });
                    continue;
                }
                // collapse slashes to reduce potential for exploits
                let match = /^\\+/.exec(input.slice(state.index + 1));
                let slashes = 0;
                if (match && match[0].length > 2) {
                    slashes = match[0].length;
                    state.index += slashes;
                    if (slashes % 2 !== 0) {
                        value += '\\';
                    }
                }
                if (opts.unescape === true) {
                    value = advance() || '';
                }
                else {
                    value += advance() || '';
                }
                if (state.brackets === 0) {
                    push({ type: 'text', value });
                    continue;
                }
            }
            /**
             * If we're inside a regex character class, continue
             * until we reach the closing bracket.
             */
            if (state.brackets > 0 && (value !== ']' || prev.value === '[' || prev.value === '[^')) {
                if (opts.posix !== false && value === ':') {
                    let inner = prev.value.slice(1);
                    if (inner.includes('[')) {
                        prev.posix = true;
                        if (inner.includes(':')) {
                            let idx = prev.value.lastIndexOf('[');
                            let pre = prev.value.slice(0, idx);
                            let rest = prev.value.slice(idx + 2);
                            let posix = POSIX_REGEX_SOURCE$1$1[rest];
                            if (posix) {
                                prev.value = pre + posix;
                                state.backtrack = true;
                                advance();
                                if (!bos.output && tokens.indexOf(prev) === 1) {
                                    bos.output = ONE_CHAR;
                                }
                                continue;
                            }
                        }
                    }
                }
                if ((value === '[' && peek() !== ':') || (value === '-' && peek() === ']')) {
                    value = '\\' + value;
                }
                if (value === ']' && (prev.value === '[' || prev.value === '[^')) {
                    value = '\\' + value;
                }
                if (opts.posix === true && value === '!' && prev.value === '[') {
                    value = '^';
                }
                prev.value += value;
                append({ value });
                continue;
            }
            /**
             * If we're inside a quoted string, continue
             * until we reach the closing double quote.
             */
            if (state.quotes === 1 && value !== '"') {
                value = utils$1$1.escapeRegex(value);
                prev.value += value;
                append({ value });
                continue;
            }
            /**
             * Double quotes
             */
            if (value === '"') {
                state.quotes = state.quotes === 1 ? 0 : 1;
                if (opts.keepQuotes === true) {
                    push({ type: 'text', value });
                }
                continue;
            }
            /**
             * Parentheses
             */
            if (value === '(') {
                push({ type: 'paren', value });
                increment('parens');
                continue;
            }
            if (value === ')') {
                if (state.parens === 0 && opts.strictBrackets === true) {
                    throw new SyntaxError(syntaxError$1('opening', '('));
                }
                let extglob = extglobs[extglobs.length - 1];
                if (extglob && state.parens === extglob.parens + 1) {
                    extglobClose(extglobs.pop());
                    continue;
                }
                push({ type: 'paren', value, output: state.parens ? ')' : '\\)' });
                decrement('parens');
                continue;
            }
            /**
             * Brackets
             */
            if (value === '[') {
                if (opts.nobracket === true || !input.slice(state.index + 1).includes(']')) {
                    if (opts.nobracket !== true && opts.strictBrackets === true) {
                        throw new SyntaxError(syntaxError$1('closing', ']'));
                    }
                    value = '\\' + value;
                }
                else {
                    increment('brackets');
                }
                push({ type: 'bracket', value });
                continue;
            }
            if (value === ']') {
                if (opts.nobracket === true || (prev && prev.type === 'bracket' && prev.value.length === 1)) {
                    push({ type: 'text', value, output: '\\' + value });
                    continue;
                }
                if (state.brackets === 0) {
                    if (opts.strictBrackets === true) {
                        throw new SyntaxError(syntaxError$1('opening', '['));
                    }
                    push({ type: 'text', value, output: '\\' + value });
                    continue;
                }
                decrement('brackets');
                let prevValue = prev.value.slice(1);
                if (prev.posix !== true && prevValue[0] === '^' && !prevValue.includes('/')) {
                    value = '/' + value;
                }
                prev.value += value;
                append({ value });
                // when literal brackets are explicitly disabled
                // assume we should match with a regex character class
                if (opts.literalBrackets === false || utils$1$1.hasRegexChars(prevValue)) {
                    continue;
                }
                let escaped = utils$1$1.escapeRegex(prev.value);
                state.output = state.output.slice(0, -prev.value.length);
                // when literal brackets are explicitly enabled
                // assume we should escape the brackets to match literal characters
                if (opts.literalBrackets === true) {
                    state.output += escaped;
                    prev.value = escaped;
                    continue;
                }
                // when the user specifies nothing, try to match both
                prev.value = `(${capture}${escaped}|${prev.value})`;
                state.output += prev.value;
                continue;
            }
            /**
             * Braces
             */
            if (value === '{' && opts.nobrace !== true) {
                push({ type: 'brace', value, output: '(' });
                increment('braces');
                continue;
            }
            if (value === '}') {
                if (opts.nobrace === true || state.braces === 0) {
                    push({ type: 'text', value, output: '\\' + value });
                    continue;
                }
                let output = ')';
                if (state.dots === true) {
                    let arr = tokens.slice();
                    let range = [];
                    for (let i = arr.length - 1; i >= 0; i--) {
                        tokens.pop();
                        if (arr[i].type === 'brace') {
                            break;
                        }
                        if (arr[i].type !== 'dots') {
                            range.unshift(arr[i].value);
                        }
                    }
                    output = expandRange$1(range, opts);
                    state.backtrack = true;
                }
                push({ type: 'brace', value, output });
                decrement('braces');
                continue;
            }
            /**
             * Pipes
             */
            if (value === '|') {
                if (extglobs.length > 0) {
                    extglobs[extglobs.length - 1].conditions++;
                }
                push({ type: 'text', value });
                continue;
            }
            /**
             * Commas
             */
            if (value === ',') {
                let output = value;
                if (state.braces > 0 && stack[stack.length - 1] === 'braces') {
                    output = '|';
                }
                push({ type: 'comma', value, output });
                continue;
            }
            /**
             * Slashes
             */
            if (value === '/') {
                // if the beginning of the glob is "./", advance the start
                // to the current index, and don't add the "./" characters
                // to the state. This greatly simplifies lookbehinds when
                // checking for BOS characters like "!" and "." (not "./")
                if (prev.type === 'dot' && state.index === 1) {
                    state.start = state.index + 1;
                    state.consumed = '';
                    state.output = '';
                    tokens.pop();
                    prev = bos; // reset "prev" to the first token
                    continue;
                }
                push({ type: 'slash', value, output: SLASH_LITERAL });
                continue;
            }
            /**
             * Dots
             */
            if (value === '.') {
                if (state.braces > 0 && prev.type === 'dot') {
                    if (prev.value === '.')
                        prev.output = DOT_LITERAL;
                    prev.type = 'dots';
                    prev.output += value;
                    prev.value += value;
                    state.dots = true;
                    continue;
                }
                push({ type: 'dot', value, output: DOT_LITERAL });
                continue;
            }
            /**
             * Question marks
             */
            if (value === '?') {
                if (prev && prev.type === 'paren') {
                    let next = peek();
                    let output = value;
                    if (next === '<' && !utils$1$1.supportsLookbehinds()) {
                        throw new Error('Node.js v10 or higher is required for regex lookbehinds');
                    }
                    if (prev.value === '(' && !/[!=<:]/.test(next) || (next === '<' && !/[!=]/.test(peek(2)))) {
                        output = '\\' + value;
                    }
                    push({ type: 'text', value, output });
                    continue;
                }
                if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
                    extglobOpen('qmark', value);
                    continue;
                }
                if (opts.dot !== true && (prev.type === 'slash' || prev.type === 'bos')) {
                    push({ type: 'qmark', value, output: QMARK_NO_DOT });
                    continue;
                }
                push({ type: 'qmark', value, output: QMARK });
                continue;
            }
            /**
             * Exclamation
             */
            if (value === '!') {
                if (opts.noextglob !== true && peek() === '(') {
                    if (peek(2) !== '?' || !/[!=<:]/.test(peek(3))) {
                        extglobOpen('negate', value);
                        continue;
                    }
                }
                if (opts.nonegate !== true && state.index === 0) {
                    negate(state);
                    continue;
                }
            }
            /**
             * Plus
             */
            if (value === '+') {
                if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
                    extglobOpen('plus', value);
                    continue;
                }
                if (prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace')) {
                    let output = prev.extglob === true ? '\\' + value : value;
                    push({ type: 'plus', value, output });
                    continue;
                }
                // use regex behavior inside parens
                if (state.parens > 0 && opts.regex !== false) {
                    push({ type: 'plus', value });
                    continue;
                }
                push({ type: 'plus', value: PLUS_LITERAL });
                continue;
            }
            /**
             * Plain text
             */
            if (value === '@') {
                if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
                    push({ type: 'at', value, output: '' });
                    continue;
                }
                push({ type: 'text', value });
                continue;
            }
            /**
             * Plain text
             */
            if (value !== '*') {
                if (value === '$' || value === '^') {
                    value = '\\' + value;
                }
                let match = REGEX_NON_SPECIAL_CHAR.exec(input.slice(state.index + 1));
                if (match) {
                    value += match[0];
                    state.index += match[0].length;
                }
                push({ type: 'text', value });
                continue;
            }
            /**
             * Stars
             */
            if (prev && (prev.type === 'globstar' || prev.star === true)) {
                prev.type = 'star';
                prev.star = true;
                prev.value += value;
                prev.output = star;
                state.backtrack = true;
                state.consumed += value;
                continue;
            }
            if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
                extglobOpen('star', value);
                continue;
            }
            if (prev.type === 'star') {
                if (opts.noglobstar === true) {
                    state.consumed += value;
                    continue;
                }
                let prior = prev.prev;
                let before = prior.prev;
                let isStart = prior.type === 'slash' || prior.type === 'bos';
                let afterStar = before && (before.type === 'star' || before.type === 'globstar');
                if (opts.bash === true && (!isStart || (!eos() && peek() !== '/'))) {
                    push({ type: 'star', value, output: '' });
                    continue;
                }
                let isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
                let isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
                if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
                    push({ type: 'star', value, output: '' });
                    continue;
                }
                // strip consecutive `/**/`
                while (input.slice(state.index + 1, state.index + 4) === '/**') {
                    let after = input[state.index + 4];
                    if (after && after !== '/') {
                        break;
                    }
                    state.consumed += '/**';
                    state.index += 3;
                }
                if (prior.type === 'bos' && eos()) {
                    prev.type = 'globstar';
                    prev.value += value;
                    prev.output = globstar(opts);
                    state.output = prev.output;
                    state.consumed += value;
                    continue;
                }
                if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
                    state.output = state.output.slice(0, -(prior.output + prev.output).length);
                    prior.output = '(?:' + prior.output;
                    prev.type = 'globstar';
                    prev.output = globstar(opts) + '|$)';
                    prev.value += value;
                    state.output += prior.output + prev.output;
                    state.consumed += value;
                    continue;
                }
                let next = peek();
                if (prior.type === 'slash' && prior.prev.type !== 'bos' && next === '/') {
                    let end = peek(2) !== void 0 ? '|$' : '';
                    state.output = state.output.slice(0, -(prior.output + prev.output).length);
                    prior.output = '(?:' + prior.output;
                    prev.type = 'globstar';
                    prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
                    prev.value += value;
                    state.output += prior.output + prev.output;
                    state.consumed += value + advance();
                    push({ type: 'slash', value, output: '' });
                    continue;
                }
                if (prior.type === 'bos' && next === '/') {
                    prev.type = 'globstar';
                    prev.value += value;
                    prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
                    state.output = prev.output;
                    state.consumed += value + advance();
                    push({ type: 'slash', value, output: '' });
                    continue;
                }
                // remove single star from output
                state.output = state.output.slice(0, -prev.output.length);
                // reset previous token to globstar
                prev.type = 'globstar';
                prev.output = globstar(opts);
                prev.value += value;
                // reset output with globstar
                state.output += prev.output;
                state.consumed += value;
                continue;
            }
            let token = { type: 'star', value, output: star };
            if (opts.bash === true) {
                token.output = '.*?';
                if (prev.type === 'bos' || prev.type === 'slash') {
                    token.output = nodot + token.output;
                }
                push(token);
                continue;
            }
            if (prev && (prev.type === 'bracket' || prev.type === 'paren') && opts.regex === true) {
                token.output = value;
                push(token);
                continue;
            }
            if (state.index === state.start || prev.type === 'slash' || prev.type === 'dot') {
                if (prev.type === 'dot') {
                    state.output += NO_DOT_SLASH;
                    prev.output += NO_DOT_SLASH;
                }
                else if (opts.dot === true) {
                    state.output += NO_DOTS_SLASH;
                    prev.output += NO_DOTS_SLASH;
                }
                else {
                    state.output += nodot;
                    prev.output += nodot;
                }
                if (peek() !== '*') {
                    state.output += ONE_CHAR;
                    prev.output += ONE_CHAR;
                }
            }
            push(token);
        }
        while (state.brackets > 0) {
            if (opts.strictBrackets === true)
                throw new SyntaxError(syntaxError$1('closing', ']'));
            state.output = utils$1$1.escapeLast(state.output, '[');
            decrement('brackets');
        }
        while (state.parens > 0) {
            if (opts.strictBrackets === true)
                throw new SyntaxError(syntaxError$1('closing', ')'));
            state.output = utils$1$1.escapeLast(state.output, '(');
            decrement('parens');
        }
        while (state.braces > 0) {
            if (opts.strictBrackets === true)
                throw new SyntaxError(syntaxError$1('closing', '}'));
            state.output = utils$1$1.escapeLast(state.output, '{');
            decrement('braces');
        }
        if (opts.strictSlashes !== true && (prev.type === 'star' || prev.type === 'bracket')) {
            push({ type: 'maybe_slash', value: '', output: `${SLASH_LITERAL}?` });
        }
        // rebuild the output if we had to backtrack at any point
        if (state.backtrack === true) {
            state.output = '';
            for (let token of state.tokens) {
                state.output += token.output != null ? token.output : token.value;
                if (token.suffix) {
                    state.output += token.suffix;
                }
            }
        }
        return state;
    };
    /**
     * Fast paths for creating regular expressions for common glob patterns.
     * This can significantly speed up processing and has very little downside
     * impact when none of the fast paths match.
     */
    parse$1$1.fastpaths = (input, options) => {
        let opts = Object.assign({}, options);
        let max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH$1$1, opts.maxLength) : MAX_LENGTH$1$1;
        let len = input.length;
        if (len > max) {
            throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
        }
        input = REPLACEMENTS$1[input] || input;
        let win32 = utils$1$1.isWindows(options);
        // create constants based on platform, for windows or posix
        const { DOT_LITERAL, SLASH_LITERAL, ONE_CHAR, DOTS_SLASH, NO_DOT, NO_DOTS, NO_DOTS_SLASH, STAR, START_ANCHOR } = constants$1$1.globChars(win32);
        let capture = opts.capture ? '' : '?:';
        let star = opts.bash === true ? '.*?' : STAR;
        let nodot = opts.dot ? NO_DOTS : NO_DOT;
        let slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
        if (opts.capture) {
            star = `(${star})`;
        }
        const globstar = (opts) => {
            return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
        };
        const create = str => {
            switch (str) {
                case '*':
                    return `${nodot}${ONE_CHAR}${star}`;
                case '.*':
                    return `${DOT_LITERAL}${ONE_CHAR}${star}`;
                case '*.*':
                    return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
                case '*/*':
                    return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;
                case '**':
                    return nodot + globstar(opts);
                case '**/*':
                    return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;
                case '**/*.*':
                    return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;
                case '**/.*':
                    return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;
                default: {
                    let match = /^(.*?)\.(\w+)$/.exec(str);
                    if (!match)
                        return;
                    let source = create(match[1]);
                    if (!source)
                        return;
                    return source + DOT_LITERAL + match[2];
                }
            }
        };
        let output = create(input);
        if (output && opts.strictSlashes !== true) {
            output += `${SLASH_LITERAL}?`;
        }
        return output;
    };
    var parse_1$1$1 = parse$1$1;

    /**
     * Creates a matcher function from one or more glob patterns. The
     * returned function takes a string to match as its first argument,
     * and returns true if the string is a match. The returned matcher
     * function also takes a boolean as the second argument that, when true,
     * returns an object with additional information.
     *
     * ```js
     * const picomatch = require('picomatch');
     * // picomatch(glob[, options]);
     *
     * const isMatch = picomatch('*.!(*a)');
     * console.log(isMatch('a.a')); //=> false
     * console.log(isMatch('a.b')); //=> true
     * ```
     * @name picomatch
     * @param {String|Array} `globs` One or more glob patterns.
     * @param {Object=} `options`
     * @return {Function=} Returns a matcher function.
     * @api public
     */
    const picomatch$2 = (glob, options, returnState = false) => {
        if (Array.isArray(glob)) {
            let fns = glob.map(input => picomatch$2(input, options, returnState));
            return str => {
                for (let isMatch of fns) {
                    let state = isMatch(str);
                    if (state)
                        return state;
                }
                return false;
            };
        }
        if (typeof glob !== 'string' || glob === '') {
            throw new TypeError('Expected pattern to be a non-empty string');
        }
        let opts = options || {};
        let posix = utils$1$1.isWindows(options);
        let regex = picomatch$2.makeRe(glob, options, false, true);
        let state = regex.state;
        delete regex.state;
        let isIgnored = () => false;
        if (opts.ignore) {
            let ignoreOpts = Object.assign({}, options, { ignore: null, onMatch: null, onResult: null });
            isIgnored = picomatch$2(opts.ignore, ignoreOpts, returnState);
        }
        const matcher = (input, returnObject = false) => {
            let { isMatch, match, output } = picomatch$2.test(input, regex, options, { glob, posix });
            let result = { glob, state, regex, posix, input, output, match, isMatch };
            if (typeof opts.onResult === 'function') {
                opts.onResult(result);
            }
            if (isMatch === false) {
                result.isMatch = false;
                return returnObject ? result : false;
            }
            if (isIgnored(input)) {
                if (typeof opts.onIgnore === 'function') {
                    opts.onIgnore(result);
                }
                result.isMatch = false;
                return returnObject ? result : false;
            }
            if (typeof opts.onMatch === 'function') {
                opts.onMatch(result);
            }
            return returnObject ? result : true;
        };
        if (returnState) {
            matcher.state = state;
        }
        return matcher;
    };
    /**
     * Test `input` with the given `regex`. This is used by the main
     * `picomatch()` function to test the input string.
     *
     * ```js
     * const picomatch = require('picomatch');
     * // picomatch.test(input, regex[, options]);
     *
     * console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
     * // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
     * ```
     * @param {String} `input` String to test.
     * @param {RegExp} `regex`
     * @return {Object} Returns an object with matching info.
     * @api public
     */
    picomatch$2.test = (input, regex, options, { glob, posix } = {}) => {
        if (typeof input !== 'string') {
            throw new TypeError('Expected input to be a string');
        }
        if (input === '') {
            return { isMatch: false, output: '' };
        }
        let opts = options || {};
        let format = opts.format || (posix ? utils$1$1.toPosixSlashes : null);
        let match = input === glob;
        let output = (match && format) ? format(input) : input;
        if (match === false) {
            output = format ? format(input) : input;
            match = output === glob;
        }
        if (match === false || opts.capture === true) {
            if (opts.matchBase === true || opts.basename === true) {
                match = picomatch$2.matchBase(input, regex, options, posix);
            }
            else {
                match = regex.exec(output);
            }
        }
        return { isMatch: !!match, match, output };
    };
    /**
     * Match the basename of a filepath.
     *
     * ```js
     * const picomatch = require('picomatch');
     * // picomatch.matchBase(input, glob[, options]);
     * console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
     * ```
     * @param {String} `input` String to test.
     * @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
     * @return {Boolean}
     * @api public
     */
    picomatch$2.matchBase = (input, glob, options, posix = utils$1$1.isWindows(options)) => {
        let regex = glob instanceof RegExp ? glob : picomatch$2.makeRe(glob, options);
        return regex.test(require$$0__default['default'].basename(input));
    };
    /**
     * Returns true if **any** of the given glob `patterns` match the specified `string`.
     *
     * ```js
     * const picomatch = require('picomatch');
     * // picomatch.isMatch(string, patterns[, options]);
     *
     * console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
     * console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
     * ```
     * @param {String|Array} str The string to test.
     * @param {String|Array} patterns One or more glob patterns to use for matching.
     * @param {Object} [options] See available [options](#options).
     * @return {Boolean} Returns true if any patterns match `str`
     * @api public
     */
    picomatch$2.isMatch = (str, patterns, options) => picomatch$2(patterns, options)(str);
    /**
     * Parse a glob pattern to create the source string for a regular
     * expression.
     *
     * ```js
     * const picomatch = require('picomatch');
     * const result = picomatch.parse(glob[, options]);
     * ```
     * @param {String} `glob`
     * @param {Object} `options`
     * @return {Object} Returns an object with useful properties and output to be used as a regex source string.
     * @api public
     */
    picomatch$2.parse = (glob, options) => parse_1$1$1(glob, options);
    /**
     * Scan a glob pattern to separate the pattern into segments.
     *
     * ```js
     * const picomatch = require('picomatch');
     * // picomatch.scan(input[, options]);
     *
     * const result = picomatch.scan('!./foo/*.js');
     * console.log(result);
     * // { prefix: '!./',
     * //   input: '!./foo/*.js',
     * //   base: 'foo',
     * //   glob: '*.js',
     * //   negated: true,
     * //   isGlob: true }
     * ```
     * @param {String} `input` Glob pattern to scan.
     * @param {Object} `options`
     * @return {Object} Returns an object with
     * @api public
     */
    picomatch$2.scan = (input, options) => scan$2(input, options);
    /**
     * Create a regular expression from a glob pattern.
     *
     * ```js
     * const picomatch = require('picomatch');
     * // picomatch.makeRe(input[, options]);
     *
     * console.log(picomatch.makeRe('*.js'));
     * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
     * ```
     * @param {String} `input` A glob pattern to convert to regex.
     * @param {Object} `options`
     * @return {RegExp} Returns a regex created from the given pattern.
     * @api public
     */
    picomatch$2.makeRe = (input, options, returnOutput = false, returnState = false) => {
        if (!input || typeof input !== 'string') {
            throw new TypeError('Expected a non-empty string');
        }
        let opts = options || {};
        let prepend = opts.contains ? '' : '^';
        let append = opts.contains ? '' : '$';
        let state = { negated: false, fastpaths: true };
        let prefix = '';
        let output;
        if (input.startsWith('./')) {
            input = input.slice(2);
            prefix = state.prefix = './';
        }
        if (opts.fastpaths !== false && (input[0] === '.' || input[0] === '*')) {
            output = parse_1$1$1.fastpaths(input, options);
        }
        if (output === void 0) {
            state = picomatch$2.parse(input, options);
            state.prefix = prefix + (state.prefix || '');
            output = state.output;
        }
        if (returnOutput === true) {
            return output;
        }
        let source = `${prepend}(?:${output})${append}`;
        if (state && state.negated === true) {
            source = `^(?!${source}).*$`;
        }
        let regex = picomatch$2.toRegex(source, options);
        if (returnState === true) {
            regex.state = state;
        }
        return regex;
    };
    /**
     * Create a regular expression from the given regex source string.
     *
     * ```js
     * const picomatch = require('picomatch');
     * // picomatch.toRegex(source[, options]);
     *
     * const { output } = picomatch.parse('*.js');
     * console.log(picomatch.toRegex(output));
     * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
     * ```
     * @param {String} `source` Regular expression source string.
     * @param {Object} `options`
     * @return {RegExp}
     * @api public
     */
    picomatch$2.toRegex = (source, options) => {
        try {
            let opts = options || {};
            return new RegExp(source, opts.flags || (opts.nocase ? 'i' : ''));
        }
        catch (err) {
            if (options && options.debug === true)
                throw err;
            return /$^/;
        }
    };
    /**
     * Picomatch constants.
     * @return {Object}
     */
    picomatch$2.constants = constants$1$1;
    /**
     * Expose "picomatch"
     */
    var picomatch_1$1 = picomatch$2;

    var picomatch$1$1 = picomatch_1$1;

    const isEmptyString = val => typeof val === 'string' && (val === '' || val === './');
    /**
     * Returns an array of strings that match one or more glob patterns.
     *
     * ```js
     * const mm = require('micromatch');
     * // mm(list, patterns[, options]);
     *
     * console.log(mm(['a.js', 'a.txt'], ['*.js']));
     * //=> [ 'a.js' ]
     * ```
     * @param {String|Array<string>} list List of strings to match.
     * @param {String|Array<string>} patterns One or more glob patterns to use for matching.
     * @param {Object} options See available [options](#options)
     * @return {Array} Returns an array of matches
     * @summary false
     * @api public
     */
    const micromatch = (list, patterns, options) => {
        patterns = [].concat(patterns);
        list = [].concat(list);
        let omit = new Set();
        let keep = new Set();
        let items = new Set();
        let negatives = 0;
        let onResult = state => {
            items.add(state.output);
            if (options && options.onResult) {
                options.onResult(state);
            }
        };
        for (let i = 0; i < patterns.length; i++) {
            let isMatch = picomatch$1$1(String(patterns[i]), Object.assign({}, options, { onResult }), true);
            let negated = isMatch.state.negated || isMatch.state.negatedExtglob;
            if (negated)
                negatives++;
            for (let item of list) {
                let matched = isMatch(item, true);
                let match = negated ? !matched.isMatch : matched.isMatch;
                if (!match)
                    continue;
                if (negated) {
                    omit.add(matched.output);
                }
                else {
                    omit.delete(matched.output);
                    keep.add(matched.output);
                }
            }
        }
        let result = negatives === patterns.length ? [...items] : [...keep];
        let matches = result.filter(item => !omit.has(item));
        if (options && matches.length === 0) {
            if (options.failglob === true) {
                throw new Error(`No matches found for "${patterns.join(', ')}"`);
            }
            if (options.nonull === true || options.nullglob === true) {
                return options.unescape ? patterns.map(p => p.replace(/\\/g, '')) : patterns;
            }
        }
        return matches;
    };
    /**
     * Backwards compatibility
     */
    micromatch.match = micromatch;
    /**
     * Returns a matcher function from the given glob `pattern` and `options`.
     * The returned function takes a string to match as its only argument and returns
     * true if the string is a match.
     *
     * ```js
     * const mm = require('micromatch');
     * // mm.matcher(pattern[, options]);
     *
     * const isMatch = mm.matcher('*.!(*a)');
     * console.log(isMatch('a.a')); //=> false
     * console.log(isMatch('a.b')); //=> true
     * ```
     * @param {String} `pattern` Glob pattern
     * @param {Object} `options`
     * @return {Function} Returns a matcher function.
     * @api public
     */
    micromatch.matcher = (pattern, options) => picomatch$1$1(pattern, options);
    /**
     * Returns true if **any** of the given glob `patterns` match the specified `string`.
     *
     * ```js
     * const mm = require('micromatch');
     * // mm.isMatch(string, patterns[, options]);
     *
     * console.log(mm.isMatch('a.a', ['b.*', '*.a'])); //=> true
     * console.log(mm.isMatch('a.a', 'b.*')); //=> false
     * ```
     * @param {String} str The string to test.
     * @param {String|Array} patterns One or more glob patterns to use for matching.
     * @param {Object} [options] See available [options](#options).
     * @return {Boolean} Returns true if any patterns match `str`
     * @api public
     */
    micromatch.isMatch = (str, patterns, options) => picomatch$1$1(patterns, options)(str);
    /**
     * Backwards compatibility
     */
    micromatch.any = micromatch.isMatch;
    /**
     * Returns a list of strings that _**do not match any**_ of the given `patterns`.
     *
     * ```js
     * const mm = require('micromatch');
     * // mm.not(list, patterns[, options]);
     *
     * console.log(mm.not(['a.a', 'b.b', 'c.c'], '*.a'));
     * //=> ['b.b', 'c.c']
     * ```
     * @param {Array} `list` Array of strings to match.
     * @param {String|Array} `patterns` One or more glob pattern to use for matching.
     * @param {Object} `options` See available [options](#options) for changing how matches are performed
     * @return {Array} Returns an array of strings that **do not match** the given patterns.
     * @api public
     */
    micromatch.not = (list, patterns, options = {}) => {
        patterns = [].concat(patterns).map(String);
        let result = new Set();
        let items = [];
        let onResult = state => {
            if (options.onResult)
                options.onResult(state);
            items.push(state.output);
        };
        let matches = micromatch(list, patterns, Object.assign({}, options, { onResult }));
        for (let item of items) {
            if (!matches.includes(item)) {
                result.add(item);
            }
        }
        return [...result];
    };
    /**
     * Returns true if the given `string` contains the given pattern. Similar
     * to [.isMatch](#isMatch) but the pattern can match any part of the string.
     *
     * ```js
     * var mm = require('micromatch');
     * // mm.contains(string, pattern[, options]);
     *
     * console.log(mm.contains('aa/bb/cc', '*b'));
     * //=> true
     * console.log(mm.contains('aa/bb/cc', '*d'));
     * //=> false
     * ```
     * @param {String} `str` The string to match.
     * @param {String|Array} `patterns` Glob pattern to use for matching.
     * @param {Object} `options` See available [options](#options) for changing how matches are performed
     * @return {Boolean} Returns true if the patter matches any part of `str`.
     * @api public
     */
    micromatch.contains = (str, pattern, options) => {
        if (typeof str !== 'string') {
            throw new TypeError(`Expected a string: "${util__default['default'].inspect(str)}"`);
        }
        if (Array.isArray(pattern)) {
            return pattern.some(p => micromatch.contains(str, p, options));
        }
        if (typeof pattern === 'string') {
            if (isEmptyString(str) || isEmptyString(pattern)) {
                return false;
            }
            if (str.includes(pattern) || (str.startsWith('./') && str.slice(2).includes(pattern))) {
                return true;
            }
        }
        return micromatch.isMatch(str, pattern, Object.assign({}, options, { contains: true }));
    };
    /**
     * Filter the keys of the given object with the given `glob` pattern
     * and `options`. Does not attempt to match nested keys. If you need this feature,
     * use [glob-object][] instead.
     *
     * ```js
     * const mm = require('micromatch');
     * // mm.matchKeys(object, patterns[, options]);
     *
     * const obj = { aa: 'a', ab: 'b', ac: 'c' };
     * console.log(mm.matchKeys(obj, '*b'));
     * //=> { ab: 'b' }
     * ```
     * @param {Object} `object` The object with keys to filter.
     * @param {String|Array} `patterns` One or more glob patterns to use for matching.
     * @param {Object} `options` See available [options](#options) for changing how matches are performed
     * @return {Object} Returns an object with only keys that match the given patterns.
     * @api public
     */
    micromatch.matchKeys = (obj, patterns, options) => {
        if (!utils$1$1.isObject(obj)) {
            throw new TypeError('Expected the first argument to be an object');
        }
        let keys = micromatch(Object.keys(obj), patterns, options);
        let res = {};
        for (let key of keys)
            res[key] = obj[key];
        return res;
    };
    /**
     * Returns true if some of the strings in the given `list` match any of the given glob `patterns`.
     *
     * ```js
     * const mm = require('micromatch');
     * // mm.some(list, patterns[, options]);
     *
     * console.log(mm.some(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
     * // true
     * console.log(mm.some(['foo.js'], ['*.js', '!foo.js']));
     * // false
     * ```
     * @param {String|Array} `list` The string or array of strings to test. Returns as soon as the first match is found.
     * @param {String|Array} `patterns` One or more glob patterns to use for matching.
     * @param {Object} `options` See available [options](#options) for changing how matches are performed
     * @return {Boolean} Returns true if any patterns match `str`
     * @api public
     */
    micromatch.some = (list, patterns, options) => {
        let items = [].concat(list);
        for (let pattern of [].concat(patterns)) {
            let isMatch = picomatch$1$1(String(pattern), options);
            if (items.some(item => isMatch(item))) {
                return true;
            }
        }
        return false;
    };
    /**
     * Returns true if every string in the given `list` matches
     * any of the given glob `patterns`.
     *
     * ```js
     * const mm = require('micromatch');
     * // mm.every(list, patterns[, options]);
     *
     * console.log(mm.every('foo.js', ['foo.js']));
     * // true
     * console.log(mm.every(['foo.js', 'bar.js'], ['*.js']));
     * // true
     * console.log(mm.every(['foo.js', 'bar.js'], ['*.js', '!foo.js']));
     * // false
     * console.log(mm.every(['foo.js'], ['*.js', '!foo.js']));
     * // false
     * ```
     * @param {String|Array} `list` The string or array of strings to test.
     * @param {String|Array} `patterns` One or more glob patterns to use for matching.
     * @param {Object} `options` See available [options](#options) for changing how matches are performed
     * @return {Boolean} Returns true if any patterns match `str`
     * @api public
     */
    micromatch.every = (list, patterns, options) => {
        let items = [].concat(list);
        for (let pattern of [].concat(patterns)) {
            let isMatch = picomatch$1$1(String(pattern), options);
            if (!items.every(item => isMatch(item))) {
                return false;
            }
        }
        return true;
    };
    /**
     * Returns true if **all** of the given `patterns` match
     * the specified string.
     *
     * ```js
     * const mm = require('micromatch');
     * // mm.all(string, patterns[, options]);
     *
     * console.log(mm.all('foo.js', ['foo.js']));
     * // true
     *
     * console.log(mm.all('foo.js', ['*.js', '!foo.js']));
     * // false
     *
     * console.log(mm.all('foo.js', ['*.js', 'foo.js']));
     * // true
     *
     * console.log(mm.all('foo.js', ['*.js', 'f*', '*o*', '*o.js']));
     * // true
     * ```
     * @param {String|Array} `str` The string to test.
     * @param {String|Array} `patterns` One or more glob patterns to use for matching.
     * @param {Object} `options` See available [options](#options) for changing how matches are performed
     * @return {Boolean} Returns true if any patterns match `str`
     * @api public
     */
    micromatch.all = (str, patterns, options) => {
        if (typeof str !== 'string') {
            throw new TypeError(`Expected a string: "${util__default['default'].inspect(str)}"`);
        }
        return [].concat(patterns).every(p => picomatch$1$1(p, options)(str));
    };
    /**
     * Returns an array of matches captured by `pattern` in `string, or `null` if the pattern did not match.
     *
     * ```js
     * const mm = require('micromatch');
     * // mm.capture(pattern, string[, options]);
     *
     * console.log(mm.capture('test/*.js', 'test/foo.js'));
     * //=> ['foo']
     * console.log(mm.capture('test/*.js', 'foo/bar.css'));
     * //=> null
     * ```
     * @param {String} `glob` Glob pattern to use for matching.
     * @param {String} `input` String to match
     * @param {Object} `options` See available [options](#options) for changing how matches are performed
     * @return {Boolean} Returns an array of captures if the input matches the glob pattern, otherwise `null`.
     * @api public
     */
    micromatch.capture = (glob, input, options) => {
        let posix = utils$1$1.isWindows(options);
        let regex = picomatch$1$1.makeRe(String(glob), Object.assign({}, options, { capture: true }));
        let match = regex.exec(posix ? utils$1$1.toPosixSlashes(input) : input);
        if (match) {
            return match.slice(1).map(v => v === void 0 ? '' : v);
        }
    };
    /**
     * Create a regular expression from the given glob `pattern`.
     *
     * ```js
     * const mm = require('micromatch');
     * // mm.makeRe(pattern[, options]);
     *
     * console.log(mm.makeRe('*.js'));
     * //=> /^(?:(\.[\\\/])?(?!\.)(?=.)[^\/]*?\.js)$/
     * ```
     * @param {String} `pattern` A glob pattern to convert to regex.
     * @param {Object} `options`
     * @return {RegExp} Returns a regex created from the given pattern.
     * @api public
     */
    micromatch.makeRe = (...args) => picomatch$1$1.makeRe(...args);
    /**
     * Scan a glob pattern to separate the pattern into segments. Used
     * by the [split](#split) method.
     *
     * ```js
     * const mm = require('micromatch');
     * const state = mm.scan(pattern[, options]);
     * ```
     * @param {String} `pattern`
     * @param {Object} `options`
     * @return {Object} Returns an object with
     * @api public
     */
    micromatch.scan = (...args) => picomatch$1$1.scan(...args);
    /**
     * Parse a glob pattern to create the source string for a regular
     * expression.
     *
     * ```js
     * const mm = require('micromatch');
     * const state = mm(pattern[, options]);
     * ```
     * @param {String} `glob`
     * @param {Object} `options`
     * @return {Object} Returns an object with useful properties and output to be used as regex source string.
     * @api public
     */
    micromatch.parse = (patterns, options) => {
        let res = [];
        for (let pattern of [].concat(patterns || [])) {
            for (let str of braces_1(String(pattern), options)) {
                res.push(picomatch$1$1.parse(str, options));
            }
        }
        return res;
    };
    /**
     * Process the given brace `pattern`.
     *
     * ```js
     * const { braces } = require('micromatch');
     * console.log(braces('foo/{a,b,c}/bar'));
     * //=> [ 'foo/(a|b|c)/bar' ]
     *
     * console.log(braces('foo/{a,b,c}/bar', { expand: true }));
     * //=> [ 'foo/a/bar', 'foo/b/bar', 'foo/c/bar' ]
     * ```
     * @param {String} `pattern` String with brace pattern to process.
     * @param {Object} `options` Any [options](#options) to change how expansion is performed. See the [braces][] library for all available options.
     * @return {Array}
     * @api public
     */
    micromatch.braces = (pattern, options) => {
        if (typeof pattern !== 'string')
            throw new TypeError('Expected a string');
        if ((options && options.nobrace === true) || !/\{.*\}/.test(pattern)) {
            return [pattern];
        }
        return braces_1(pattern, options);
    };
    /**
     * Expand braces
     */
    micromatch.braceExpand = (pattern, options) => {
        if (typeof pattern !== 'string')
            throw new TypeError('Expected a string');
        return micromatch.braces(pattern, Object.assign({}, options, { expand: true }));
    };
    /**
     * Expose micromatch
     */
    var micromatch_1 = micromatch;

    function ensureArray$1(thing) {
        if (Array.isArray(thing))
            return thing;
        if (thing == undefined)
            return [];
        return [thing];
    }

    function getMatcherString$1(id, resolutionBase) {
        if (resolutionBase === false) {
            return id;
        }
        return require$$0$1.resolve(...(typeof resolutionBase === 'string' ? [resolutionBase, id] : [id]));
    }
    const createFilter$1 = function createFilter(include, exclude, options) {
        const resolutionBase = options && options.resolve;
        const getMatcher = (id) => {
            return id instanceof RegExp
                ? id
                : {
                    test: micromatch_1.matcher(getMatcherString$1(id, resolutionBase)
                        .split(require$$0$1.sep)
                        .join('/'), { dot: true })
                };
        };
        const includeMatchers = ensureArray$1(include).map(getMatcher);
        const excludeMatchers = ensureArray$1(exclude).map(getMatcher);
        return function (id) {
            if (typeof id !== 'string')
                return false;
            if (/\0/.test(id))
                return false;
            id = id.split(require$$0$1.sep).join('/');
            for (let i = 0; i < excludeMatchers.length; ++i) {
                const matcher = excludeMatchers[i];
                if (matcher.test(id))
                    return false;
            }
            for (let i = 0; i < includeMatchers.length; ++i) {
                const matcher = includeMatchers[i];
                if (matcher.test(id))
                    return true;
            }
            return !includeMatchers.length;
        };
    };

    const reservedWords$1 = 'break case class catch const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield enum await implements package protected static interface private public';
    const builtins$2 = 'arguments Infinity NaN undefined null true false eval uneval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Symbol Error EvalError InternalError RangeError ReferenceError SyntaxError TypeError URIError Number Math Date String RegExp Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array Map Set WeakMap WeakSet SIMD ArrayBuffer DataView JSON Promise Generator GeneratorFunction Reflect Proxy Intl';
    const forbiddenIdentifiers$1 = new Set(`${reservedWords$1} ${builtins$2}`.split(' '));
    forbiddenIdentifiers$1.add('');
    const makeLegalIdentifier$1 = function makeLegalIdentifier(str) {
        str = str.replace(/-(\w)/g, (_, letter) => letter.toUpperCase()).replace(/[^$_a-zA-Z0-9]/g, '_');
        if (/\d/.test(str[0]) || forbiddenIdentifiers$1.has(str)) {
            str = `_${str}`;
        }
        return str || '_';
    };

    function stringify$2(obj) {
        return (JSON.stringify(obj) || 'undefined').replace(/[\u2028\u2029]/g, char => `\\u${('000' + char.charCodeAt(0).toString(16)).slice(-4)}`);
    }
    function serializeArray(arr, indent, baseIndent) {
        let output = '[';
        const separator = indent ? '\n' + baseIndent + indent : '';
        for (let i = 0; i < arr.length; i++) {
            const key = arr[i];
            output += `${i > 0 ? ',' : ''}${separator}${serialize(key, indent, baseIndent + indent)}`;
        }
        return output + `${indent ? '\n' + baseIndent : ''}]`;
    }
    function serializeObject(obj, indent, baseIndent) {
        let output = '{';
        const separator = indent ? '\n' + baseIndent + indent : '';
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const stringKey = makeLegalIdentifier$1(key) === key ? key : stringify$2(key);
            output += `${i > 0 ? ',' : ''}${separator}${stringKey}:${indent ? ' ' : ''}${serialize(obj[key], indent, baseIndent + indent)}`;
        }
        return output + `${indent ? '\n' + baseIndent : ''}}`;
    }
    function serialize(obj, indent, baseIndent) {
        if (obj === Infinity)
            return 'Infinity';
        if (obj === -Infinity)
            return '-Infinity';
        if (obj === 0 && 1 / obj === -Infinity)
            return '-0';
        if (obj instanceof Date)
            return 'new Date(' + obj.getTime() + ')';
        if (obj instanceof RegExp)
            return obj.toString();
        if (obj !== obj)
            return 'NaN';
        if (Array.isArray(obj))
            return serializeArray(obj, indent, baseIndent);
        if (obj === null)
            return 'null';
        if (typeof obj === 'object')
            return serializeObject(obj, indent, baseIndent);
        return stringify$2(obj);
    }
    const dataToEsm = function dataToEsm(data, options = {}) {
        const t = options.compact ? '' : 'indent' in options ? options.indent : '\t';
        const _ = options.compact ? '' : ' ';
        const n = options.compact ? '' : '\n';
        const declarationType = options.preferConst ? 'const' : 'var';
        if (options.namedExports === false ||
            typeof data !== 'object' ||
            Array.isArray(data) ||
            data instanceof Date ||
            data instanceof RegExp ||
            data === null) {
            const code = serialize(data, options.compact ? null : t, '');
            const __ = _ || (/^[{[\-\/]/.test(code) ? '' : ' ');
            return `export default${__}${code};`;
        }
        let namedExportCode = '';
        const defaultExportRows = [];
        const dataKeys = Object.keys(data);
        for (let i = 0; i < dataKeys.length; i++) {
            const key = dataKeys[i];
            if (key === makeLegalIdentifier$1(key)) {
                if (options.objectShorthand)
                    defaultExportRows.push(key);
                else
                    defaultExportRows.push(`${key}:${_}${key}`);
                namedExportCode += `export ${declarationType} ${key}${_}=${_}${serialize(data[key], options.compact ? null : t, '')};${n}`;
            }
            else {
                defaultExportRows.push(`${stringify$2(key)}:${_}${serialize(data[key], options.compact ? null : t, '')}`);
            }
        }
        return (namedExportCode + `export default${_}{${n}${t}${defaultExportRows.join(`,${n}${t}`)}${n}};${n}`);
    };

    function json(options) {
    	if ( options === void 0 ) options = {};

    	var filter = createFilter$1(options.include, options.exclude);
    	var indent = 'indent' in options ? options.indent : '\t';

    	return {
    		name: 'json',

    		transform: function transform(json, id) {
    			if (id.slice(-5) !== '.json' || !filter(id)) { return null; }

    			return {
    				code: dataToEsm(JSON.parse(json), {
    					preferConst: options.preferConst,
    					compact: options.compact,
    					namedExports: options.namedExports,
    					indent: indent
    				}),
    				map: { mappings: '' }
    			};
    		}
    	};
    }

    const {builtinModules} = require$$0__default$1['default'];

    const ignoreList = [
    	'sys'
    ];

    // eslint-disable-next-line node/no-deprecated-api
    var builtinModules_1 = (builtinModules || Object.keys(process.binding('natives')))
    	.filter(x => !/^_|^(internal|v8|node-inspect)\/|\//.test(x) && !ignoreList.includes(x))
    	.sort();

    var isMergeableObject = function isMergeableObject(value) {
    	return isNonNullObject(value)
    		&& !isSpecial(value)
    };

    function isNonNullObject(value) {
    	return !!value && typeof value === 'object'
    }

    function isSpecial(value) {
    	var stringValue = Object.prototype.toString.call(value);

    	return stringValue === '[object RegExp]'
    		|| stringValue === '[object Date]'
    		|| isReactElement(value)
    }

    // see https://github.com/facebook/react/blob/b5ac963fb791d1298e7f396236383bc955f916c1/src/isomorphic/classic/element/ReactElement.js#L21-L25
    var canUseSymbol = typeof Symbol === 'function' && Symbol.for;
    var REACT_ELEMENT_TYPE = canUseSymbol ? Symbol.for('react.element') : 0xeac7;

    function isReactElement(value) {
    	return value.$$typeof === REACT_ELEMENT_TYPE
    }

    function emptyTarget(val) {
    	return Array.isArray(val) ? [] : {}
    }

    function cloneUnlessOtherwiseSpecified(value, options) {
    	return (options.clone !== false && options.isMergeableObject(value))
    		? deepmerge(emptyTarget(value), value, options)
    		: value
    }

    function defaultArrayMerge(target, source, options) {
    	return target.concat(source).map(function(element) {
    		return cloneUnlessOtherwiseSpecified(element, options)
    	})
    }

    function getMergeFunction(key, options) {
    	if (!options.customMerge) {
    		return deepmerge
    	}
    	var customMerge = options.customMerge(key);
    	return typeof customMerge === 'function' ? customMerge : deepmerge
    }

    function getEnumerableOwnPropertySymbols(target) {
    	return Object.getOwnPropertySymbols
    		? Object.getOwnPropertySymbols(target).filter(function(symbol) {
    			return target.propertyIsEnumerable(symbol)
    		})
    		: []
    }

    function getKeys(target) {
    	return Object.keys(target).concat(getEnumerableOwnPropertySymbols(target))
    }

    function propertyIsOnObject(object, property) {
    	try {
    		return property in object
    	} catch(_) {
    		return false
    	}
    }

    // Protects from prototype poisoning and unexpected merging up the prototype chain.
    function propertyIsUnsafe(target, key) {
    	return propertyIsOnObject(target, key) // Properties are safe to merge if they don't exist in the target yet,
    		&& !(Object.hasOwnProperty.call(target, key) // unsafe if they exist up the prototype chain,
    			&& Object.propertyIsEnumerable.call(target, key)) // and also unsafe if they're nonenumerable.
    }

    function mergeObject(target, source, options) {
    	var destination = {};
    	if (options.isMergeableObject(target)) {
    		getKeys(target).forEach(function(key) {
    			destination[key] = cloneUnlessOtherwiseSpecified(target[key], options);
    		});
    	}
    	getKeys(source).forEach(function(key) {
    		if (propertyIsUnsafe(target, key)) {
    			return
    		}

    		if (propertyIsOnObject(target, key) && options.isMergeableObject(source[key])) {
    			destination[key] = getMergeFunction(key, options)(target[key], source[key], options);
    		} else {
    			destination[key] = cloneUnlessOtherwiseSpecified(source[key], options);
    		}
    	});
    	return destination
    }

    function deepmerge(target, source, options) {
    	options = options || {};
    	options.arrayMerge = options.arrayMerge || defaultArrayMerge;
    	options.isMergeableObject = options.isMergeableObject || isMergeableObject;
    	// cloneUnlessOtherwiseSpecified is added to `options` so that custom arrayMerge()
    	// implementations can use it. The caller may not replace it.
    	options.cloneUnlessOtherwiseSpecified = cloneUnlessOtherwiseSpecified;

    	var sourceIsArray = Array.isArray(source);
    	var targetIsArray = Array.isArray(target);
    	var sourceAndTargetTypesMatch = sourceIsArray === targetIsArray;

    	if (!sourceAndTargetTypesMatch) {
    		return cloneUnlessOtherwiseSpecified(source, options)
    	} else if (sourceIsArray) {
    		return options.arrayMerge(target, source, options)
    	} else {
    		return mergeObject(target, source, options)
    	}
    }

    deepmerge.all = function deepmergeAll(array, options) {
    	if (!Array.isArray(array)) {
    		throw new Error('first argument should be an array')
    	}

    	return array.reduce(function(prev, next) {
    		return deepmerge(prev, next, options)
    	}, {})
    };

    var deepmerge_1 = deepmerge;

    var cjs = deepmerge_1;

    // no idea what these regular expressions do,
    // but i extracted it from https://github.com/yahoo/js-module-formats/blob/master/index.js#L18
    var ES6ImportExportRegExp = /(?:^\s*|[}{\(\);,\n]\s*)(import\s+['"]|(import|module)\s+[^"'\(\)\n;]+\s+from\s+['"]|export\s+(\*|\{|default|function|var|const|let|[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*))/;

    var ES6AliasRegExp = /(?:^\s*|[}{\(\);,\n]\s*)(export\s*\*\s*from\s*(?:'([^']+)'|"([^"]+)"))/;

    var isModule = function (sauce) {
      return ES6ImportExportRegExp.test(sauce)
        || ES6AliasRegExp.test(sauce);
    };

    var caller$2 = function () {
        // see https://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
        var origPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = function (_, stack) { return stack; };
        var stack = (new Error()).stack;
        Error.prepareStackTrace = origPrepareStackTrace;
        return stack[2].getFileName();
    };

    var pathParse = {exports: {}};

    var isWindows$1 = process.platform === 'win32';

    // Regex to split a windows path into three parts: [*, device, slash,
    // tail] windows-only
    var splitDeviceRe =
        /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;

    // Regex to split the tail part of the above into [*, dir, basename, ext]
    var splitTailRe =
        /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/;

    var win32$1 = {};

    // Function to split a filename into [root, dir, basename, ext]
    function win32SplitPath(filename) {
      // Separate device+slash from tail
      var result = splitDeviceRe.exec(filename),
          device = (result[1] || '') + (result[2] || ''),
          tail = result[3] || '';
      // Split the tail into dir, basename and extension
      var result2 = splitTailRe.exec(tail),
          dir = result2[1],
          basename = result2[2],
          ext = result2[3];
      return [device, dir, basename, ext];
    }

    win32$1.parse = function(pathString) {
      if (typeof pathString !== 'string') {
        throw new TypeError(
            "Parameter 'pathString' must be a string, not " + typeof pathString
        );
      }
      var allParts = win32SplitPath(pathString);
      if (!allParts || allParts.length !== 4) {
        throw new TypeError("Invalid path '" + pathString + "'");
      }
      return {
        root: allParts[0],
        dir: allParts[0] + allParts[1].slice(0, -1),
        base: allParts[2],
        ext: allParts[3],
        name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
      };
    };



    // Split a filename into [root, dir, basename, ext], unix version
    // 'root' is just a slash, or nothing.
    var splitPathRe =
        /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
    var posix$1 = {};


    function posixSplitPath(filename) {
      return splitPathRe.exec(filename).slice(1);
    }


    posix$1.parse = function(pathString) {
      if (typeof pathString !== 'string') {
        throw new TypeError(
            "Parameter 'pathString' must be a string, not " + typeof pathString
        );
      }
      var allParts = posixSplitPath(pathString);
      if (!allParts || allParts.length !== 4) {
        throw new TypeError("Invalid path '" + pathString + "'");
      }
      allParts[1] = allParts[1] || '';
      allParts[2] = allParts[2] || '';
      allParts[3] = allParts[3] || '';

      return {
        root: allParts[0],
        dir: allParts[0] + allParts[1].slice(0, -1),
        base: allParts[2],
        ext: allParts[3],
        name: allParts[2].slice(0, allParts[2].length - allParts[3].length)
      };
    };


    if (isWindows$1)
      pathParse.exports = win32$1.parse;
    else /* posix */
      pathParse.exports = posix$1.parse;

    pathParse.exports.posix = posix$1.parse;
    pathParse.exports.win32 = win32$1.parse;

    var path$b = require$$0__default['default'];
    var parse$3 = path$b.parse || pathParse.exports;

    var getNodeModulesDirs = function getNodeModulesDirs(absoluteStart, modules) {
        var prefix = '/';
        if ((/^([A-Za-z]:)/).test(absoluteStart)) {
            prefix = '';
        } else if ((/^\\\\/).test(absoluteStart)) {
            prefix = '\\\\';
        }

        var paths = [absoluteStart];
        var parsed = parse$3(absoluteStart);
        while (parsed.dir !== paths[paths.length - 1]) {
            paths.push(parsed.dir);
            parsed = parse$3(parsed.dir);
        }

        return paths.reduce(function (dirs, aPath) {
            return dirs.concat(modules.map(function (moduleDir) {
                return path$b.resolve(prefix, aPath, moduleDir);
            }));
        }, []);
    };

    var nodeModulesPaths$2 = function nodeModulesPaths(start, opts, request) {
        var modules = opts && opts.moduleDirectory
            ? [].concat(opts.moduleDirectory)
            : ['node_modules'];

        if (opts && typeof opts.paths === 'function') {
            return opts.paths(
                request,
                start,
                function () { return getNodeModulesDirs(start, modules); },
                opts
            );
        }

        var dirs = getNodeModulesDirs(start, modules);
        return opts && opts.paths ? dirs.concat(opts.paths) : dirs;
    };

    var normalizeOptions$2 = function (x, opts) {
        /**
         * This file is purposefully a passthrough. It's expected that third-party
         * environments will override it at runtime in order to inject special logic
         * into `resolve` (by manipulating the options). One such example is the PnP
         * code path in Yarn.
         */

        return opts || {};
    };

    /* eslint no-invalid-this: 1 */

    var ERROR_MESSAGE = 'Function.prototype.bind called on incompatible ';
    var slice$1 = Array.prototype.slice;
    var toStr = Object.prototype.toString;
    var funcType = '[object Function]';

    var implementation$1 = function bind(that) {
        var target = this;
        if (typeof target !== 'function' || toStr.call(target) !== funcType) {
            throw new TypeError(ERROR_MESSAGE + target);
        }
        var args = slice$1.call(arguments, 1);

        var bound;
        var binder = function () {
            if (this instanceof bound) {
                var result = target.apply(
                    this,
                    args.concat(slice$1.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;
            } else {
                return target.apply(
                    that,
                    args.concat(slice$1.call(arguments))
                );
            }
        };

        var boundLength = Math.max(0, target.length - args.length);
        var boundArgs = [];
        for (var i = 0; i < boundLength; i++) {
            boundArgs.push('$' + i);
        }

        bound = Function('binder', 'return function (' + boundArgs.join(',') + '){ return binder.apply(this,arguments); }')(binder);

        if (target.prototype) {
            var Empty = function Empty() {};
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            Empty.prototype = null;
        }

        return bound;
    };

    var implementation = implementation$1;

    var functionBind = Function.prototype.bind || implementation;

    var bind = functionBind;

    var src = bind.call(Function.call, Object.prototype.hasOwnProperty);

    var assert$3 = true;
    var async_hooks$1 = ">= 8";
    var buffer_ieee754$1 = "< 0.9.7";
    var buffer$1 = true;
    var child_process$1 = true;
    var cluster$1 = true;
    var console$2 = true;
    var constants$4 = true;
    var crypto$1 = true;
    var _debug_agent$1 = ">= 1 && < 8";
    var _debugger$1 = "< 8";
    var dgram$1 = true;
    var diagnostics_channel$1 = [
    	">= 14.17 && < 15",
    	">= 15.1"
    ];
    var dns$1 = true;
    var domain$1 = ">= 0.7.12";
    var events$1 = true;
    var freelist$1 = "< 6";
    var fs$7 = true;
    var _http_agent$1 = ">= 0.11.1";
    var _http_client$1 = ">= 0.11.1";
    var _http_common$1 = ">= 0.11.1";
    var _http_incoming$1 = ">= 0.11.1";
    var _http_outgoing$1 = ">= 0.11.1";
    var _http_server$1 = ">= 0.11.1";
    var http$1 = true;
    var http2$1 = ">= 8.8";
    var https$1 = true;
    var inspector$1 = ">= 8";
    var _linklist$1 = "< 8";
    var module$1 = true;
    var net$1 = true;
    var os$1 = true;
    var path$a = true;
    var perf_hooks$1 = ">= 8.5";
    var process$2 = ">= 1";
    var punycode$1 = true;
    var querystring$1 = true;
    var readline$1 = true;
    var repl$1 = true;
    var smalloc$1 = ">= 0.11.5 && < 3";
    var _stream_duplex$1 = ">= 0.9.4";
    var _stream_transform$1 = ">= 0.9.4";
    var _stream_wrap$1 = ">= 1.4.1";
    var _stream_passthrough$1 = ">= 0.9.4";
    var _stream_readable$1 = ">= 0.9.4";
    var _stream_writable$1 = ">= 0.9.4";
    var stream$1 = true;
    var string_decoder$1 = true;
    var sys$1 = [
    	">= 0.6 && < 0.7",
    	">= 0.8"
    ];
    var timers$1 = true;
    var _tls_common$1 = ">= 0.11.13";
    var _tls_legacy$1 = ">= 0.11.3 && < 10";
    var _tls_wrap$1 = ">= 0.11.3";
    var tls$1 = true;
    var trace_events$1 = ">= 10";
    var tty$1 = true;
    var url$1 = true;
    var util$2 = true;
    var v8$1 = ">= 1";
    var vm$1 = true;
    var wasi$1 = ">= 13.4 && < 13.5";
    var worker_threads$1 = ">= 11.7";
    var zlib$1 = true;
    var require$$1 = {
    	assert: assert$3,
    	"node:assert": ">= 16",
    	"assert/strict": ">= 15",
    	"node:assert/strict": ">= 16",
    	async_hooks: async_hooks$1,
    	"node:async_hooks": ">= 16",
    	buffer_ieee754: buffer_ieee754$1,
    	buffer: buffer$1,
    	"node:buffer": ">= 16",
    	child_process: child_process$1,
    	"node:child_process": ">= 16",
    	cluster: cluster$1,
    	"node:cluster": ">= 16",
    	console: console$2,
    	"node:console": ">= 16",
    	constants: constants$4,
    	"node:constants": ">= 16",
    	crypto: crypto$1,
    	"node:crypto": ">= 16",
    	_debug_agent: _debug_agent$1,
    	_debugger: _debugger$1,
    	dgram: dgram$1,
    	"node:dgram": ">= 16",
    	diagnostics_channel: diagnostics_channel$1,
    	"node:diagnostics_channel": ">= 16",
    	dns: dns$1,
    	"node:dns": ">= 16",
    	"dns/promises": ">= 15",
    	"node:dns/promises": ">= 16",
    	domain: domain$1,
    	"node:domain": ">= 16",
    	events: events$1,
    	"node:events": ">= 16",
    	freelist: freelist$1,
    	fs: fs$7,
    	"node:fs": ">= 16",
    	"fs/promises": [
    	">= 10 && < 10.1",
    	">= 14"
    ],
    	"node:fs/promises": ">= 16",
    	_http_agent: _http_agent$1,
    	"node:_http_agent": ">= 16",
    	_http_client: _http_client$1,
    	"node:_http_client": ">= 16",
    	_http_common: _http_common$1,
    	"node:_http_common": ">= 16",
    	_http_incoming: _http_incoming$1,
    	"node:_http_incoming": ">= 16",
    	_http_outgoing: _http_outgoing$1,
    	"node:_http_outgoing": ">= 16",
    	_http_server: _http_server$1,
    	"node:_http_server": ">= 16",
    	http: http$1,
    	"node:http": ">= 16",
    	http2: http2$1,
    	"node:http2": ">= 16",
    	https: https$1,
    	"node:https": ">= 16",
    	inspector: inspector$1,
    	"node:inspector": ">= 16",
    	_linklist: _linklist$1,
    	module: module$1,
    	"node:module": ">= 16",
    	net: net$1,
    	"node:net": ">= 16",
    	"node-inspect/lib/_inspect": ">= 7.6 && < 12",
    	"node-inspect/lib/internal/inspect_client": ">= 7.6 && < 12",
    	"node-inspect/lib/internal/inspect_repl": ">= 7.6 && < 12",
    	os: os$1,
    	"node:os": ">= 16",
    	path: path$a,
    	"node:path": ">= 16",
    	"path/posix": ">= 15.3",
    	"node:path/posix": ">= 16",
    	"path/win32": ">= 15.3",
    	"node:path/win32": ">= 16",
    	perf_hooks: perf_hooks$1,
    	"node:perf_hooks": ">= 16",
    	process: process$2,
    	"node:process": ">= 16",
    	punycode: punycode$1,
    	"node:punycode": ">= 16",
    	querystring: querystring$1,
    	"node:querystring": ">= 16",
    	readline: readline$1,
    	"node:readline": ">= 16",
    	repl: repl$1,
    	"node:repl": ">= 16",
    	smalloc: smalloc$1,
    	_stream_duplex: _stream_duplex$1,
    	"node:_stream_duplex": ">= 16",
    	_stream_transform: _stream_transform$1,
    	"node:_stream_transform": ">= 16",
    	_stream_wrap: _stream_wrap$1,
    	"node:_stream_wrap": ">= 16",
    	_stream_passthrough: _stream_passthrough$1,
    	"node:_stream_passthrough": ">= 16",
    	_stream_readable: _stream_readable$1,
    	"node:_stream_readable": ">= 16",
    	_stream_writable: _stream_writable$1,
    	"node:_stream_writable": ">= 16",
    	stream: stream$1,
    	"node:stream": ">= 16",
    	"stream/promises": ">= 15",
    	"node:stream/promises": ">= 16",
    	string_decoder: string_decoder$1,
    	"node:string_decoder": ">= 16",
    	sys: sys$1,
    	"node:sys": ">= 16",
    	timers: timers$1,
    	"node:timers": ">= 16",
    	"timers/promises": ">= 15",
    	"node:timers/promises": ">= 16",
    	_tls_common: _tls_common$1,
    	"node:_tls_common": ">= 16",
    	_tls_legacy: _tls_legacy$1,
    	_tls_wrap: _tls_wrap$1,
    	"node:_tls_wrap": ">= 16",
    	tls: tls$1,
    	"node:tls": ">= 16",
    	trace_events: trace_events$1,
    	"node:trace_events": ">= 16",
    	tty: tty$1,
    	"node:tty": ">= 16",
    	url: url$1,
    	"node:url": ">= 16",
    	util: util$2,
    	"node:util": ">= 16",
    	"util/types": ">= 15.3",
    	"node:util/types": ">= 16",
    	"v8/tools/arguments": ">= 10 && < 12",
    	"v8/tools/codemap": [
    	">= 4.4 && < 5",
    	">= 5.2 && < 12"
    ],
    	"v8/tools/consarray": [
    	">= 4.4 && < 5",
    	">= 5.2 && < 12"
    ],
    	"v8/tools/csvparser": [
    	">= 4.4 && < 5",
    	">= 5.2 && < 12"
    ],
    	"v8/tools/logreader": [
    	">= 4.4 && < 5",
    	">= 5.2 && < 12"
    ],
    	"v8/tools/profile_view": [
    	">= 4.4 && < 5",
    	">= 5.2 && < 12"
    ],
    	"v8/tools/splaytree": [
    	">= 4.4 && < 5",
    	">= 5.2 && < 12"
    ],
    	v8: v8$1,
    	"node:v8": ">= 16",
    	vm: vm$1,
    	"node:vm": ">= 16",
    	wasi: wasi$1,
    	worker_threads: worker_threads$1,
    	"node:worker_threads": ">= 16",
    	zlib: zlib$1,
    	"node:zlib": ">= 16"
    };

    var has = src;

    function specifierIncluded$1(current, specifier) {
    	var nodeParts = current.split('.');
    	var parts = specifier.split(' ');
    	var op = parts.length > 1 ? parts[0] : '=';
    	var versionParts = (parts.length > 1 ? parts[1] : parts[0]).split('.');

    	for (var i = 0; i < 3; ++i) {
    		var cur = parseInt(nodeParts[i] || 0, 10);
    		var ver = parseInt(versionParts[i] || 0, 10);
    		if (cur === ver) {
    			continue; // eslint-disable-line no-restricted-syntax, no-continue
    		}
    		if (op === '<') {
    			return cur < ver;
    		}
    		if (op === '>=') {
    			return cur >= ver;
    		}
    		return false;
    	}
    	return op === '>=';
    }

    function matchesRange$1(current, range) {
    	var specifiers = range.split(/ ?&& ?/);
    	if (specifiers.length === 0) {
    		return false;
    	}
    	for (var i = 0; i < specifiers.length; ++i) {
    		if (!specifierIncluded$1(current, specifiers[i])) {
    			return false;
    		}
    	}
    	return true;
    }

    function versionIncluded$1(nodeVersion, specifierValue) {
    	if (typeof specifierValue === 'boolean') {
    		return specifierValue;
    	}

    	var current = typeof nodeVersion === 'undefined'
    		? process.versions && process.versions.node && process.versions.node
    		: nodeVersion;

    	if (typeof current !== 'string') {
    		throw new TypeError(typeof nodeVersion === 'undefined' ? 'Unable to determine current node version' : 'If provided, a valid node version is required');
    	}

    	if (specifierValue && typeof specifierValue === 'object') {
    		for (var i = 0; i < specifierValue.length; ++i) {
    			if (matchesRange$1(current, specifierValue[i])) {
    				return true;
    			}
    		}
    		return false;
    	}
    	return matchesRange$1(current, specifierValue);
    }

    var data$1 = require$$1;

    var isCoreModule$1 = function isCore(x, nodeVersion) {
    	return has(data$1, x) && versionIncluded$1(nodeVersion, data$1[x]);
    };

    var fs$6 = fs__default['default'];
    var path$9 = require$$0__default['default'];
    var caller$1 = caller$2;
    var nodeModulesPaths$1 = nodeModulesPaths$2;
    var normalizeOptions$1 = normalizeOptions$2;
    var isCore$2 = isCoreModule$1;

    var realpathFS$1 = fs$6.realpath && typeof fs$6.realpath.native === 'function' ? fs$6.realpath.native : fs$6.realpath;

    var defaultIsFile$1 = function isFile(file, cb) {
        fs$6.stat(file, function (err, stat) {
            if (!err) {
                return cb(null, stat.isFile() || stat.isFIFO());
            }
            if (err.code === 'ENOENT' || err.code === 'ENOTDIR') return cb(null, false);
            return cb(err);
        });
    };

    var defaultIsDir$1 = function isDirectory(dir, cb) {
        fs$6.stat(dir, function (err, stat) {
            if (!err) {
                return cb(null, stat.isDirectory());
            }
            if (err.code === 'ENOENT' || err.code === 'ENOTDIR') return cb(null, false);
            return cb(err);
        });
    };

    var defaultRealpath = function realpath(x, cb) {
        realpathFS$1(x, function (realpathErr, realPath) {
            if (realpathErr && realpathErr.code !== 'ENOENT') cb(realpathErr);
            else cb(null, realpathErr ? x : realPath);
        });
    };

    var maybeRealpath = function maybeRealpath(realpath, x, opts, cb) {
        if (opts && opts.preserveSymlinks === false) {
            realpath(x, cb);
        } else {
            cb(null, x);
        }
    };

    var defaultReadPackage = function defaultReadPackage(readFile, pkgfile, cb) {
        readFile(pkgfile, function (readFileErr, body) {
            if (readFileErr) cb(readFileErr);
            else {
                try {
                    var pkg = JSON.parse(body);
                    cb(null, pkg);
                } catch (jsonErr) {
                    cb(null);
                }
            }
        });
    };

    var getPackageCandidates$1 = function getPackageCandidates(x, start, opts) {
        var dirs = nodeModulesPaths$1(start, opts, x);
        for (var i = 0; i < dirs.length; i++) {
            dirs[i] = path$9.join(dirs[i], x);
        }
        return dirs;
    };

    var async$1 = function resolve(x, options, callback) {
        var cb = callback;
        var opts = options;
        if (typeof options === 'function') {
            cb = opts;
            opts = {};
        }
        if (typeof x !== 'string') {
            var err = new TypeError('Path must be a string.');
            return process.nextTick(function () {
                cb(err);
            });
        }

        opts = normalizeOptions$1(x, opts);

        var isFile = opts.isFile || defaultIsFile$1;
        var isDirectory = opts.isDirectory || defaultIsDir$1;
        var readFile = opts.readFile || fs$6.readFile;
        var realpath = opts.realpath || defaultRealpath;
        var readPackage = opts.readPackage || defaultReadPackage;
        if (opts.readFile && opts.readPackage) {
            var conflictErr = new TypeError('`readFile` and `readPackage` are mutually exclusive.');
            return process.nextTick(function () {
                cb(conflictErr);
            });
        }
        var packageIterator = opts.packageIterator;

        var extensions = opts.extensions || ['.js'];
        var includeCoreModules = opts.includeCoreModules !== false;
        var basedir = opts.basedir || path$9.dirname(caller$1());
        var parent = opts.filename || basedir;

        opts.paths = opts.paths || [];

        // ensure that `basedir` is an absolute path at this point, resolving against the process' current working directory
        var absoluteStart = path$9.resolve(basedir);

        maybeRealpath(
            realpath,
            absoluteStart,
            opts,
            function (err, realStart) {
                if (err) cb(err);
                else init(realStart);
            }
        );

        var res;
        function init(basedir) {
            if ((/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/).test(x)) {
                res = path$9.resolve(basedir, x);
                if (x === '.' || x === '..' || x.slice(-1) === '/') res += '/';
                if ((/\/$/).test(x) && res === basedir) {
                    loadAsDirectory(res, opts.package, onfile);
                } else loadAsFile(res, opts.package, onfile);
            } else if (includeCoreModules && isCore$2(x)) {
                return cb(null, x);
            } else loadNodeModules(x, basedir, function (err, n, pkg) {
                if (err) cb(err);
                else if (n) {
                    return maybeRealpath(realpath, n, opts, function (err, realN) {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, realN, pkg);
                        }
                    });
                } else {
                    var moduleError = new Error("Cannot find module '" + x + "' from '" + parent + "'");
                    moduleError.code = 'MODULE_NOT_FOUND';
                    cb(moduleError);
                }
            });
        }

        function onfile(err, m, pkg) {
            if (err) cb(err);
            else if (m) cb(null, m, pkg);
            else loadAsDirectory(res, function (err, d, pkg) {
                if (err) cb(err);
                else if (d) {
                    maybeRealpath(realpath, d, opts, function (err, realD) {
                        if (err) {
                            cb(err);
                        } else {
                            cb(null, realD, pkg);
                        }
                    });
                } else {
                    var moduleError = new Error("Cannot find module '" + x + "' from '" + parent + "'");
                    moduleError.code = 'MODULE_NOT_FOUND';
                    cb(moduleError);
                }
            });
        }

        function loadAsFile(x, thePackage, callback) {
            var loadAsFilePackage = thePackage;
            var cb = callback;
            if (typeof loadAsFilePackage === 'function') {
                cb = loadAsFilePackage;
                loadAsFilePackage = undefined;
            }

            var exts = [''].concat(extensions);
            load(exts, x, loadAsFilePackage);

            function load(exts, x, loadPackage) {
                if (exts.length === 0) return cb(null, undefined, loadPackage);
                var file = x + exts[0];

                var pkg = loadPackage;
                if (pkg) onpkg(null, pkg);
                else loadpkg(path$9.dirname(file), onpkg);

                function onpkg(err, pkg_, dir) {
                    pkg = pkg_;
                    if (err) return cb(err);
                    if (dir && pkg && opts.pathFilter) {
                        var rfile = path$9.relative(dir, file);
                        var rel = rfile.slice(0, rfile.length - exts[0].length);
                        var r = opts.pathFilter(pkg, x, rel);
                        if (r) return load(
                            [''].concat(extensions.slice()),
                            path$9.resolve(dir, r),
                            pkg
                        );
                    }
                    isFile(file, onex);
                }
                function onex(err, ex) {
                    if (err) return cb(err);
                    if (ex) return cb(null, file, pkg);
                    load(exts.slice(1), x, pkg);
                }
            }
        }

        function loadpkg(dir, cb) {
            if (dir === '' || dir === '/') return cb(null);
            if (process.platform === 'win32' && (/^\w:[/\\]*$/).test(dir)) {
                return cb(null);
            }
            if ((/[/\\]node_modules[/\\]*$/).test(dir)) return cb(null);

            maybeRealpath(realpath, dir, opts, function (unwrapErr, pkgdir) {
                if (unwrapErr) return loadpkg(path$9.dirname(dir), cb);
                var pkgfile = path$9.join(pkgdir, 'package.json');
                isFile(pkgfile, function (err, ex) {
                    // on err, ex is false
                    if (!ex) return loadpkg(path$9.dirname(dir), cb);

                    readPackage(readFile, pkgfile, function (err, pkgParam) {
                        if (err) cb(err);

                        var pkg = pkgParam;

                        if (pkg && opts.packageFilter) {
                            pkg = opts.packageFilter(pkg, pkgfile);
                        }
                        cb(null, pkg, dir);
                    });
                });
            });
        }

        function loadAsDirectory(x, loadAsDirectoryPackage, callback) {
            var cb = callback;
            var fpkg = loadAsDirectoryPackage;
            if (typeof fpkg === 'function') {
                cb = fpkg;
                fpkg = opts.package;
            }

            maybeRealpath(realpath, x, opts, function (unwrapErr, pkgdir) {
                if (unwrapErr) return cb(unwrapErr);
                var pkgfile = path$9.join(pkgdir, 'package.json');
                isFile(pkgfile, function (err, ex) {
                    if (err) return cb(err);
                    if (!ex) return loadAsFile(path$9.join(x, 'index'), fpkg, cb);

                    readPackage(readFile, pkgfile, function (err, pkgParam) {
                        if (err) return cb(err);

                        var pkg = pkgParam;

                        if (pkg && opts.packageFilter) {
                            pkg = opts.packageFilter(pkg, pkgfile);
                        }

                        if (pkg && pkg.main) {
                            if (typeof pkg.main !== 'string') {
                                var mainError = new TypeError('package “' + pkg.name + '” `main` must be a string');
                                mainError.code = 'INVALID_PACKAGE_MAIN';
                                return cb(mainError);
                            }
                            if (pkg.main === '.' || pkg.main === './') {
                                pkg.main = 'index';
                            }
                            loadAsFile(path$9.resolve(x, pkg.main), pkg, function (err, m, pkg) {
                                if (err) return cb(err);
                                if (m) return cb(null, m, pkg);
                                if (!pkg) return loadAsFile(path$9.join(x, 'index'), pkg, cb);

                                var dir = path$9.resolve(x, pkg.main);
                                loadAsDirectory(dir, pkg, function (err, n, pkg) {
                                    if (err) return cb(err);
                                    if (n) return cb(null, n, pkg);
                                    loadAsFile(path$9.join(x, 'index'), pkg, cb);
                                });
                            });
                            return;
                        }

                        loadAsFile(path$9.join(x, '/index'), pkg, cb);
                    });
                });
            });
        }

        function processDirs(cb, dirs) {
            if (dirs.length === 0) return cb(null, undefined);
            var dir = dirs[0];

            isDirectory(path$9.dirname(dir), isdir);

            function isdir(err, isdir) {
                if (err) return cb(err);
                if (!isdir) return processDirs(cb, dirs.slice(1));
                loadAsFile(dir, opts.package, onfile);
            }

            function onfile(err, m, pkg) {
                if (err) return cb(err);
                if (m) return cb(null, m, pkg);
                loadAsDirectory(dir, opts.package, ondir);
            }

            function ondir(err, n, pkg) {
                if (err) return cb(err);
                if (n) return cb(null, n, pkg);
                processDirs(cb, dirs.slice(1));
            }
        }
        function loadNodeModules(x, start, cb) {
            var thunk = function () { return getPackageCandidates$1(x, start, opts); };
            processDirs(
                cb,
                packageIterator ? packageIterator(x, start, thunk, opts) : thunk()
            );
        }
    };

    var assert$2 = true;
    var async_hooks = ">= 8";
    var buffer_ieee754 = "< 0.9.7";
    var buffer = true;
    var child_process = true;
    var cluster = true;
    var console$1 = true;
    var constants$3 = true;
    var crypto = true;
    var _debug_agent = ">= 1 && < 8";
    var _debugger = "< 8";
    var dgram = true;
    var diagnostics_channel = ">= 15.1";
    var dns = true;
    var domain = ">= 0.7.12";
    var events = true;
    var freelist = "< 6";
    var fs$5 = true;
    var _http_agent = ">= 0.11.1";
    var _http_client = ">= 0.11.1";
    var _http_common = ">= 0.11.1";
    var _http_incoming = ">= 0.11.1";
    var _http_outgoing = ">= 0.11.1";
    var _http_server = ">= 0.11.1";
    var http = true;
    var http2 = ">= 8.8";
    var https = true;
    var inspector = ">= 8.0.0";
    var _linklist = "< 8";
    var module = true;
    var net = true;
    var os = true;
    var path$8 = true;
    var perf_hooks = ">= 8.5";
    var process$1 = ">= 1";
    var punycode = true;
    var querystring = true;
    var readline = true;
    var repl = true;
    var smalloc = ">= 0.11.5 && < 3";
    var _stream_duplex = ">= 0.9.4";
    var _stream_transform = ">= 0.9.4";
    var _stream_wrap = ">= 1.4.1";
    var _stream_passthrough = ">= 0.9.4";
    var _stream_readable = ">= 0.9.4";
    var _stream_writable = ">= 0.9.4";
    var stream = true;
    var string_decoder = true;
    var sys = [
    	">= 0.6 && < 0.7",
    	">= 0.8"
    ];
    var timers = true;
    var _tls_common = ">= 0.11.13";
    var _tls_legacy = ">= 0.11.3 && < 10";
    var _tls_wrap = ">= 0.11.3";
    var tls = true;
    var trace_events = ">= 10";
    var tty = true;
    var url = true;
    var util$1 = true;
    var v8 = ">= 1";
    var vm = true;
    var wasi = ">= 13.4 && < 13.5";
    var worker_threads = ">= 11.7";
    var zlib = true;
    var require$$0 = {
    	assert: assert$2,
    	"assert/strict": ">= 15",
    	async_hooks: async_hooks,
    	buffer_ieee754: buffer_ieee754,
    	buffer: buffer,
    	child_process: child_process,
    	cluster: cluster,
    	console: console$1,
    	constants: constants$3,
    	crypto: crypto,
    	_debug_agent: _debug_agent,
    	_debugger: _debugger,
    	dgram: dgram,
    	diagnostics_channel: diagnostics_channel,
    	dns: dns,
    	"dns/promises": ">= 15",
    	domain: domain,
    	events: events,
    	freelist: freelist,
    	fs: fs$5,
    	"fs/promises": [
    	">= 10 && < 10.1",
    	">= 14"
    ],
    	_http_agent: _http_agent,
    	_http_client: _http_client,
    	_http_common: _http_common,
    	_http_incoming: _http_incoming,
    	_http_outgoing: _http_outgoing,
    	_http_server: _http_server,
    	http: http,
    	http2: http2,
    	https: https,
    	inspector: inspector,
    	_linklist: _linklist,
    	module: module,
    	net: net,
    	"node-inspect/lib/_inspect": ">= 7.6.0 && < 12",
    	"node-inspect/lib/internal/inspect_client": ">= 7.6.0 && < 12",
    	"node-inspect/lib/internal/inspect_repl": ">= 7.6.0 && < 12",
    	os: os,
    	path: path$8,
    	"path/posix": ">= 15.3",
    	"path/win32": ">= 15.3",
    	perf_hooks: perf_hooks,
    	process: process$1,
    	punycode: punycode,
    	querystring: querystring,
    	readline: readline,
    	repl: repl,
    	smalloc: smalloc,
    	_stream_duplex: _stream_duplex,
    	_stream_transform: _stream_transform,
    	_stream_wrap: _stream_wrap,
    	_stream_passthrough: _stream_passthrough,
    	_stream_readable: _stream_readable,
    	_stream_writable: _stream_writable,
    	stream: stream,
    	"stream/promises": ">= 15",
    	string_decoder: string_decoder,
    	sys: sys,
    	timers: timers,
    	"timers/promises": ">= 15",
    	_tls_common: _tls_common,
    	_tls_legacy: _tls_legacy,
    	_tls_wrap: _tls_wrap,
    	tls: tls,
    	trace_events: trace_events,
    	tty: tty,
    	url: url,
    	util: util$1,
    	"util/types": ">= 15.3",
    	"v8/tools/arguments": ">= 10 && < 12",
    	"v8/tools/codemap": [
    	">= 4.4.0 && < 5",
    	">= 5.2.0 && < 12"
    ],
    	"v8/tools/consarray": [
    	">= 4.4.0 && < 5",
    	">= 5.2.0 && < 12"
    ],
    	"v8/tools/csvparser": [
    	">= 4.4.0 && < 5",
    	">= 5.2.0 && < 12"
    ],
    	"v8/tools/logreader": [
    	">= 4.4.0 && < 5",
    	">= 5.2.0 && < 12"
    ],
    	"v8/tools/profile_view": [
    	">= 4.4.0 && < 5",
    	">= 5.2.0 && < 12"
    ],
    	"v8/tools/splaytree": [
    	">= 4.4.0 && < 5",
    	">= 5.2.0 && < 12"
    ],
    	v8: v8,
    	vm: vm,
    	wasi: wasi,
    	worker_threads: worker_threads,
    	zlib: zlib
    };

    var current = (process.versions && process.versions.node && process.versions.node.split('.')) || [];

    function specifierIncluded(specifier) {
        var parts = specifier.split(' ');
        var op = parts.length > 1 ? parts[0] : '=';
        var versionParts = (parts.length > 1 ? parts[1] : parts[0]).split('.');

        for (var i = 0; i < 3; ++i) {
            var cur = parseInt(current[i] || 0, 10);
            var ver = parseInt(versionParts[i] || 0, 10);
            if (cur === ver) {
                continue; // eslint-disable-line no-restricted-syntax, no-continue
            }
            if (op === '<') {
                return cur < ver;
            } else if (op === '>=') {
                return cur >= ver;
            } else {
                return false;
            }
        }
        return op === '>=';
    }

    function matchesRange(range) {
        var specifiers = range.split(/ ?&& ?/);
        if (specifiers.length === 0) { return false; }
        for (var i = 0; i < specifiers.length; ++i) {
            if (!specifierIncluded(specifiers[i])) { return false; }
        }
        return true;
    }

    function versionIncluded(specifierValue) {
        if (typeof specifierValue === 'boolean') { return specifierValue; }
        if (specifierValue && typeof specifierValue === 'object') {
            for (var i = 0; i < specifierValue.length; ++i) {
                if (matchesRange(specifierValue[i])) { return true; }
            }
            return false;
        }
        return matchesRange(specifierValue);
    }

    var data = require$$0;

    var core = {};
    for (var mod in data) { // eslint-disable-line no-restricted-syntax
        if (Object.prototype.hasOwnProperty.call(data, mod)) {
            core[mod] = versionIncluded(data[mod]);
        }
    }
    var core_1 = core;

    var isCoreModule = isCoreModule$1;

    var isCore$1 = function isCore(x) {
        return isCoreModule(x);
    };

    var isCore = isCoreModule$1;
    var fs$4 = fs__default['default'];
    var path$7 = require$$0__default['default'];
    var caller = caller$2;
    var nodeModulesPaths = nodeModulesPaths$2;
    var normalizeOptions = normalizeOptions$2;

    var realpathFS = fs$4.realpathSync && typeof fs$4.realpathSync.native === 'function' ? fs$4.realpathSync.native : fs$4.realpathSync;

    var defaultIsFile = function isFile(file) {
        try {
            var stat = fs$4.statSync(file);
        } catch (e) {
            if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return false;
            throw e;
        }
        return stat.isFile() || stat.isFIFO();
    };

    var defaultIsDir = function isDirectory(dir) {
        try {
            var stat = fs$4.statSync(dir);
        } catch (e) {
            if (e && (e.code === 'ENOENT' || e.code === 'ENOTDIR')) return false;
            throw e;
        }
        return stat.isDirectory();
    };

    var defaultRealpathSync = function realpathSync(x) {
        try {
            return realpathFS(x);
        } catch (realpathErr) {
            if (realpathErr.code !== 'ENOENT') {
                throw realpathErr;
            }
        }
        return x;
    };

    var maybeRealpathSync = function maybeRealpathSync(realpathSync, x, opts) {
        if (opts && opts.preserveSymlinks === false) {
            return realpathSync(x);
        }
        return x;
    };

    var defaultReadPackageSync = function defaultReadPackageSync(readFileSync, pkgfile) {
        var body = readFileSync(pkgfile);
        try {
            var pkg = JSON.parse(body);
            return pkg;
        } catch (jsonErr) {}
    };

    var getPackageCandidates = function getPackageCandidates(x, start, opts) {
        var dirs = nodeModulesPaths(start, opts, x);
        for (var i = 0; i < dirs.length; i++) {
            dirs[i] = path$7.join(dirs[i], x);
        }
        return dirs;
    };

    var sync$1 = function resolveSync(x, options) {
        if (typeof x !== 'string') {
            throw new TypeError('Path must be a string.');
        }
        var opts = normalizeOptions(x, options);

        var isFile = opts.isFile || defaultIsFile;
        var readFileSync = opts.readFileSync || fs$4.readFileSync;
        var isDirectory = opts.isDirectory || defaultIsDir;
        var realpathSync = opts.realpathSync || defaultRealpathSync;
        var readPackageSync = opts.readPackageSync || defaultReadPackageSync;
        if (opts.readFileSync && opts.readPackageSync) {
            throw new TypeError('`readFileSync` and `readPackageSync` are mutually exclusive.');
        }
        var packageIterator = opts.packageIterator;

        var extensions = opts.extensions || ['.js'];
        var includeCoreModules = opts.includeCoreModules !== false;
        var basedir = opts.basedir || path$7.dirname(caller());
        var parent = opts.filename || basedir;

        opts.paths = opts.paths || [];

        // ensure that `basedir` is an absolute path at this point, resolving against the process' current working directory
        var absoluteStart = maybeRealpathSync(realpathSync, path$7.resolve(basedir), opts);

        if ((/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/).test(x)) {
            var res = path$7.resolve(absoluteStart, x);
            if (x === '.' || x === '..' || x.slice(-1) === '/') res += '/';
            var m = loadAsFileSync(res) || loadAsDirectorySync(res);
            if (m) return maybeRealpathSync(realpathSync, m, opts);
        } else if (includeCoreModules && isCore(x)) {
            return x;
        } else {
            var n = loadNodeModulesSync(x, absoluteStart);
            if (n) return maybeRealpathSync(realpathSync, n, opts);
        }

        var err = new Error("Cannot find module '" + x + "' from '" + parent + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;

        function loadAsFileSync(x) {
            var pkg = loadpkg(path$7.dirname(x));

            if (pkg && pkg.dir && pkg.pkg && opts.pathFilter) {
                var rfile = path$7.relative(pkg.dir, x);
                var r = opts.pathFilter(pkg.pkg, x, rfile);
                if (r) {
                    x = path$7.resolve(pkg.dir, r); // eslint-disable-line no-param-reassign
                }
            }

            if (isFile(x)) {
                return x;
            }

            for (var i = 0; i < extensions.length; i++) {
                var file = x + extensions[i];
                if (isFile(file)) {
                    return file;
                }
            }
        }

        function loadpkg(dir) {
            if (dir === '' || dir === '/') return;
            if (process.platform === 'win32' && (/^\w:[/\\]*$/).test(dir)) {
                return;
            }
            if ((/[/\\]node_modules[/\\]*$/).test(dir)) return;

            var pkgfile = path$7.join(maybeRealpathSync(realpathSync, dir, opts), 'package.json');

            if (!isFile(pkgfile)) {
                return loadpkg(path$7.dirname(dir));
            }

            var pkg = readPackageSync(readFileSync, pkgfile);

            if (pkg && opts.packageFilter) {
                // v2 will pass pkgfile
                pkg = opts.packageFilter(pkg, /*pkgfile,*/ dir); // eslint-disable-line spaced-comment
            }

            return { pkg: pkg, dir: dir };
        }

        function loadAsDirectorySync(x) {
            var pkgfile = path$7.join(maybeRealpathSync(realpathSync, x, opts), '/package.json');
            if (isFile(pkgfile)) {
                try {
                    var pkg = readPackageSync(readFileSync, pkgfile);
                } catch (e) {}

                if (pkg && opts.packageFilter) {
                    // v2 will pass pkgfile
                    pkg = opts.packageFilter(pkg, /*pkgfile,*/ x); // eslint-disable-line spaced-comment
                }

                if (pkg && pkg.main) {
                    if (typeof pkg.main !== 'string') {
                        var mainError = new TypeError('package “' + pkg.name + '” `main` must be a string');
                        mainError.code = 'INVALID_PACKAGE_MAIN';
                        throw mainError;
                    }
                    if (pkg.main === '.' || pkg.main === './') {
                        pkg.main = 'index';
                    }
                    try {
                        var m = loadAsFileSync(path$7.resolve(x, pkg.main));
                        if (m) return m;
                        var n = loadAsDirectorySync(path$7.resolve(x, pkg.main));
                        if (n) return n;
                    } catch (e) {}
                }
            }

            return loadAsFileSync(path$7.join(x, '/index'));
        }

        function loadNodeModulesSync(x, start) {
            var thunk = function () { return getPackageCandidates(x, start, opts); };
            var dirs = packageIterator ? packageIterator(x, start, thunk, opts) : thunk();

            for (var i = 0; i < dirs.length; i++) {
                var dir = dirs[i];
                if (isDirectory(path$7.dirname(dir))) {
                    var m = loadAsFileSync(dir);
                    if (m) return m;
                    var n = loadAsDirectorySync(dir);
                    if (n) return n;
                }
            }
        }
    };

    var async = async$1;
    async.core = core_1;
    async.isCore = isCore$1;
    async.sync = sync$1;

    var resolve = async;

    var utils$3 = {};

    const path$6 = require$$0__default['default'];
    const WIN_SLASH = '\\\\/';
    const WIN_NO_SLASH = `[^${WIN_SLASH}]`;

    /**
     * Posix glob regex
     */

    const DOT_LITERAL = '\\.';
    const PLUS_LITERAL = '\\+';
    const QMARK_LITERAL = '\\?';
    const SLASH_LITERAL = '\\/';
    const ONE_CHAR = '(?=.)';
    const QMARK = '[^/]';
    const END_ANCHOR = `(?:${SLASH_LITERAL}|$)`;
    const START_ANCHOR = `(?:^|${SLASH_LITERAL})`;
    const DOTS_SLASH = `${DOT_LITERAL}{1,2}${END_ANCHOR}`;
    const NO_DOT = `(?!${DOT_LITERAL})`;
    const NO_DOTS = `(?!${START_ANCHOR}${DOTS_SLASH})`;
    const NO_DOT_SLASH = `(?!${DOT_LITERAL}{0,1}${END_ANCHOR})`;
    const NO_DOTS_SLASH = `(?!${DOTS_SLASH})`;
    const QMARK_NO_DOT = `[^.${SLASH_LITERAL}]`;
    const STAR = `${QMARK}*?`;

    const POSIX_CHARS = {
      DOT_LITERAL,
      PLUS_LITERAL,
      QMARK_LITERAL,
      SLASH_LITERAL,
      ONE_CHAR,
      QMARK,
      END_ANCHOR,
      DOTS_SLASH,
      NO_DOT,
      NO_DOTS,
      NO_DOT_SLASH,
      NO_DOTS_SLASH,
      QMARK_NO_DOT,
      STAR,
      START_ANCHOR
    };

    /**
     * Windows glob regex
     */

    const WINDOWS_CHARS = {
      ...POSIX_CHARS,

      SLASH_LITERAL: `[${WIN_SLASH}]`,
      QMARK: WIN_NO_SLASH,
      STAR: `${WIN_NO_SLASH}*?`,
      DOTS_SLASH: `${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$)`,
      NO_DOT: `(?!${DOT_LITERAL})`,
      NO_DOTS: `(?!(?:^|[${WIN_SLASH}])${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      NO_DOT_SLASH: `(?!${DOT_LITERAL}{0,1}(?:[${WIN_SLASH}]|$))`,
      NO_DOTS_SLASH: `(?!${DOT_LITERAL}{1,2}(?:[${WIN_SLASH}]|$))`,
      QMARK_NO_DOT: `[^.${WIN_SLASH}]`,
      START_ANCHOR: `(?:^|[${WIN_SLASH}])`,
      END_ANCHOR: `(?:[${WIN_SLASH}]|$)`
    };

    /**
     * POSIX Bracket Regex
     */

    const POSIX_REGEX_SOURCE$1 = {
      alnum: 'a-zA-Z0-9',
      alpha: 'a-zA-Z',
      ascii: '\\x00-\\x7F',
      blank: ' \\t',
      cntrl: '\\x00-\\x1F\\x7F',
      digit: '0-9',
      graph: '\\x21-\\x7E',
      lower: 'a-z',
      print: '\\x20-\\x7E ',
      punct: '\\-!"#$%&\'()\\*+,./:;<=>?@[\\]^_`{|}~',
      space: ' \\t\\r\\n\\v\\f',
      upper: 'A-Z',
      word: 'A-Za-z0-9_',
      xdigit: 'A-Fa-f0-9'
    };

    var constants$2 = {
      MAX_LENGTH: 1024 * 64,
      POSIX_REGEX_SOURCE: POSIX_REGEX_SOURCE$1,

      // regular expressions
      REGEX_BACKSLASH: /\\(?![*+?^${}(|)[\]])/g,
      REGEX_NON_SPECIAL_CHARS: /^[^@![\].,$*+?^{}()|\\/]+/,
      REGEX_SPECIAL_CHARS: /[-*+?.^${}(|)[\]]/,
      REGEX_SPECIAL_CHARS_BACKREF: /(\\?)((\W)(\3*))/g,
      REGEX_SPECIAL_CHARS_GLOBAL: /([-*+?.^${}(|)[\]])/g,
      REGEX_REMOVE_BACKSLASH: /(?:\[.*?[^\\]\]|\\(?=.))/g,

      // Replace globs with equivalent patterns to reduce parsing time.
      REPLACEMENTS: {
        '***': '*',
        '**/**': '**',
        '**/**/**': '**'
      },

      // Digits
      CHAR_0: 48, /* 0 */
      CHAR_9: 57, /* 9 */

      // Alphabet chars.
      CHAR_UPPERCASE_A: 65, /* A */
      CHAR_LOWERCASE_A: 97, /* a */
      CHAR_UPPERCASE_Z: 90, /* Z */
      CHAR_LOWERCASE_Z: 122, /* z */

      CHAR_LEFT_PARENTHESES: 40, /* ( */
      CHAR_RIGHT_PARENTHESES: 41, /* ) */

      CHAR_ASTERISK: 42, /* * */

      // Non-alphabetic chars.
      CHAR_AMPERSAND: 38, /* & */
      CHAR_AT: 64, /* @ */
      CHAR_BACKWARD_SLASH: 92, /* \ */
      CHAR_CARRIAGE_RETURN: 13, /* \r */
      CHAR_CIRCUMFLEX_ACCENT: 94, /* ^ */
      CHAR_COLON: 58, /* : */
      CHAR_COMMA: 44, /* , */
      CHAR_DOT: 46, /* . */
      CHAR_DOUBLE_QUOTE: 34, /* " */
      CHAR_EQUAL: 61, /* = */
      CHAR_EXCLAMATION_MARK: 33, /* ! */
      CHAR_FORM_FEED: 12, /* \f */
      CHAR_FORWARD_SLASH: 47, /* / */
      CHAR_GRAVE_ACCENT: 96, /* ` */
      CHAR_HASH: 35, /* # */
      CHAR_HYPHEN_MINUS: 45, /* - */
      CHAR_LEFT_ANGLE_BRACKET: 60, /* < */
      CHAR_LEFT_CURLY_BRACE: 123, /* { */
      CHAR_LEFT_SQUARE_BRACKET: 91, /* [ */
      CHAR_LINE_FEED: 10, /* \n */
      CHAR_NO_BREAK_SPACE: 160, /* \u00A0 */
      CHAR_PERCENT: 37, /* % */
      CHAR_PLUS: 43, /* + */
      CHAR_QUESTION_MARK: 63, /* ? */
      CHAR_RIGHT_ANGLE_BRACKET: 62, /* > */
      CHAR_RIGHT_CURLY_BRACE: 125, /* } */
      CHAR_RIGHT_SQUARE_BRACKET: 93, /* ] */
      CHAR_SEMICOLON: 59, /* ; */
      CHAR_SINGLE_QUOTE: 39, /* ' */
      CHAR_SPACE: 32, /*   */
      CHAR_TAB: 9, /* \t */
      CHAR_UNDERSCORE: 95, /* _ */
      CHAR_VERTICAL_LINE: 124, /* | */
      CHAR_ZERO_WIDTH_NOBREAK_SPACE: 65279, /* \uFEFF */

      SEP: path$6.sep,

      /**
       * Create EXTGLOB_CHARS
       */

      extglobChars(chars) {
        return {
          '!': { type: 'negate', open: '(?:(?!(?:', close: `))${chars.STAR})` },
          '?': { type: 'qmark', open: '(?:', close: ')?' },
          '+': { type: 'plus', open: '(?:', close: ')+' },
          '*': { type: 'star', open: '(?:', close: ')*' },
          '@': { type: 'at', open: '(?:', close: ')' }
        };
      },

      /**
       * Create GLOB_CHARS
       */

      globChars(win32) {
        return win32 === true ? WINDOWS_CHARS : POSIX_CHARS;
      }
    };

    (function (exports) {

    const path = require$$0__default['default'];
    const win32 = process.platform === 'win32';
    const {
      REGEX_BACKSLASH,
      REGEX_REMOVE_BACKSLASH,
      REGEX_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_GLOBAL
    } = constants$2;

    exports.isObject = val => val !== null && typeof val === 'object' && !Array.isArray(val);
    exports.hasRegexChars = str => REGEX_SPECIAL_CHARS.test(str);
    exports.isRegexChar = str => str.length === 1 && exports.hasRegexChars(str);
    exports.escapeRegex = str => str.replace(REGEX_SPECIAL_CHARS_GLOBAL, '\\$1');
    exports.toPosixSlashes = str => str.replace(REGEX_BACKSLASH, '/');

    exports.removeBackslashes = str => {
      return str.replace(REGEX_REMOVE_BACKSLASH, match => {
        return match === '\\' ? '' : match;
      });
    };

    exports.supportsLookbehinds = () => {
      const segs = process.version.slice(1).split('.').map(Number);
      if (segs.length === 3 && segs[0] >= 9 || (segs[0] === 8 && segs[1] >= 10)) {
        return true;
      }
      return false;
    };

    exports.isWindows = options => {
      if (options && typeof options.windows === 'boolean') {
        return options.windows;
      }
      return win32 === true || path.sep === '\\';
    };

    exports.escapeLast = (input, char, lastIdx) => {
      const idx = input.lastIndexOf(char, lastIdx);
      if (idx === -1) return input;
      if (input[idx - 1] === '\\') return exports.escapeLast(input, char, idx - 1);
      return `${input.slice(0, idx)}\\${input.slice(idx)}`;
    };

    exports.removePrefix = (input, state = {}) => {
      let output = input;
      if (output.startsWith('./')) {
        output = output.slice(2);
        state.prefix = './';
      }
      return output;
    };

    exports.wrapOutput = (input, state = {}, options = {}) => {
      const prepend = options.contains ? '' : '^';
      const append = options.contains ? '' : '$';

      let output = `${prepend}(?:${input})${append}`;
      if (state.negated === true) {
        output = `(?:^(?!${output}).*$)`;
      }
      return output;
    };
    }(utils$3));

    const utils$2 = utils$3;
    const {
      CHAR_ASTERISK,             /* * */
      CHAR_AT,                   /* @ */
      CHAR_BACKWARD_SLASH,       /* \ */
      CHAR_COMMA,                /* , */
      CHAR_DOT,                  /* . */
      CHAR_EXCLAMATION_MARK,     /* ! */
      CHAR_FORWARD_SLASH,        /* / */
      CHAR_LEFT_CURLY_BRACE,     /* { */
      CHAR_LEFT_PARENTHESES,     /* ( */
      CHAR_LEFT_SQUARE_BRACKET,  /* [ */
      CHAR_PLUS,                 /* + */
      CHAR_QUESTION_MARK,        /* ? */
      CHAR_RIGHT_CURLY_BRACE,    /* } */
      CHAR_RIGHT_PARENTHESES,    /* ) */
      CHAR_RIGHT_SQUARE_BRACKET  /* ] */
    } = constants$2;

    const isPathSeparator = code => {
      return code === CHAR_FORWARD_SLASH || code === CHAR_BACKWARD_SLASH;
    };

    const depth = token => {
      if (token.isPrefix !== true) {
        token.depth = token.isGlobstar ? Infinity : 1;
      }
    };

    /**
     * Quickly scans a glob pattern and returns an object with a handful of
     * useful properties, like `isGlob`, `path` (the leading non-glob, if it exists),
     * `glob` (the actual pattern), and `negated` (true if the path starts with `!`).
     *
     * ```js
     * const pm = require('picomatch');
     * console.log(pm.scan('foo/bar/*.js'));
     * { isGlob: true, input: 'foo/bar/*.js', base: 'foo/bar', glob: '*.js' }
     * ```
     * @param {String} `str`
     * @param {Object} `options`
     * @return {Object} Returns an object with tokens and regex source string.
     * @api public
     */

    const scan$1 = (input, options) => {
      const opts = options || {};

      const length = input.length - 1;
      const scanToEnd = opts.parts === true || opts.scanToEnd === true;
      const slashes = [];
      const tokens = [];
      const parts = [];

      let str = input;
      let index = -1;
      let start = 0;
      let lastIndex = 0;
      let isBrace = false;
      let isBracket = false;
      let isGlob = false;
      let isExtglob = false;
      let isGlobstar = false;
      let braceEscaped = false;
      let backslashes = false;
      let negated = false;
      let finished = false;
      let braces = 0;
      let prev;
      let code;
      let token = { value: '', depth: 0, isGlob: false };

      const eos = () => index >= length;
      const peek = () => str.charCodeAt(index + 1);
      const advance = () => {
        prev = code;
        return str.charCodeAt(++index);
      };

      while (index < length) {
        code = advance();
        let next;

        if (code === CHAR_BACKWARD_SLASH) {
          backslashes = token.backslashes = true;
          code = advance();

          if (code === CHAR_LEFT_CURLY_BRACE) {
            braceEscaped = true;
          }
          continue;
        }

        if (braceEscaped === true || code === CHAR_LEFT_CURLY_BRACE) {
          braces++;

          while (eos() !== true && (code = advance())) {
            if (code === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }

            if (code === CHAR_LEFT_CURLY_BRACE) {
              braces++;
              continue;
            }

            if (braceEscaped !== true && code === CHAR_DOT && (code = advance()) === CHAR_DOT) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;

              if (scanToEnd === true) {
                continue;
              }

              break;
            }

            if (braceEscaped !== true && code === CHAR_COMMA) {
              isBrace = token.isBrace = true;
              isGlob = token.isGlob = true;
              finished = true;

              if (scanToEnd === true) {
                continue;
              }

              break;
            }

            if (code === CHAR_RIGHT_CURLY_BRACE) {
              braces--;

              if (braces === 0) {
                braceEscaped = false;
                isBrace = token.isBrace = true;
                finished = true;
                break;
              }
            }
          }

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (code === CHAR_FORWARD_SLASH) {
          slashes.push(index);
          tokens.push(token);
          token = { value: '', depth: 0, isGlob: false };

          if (finished === true) continue;
          if (prev === CHAR_DOT && index === (start + 1)) {
            start += 2;
            continue;
          }

          lastIndex = index + 1;
          continue;
        }

        if (opts.noext !== true) {
          const isExtglobChar = code === CHAR_PLUS
            || code === CHAR_AT
            || code === CHAR_ASTERISK
            || code === CHAR_QUESTION_MARK
            || code === CHAR_EXCLAMATION_MARK;

          if (isExtglobChar === true && peek() === CHAR_LEFT_PARENTHESES) {
            isGlob = token.isGlob = true;
            isExtglob = token.isExtglob = true;
            finished = true;

            if (scanToEnd === true) {
              while (eos() !== true && (code = advance())) {
                if (code === CHAR_BACKWARD_SLASH) {
                  backslashes = token.backslashes = true;
                  code = advance();
                  continue;
                }

                if (code === CHAR_RIGHT_PARENTHESES) {
                  isGlob = token.isGlob = true;
                  finished = true;
                  break;
                }
              }
              continue;
            }
            break;
          }
        }

        if (code === CHAR_ASTERISK) {
          if (prev === CHAR_ASTERISK) isGlobstar = token.isGlobstar = true;
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }
          break;
        }

        if (code === CHAR_QUESTION_MARK) {
          isGlob = token.isGlob = true;
          finished = true;

          if (scanToEnd === true) {
            continue;
          }
          break;
        }

        if (code === CHAR_LEFT_SQUARE_BRACKET) {
          while (eos() !== true && (next = advance())) {
            if (next === CHAR_BACKWARD_SLASH) {
              backslashes = token.backslashes = true;
              advance();
              continue;
            }

            if (next === CHAR_RIGHT_SQUARE_BRACKET) {
              isBracket = token.isBracket = true;
              isGlob = token.isGlob = true;
              finished = true;
              break;
            }
          }

          if (scanToEnd === true) {
            continue;
          }

          break;
        }

        if (opts.nonegate !== true && code === CHAR_EXCLAMATION_MARK && index === start) {
          negated = token.negated = true;
          start++;
          continue;
        }

        if (opts.noparen !== true && code === CHAR_LEFT_PARENTHESES) {
          isGlob = token.isGlob = true;

          if (scanToEnd === true) {
            while (eos() !== true && (code = advance())) {
              if (code === CHAR_LEFT_PARENTHESES) {
                backslashes = token.backslashes = true;
                code = advance();
                continue;
              }

              if (code === CHAR_RIGHT_PARENTHESES) {
                finished = true;
                break;
              }
            }
            continue;
          }
          break;
        }

        if (isGlob === true) {
          finished = true;

          if (scanToEnd === true) {
            continue;
          }

          break;
        }
      }

      if (opts.noext === true) {
        isExtglob = false;
        isGlob = false;
      }

      let base = str;
      let prefix = '';
      let glob = '';

      if (start > 0) {
        prefix = str.slice(0, start);
        str = str.slice(start);
        lastIndex -= start;
      }

      if (base && isGlob === true && lastIndex > 0) {
        base = str.slice(0, lastIndex);
        glob = str.slice(lastIndex);
      } else if (isGlob === true) {
        base = '';
        glob = str;
      } else {
        base = str;
      }

      if (base && base !== '' && base !== '/' && base !== str) {
        if (isPathSeparator(base.charCodeAt(base.length - 1))) {
          base = base.slice(0, -1);
        }
      }

      if (opts.unescape === true) {
        if (glob) glob = utils$2.removeBackslashes(glob);

        if (base && backslashes === true) {
          base = utils$2.removeBackslashes(base);
        }
      }

      const state = {
        prefix,
        input,
        start,
        base,
        glob,
        isBrace,
        isBracket,
        isGlob,
        isExtglob,
        isGlobstar,
        negated
      };

      if (opts.tokens === true) {
        state.maxDepth = 0;
        if (!isPathSeparator(code)) {
          tokens.push(token);
        }
        state.tokens = tokens;
      }

      if (opts.parts === true || opts.tokens === true) {
        let prevIndex;

        for (let idx = 0; idx < slashes.length; idx++) {
          const n = prevIndex ? prevIndex + 1 : start;
          const i = slashes[idx];
          const value = input.slice(n, i);
          if (opts.tokens) {
            if (idx === 0 && start !== 0) {
              tokens[idx].isPrefix = true;
              tokens[idx].value = prefix;
            } else {
              tokens[idx].value = value;
            }
            depth(tokens[idx]);
            state.maxDepth += tokens[idx].depth;
          }
          if (idx !== 0 || value !== '') {
            parts.push(value);
          }
          prevIndex = i;
        }

        if (prevIndex && prevIndex + 1 < input.length) {
          const value = input.slice(prevIndex + 1);
          parts.push(value);

          if (opts.tokens) {
            tokens[tokens.length - 1].value = value;
            depth(tokens[tokens.length - 1]);
            state.maxDepth += tokens[tokens.length - 1].depth;
          }
        }

        state.slashes = slashes;
        state.parts = parts;
      }

      return state;
    };

    var scan_1 = scan$1;

    const constants$1 = constants$2;
    const utils$1 = utils$3;

    /**
     * Constants
     */

    const {
      MAX_LENGTH,
      POSIX_REGEX_SOURCE,
      REGEX_NON_SPECIAL_CHARS,
      REGEX_SPECIAL_CHARS_BACKREF,
      REPLACEMENTS
    } = constants$1;

    /**
     * Helpers
     */

    const expandRange = (args, options) => {
      if (typeof options.expandRange === 'function') {
        return options.expandRange(...args, options);
      }

      args.sort();
      const value = `[${args.join('-')}]`;

      try {
        /* eslint-disable-next-line no-new */
        new RegExp(value);
      } catch (ex) {
        return args.map(v => utils$1.escapeRegex(v)).join('..');
      }

      return value;
    };

    /**
     * Create the message for a syntax error
     */

    const syntaxError = (type, char) => {
      return `Missing ${type}: "${char}" - use "\\\\${char}" to match literal characters`;
    };

    /**
     * Parse the given input string.
     * @param {String} input
     * @param {Object} options
     * @return {Object}
     */

    const parse$2 = (input, options) => {
      if (typeof input !== 'string') {
        throw new TypeError('Expected a string');
      }

      input = REPLACEMENTS[input] || input;

      const opts = { ...options };
      const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;

      let len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }

      const bos = { type: 'bos', value: '', output: opts.prepend || '' };
      const tokens = [bos];

      const capture = opts.capture ? '' : '?:';
      const win32 = utils$1.isWindows(options);

      // create constants based on platform, for windows or posix
      const PLATFORM_CHARS = constants$1.globChars(win32);
      const EXTGLOB_CHARS = constants$1.extglobChars(PLATFORM_CHARS);

      const {
        DOT_LITERAL,
        PLUS_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOT_SLASH,
        NO_DOTS_SLASH,
        QMARK,
        QMARK_NO_DOT,
        STAR,
        START_ANCHOR
      } = PLATFORM_CHARS;

      const globstar = (opts) => {
        return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };

      const nodot = opts.dot ? '' : NO_DOT;
      const qmarkNoDot = opts.dot ? QMARK : QMARK_NO_DOT;
      let star = opts.bash === true ? globstar(opts) : STAR;

      if (opts.capture) {
        star = `(${star})`;
      }

      // minimatch options support
      if (typeof opts.noext === 'boolean') {
        opts.noextglob = opts.noext;
      }

      const state = {
        input,
        index: -1,
        start: 0,
        dot: opts.dot === true,
        consumed: '',
        output: '',
        prefix: '',
        backtrack: false,
        negated: false,
        brackets: 0,
        braces: 0,
        parens: 0,
        quotes: 0,
        globstar: false,
        tokens
      };

      input = utils$1.removePrefix(input, state);
      len = input.length;

      const extglobs = [];
      const braces = [];
      const stack = [];
      let prev = bos;
      let value;

      /**
       * Tokenizing helpers
       */

      const eos = () => state.index === len - 1;
      const peek = state.peek = (n = 1) => input[state.index + n];
      const advance = state.advance = () => input[++state.index];
      const remaining = () => input.slice(state.index + 1);
      const consume = (value = '', num = 0) => {
        state.consumed += value;
        state.index += num;
      };
      const append = token => {
        state.output += token.output != null ? token.output : token.value;
        consume(token.value);
      };

      const negate = () => {
        let count = 1;

        while (peek() === '!' && (peek(2) !== '(' || peek(3) === '?')) {
          advance();
          state.start++;
          count++;
        }

        if (count % 2 === 0) {
          return false;
        }

        state.negated = true;
        state.start++;
        return true;
      };

      const increment = type => {
        state[type]++;
        stack.push(type);
      };

      const decrement = type => {
        state[type]--;
        stack.pop();
      };

      /**
       * Push tokens onto the tokens array. This helper speeds up
       * tokenizing by 1) helping us avoid backtracking as much as possible,
       * and 2) helping us avoid creating extra tokens when consecutive
       * characters are plain text. This improves performance and simplifies
       * lookbehinds.
       */

      const push = tok => {
        if (prev.type === 'globstar') {
          const isBrace = state.braces > 0 && (tok.type === 'comma' || tok.type === 'brace');
          const isExtglob = tok.extglob === true || (extglobs.length && (tok.type === 'pipe' || tok.type === 'paren'));

          if (tok.type !== 'slash' && tok.type !== 'paren' && !isBrace && !isExtglob) {
            state.output = state.output.slice(0, -prev.output.length);
            prev.type = 'star';
            prev.value = '*';
            prev.output = star;
            state.output += prev.output;
          }
        }

        if (extglobs.length && tok.type !== 'paren' && !EXTGLOB_CHARS[tok.value]) {
          extglobs[extglobs.length - 1].inner += tok.value;
        }

        if (tok.value || tok.output) append(tok);
        if (prev && prev.type === 'text' && tok.type === 'text') {
          prev.value += tok.value;
          prev.output = (prev.output || '') + tok.value;
          return;
        }

        tok.prev = prev;
        tokens.push(tok);
        prev = tok;
      };

      const extglobOpen = (type, value) => {
        const token = { ...EXTGLOB_CHARS[value], conditions: 1, inner: '' };

        token.prev = prev;
        token.parens = state.parens;
        token.output = state.output;
        const output = (opts.capture ? '(' : '') + token.open;

        increment('parens');
        push({ type, value, output: state.output ? '' : ONE_CHAR });
        push({ type: 'paren', extglob: true, value: advance(), output });
        extglobs.push(token);
      };

      const extglobClose = token => {
        let output = token.close + (opts.capture ? ')' : '');

        if (token.type === 'negate') {
          let extglobStar = star;

          if (token.inner && token.inner.length > 1 && token.inner.includes('/')) {
            extglobStar = globstar(opts);
          }

          if (extglobStar !== star || eos() || /^\)+$/.test(remaining())) {
            output = token.close = `)$))${extglobStar}`;
          }

          if (token.prev.type === 'bos') {
            state.negatedExtglob = true;
          }
        }

        push({ type: 'paren', extglob: true, value, output });
        decrement('parens');
      };

      /**
       * Fast paths
       */

      if (opts.fastpaths !== false && !/(^[*!]|[/()[\]{}"])/.test(input)) {
        let backslashes = false;

        let output = input.replace(REGEX_SPECIAL_CHARS_BACKREF, (m, esc, chars, first, rest, index) => {
          if (first === '\\') {
            backslashes = true;
            return m;
          }

          if (first === '?') {
            if (esc) {
              return esc + first + (rest ? QMARK.repeat(rest.length) : '');
            }
            if (index === 0) {
              return qmarkNoDot + (rest ? QMARK.repeat(rest.length) : '');
            }
            return QMARK.repeat(chars.length);
          }

          if (first === '.') {
            return DOT_LITERAL.repeat(chars.length);
          }

          if (first === '*') {
            if (esc) {
              return esc + first + (rest ? star : '');
            }
            return star;
          }
          return esc ? m : `\\${m}`;
        });

        if (backslashes === true) {
          if (opts.unescape === true) {
            output = output.replace(/\\/g, '');
          } else {
            output = output.replace(/\\+/g, m => {
              return m.length % 2 === 0 ? '\\\\' : (m ? '\\' : '');
            });
          }
        }

        if (output === input && opts.contains === true) {
          state.output = input;
          return state;
        }

        state.output = utils$1.wrapOutput(output, state, options);
        return state;
      }

      /**
       * Tokenize input until we reach end-of-string
       */

      while (!eos()) {
        value = advance();

        if (value === '\u0000') {
          continue;
        }

        /**
         * Escaped characters
         */

        if (value === '\\') {
          const next = peek();

          if (next === '/' && opts.bash !== true) {
            continue;
          }

          if (next === '.' || next === ';') {
            continue;
          }

          if (!next) {
            value += '\\';
            push({ type: 'text', value });
            continue;
          }

          // collapse slashes to reduce potential for exploits
          const match = /^\\+/.exec(remaining());
          let slashes = 0;

          if (match && match[0].length > 2) {
            slashes = match[0].length;
            state.index += slashes;
            if (slashes % 2 !== 0) {
              value += '\\';
            }
          }

          if (opts.unescape === true) {
            value = advance() || '';
          } else {
            value += advance() || '';
          }

          if (state.brackets === 0) {
            push({ type: 'text', value });
            continue;
          }
        }

        /**
         * If we're inside a regex character class, continue
         * until we reach the closing bracket.
         */

        if (state.brackets > 0 && (value !== ']' || prev.value === '[' || prev.value === '[^')) {
          if (opts.posix !== false && value === ':') {
            const inner = prev.value.slice(1);
            if (inner.includes('[')) {
              prev.posix = true;

              if (inner.includes(':')) {
                const idx = prev.value.lastIndexOf('[');
                const pre = prev.value.slice(0, idx);
                const rest = prev.value.slice(idx + 2);
                const posix = POSIX_REGEX_SOURCE[rest];
                if (posix) {
                  prev.value = pre + posix;
                  state.backtrack = true;
                  advance();

                  if (!bos.output && tokens.indexOf(prev) === 1) {
                    bos.output = ONE_CHAR;
                  }
                  continue;
                }
              }
            }
          }

          if ((value === '[' && peek() !== ':') || (value === '-' && peek() === ']')) {
            value = `\\${value}`;
          }

          if (value === ']' && (prev.value === '[' || prev.value === '[^')) {
            value = `\\${value}`;
          }

          if (opts.posix === true && value === '!' && prev.value === '[') {
            value = '^';
          }

          prev.value += value;
          append({ value });
          continue;
        }

        /**
         * If we're inside a quoted string, continue
         * until we reach the closing double quote.
         */

        if (state.quotes === 1 && value !== '"') {
          value = utils$1.escapeRegex(value);
          prev.value += value;
          append({ value });
          continue;
        }

        /**
         * Double quotes
         */

        if (value === '"') {
          state.quotes = state.quotes === 1 ? 0 : 1;
          if (opts.keepQuotes === true) {
            push({ type: 'text', value });
          }
          continue;
        }

        /**
         * Parentheses
         */

        if (value === '(') {
          increment('parens');
          push({ type: 'paren', value });
          continue;
        }

        if (value === ')') {
          if (state.parens === 0 && opts.strictBrackets === true) {
            throw new SyntaxError(syntaxError('opening', '('));
          }

          const extglob = extglobs[extglobs.length - 1];
          if (extglob && state.parens === extglob.parens + 1) {
            extglobClose(extglobs.pop());
            continue;
          }

          push({ type: 'paren', value, output: state.parens ? ')' : '\\)' });
          decrement('parens');
          continue;
        }

        /**
         * Square brackets
         */

        if (value === '[') {
          if (opts.nobracket === true || !remaining().includes(']')) {
            if (opts.nobracket !== true && opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError('closing', ']'));
            }

            value = `\\${value}`;
          } else {
            increment('brackets');
          }

          push({ type: 'bracket', value });
          continue;
        }

        if (value === ']') {
          if (opts.nobracket === true || (prev && prev.type === 'bracket' && prev.value.length === 1)) {
            push({ type: 'text', value, output: `\\${value}` });
            continue;
          }

          if (state.brackets === 0) {
            if (opts.strictBrackets === true) {
              throw new SyntaxError(syntaxError('opening', '['));
            }

            push({ type: 'text', value, output: `\\${value}` });
            continue;
          }

          decrement('brackets');

          const prevValue = prev.value.slice(1);
          if (prev.posix !== true && prevValue[0] === '^' && !prevValue.includes('/')) {
            value = `/${value}`;
          }

          prev.value += value;
          append({ value });

          // when literal brackets are explicitly disabled
          // assume we should match with a regex character class
          if (opts.literalBrackets === false || utils$1.hasRegexChars(prevValue)) {
            continue;
          }

          const escaped = utils$1.escapeRegex(prev.value);
          state.output = state.output.slice(0, -prev.value.length);

          // when literal brackets are explicitly enabled
          // assume we should escape the brackets to match literal characters
          if (opts.literalBrackets === true) {
            state.output += escaped;
            prev.value = escaped;
            continue;
          }

          // when the user specifies nothing, try to match both
          prev.value = `(${capture}${escaped}|${prev.value})`;
          state.output += prev.value;
          continue;
        }

        /**
         * Braces
         */

        if (value === '{' && opts.nobrace !== true) {
          increment('braces');

          const open = {
            type: 'brace',
            value,
            output: '(',
            outputIndex: state.output.length,
            tokensIndex: state.tokens.length
          };

          braces.push(open);
          push(open);
          continue;
        }

        if (value === '}') {
          const brace = braces[braces.length - 1];

          if (opts.nobrace === true || !brace) {
            push({ type: 'text', value, output: value });
            continue;
          }

          let output = ')';

          if (brace.dots === true) {
            const arr = tokens.slice();
            const range = [];

            for (let i = arr.length - 1; i >= 0; i--) {
              tokens.pop();
              if (arr[i].type === 'brace') {
                break;
              }
              if (arr[i].type !== 'dots') {
                range.unshift(arr[i].value);
              }
            }

            output = expandRange(range, opts);
            state.backtrack = true;
          }

          if (brace.comma !== true && brace.dots !== true) {
            const out = state.output.slice(0, brace.outputIndex);
            const toks = state.tokens.slice(brace.tokensIndex);
            brace.value = brace.output = '\\{';
            value = output = '\\}';
            state.output = out;
            for (const t of toks) {
              state.output += (t.output || t.value);
            }
          }

          push({ type: 'brace', value, output });
          decrement('braces');
          braces.pop();
          continue;
        }

        /**
         * Pipes
         */

        if (value === '|') {
          if (extglobs.length > 0) {
            extglobs[extglobs.length - 1].conditions++;
          }
          push({ type: 'text', value });
          continue;
        }

        /**
         * Commas
         */

        if (value === ',') {
          let output = value;

          const brace = braces[braces.length - 1];
          if (brace && stack[stack.length - 1] === 'braces') {
            brace.comma = true;
            output = '|';
          }

          push({ type: 'comma', value, output });
          continue;
        }

        /**
         * Slashes
         */

        if (value === '/') {
          // if the beginning of the glob is "./", advance the start
          // to the current index, and don't add the "./" characters
          // to the state. This greatly simplifies lookbehinds when
          // checking for BOS characters like "!" and "." (not "./")
          if (prev.type === 'dot' && state.index === state.start + 1) {
            state.start = state.index + 1;
            state.consumed = '';
            state.output = '';
            tokens.pop();
            prev = bos; // reset "prev" to the first token
            continue;
          }

          push({ type: 'slash', value, output: SLASH_LITERAL });
          continue;
        }

        /**
         * Dots
         */

        if (value === '.') {
          if (state.braces > 0 && prev.type === 'dot') {
            if (prev.value === '.') prev.output = DOT_LITERAL;
            const brace = braces[braces.length - 1];
            prev.type = 'dots';
            prev.output += value;
            prev.value += value;
            brace.dots = true;
            continue;
          }

          if ((state.braces + state.parens) === 0 && prev.type !== 'bos' && prev.type !== 'slash') {
            push({ type: 'text', value, output: DOT_LITERAL });
            continue;
          }

          push({ type: 'dot', value, output: DOT_LITERAL });
          continue;
        }

        /**
         * Question marks
         */

        if (value === '?') {
          const isGroup = prev && prev.value === '(';
          if (!isGroup && opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
            extglobOpen('qmark', value);
            continue;
          }

          if (prev && prev.type === 'paren') {
            const next = peek();
            let output = value;

            if (next === '<' && !utils$1.supportsLookbehinds()) {
              throw new Error('Node.js v10 or higher is required for regex lookbehinds');
            }

            if ((prev.value === '(' && !/[!=<:]/.test(next)) || (next === '<' && !/<([!=]|\w+>)/.test(remaining()))) {
              output = `\\${value}`;
            }

            push({ type: 'text', value, output });
            continue;
          }

          if (opts.dot !== true && (prev.type === 'slash' || prev.type === 'bos')) {
            push({ type: 'qmark', value, output: QMARK_NO_DOT });
            continue;
          }

          push({ type: 'qmark', value, output: QMARK });
          continue;
        }

        /**
         * Exclamation
         */

        if (value === '!') {
          if (opts.noextglob !== true && peek() === '(') {
            if (peek(2) !== '?' || !/[!=<:]/.test(peek(3))) {
              extglobOpen('negate', value);
              continue;
            }
          }

          if (opts.nonegate !== true && state.index === 0) {
            negate();
            continue;
          }
        }

        /**
         * Plus
         */

        if (value === '+') {
          if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
            extglobOpen('plus', value);
            continue;
          }

          if ((prev && prev.value === '(') || opts.regex === false) {
            push({ type: 'plus', value, output: PLUS_LITERAL });
            continue;
          }

          if ((prev && (prev.type === 'bracket' || prev.type === 'paren' || prev.type === 'brace')) || state.parens > 0) {
            push({ type: 'plus', value });
            continue;
          }

          push({ type: 'plus', value: PLUS_LITERAL });
          continue;
        }

        /**
         * Plain text
         */

        if (value === '@') {
          if (opts.noextglob !== true && peek() === '(' && peek(2) !== '?') {
            push({ type: 'at', extglob: true, value, output: '' });
            continue;
          }

          push({ type: 'text', value });
          continue;
        }

        /**
         * Plain text
         */

        if (value !== '*') {
          if (value === '$' || value === '^') {
            value = `\\${value}`;
          }

          const match = REGEX_NON_SPECIAL_CHARS.exec(remaining());
          if (match) {
            value += match[0];
            state.index += match[0].length;
          }

          push({ type: 'text', value });
          continue;
        }

        /**
         * Stars
         */

        if (prev && (prev.type === 'globstar' || prev.star === true)) {
          prev.type = 'star';
          prev.star = true;
          prev.value += value;
          prev.output = star;
          state.backtrack = true;
          state.globstar = true;
          consume(value);
          continue;
        }

        let rest = remaining();
        if (opts.noextglob !== true && /^\([^?]/.test(rest)) {
          extglobOpen('star', value);
          continue;
        }

        if (prev.type === 'star') {
          if (opts.noglobstar === true) {
            consume(value);
            continue;
          }

          const prior = prev.prev;
          const before = prior.prev;
          const isStart = prior.type === 'slash' || prior.type === 'bos';
          const afterStar = before && (before.type === 'star' || before.type === 'globstar');

          if (opts.bash === true && (!isStart || (rest[0] && rest[0] !== '/'))) {
            push({ type: 'star', value, output: '' });
            continue;
          }

          const isBrace = state.braces > 0 && (prior.type === 'comma' || prior.type === 'brace');
          const isExtglob = extglobs.length && (prior.type === 'pipe' || prior.type === 'paren');
          if (!isStart && prior.type !== 'paren' && !isBrace && !isExtglob) {
            push({ type: 'star', value, output: '' });
            continue;
          }

          // strip consecutive `/**/`
          while (rest.slice(0, 3) === '/**') {
            const after = input[state.index + 4];
            if (after && after !== '/') {
              break;
            }
            rest = rest.slice(3);
            consume('/**', 3);
          }

          if (prior.type === 'bos' && eos()) {
            prev.type = 'globstar';
            prev.value += value;
            prev.output = globstar(opts);
            state.output = prev.output;
            state.globstar = true;
            consume(value);
            continue;
          }

          if (prior.type === 'slash' && prior.prev.type !== 'bos' && !afterStar && eos()) {
            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;

            prev.type = 'globstar';
            prev.output = globstar(opts) + (opts.strictSlashes ? ')' : '|$)');
            prev.value += value;
            state.globstar = true;
            state.output += prior.output + prev.output;
            consume(value);
            continue;
          }

          if (prior.type === 'slash' && prior.prev.type !== 'bos' && rest[0] === '/') {
            const end = rest[1] !== void 0 ? '|$' : '';

            state.output = state.output.slice(0, -(prior.output + prev.output).length);
            prior.output = `(?:${prior.output}`;

            prev.type = 'globstar';
            prev.output = `${globstar(opts)}${SLASH_LITERAL}|${SLASH_LITERAL}${end})`;
            prev.value += value;

            state.output += prior.output + prev.output;
            state.globstar = true;

            consume(value + advance());

            push({ type: 'slash', value: '/', output: '' });
            continue;
          }

          if (prior.type === 'bos' && rest[0] === '/') {
            prev.type = 'globstar';
            prev.value += value;
            prev.output = `(?:^|${SLASH_LITERAL}|${globstar(opts)}${SLASH_LITERAL})`;
            state.output = prev.output;
            state.globstar = true;
            consume(value + advance());
            push({ type: 'slash', value: '/', output: '' });
            continue;
          }

          // remove single star from output
          state.output = state.output.slice(0, -prev.output.length);

          // reset previous token to globstar
          prev.type = 'globstar';
          prev.output = globstar(opts);
          prev.value += value;

          // reset output with globstar
          state.output += prev.output;
          state.globstar = true;
          consume(value);
          continue;
        }

        const token = { type: 'star', value, output: star };

        if (opts.bash === true) {
          token.output = '.*?';
          if (prev.type === 'bos' || prev.type === 'slash') {
            token.output = nodot + token.output;
          }
          push(token);
          continue;
        }

        if (prev && (prev.type === 'bracket' || prev.type === 'paren') && opts.regex === true) {
          token.output = value;
          push(token);
          continue;
        }

        if (state.index === state.start || prev.type === 'slash' || prev.type === 'dot') {
          if (prev.type === 'dot') {
            state.output += NO_DOT_SLASH;
            prev.output += NO_DOT_SLASH;

          } else if (opts.dot === true) {
            state.output += NO_DOTS_SLASH;
            prev.output += NO_DOTS_SLASH;

          } else {
            state.output += nodot;
            prev.output += nodot;
          }

          if (peek() !== '*') {
            state.output += ONE_CHAR;
            prev.output += ONE_CHAR;
          }
        }

        push(token);
      }

      while (state.brackets > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ']'));
        state.output = utils$1.escapeLast(state.output, '[');
        decrement('brackets');
      }

      while (state.parens > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', ')'));
        state.output = utils$1.escapeLast(state.output, '(');
        decrement('parens');
      }

      while (state.braces > 0) {
        if (opts.strictBrackets === true) throw new SyntaxError(syntaxError('closing', '}'));
        state.output = utils$1.escapeLast(state.output, '{');
        decrement('braces');
      }

      if (opts.strictSlashes !== true && (prev.type === 'star' || prev.type === 'bracket')) {
        push({ type: 'maybe_slash', value: '', output: `${SLASH_LITERAL}?` });
      }

      // rebuild the output if we had to backtrack at any point
      if (state.backtrack === true) {
        state.output = '';

        for (const token of state.tokens) {
          state.output += token.output != null ? token.output : token.value;

          if (token.suffix) {
            state.output += token.suffix;
          }
        }
      }

      return state;
    };

    /**
     * Fast paths for creating regular expressions for common glob patterns.
     * This can significantly speed up processing and has very little downside
     * impact when none of the fast paths match.
     */

    parse$2.fastpaths = (input, options) => {
      const opts = { ...options };
      const max = typeof opts.maxLength === 'number' ? Math.min(MAX_LENGTH, opts.maxLength) : MAX_LENGTH;
      const len = input.length;
      if (len > max) {
        throw new SyntaxError(`Input length: ${len}, exceeds maximum allowed length: ${max}`);
      }

      input = REPLACEMENTS[input] || input;
      const win32 = utils$1.isWindows(options);

      // create constants based on platform, for windows or posix
      const {
        DOT_LITERAL,
        SLASH_LITERAL,
        ONE_CHAR,
        DOTS_SLASH,
        NO_DOT,
        NO_DOTS,
        NO_DOTS_SLASH,
        STAR,
        START_ANCHOR
      } = constants$1.globChars(win32);

      const nodot = opts.dot ? NO_DOTS : NO_DOT;
      const slashDot = opts.dot ? NO_DOTS_SLASH : NO_DOT;
      const capture = opts.capture ? '' : '?:';
      const state = { negated: false, prefix: '' };
      let star = opts.bash === true ? '.*?' : STAR;

      if (opts.capture) {
        star = `(${star})`;
      }

      const globstar = (opts) => {
        if (opts.noglobstar === true) return star;
        return `(${capture}(?:(?!${START_ANCHOR}${opts.dot ? DOTS_SLASH : DOT_LITERAL}).)*?)`;
      };

      const create = str => {
        switch (str) {
          case '*':
            return `${nodot}${ONE_CHAR}${star}`;

          case '.*':
            return `${DOT_LITERAL}${ONE_CHAR}${star}`;

          case '*.*':
            return `${nodot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

          case '*/*':
            return `${nodot}${star}${SLASH_LITERAL}${ONE_CHAR}${slashDot}${star}`;

          case '**':
            return nodot + globstar(opts);

          case '**/*':
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${ONE_CHAR}${star}`;

          case '**/*.*':
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${slashDot}${star}${DOT_LITERAL}${ONE_CHAR}${star}`;

          case '**/.*':
            return `(?:${nodot}${globstar(opts)}${SLASH_LITERAL})?${DOT_LITERAL}${ONE_CHAR}${star}`;

          default: {
            const match = /^(.*?)\.(\w+)$/.exec(str);
            if (!match) return;

            const source = create(match[1]);
            if (!source) return;

            return source + DOT_LITERAL + match[2];
          }
        }
      };

      const output = utils$1.removePrefix(input, state);
      let source = create(output);

      if (source && opts.strictSlashes !== true) {
        source += `${SLASH_LITERAL}?`;
      }

      return source;
    };

    var parse_1 = parse$2;

    const path$5 = require$$0__default['default'];
    const scan = scan_1;
    const parse$1 = parse_1;
    const utils = utils$3;
    const constants = constants$2;
    const isObject$1 = val => val && typeof val === 'object' && !Array.isArray(val);

    /**
     * Creates a matcher function from one or more glob patterns. The
     * returned function takes a string to match as its first argument,
     * and returns true if the string is a match. The returned matcher
     * function also takes a boolean as the second argument that, when true,
     * returns an object with additional information.
     *
     * ```js
     * const picomatch = require('picomatch');
     * // picomatch(glob[, options]);
     *
     * const isMatch = picomatch('*.!(*a)');
     * console.log(isMatch('a.a')); //=> false
     * console.log(isMatch('a.b')); //=> true
     * ```
     * @name picomatch
     * @param {String|Array} `globs` One or more glob patterns.
     * @param {Object=} `options`
     * @return {Function=} Returns a matcher function.
     * @api public
     */

    const picomatch$1 = (glob, options, returnState = false) => {
      if (Array.isArray(glob)) {
        const fns = glob.map(input => picomatch$1(input, options, returnState));
        const arrayMatcher = str => {
          for (const isMatch of fns) {
            const state = isMatch(str);
            if (state) return state;
          }
          return false;
        };
        return arrayMatcher;
      }

      const isState = isObject$1(glob) && glob.tokens && glob.input;

      if (glob === '' || (typeof glob !== 'string' && !isState)) {
        throw new TypeError('Expected pattern to be a non-empty string');
      }

      const opts = options || {};
      const posix = utils.isWindows(options);
      const regex = isState
        ? picomatch$1.compileRe(glob, options)
        : picomatch$1.makeRe(glob, options, false, true);

      const state = regex.state;
      delete regex.state;

      let isIgnored = () => false;
      if (opts.ignore) {
        const ignoreOpts = { ...options, ignore: null, onMatch: null, onResult: null };
        isIgnored = picomatch$1(opts.ignore, ignoreOpts, returnState);
      }

      const matcher = (input, returnObject = false) => {
        const { isMatch, match, output } = picomatch$1.test(input, regex, options, { glob, posix });
        const result = { glob, state, regex, posix, input, output, match, isMatch };

        if (typeof opts.onResult === 'function') {
          opts.onResult(result);
        }

        if (isMatch === false) {
          result.isMatch = false;
          return returnObject ? result : false;
        }

        if (isIgnored(input)) {
          if (typeof opts.onIgnore === 'function') {
            opts.onIgnore(result);
          }
          result.isMatch = false;
          return returnObject ? result : false;
        }

        if (typeof opts.onMatch === 'function') {
          opts.onMatch(result);
        }
        return returnObject ? result : true;
      };

      if (returnState) {
        matcher.state = state;
      }

      return matcher;
    };

    /**
     * Test `input` with the given `regex`. This is used by the main
     * `picomatch()` function to test the input string.
     *
     * ```js
     * const picomatch = require('picomatch');
     * // picomatch.test(input, regex[, options]);
     *
     * console.log(picomatch.test('foo/bar', /^(?:([^/]*?)\/([^/]*?))$/));
     * // { isMatch: true, match: [ 'foo/', 'foo', 'bar' ], output: 'foo/bar' }
     * ```
     * @param {String} `input` String to test.
     * @param {RegExp} `regex`
     * @return {Object} Returns an object with matching info.
     * @api public
     */

    picomatch$1.test = (input, regex, options, { glob, posix } = {}) => {
      if (typeof input !== 'string') {
        throw new TypeError('Expected input to be a string');
      }

      if (input === '') {
        return { isMatch: false, output: '' };
      }

      const opts = options || {};
      const format = opts.format || (posix ? utils.toPosixSlashes : null);
      let match = input === glob;
      let output = (match && format) ? format(input) : input;

      if (match === false) {
        output = format ? format(input) : input;
        match = output === glob;
      }

      if (match === false || opts.capture === true) {
        if (opts.matchBase === true || opts.basename === true) {
          match = picomatch$1.matchBase(input, regex, options, posix);
        } else {
          match = regex.exec(output);
        }
      }

      return { isMatch: Boolean(match), match, output };
    };

    /**
     * Match the basename of a filepath.
     *
     * ```js
     * const picomatch = require('picomatch');
     * // picomatch.matchBase(input, glob[, options]);
     * console.log(picomatch.matchBase('foo/bar.js', '*.js'); // true
     * ```
     * @param {String} `input` String to test.
     * @param {RegExp|String} `glob` Glob pattern or regex created by [.makeRe](#makeRe).
     * @return {Boolean}
     * @api public
     */

    picomatch$1.matchBase = (input, glob, options, posix = utils.isWindows(options)) => {
      const regex = glob instanceof RegExp ? glob : picomatch$1.makeRe(glob, options);
      return regex.test(path$5.basename(input));
    };

    /**
     * Returns true if **any** of the given glob `patterns` match the specified `string`.
     *
     * ```js
     * const picomatch = require('picomatch');
     * // picomatch.isMatch(string, patterns[, options]);
     *
     * console.log(picomatch.isMatch('a.a', ['b.*', '*.a'])); //=> true
     * console.log(picomatch.isMatch('a.a', 'b.*')); //=> false
     * ```
     * @param {String|Array} str The string to test.
     * @param {String|Array} patterns One or more glob patterns to use for matching.
     * @param {Object} [options] See available [options](#options).
     * @return {Boolean} Returns true if any patterns match `str`
     * @api public
     */

    picomatch$1.isMatch = (str, patterns, options) => picomatch$1(patterns, options)(str);

    /**
     * Parse a glob pattern to create the source string for a regular
     * expression.
     *
     * ```js
     * const picomatch = require('picomatch');
     * const result = picomatch.parse(pattern[, options]);
     * ```
     * @param {String} `pattern`
     * @param {Object} `options`
     * @return {Object} Returns an object with useful properties and output to be used as a regex source string.
     * @api public
     */

    picomatch$1.parse = (pattern, options) => {
      if (Array.isArray(pattern)) return pattern.map(p => picomatch$1.parse(p, options));
      return parse$1(pattern, { ...options, fastpaths: false });
    };

    /**
     * Scan a glob pattern to separate the pattern into segments.
     *
     * ```js
     * const picomatch = require('picomatch');
     * // picomatch.scan(input[, options]);
     *
     * const result = picomatch.scan('!./foo/*.js');
     * console.log(result);
     * { prefix: '!./',
     *   input: '!./foo/*.js',
     *   start: 3,
     *   base: 'foo',
     *   glob: '*.js',
     *   isBrace: false,
     *   isBracket: false,
     *   isGlob: true,
     *   isExtglob: false,
     *   isGlobstar: false,
     *   negated: true }
     * ```
     * @param {String} `input` Glob pattern to scan.
     * @param {Object} `options`
     * @return {Object} Returns an object with
     * @api public
     */

    picomatch$1.scan = (input, options) => scan(input, options);

    /**
     * Create a regular expression from a parsed glob pattern.
     *
     * ```js
     * const picomatch = require('picomatch');
     * const state = picomatch.parse('*.js');
     * // picomatch.compileRe(state[, options]);
     *
     * console.log(picomatch.compileRe(state));
     * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
     * ```
     * @param {String} `state` The object returned from the `.parse` method.
     * @param {Object} `options`
     * @return {RegExp} Returns a regex created from the given pattern.
     * @api public
     */

    picomatch$1.compileRe = (parsed, options, returnOutput = false, returnState = false) => {
      if (returnOutput === true) {
        return parsed.output;
      }

      const opts = options || {};
      const prepend = opts.contains ? '' : '^';
      const append = opts.contains ? '' : '$';

      let source = `${prepend}(?:${parsed.output})${append}`;
      if (parsed && parsed.negated === true) {
        source = `^(?!${source}).*$`;
      }

      const regex = picomatch$1.toRegex(source, options);
      if (returnState === true) {
        regex.state = parsed;
      }

      return regex;
    };

    picomatch$1.makeRe = (input, options, returnOutput = false, returnState = false) => {
      if (!input || typeof input !== 'string') {
        throw new TypeError('Expected a non-empty string');
      }

      const opts = options || {};
      let parsed = { negated: false, fastpaths: true };
      let prefix = '';
      let output;

      if (input.startsWith('./')) {
        input = input.slice(2);
        prefix = parsed.prefix = './';
      }

      if (opts.fastpaths !== false && (input[0] === '.' || input[0] === '*')) {
        output = parse$1.fastpaths(input, options);
      }

      if (output === undefined) {
        parsed = parse$1(input, options);
        parsed.prefix = prefix + (parsed.prefix || '');
      } else {
        parsed.output = output;
      }

      return picomatch$1.compileRe(parsed, options, returnOutput, returnState);
    };

    /**
     * Create a regular expression from the given regex source string.
     *
     * ```js
     * const picomatch = require('picomatch');
     * // picomatch.toRegex(source[, options]);
     *
     * const { output } = picomatch.parse('*.js');
     * console.log(picomatch.toRegex(output));
     * //=> /^(?:(?!\.)(?=.)[^/]*?\.js)$/
     * ```
     * @param {String} `source` Regular expression source string.
     * @param {Object} `options`
     * @return {RegExp}
     * @api public
     */

    picomatch$1.toRegex = (source, options) => {
      try {
        const opts = options || {};
        return new RegExp(source, opts.flags || (opts.nocase ? 'i' : ''));
      } catch (err) {
        if (options && options.debug === true) throw err;
        return /$^/;
      }
    };

    /**
     * Picomatch constants.
     * @return {Object}
     */

    picomatch$1.constants = constants;

    /**
     * Expose "picomatch"
     */

    var picomatch_1 = picomatch$1;

    var picomatch = picomatch_1;

    function walk$1(ast, { enter, leave }) {
    	return visit(ast, null, enter, leave);
    }

    let should_skip = false;
    let should_remove = false;
    let replacement = null;
    const context = {
    	skip: () => should_skip = true,
    	remove: () => should_remove = true,
    	replace: (node) => replacement = node
    };

    function replace(parent, prop, index, node) {
    	if (parent) {
    		if (index !== null) {
    			parent[prop][index] = node;
    		} else {
    			parent[prop] = node;
    		}
    	}
    }

    function remove(parent, prop, index) {
    	if (parent) {
    		if (index !== null) {
    			parent[prop].splice(index, 1);
    		} else {
    			delete parent[prop];
    		}
    	}
    }

    function visit(
    	node,
    	parent,
    	enter,
    	leave,
    	prop,
    	index
    ) {
    	if (node) {
    		if (enter) {
    			const _should_skip = should_skip;
    			const _should_remove = should_remove;
    			const _replacement = replacement;
    			should_skip = false;
    			should_remove = false;
    			replacement = null;

    			enter.call(context, node, parent, prop, index);

    			if (replacement) {
    				node = replacement;
    				replace(parent, prop, index, node);
    			}

    			if (should_remove) {
    				remove(parent, prop, index);
    			}

    			const skipped = should_skip;
    			const removed = should_remove;

    			should_skip = _should_skip;
    			should_remove = _should_remove;
    			replacement = _replacement;

    			if (skipped) return node;
    			if (removed) return null;
    		}

    		for (const key in node) {
    			const value = (node )[key];

    			if (typeof value !== 'object') {
    				continue;
    			}

    			else if (Array.isArray(value)) {
    				for (let j = 0, k = 0; j < value.length; j += 1, k += 1) {
    					if (value[j] !== null && typeof value[j].type === 'string') {
    						if (!visit(value[j], node, enter, leave, key, k)) {
    							// removed
    							j--;
    						}
    					}
    				}
    			}

    			else if (value !== null && typeof value.type === 'string') {
    				visit(value, node, enter, leave, key, null);
    			}
    		}

    		if (leave) {
    			const _replacement = replacement;
    			const _should_remove = should_remove;
    			replacement = null;
    			should_remove = false;

    			leave.call(context, node, parent, prop, index);

    			if (replacement) {
    				node = replacement;
    				replace(parent, prop, index, node);
    			}

    			if (should_remove) {
    				remove(parent, prop, index);
    			}

    			const removed = should_remove;

    			replacement = _replacement;
    			should_remove = _should_remove;

    			if (removed) return null;
    		}
    	}

    	return node;
    }

    const extractors = {
        ArrayPattern(names, param) {
            for (const element of param.elements) {
                if (element)
                    extractors[element.type](names, element);
            }
        },
        AssignmentPattern(names, param) {
            extractors[param.left.type](names, param.left);
        },
        Identifier(names, param) {
            names.push(param.name);
        },
        MemberExpression() { },
        ObjectPattern(names, param) {
            for (const prop of param.properties) {
                // @ts-ignore Typescript reports that this is not a valid type
                if (prop.type === 'RestElement') {
                    extractors.RestElement(names, prop);
                }
                else {
                    extractors[prop.value.type](names, prop.value);
                }
            }
        },
        RestElement(names, param) {
            extractors[param.argument.type](names, param.argument);
        }
    };
    const extractAssignedNames = function extractAssignedNames(param) {
        const names = [];
        extractors[param.type](names, param);
        return names;
    };

    const blockDeclarations = {
        const: true,
        let: true
    };
    class Scope {
        constructor(options = {}) {
            this.parent = options.parent;
            this.isBlockScope = !!options.block;
            this.declarations = Object.create(null);
            if (options.params) {
                options.params.forEach((param) => {
                    extractAssignedNames(param).forEach((name) => {
                        this.declarations[name] = true;
                    });
                });
            }
        }
        addDeclaration(node, isBlockDeclaration, isVar) {
            if (!isBlockDeclaration && this.isBlockScope) {
                // it's a `var` or function node, and this
                // is a block scope, so we need to go up
                this.parent.addDeclaration(node, isBlockDeclaration, isVar);
            }
            else if (node.id) {
                extractAssignedNames(node.id).forEach((name) => {
                    this.declarations[name] = true;
                });
            }
        }
        contains(name) {
            return this.declarations[name] || (this.parent ? this.parent.contains(name) : false);
        }
    }
    const attachScopes = function attachScopes(ast, propertyName = 'scope') {
        let scope = new Scope();
        walk$1(ast, {
            enter(n, parent) {
                const node = n;
                // function foo () {...}
                // class Foo {...}
                if (/(Function|Class)Declaration/.test(node.type)) {
                    scope.addDeclaration(node, false, false);
                }
                // var foo = 1
                if (node.type === 'VariableDeclaration') {
                    const { kind } = node;
                    const isBlockDeclaration = blockDeclarations[kind];
                    // don't add const/let declarations in the body of a for loop #113
                    const parentType = parent ? parent.type : '';
                    if (!(isBlockDeclaration && /ForOfStatement/.test(parentType))) {
                        node.declarations.forEach((declaration) => {
                            scope.addDeclaration(declaration, isBlockDeclaration, true);
                        });
                    }
                }
                let newScope;
                // create new function scope
                if (/Function/.test(node.type)) {
                    const func = node;
                    newScope = new Scope({
                        parent: scope,
                        block: false,
                        params: func.params
                    });
                    // named function expressions - the name is considered
                    // part of the function's scope
                    if (func.type === 'FunctionExpression' && func.id) {
                        newScope.addDeclaration(func, false, false);
                    }
                }
                // create new block scope
                if (node.type === 'BlockStatement' && !/Function/.test(parent.type)) {
                    newScope = new Scope({
                        parent: scope,
                        block: true
                    });
                }
                // catch clause has its own block scope
                if (node.type === 'CatchClause') {
                    newScope = new Scope({
                        parent: scope,
                        params: node.param ? [node.param] : [],
                        block: true
                    });
                }
                if (newScope) {
                    Object.defineProperty(node, propertyName, {
                        value: newScope,
                        configurable: true
                    });
                    scope = newScope;
                }
            },
            leave(n) {
                const node = n;
                if (node[propertyName])
                    scope = scope.parent;
            }
        });
        return scope;
    };

    // Helper since Typescript can't detect readonly arrays with Array.isArray
    function isArray$1(arg) {
        return Array.isArray(arg);
    }
    function ensureArray(thing) {
        if (isArray$1(thing))
            return thing;
        if (thing == null)
            return [];
        return [thing];
    }

    function getMatcherString(id, resolutionBase) {
        if (resolutionBase === false) {
            return id;
        }
        // resolve('') is valid and will default to process.cwd()
        const basePath = require$$0$1.resolve(resolutionBase || '')
            .split(require$$0$1.sep)
            .join('/')
            // escape all possible (posix + win) path characters that might interfere with regex
            .replace(/[-^$*+?.()|[\]{}]/g, '\\$&');
        // Note that we use posix.join because:
        // 1. the basePath has been normalized to use /
        // 2. the incoming glob (id) matcher, also uses /
        // otherwise Node will force backslash (\) on windows
        return require$$0$1.posix.join(basePath, id);
    }
    const createFilter = function createFilter(include, exclude, options) {
        const resolutionBase = options && options.resolve;
        const getMatcher = (id) => id instanceof RegExp
            ? id
            : {
                test: (what) => {
                    // this refactor is a tad overly verbose but makes for easy debugging
                    const pattern = getMatcherString(id, resolutionBase);
                    const fn = picomatch(pattern, { dot: true });
                    const result = fn(what);
                    return result;
                }
            };
        const includeMatchers = ensureArray(include).map(getMatcher);
        const excludeMatchers = ensureArray(exclude).map(getMatcher);
        return function result(id) {
            if (typeof id !== 'string')
                return false;
            if (/\0/.test(id))
                return false;
            const pathId = id.split(require$$0$1.sep).join('/');
            for (let i = 0; i < excludeMatchers.length; ++i) {
                const matcher = excludeMatchers[i];
                if (matcher.test(pathId))
                    return false;
            }
            for (let i = 0; i < includeMatchers.length; ++i) {
                const matcher = includeMatchers[i];
                if (matcher.test(pathId))
                    return true;
            }
            return !includeMatchers.length;
        };
    };

    const reservedWords = 'break case class catch const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield enum await implements package protected static interface private public';
    const builtins$1 = 'arguments Infinity NaN undefined null true false eval uneval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Symbol Error EvalError InternalError RangeError ReferenceError SyntaxError TypeError URIError Number Math Date String RegExp Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array Map Set WeakMap WeakSet SIMD ArrayBuffer DataView JSON Promise Generator GeneratorFunction Reflect Proxy Intl';
    const forbiddenIdentifiers = new Set(`${reservedWords} ${builtins$1}`.split(' '));
    forbiddenIdentifiers.add('');
    const makeLegalIdentifier = function makeLegalIdentifier(str) {
        let identifier = str
            .replace(/-(\w)/g, (_, letter) => letter.toUpperCase())
            .replace(/[^$_a-zA-Z0-9]/g, '_');
        if (/\d/.test(identifier[0]) || forbiddenIdentifiers.has(identifier)) {
            identifier = `_${identifier}`;
        }
        return identifier || '_';
    };

    const access = util$3.promisify(fs__default['default'].access);
    const readFile$1 = util$3.promisify(fs__default['default'].readFile);
    const realpath$1 = util$3.promisify(fs__default['default'].realpath);
    const stat = util$3.promisify(fs__default['default'].stat);
    async function exists(filePath) {
      try {
        await access(filePath);
        return true;
      } catch {
        return false;
      }
    }

    const onError = (error) => {
      if (error.code === 'ENOENT') {
        return false;
      }
      throw error;
    };

    const makeCache = (fn) => {
      const cache = new Map();
      const wrapped = async (param, done) => {
        if (cache.has(param) === false) {
          cache.set(
            param,
            fn(param).catch((err) => {
              cache.delete(param);
              throw err;
            })
          );
        }

        try {
          const result = cache.get(param);
          const value = await result;
          return done(null, value);
        } catch (error) {
          return done(error);
        }
      };

      wrapped.clear = () => cache.clear();

      return wrapped;
    };

    const isDirCached = makeCache(async (file) => {
      try {
        const stats = await stat(file);
        return stats.isDirectory();
      } catch (error) {
        return onError(error);
      }
    });

    const isFileCached = makeCache(async (file) => {
      try {
        const stats = await stat(file);
        return stats.isFile();
      } catch (error) {
        return onError(error);
      }
    });

    const readCachedFile = makeCache(readFile$1);

    // returns the imported package name for bare module imports
    function getPackageName(id) {
      if (id.startsWith('.') || id.startsWith('/')) {
        return null;
      }

      const split = id.split('/');

      // @my-scope/my-package/foo.js -> @my-scope/my-package
      // @my-scope/my-package -> @my-scope/my-package
      if (split[0][0] === '@') {
        return `${split[0]}/${split[1]}`;
      }

      // my-package/foo.js -> my-package
      // my-package -> my-package
      return split[0];
    }

    function getMainFields(options) {
      let mainFields;
      if (options.mainFields) {
        ({ mainFields } = options);
      } else {
        mainFields = ['module', 'main'];
      }
      if (options.browser && mainFields.indexOf('browser') === -1) {
        return ['browser'].concat(mainFields);
      }
      if (!mainFields.length) {
        throw new Error('Please ensure at least one `mainFields` value is specified');
      }
      return mainFields;
    }

    function getPackageInfo(options) {
      const {
        cache,
        extensions,
        pkg,
        mainFields,
        preserveSymlinks,
        useBrowserOverrides,
        rootDir,
        ignoreSideEffectsForRoot
      } = options;
      let { pkgPath } = options;

      if (cache.has(pkgPath)) {
        return cache.get(pkgPath);
      }

      // browserify/resolve doesn't realpath paths returned in its packageFilter callback
      if (!preserveSymlinks) {
        pkgPath = fs$8.realpathSync(pkgPath);
      }

      const pkgRoot = require$$0$1.dirname(pkgPath);

      const packageInfo = {
        // copy as we are about to munge the `main` field of `pkg`.
        packageJson: { ...pkg },

        // path to package.json file
        packageJsonPath: pkgPath,

        // directory containing the package.json
        root: pkgRoot,

        // which main field was used during resolution of this module (main, module, or browser)
        resolvedMainField: 'main',

        // whether the browser map was used to resolve the entry point to this module
        browserMappedMain: false,

        // the entry point of the module with respect to the selected main field and any
        // relevant browser mappings.
        resolvedEntryPoint: ''
      };

      let overriddenMain = false;
      for (let i = 0; i < mainFields.length; i++) {
        const field = mainFields[i];
        if (typeof pkg[field] === 'string') {
          pkg.main = pkg[field];
          packageInfo.resolvedMainField = field;
          overriddenMain = true;
          break;
        }
      }

      const internalPackageInfo = {
        cachedPkg: pkg,
        hasModuleSideEffects: () => null,
        hasPackageEntry: overriddenMain !== false || mainFields.indexOf('main') !== -1,
        packageBrowserField:
          useBrowserOverrides &&
          typeof pkg.browser === 'object' &&
          Object.keys(pkg.browser).reduce((browser, key) => {
            let resolved = pkg.browser[key];
            if (resolved && resolved[0] === '.') {
              resolved = require$$0$1.resolve(pkgRoot, resolved);
            }
            /* eslint-disable no-param-reassign */
            browser[key] = resolved;
            if (key[0] === '.') {
              const absoluteKey = require$$0$1.resolve(pkgRoot, key);
              browser[absoluteKey] = resolved;
              if (!require$$0$1.extname(key)) {
                extensions.reduce((subBrowser, ext) => {
                  subBrowser[absoluteKey + ext] = subBrowser[key];
                  return subBrowser;
                }, browser);
              }
            }
            return browser;
          }, {}),
        packageInfo
      };

      const browserMap = internalPackageInfo.packageBrowserField;
      if (
        useBrowserOverrides &&
        typeof pkg.browser === 'object' &&
        // eslint-disable-next-line no-prototype-builtins
        browserMap.hasOwnProperty(pkg.main)
      ) {
        packageInfo.resolvedEntryPoint = browserMap[pkg.main];
        packageInfo.browserMappedMain = true;
      } else {
        // index.node is technically a valid default entrypoint as well...
        packageInfo.resolvedEntryPoint = require$$0$1.resolve(pkgRoot, pkg.main || 'index.js');
        packageInfo.browserMappedMain = false;
      }

      if (!ignoreSideEffectsForRoot || rootDir !== pkgRoot) {
        const packageSideEffects = pkg.sideEffects;
        if (typeof packageSideEffects === 'boolean') {
          internalPackageInfo.hasModuleSideEffects = () => packageSideEffects;
        } else if (Array.isArray(packageSideEffects)) {
          internalPackageInfo.hasModuleSideEffects = createFilter(packageSideEffects, null, {
            resolve: pkgRoot
          });
        }
      }

      cache.set(pkgPath, internalPackageInfo);
      return internalPackageInfo;
    }

    function normalizeInput(input) {
      if (Array.isArray(input)) {
        return input;
      } else if (typeof input === 'object') {
        return Object.values(input);
      }

      // otherwise it's a string
      return [input];
    }

    /* eslint-disable no-await-in-loop */

    const fileExists = util$3.promisify(fs__default['default'].exists);

    function isModuleDir(current, moduleDirs) {
      return moduleDirs.some((dir) => current.endsWith(dir));
    }

    async function findPackageJson(base, moduleDirs) {
      const { root } = require$$0__default['default'].parse(base);
      let current = base;

      while (current !== root && !isModuleDir(current, moduleDirs)) {
        const pkgJsonPath = require$$0__default['default'].join(current, 'package.json');
        if (await fileExists(pkgJsonPath)) {
          const pkgJsonString = fs__default['default'].readFileSync(pkgJsonPath, 'utf-8');
          return { pkgJson: JSON.parse(pkgJsonString), pkgPath: current, pkgJsonPath };
        }
        current = require$$0__default['default'].resolve(current, '..');
      }
      return null;
    }

    function isUrl(str) {
      try {
        return !!new URL(str);
      } catch (_) {
        return false;
      }
    }

    function isConditions(exports) {
      return typeof exports === 'object' && Object.keys(exports).every((k) => !k.startsWith('.'));
    }

    function isMappings(exports) {
      return typeof exports === 'object' && !isConditions(exports);
    }

    function isMixedExports(exports) {
      const keys = Object.keys(exports);
      return keys.some((k) => k.startsWith('.')) && keys.some((k) => !k.startsWith('.'));
    }

    function createBaseErrorMsg(importSpecifier, importer) {
      return `Could not resolve import "${importSpecifier}" in ${importer}`;
    }

    function createErrorMsg(context, reason, internal) {
      const { importSpecifier, importer, pkgJsonPath } = context;
      const base = createBaseErrorMsg(importSpecifier, importer);
      const field = internal ? 'imports' : 'exports';
      return `${base} using ${field} defined in ${pkgJsonPath}.${reason ? ` ${reason}` : ''}`;
    }

    class ResolveError extends Error {}

    class InvalidConfigurationError extends ResolveError {
      constructor(context, reason) {
        super(createErrorMsg(context, `Invalid "exports" field. ${reason}`));
      }
    }

    class InvalidModuleSpecifierError extends ResolveError {
      constructor(context, internal) {
        super(createErrorMsg(context, internal));
      }
    }

    class InvalidPackageTargetError extends ResolveError {
      constructor(context, reason) {
        super(createErrorMsg(context, reason));
      }
    }

    /* eslint-disable no-await-in-loop, no-undefined */

    function includesInvalidSegments(pathSegments, moduleDirs) {
      return pathSegments
        .split('/')
        .slice(1)
        .some((t) => ['.', '..', ...moduleDirs].includes(t));
    }

    async function resolvePackageTarget(context, { target, subpath, pattern, internal }) {
      if (typeof target === 'string') {
        if (!pattern && subpath.length > 0 && !target.endsWith('/')) {
          throw new InvalidModuleSpecifierError(context);
        }

        if (!target.startsWith('./')) {
          if (internal && !['/', '../'].some((p) => target.startsWith(p)) && !isUrl(target)) {
            // this is a bare package import, remap it and resolve it using regular node resolve
            if (pattern) {
              const result = await context.resolveId(
                target.replace(/\*/g, subpath),
                context.pkgURL.href
              );
              return result ? url$2.pathToFileURL(result.location).href : null;
            }

            const result = await context.resolveId(`${target}${subpath}`, context.pkgURL.href);
            return result ? url$2.pathToFileURL(result.location).href : null;
          }
          throw new InvalidPackageTargetError(context, `Invalid mapping: "${target}".`);
        }

        if (includesInvalidSegments(target, context.moduleDirs)) {
          throw new InvalidPackageTargetError(context, `Invalid mapping: "${target}".`);
        }

        const resolvedTarget = new URL(target, context.pkgURL);
        if (!resolvedTarget.href.startsWith(context.pkgURL.href)) {
          throw new InvalidPackageTargetError(
            context,
            `Resolved to ${resolvedTarget.href} which is outside package ${context.pkgURL.href}`
          );
        }

        if (includesInvalidSegments(subpath, context.moduleDirs)) {
          throw new InvalidModuleSpecifierError(context);
        }

        if (pattern) {
          return resolvedTarget.href.replace(/\*/g, subpath);
        }
        return new URL(subpath, resolvedTarget).href;
      }

      if (Array.isArray(target)) {
        let lastError;
        for (const item of target) {
          try {
            const resolved = await resolvePackageTarget(context, {
              target: item,
              subpath,
              pattern,
              internal
            });

            // return if defined or null, but not undefined
            if (resolved !== undefined) {
              return resolved;
            }
          } catch (error) {
            if (!(error instanceof InvalidPackageTargetError)) {
              throw error;
            } else {
              lastError = error;
            }
          }
        }

        if (lastError) {
          throw lastError;
        }
        return null;
      }

      if (target && typeof target === 'object') {
        for (const [key, value] of Object.entries(target)) {
          if (key === 'default' || context.conditions.includes(key)) {
            const resolved = await resolvePackageTarget(context, {
              target: value,
              subpath,
              pattern,
              internal
            });

            // return if defined or null, but not undefined
            if (resolved !== undefined) {
              return resolved;
            }
          }
        }
        return undefined;
      }

      if (target === null) {
        return null;
      }

      throw new InvalidPackageTargetError(context, `Invalid exports field.`);
    }

    /* eslint-disable no-await-in-loop */

    async function resolvePackageImportsExports(context, { matchKey, matchObj, internal }) {
      if (!matchKey.endsWith('*') && matchKey in matchObj) {
        const target = matchObj[matchKey];
        const resolved = await resolvePackageTarget(context, { target, subpath: '', internal });
        return resolved;
      }

      const expansionKeys = Object.keys(matchObj)
        .filter((k) => k.endsWith('/') || k.endsWith('*'))
        .sort((a, b) => b.length - a.length);

      for (const expansionKey of expansionKeys) {
        const prefix = expansionKey.substring(0, expansionKey.length - 1);

        if (expansionKey.endsWith('*') && matchKey.startsWith(prefix)) {
          const target = matchObj[expansionKey];
          const subpath = matchKey.substring(expansionKey.length - 1);
          const resolved = await resolvePackageTarget(context, {
            target,
            subpath,
            pattern: true,
            internal
          });
          return resolved;
        }

        if (matchKey.startsWith(expansionKey)) {
          const target = matchObj[expansionKey];
          const subpath = matchKey.substring(expansionKey.length);

          const resolved = await resolvePackageTarget(context, { target, subpath, internal });
          return resolved;
        }
      }

      throw new InvalidModuleSpecifierError(context, internal);
    }

    async function resolvePackageExports(context, subpath, exports) {
      if (isMixedExports(exports)) {
        throw new InvalidConfigurationError(
          context,
          'All keys must either start with ./, or without one.'
        );
      }

      if (subpath === '.') {
        let mainExport;
        // If exports is a String or Array, or an Object containing no keys starting with ".", then
        if (typeof exports === 'string' || Array.isArray(exports) || isConditions(exports)) {
          mainExport = exports;
        } else if (isMappings(exports)) {
          mainExport = exports['.'];
        }

        if (mainExport) {
          const resolved = await resolvePackageTarget(context, { target: mainExport, subpath: '' });
          if (resolved) {
            return resolved;
          }
        }
      } else if (isMappings(exports)) {
        const resolvedMatch = await resolvePackageImportsExports(context, {
          matchKey: subpath,
          matchObj: exports
        });

        if (resolvedMatch) {
          return resolvedMatch;
        }
      }

      throw new InvalidModuleSpecifierError(context);
    }

    async function resolvePackageImports({
      importSpecifier,
      importer,
      moduleDirs,
      conditions,
      resolveId
    }) {
      const result = await findPackageJson(importer, moduleDirs);
      if (!result) {
        throw new Error(createBaseErrorMsg('. Could not find a parent package.json.'));
      }

      const { pkgPath, pkgJsonPath, pkgJson } = result;
      const pkgURL = url$2.pathToFileURL(`${pkgPath}/`);
      const context = {
        importer,
        importSpecifier,
        moduleDirs,
        pkgURL,
        pkgJsonPath,
        conditions,
        resolveId
      };

      const { imports } = pkgJson;
      if (!imports) {
        throw new InvalidModuleSpecifierError(context, true);
      }

      if (importSpecifier === '#' || importSpecifier.startsWith('#/')) {
        throw new InvalidModuleSpecifierError(context, 'Invalid import specifier.');
      }

      return resolvePackageImportsExports(context, {
        matchKey: importSpecifier,
        matchObj: imports,
        internal: true
      });
    }

    const resolveImportPath = util$3.promisify(resolve);
    const readFile = util$3.promisify(fs__default['default'].readFile);

    async function getPackageJson(importer, pkgName, resolveOptions, moduleDirectories) {
      if (importer) {
        const selfPackageJsonResult = await findPackageJson(importer, moduleDirectories);
        if (selfPackageJsonResult && selfPackageJsonResult.pkgJson.name === pkgName) {
          // the referenced package name is the current package
          return selfPackageJsonResult;
        }
      }

      try {
        const pkgJsonPath = await resolveImportPath(`${pkgName}/package.json`, resolveOptions);
        const pkgJson = JSON.parse(await readFile(pkgJsonPath, 'utf-8'));
        return { pkgJsonPath, pkgJson };
      } catch (_) {
        return null;
      }
    }

    async function resolveId({
      importer,
      importSpecifier,
      exportConditions,
      warn,
      packageInfoCache,
      extensions,
      mainFields,
      preserveSymlinks,
      useBrowserOverrides,
      baseDir,
      moduleDirectories,
      rootDir,
      ignoreSideEffectsForRoot
    }) {
      let hasModuleSideEffects = () => null;
      let hasPackageEntry = true;
      let packageBrowserField = false;
      let packageInfo;

      const filter = (pkg, pkgPath) => {
        const info = getPackageInfo({
          cache: packageInfoCache,
          extensions,
          pkg,
          pkgPath,
          mainFields,
          preserveSymlinks,
          useBrowserOverrides,
          rootDir,
          ignoreSideEffectsForRoot
        });

        ({ packageInfo, hasModuleSideEffects, hasPackageEntry, packageBrowserField } = info);

        return info.cachedPkg;
      };

      const resolveOptions = {
        basedir: baseDir,
        readFile: readCachedFile,
        isFile: isFileCached,
        isDirectory: isDirCached,
        extensions,
        includeCoreModules: false,
        moduleDirectory: moduleDirectories,
        preserveSymlinks,
        packageFilter: filter
      };

      let location;

      const pkgName = getPackageName(importSpecifier);
      if (importSpecifier.startsWith('#')) {
        // this is a package internal import, resolve using package imports field
        const resolveResult = await resolvePackageImports({
          importSpecifier,
          importer,
          moduleDirs: moduleDirectories,
          conditions: exportConditions,
          resolveId(id, parent) {
            return resolveId({
              importSpecifier: id,
              importer: parent,
              exportConditions,
              warn,
              packageInfoCache,
              extensions,
              mainFields,
              preserveSymlinks,
              useBrowserOverrides,
              baseDir,
              moduleDirectories
            });
          }
        });
        location = url$2.fileURLToPath(resolveResult);
      } else if (pkgName) {
        // it's a bare import, find the package.json and resolve using package exports if available
        const result = await getPackageJson(importer, pkgName, resolveOptions, moduleDirectories);

        if (result && result.pkgJson.exports) {
          const { pkgJson, pkgJsonPath } = result;
          try {
            const subpath =
              pkgName === importSpecifier ? '.' : `.${importSpecifier.substring(pkgName.length)}`;
            const pkgDr = pkgJsonPath.replace('package.json', '');
            const pkgURL = url$2.pathToFileURL(pkgDr);

            const context = {
              importer,
              importSpecifier,
              moduleDirs: moduleDirectories,
              pkgURL,
              pkgJsonPath,
              conditions: exportConditions
            };
            const resolvedPackageExport = await resolvePackageExports(
              context,
              subpath,
              pkgJson.exports
            );
            location = url$2.fileURLToPath(resolvedPackageExport);
          } catch (error) {
            if (error instanceof ResolveError) {
              return error;
            }
            throw error;
          }
        }
      }

      if (!location) {
        // package has no imports or exports, use classic node resolve
        try {
          location = await resolveImportPath(importSpecifier, resolveOptions);
        } catch (error) {
          if (error.code !== 'MODULE_NOT_FOUND') {
            throw error;
          }
          return null;
        }
      }

      if (!preserveSymlinks) {
        if (await exists(location)) {
          location = await realpath$1(location);
        }
      }

      return {
        location,
        hasModuleSideEffects,
        hasPackageEntry,
        packageBrowserField,
        packageInfo
      };
    }

    // Resolve module specifiers in order. Promise resolves to the first module that resolves
    // successfully, or the error that resulted from the last attempted module resolution.
    async function resolveImportSpecifiers({
      importer,
      importSpecifierList,
      exportConditions,
      warn,
      packageInfoCache,
      extensions,
      mainFields,
      preserveSymlinks,
      useBrowserOverrides,
      baseDir,
      moduleDirectories,
      rootDir,
      ignoreSideEffectsForRoot
    }) {
      let lastResolveError;

      for (let i = 0; i < importSpecifierList.length; i++) {
        // eslint-disable-next-line no-await-in-loop
        const result = await resolveId({
          importer,
          importSpecifier: importSpecifierList[i],
          exportConditions,
          warn,
          packageInfoCache,
          extensions,
          mainFields,
          preserveSymlinks,
          useBrowserOverrides,
          baseDir,
          moduleDirectories,
          rootDir,
          ignoreSideEffectsForRoot
        });

        if (result instanceof ResolveError) {
          lastResolveError = result;
        } else if (result) {
          return result;
        }
      }

      if (lastResolveError) {
        // only log the last failed resolve error
        warn(lastResolveError);
      }
      return null;
    }

    function handleDeprecatedOptions(opts) {
      const warnings = [];

      if (opts.customResolveOptions) {
        const { customResolveOptions } = opts;
        if (customResolveOptions.moduleDirectory) {
          // eslint-disable-next-line no-param-reassign
          opts.moduleDirectories = Array.isArray(customResolveOptions.moduleDirectory)
            ? customResolveOptions.moduleDirectory
            : [customResolveOptions.moduleDirectory];

          warnings.push(
            'node-resolve: The `customResolveOptions.moduleDirectory` option has been deprecated. Use `moduleDirectories`, which must be an array.'
          );
        }

        if (customResolveOptions.preserveSymlinks) {
          throw new Error(
            'node-resolve: `customResolveOptions.preserveSymlinks` is no longer an option. We now always use the rollup `preserveSymlinks` option.'
          );
        }

        [
          'basedir',
          'package',
          'extensions',
          'includeCoreModules',
          'readFile',
          'isFile',
          'isDirectory',
          'realpath',
          'packageFilter',
          'pathFilter',
          'paths',
          'packageIterator'
        ].forEach((resolveOption) => {
          if (customResolveOptions[resolveOption]) {
            throw new Error(
              `node-resolve: \`customResolveOptions.${resolveOption}\` is no longer an option. If you need this, please open an issue.`
            );
          }
        });
      }

      return { warnings };
    }

    /* eslint-disable no-param-reassign, no-shadow, no-undefined */

    const builtins = new Set(builtinModules_1);
    const ES6_BROWSER_EMPTY = '\0node-resolve:empty.js';
    const deepFreeze = (object) => {
      Object.freeze(object);

      for (const value of Object.values(object)) {
        if (typeof value === 'object' && !Object.isFrozen(value)) {
          deepFreeze(value);
        }
      }

      return object;
    };

    const baseConditions = ['default', 'module'];
    const baseConditionsEsm = [...baseConditions, 'import'];
    const baseConditionsCjs = [...baseConditions, 'require'];
    const defaults = {
      dedupe: [],
      // It's important that .mjs is listed before .js so that Rollup will interpret npm modules
      // which deploy both ESM .mjs and CommonJS .js files as ESM.
      extensions: ['.mjs', '.js', '.json', '.node'],
      resolveOnly: [],
      moduleDirectories: ['node_modules'],
      ignoreSideEffectsForRoot: false
    };
    deepFreeze(cjs({}, defaults));

    function nodeResolve(opts = {}) {
      const { warnings } = handleDeprecatedOptions(opts);

      const options = { ...defaults, ...opts };
      const { extensions, jail, moduleDirectories, ignoreSideEffectsForRoot } = options;
      const conditionsEsm = [...baseConditionsEsm, ...(options.exportConditions || [])];
      const conditionsCjs = [...baseConditionsCjs, ...(options.exportConditions || [])];
      const packageInfoCache = new Map();
      const idToPackageInfo = new Map();
      const mainFields = getMainFields(options);
      const useBrowserOverrides = mainFields.indexOf('browser') !== -1;
      const isPreferBuiltinsSet = options.preferBuiltins === true || options.preferBuiltins === false;
      const preferBuiltins = isPreferBuiltinsSet ? options.preferBuiltins : true;
      const rootDir = require$$0$1.resolve(options.rootDir || process.cwd());
      let { dedupe } = options;
      let rollupOptions;

      if (typeof dedupe !== 'function') {
        dedupe = (importee) =>
          options.dedupe.includes(importee) || options.dedupe.includes(getPackageName(importee));
      }

      const resolveOnly = options.resolveOnly.map((pattern) => {
        if (pattern instanceof RegExp) {
          return pattern;
        }
        const normalized = pattern.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
        return new RegExp(`^${normalized}$`);
      });

      const browserMapCache = new Map();
      let preserveSymlinks;

      const doResolveId = async (context, importee, importer, opts) => {
        // strip query params from import
        const [importPath, params] = importee.split('?');
        const importSuffix = `${params ? `?${params}` : ''}`;
        importee = importPath;

        const baseDir = !importer || dedupe(importee) ? rootDir : require$$0$1.dirname(importer);

        // https://github.com/defunctzombie/package-browser-field-spec
        const browser = browserMapCache.get(importer);
        if (useBrowserOverrides && browser) {
          const resolvedImportee = require$$0$1.resolve(baseDir, importee);
          if (browser[importee] === false || browser[resolvedImportee] === false) {
            return { id: ES6_BROWSER_EMPTY };
          }
          const browserImportee =
            browser[importee] ||
            browser[resolvedImportee] ||
            browser[`${resolvedImportee}.js`] ||
            browser[`${resolvedImportee}.json`];
          if (browserImportee) {
            importee = browserImportee;
          }
        }

        const parts = importee.split(/[/\\]/);
        let id = parts.shift();
        let isRelativeImport = false;

        if (id[0] === '@' && parts.length > 0) {
          // scoped packages
          id += `/${parts.shift()}`;
        } else if (id[0] === '.') {
          // an import relative to the parent dir of the importer
          id = require$$0$1.resolve(baseDir, importee);
          isRelativeImport = true;
        }

        if (
          !isRelativeImport &&
          resolveOnly.length &&
          !resolveOnly.some((pattern) => pattern.test(id))
        ) {
          if (normalizeInput(rollupOptions.input).includes(importee)) {
            return null;
          }
          return false;
        }

        const importSpecifierList = [];

        if (importer === undefined && !importee[0].match(/^\.?\.?\//)) {
          // For module graph roots (i.e. when importer is undefined), we
          // need to handle 'path fragments` like `foo/bar` that are commonly
          // found in rollup config files. If importee doesn't look like a
          // relative or absolute path, we make it relative and attempt to
          // resolve it. If we don't find anything, we try resolving it as we
          // got it.
          importSpecifierList.push(`./${importee}`);
        }

        const importeeIsBuiltin = builtins.has(importee);

        if (importeeIsBuiltin) {
          // The `resolve` library will not resolve packages with the same
          // name as a node built-in module. If we're resolving something
          // that's a builtin, and we don't prefer to find built-ins, we
          // first try to look up a local module with that name. If we don't
          // find anything, we resolve the builtin which just returns back
          // the built-in's name.
          importSpecifierList.push(`${importee}/`);
        }

        // TypeScript files may import '.js' to refer to either '.ts' or '.tsx'
        if (importer && importee.endsWith('.js')) {
          for (const ext of ['.ts', '.tsx']) {
            if (importer.endsWith(ext) && extensions.includes(ext)) {
              importSpecifierList.push(importee.replace(/.js$/, ext));
            }
          }
        }

        importSpecifierList.push(importee);

        const warn = (...args) => context.warn(...args);
        const isRequire =
          opts && opts.custom && opts.custom['node-resolve'] && opts.custom['node-resolve'].isRequire;
        const exportConditions = isRequire ? conditionsCjs : conditionsEsm;

        if (useBrowserOverrides && !exportConditions.includes('browser'))
          exportConditions.push('browser');

        const resolvedWithoutBuiltins = await resolveImportSpecifiers({
          importer,
          importSpecifierList,
          exportConditions,
          warn,
          packageInfoCache,
          extensions,
          mainFields,
          preserveSymlinks,
          useBrowserOverrides,
          baseDir,
          moduleDirectories,
          rootDir,
          ignoreSideEffectsForRoot
        });

        const resolved =
          importeeIsBuiltin && preferBuiltins
            ? {
                packageInfo: undefined,
                hasModuleSideEffects: () => null,
                hasPackageEntry: true,
                packageBrowserField: false
              }
            : resolvedWithoutBuiltins;
        if (!resolved) {
          return null;
        }

        const { packageInfo, hasModuleSideEffects, hasPackageEntry, packageBrowserField } = resolved;
        let { location } = resolved;
        if (packageBrowserField) {
          if (Object.prototype.hasOwnProperty.call(packageBrowserField, location)) {
            if (!packageBrowserField[location]) {
              browserMapCache.set(location, packageBrowserField);
              return { id: ES6_BROWSER_EMPTY };
            }
            location = packageBrowserField[location];
          }
          browserMapCache.set(location, packageBrowserField);
        }

        if (hasPackageEntry && !preserveSymlinks) {
          const fileExists = await exists(location);
          if (fileExists) {
            location = await realpath$1(location);
          }
        }

        idToPackageInfo.set(location, packageInfo);

        if (hasPackageEntry) {
          if (importeeIsBuiltin && preferBuiltins) {
            if (!isPreferBuiltinsSet && resolvedWithoutBuiltins && resolved !== importee) {
              context.warn(
                `preferring built-in module '${importee}' over local alternative at '${resolvedWithoutBuiltins.location}', pass 'preferBuiltins: false' to disable this behavior or 'preferBuiltins: true' to disable this warning`
              );
            }
            return false;
          } else if (jail && location.indexOf(require$$0$1.normalize(jail.trim(require$$0$1.sep))) !== 0) {
            return null;
          }
        }

        if (options.modulesOnly && (await exists(location))) {
          const code = await readFile$1(location, 'utf-8');
          if (isModule(code)) {
            return {
              id: `${location}${importSuffix}`,
              moduleSideEffects: hasModuleSideEffects(location)
            };
          }
          return null;
        }
        const result = {
          id: `${location}${importSuffix}`,
          moduleSideEffects: hasModuleSideEffects(location)
        };
        return result;
      };

      return {
        name: 'node-resolve',

        buildStart(options) {
          rollupOptions = options;

          for (const warning of warnings) {
            this.warn(warning);
          }

          ({ preserveSymlinks } = options);
        },

        generateBundle() {
          readCachedFile.clear();
          isFileCached.clear();
          isDirCached.clear();
        },

        async resolveId(importee, importer, opts) {
          if (importee === ES6_BROWSER_EMPTY) {
            return importee;
          }
          // ignore IDs with null character, these belong to other plugins
          if (/\0/.test(importee)) return null;

          if (/\0/.test(importer)) {
            importer = undefined;
          }

          const resolved = await doResolveId(this, importee, importer, opts);
          if (resolved) {
            const resolvedResolved = await this.resolve(resolved.id, importer, { skipSelf: true });
            const isExternal = !!(resolvedResolved && resolvedResolved.external);
            if (isExternal) {
              return false;
            }
          }
          return resolved;
        },

        load(importee) {
          if (importee === ES6_BROWSER_EMPTY) {
            return 'export default {};';
          }
          return null;
        },

        getPackageInfoForId(id) {
          return idToPackageInfo.get(id);
        }
      };
    }

    var path$4 = require$$0__default['default'];

    var commondir = function (basedir, relfiles) {
        if (relfiles) {
            var files = relfiles.map(function (r) {
                return path$4.resolve(basedir, r);
            });
        }
        else {
            var files = basedir;
        }
        
        var res = files.slice(1).reduce(function (ps, file) {
            if (!file.match(/^([A-Za-z]:)?\/|\\/)) {
                throw new Error('relative path without a basedir');
            }
            
            var xs = file.split(/\/+|\\+/);
            for (
                var i = 0;
                ps[i] === xs[i] && i < Math.min(ps.length, xs.length);
                i++
            );
            return ps.slice(0, i);
        }, files[0].split(/\/+|\\+/));
        
        // Windows correctly handles paths with forward-slashes
        return res.length > 1 ? res.join('/') : '/'
    };

    var old$1 = {};

    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    var pathModule = require$$0__default['default'];
    var isWindows = process.platform === 'win32';
    var fs$3 = fs__default['default'];

    // JavaScript implementation of realpath, ported from node pre-v6

    var DEBUG = process.env.NODE_DEBUG && /fs/.test(process.env.NODE_DEBUG);

    function rethrow() {
      // Only enable in debug mode. A backtrace uses ~1000 bytes of heap space and
      // is fairly slow to generate.
      var callback;
      if (DEBUG) {
        var backtrace = new Error;
        callback = debugCallback;
      } else
        callback = missingCallback;

      return callback;

      function debugCallback(err) {
        if (err) {
          backtrace.message = err.message;
          err = backtrace;
          missingCallback(err);
        }
      }

      function missingCallback(err) {
        if (err) {
          if (process.throwDeprecation)
            throw err;  // Forgot a callback but don't know where? Use NODE_DEBUG=fs
          else if (!process.noDeprecation) {
            var msg = 'fs: missing callback ' + (err.stack || err.message);
            if (process.traceDeprecation)
              console.trace(msg);
            else
              console.error(msg);
          }
        }
      }
    }

    function maybeCallback(cb) {
      return typeof cb === 'function' ? cb : rethrow();
    }

    pathModule.normalize;

    // Regexp that finds the next partion of a (partial) path
    // result is [base_with_slash, base], e.g. ['somedir/', 'somedir']
    if (isWindows) {
      var nextPartRe = /(.*?)(?:[\/\\]+|$)/g;
    } else {
      var nextPartRe = /(.*?)(?:[\/]+|$)/g;
    }

    // Regex to find the device root, including trailing slash. E.g. 'c:\\'.
    if (isWindows) {
      var splitRootRe = /^(?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/][^\\\/]+)?[\\\/]*/;
    } else {
      var splitRootRe = /^[\/]*/;
    }

    old$1.realpathSync = function realpathSync(p, cache) {
      // make p is absolute
      p = pathModule.resolve(p);

      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return cache[p];
      }

      var original = p,
          seenLinks = {},
          knownHard = {};

      // current character position in p
      var pos;
      // the partial path so far, including a trailing slash if any
      var current;
      // the partial path without a trailing slash (except when pointing at a root)
      var base;
      // the partial path scanned in the previous round, with slash
      var previous;

      start();

      function start() {
        // Skip over roots
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = '';

        // On windows, check that the root exists. On unix there is no need.
        if (isWindows && !knownHard[base]) {
          fs$3.lstatSync(base);
          knownHard[base] = true;
        }
      }

      // walk down the path, swapping out linked pathparts for their real
      // values
      // NB: p.length changes.
      while (pos < p.length) {
        // find the next part
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;

        // continue if not a symlink
        if (knownHard[base] || (cache && cache[base] === base)) {
          continue;
        }

        var resolvedLink;
        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          // some known symbolic link.  no need to stat again.
          resolvedLink = cache[base];
        } else {
          var stat = fs$3.lstatSync(base);
          if (!stat.isSymbolicLink()) {
            knownHard[base] = true;
            if (cache) cache[base] = base;
            continue;
          }

          // read the link if it wasn't read before
          // dev/ino always return 0 on windows, so skip the check.
          var linkTarget = null;
          if (!isWindows) {
            var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
            if (seenLinks.hasOwnProperty(id)) {
              linkTarget = seenLinks[id];
            }
          }
          if (linkTarget === null) {
            fs$3.statSync(base);
            linkTarget = fs$3.readlinkSync(base);
          }
          resolvedLink = pathModule.resolve(previous, linkTarget);
          // track this, if given a cache.
          if (cache) cache[base] = resolvedLink;
          if (!isWindows) seenLinks[id] = linkTarget;
        }

        // resolve the link, then start over
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }

      if (cache) cache[original] = p;

      return p;
    };


    old$1.realpath = function realpath(p, cache, cb) {
      if (typeof cb !== 'function') {
        cb = maybeCallback(cache);
        cache = null;
      }

      // make p is absolute
      p = pathModule.resolve(p);

      if (cache && Object.prototype.hasOwnProperty.call(cache, p)) {
        return process.nextTick(cb.bind(null, null, cache[p]));
      }

      var original = p,
          seenLinks = {},
          knownHard = {};

      // current character position in p
      var pos;
      // the partial path so far, including a trailing slash if any
      var current;
      // the partial path without a trailing slash (except when pointing at a root)
      var base;
      // the partial path scanned in the previous round, with slash
      var previous;

      start();

      function start() {
        // Skip over roots
        var m = splitRootRe.exec(p);
        pos = m[0].length;
        current = m[0];
        base = m[0];
        previous = '';

        // On windows, check that the root exists. On unix there is no need.
        if (isWindows && !knownHard[base]) {
          fs$3.lstat(base, function(err) {
            if (err) return cb(err);
            knownHard[base] = true;
            LOOP();
          });
        } else {
          process.nextTick(LOOP);
        }
      }

      // walk down the path, swapping out linked pathparts for their real
      // values
      function LOOP() {
        // stop if scanned past end of path
        if (pos >= p.length) {
          if (cache) cache[original] = p;
          return cb(null, p);
        }

        // find the next part
        nextPartRe.lastIndex = pos;
        var result = nextPartRe.exec(p);
        previous = current;
        current += result[0];
        base = previous + result[1];
        pos = nextPartRe.lastIndex;

        // continue if not a symlink
        if (knownHard[base] || (cache && cache[base] === base)) {
          return process.nextTick(LOOP);
        }

        if (cache && Object.prototype.hasOwnProperty.call(cache, base)) {
          // known symbolic link.  no need to stat again.
          return gotResolvedLink(cache[base]);
        }

        return fs$3.lstat(base, gotStat);
      }

      function gotStat(err, stat) {
        if (err) return cb(err);

        // if not a symlink, skip to the next path part
        if (!stat.isSymbolicLink()) {
          knownHard[base] = true;
          if (cache) cache[base] = base;
          return process.nextTick(LOOP);
        }

        // stat & read the link if not read before
        // call gotTarget as soon as the link target is known
        // dev/ino always return 0 on windows, so skip the check.
        if (!isWindows) {
          var id = stat.dev.toString(32) + ':' + stat.ino.toString(32);
          if (seenLinks.hasOwnProperty(id)) {
            return gotTarget(null, seenLinks[id], base);
          }
        }
        fs$3.stat(base, function(err) {
          if (err) return cb(err);

          fs$3.readlink(base, function(err, target) {
            if (!isWindows) seenLinks[id] = target;
            gotTarget(err, target);
          });
        });
      }

      function gotTarget(err, target, base) {
        if (err) return cb(err);

        var resolvedLink = pathModule.resolve(previous, target);
        if (cache) cache[base] = resolvedLink;
        gotResolvedLink(resolvedLink);
      }

      function gotResolvedLink(resolvedLink) {
        // resolve the link, then start over
        p = pathModule.resolve(resolvedLink, p.slice(pos));
        start();
      }
    };

    var fs_realpath = realpath;
    realpath.realpath = realpath;
    realpath.sync = realpathSync;
    realpath.realpathSync = realpathSync;
    realpath.monkeypatch = monkeypatch;
    realpath.unmonkeypatch = unmonkeypatch;

    var fs$2 = fs__default['default'];
    var origRealpath = fs$2.realpath;
    var origRealpathSync = fs$2.realpathSync;

    var version = process.version;
    var ok = /^v[0-5]\./.test(version);
    var old = old$1;

    function newError (er) {
      return er && er.syscall === 'realpath' && (
        er.code === 'ELOOP' ||
        er.code === 'ENOMEM' ||
        er.code === 'ENAMETOOLONG'
      )
    }

    function realpath (p, cache, cb) {
      if (ok) {
        return origRealpath(p, cache, cb)
      }

      if (typeof cache === 'function') {
        cb = cache;
        cache = null;
      }
      origRealpath(p, cache, function (er, result) {
        if (newError(er)) {
          old.realpath(p, cache, cb);
        } else {
          cb(er, result);
        }
      });
    }

    function realpathSync (p, cache) {
      if (ok) {
        return origRealpathSync(p, cache)
      }

      try {
        return origRealpathSync(p, cache)
      } catch (er) {
        if (newError(er)) {
          return old.realpathSync(p, cache)
        } else {
          throw er
        }
      }
    }

    function monkeypatch () {
      fs$2.realpath = realpath;
      fs$2.realpathSync = realpathSync;
    }

    function unmonkeypatch () {
      fs$2.realpath = origRealpath;
      fs$2.realpathSync = origRealpathSync;
    }

    var concatMap$1 = function (xs, fn) {
        var res = [];
        for (var i = 0; i < xs.length; i++) {
            var x = fn(xs[i], i);
            if (isArray(x)) res.push.apply(res, x);
            else res.push(x);
        }
        return res;
    };

    var isArray = Array.isArray || function (xs) {
        return Object.prototype.toString.call(xs) === '[object Array]';
    };

    var balancedMatch = balanced$1;
    function balanced$1(a, b, str) {
      if (a instanceof RegExp) a = maybeMatch(a, str);
      if (b instanceof RegExp) b = maybeMatch(b, str);

      var r = range(a, b, str);

      return r && {
        start: r[0],
        end: r[1],
        pre: str.slice(0, r[0]),
        body: str.slice(r[0] + a.length, r[1]),
        post: str.slice(r[1] + b.length)
      };
    }

    function maybeMatch(reg, str) {
      var m = str.match(reg);
      return m ? m[0] : null;
    }

    balanced$1.range = range;
    function range(a, b, str) {
      var begs, beg, left, right, result;
      var ai = str.indexOf(a);
      var bi = str.indexOf(b, ai + 1);
      var i = ai;

      if (ai >= 0 && bi > 0) {
        if(a===b) {
          return [ai, bi];
        }
        begs = [];
        left = str.length;

        while (i >= 0 && !result) {
          if (i == ai) {
            begs.push(i);
            ai = str.indexOf(a, i + 1);
          } else if (begs.length == 1) {
            result = [ begs.pop(), bi ];
          } else {
            beg = begs.pop();
            if (beg < left) {
              left = beg;
              right = bi;
            }

            bi = str.indexOf(b, i + 1);
          }

          i = ai < bi && ai >= 0 ? ai : bi;
        }

        if (begs.length) {
          result = [ left, right ];
        }
      }

      return result;
    }

    var concatMap = concatMap$1;
    var balanced = balancedMatch;

    var braceExpansion = expandTop;

    var escSlash = '\0SLASH'+Math.random()+'\0';
    var escOpen = '\0OPEN'+Math.random()+'\0';
    var escClose = '\0CLOSE'+Math.random()+'\0';
    var escComma = '\0COMMA'+Math.random()+'\0';
    var escPeriod = '\0PERIOD'+Math.random()+'\0';

    function numeric(str) {
      return parseInt(str, 10) == str
        ? parseInt(str, 10)
        : str.charCodeAt(0);
    }

    function escapeBraces(str) {
      return str.split('\\\\').join(escSlash)
                .split('\\{').join(escOpen)
                .split('\\}').join(escClose)
                .split('\\,').join(escComma)
                .split('\\.').join(escPeriod);
    }

    function unescapeBraces(str) {
      return str.split(escSlash).join('\\')
                .split(escOpen).join('{')
                .split(escClose).join('}')
                .split(escComma).join(',')
                .split(escPeriod).join('.');
    }


    // Basically just str.split(","), but handling cases
    // where we have nested braced sections, which should be
    // treated as individual members, like {a,{b,c},d}
    function parseCommaParts(str) {
      if (!str)
        return [''];

      var parts = [];
      var m = balanced('{', '}', str);

      if (!m)
        return str.split(',');

      var pre = m.pre;
      var body = m.body;
      var post = m.post;
      var p = pre.split(',');

      p[p.length-1] += '{' + body + '}';
      var postParts = parseCommaParts(post);
      if (post.length) {
        p[p.length-1] += postParts.shift();
        p.push.apply(p, postParts);
      }

      parts.push.apply(parts, p);

      return parts;
    }

    function expandTop(str) {
      if (!str)
        return [];

      // I don't know why Bash 4.3 does this, but it does.
      // Anything starting with {} will have the first two bytes preserved
      // but *only* at the top level, so {},a}b will not expand to anything,
      // but a{},b}c will be expanded to [a}c,abc].
      // One could argue that this is a bug in Bash, but since the goal of
      // this module is to match Bash's rules, we escape a leading {}
      if (str.substr(0, 2) === '{}') {
        str = '\\{\\}' + str.substr(2);
      }

      return expand$1(escapeBraces(str), true).map(unescapeBraces);
    }

    function embrace(str) {
      return '{' + str + '}';
    }
    function isPadded(el) {
      return /^-?0\d/.test(el);
    }

    function lte(i, y) {
      return i <= y;
    }
    function gte(i, y) {
      return i >= y;
    }

    function expand$1(str, isTop) {
      var expansions = [];

      var m = balanced('{', '}', str);
      if (!m || /\$$/.test(m.pre)) return [str];

      var isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
      var isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
      var isSequence = isNumericSequence || isAlphaSequence;
      var isOptions = m.body.indexOf(',') >= 0;
      if (!isSequence && !isOptions) {
        // {a},b}
        if (m.post.match(/,.*\}/)) {
          str = m.pre + '{' + m.body + escClose + m.post;
          return expand$1(str);
        }
        return [str];
      }

      var n;
      if (isSequence) {
        n = m.body.split(/\.\./);
      } else {
        n = parseCommaParts(m.body);
        if (n.length === 1) {
          // x{{a,b}}y ==> x{a}y x{b}y
          n = expand$1(n[0], false).map(embrace);
          if (n.length === 1) {
            var post = m.post.length
              ? expand$1(m.post, false)
              : [''];
            return post.map(function(p) {
              return m.pre + n[0] + p;
            });
          }
        }
      }

      // at this point, n is the parts, and we know it's not a comma set
      // with a single entry.

      // no need to expand pre, since it is guaranteed to be free of brace-sets
      var pre = m.pre;
      var post = m.post.length
        ? expand$1(m.post, false)
        : [''];

      var N;

      if (isSequence) {
        var x = numeric(n[0]);
        var y = numeric(n[1]);
        var width = Math.max(n[0].length, n[1].length);
        var incr = n.length == 3
          ? Math.abs(numeric(n[2]))
          : 1;
        var test = lte;
        var reverse = y < x;
        if (reverse) {
          incr *= -1;
          test = gte;
        }
        var pad = n.some(isPadded);

        N = [];

        for (var i = x; test(i, y); i += incr) {
          var c;
          if (isAlphaSequence) {
            c = String.fromCharCode(i);
            if (c === '\\')
              c = '';
          } else {
            c = String(i);
            if (pad) {
              var need = width - c.length;
              if (need > 0) {
                var z = new Array(need + 1).join('0');
                if (i < 0)
                  c = '-' + z + c.slice(1);
                else
                  c = z + c;
              }
            }
          }
          N.push(c);
        }
      } else {
        N = concatMap(n, function(el) { return expand$1(el, false) });
      }

      for (var j = 0; j < N.length; j++) {
        for (var k = 0; k < post.length; k++) {
          var expansion = pre + N[j] + post[k];
          if (!isTop || isSequence || expansion)
            expansions.push(expansion);
        }
      }

      return expansions;
    }

    var minimatch_1 = minimatch$3;
    minimatch$3.Minimatch = Minimatch$1;

    var path$3 = { sep: '/' };
    try {
      path$3 = require$$0__default['default'];
    } catch (er) {}

    var GLOBSTAR = minimatch$3.GLOBSTAR = Minimatch$1.GLOBSTAR = {};
    var expand = braceExpansion;

    var plTypes = {
      '!': { open: '(?:(?!(?:', close: '))[^/]*?)'},
      '?': { open: '(?:', close: ')?' },
      '+': { open: '(?:', close: ')+' },
      '*': { open: '(?:', close: ')*' },
      '@': { open: '(?:', close: ')' }
    };

    // any single thing other than /
    // don't need to escape / when using new RegExp()
    var qmark = '[^/]';

    // * => any number of characters
    var star = qmark + '*?';

    // ** when dots are allowed.  Anything goes, except .. and .
    // not (^ or / followed by one or two dots followed by $ or /),
    // followed by anything, any number of times.
    var twoStarDot = '(?:(?!(?:\\\/|^)(?:\\.{1,2})($|\\\/)).)*?';

    // not a ^ or / followed by a dot,
    // followed by anything, any number of times.
    var twoStarNoDot = '(?:(?!(?:\\\/|^)\\.).)*?';

    // characters that need to be escaped in RegExp.
    var reSpecials = charSet('().*{}+?[]^$\\!');

    // "abc" -> { a:true, b:true, c:true }
    function charSet (s) {
      return s.split('').reduce(function (set, c) {
        set[c] = true;
        return set
      }, {})
    }

    // normalizes slashes.
    var slashSplit = /\/+/;

    minimatch$3.filter = filter;
    function filter (pattern, options) {
      options = options || {};
      return function (p, i, list) {
        return minimatch$3(p, pattern, options)
      }
    }

    function ext (a, b) {
      a = a || {};
      b = b || {};
      var t = {};
      Object.keys(b).forEach(function (k) {
        t[k] = b[k];
      });
      Object.keys(a).forEach(function (k) {
        t[k] = a[k];
      });
      return t
    }

    minimatch$3.defaults = function (def) {
      if (!def || !Object.keys(def).length) return minimatch$3

      var orig = minimatch$3;

      var m = function minimatch (p, pattern, options) {
        return orig.minimatch(p, pattern, ext(def, options))
      };

      m.Minimatch = function Minimatch (pattern, options) {
        return new orig.Minimatch(pattern, ext(def, options))
      };

      return m
    };

    Minimatch$1.defaults = function (def) {
      if (!def || !Object.keys(def).length) return Minimatch$1
      return minimatch$3.defaults(def).Minimatch
    };

    function minimatch$3 (p, pattern, options) {
      if (typeof pattern !== 'string') {
        throw new TypeError('glob pattern string required')
      }

      if (!options) options = {};

      // shortcut: comments match nothing.
      if (!options.nocomment && pattern.charAt(0) === '#') {
        return false
      }

      // "" only matches ""
      if (pattern.trim() === '') return p === ''

      return new Minimatch$1(pattern, options).match(p)
    }

    function Minimatch$1 (pattern, options) {
      if (!(this instanceof Minimatch$1)) {
        return new Minimatch$1(pattern, options)
      }

      if (typeof pattern !== 'string') {
        throw new TypeError('glob pattern string required')
      }

      if (!options) options = {};
      pattern = pattern.trim();

      // windows support: need to use /, not \
      if (path$3.sep !== '/') {
        pattern = pattern.split(path$3.sep).join('/');
      }

      this.options = options;
      this.set = [];
      this.pattern = pattern;
      this.regexp = null;
      this.negate = false;
      this.comment = false;
      this.empty = false;

      // make the set of regexps etc.
      this.make();
    }

    Minimatch$1.prototype.debug = function () {};

    Minimatch$1.prototype.make = make;
    function make () {
      // don't do it more than once.
      if (this._made) return

      var pattern = this.pattern;
      var options = this.options;

      // empty patterns and comments match nothing.
      if (!options.nocomment && pattern.charAt(0) === '#') {
        this.comment = true;
        return
      }
      if (!pattern) {
        this.empty = true;
        return
      }

      // step 1: figure out negation, etc.
      this.parseNegate();

      // step 2: expand braces
      var set = this.globSet = this.braceExpand();

      if (options.debug) this.debug = console.error;

      this.debug(this.pattern, set);

      // step 3: now we have a set, so turn each one into a series of path-portion
      // matching patterns.
      // These will be regexps, except in the case of "**", which is
      // set to the GLOBSTAR object for globstar behavior,
      // and will not contain any / characters
      set = this.globParts = set.map(function (s) {
        return s.split(slashSplit)
      });

      this.debug(this.pattern, set);

      // glob --> regexps
      set = set.map(function (s, si, set) {
        return s.map(this.parse, this)
      }, this);

      this.debug(this.pattern, set);

      // filter out everything that didn't compile properly.
      set = set.filter(function (s) {
        return s.indexOf(false) === -1
      });

      this.debug(this.pattern, set);

      this.set = set;
    }

    Minimatch$1.prototype.parseNegate = parseNegate;
    function parseNegate () {
      var pattern = this.pattern;
      var negate = false;
      var options = this.options;
      var negateOffset = 0;

      if (options.nonegate) return

      for (var i = 0, l = pattern.length
        ; i < l && pattern.charAt(i) === '!'
        ; i++) {
        negate = !negate;
        negateOffset++;
      }

      if (negateOffset) this.pattern = pattern.substr(negateOffset);
      this.negate = negate;
    }

    // Brace expansion:
    // a{b,c}d -> abd acd
    // a{b,}c -> abc ac
    // a{0..3}d -> a0d a1d a2d a3d
    // a{b,c{d,e}f}g -> abg acdfg acefg
    // a{b,c}d{e,f}g -> abdeg acdeg abdeg abdfg
    //
    // Invalid sets are not expanded.
    // a{2..}b -> a{2..}b
    // a{b}c -> a{b}c
    minimatch$3.braceExpand = function (pattern, options) {
      return braceExpand(pattern, options)
    };

    Minimatch$1.prototype.braceExpand = braceExpand;

    function braceExpand (pattern, options) {
      if (!options) {
        if (this instanceof Minimatch$1) {
          options = this.options;
        } else {
          options = {};
        }
      }

      pattern = typeof pattern === 'undefined'
        ? this.pattern : pattern;

      if (typeof pattern === 'undefined') {
        throw new TypeError('undefined pattern')
      }

      if (options.nobrace ||
        !pattern.match(/\{.*\}/)) {
        // shortcut. no need to expand.
        return [pattern]
      }

      return expand(pattern)
    }

    // parse a component of the expanded set.
    // At this point, no pattern may contain "/" in it
    // so we're going to return a 2d array, where each entry is the full
    // pattern, split on '/', and then turned into a regular expression.
    // A regexp is made at the end which joins each array with an
    // escaped /, and another full one which joins each regexp with |.
    //
    // Following the lead of Bash 4.1, note that "**" only has special meaning
    // when it is the *only* thing in a path portion.  Otherwise, any series
    // of * is equivalent to a single *.  Globstar behavior is enabled by
    // default, and can be disabled by setting options.noglobstar.
    Minimatch$1.prototype.parse = parse;
    var SUBPARSE = {};
    function parse (pattern, isSub) {
      if (pattern.length > 1024 * 64) {
        throw new TypeError('pattern is too long')
      }

      var options = this.options;

      // shortcuts
      if (!options.noglobstar && pattern === '**') return GLOBSTAR
      if (pattern === '') return ''

      var re = '';
      var hasMagic = !!options.nocase;
      var escaping = false;
      // ? => one single character
      var patternListStack = [];
      var negativeLists = [];
      var stateChar;
      var inClass = false;
      var reClassStart = -1;
      var classStart = -1;
      // . and .. never match anything that doesn't start with .,
      // even when options.dot is set.
      var patternStart = pattern.charAt(0) === '.' ? '' // anything
      // not (start or / followed by . or .. followed by / or end)
      : options.dot ? '(?!(?:^|\\\/)\\.{1,2}(?:$|\\\/))'
      : '(?!\\.)';
      var self = this;

      function clearStateChar () {
        if (stateChar) {
          // we had some state-tracking character
          // that wasn't consumed by this pass.
          switch (stateChar) {
            case '*':
              re += star;
              hasMagic = true;
            break
            case '?':
              re += qmark;
              hasMagic = true;
            break
            default:
              re += '\\' + stateChar;
            break
          }
          self.debug('clearStateChar %j %j', stateChar, re);
          stateChar = false;
        }
      }

      for (var i = 0, len = pattern.length, c
        ; (i < len) && (c = pattern.charAt(i))
        ; i++) {
        this.debug('%s\t%s %s %j', pattern, i, re, c);

        // skip over any that are escaped.
        if (escaping && reSpecials[c]) {
          re += '\\' + c;
          escaping = false;
          continue
        }

        switch (c) {
          case '/':
            // completely not allowed, even escaped.
            // Should already be path-split by now.
            return false

          case '\\':
            clearStateChar();
            escaping = true;
          continue

          // the various stateChar values
          // for the "extglob" stuff.
          case '?':
          case '*':
          case '+':
          case '@':
          case '!':
            this.debug('%s\t%s %s %j <-- stateChar', pattern, i, re, c);

            // all of those are literals inside a class, except that
            // the glob [!a] means [^a] in regexp
            if (inClass) {
              this.debug('  in class');
              if (c === '!' && i === classStart + 1) c = '^';
              re += c;
              continue
            }

            // if we already have a stateChar, then it means
            // that there was something like ** or +? in there.
            // Handle the stateChar, then proceed with this one.
            self.debug('call clearStateChar %j', stateChar);
            clearStateChar();
            stateChar = c;
            // if extglob is disabled, then +(asdf|foo) isn't a thing.
            // just clear the statechar *now*, rather than even diving into
            // the patternList stuff.
            if (options.noext) clearStateChar();
          continue

          case '(':
            if (inClass) {
              re += '(';
              continue
            }

            if (!stateChar) {
              re += '\\(';
              continue
            }

            patternListStack.push({
              type: stateChar,
              start: i - 1,
              reStart: re.length,
              open: plTypes[stateChar].open,
              close: plTypes[stateChar].close
            });
            // negation is (?:(?!js)[^/]*)
            re += stateChar === '!' ? '(?:(?!(?:' : '(?:';
            this.debug('plType %j %j', stateChar, re);
            stateChar = false;
          continue

          case ')':
            if (inClass || !patternListStack.length) {
              re += '\\)';
              continue
            }

            clearStateChar();
            hasMagic = true;
            var pl = patternListStack.pop();
            // negation is (?:(?!js)[^/]*)
            // The others are (?:<pattern>)<type>
            re += pl.close;
            if (pl.type === '!') {
              negativeLists.push(pl);
            }
            pl.reEnd = re.length;
          continue

          case '|':
            if (inClass || !patternListStack.length || escaping) {
              re += '\\|';
              escaping = false;
              continue
            }

            clearStateChar();
            re += '|';
          continue

          // these are mostly the same in regexp and glob
          case '[':
            // swallow any state-tracking char before the [
            clearStateChar();

            if (inClass) {
              re += '\\' + c;
              continue
            }

            inClass = true;
            classStart = i;
            reClassStart = re.length;
            re += c;
          continue

          case ']':
            //  a right bracket shall lose its special
            //  meaning and represent itself in
            //  a bracket expression if it occurs
            //  first in the list.  -- POSIX.2 2.8.3.2
            if (i === classStart + 1 || !inClass) {
              re += '\\' + c;
              escaping = false;
              continue
            }

            // handle the case where we left a class open.
            // "[z-a]" is valid, equivalent to "\[z-a\]"
            if (inClass) {
              // split where the last [ was, make sure we don't have
              // an invalid re. if so, re-walk the contents of the
              // would-be class to re-translate any characters that
              // were passed through as-is
              // TODO: It would probably be faster to determine this
              // without a try/catch and a new RegExp, but it's tricky
              // to do safely.  For now, this is safe and works.
              var cs = pattern.substring(classStart + 1, i);
              try {
                RegExp('[' + cs + ']');
              } catch (er) {
                // not a valid class!
                var sp = this.parse(cs, SUBPARSE);
                re = re.substr(0, reClassStart) + '\\[' + sp[0] + '\\]';
                hasMagic = hasMagic || sp[1];
                inClass = false;
                continue
              }
            }

            // finish up the class.
            hasMagic = true;
            inClass = false;
            re += c;
          continue

          default:
            // swallow any state char that wasn't consumed
            clearStateChar();

            if (escaping) {
              // no need
              escaping = false;
            } else if (reSpecials[c]
              && !(c === '^' && inClass)) {
              re += '\\';
            }

            re += c;

        } // switch
      } // for

      // handle the case where we left a class open.
      // "[abc" is valid, equivalent to "\[abc"
      if (inClass) {
        // split where the last [ was, and escape it
        // this is a huge pita.  We now have to re-walk
        // the contents of the would-be class to re-translate
        // any characters that were passed through as-is
        cs = pattern.substr(classStart + 1);
        sp = this.parse(cs, SUBPARSE);
        re = re.substr(0, reClassStart) + '\\[' + sp[0];
        hasMagic = hasMagic || sp[1];
      }

      // handle the case where we had a +( thing at the *end*
      // of the pattern.
      // each pattern list stack adds 3 chars, and we need to go through
      // and escape any | chars that were passed through as-is for the regexp.
      // Go through and escape them, taking care not to double-escape any
      // | chars that were already escaped.
      for (pl = patternListStack.pop(); pl; pl = patternListStack.pop()) {
        var tail = re.slice(pl.reStart + pl.open.length);
        this.debug('setting tail', re, pl);
        // maybe some even number of \, then maybe 1 \, followed by a |
        tail = tail.replace(/((?:\\{2}){0,64})(\\?)\|/g, function (_, $1, $2) {
          if (!$2) {
            // the | isn't already escaped, so escape it.
            $2 = '\\';
          }

          // need to escape all those slashes *again*, without escaping the
          // one that we need for escaping the | character.  As it works out,
          // escaping an even number of slashes can be done by simply repeating
          // it exactly after itself.  That's why this trick works.
          //
          // I am sorry that you have to see this.
          return $1 + $1 + $2 + '|'
        });

        this.debug('tail=%j\n   %s', tail, tail, pl, re);
        var t = pl.type === '*' ? star
          : pl.type === '?' ? qmark
          : '\\' + pl.type;

        hasMagic = true;
        re = re.slice(0, pl.reStart) + t + '\\(' + tail;
      }

      // handle trailing things that only matter at the very end.
      clearStateChar();
      if (escaping) {
        // trailing \\
        re += '\\\\';
      }

      // only need to apply the nodot start if the re starts with
      // something that could conceivably capture a dot
      var addPatternStart = false;
      switch (re.charAt(0)) {
        case '.':
        case '[':
        case '(': addPatternStart = true;
      }

      // Hack to work around lack of negative lookbehind in JS
      // A pattern like: *.!(x).!(y|z) needs to ensure that a name
      // like 'a.xyz.yz' doesn't match.  So, the first negative
      // lookahead, has to look ALL the way ahead, to the end of
      // the pattern.
      for (var n = negativeLists.length - 1; n > -1; n--) {
        var nl = negativeLists[n];

        var nlBefore = re.slice(0, nl.reStart);
        var nlFirst = re.slice(nl.reStart, nl.reEnd - 8);
        var nlLast = re.slice(nl.reEnd - 8, nl.reEnd);
        var nlAfter = re.slice(nl.reEnd);

        nlLast += nlAfter;

        // Handle nested stuff like *(*.js|!(*.json)), where open parens
        // mean that we should *not* include the ) in the bit that is considered
        // "after" the negated section.
        var openParensBefore = nlBefore.split('(').length - 1;
        var cleanAfter = nlAfter;
        for (i = 0; i < openParensBefore; i++) {
          cleanAfter = cleanAfter.replace(/\)[+*?]?/, '');
        }
        nlAfter = cleanAfter;

        var dollar = '';
        if (nlAfter === '' && isSub !== SUBPARSE) {
          dollar = '$';
        }
        var newRe = nlBefore + nlFirst + nlAfter + dollar + nlLast;
        re = newRe;
      }

      // if the re is not "" at this point, then we need to make sure
      // it doesn't match against an empty path part.
      // Otherwise a/* will match a/, which it should not.
      if (re !== '' && hasMagic) {
        re = '(?=.)' + re;
      }

      if (addPatternStart) {
        re = patternStart + re;
      }

      // parsing just a piece of a larger pattern.
      if (isSub === SUBPARSE) {
        return [re, hasMagic]
      }

      // skip the regexp for non-magical patterns
      // unescape anything in it, though, so that it'll be
      // an exact match against a file etc.
      if (!hasMagic) {
        return globUnescape(pattern)
      }

      var flags = options.nocase ? 'i' : '';
      try {
        var regExp = new RegExp('^' + re + '$', flags);
      } catch (er) {
        // If it was an invalid regular expression, then it can't match
        // anything.  This trick looks for a character after the end of
        // the string, which is of course impossible, except in multi-line
        // mode, but it's not a /m regex.
        return new RegExp('$.')
      }

      regExp._glob = pattern;
      regExp._src = re;

      return regExp
    }

    minimatch$3.makeRe = function (pattern, options) {
      return new Minimatch$1(pattern, options || {}).makeRe()
    };

    Minimatch$1.prototype.makeRe = makeRe;
    function makeRe () {
      if (this.regexp || this.regexp === false) return this.regexp

      // at this point, this.set is a 2d array of partial
      // pattern strings, or "**".
      //
      // It's better to use .match().  This function shouldn't
      // be used, really, but it's pretty convenient sometimes,
      // when you just want to work with a regex.
      var set = this.set;

      if (!set.length) {
        this.regexp = false;
        return this.regexp
      }
      var options = this.options;

      var twoStar = options.noglobstar ? star
        : options.dot ? twoStarDot
        : twoStarNoDot;
      var flags = options.nocase ? 'i' : '';

      var re = set.map(function (pattern) {
        return pattern.map(function (p) {
          return (p === GLOBSTAR) ? twoStar
          : (typeof p === 'string') ? regExpEscape(p)
          : p._src
        }).join('\\\/')
      }).join('|');

      // must match entire pattern
      // ending in a * or ** will make it less strict.
      re = '^(?:' + re + ')$';

      // can match anything, as long as it's not this.
      if (this.negate) re = '^(?!' + re + ').*$';

      try {
        this.regexp = new RegExp(re, flags);
      } catch (ex) {
        this.regexp = false;
      }
      return this.regexp
    }

    minimatch$3.match = function (list, pattern, options) {
      options = options || {};
      var mm = new Minimatch$1(pattern, options);
      list = list.filter(function (f) {
        return mm.match(f)
      });
      if (mm.options.nonull && !list.length) {
        list.push(pattern);
      }
      return list
    };

    Minimatch$1.prototype.match = match;
    function match (f, partial) {
      this.debug('match', f, this.pattern);
      // short-circuit in the case of busted things.
      // comments, etc.
      if (this.comment) return false
      if (this.empty) return f === ''

      if (f === '/' && partial) return true

      var options = this.options;

      // windows: need to use /, not \
      if (path$3.sep !== '/') {
        f = f.split(path$3.sep).join('/');
      }

      // treat the test path as a set of pathparts.
      f = f.split(slashSplit);
      this.debug(this.pattern, 'split', f);

      // just ONE of the pattern sets in this.set needs to match
      // in order for it to be valid.  If negating, then just one
      // match means that we have failed.
      // Either way, return on the first hit.

      var set = this.set;
      this.debug(this.pattern, 'set', set);

      // Find the basename of the path by looking for the last non-empty segment
      var filename;
      var i;
      for (i = f.length - 1; i >= 0; i--) {
        filename = f[i];
        if (filename) break
      }

      for (i = 0; i < set.length; i++) {
        var pattern = set[i];
        var file = f;
        if (options.matchBase && pattern.length === 1) {
          file = [filename];
        }
        var hit = this.matchOne(file, pattern, partial);
        if (hit) {
          if (options.flipNegate) return true
          return !this.negate
        }
      }

      // didn't get any hits.  this is success if it's a negative
      // pattern, failure otherwise.
      if (options.flipNegate) return false
      return this.negate
    }

    // set partial to true to test if, for example,
    // "/a/b" matches the start of "/*/b/*/d"
    // Partial means, if you run out of file before you run
    // out of pattern, then that's fine, as long as all
    // the parts match.
    Minimatch$1.prototype.matchOne = function (file, pattern, partial) {
      var options = this.options;

      this.debug('matchOne',
        { 'this': this, file: file, pattern: pattern });

      this.debug('matchOne', file.length, pattern.length);

      for (var fi = 0,
          pi = 0,
          fl = file.length,
          pl = pattern.length
          ; (fi < fl) && (pi < pl)
          ; fi++, pi++) {
        this.debug('matchOne loop');
        var p = pattern[pi];
        var f = file[fi];

        this.debug(pattern, p, f);

        // should be impossible.
        // some invalid regexp stuff in the set.
        if (p === false) return false

        if (p === GLOBSTAR) {
          this.debug('GLOBSTAR', [pattern, p, f]);

          // "**"
          // a/**/b/**/c would match the following:
          // a/b/x/y/z/c
          // a/x/y/z/b/c
          // a/b/x/b/x/c
          // a/b/c
          // To do this, take the rest of the pattern after
          // the **, and see if it would match the file remainder.
          // If so, return success.
          // If not, the ** "swallows" a segment, and try again.
          // This is recursively awful.
          //
          // a/**/b/**/c matching a/b/x/y/z/c
          // - a matches a
          // - doublestar
          //   - matchOne(b/x/y/z/c, b/**/c)
          //     - b matches b
          //     - doublestar
          //       - matchOne(x/y/z/c, c) -> no
          //       - matchOne(y/z/c, c) -> no
          //       - matchOne(z/c, c) -> no
          //       - matchOne(c, c) yes, hit
          var fr = fi;
          var pr = pi + 1;
          if (pr === pl) {
            this.debug('** at the end');
            // a ** at the end will just swallow the rest.
            // We have found a match.
            // however, it will not swallow /.x, unless
            // options.dot is set.
            // . and .. are *never* matched by **, for explosively
            // exponential reasons.
            for (; fi < fl; fi++) {
              if (file[fi] === '.' || file[fi] === '..' ||
                (!options.dot && file[fi].charAt(0) === '.')) return false
            }
            return true
          }

          // ok, let's see if we can swallow whatever we can.
          while (fr < fl) {
            var swallowee = file[fr];

            this.debug('\nglobstar while', file, fr, pattern, pr, swallowee);

            // XXX remove this slice.  Just pass the start index.
            if (this.matchOne(file.slice(fr), pattern.slice(pr), partial)) {
              this.debug('globstar found match!', fr, fl, swallowee);
              // found a match.
              return true
            } else {
              // can't swallow "." or ".." ever.
              // can only swallow ".foo" when explicitly asked.
              if (swallowee === '.' || swallowee === '..' ||
                (!options.dot && swallowee.charAt(0) === '.')) {
                this.debug('dot detected!', file, fr, pattern, pr);
                break
              }

              // ** swallows a segment, and continue.
              this.debug('globstar swallow a segment, and continue');
              fr++;
            }
          }

          // no match was found.
          // However, in partial mode, we can't say this is necessarily over.
          // If there's more *pattern* left, then
          if (partial) {
            // ran out of file
            this.debug('\n>>> no match, partial?', file, fr, pattern, pr);
            if (fr === fl) return true
          }
          return false
        }

        // something other than **
        // non-magic patterns just have to match exactly
        // patterns with magic have been turned into regexps.
        var hit;
        if (typeof p === 'string') {
          if (options.nocase) {
            hit = f.toLowerCase() === p.toLowerCase();
          } else {
            hit = f === p;
          }
          this.debug('string match', p, f, hit);
        } else {
          hit = f.match(p);
          this.debug('pattern match', p, f, hit);
        }

        if (!hit) return false
      }

      // Note: ending in / means that we'll get a final ""
      // at the end of the pattern.  This can only match a
      // corresponding "" at the end of the file.
      // If the file ends in /, then it can only match a
      // a pattern that ends in /, unless the pattern just
      // doesn't have any more for it. But, a/b/ should *not*
      // match "a/b/*", even though "" matches against the
      // [^/]*? pattern, except in partial mode, where it might
      // simply not be reached yet.
      // However, a/b/ should still satisfy a/*

      // now either we fell off the end of the pattern, or we're done.
      if (fi === fl && pi === pl) {
        // ran out of pattern and filename at the same time.
        // an exact hit!
        return true
      } else if (fi === fl) {
        // ran out of file, but still had pattern left.
        // this is ok if we're doing the match as part of
        // a glob fs traversal.
        return partial
      } else if (pi === pl) {
        // ran out of pattern, still have file left.
        // this is only acceptable if we're on the very last
        // empty segment of a file with a trailing slash.
        // a/* should match a/b/
        var emptyFileEnd = (fi === fl - 1) && (file[fi] === '');
        return emptyFileEnd
      }

      // should be unreachable.
      throw new Error('wtf?')
    };

    // replace stuff like \* with *
    function globUnescape (s) {
      return s.replace(/\\(.)/g, '$1')
    }

    function regExpEscape (s) {
      return s.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')
    }

    var inherits$1 = {exports: {}};

    var inherits_browser = {exports: {}};

    if (typeof Object.create === 'function') {
      // implementation from standard node.js 'util' module
      inherits_browser.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          ctor.prototype = Object.create(superCtor.prototype, {
            constructor: {
              value: ctor,
              enumerable: false,
              writable: true,
              configurable: true
            }
          });
        }
      };
    } else {
      // old school shim for old browsers
      inherits_browser.exports = function inherits(ctor, superCtor) {
        if (superCtor) {
          ctor.super_ = superCtor;
          var TempCtor = function () {};
          TempCtor.prototype = superCtor.prototype;
          ctor.prototype = new TempCtor();
          ctor.prototype.constructor = ctor;
        }
      };
    }

    try {
      var util = util__default['default'];
      /* istanbul ignore next */
      if (typeof util.inherits !== 'function') throw '';
      inherits$1.exports = util.inherits;
    } catch (e) {
      /* istanbul ignore next */
      inherits$1.exports = inherits_browser.exports;
    }

    var pathIsAbsolute = {exports: {}};

    function posix(path) {
    	return path.charAt(0) === '/';
    }

    function win32(path) {
    	// https://github.com/nodejs/node/blob/b3fcc245fb25539909ef1d5eaa01dbf92e168633/lib/path.js#L56
    	var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/;
    	var result = splitDeviceRe.exec(path);
    	var device = result[1] || '';
    	var isUnc = Boolean(device && device.charAt(1) !== ':');

    	// UNC paths are always absolute
    	return Boolean(result[2] || isUnc);
    }

    pathIsAbsolute.exports = process.platform === 'win32' ? win32 : posix;
    pathIsAbsolute.exports.posix = posix;
    pathIsAbsolute.exports.win32 = win32;

    var common$2 = {};

    common$2.setopts = setopts$2;
    common$2.ownProp = ownProp$2;
    common$2.makeAbs = makeAbs;
    common$2.finish = finish;
    common$2.mark = mark;
    common$2.isIgnored = isIgnored$2;
    common$2.childrenIgnored = childrenIgnored$2;

    function ownProp$2 (obj, field) {
      return Object.prototype.hasOwnProperty.call(obj, field)
    }

    var path$2 = require$$0__default['default'];
    var minimatch$2 = minimatch_1;
    var isAbsolute$2 = pathIsAbsolute.exports;
    var Minimatch = minimatch$2.Minimatch;

    function alphasort (a, b) {
      return a.localeCompare(b, 'en')
    }

    function setupIgnores (self, options) {
      self.ignore = options.ignore || [];

      if (!Array.isArray(self.ignore))
        self.ignore = [self.ignore];

      if (self.ignore.length) {
        self.ignore = self.ignore.map(ignoreMap);
      }
    }

    // ignore patterns are always in dot:true mode.
    function ignoreMap (pattern) {
      var gmatcher = null;
      if (pattern.slice(-3) === '/**') {
        var gpattern = pattern.replace(/(\/\*\*)+$/, '');
        gmatcher = new Minimatch(gpattern, { dot: true });
      }

      return {
        matcher: new Minimatch(pattern, { dot: true }),
        gmatcher: gmatcher
      }
    }

    function setopts$2 (self, pattern, options) {
      if (!options)
        options = {};

      // base-matching: just use globstar for that.
      if (options.matchBase && -1 === pattern.indexOf("/")) {
        if (options.noglobstar) {
          throw new Error("base matching requires globstar")
        }
        pattern = "**/" + pattern;
      }

      self.silent = !!options.silent;
      self.pattern = pattern;
      self.strict = options.strict !== false;
      self.realpath = !!options.realpath;
      self.realpathCache = options.realpathCache || Object.create(null);
      self.follow = !!options.follow;
      self.dot = !!options.dot;
      self.mark = !!options.mark;
      self.nodir = !!options.nodir;
      if (self.nodir)
        self.mark = true;
      self.sync = !!options.sync;
      self.nounique = !!options.nounique;
      self.nonull = !!options.nonull;
      self.nosort = !!options.nosort;
      self.nocase = !!options.nocase;
      self.stat = !!options.stat;
      self.noprocess = !!options.noprocess;
      self.absolute = !!options.absolute;

      self.maxLength = options.maxLength || Infinity;
      self.cache = options.cache || Object.create(null);
      self.statCache = options.statCache || Object.create(null);
      self.symlinks = options.symlinks || Object.create(null);

      setupIgnores(self, options);

      self.changedCwd = false;
      var cwd = process.cwd();
      if (!ownProp$2(options, "cwd"))
        self.cwd = cwd;
      else {
        self.cwd = path$2.resolve(options.cwd);
        self.changedCwd = self.cwd !== cwd;
      }

      self.root = options.root || path$2.resolve(self.cwd, "/");
      self.root = path$2.resolve(self.root);
      if (process.platform === "win32")
        self.root = self.root.replace(/\\/g, "/");

      // TODO: is an absolute `cwd` supposed to be resolved against `root`?
      // e.g. { cwd: '/test', root: __dirname } === path.join(__dirname, '/test')
      self.cwdAbs = isAbsolute$2(self.cwd) ? self.cwd : makeAbs(self, self.cwd);
      if (process.platform === "win32")
        self.cwdAbs = self.cwdAbs.replace(/\\/g, "/");
      self.nomount = !!options.nomount;

      // disable comments and negation in Minimatch.
      // Note that they are not supported in Glob itself anyway.
      options.nonegate = true;
      options.nocomment = true;

      self.minimatch = new Minimatch(pattern, options);
      self.options = self.minimatch.options;
    }

    function finish (self) {
      var nou = self.nounique;
      var all = nou ? [] : Object.create(null);

      for (var i = 0, l = self.matches.length; i < l; i ++) {
        var matches = self.matches[i];
        if (!matches || Object.keys(matches).length === 0) {
          if (self.nonull) {
            // do like the shell, and spit out the literal glob
            var literal = self.minimatch.globSet[i];
            if (nou)
              all.push(literal);
            else
              all[literal] = true;
          }
        } else {
          // had matches
          var m = Object.keys(matches);
          if (nou)
            all.push.apply(all, m);
          else
            m.forEach(function (m) {
              all[m] = true;
            });
        }
      }

      if (!nou)
        all = Object.keys(all);

      if (!self.nosort)
        all = all.sort(alphasort);

      // at *some* point we statted all of these
      if (self.mark) {
        for (var i = 0; i < all.length; i++) {
          all[i] = self._mark(all[i]);
        }
        if (self.nodir) {
          all = all.filter(function (e) {
            var notDir = !(/\/$/.test(e));
            var c = self.cache[e] || self.cache[makeAbs(self, e)];
            if (notDir && c)
              notDir = c !== 'DIR' && !Array.isArray(c);
            return notDir
          });
        }
      }

      if (self.ignore.length)
        all = all.filter(function(m) {
          return !isIgnored$2(self, m)
        });

      self.found = all;
    }

    function mark (self, p) {
      var abs = makeAbs(self, p);
      var c = self.cache[abs];
      var m = p;
      if (c) {
        var isDir = c === 'DIR' || Array.isArray(c);
        var slash = p.slice(-1) === '/';

        if (isDir && !slash)
          m += '/';
        else if (!isDir && slash)
          m = m.slice(0, -1);

        if (m !== p) {
          var mabs = makeAbs(self, m);
          self.statCache[mabs] = self.statCache[abs];
          self.cache[mabs] = self.cache[abs];
        }
      }

      return m
    }

    // lotta situps...
    function makeAbs (self, f) {
      var abs = f;
      if (f.charAt(0) === '/') {
        abs = path$2.join(self.root, f);
      } else if (isAbsolute$2(f) || f === '') {
        abs = f;
      } else if (self.changedCwd) {
        abs = path$2.resolve(self.cwd, f);
      } else {
        abs = path$2.resolve(f);
      }

      if (process.platform === 'win32')
        abs = abs.replace(/\\/g, '/');

      return abs
    }


    // Return true, if pattern ends with globstar '**', for the accompanying parent directory.
    // Ex:- If node_modules/** is the pattern, add 'node_modules' to ignore list along with it's contents
    function isIgnored$2 (self, path) {
      if (!self.ignore.length)
        return false

      return self.ignore.some(function(item) {
        return item.matcher.match(path) || !!(item.gmatcher && item.gmatcher.match(path))
      })
    }

    function childrenIgnored$2 (self, path) {
      if (!self.ignore.length)
        return false

      return self.ignore.some(function(item) {
        return !!(item.gmatcher && item.gmatcher.match(path))
      })
    }

    var sync = globSync$1;
    globSync$1.GlobSync = GlobSync$1;

    var fs$1 = fs__default['default'];
    var rp$1 = fs_realpath;
    var minimatch$1 = minimatch_1;
    var path$1 = require$$0__default['default'];
    var assert$1 = require$$6__default['default'];
    var isAbsolute$1 = pathIsAbsolute.exports;
    var common$1 = common$2;
    var setopts$1 = common$1.setopts;
    var ownProp$1 = common$1.ownProp;
    var childrenIgnored$1 = common$1.childrenIgnored;
    var isIgnored$1 = common$1.isIgnored;

    function globSync$1 (pattern, options) {
      if (typeof options === 'function' || arguments.length === 3)
        throw new TypeError('callback provided to sync glob\n'+
                            'See: https://github.com/isaacs/node-glob/issues/167')

      return new GlobSync$1(pattern, options).found
    }

    function GlobSync$1 (pattern, options) {
      if (!pattern)
        throw new Error('must provide pattern')

      if (typeof options === 'function' || arguments.length === 3)
        throw new TypeError('callback provided to sync glob\n'+
                            'See: https://github.com/isaacs/node-glob/issues/167')

      if (!(this instanceof GlobSync$1))
        return new GlobSync$1(pattern, options)

      setopts$1(this, pattern, options);

      if (this.noprocess)
        return this

      var n = this.minimatch.set.length;
      this.matches = new Array(n);
      for (var i = 0; i < n; i ++) {
        this._process(this.minimatch.set[i], i, false);
      }
      this._finish();
    }

    GlobSync$1.prototype._finish = function () {
      assert$1(this instanceof GlobSync$1);
      if (this.realpath) {
        var self = this;
        this.matches.forEach(function (matchset, index) {
          var set = self.matches[index] = Object.create(null);
          for (var p in matchset) {
            try {
              p = self._makeAbs(p);
              var real = rp$1.realpathSync(p, self.realpathCache);
              set[real] = true;
            } catch (er) {
              if (er.syscall === 'stat')
                set[self._makeAbs(p)] = true;
              else
                throw er
            }
          }
        });
      }
      common$1.finish(this);
    };


    GlobSync$1.prototype._process = function (pattern, index, inGlobStar) {
      assert$1(this instanceof GlobSync$1);

      // Get the first [n] parts of pattern that are all strings.
      var n = 0;
      while (typeof pattern[n] === 'string') {
        n ++;
      }
      // now n is the index of the first one that is *not* a string.

      // See if there's anything else
      var prefix;
      switch (n) {
        // if not, then this is rather simple
        case pattern.length:
          this._processSimple(pattern.join('/'), index);
          return

        case 0:
          // pattern *starts* with some non-trivial item.
          // going to readdir(cwd), but not include the prefix in matches.
          prefix = null;
          break

        default:
          // pattern has some string bits in the front.
          // whatever it starts with, whether that's 'absolute' like /foo/bar,
          // or 'relative' like '../baz'
          prefix = pattern.slice(0, n).join('/');
          break
      }

      var remain = pattern.slice(n);

      // get the list of entries.
      var read;
      if (prefix === null)
        read = '.';
      else if (isAbsolute$1(prefix) || isAbsolute$1(pattern.join('/'))) {
        if (!prefix || !isAbsolute$1(prefix))
          prefix = '/' + prefix;
        read = prefix;
      } else
        read = prefix;

      var abs = this._makeAbs(read);

      //if ignored, skip processing
      if (childrenIgnored$1(this, read))
        return

      var isGlobStar = remain[0] === minimatch$1.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar);
    };


    GlobSync$1.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar) {
      var entries = this._readdir(abs, inGlobStar);

      // if the abs isn't a dir, then nothing can match!
      if (!entries)
        return

      // It will only match dot entries if it starts with a dot, or if
      // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === '.';

      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== '.' || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }

      var len = matchedEntries.length;
      // If there are no matched entries, then nothing matches.
      if (len === 0)
        return

      // if this is the last remaining pattern bit, then no need for
      // an additional stat *unless* the user has specified mark or
      // stat explicitly.  We know they exist, since readdir returned
      // them.

      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = Object.create(null);

        for (var i = 0; i < len; i ++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix.slice(-1) !== '/')
              e = prefix + '/' + e;
            else
              e = prefix + e;
          }

          if (e.charAt(0) === '/' && !this.nomount) {
            e = path$1.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        // This was the last one, and no stats were needed
        return
      }

      // now test all matched entries as stand-ins for that part
      // of the pattern.
      remain.shift();
      for (var i = 0; i < len; i ++) {
        var e = matchedEntries[i];
        var newPattern;
        if (prefix)
          newPattern = [prefix, e];
        else
          newPattern = [e];
        this._process(newPattern.concat(remain), index, inGlobStar);
      }
    };


    GlobSync$1.prototype._emitMatch = function (index, e) {
      if (isIgnored$1(this, e))
        return

      var abs = this._makeAbs(e);

      if (this.mark)
        e = this._mark(e);

      if (this.absolute) {
        e = abs;
      }

      if (this.matches[index][e])
        return

      if (this.nodir) {
        var c = this.cache[abs];
        if (c === 'DIR' || Array.isArray(c))
          return
      }

      this.matches[index][e] = true;

      if (this.stat)
        this._stat(e);
    };


    GlobSync$1.prototype._readdirInGlobStar = function (abs) {
      // follow all symlinked directories forever
      // just proceed as if this is a non-globstar situation
      if (this.follow)
        return this._readdir(abs, false)

      var entries;
      var lstat;
      try {
        lstat = fs$1.lstatSync(abs);
      } catch (er) {
        if (er.code === 'ENOENT') {
          // lstat failed, doesn't exist
          return null
        }
      }

      var isSym = lstat && lstat.isSymbolicLink();
      this.symlinks[abs] = isSym;

      // If it's not a symlink or a dir, then it's definitely a regular file.
      // don't bother doing a readdir in that case.
      if (!isSym && lstat && !lstat.isDirectory())
        this.cache[abs] = 'FILE';
      else
        entries = this._readdir(abs, false);

      return entries
    };

    GlobSync$1.prototype._readdir = function (abs, inGlobStar) {

      if (inGlobStar && !ownProp$1(this.symlinks, abs))
        return this._readdirInGlobStar(abs)

      if (ownProp$1(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === 'FILE')
          return null

        if (Array.isArray(c))
          return c
      }

      try {
        return this._readdirEntries(abs, fs$1.readdirSync(abs))
      } catch (er) {
        this._readdirError(abs, er);
        return null
      }
    };

    GlobSync$1.prototype._readdirEntries = function (abs, entries) {
      // if we haven't asked to stat everything, then just
      // assume that everything in there exists, so we can avoid
      // having to stat it a second time.
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i ++) {
          var e = entries[i];
          if (abs === '/')
            e = abs + e;
          else
            e = abs + '/' + e;
          this.cache[e] = true;
        }
      }

      this.cache[abs] = entries;

      // mark and cache dir-ness
      return entries
    };

    GlobSync$1.prototype._readdirError = function (f, er) {
      // handle errors, and cache the information
      switch (er.code) {
        case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
        case 'ENOTDIR': // totally normal. means it *does* exist.
          var abs = this._makeAbs(f);
          this.cache[abs] = 'FILE';
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + ' invalid cwd ' + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            throw error
          }
          break

        case 'ENOENT': // not terribly unusual
        case 'ELOOP':
        case 'ENAMETOOLONG':
        case 'UNKNOWN':
          this.cache[this._makeAbs(f)] = false;
          break

        default: // some unusual error.  Treat as failure.
          this.cache[this._makeAbs(f)] = false;
          if (this.strict)
            throw er
          if (!this.silent)
            console.error('glob error', er);
          break
      }
    };

    GlobSync$1.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar) {

      var entries = this._readdir(abs, inGlobStar);

      // no entries means not a dir, so it can never have matches
      // foo.txt/** doesn't match foo.txt
      if (!entries)
        return

      // test without the globstar, and with every child both below
      // and replacing the globstar.
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [ prefix ] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);

      // the noGlobStar pattern exits the inGlobStar state
      this._process(noGlobStar, index, false);

      var len = entries.length;
      var isSym = this.symlinks[abs];

      // If it's a symlink, and we're in a globstar, then stop
      if (isSym && inGlobStar)
        return

      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === '.' && !this.dot)
          continue

        // these two cases enter the inGlobStar state
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true);

        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true);
      }
    };

    GlobSync$1.prototype._processSimple = function (prefix, index) {
      // XXX review this.  Shouldn't it be doing the mounting etc
      // before doing stat?  kinda weird?
      var exists = this._stat(prefix);

      if (!this.matches[index])
        this.matches[index] = Object.create(null);

      // If it doesn't exist, then just mark the lack of results
      if (!exists)
        return

      if (prefix && isAbsolute$1(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === '/') {
          prefix = path$1.join(this.root, prefix);
        } else {
          prefix = path$1.resolve(this.root, prefix);
          if (trail)
            prefix += '/';
        }
      }

      if (process.platform === 'win32')
        prefix = prefix.replace(/\\/g, '/');

      // Mark this as a match
      this._emitMatch(index, prefix);
    };

    // Returns either 'DIR', 'FILE', or false
    GlobSync$1.prototype._stat = function (f) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === '/';

      if (f.length > this.maxLength)
        return false

      if (!this.stat && ownProp$1(this.cache, abs)) {
        var c = this.cache[abs];

        if (Array.isArray(c))
          c = 'DIR';

        // It exists, but maybe not how we need it
        if (!needDir || c === 'DIR')
          return c

        if (needDir && c === 'FILE')
          return false

        // otherwise we have to stat, because maybe c=true
        // if we know it exists, but not what it is.
      }
      var stat = this.statCache[abs];
      if (!stat) {
        var lstat;
        try {
          lstat = fs$1.lstatSync(abs);
        } catch (er) {
          if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
            this.statCache[abs] = false;
            return false
          }
        }

        if (lstat && lstat.isSymbolicLink()) {
          try {
            stat = fs$1.statSync(abs);
          } catch (er) {
            stat = lstat;
          }
        } else {
          stat = lstat;
        }
      }

      this.statCache[abs] = stat;

      var c = true;
      if (stat)
        c = stat.isDirectory() ? 'DIR' : 'FILE';

      this.cache[abs] = this.cache[abs] || c;

      if (needDir && c === 'FILE')
        return false

      return c
    };

    GlobSync$1.prototype._mark = function (p) {
      return common$1.mark(this, p)
    };

    GlobSync$1.prototype._makeAbs = function (f) {
      return common$1.makeAbs(this, f)
    };

    // Returns a wrapper function that returns a wrapped callback
    // The wrapper function should do some stuff, and return a
    // presumably different callback function.
    // This makes sure that own properties are retained, so that
    // decorations and such are not lost along the way.
    var wrappy_1 = wrappy$2;
    function wrappy$2 (fn, cb) {
      if (fn && cb) return wrappy$2(fn)(cb)

      if (typeof fn !== 'function')
        throw new TypeError('need wrapper function')

      Object.keys(fn).forEach(function (k) {
        wrapper[k] = fn[k];
      });

      return wrapper

      function wrapper() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        var ret = fn.apply(this, args);
        var cb = args[args.length-1];
        if (typeof ret === 'function' && ret !== cb) {
          Object.keys(cb).forEach(function (k) {
            ret[k] = cb[k];
          });
        }
        return ret
      }
    }

    var once$3 = {exports: {}};

    var wrappy$1 = wrappy_1;
    once$3.exports = wrappy$1(once$2);
    once$3.exports.strict = wrappy$1(onceStrict);

    once$2.proto = once$2(function () {
      Object.defineProperty(Function.prototype, 'once', {
        value: function () {
          return once$2(this)
        },
        configurable: true
      });

      Object.defineProperty(Function.prototype, 'onceStrict', {
        value: function () {
          return onceStrict(this)
        },
        configurable: true
      });
    });

    function once$2 (fn) {
      var f = function () {
        if (f.called) return f.value
        f.called = true;
        return f.value = fn.apply(this, arguments)
      };
      f.called = false;
      return f
    }

    function onceStrict (fn) {
      var f = function () {
        if (f.called)
          throw new Error(f.onceError)
        f.called = true;
        return f.value = fn.apply(this, arguments)
      };
      var name = fn.name || 'Function wrapped with `once`';
      f.onceError = name + " shouldn't be called more than once";
      f.called = false;
      return f
    }

    var wrappy = wrappy_1;
    var reqs = Object.create(null);
    var once$1 = once$3.exports;

    var inflight_1 = wrappy(inflight$1);

    function inflight$1 (key, cb) {
      if (reqs[key]) {
        reqs[key].push(cb);
        return null
      } else {
        reqs[key] = [cb];
        return makeres(key)
      }
    }

    function makeres (key) {
      return once$1(function RES () {
        var cbs = reqs[key];
        var len = cbs.length;
        var args = slice(arguments);

        // XXX It's somewhat ambiguous whether a new callback added in this
        // pass should be queued for later execution if something in the
        // list of callbacks throws, or if it should just be discarded.
        // However, it's such an edge case that it hardly matters, and either
        // choice is likely as surprising as the other.
        // As it happens, we do go ahead and schedule it for later execution.
        try {
          for (var i = 0; i < len; i++) {
            cbs[i].apply(null, args);
          }
        } finally {
          if (cbs.length > len) {
            // added more in the interim.
            // de-zalgo, just in case, but don't call again.
            cbs.splice(0, len);
            process.nextTick(function () {
              RES.apply(null, args);
            });
          } else {
            delete reqs[key];
          }
        }
      })
    }

    function slice (args) {
      var length = args.length;
      var array = [];

      for (var i = 0; i < length; i++) array[i] = args[i];
      return array
    }

    // Approach:
    //
    // 1. Get the minimatch set
    // 2. For each pattern in the set, PROCESS(pattern, false)
    // 3. Store matches per-set, then uniq them
    //
    // PROCESS(pattern, inGlobStar)
    // Get the first [n] items from pattern that are all strings
    // Join these together.  This is PREFIX.
    //   If there is no more remaining, then stat(PREFIX) and
    //   add to matches if it succeeds.  END.
    //
    // If inGlobStar and PREFIX is symlink and points to dir
    //   set ENTRIES = []
    // else readdir(PREFIX) as ENTRIES
    //   If fail, END
    //
    // with ENTRIES
    //   If pattern[n] is GLOBSTAR
    //     // handle the case where the globstar match is empty
    //     // by pruning it out, and testing the resulting pattern
    //     PROCESS(pattern[0..n] + pattern[n+1 .. $], false)
    //     // handle other cases.
    //     for ENTRY in ENTRIES (not dotfiles)
    //       // attach globstar + tail onto the entry
    //       // Mark that this entry is a globstar match
    //       PROCESS(pattern[0..n] + ENTRY + pattern[n .. $], true)
    //
    //   else // not globstar
    //     for ENTRY in ENTRIES (not dotfiles, unless pattern[n] is dot)
    //       Test ENTRY against pattern[n]
    //       If fails, continue
    //       If passes, PROCESS(pattern[0..n] + item + pattern[n+1 .. $])
    //
    // Caveat:
    //   Cache all stats and readdirs results to minimize syscall.  Since all
    //   we ever care about is existence and directory-ness, we can just keep
    //   `true` for files, and [children,...] for directories, or `false` for
    //   things that don't exist.

    var glob_1 = glob;

    var fs = fs__default['default'];
    var rp = fs_realpath;
    var minimatch = minimatch_1;
    var inherits = inherits$1.exports;
    var EE = require$$4__default['default'].EventEmitter;
    var path = require$$0__default['default'];
    var assert = require$$6__default['default'];
    var isAbsolute = pathIsAbsolute.exports;
    var globSync = sync;
    var common = common$2;
    var setopts = common.setopts;
    var ownProp = common.ownProp;
    var inflight = inflight_1;
    var childrenIgnored = common.childrenIgnored;
    var isIgnored = common.isIgnored;

    var once = once$3.exports;

    function glob (pattern, options, cb) {
      if (typeof options === 'function') cb = options, options = {};
      if (!options) options = {};

      if (options.sync) {
        if (cb)
          throw new TypeError('callback provided to sync glob')
        return globSync(pattern, options)
      }

      return new Glob(pattern, options, cb)
    }

    glob.sync = globSync;
    var GlobSync = glob.GlobSync = globSync.GlobSync;

    // old api surface
    glob.glob = glob;

    function extend (origin, add) {
      if (add === null || typeof add !== 'object') {
        return origin
      }

      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin
    }

    glob.hasMagic = function (pattern, options_) {
      var options = extend({}, options_);
      options.noprocess = true;

      var g = new Glob(pattern, options);
      var set = g.minimatch.set;

      if (!pattern)
        return false

      if (set.length > 1)
        return true

      for (var j = 0; j < set[0].length; j++) {
        if (typeof set[0][j] !== 'string')
          return true
      }

      return false
    };

    glob.Glob = Glob;
    inherits(Glob, EE);
    function Glob (pattern, options, cb) {
      if (typeof options === 'function') {
        cb = options;
        options = null;
      }

      if (options && options.sync) {
        if (cb)
          throw new TypeError('callback provided to sync glob')
        return new GlobSync(pattern, options)
      }

      if (!(this instanceof Glob))
        return new Glob(pattern, options, cb)

      setopts(this, pattern, options);
      this._didRealPath = false;

      // process each pattern in the minimatch set
      var n = this.minimatch.set.length;

      // The matches are stored as {<filename>: true,...} so that
      // duplicates are automagically pruned.
      // Later, we do an Object.keys() on these.
      // Keep them as a list so we can fill in when nonull is set.
      this.matches = new Array(n);

      if (typeof cb === 'function') {
        cb = once(cb);
        this.on('error', cb);
        this.on('end', function (matches) {
          cb(null, matches);
        });
      }

      var self = this;
      this._processing = 0;

      this._emitQueue = [];
      this._processQueue = [];
      this.paused = false;

      if (this.noprocess)
        return this

      if (n === 0)
        return done()

      var sync = true;
      for (var i = 0; i < n; i ++) {
        this._process(this.minimatch.set[i], i, false, done);
      }
      sync = false;

      function done () {
        --self._processing;
        if (self._processing <= 0) {
          if (sync) {
            process.nextTick(function () {
              self._finish();
            });
          } else {
            self._finish();
          }
        }
      }
    }

    Glob.prototype._finish = function () {
      assert(this instanceof Glob);
      if (this.aborted)
        return

      if (this.realpath && !this._didRealpath)
        return this._realpath()

      common.finish(this);
      this.emit('end', this.found);
    };

    Glob.prototype._realpath = function () {
      if (this._didRealpath)
        return

      this._didRealpath = true;

      var n = this.matches.length;
      if (n === 0)
        return this._finish()

      var self = this;
      for (var i = 0; i < this.matches.length; i++)
        this._realpathSet(i, next);

      function next () {
        if (--n === 0)
          self._finish();
      }
    };

    Glob.prototype._realpathSet = function (index, cb) {
      var matchset = this.matches[index];
      if (!matchset)
        return cb()

      var found = Object.keys(matchset);
      var self = this;
      var n = found.length;

      if (n === 0)
        return cb()

      var set = this.matches[index] = Object.create(null);
      found.forEach(function (p, i) {
        // If there's a problem with the stat, then it means that
        // one or more of the links in the realpath couldn't be
        // resolved.  just return the abs value in that case.
        p = self._makeAbs(p);
        rp.realpath(p, self.realpathCache, function (er, real) {
          if (!er)
            set[real] = true;
          else if (er.syscall === 'stat')
            set[p] = true;
          else
            self.emit('error', er); // srsly wtf right here

          if (--n === 0) {
            self.matches[index] = set;
            cb();
          }
        });
      });
    };

    Glob.prototype._mark = function (p) {
      return common.mark(this, p)
    };

    Glob.prototype._makeAbs = function (f) {
      return common.makeAbs(this, f)
    };

    Glob.prototype.abort = function () {
      this.aborted = true;
      this.emit('abort');
    };

    Glob.prototype.pause = function () {
      if (!this.paused) {
        this.paused = true;
        this.emit('pause');
      }
    };

    Glob.prototype.resume = function () {
      if (this.paused) {
        this.emit('resume');
        this.paused = false;
        if (this._emitQueue.length) {
          var eq = this._emitQueue.slice(0);
          this._emitQueue.length = 0;
          for (var i = 0; i < eq.length; i ++) {
            var e = eq[i];
            this._emitMatch(e[0], e[1]);
          }
        }
        if (this._processQueue.length) {
          var pq = this._processQueue.slice(0);
          this._processQueue.length = 0;
          for (var i = 0; i < pq.length; i ++) {
            var p = pq[i];
            this._processing--;
            this._process(p[0], p[1], p[2], p[3]);
          }
        }
      }
    };

    Glob.prototype._process = function (pattern, index, inGlobStar, cb) {
      assert(this instanceof Glob);
      assert(typeof cb === 'function');

      if (this.aborted)
        return

      this._processing++;
      if (this.paused) {
        this._processQueue.push([pattern, index, inGlobStar, cb]);
        return
      }

      //console.error('PROCESS %d', this._processing, pattern)

      // Get the first [n] parts of pattern that are all strings.
      var n = 0;
      while (typeof pattern[n] === 'string') {
        n ++;
      }
      // now n is the index of the first one that is *not* a string.

      // see if there's anything else
      var prefix;
      switch (n) {
        // if not, then this is rather simple
        case pattern.length:
          this._processSimple(pattern.join('/'), index, cb);
          return

        case 0:
          // pattern *starts* with some non-trivial item.
          // going to readdir(cwd), but not include the prefix in matches.
          prefix = null;
          break

        default:
          // pattern has some string bits in the front.
          // whatever it starts with, whether that's 'absolute' like /foo/bar,
          // or 'relative' like '../baz'
          prefix = pattern.slice(0, n).join('/');
          break
      }

      var remain = pattern.slice(n);

      // get the list of entries.
      var read;
      if (prefix === null)
        read = '.';
      else if (isAbsolute(prefix) || isAbsolute(pattern.join('/'))) {
        if (!prefix || !isAbsolute(prefix))
          prefix = '/' + prefix;
        read = prefix;
      } else
        read = prefix;

      var abs = this._makeAbs(read);

      //if ignored, skip _processing
      if (childrenIgnored(this, read))
        return cb()

      var isGlobStar = remain[0] === minimatch.GLOBSTAR;
      if (isGlobStar)
        this._processGlobStar(prefix, read, abs, remain, index, inGlobStar, cb);
      else
        this._processReaddir(prefix, read, abs, remain, index, inGlobStar, cb);
    };

    Glob.prototype._processReaddir = function (prefix, read, abs, remain, index, inGlobStar, cb) {
      var self = this;
      this._readdir(abs, inGlobStar, function (er, entries) {
        return self._processReaddir2(prefix, read, abs, remain, index, inGlobStar, entries, cb)
      });
    };

    Glob.prototype._processReaddir2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {

      // if the abs isn't a dir, then nothing can match!
      if (!entries)
        return cb()

      // It will only match dot entries if it starts with a dot, or if
      // dot is set.  Stuff like @(.foo|.bar) isn't allowed.
      var pn = remain[0];
      var negate = !!this.minimatch.negate;
      var rawGlob = pn._glob;
      var dotOk = this.dot || rawGlob.charAt(0) === '.';

      var matchedEntries = [];
      for (var i = 0; i < entries.length; i++) {
        var e = entries[i];
        if (e.charAt(0) !== '.' || dotOk) {
          var m;
          if (negate && !prefix) {
            m = !e.match(pn);
          } else {
            m = e.match(pn);
          }
          if (m)
            matchedEntries.push(e);
        }
      }

      //console.error('prd2', prefix, entries, remain[0]._glob, matchedEntries)

      var len = matchedEntries.length;
      // If there are no matched entries, then nothing matches.
      if (len === 0)
        return cb()

      // if this is the last remaining pattern bit, then no need for
      // an additional stat *unless* the user has specified mark or
      // stat explicitly.  We know they exist, since readdir returned
      // them.

      if (remain.length === 1 && !this.mark && !this.stat) {
        if (!this.matches[index])
          this.matches[index] = Object.create(null);

        for (var i = 0; i < len; i ++) {
          var e = matchedEntries[i];
          if (prefix) {
            if (prefix !== '/')
              e = prefix + '/' + e;
            else
              e = prefix + e;
          }

          if (e.charAt(0) === '/' && !this.nomount) {
            e = path.join(this.root, e);
          }
          this._emitMatch(index, e);
        }
        // This was the last one, and no stats were needed
        return cb()
      }

      // now test all matched entries as stand-ins for that part
      // of the pattern.
      remain.shift();
      for (var i = 0; i < len; i ++) {
        var e = matchedEntries[i];
        if (prefix) {
          if (prefix !== '/')
            e = prefix + '/' + e;
          else
            e = prefix + e;
        }
        this._process([e].concat(remain), index, inGlobStar, cb);
      }
      cb();
    };

    Glob.prototype._emitMatch = function (index, e) {
      if (this.aborted)
        return

      if (isIgnored(this, e))
        return

      if (this.paused) {
        this._emitQueue.push([index, e]);
        return
      }

      var abs = isAbsolute(e) ? e : this._makeAbs(e);

      if (this.mark)
        e = this._mark(e);

      if (this.absolute)
        e = abs;

      if (this.matches[index][e])
        return

      if (this.nodir) {
        var c = this.cache[abs];
        if (c === 'DIR' || Array.isArray(c))
          return
      }

      this.matches[index][e] = true;

      var st = this.statCache[abs];
      if (st)
        this.emit('stat', e, st);

      this.emit('match', e);
    };

    Glob.prototype._readdirInGlobStar = function (abs, cb) {
      if (this.aborted)
        return

      // follow all symlinked directories forever
      // just proceed as if this is a non-globstar situation
      if (this.follow)
        return this._readdir(abs, false, cb)

      var lstatkey = 'lstat\0' + abs;
      var self = this;
      var lstatcb = inflight(lstatkey, lstatcb_);

      if (lstatcb)
        fs.lstat(abs, lstatcb);

      function lstatcb_ (er, lstat) {
        if (er && er.code === 'ENOENT')
          return cb()

        var isSym = lstat && lstat.isSymbolicLink();
        self.symlinks[abs] = isSym;

        // If it's not a symlink or a dir, then it's definitely a regular file.
        // don't bother doing a readdir in that case.
        if (!isSym && lstat && !lstat.isDirectory()) {
          self.cache[abs] = 'FILE';
          cb();
        } else
          self._readdir(abs, false, cb);
      }
    };

    Glob.prototype._readdir = function (abs, inGlobStar, cb) {
      if (this.aborted)
        return

      cb = inflight('readdir\0'+abs+'\0'+inGlobStar, cb);
      if (!cb)
        return

      //console.error('RD %j %j', +inGlobStar, abs)
      if (inGlobStar && !ownProp(this.symlinks, abs))
        return this._readdirInGlobStar(abs, cb)

      if (ownProp(this.cache, abs)) {
        var c = this.cache[abs];
        if (!c || c === 'FILE')
          return cb()

        if (Array.isArray(c))
          return cb(null, c)
      }
      fs.readdir(abs, readdirCb(this, abs, cb));
    };

    function readdirCb (self, abs, cb) {
      return function (er, entries) {
        if (er)
          self._readdirError(abs, er, cb);
        else
          self._readdirEntries(abs, entries, cb);
      }
    }

    Glob.prototype._readdirEntries = function (abs, entries, cb) {
      if (this.aborted)
        return

      // if we haven't asked to stat everything, then just
      // assume that everything in there exists, so we can avoid
      // having to stat it a second time.
      if (!this.mark && !this.stat) {
        for (var i = 0; i < entries.length; i ++) {
          var e = entries[i];
          if (abs === '/')
            e = abs + e;
          else
            e = abs + '/' + e;
          this.cache[e] = true;
        }
      }

      this.cache[abs] = entries;
      return cb(null, entries)
    };

    Glob.prototype._readdirError = function (f, er, cb) {
      if (this.aborted)
        return

      // handle errors, and cache the information
      switch (er.code) {
        case 'ENOTSUP': // https://github.com/isaacs/node-glob/issues/205
        case 'ENOTDIR': // totally normal. means it *does* exist.
          var abs = this._makeAbs(f);
          this.cache[abs] = 'FILE';
          if (abs === this.cwdAbs) {
            var error = new Error(er.code + ' invalid cwd ' + this.cwd);
            error.path = this.cwd;
            error.code = er.code;
            this.emit('error', error);
            this.abort();
          }
          break

        case 'ENOENT': // not terribly unusual
        case 'ELOOP':
        case 'ENAMETOOLONG':
        case 'UNKNOWN':
          this.cache[this._makeAbs(f)] = false;
          break

        default: // some unusual error.  Treat as failure.
          this.cache[this._makeAbs(f)] = false;
          if (this.strict) {
            this.emit('error', er);
            // If the error is handled, then we abort
            // if not, we threw out of here
            this.abort();
          }
          if (!this.silent)
            console.error('glob error', er);
          break
      }

      return cb()
    };

    Glob.prototype._processGlobStar = function (prefix, read, abs, remain, index, inGlobStar, cb) {
      var self = this;
      this._readdir(abs, inGlobStar, function (er, entries) {
        self._processGlobStar2(prefix, read, abs, remain, index, inGlobStar, entries, cb);
      });
    };


    Glob.prototype._processGlobStar2 = function (prefix, read, abs, remain, index, inGlobStar, entries, cb) {
      //console.error('pgs2', prefix, remain[0], entries)

      // no entries means not a dir, so it can never have matches
      // foo.txt/** doesn't match foo.txt
      if (!entries)
        return cb()

      // test without the globstar, and with every child both below
      // and replacing the globstar.
      var remainWithoutGlobStar = remain.slice(1);
      var gspref = prefix ? [ prefix ] : [];
      var noGlobStar = gspref.concat(remainWithoutGlobStar);

      // the noGlobStar pattern exits the inGlobStar state
      this._process(noGlobStar, index, false, cb);

      var isSym = this.symlinks[abs];
      var len = entries.length;

      // If it's a symlink, and we're in a globstar, then stop
      if (isSym && inGlobStar)
        return cb()

      for (var i = 0; i < len; i++) {
        var e = entries[i];
        if (e.charAt(0) === '.' && !this.dot)
          continue

        // these two cases enter the inGlobStar state
        var instead = gspref.concat(entries[i], remainWithoutGlobStar);
        this._process(instead, index, true, cb);

        var below = gspref.concat(entries[i], remain);
        this._process(below, index, true, cb);
      }

      cb();
    };

    Glob.prototype._processSimple = function (prefix, index, cb) {
      // XXX review this.  Shouldn't it be doing the mounting etc
      // before doing stat?  kinda weird?
      var self = this;
      this._stat(prefix, function (er, exists) {
        self._processSimple2(prefix, index, er, exists, cb);
      });
    };
    Glob.prototype._processSimple2 = function (prefix, index, er, exists, cb) {

      //console.error('ps2', prefix, exists)

      if (!this.matches[index])
        this.matches[index] = Object.create(null);

      // If it doesn't exist, then just mark the lack of results
      if (!exists)
        return cb()

      if (prefix && isAbsolute(prefix) && !this.nomount) {
        var trail = /[\/\\]$/.test(prefix);
        if (prefix.charAt(0) === '/') {
          prefix = path.join(this.root, prefix);
        } else {
          prefix = path.resolve(this.root, prefix);
          if (trail)
            prefix += '/';
        }
      }

      if (process.platform === 'win32')
        prefix = prefix.replace(/\\/g, '/');

      // Mark this as a match
      this._emitMatch(index, prefix);
      cb();
    };

    // Returns either 'DIR', 'FILE', or false
    Glob.prototype._stat = function (f, cb) {
      var abs = this._makeAbs(f);
      var needDir = f.slice(-1) === '/';

      if (f.length > this.maxLength)
        return cb()

      if (!this.stat && ownProp(this.cache, abs)) {
        var c = this.cache[abs];

        if (Array.isArray(c))
          c = 'DIR';

        // It exists, but maybe not how we need it
        if (!needDir || c === 'DIR')
          return cb(null, c)

        if (needDir && c === 'FILE')
          return cb()

        // otherwise we have to stat, because maybe c=true
        // if we know it exists, but not what it is.
      }
      var stat = this.statCache[abs];
      if (stat !== undefined) {
        if (stat === false)
          return cb(null, stat)
        else {
          var type = stat.isDirectory() ? 'DIR' : 'FILE';
          if (needDir && type === 'FILE')
            return cb()
          else
            return cb(null, type, stat)
        }
      }

      var self = this;
      var statcb = inflight('stat\0' + abs, lstatcb_);
      if (statcb)
        fs.lstat(abs, statcb);

      function lstatcb_ (er, lstat) {
        if (lstat && lstat.isSymbolicLink()) {
          // If it's a symlink, then treat it as the target, unless
          // the target does not exist, then treat it as a file.
          return fs.stat(abs, function (er, stat) {
            if (er)
              self._stat2(f, abs, null, lstat, cb);
            else
              self._stat2(f, abs, er, stat, cb);
          })
        } else {
          self._stat2(f, abs, er, lstat, cb);
        }
      }
    };

    Glob.prototype._stat2 = function (f, abs, er, stat, cb) {
      if (er && (er.code === 'ENOENT' || er.code === 'ENOTDIR')) {
        this.statCache[abs] = false;
        return cb()
      }

      var needDir = f.slice(-1) === '/';
      this.statCache[abs] = stat;

      if (abs.slice(-1) === '/' && stat && !stat.isDirectory())
        return cb(null, false, stat)

      var c = true;
      if (stat)
        c = stat.isDirectory() ? 'DIR' : 'FILE';
      this.cache[abs] = this.cache[abs] || c;

      if (needDir && c === 'FILE')
        return cb()

      return cb(null, c, stat)
    };

    // @ts-check
    /** @typedef { import('estree').BaseNode} BaseNode */

    /** @typedef {{
    	skip: () => void;
    	remove: () => void;
    	replace: (node: BaseNode) => void;
    }} WalkerContext */

    class WalkerBase {
    	constructor() {
    		/** @type {boolean} */
    		this.should_skip = false;

    		/** @type {boolean} */
    		this.should_remove = false;

    		/** @type {BaseNode | null} */
    		this.replacement = null;

    		/** @type {WalkerContext} */
    		this.context = {
    			skip: () => (this.should_skip = true),
    			remove: () => (this.should_remove = true),
    			replace: (node) => (this.replacement = node)
    		};
    	}

    	/**
    	 *
    	 * @param {any} parent
    	 * @param {string} prop
    	 * @param {number} index
    	 * @param {BaseNode} node
    	 */
    	replace(parent, prop, index, node) {
    		if (parent) {
    			if (index !== null) {
    				parent[prop][index] = node;
    			} else {
    				parent[prop] = node;
    			}
    		}
    	}

    	/**
    	 *
    	 * @param {any} parent
    	 * @param {string} prop
    	 * @param {number} index
    	 */
    	remove(parent, prop, index) {
    		if (parent) {
    			if (index !== null) {
    				parent[prop].splice(index, 1);
    			} else {
    				delete parent[prop];
    			}
    		}
    	}
    }

    // @ts-check

    /** @typedef { import('estree').BaseNode} BaseNode */
    /** @typedef { import('./walker.js').WalkerContext} WalkerContext */

    /** @typedef {(
     *    this: WalkerContext,
     *    node: BaseNode,
     *    parent: BaseNode,
     *    key: string,
     *    index: number
     * ) => void} SyncHandler */

    class SyncWalker extends WalkerBase {
    	/**
    	 *
    	 * @param {SyncHandler} enter
    	 * @param {SyncHandler} leave
    	 */
    	constructor(enter, leave) {
    		super();

    		/** @type {SyncHandler} */
    		this.enter = enter;

    		/** @type {SyncHandler} */
    		this.leave = leave;
    	}

    	/**
    	 *
    	 * @param {BaseNode} node
    	 * @param {BaseNode} parent
    	 * @param {string} [prop]
    	 * @param {number} [index]
    	 * @returns {BaseNode}
    	 */
    	visit(node, parent, prop, index) {
    		if (node) {
    			if (this.enter) {
    				const _should_skip = this.should_skip;
    				const _should_remove = this.should_remove;
    				const _replacement = this.replacement;
    				this.should_skip = false;
    				this.should_remove = false;
    				this.replacement = null;

    				this.enter.call(this.context, node, parent, prop, index);

    				if (this.replacement) {
    					node = this.replacement;
    					this.replace(parent, prop, index, node);
    				}

    				if (this.should_remove) {
    					this.remove(parent, prop, index);
    				}

    				const skipped = this.should_skip;
    				const removed = this.should_remove;

    				this.should_skip = _should_skip;
    				this.should_remove = _should_remove;
    				this.replacement = _replacement;

    				if (skipped) return node;
    				if (removed) return null;
    			}

    			for (const key in node) {
    				const value = node[key];

    				if (typeof value !== "object") {
    					continue;
    				} else if (Array.isArray(value)) {
    					for (let i = 0; i < value.length; i += 1) {
    						if (value[i] !== null && typeof value[i].type === 'string') {
    							if (!this.visit(value[i], node, key, i)) {
    								// removed
    								i--;
    							}
    						}
    					}
    				} else if (value !== null && typeof value.type === "string") {
    					this.visit(value, node, key, null);
    				}
    			}

    			if (this.leave) {
    				const _replacement = this.replacement;
    				const _should_remove = this.should_remove;
    				this.replacement = null;
    				this.should_remove = false;

    				this.leave.call(this.context, node, parent, prop, index);

    				if (this.replacement) {
    					node = this.replacement;
    					this.replace(parent, prop, index, node);
    				}

    				if (this.should_remove) {
    					this.remove(parent, prop, index);
    				}

    				const removed = this.should_remove;

    				this.replacement = _replacement;
    				this.should_remove = _should_remove;

    				if (removed) return null;
    			}
    		}

    		return node;
    	}
    }

    // @ts-check

    /** @typedef { import('estree').BaseNode} BaseNode */
    /** @typedef { import('./sync.js').SyncHandler} SyncHandler */
    /** @typedef { import('./async.js').AsyncHandler} AsyncHandler */

    /**
     *
     * @param {BaseNode} ast
     * @param {{
     *   enter?: SyncHandler
     *   leave?: SyncHandler
     * }} walker
     * @returns {BaseNode}
     */
    function walk(ast, { enter, leave }) {
    	const instance = new SyncWalker(enter, leave);
    	return instance.visit(ast, null);
    }

    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    function encode(decoded) {
        var sourceFileIndex = 0; // second field
        var sourceCodeLine = 0; // third field
        var sourceCodeColumn = 0; // fourth field
        var nameIndex = 0; // fifth field
        var mappings = '';
        for (var i = 0; i < decoded.length; i++) {
            var line = decoded[i];
            if (i > 0)
                mappings += ';';
            if (line.length === 0)
                continue;
            var generatedCodeColumn = 0; // first field
            var lineMappings = [];
            for (var _i = 0, line_1 = line; _i < line_1.length; _i++) {
                var segment = line_1[_i];
                var segmentMappings = encodeInteger(segment[0] - generatedCodeColumn);
                generatedCodeColumn = segment[0];
                if (segment.length > 1) {
                    segmentMappings +=
                        encodeInteger(segment[1] - sourceFileIndex) +
                            encodeInteger(segment[2] - sourceCodeLine) +
                            encodeInteger(segment[3] - sourceCodeColumn);
                    sourceFileIndex = segment[1];
                    sourceCodeLine = segment[2];
                    sourceCodeColumn = segment[3];
                }
                if (segment.length === 5) {
                    segmentMappings += encodeInteger(segment[4] - nameIndex);
                    nameIndex = segment[4];
                }
                lineMappings.push(segmentMappings);
            }
            mappings += lineMappings.join(',');
        }
        return mappings;
    }
    function encodeInteger(num) {
        var result = '';
        num = num < 0 ? (-num << 1) | 1 : num << 1;
        do {
            var clamped = num & 31;
            num >>>= 5;
            if (num > 0) {
                clamped |= 32;
            }
            result += chars[clamped];
        } while (num > 0);
        return result;
    }

    var BitSet = function BitSet(arg) {
    	this.bits = arg instanceof BitSet ? arg.bits.slice() : [];
    };

    BitSet.prototype.add = function add (n) {
    	this.bits[n >> 5] |= 1 << (n & 31);
    };

    BitSet.prototype.has = function has (n) {
    	return !!(this.bits[n >> 5] & (1 << (n & 31)));
    };

    var Chunk = function Chunk(start, end, content) {
    	this.start = start;
    	this.end = end;
    	this.original = content;

    	this.intro = '';
    	this.outro = '';

    	this.content = content;
    	this.storeName = false;
    	this.edited = false;

    	// we make these non-enumerable, for sanity while debugging
    	Object.defineProperties(this, {
    		previous: { writable: true, value: null },
    		next:     { writable: true, value: null }
    	});
    };

    Chunk.prototype.appendLeft = function appendLeft (content) {
    	this.outro += content;
    };

    Chunk.prototype.appendRight = function appendRight (content) {
    	this.intro = this.intro + content;
    };

    Chunk.prototype.clone = function clone () {
    	var chunk = new Chunk(this.start, this.end, this.original);

    	chunk.intro = this.intro;
    	chunk.outro = this.outro;
    	chunk.content = this.content;
    	chunk.storeName = this.storeName;
    	chunk.edited = this.edited;

    	return chunk;
    };

    Chunk.prototype.contains = function contains (index) {
    	return this.start < index && index < this.end;
    };

    Chunk.prototype.eachNext = function eachNext (fn) {
    	var chunk = this;
    	while (chunk) {
    		fn(chunk);
    		chunk = chunk.next;
    	}
    };

    Chunk.prototype.eachPrevious = function eachPrevious (fn) {
    	var chunk = this;
    	while (chunk) {
    		fn(chunk);
    		chunk = chunk.previous;
    	}
    };

    Chunk.prototype.edit = function edit (content, storeName, contentOnly) {
    	this.content = content;
    	if (!contentOnly) {
    		this.intro = '';
    		this.outro = '';
    	}
    	this.storeName = storeName;

    	this.edited = true;

    	return this;
    };

    Chunk.prototype.prependLeft = function prependLeft (content) {
    	this.outro = content + this.outro;
    };

    Chunk.prototype.prependRight = function prependRight (content) {
    	this.intro = content + this.intro;
    };

    Chunk.prototype.split = function split (index) {
    	var sliceIndex = index - this.start;

    	var originalBefore = this.original.slice(0, sliceIndex);
    	var originalAfter = this.original.slice(sliceIndex);

    	this.original = originalBefore;

    	var newChunk = new Chunk(index, this.end, originalAfter);
    	newChunk.outro = this.outro;
    	this.outro = '';

    	this.end = index;

    	if (this.edited) {
    		// TODO is this block necessary?...
    		newChunk.edit('', false);
    		this.content = '';
    	} else {
    		this.content = originalBefore;
    	}

    	newChunk.next = this.next;
    	if (newChunk.next) { newChunk.next.previous = newChunk; }
    	newChunk.previous = this;
    	this.next = newChunk;

    	return newChunk;
    };

    Chunk.prototype.toString = function toString () {
    	return this.intro + this.content + this.outro;
    };

    Chunk.prototype.trimEnd = function trimEnd (rx) {
    	this.outro = this.outro.replace(rx, '');
    	if (this.outro.length) { return true; }

    	var trimmed = this.content.replace(rx, '');

    	if (trimmed.length) {
    		if (trimmed !== this.content) {
    			this.split(this.start + trimmed.length).edit('', undefined, true);
    		}
    		return true;

    	} else {
    		this.edit('', undefined, true);

    		this.intro = this.intro.replace(rx, '');
    		if (this.intro.length) { return true; }
    	}
    };

    Chunk.prototype.trimStart = function trimStart (rx) {
    	this.intro = this.intro.replace(rx, '');
    	if (this.intro.length) { return true; }

    	var trimmed = this.content.replace(rx, '');

    	if (trimmed.length) {
    		if (trimmed !== this.content) {
    			this.split(this.end - trimmed.length);
    			this.edit('', undefined, true);
    		}
    		return true;

    	} else {
    		this.edit('', undefined, true);

    		this.outro = this.outro.replace(rx, '');
    		if (this.outro.length) { return true; }
    	}
    };

    var btoa = function () {
    	throw new Error('Unsupported environment: `window.btoa` or `Buffer` should be supported.');
    };
    if (typeof window !== 'undefined' && typeof window.btoa === 'function') {
    	btoa = function (str) { return window.btoa(unescape(encodeURIComponent(str))); };
    } else if (typeof Buffer === 'function') {
    	btoa = function (str) { return Buffer.from(str, 'utf-8').toString('base64'); };
    }

    var SourceMap = function SourceMap(properties) {
    	this.version = 3;
    	this.file = properties.file;
    	this.sources = properties.sources;
    	this.sourcesContent = properties.sourcesContent;
    	this.names = properties.names;
    	this.mappings = encode(properties.mappings);
    };

    SourceMap.prototype.toString = function toString () {
    	return JSON.stringify(this);
    };

    SourceMap.prototype.toUrl = function toUrl () {
    	return 'data:application/json;charset=utf-8;base64,' + btoa(this.toString());
    };

    function guessIndent(code) {
    	var lines = code.split('\n');

    	var tabbed = lines.filter(function (line) { return /^\t+/.test(line); });
    	var spaced = lines.filter(function (line) { return /^ {2,}/.test(line); });

    	if (tabbed.length === 0 && spaced.length === 0) {
    		return null;
    	}

    	// More lines tabbed than spaced? Assume tabs, and
    	// default to tabs in the case of a tie (or nothing
    	// to go on)
    	if (tabbed.length >= spaced.length) {
    		return '\t';
    	}

    	// Otherwise, we need to guess the multiple
    	var min = spaced.reduce(function (previous, current) {
    		var numSpaces = /^ +/.exec(current)[0].length;
    		return Math.min(numSpaces, previous);
    	}, Infinity);

    	return new Array(min + 1).join(' ');
    }

    function getRelativePath(from, to) {
    	var fromParts = from.split(/[/\\]/);
    	var toParts = to.split(/[/\\]/);

    	fromParts.pop(); // get dirname

    	while (fromParts[0] === toParts[0]) {
    		fromParts.shift();
    		toParts.shift();
    	}

    	if (fromParts.length) {
    		var i = fromParts.length;
    		while (i--) { fromParts[i] = '..'; }
    	}

    	return fromParts.concat(toParts).join('/');
    }

    var toString = Object.prototype.toString;

    function isObject(thing) {
    	return toString.call(thing) === '[object Object]';
    }

    function getLocator(source) {
    	var originalLines = source.split('\n');
    	var lineOffsets = [];

    	for (var i = 0, pos = 0; i < originalLines.length; i++) {
    		lineOffsets.push(pos);
    		pos += originalLines[i].length + 1;
    	}

    	return function locate(index) {
    		var i = 0;
    		var j = lineOffsets.length;
    		while (i < j) {
    			var m = (i + j) >> 1;
    			if (index < lineOffsets[m]) {
    				j = m;
    			} else {
    				i = m + 1;
    			}
    		}
    		var line = i - 1;
    		var column = index - lineOffsets[line];
    		return { line: line, column: column };
    	};
    }

    var Mappings = function Mappings(hires) {
    	this.hires = hires;
    	this.generatedCodeLine = 0;
    	this.generatedCodeColumn = 0;
    	this.raw = [];
    	this.rawSegments = this.raw[this.generatedCodeLine] = [];
    	this.pending = null;
    };

    Mappings.prototype.addEdit = function addEdit (sourceIndex, content, loc, nameIndex) {
    	if (content.length) {
    		var segment = [this.generatedCodeColumn, sourceIndex, loc.line, loc.column];
    		if (nameIndex >= 0) {
    			segment.push(nameIndex);
    		}
    		this.rawSegments.push(segment);
    	} else if (this.pending) {
    		this.rawSegments.push(this.pending);
    	}

    	this.advance(content);
    	this.pending = null;
    };

    Mappings.prototype.addUneditedChunk = function addUneditedChunk (sourceIndex, chunk, original, loc, sourcemapLocations) {
    	var originalCharIndex = chunk.start;
    	var first = true;

    	while (originalCharIndex < chunk.end) {
    		if (this.hires || first || sourcemapLocations.has(originalCharIndex)) {
    			this.rawSegments.push([this.generatedCodeColumn, sourceIndex, loc.line, loc.column]);
    		}

    		if (original[originalCharIndex] === '\n') {
    			loc.line += 1;
    			loc.column = 0;
    			this.generatedCodeLine += 1;
    			this.raw[this.generatedCodeLine] = this.rawSegments = [];
    			this.generatedCodeColumn = 0;
    			first = true;
    		} else {
    			loc.column += 1;
    			this.generatedCodeColumn += 1;
    			first = false;
    		}

    		originalCharIndex += 1;
    	}

    	this.pending = null;
    };

    Mappings.prototype.advance = function advance (str) {
    	if (!str) { return; }

    	var lines = str.split('\n');

    	if (lines.length > 1) {
    		for (var i = 0; i < lines.length - 1; i++) {
    			this.generatedCodeLine++;
    			this.raw[this.generatedCodeLine] = this.rawSegments = [];
    		}
    		this.generatedCodeColumn = 0;
    	}

    	this.generatedCodeColumn += lines[lines.length - 1].length;
    };

    var n = '\n';

    var warned = {
    	insertLeft: false,
    	insertRight: false,
    	storeName: false
    };

    var MagicString = function MagicString(string, options) {
    	if ( options === void 0 ) options = {};

    	var chunk = new Chunk(0, string.length, string);

    	Object.defineProperties(this, {
    		original:              { writable: true, value: string },
    		outro:                 { writable: true, value: '' },
    		intro:                 { writable: true, value: '' },
    		firstChunk:            { writable: true, value: chunk },
    		lastChunk:             { writable: true, value: chunk },
    		lastSearchedChunk:     { writable: true, value: chunk },
    		byStart:               { writable: true, value: {} },
    		byEnd:                 { writable: true, value: {} },
    		filename:              { writable: true, value: options.filename },
    		indentExclusionRanges: { writable: true, value: options.indentExclusionRanges },
    		sourcemapLocations:    { writable: true, value: new BitSet() },
    		storedNames:           { writable: true, value: {} },
    		indentStr:             { writable: true, value: guessIndent(string) }
    	});

    	this.byStart[0] = chunk;
    	this.byEnd[string.length] = chunk;
    };

    MagicString.prototype.addSourcemapLocation = function addSourcemapLocation (char) {
    	this.sourcemapLocations.add(char);
    };

    MagicString.prototype.append = function append (content) {
    	if (typeof content !== 'string') { throw new TypeError('outro content must be a string'); }

    	this.outro += content;
    	return this;
    };

    MagicString.prototype.appendLeft = function appendLeft (index, content) {
    	if (typeof content !== 'string') { throw new TypeError('inserted content must be a string'); }

    	this._split(index);

    	var chunk = this.byEnd[index];

    	if (chunk) {
    		chunk.appendLeft(content);
    	} else {
    		this.intro += content;
    	}
    	return this;
    };

    MagicString.prototype.appendRight = function appendRight (index, content) {
    	if (typeof content !== 'string') { throw new TypeError('inserted content must be a string'); }

    	this._split(index);

    	var chunk = this.byStart[index];

    	if (chunk) {
    		chunk.appendRight(content);
    	} else {
    		this.outro += content;
    	}
    	return this;
    };

    MagicString.prototype.clone = function clone () {
    	var cloned = new MagicString(this.original, { filename: this.filename });

    	var originalChunk = this.firstChunk;
    	var clonedChunk = (cloned.firstChunk = cloned.lastSearchedChunk = originalChunk.clone());

    	while (originalChunk) {
    		cloned.byStart[clonedChunk.start] = clonedChunk;
    		cloned.byEnd[clonedChunk.end] = clonedChunk;

    		var nextOriginalChunk = originalChunk.next;
    		var nextClonedChunk = nextOriginalChunk && nextOriginalChunk.clone();

    		if (nextClonedChunk) {
    			clonedChunk.next = nextClonedChunk;
    			nextClonedChunk.previous = clonedChunk;

    			clonedChunk = nextClonedChunk;
    		}

    		originalChunk = nextOriginalChunk;
    	}

    	cloned.lastChunk = clonedChunk;

    	if (this.indentExclusionRanges) {
    		cloned.indentExclusionRanges = this.indentExclusionRanges.slice();
    	}

    	cloned.sourcemapLocations = new BitSet(this.sourcemapLocations);

    	cloned.intro = this.intro;
    	cloned.outro = this.outro;

    	return cloned;
    };

    MagicString.prototype.generateDecodedMap = function generateDecodedMap (options) {
    		var this$1 = this;

    	options = options || {};

    	var sourceIndex = 0;
    	var names = Object.keys(this.storedNames);
    	var mappings = new Mappings(options.hires);

    	var locate = getLocator(this.original);

    	if (this.intro) {
    		mappings.advance(this.intro);
    	}

    	this.firstChunk.eachNext(function (chunk) {
    		var loc = locate(chunk.start);

    		if (chunk.intro.length) { mappings.advance(chunk.intro); }

    		if (chunk.edited) {
    			mappings.addEdit(
    				sourceIndex,
    				chunk.content,
    				loc,
    				chunk.storeName ? names.indexOf(chunk.original) : -1
    			);
    		} else {
    			mappings.addUneditedChunk(sourceIndex, chunk, this$1.original, loc, this$1.sourcemapLocations);
    		}

    		if (chunk.outro.length) { mappings.advance(chunk.outro); }
    	});

    	return {
    		file: options.file ? options.file.split(/[/\\]/).pop() : null,
    		sources: [options.source ? getRelativePath(options.file || '', options.source) : null],
    		sourcesContent: options.includeContent ? [this.original] : [null],
    		names: names,
    		mappings: mappings.raw
    	};
    };

    MagicString.prototype.generateMap = function generateMap (options) {
    	return new SourceMap(this.generateDecodedMap(options));
    };

    MagicString.prototype.getIndentString = function getIndentString () {
    	return this.indentStr === null ? '\t' : this.indentStr;
    };

    MagicString.prototype.indent = function indent (indentStr, options) {
    	var pattern = /^[^\r\n]/gm;

    	if (isObject(indentStr)) {
    		options = indentStr;
    		indentStr = undefined;
    	}

    	indentStr = indentStr !== undefined ? indentStr : this.indentStr || '\t';

    	if (indentStr === '') { return this; } // noop

    	options = options || {};

    	// Process exclusion ranges
    	var isExcluded = {};

    	if (options.exclude) {
    		var exclusions =
    			typeof options.exclude[0] === 'number' ? [options.exclude] : options.exclude;
    		exclusions.forEach(function (exclusion) {
    			for (var i = exclusion[0]; i < exclusion[1]; i += 1) {
    				isExcluded[i] = true;
    			}
    		});
    	}

    	var shouldIndentNextCharacter = options.indentStart !== false;
    	var replacer = function (match) {
    		if (shouldIndentNextCharacter) { return ("" + indentStr + match); }
    		shouldIndentNextCharacter = true;
    		return match;
    	};

    	this.intro = this.intro.replace(pattern, replacer);

    	var charIndex = 0;
    	var chunk = this.firstChunk;

    	while (chunk) {
    		var end = chunk.end;

    		if (chunk.edited) {
    			if (!isExcluded[charIndex]) {
    				chunk.content = chunk.content.replace(pattern, replacer);

    				if (chunk.content.length) {
    					shouldIndentNextCharacter = chunk.content[chunk.content.length - 1] === '\n';
    				}
    			}
    		} else {
    			charIndex = chunk.start;

    			while (charIndex < end) {
    				if (!isExcluded[charIndex]) {
    					var char = this.original[charIndex];

    					if (char === '\n') {
    						shouldIndentNextCharacter = true;
    					} else if (char !== '\r' && shouldIndentNextCharacter) {
    						shouldIndentNextCharacter = false;

    						if (charIndex === chunk.start) {
    							chunk.prependRight(indentStr);
    						} else {
    							this._splitChunk(chunk, charIndex);
    							chunk = chunk.next;
    							chunk.prependRight(indentStr);
    						}
    					}
    				}

    				charIndex += 1;
    			}
    		}

    		charIndex = chunk.end;
    		chunk = chunk.next;
    	}

    	this.outro = this.outro.replace(pattern, replacer);

    	return this;
    };

    MagicString.prototype.insert = function insert () {
    	throw new Error('magicString.insert(...) is deprecated. Use prependRight(...) or appendLeft(...)');
    };

    MagicString.prototype.insertLeft = function insertLeft (index, content) {
    	if (!warned.insertLeft) {
    		console.warn('magicString.insertLeft(...) is deprecated. Use magicString.appendLeft(...) instead'); // eslint-disable-line no-console
    		warned.insertLeft = true;
    	}

    	return this.appendLeft(index, content);
    };

    MagicString.prototype.insertRight = function insertRight (index, content) {
    	if (!warned.insertRight) {
    		console.warn('magicString.insertRight(...) is deprecated. Use magicString.prependRight(...) instead'); // eslint-disable-line no-console
    		warned.insertRight = true;
    	}

    	return this.prependRight(index, content);
    };

    MagicString.prototype.move = function move (start, end, index) {
    	if (index >= start && index <= end) { throw new Error('Cannot move a selection inside itself'); }

    	this._split(start);
    	this._split(end);
    	this._split(index);

    	var first = this.byStart[start];
    	var last = this.byEnd[end];

    	var oldLeft = first.previous;
    	var oldRight = last.next;

    	var newRight = this.byStart[index];
    	if (!newRight && last === this.lastChunk) { return this; }
    	var newLeft = newRight ? newRight.previous : this.lastChunk;

    	if (oldLeft) { oldLeft.next = oldRight; }
    	if (oldRight) { oldRight.previous = oldLeft; }

    	if (newLeft) { newLeft.next = first; }
    	if (newRight) { newRight.previous = last; }

    	if (!first.previous) { this.firstChunk = last.next; }
    	if (!last.next) {
    		this.lastChunk = first.previous;
    		this.lastChunk.next = null;
    	}

    	first.previous = newLeft;
    	last.next = newRight || null;

    	if (!newLeft) { this.firstChunk = first; }
    	if (!newRight) { this.lastChunk = last; }
    	return this;
    };

    MagicString.prototype.overwrite = function overwrite (start, end, content, options) {
    	if (typeof content !== 'string') { throw new TypeError('replacement content must be a string'); }

    	while (start < 0) { start += this.original.length; }
    	while (end < 0) { end += this.original.length; }

    	if (end > this.original.length) { throw new Error('end is out of bounds'); }
    	if (start === end)
    		{ throw new Error('Cannot overwrite a zero-length range – use appendLeft or prependRight instead'); }

    	this._split(start);
    	this._split(end);

    	if (options === true) {
    		if (!warned.storeName) {
    			console.warn('The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string'); // eslint-disable-line no-console
    			warned.storeName = true;
    		}

    		options = { storeName: true };
    	}
    	var storeName = options !== undefined ? options.storeName : false;
    	var contentOnly = options !== undefined ? options.contentOnly : false;

    	if (storeName) {
    		var original = this.original.slice(start, end);
    		this.storedNames[original] = true;
    	}

    	var first = this.byStart[start];
    	var last = this.byEnd[end];

    	if (first) {
    		if (end > first.end && first.next !== this.byStart[first.end]) {
    			throw new Error('Cannot overwrite across a split point');
    		}

    		first.edit(content, storeName, contentOnly);

    		if (first !== last) {
    			var chunk = first.next;
    			while (chunk !== last) {
    				chunk.edit('', false);
    				chunk = chunk.next;
    			}

    			chunk.edit('', false);
    		}
    	} else {
    		// must be inserting at the end
    		var newChunk = new Chunk(start, end, '').edit(content, storeName);

    		// TODO last chunk in the array may not be the last chunk, if it's moved...
    		last.next = newChunk;
    		newChunk.previous = last;
    	}
    	return this;
    };

    MagicString.prototype.prepend = function prepend (content) {
    	if (typeof content !== 'string') { throw new TypeError('outro content must be a string'); }

    	this.intro = content + this.intro;
    	return this;
    };

    MagicString.prototype.prependLeft = function prependLeft (index, content) {
    	if (typeof content !== 'string') { throw new TypeError('inserted content must be a string'); }

    	this._split(index);

    	var chunk = this.byEnd[index];

    	if (chunk) {
    		chunk.prependLeft(content);
    	} else {
    		this.intro = content + this.intro;
    	}
    	return this;
    };

    MagicString.prototype.prependRight = function prependRight (index, content) {
    	if (typeof content !== 'string') { throw new TypeError('inserted content must be a string'); }

    	this._split(index);

    	var chunk = this.byStart[index];

    	if (chunk) {
    		chunk.prependRight(content);
    	} else {
    		this.outro = content + this.outro;
    	}
    	return this;
    };

    MagicString.prototype.remove = function remove (start, end) {
    	while (start < 0) { start += this.original.length; }
    	while (end < 0) { end += this.original.length; }

    	if (start === end) { return this; }

    	if (start < 0 || end > this.original.length) { throw new Error('Character is out of bounds'); }
    	if (start > end) { throw new Error('end must be greater than start'); }

    	this._split(start);
    	this._split(end);

    	var chunk = this.byStart[start];

    	while (chunk) {
    		chunk.intro = '';
    		chunk.outro = '';
    		chunk.edit('');

    		chunk = end > chunk.end ? this.byStart[chunk.end] : null;
    	}
    	return this;
    };

    MagicString.prototype.lastChar = function lastChar () {
    	if (this.outro.length)
    		{ return this.outro[this.outro.length - 1]; }
    	var chunk = this.lastChunk;
    	do {
    		if (chunk.outro.length)
    			{ return chunk.outro[chunk.outro.length - 1]; }
    		if (chunk.content.length)
    			{ return chunk.content[chunk.content.length - 1]; }
    		if (chunk.intro.length)
    			{ return chunk.intro[chunk.intro.length - 1]; }
    	} while (chunk = chunk.previous);
    	if (this.intro.length)
    		{ return this.intro[this.intro.length - 1]; }
    	return '';
    };

    MagicString.prototype.lastLine = function lastLine () {
    	var lineIndex = this.outro.lastIndexOf(n);
    	if (lineIndex !== -1)
    		{ return this.outro.substr(lineIndex + 1); }
    	var lineStr = this.outro;
    	var chunk = this.lastChunk;
    	do {
    		if (chunk.outro.length > 0) {
    			lineIndex = chunk.outro.lastIndexOf(n);
    			if (lineIndex !== -1)
    				{ return chunk.outro.substr(lineIndex + 1) + lineStr; }
    			lineStr = chunk.outro + lineStr;
    		}

    		if (chunk.content.length > 0) {
    			lineIndex = chunk.content.lastIndexOf(n);
    			if (lineIndex !== -1)
    				{ return chunk.content.substr(lineIndex + 1) + lineStr; }
    			lineStr = chunk.content + lineStr;
    		}

    		if (chunk.intro.length > 0) {
    			lineIndex = chunk.intro.lastIndexOf(n);
    			if (lineIndex !== -1)
    				{ return chunk.intro.substr(lineIndex + 1) + lineStr; }
    			lineStr = chunk.intro + lineStr;
    		}
    	} while (chunk = chunk.previous);
    	lineIndex = this.intro.lastIndexOf(n);
    	if (lineIndex !== -1)
    		{ return this.intro.substr(lineIndex + 1) + lineStr; }
    	return this.intro + lineStr;
    };

    MagicString.prototype.slice = function slice (start, end) {
    		if ( start === void 0 ) start = 0;
    		if ( end === void 0 ) end = this.original.length;

    	while (start < 0) { start += this.original.length; }
    	while (end < 0) { end += this.original.length; }

    	var result = '';

    	// find start chunk
    	var chunk = this.firstChunk;
    	while (chunk && (chunk.start > start || chunk.end <= start)) {
    		// found end chunk before start
    		if (chunk.start < end && chunk.end >= end) {
    			return result;
    		}

    		chunk = chunk.next;
    	}

    	if (chunk && chunk.edited && chunk.start !== start)
    		{ throw new Error(("Cannot use replaced character " + start + " as slice start anchor.")); }

    	var startChunk = chunk;
    	while (chunk) {
    		if (chunk.intro && (startChunk !== chunk || chunk.start === start)) {
    			result += chunk.intro;
    		}

    		var containsEnd = chunk.start < end && chunk.end >= end;
    		if (containsEnd && chunk.edited && chunk.end !== end)
    			{ throw new Error(("Cannot use replaced character " + end + " as slice end anchor.")); }

    		var sliceStart = startChunk === chunk ? start - chunk.start : 0;
    		var sliceEnd = containsEnd ? chunk.content.length + end - chunk.end : chunk.content.length;

    		result += chunk.content.slice(sliceStart, sliceEnd);

    		if (chunk.outro && (!containsEnd || chunk.end === end)) {
    			result += chunk.outro;
    		}

    		if (containsEnd) {
    			break;
    		}

    		chunk = chunk.next;
    	}

    	return result;
    };

    // TODO deprecate this? not really very useful
    MagicString.prototype.snip = function snip (start, end) {
    	var clone = this.clone();
    	clone.remove(0, start);
    	clone.remove(end, clone.original.length);

    	return clone;
    };

    MagicString.prototype._split = function _split (index) {
    	if (this.byStart[index] || this.byEnd[index]) { return; }

    	var chunk = this.lastSearchedChunk;
    	var searchForward = index > chunk.end;

    	while (chunk) {
    		if (chunk.contains(index)) { return this._splitChunk(chunk, index); }

    		chunk = searchForward ? this.byStart[chunk.end] : this.byEnd[chunk.start];
    	}
    };

    MagicString.prototype._splitChunk = function _splitChunk (chunk, index) {
    	if (chunk.edited && chunk.content.length) {
    		// zero-length edited chunks are a special case (overlapping replacements)
    		var loc = getLocator(this.original)(index);
    		throw new Error(
    			("Cannot split a chunk that has already been edited (" + (loc.line) + ":" + (loc.column) + " – \"" + (chunk.original) + "\")")
    		);
    	}

    	var newChunk = chunk.split(index);

    	this.byEnd[index] = chunk;
    	this.byStart[index] = newChunk;
    	this.byEnd[newChunk.end] = newChunk;

    	if (chunk === this.lastChunk) { this.lastChunk = newChunk; }

    	this.lastSearchedChunk = chunk;
    	return true;
    };

    MagicString.prototype.toString = function toString () {
    	var str = this.intro;

    	var chunk = this.firstChunk;
    	while (chunk) {
    		str += chunk.toString();
    		chunk = chunk.next;
    	}

    	return str + this.outro;
    };

    MagicString.prototype.isEmpty = function isEmpty () {
    	var chunk = this.firstChunk;
    	do {
    		if (chunk.intro.length && chunk.intro.trim() ||
    				chunk.content.length && chunk.content.trim() ||
    				chunk.outro.length && chunk.outro.trim())
    			{ return false; }
    	} while (chunk = chunk.next);
    	return true;
    };

    MagicString.prototype.length = function length () {
    	var chunk = this.firstChunk;
    	var length = 0;
    	do {
    		length += chunk.intro.length + chunk.content.length + chunk.outro.length;
    	} while (chunk = chunk.next);
    	return length;
    };

    MagicString.prototype.trimLines = function trimLines () {
    	return this.trim('[\\r\\n]');
    };

    MagicString.prototype.trim = function trim (charType) {
    	return this.trimStart(charType).trimEnd(charType);
    };

    MagicString.prototype.trimEndAborted = function trimEndAborted (charType) {
    	var rx = new RegExp((charType || '\\s') + '+$');

    	this.outro = this.outro.replace(rx, '');
    	if (this.outro.length) { return true; }

    	var chunk = this.lastChunk;

    	do {
    		var end = chunk.end;
    		var aborted = chunk.trimEnd(rx);

    		// if chunk was trimmed, we have a new lastChunk
    		if (chunk.end !== end) {
    			if (this.lastChunk === chunk) {
    				this.lastChunk = chunk.next;
    			}

    			this.byEnd[chunk.end] = chunk;
    			this.byStart[chunk.next.start] = chunk.next;
    			this.byEnd[chunk.next.end] = chunk.next;
    		}

    		if (aborted) { return true; }
    		chunk = chunk.previous;
    	} while (chunk);

    	return false;
    };

    MagicString.prototype.trimEnd = function trimEnd (charType) {
    	this.trimEndAborted(charType);
    	return this;
    };
    MagicString.prototype.trimStartAborted = function trimStartAborted (charType) {
    	var rx = new RegExp('^' + (charType || '\\s') + '+');

    	this.intro = this.intro.replace(rx, '');
    	if (this.intro.length) { return true; }

    	var chunk = this.firstChunk;

    	do {
    		var end = chunk.end;
    		var aborted = chunk.trimStart(rx);

    		if (chunk.end !== end) {
    			// special case...
    			if (chunk === this.lastChunk) { this.lastChunk = chunk.next; }

    			this.byEnd[chunk.end] = chunk;
    			this.byStart[chunk.next.start] = chunk.next;
    			this.byEnd[chunk.next.end] = chunk.next;
    		}

    		if (aborted) { return true; }
    		chunk = chunk.next;
    	} while (chunk);

    	return false;
    };

    MagicString.prototype.trimStart = function trimStart (charType) {
    	this.trimStartAborted(charType);
    	return this;
    };

    function isReference(node, parent) {
        if (node.type === 'MemberExpression') {
            return !node.computed && isReference(node.object, node);
        }
        if (node.type === 'Identifier') {
            if (!parent)
                return true;
            switch (parent.type) {
                // disregard `bar` in `foo.bar`
                case 'MemberExpression': return parent.computed || node === parent.object;
                // disregard the `foo` in `class {foo(){}}` but keep it in `class {[foo](){}}`
                case 'MethodDefinition': return parent.computed;
                // disregard the `foo` in `class {foo=bar}` but keep it in `class {[foo]=bar}` and `class {bar=foo}`
                case 'FieldDefinition': return parent.computed || node === parent.value;
                // disregard the `bar` in `{ bar: foo }`, but keep it in `{ [bar]: foo }`
                case 'Property': return parent.computed || node === parent.value;
                // disregard the `bar` in `export { foo as bar }` or
                // the foo in `import { foo as bar }`
                case 'ExportSpecifier':
                case 'ImportSpecifier': return node === parent.local;
                // disregard the `foo` in `foo: while (...) { ... break foo; ... continue foo;}`
                case 'LabeledStatement':
                case 'BreakStatement':
                case 'ContinueStatement': return false;
                default: return true;
            }
        }
        return false;
    }

    var peerDependencies = {
    	rollup: "^2.38.3"
    };

    function tryParse(parse, code, id) {
      try {
        return parse(code, { allowReturnOutsideFunction: true });
      } catch (err) {
        err.message += ` in ${id}`;
        throw err;
      }
    }

    const firstpassGlobal = /\b(?:require|module|exports|global)\b/;

    const firstpassNoGlobal = /\b(?:require|module|exports)\b/;

    function hasCjsKeywords(code, ignoreGlobal) {
      const firstpass = ignoreGlobal ? firstpassNoGlobal : firstpassGlobal;
      return firstpass.test(code);
    }

    /* eslint-disable no-underscore-dangle */

    function analyzeTopLevelStatements(parse, code, id) {
      const ast = tryParse(parse, code, id);

      let isEsModule = false;
      let hasDefaultExport = false;
      let hasNamedExports = false;

      for (const node of ast.body) {
        switch (node.type) {
          case 'ExportDefaultDeclaration':
            isEsModule = true;
            hasDefaultExport = true;
            break;
          case 'ExportNamedDeclaration':
            isEsModule = true;
            if (node.declaration) {
              hasNamedExports = true;
            } else {
              for (const specifier of node.specifiers) {
                if (specifier.exported.name === 'default') {
                  hasDefaultExport = true;
                } else {
                  hasNamedExports = true;
                }
              }
            }
            break;
          case 'ExportAllDeclaration':
            isEsModule = true;
            if (node.exported && node.exported.name === 'default') {
              hasDefaultExport = true;
            } else {
              hasNamedExports = true;
            }
            break;
          case 'ImportDeclaration':
            isEsModule = true;
            break;
        }
      }

      return { isEsModule, hasDefaultExport, hasNamedExports, ast };
    }

    const isWrappedId = (id, suffix) => id.endsWith(suffix);
    const wrapId = (id, suffix) => `\0${id}${suffix}`;
    const unwrapId = (wrappedId, suffix) => wrappedId.slice(1, -suffix.length);

    const PROXY_SUFFIX = '?commonjs-proxy';
    const REQUIRE_SUFFIX = '?commonjs-require';
    const EXTERNAL_SUFFIX = '?commonjs-external';
    const EXPORTS_SUFFIX = '?commonjs-exports';
    const MODULE_SUFFIX = '?commonjs-module';

    const DYNAMIC_REGISTER_SUFFIX = '?commonjs-dynamic-register';
    const DYNAMIC_JSON_PREFIX = '\0commonjs-dynamic-json:';
    const DYNAMIC_PACKAGES_ID = '\0commonjs-dynamic-packages';

    const HELPERS_ID = '\0commonjsHelpers.js';

    // `x['default']` is used instead of `x.default` for backward compatibility with ES3 browsers.
    // Minifiers like uglify will usually transpile it back if compatibility with ES3 is not enabled.
    // This will no longer be necessary once Rollup switches to ES6 output, likely
    // in Rollup 3

    const HELPERS = `
export var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

export function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

export function getDefaultExportFromNamespaceIfPresent (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') ? n['default'] : n;
}

export function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

export function getAugmentedNamespace(n) {
	if (n.__esModule) return n;
	var a = Object.defineProperty({}, '__esModule', {value: true});
	Object.keys(n).forEach(function (k) {
		var d = Object.getOwnPropertyDescriptor(n, k);
		Object.defineProperty(a, k, d.get ? d : {
			enumerable: true,
			get: function () {
				return n[k];
			}
		});
	});
	return a;
}
`;

    const FAILED_REQUIRE_ERROR = `throw new Error('Could not dynamically require "' + path + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');`;

    const HELPER_NON_DYNAMIC = `
export function commonjsRequire (path) {
	${FAILED_REQUIRE_ERROR}
}
`;

    const getDynamicHelpers = (ignoreDynamicRequires) => `
export function createModule(modulePath) {
	return {
		path: modulePath,
		exports: {},
		require: function (path, base) {
			return commonjsRequire(path, base == null ? modulePath : base);
		}
	};
}

export function commonjsRegister (path, loader) {
	DYNAMIC_REQUIRE_LOADERS[path] = loader;
}

const DYNAMIC_REQUIRE_LOADERS = Object.create(null);
const DYNAMIC_REQUIRE_CACHE = Object.create(null);
const DEFAULT_PARENT_MODULE = {
	id: '<' + 'rollup>', exports: {}, parent: undefined, filename: null, loaded: false, children: [], paths: []
};
const CHECKED_EXTENSIONS = ['', '.js', '.json'];

function normalize (path) {
	path = path.replace(/\\\\/g, '/');
	const parts = path.split('/');
	const slashed = parts[0] === '';
	for (let i = 1; i < parts.length; i++) {
		if (parts[i] === '.' || parts[i] === '') {
			parts.splice(i--, 1);
		}
	}
	for (let i = 1; i < parts.length; i++) {
		if (parts[i] !== '..') continue;
		if (i > 0 && parts[i - 1] !== '..' && parts[i - 1] !== '.') {
			parts.splice(--i, 2);
			i--;
		}
	}
	path = parts.join('/');
	if (slashed && path[0] !== '/')
	  path = '/' + path;
	else if (path.length === 0)
	  path = '.';
	return path;
}

function join () {
	if (arguments.length === 0)
	  return '.';
	let joined;
	for (let i = 0; i < arguments.length; ++i) {
	  let arg = arguments[i];
	  if (arg.length > 0) {
		if (joined === undefined)
		  joined = arg;
		else
		  joined += '/' + arg;
	  }
	}
	if (joined === undefined)
	  return '.';

	return joined;
}

function isPossibleNodeModulesPath (modulePath) {
	let c0 = modulePath[0];
	if (c0 === '/' || c0 === '\\\\') return false;
	let c1 = modulePath[1], c2 = modulePath[2];
	if ((c0 === '.' && (!c1 || c1 === '/' || c1 === '\\\\')) ||
		(c0 === '.' && c1 === '.' && (!c2 || c2 === '/' || c2 === '\\\\'))) return false;
	if (c1 === ':' && (c2 === '/' || c2 === '\\\\'))
		return false;
	return true;
}

function dirname (path) {
  if (path.length === 0)
    return '.';

  let i = path.length - 1;
  while (i > 0) {
    const c = path.charCodeAt(i);
    if ((c === 47 || c === 92) && i !== path.length - 1)
      break;
    i--;
  }

  if (i > 0)
    return path.substr(0, i);

  if (path.chartCodeAt(0) === 47 || path.chartCodeAt(0) === 92)
    return path.charAt(0);

  return '.';
}

export function commonjsResolveImpl (path, originalModuleDir, testCache) {
	const shouldTryNodeModules = isPossibleNodeModulesPath(path);
	path = normalize(path);
	let relPath;
	if (path[0] === '/') {
		originalModuleDir = '/';
	}
	while (true) {
		if (!shouldTryNodeModules) {
			relPath = originalModuleDir ? normalize(originalModuleDir + '/' + path) : path;
		} else if (originalModuleDir) {
			relPath = normalize(originalModuleDir + '/node_modules/' + path);
		} else {
			relPath = normalize(join('node_modules', path));
		}

		if (relPath.endsWith('/..')) {
			break; // Travelled too far up, avoid infinite loop
		}

		for (let extensionIndex = 0; extensionIndex < CHECKED_EXTENSIONS.length; extensionIndex++) {
			const resolvedPath = relPath + CHECKED_EXTENSIONS[extensionIndex];
			if (DYNAMIC_REQUIRE_CACHE[resolvedPath]) {
				return resolvedPath;
			};
			if (DYNAMIC_REQUIRE_LOADERS[resolvedPath]) {
				return resolvedPath;
			};
		}
		if (!shouldTryNodeModules) break;
		const nextDir = normalize(originalModuleDir + '/..');
		if (nextDir === originalModuleDir) break;
		originalModuleDir = nextDir;
	}
	return null;
}

export function commonjsResolve (path, originalModuleDir) {
	const resolvedPath = commonjsResolveImpl(path, originalModuleDir);
	if (resolvedPath !== null) {
		return resolvedPath;
	}
	return require.resolve(path);
}

export function commonjsRequire (path, originalModuleDir) {
	const resolvedPath = commonjsResolveImpl(path, originalModuleDir, true);
	if (resolvedPath !== null) {
    let cachedModule = DYNAMIC_REQUIRE_CACHE[resolvedPath];
    if (cachedModule) return cachedModule.exports;
    const loader = DYNAMIC_REQUIRE_LOADERS[resolvedPath];
    if (loader) {
      DYNAMIC_REQUIRE_CACHE[resolvedPath] = cachedModule = {
        id: resolvedPath,
        filename: resolvedPath,
        path: dirname(resolvedPath),
        exports: {},
        parent: DEFAULT_PARENT_MODULE,
        loaded: false,
        children: [],
        paths: [],
        require: function (path, base) {
          return commonjsRequire(path, (base === undefined || base === null) ? cachedModule.path : base);
        }
      };
      try {
        loader.call(commonjsGlobal, cachedModule, cachedModule.exports);
      } catch (error) {
        delete DYNAMIC_REQUIRE_CACHE[resolvedPath];
        throw error;
      }
      cachedModule.loaded = true;
      return cachedModule.exports;
    };
	}
	${ignoreDynamicRequires ? 'return require(path);' : FAILED_REQUIRE_ERROR}
}

commonjsRequire.cache = DYNAMIC_REQUIRE_CACHE;
commonjsRequire.resolve = commonjsResolve;
`;

    function getHelpersModule(isDynamicRequireModulesEnabled, ignoreDynamicRequires) {
      return `${HELPERS}${
    isDynamicRequireModulesEnabled ? getDynamicHelpers(ignoreDynamicRequires) : HELPER_NON_DYNAMIC
  }`;
    }

    /* eslint-disable import/prefer-default-export */

    function deconflict(scopes, globals, identifier) {
      let i = 1;
      let deconflicted = makeLegalIdentifier(identifier);
      const hasConflicts = () =>
        scopes.some((scope) => scope.contains(deconflicted)) || globals.has(deconflicted);

      while (hasConflicts()) {
        deconflicted = makeLegalIdentifier(`${identifier}_${i}`);
        i += 1;
      }

      for (const scope of scopes) {
        scope.declarations[deconflicted] = true;
      }

      return deconflicted;
    }

    function getName(id) {
      const name = makeLegalIdentifier(require$$0$1.basename(id, require$$0$1.extname(id)));
      if (name !== 'index') {
        return name;
      }
      const segments = require$$0$1.dirname(id).split(require$$0$1.sep);
      return makeLegalIdentifier(segments[segments.length - 1]);
    }

    function normalizePathSlashes(path) {
      return path.replace(/\\/g, '/');
    }

    const VIRTUAL_PATH_BASE = '/$$rollup_base$$';
    const getVirtualPathForDynamicRequirePath = (path, commonDir) => {
      const normalizedPath = normalizePathSlashes(path);
      return normalizedPath.startsWith(commonDir)
        ? VIRTUAL_PATH_BASE + normalizedPath.slice(commonDir.length)
        : normalizedPath;
    };

    function getPackageEntryPoint(dirPath) {
      let entryPoint = 'index.js';

      try {
        if (fs$8.existsSync(require$$0$1.join(dirPath, 'package.json'))) {
          entryPoint =
            JSON.parse(fs$8.readFileSync(require$$0$1.join(dirPath, 'package.json'), { encoding: 'utf8' })).main ||
            entryPoint;
        }
      } catch (ignored) {
        // ignored
      }

      return entryPoint;
    }

    function getDynamicPackagesModule(dynamicRequireModuleDirPaths, commonDir) {
      let code = `const commonjsRegister = require('${HELPERS_ID}?commonjsRegister');`;
      for (const dir of dynamicRequireModuleDirPaths) {
        const entryPoint = getPackageEntryPoint(dir);

        code += `\ncommonjsRegister(${JSON.stringify(
      getVirtualPathForDynamicRequirePath(dir, commonDir)
    )}, function (module, exports) {
  module.exports = require(${JSON.stringify(normalizePathSlashes(require$$0$1.join(dir, entryPoint)))});
});`;
      }
      return code;
    }

    function getDynamicPackagesEntryIntro(
      dynamicRequireModuleDirPaths,
      dynamicRequireModuleSet
    ) {
      let dynamicImports = Array.from(
        dynamicRequireModuleSet,
        (dynamicId) => `require(${JSON.stringify(wrapId(dynamicId, DYNAMIC_REGISTER_SUFFIX))});`
      ).join('\n');

      if (dynamicRequireModuleDirPaths.length) {
        dynamicImports += `require(${JSON.stringify(
      wrapId(DYNAMIC_PACKAGES_ID, DYNAMIC_REGISTER_SUFFIX)
    )});`;
      }

      return dynamicImports;
    }

    function isDynamicModuleImport(id, dynamicRequireModuleSet) {
      const normalizedPath = normalizePathSlashes(id);
      return dynamicRequireModuleSet.has(normalizedPath) && !normalizedPath.endsWith('.json');
    }

    function isDirectory(path) {
      try {
        if (fs$8.statSync(path).isDirectory()) return true;
      } catch (ignored) {
        // Nothing to do here
      }
      return false;
    }

    function getDynamicRequirePaths(patterns) {
      const dynamicRequireModuleSet = new Set();
      for (const pattern of !patterns || Array.isArray(patterns) ? patterns || [] : [patterns]) {
        const isNegated = pattern.startsWith('!');
        const modifySet = Set.prototype[isNegated ? 'delete' : 'add'].bind(dynamicRequireModuleSet);
        for (const path of glob_1.sync(isNegated ? pattern.substr(1) : pattern)) {
          modifySet(normalizePathSlashes(require$$0$1.resolve(path)));
          if (isDirectory(path)) {
            modifySet(normalizePathSlashes(require$$0$1.resolve(require$$0$1.join(path, getPackageEntryPoint(path)))));
          }
        }
      }
      const dynamicRequireModuleDirPaths = Array.from(dynamicRequireModuleSet.values()).filter((path) =>
        isDirectory(path)
      );
      return { dynamicRequireModuleSet, dynamicRequireModuleDirPaths };
    }

    function getCommonJSMetaPromise(commonJSMetaPromises, id) {
      let commonJSMetaPromise = commonJSMetaPromises.get(id);
      if (commonJSMetaPromise) return commonJSMetaPromise.promise;

      const promise = new Promise((resolve) => {
        commonJSMetaPromise = {
          resolve,
          promise: null
        };
        commonJSMetaPromises.set(id, commonJSMetaPromise);
      });
      commonJSMetaPromise.promise = promise;

      return promise;
    }

    function setCommonJSMetaPromise(commonJSMetaPromises, id, commonjsMeta) {
      const commonJSMetaPromise = commonJSMetaPromises.get(id);
      if (commonJSMetaPromise) {
        if (commonJSMetaPromise.resolve) {
          commonJSMetaPromise.resolve(commonjsMeta);
          commonJSMetaPromise.resolve = null;
        }
      } else {
        commonJSMetaPromises.set(id, { promise: Promise.resolve(commonjsMeta), resolve: null });
      }
    }

    // e.g. id === "commonjsHelpers?commonjsRegister"
    function getSpecificHelperProxy(id) {
      return `export {${id.split('?')[1]} as default} from "${HELPERS_ID}";`;
    }

    function getUnknownRequireProxy(id, requireReturnsDefault) {
      if (requireReturnsDefault === true || id.endsWith('.json')) {
        return `export {default} from ${JSON.stringify(id)};`;
      }
      const name = getName(id);
      const exported =
        requireReturnsDefault === 'auto'
          ? `import {getDefaultExportFromNamespaceIfNotNamed} from "${HELPERS_ID}"; export default /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(${name});`
          : requireReturnsDefault === 'preferred'
          ? `import {getDefaultExportFromNamespaceIfPresent} from "${HELPERS_ID}"; export default /*@__PURE__*/getDefaultExportFromNamespaceIfPresent(${name});`
          : !requireReturnsDefault
          ? `import {getAugmentedNamespace} from "${HELPERS_ID}"; export default /*@__PURE__*/getAugmentedNamespace(${name});`
          : `export default ${name};`;
      return `import * as ${name} from ${JSON.stringify(id)}; ${exported}`;
    }

    function getDynamicJsonProxy(id, commonDir) {
      const normalizedPath = normalizePathSlashes(id.slice(DYNAMIC_JSON_PREFIX.length));
      return `const commonjsRegister = require('${HELPERS_ID}?commonjsRegister');\ncommonjsRegister(${JSON.stringify(
    getVirtualPathForDynamicRequirePath(normalizedPath, commonDir)
  )}, function (module, exports) {
  module.exports = require(${JSON.stringify(normalizedPath)});
});`;
    }

    function getDynamicRequireProxy(normalizedPath, commonDir) {
      return `const commonjsRegister = require('${HELPERS_ID}?commonjsRegister');\ncommonjsRegister(${JSON.stringify(
    getVirtualPathForDynamicRequirePath(normalizedPath, commonDir)
  )}, function (module, exports) {
  ${fs$8.readFileSync(normalizedPath, { encoding: 'utf8' })}
});`;
    }

    async function getStaticRequireProxy(
      id,
      requireReturnsDefault,
      esModulesWithDefaultExport,
      esModulesWithNamedExports,
      commonJsMetaPromises
    ) {
      const name = getName(id);
      const commonjsMeta = await getCommonJSMetaPromise(commonJsMetaPromises, id);
      if (commonjsMeta && commonjsMeta.isCommonJS) {
        return `export { __moduleExports as default } from ${JSON.stringify(id)};`;
      } else if (commonjsMeta === null) {
        return getUnknownRequireProxy(id, requireReturnsDefault);
      } else if (!requireReturnsDefault) {
        return `import { getAugmentedNamespace } from "${HELPERS_ID}"; import * as ${name} from ${JSON.stringify(
      id
    )}; export default /*@__PURE__*/getAugmentedNamespace(${name});`;
      } else if (
        requireReturnsDefault !== true &&
        (requireReturnsDefault === 'namespace' ||
          !esModulesWithDefaultExport.has(id) ||
          (requireReturnsDefault === 'auto' && esModulesWithNamedExports.has(id)))
      ) {
        return `import * as ${name} from ${JSON.stringify(id)}; export default ${name};`;
      }
      return `export { default } from ${JSON.stringify(id)};`;
    }

    /* eslint-disable no-param-reassign, no-undefined */

    function getCandidatesForExtension(resolved, extension) {
      return [resolved + extension, `${resolved}${require$$0$1.sep}index${extension}`];
    }

    function getCandidates(resolved, extensions) {
      return extensions.reduce(
        (paths, extension) => paths.concat(getCandidatesForExtension(resolved, extension)),
        [resolved]
      );
    }

    function getResolveId(extensions) {
      function resolveExtensions(importee, importer) {
        // not our problem
        if (importee[0] !== '.' || !importer) return undefined;

        const resolved = require$$0$1.resolve(require$$0$1.dirname(importer), importee);
        const candidates = getCandidates(resolved, extensions);

        for (let i = 0; i < candidates.length; i += 1) {
          try {
            const stats = fs$8.statSync(candidates[i]);
            if (stats.isFile()) return { id: candidates[i] };
          } catch (err) {
            /* noop */
          }
        }

        return undefined;
      }

      return function resolveId(importee, rawImporter) {
        if (isWrappedId(importee, MODULE_SUFFIX) || isWrappedId(importee, EXPORTS_SUFFIX)) {
          return importee;
        }

        const importer =
          rawImporter && isWrappedId(rawImporter, DYNAMIC_REGISTER_SUFFIX)
            ? unwrapId(rawImporter, DYNAMIC_REGISTER_SUFFIX)
            : rawImporter;

        // Except for exports, proxies are only importing resolved ids,
        // no need to resolve again
        if (importer && isWrappedId(importer, PROXY_SUFFIX)) {
          return importee;
        }

        const isProxyModule = isWrappedId(importee, PROXY_SUFFIX);
        const isRequiredModule = isWrappedId(importee, REQUIRE_SUFFIX);
        let isModuleRegistration = false;

        if (isProxyModule) {
          importee = unwrapId(importee, PROXY_SUFFIX);
        } else if (isRequiredModule) {
          importee = unwrapId(importee, REQUIRE_SUFFIX);

          isModuleRegistration = isWrappedId(importee, DYNAMIC_REGISTER_SUFFIX);
          if (isModuleRegistration) {
            importee = unwrapId(importee, DYNAMIC_REGISTER_SUFFIX);
          }
        }

        if (
          importee.startsWith(HELPERS_ID) ||
          importee === DYNAMIC_PACKAGES_ID ||
          importee.startsWith(DYNAMIC_JSON_PREFIX)
        ) {
          return importee;
        }

        if (importee.startsWith('\0')) {
          return null;
        }

        return this.resolve(importee, importer, {
          skipSelf: true,
          custom: { 'node-resolve': { isRequire: isProxyModule || isRequiredModule } }
        }).then((resolved) => {
          if (!resolved) {
            resolved = resolveExtensions(importee, importer);
          }
          if (resolved && isProxyModule) {
            resolved.id = wrapId(resolved.id, resolved.external ? EXTERNAL_SUFFIX : PROXY_SUFFIX);
            resolved.external = false;
          } else if (resolved && isModuleRegistration) {
            resolved.id = wrapId(resolved.id, DYNAMIC_REGISTER_SUFFIX);
          } else if (!resolved && (isProxyModule || isRequiredModule)) {
            return { id: wrapId(importee, EXTERNAL_SUFFIX), external: false };
          }
          return resolved;
        });
      };
    }

    function validateRollupVersion(rollupVersion, peerDependencyVersion) {
      const [major, minor] = rollupVersion.split('.').map(Number);
      const versionRegexp = /\^(\d+\.\d+)\.\d+/g;
      let minMajor = Infinity;
      let minMinor = Infinity;
      let foundVersion;
      // eslint-disable-next-line no-cond-assign
      while ((foundVersion = versionRegexp.exec(peerDependencyVersion))) {
        const [foundMajor, foundMinor] = foundVersion[1].split('.').map(Number);
        if (foundMajor < minMajor) {
          minMajor = foundMajor;
          minMinor = foundMinor;
        }
      }
      if (major < minMajor || (major === minMajor && minor < minMinor)) {
        throw new Error(
          `Insufficient Rollup version: "@rollup/plugin-commonjs" requires at least rollup@${minMajor}.${minMinor} but found rollup@${rollupVersion}.`
        );
      }
    }

    const operators = {
      '==': (x) => equals(x.left, x.right, false),

      '!=': (x) => not(operators['=='](x)),

      '===': (x) => equals(x.left, x.right, true),

      '!==': (x) => not(operators['==='](x)),

      '!': (x) => isFalsy(x.argument),

      '&&': (x) => isTruthy(x.left) && isTruthy(x.right),

      '||': (x) => isTruthy(x.left) || isTruthy(x.right)
    };

    function not(value) {
      return value === null ? value : !value;
    }

    function equals(a, b, strict) {
      if (a.type !== b.type) return null;
      // eslint-disable-next-line eqeqeq
      if (a.type === 'Literal') return strict ? a.value === b.value : a.value == b.value;
      return null;
    }

    function isTruthy(node) {
      if (!node) return false;
      if (node.type === 'Literal') return !!node.value;
      if (node.type === 'ParenthesizedExpression') return isTruthy(node.expression);
      if (node.operator in operators) return operators[node.operator](node);
      return null;
    }

    function isFalsy(node) {
      return not(isTruthy(node));
    }

    function getKeypath(node) {
      const parts = [];

      while (node.type === 'MemberExpression') {
        if (node.computed) return null;

        parts.unshift(node.property.name);
        // eslint-disable-next-line no-param-reassign
        node = node.object;
      }

      if (node.type !== 'Identifier') return null;

      const { name } = node;
      parts.unshift(name);

      return { name, keypath: parts.join('.') };
    }

    const KEY_COMPILED_ESM = '__esModule';

    function isDefineCompiledEsm(node) {
      const definedProperty =
        getDefinePropertyCallName(node, 'exports') || getDefinePropertyCallName(node, 'module.exports');
      if (definedProperty && definedProperty.key === KEY_COMPILED_ESM) {
        return isTruthy(definedProperty.value);
      }
      return false;
    }

    function getDefinePropertyCallName(node, targetName) {
      const {
        callee: { object, property }
      } = node;
      if (!object || object.type !== 'Identifier' || object.name !== 'Object') return;
      if (!property || property.type !== 'Identifier' || property.name !== 'defineProperty') return;
      if (node.arguments.length !== 3) return;

      const targetNames = targetName.split('.');
      const [target, key, value] = node.arguments;
      if (targetNames.length === 1) {
        if (target.type !== 'Identifier' || target.name !== targetNames[0]) {
          return;
        }
      }

      if (targetNames.length === 2) {
        if (
          target.type !== 'MemberExpression' ||
          target.object.name !== targetNames[0] ||
          target.property.name !== targetNames[1]
        ) {
          return;
        }
      }

      if (value.type !== 'ObjectExpression' || !value.properties) return;

      const valueProperty = value.properties.find((p) => p.key && p.key.name === 'value');
      if (!valueProperty || !valueProperty.value) return;

      // eslint-disable-next-line consistent-return
      return { key: key.value, value: valueProperty.value };
    }

    function isShorthandProperty(parent) {
      return parent && parent.type === 'Property' && parent.shorthand;
    }

    function wrapCode(magicString, uses, moduleName, exportsName) {
      const args = [];
      const passedArgs = [];
      if (uses.module) {
        args.push('module');
        passedArgs.push(moduleName);
      }
      if (uses.exports) {
        args.push('exports');
        passedArgs.push(exportsName);
      }
      magicString
        .trim()
        .prepend(`(function (${args.join(', ')}) {\n`)
        .append(`\n}(${passedArgs.join(', ')}));`);
    }

    function rewriteExportsAndGetExportsBlock(
      magicString,
      moduleName,
      exportsName,
      wrapped,
      moduleExportsAssignments,
      firstTopLevelModuleExportsAssignment,
      exportsAssignmentsByName,
      topLevelAssignments,
      defineCompiledEsmExpressions,
      deconflictedExportNames,
      code,
      HELPERS_NAME,
      exportMode,
      detectWrappedDefault,
      defaultIsModuleExports
    ) {
      const exports = [];
      const exportDeclarations = [];

      if (exportMode === 'replace') {
        getExportsForReplacedModuleExports(
          magicString,
          exports,
          exportDeclarations,
          moduleExportsAssignments,
          firstTopLevelModuleExportsAssignment,
          exportsName
        );
      } else {
        exports.push(`${exportsName} as __moduleExports`);
        if (wrapped) {
          getExportsWhenWrapping(
            exportDeclarations,
            exportsName,
            detectWrappedDefault,
            HELPERS_NAME,
            defaultIsModuleExports
          );
        } else {
          getExports(
            magicString,
            exports,
            exportDeclarations,
            moduleExportsAssignments,
            exportsAssignmentsByName,
            deconflictedExportNames,
            topLevelAssignments,
            moduleName,
            exportsName,
            defineCompiledEsmExpressions,
            HELPERS_NAME,
            defaultIsModuleExports
          );
        }
      }
      if (exports.length) {
        exportDeclarations.push(`export { ${exports.join(', ')} };`);
      }

      return `\n\n${exportDeclarations.join('\n')}`;
    }

    function getExportsForReplacedModuleExports(
      magicString,
      exports,
      exportDeclarations,
      moduleExportsAssignments,
      firstTopLevelModuleExportsAssignment,
      exportsName
    ) {
      for (const { left } of moduleExportsAssignments) {
        magicString.overwrite(left.start, left.end, exportsName);
      }
      magicString.prependRight(firstTopLevelModuleExportsAssignment.left.start, 'var ');
      exports.push(`${exportsName} as __moduleExports`);
      exportDeclarations.push(`export default ${exportsName};`);
    }

    function getExportsWhenWrapping(
      exportDeclarations,
      exportsName,
      detectWrappedDefault,
      HELPERS_NAME,
      defaultIsModuleExports
    ) {
      exportDeclarations.push(
        `export default ${
      detectWrappedDefault && defaultIsModuleExports === 'auto'
        ? `/*@__PURE__*/${HELPERS_NAME}.getDefaultExportFromCjs(${exportsName})`
        : defaultIsModuleExports === false
        ? `${exportsName}.default`
        : exportsName
    };`
      );
    }

    function getExports(
      magicString,
      exports,
      exportDeclarations,
      moduleExportsAssignments,
      exportsAssignmentsByName,
      deconflictedExportNames,
      topLevelAssignments,
      moduleName,
      exportsName,
      defineCompiledEsmExpressions,
      HELPERS_NAME,
      defaultIsModuleExports
    ) {
      let deconflictedDefaultExportName;
      // Collect and rewrite module.exports assignments
      for (const { left } of moduleExportsAssignments) {
        magicString.overwrite(left.start, left.end, `${moduleName}.exports`);
      }

      // Collect and rewrite named exports
      for (const [exportName, { nodes }] of exportsAssignmentsByName) {
        const deconflicted = deconflictedExportNames[exportName];
        let needsDeclaration = true;
        for (const node of nodes) {
          let replacement = `${deconflicted} = ${exportsName}.${exportName}`;
          if (needsDeclaration && topLevelAssignments.has(node)) {
            replacement = `var ${replacement}`;
            needsDeclaration = false;
          }
          magicString.overwrite(node.start, node.left.end, replacement);
        }
        if (needsDeclaration) {
          magicString.prepend(`var ${deconflicted};\n`);
        }

        if (exportName === 'default') {
          deconflictedDefaultExportName = deconflicted;
        } else {
          exports.push(exportName === deconflicted ? exportName : `${deconflicted} as ${exportName}`);
        }
      }

      // Collect and rewrite exports.__esModule assignments
      let isRestorableCompiledEsm = false;
      for (const expression of defineCompiledEsmExpressions) {
        isRestorableCompiledEsm = true;
        const moduleExportsExpression =
          expression.type === 'CallExpression' ? expression.arguments[0] : expression.left.object;
        magicString.overwrite(moduleExportsExpression.start, moduleExportsExpression.end, exportsName);
      }

      if (!isRestorableCompiledEsm || defaultIsModuleExports === true) {
        exportDeclarations.push(`export default ${exportsName};`);
      } else if (moduleExportsAssignments.length === 0 || defaultIsModuleExports === false) {
        exports.push(`${deconflictedDefaultExportName || exportsName} as default`);
      } else {
        exportDeclarations.push(
          `export default /*@__PURE__*/${HELPERS_NAME}.getDefaultExportFromCjs(${exportsName});`
        );
      }
    }

    function isRequireStatement(node, scope) {
      if (!node) return false;
      if (node.type !== 'CallExpression') return false;

      // Weird case of `require()` or `module.require()` without arguments
      if (node.arguments.length === 0) return false;

      return isRequire(node.callee, scope);
    }

    function isRequire(node, scope) {
      return (
        (node.type === 'Identifier' && node.name === 'require' && !scope.contains('require')) ||
        (node.type === 'MemberExpression' && isModuleRequire(node, scope))
      );
    }

    function isModuleRequire({ object, property }, scope) {
      return (
        object.type === 'Identifier' &&
        object.name === 'module' &&
        property.type === 'Identifier' &&
        property.name === 'require' &&
        !scope.contains('module')
      );
    }

    function isStaticRequireStatement(node, scope) {
      if (!isRequireStatement(node, scope)) return false;
      return !hasDynamicArguments(node);
    }

    function hasDynamicArguments(node) {
      return (
        node.arguments.length > 1 ||
        (node.arguments[0].type !== 'Literal' &&
          (node.arguments[0].type !== 'TemplateLiteral' || node.arguments[0].expressions.length > 0))
      );
    }

    const reservedMethod = { resolve: true, cache: true, main: true };

    function isNodeRequirePropertyAccess(parent) {
      return parent && parent.property && reservedMethod[parent.property.name];
    }

    function isIgnoredRequireStatement(requiredNode, ignoreRequire) {
      return ignoreRequire(requiredNode.arguments[0].value);
    }

    function getRequireStringArg(node) {
      return node.arguments[0].type === 'Literal'
        ? node.arguments[0].value
        : node.arguments[0].quasis[0].value.cooked;
    }

    function hasDynamicModuleForPath(source, id, dynamicRequireModuleSet) {
      if (!/^(?:\.{0,2}[/\\]|[A-Za-z]:[/\\])/.test(source)) {
        try {
          const resolvedPath = normalizePathSlashes(resolve.sync(source, { basedir: require$$0$1.dirname(id) }));
          if (dynamicRequireModuleSet.has(resolvedPath)) {
            return true;
          }
        } catch (ex) {
          // Probably a node.js internal module
          return false;
        }

        return false;
      }

      for (const attemptExt of ['', '.js', '.json']) {
        const resolvedPath = normalizePathSlashes(require$$0$1.resolve(require$$0$1.dirname(id), source + attemptExt));
        if (dynamicRequireModuleSet.has(resolvedPath)) {
          return true;
        }
      }

      return false;
    }

    function getRequireHandlers() {
      const requiredSources = [];
      const requiredBySource = Object.create(null);
      const requiredByNode = new Map();
      const requireExpressionsWithUsedReturnValue = [];

      function addRequireStatement(sourceId, node, scope, usesReturnValue) {
        const required = getRequired(sourceId);
        requiredByNode.set(node, { scope, required });
        if (usesReturnValue) {
          required.nodesUsingRequired.push(node);
          requireExpressionsWithUsedReturnValue.push(node);
        }
      }

      function getRequired(sourceId) {
        if (!requiredBySource[sourceId]) {
          requiredSources.push(sourceId);

          requiredBySource[sourceId] = {
            source: sourceId,
            name: null,
            nodesUsingRequired: []
          };
        }

        return requiredBySource[sourceId];
      }

      function rewriteRequireExpressionsAndGetImportBlock(
        magicString,
        topLevelDeclarations,
        topLevelRequireDeclarators,
        reassignedNames,
        helpersName,
        dynamicRegisterSources,
        moduleName,
        exportsName,
        id,
        exportMode
      ) {
        setRemainingImportNamesAndRewriteRequires(
          requireExpressionsWithUsedReturnValue,
          requiredByNode,
          magicString
        );
        const imports = [];
        imports.push(`import * as ${helpersName} from "${HELPERS_ID}";`);
        if (exportMode === 'module') {
          imports.push(
            `import { __module as ${moduleName}, exports as ${exportsName} } from ${JSON.stringify(
          wrapId(id, MODULE_SUFFIX)
        )}`
          );
        } else if (exportMode === 'exports') {
          imports.push(
            `import { __exports as ${exportsName} } from ${JSON.stringify(wrapId(id, EXPORTS_SUFFIX))}`
          );
        }
        for (const source of dynamicRegisterSources) {
          imports.push(`import ${JSON.stringify(wrapId(source, REQUIRE_SUFFIX))};`);
        }
        for (const source of requiredSources) {
          if (!source.startsWith('\0')) {
            imports.push(`import ${JSON.stringify(wrapId(source, REQUIRE_SUFFIX))};`);
          }
          const { name, nodesUsingRequired } = requiredBySource[source];
          imports.push(
            `import ${nodesUsingRequired.length ? `${name} from ` : ''}${JSON.stringify(
          source.startsWith('\0') ? source : wrapId(source, PROXY_SUFFIX)
        )};`
          );
        }
        return imports.length ? `${imports.join('\n')}\n\n` : '';
      }

      return {
        addRequireStatement,
        requiredSources,
        rewriteRequireExpressionsAndGetImportBlock
      };
    }

    function setRemainingImportNamesAndRewriteRequires(
      requireExpressionsWithUsedReturnValue,
      requiredByNode,
      magicString
    ) {
      let uid = 0;
      for (const requireExpression of requireExpressionsWithUsedReturnValue) {
        const { required } = requiredByNode.get(requireExpression);
        if (!required.name) {
          let potentialName;
          const isUsedName = (node) => requiredByNode.get(node).scope.contains(potentialName);
          do {
            potentialName = `require$$${uid}`;
            uid += 1;
          } while (required.nodesUsingRequired.some(isUsedName));
          required.name = potentialName;
        }
        magicString.overwrite(requireExpression.start, requireExpression.end, required.name);
      }
    }

    /* eslint-disable no-param-reassign, no-shadow, no-underscore-dangle, no-continue */

    const exportsPattern = /^(?:module\.)?exports(?:\.([a-zA-Z_$][a-zA-Z_$0-9]*))?$/;

    const functionType = /^(?:FunctionDeclaration|FunctionExpression|ArrowFunctionExpression)$/;

    function transformCommonjs(
      parse,
      code,
      id,
      isEsModule,
      ignoreGlobal,
      ignoreRequire,
      ignoreDynamicRequires,
      getIgnoreTryCatchRequireStatementMode,
      sourceMap,
      isDynamicRequireModulesEnabled,
      dynamicRequireModuleSet,
      disableWrap,
      commonDir,
      astCache,
      defaultIsModuleExports
    ) {
      const ast = astCache || tryParse(parse, code, id);
      const magicString = new MagicString(code);
      const uses = {
        module: false,
        exports: false,
        global: false,
        require: false
      };
      let usesDynamicRequire = false;
      const virtualDynamicRequirePath =
        isDynamicRequireModulesEnabled && getVirtualPathForDynamicRequirePath(require$$0$1.dirname(id), commonDir);
      let scope = attachScopes(ast, 'scope');
      let lexicalDepth = 0;
      let programDepth = 0;
      let currentTryBlockEnd = null;
      let shouldWrap = false;

      const globals = new Set();

      // TODO technically wrong since globals isn't populated yet, but ¯\_(ツ)_/¯
      const HELPERS_NAME = deconflict([scope], globals, 'commonjsHelpers');
      const dynamicRegisterSources = new Set();
      let hasRemovedRequire = false;

      const {
        addRequireStatement,
        requiredSources,
        rewriteRequireExpressionsAndGetImportBlock
      } = getRequireHandlers();

      // See which names are assigned to. This is necessary to prevent
      // illegally replacing `var foo = require('foo')` with `import foo from 'foo'`,
      // where `foo` is later reassigned. (This happens in the wild. CommonJS, sigh)
      const reassignedNames = new Set();
      const topLevelDeclarations = [];
      const topLevelRequireDeclarators = new Set();
      const skippedNodes = new Set();
      const moduleAccessScopes = new Set([scope]);
      const exportsAccessScopes = new Set([scope]);
      const moduleExportsAssignments = [];
      let firstTopLevelModuleExportsAssignment = null;
      const exportsAssignmentsByName = new Map();
      const topLevelAssignments = new Set();
      const topLevelDefineCompiledEsmExpressions = [];

      walk(ast, {
        enter(node, parent) {
          if (skippedNodes.has(node)) {
            this.skip();
            return;
          }

          if (currentTryBlockEnd !== null && node.start > currentTryBlockEnd) {
            currentTryBlockEnd = null;
          }

          programDepth += 1;
          if (node.scope) ({ scope } = node);
          if (functionType.test(node.type)) lexicalDepth += 1;
          if (sourceMap) {
            magicString.addSourcemapLocation(node.start);
            magicString.addSourcemapLocation(node.end);
          }

          // eslint-disable-next-line default-case
          switch (node.type) {
            case 'TryStatement':
              if (currentTryBlockEnd === null) {
                currentTryBlockEnd = node.block.end;
              }
              return;
            case 'AssignmentExpression':
              if (node.left.type === 'MemberExpression') {
                const flattened = getKeypath(node.left);
                if (!flattened || scope.contains(flattened.name)) return;

                const exportsPatternMatch = exportsPattern.exec(flattened.keypath);
                if (!exportsPatternMatch || flattened.keypath === 'exports') return;

                const [, exportName] = exportsPatternMatch;
                uses[flattened.name] = true;

                // we're dealing with `module.exports = ...` or `[module.]exports.foo = ...` –
                if (flattened.keypath === 'module.exports') {
                  moduleExportsAssignments.push(node);
                  if (programDepth > 3) {
                    moduleAccessScopes.add(scope);
                  } else if (!firstTopLevelModuleExportsAssignment) {
                    firstTopLevelModuleExportsAssignment = node;
                  }
                } else if (exportName === KEY_COMPILED_ESM) {
                  if (programDepth > 3) {
                    shouldWrap = true;
                  } else {
                    topLevelDefineCompiledEsmExpressions.push(node);
                  }
                } else {
                  const exportsAssignments = exportsAssignmentsByName.get(exportName) || {
                    nodes: [],
                    scopes: new Set()
                  };
                  exportsAssignments.nodes.push(node);
                  exportsAssignments.scopes.add(scope);
                  exportsAccessScopes.add(scope);
                  exportsAssignmentsByName.set(exportName, exportsAssignments);
                  if (programDepth <= 3) {
                    topLevelAssignments.add(node);
                  }
                }

                skippedNodes.add(node.left);
              } else {
                for (const name of extractAssignedNames(node.left)) {
                  reassignedNames.add(name);
                }
              }
              return;
            case 'CallExpression': {
              if (isDefineCompiledEsm(node)) {
                if (programDepth === 3 && parent.type === 'ExpressionStatement') {
                  // skip special handling for [module.]exports until we know we render this
                  skippedNodes.add(node.arguments[0]);
                  topLevelDefineCompiledEsmExpressions.push(node);
                } else {
                  shouldWrap = true;
                }
                return;
              }

              if (
                node.callee.object &&
                node.callee.object.name === 'require' &&
                node.callee.property.name === 'resolve' &&
                hasDynamicModuleForPath(id, '/', dynamicRequireModuleSet)
              ) {
                const requireNode = node.callee.object;
                magicString.appendLeft(
                  node.end - 1,
                  `,${JSON.stringify(
                require$$0$1.dirname(id) === '.' ? null /* default behavior */ : virtualDynamicRequirePath
              )}`
                );
                magicString.overwrite(
                  requireNode.start,
                  requireNode.end,
                  `${HELPERS_NAME}.commonjsRequire`,
                  {
                    storeName: true
                  }
                );
                return;
              }

              if (!isStaticRequireStatement(node, scope)) return;
              if (!isDynamicRequireModulesEnabled) {
                skippedNodes.add(node.callee);
              }
              if (!isIgnoredRequireStatement(node, ignoreRequire)) {
                skippedNodes.add(node.callee);
                const usesReturnValue = parent.type !== 'ExpressionStatement';

                let canConvertRequire = true;
                let shouldRemoveRequireStatement = false;

                if (currentTryBlockEnd !== null) {
                  ({
                    canConvertRequire,
                    shouldRemoveRequireStatement
                  } = getIgnoreTryCatchRequireStatementMode(node.arguments[0].value));

                  if (shouldRemoveRequireStatement) {
                    hasRemovedRequire = true;
                  }
                }

                let sourceId = getRequireStringArg(node);
                const isDynamicRegister = isWrappedId(sourceId, DYNAMIC_REGISTER_SUFFIX);
                if (isDynamicRegister) {
                  sourceId = unwrapId(sourceId, DYNAMIC_REGISTER_SUFFIX);
                  if (sourceId.endsWith('.json')) {
                    sourceId = DYNAMIC_JSON_PREFIX + sourceId;
                  }
                  dynamicRegisterSources.add(wrapId(sourceId, DYNAMIC_REGISTER_SUFFIX));
                } else {
                  if (
                    !sourceId.endsWith('.json') &&
                    hasDynamicModuleForPath(sourceId, id, dynamicRequireModuleSet)
                  ) {
                    if (shouldRemoveRequireStatement) {
                      magicString.overwrite(node.start, node.end, `undefined`);
                    } else if (canConvertRequire) {
                      magicString.overwrite(
                        node.start,
                        node.end,
                        `${HELPERS_NAME}.commonjsRequire(${JSON.stringify(
                      getVirtualPathForDynamicRequirePath(sourceId, commonDir)
                    )}, ${JSON.stringify(
                      require$$0$1.dirname(id) === '.' ? null /* default behavior */ : virtualDynamicRequirePath
                    )})`
                      );
                      usesDynamicRequire = true;
                    }
                    return;
                  }

                  if (canConvertRequire) {
                    addRequireStatement(sourceId, node, scope, usesReturnValue);
                  }
                }

                if (usesReturnValue) {
                  if (shouldRemoveRequireStatement) {
                    magicString.overwrite(node.start, node.end, `undefined`);
                    return;
                  }

                  if (
                    parent.type === 'VariableDeclarator' &&
                    !scope.parent &&
                    parent.id.type === 'Identifier'
                  ) {
                    // This will allow us to reuse this variable name as the imported variable if it is not reassigned
                    // and does not conflict with variables in other places where this is imported
                    topLevelRequireDeclarators.add(parent);
                  }
                } else {
                  // This is a bare import, e.g. `require('foo');`

                  if (!canConvertRequire && !shouldRemoveRequireStatement) {
                    return;
                  }

                  magicString.remove(parent.start, parent.end);
                }
              }
              return;
            }
            case 'ConditionalExpression':
            case 'IfStatement':
              // skip dead branches
              if (isFalsy(node.test)) {
                skippedNodes.add(node.consequent);
              } else if (node.alternate && isTruthy(node.test)) {
                skippedNodes.add(node.alternate);
              }
              return;
            case 'Identifier': {
              const { name } = node;
              if (!(isReference(node, parent) && !scope.contains(name))) return;
              switch (name) {
                case 'require':
                  if (isNodeRequirePropertyAccess(parent)) {
                    if (hasDynamicModuleForPath(id, '/', dynamicRequireModuleSet)) {
                      if (parent.property.name === 'cache') {
                        magicString.overwrite(node.start, node.end, `${HELPERS_NAME}.commonjsRequire`, {
                          storeName: true
                        });
                      }
                    }

                    return;
                  }

                  if (isDynamicRequireModulesEnabled && isRequireStatement(parent, scope)) {
                    magicString.appendLeft(
                      parent.end - 1,
                      `,${JSON.stringify(
                    require$$0$1.dirname(id) === '.' ? null /* default behavior */ : virtualDynamicRequirePath
                  )}`
                    );
                  }
                  if (!ignoreDynamicRequires) {
                    if (isShorthandProperty(parent)) {
                      magicString.appendRight(node.end, `: ${HELPERS_NAME}.commonjsRequire`);
                    } else {
                      magicString.overwrite(node.start, node.end, `${HELPERS_NAME}.commonjsRequire`, {
                        storeName: true
                      });
                    }
                  }
                  usesDynamicRequire = true;
                  return;
                case 'module':
                case 'exports':
                  shouldWrap = true;
                  uses[name] = true;
                  return;
                case 'global':
                  uses.global = true;
                  if (!ignoreGlobal) {
                    magicString.overwrite(node.start, node.end, `${HELPERS_NAME}.commonjsGlobal`, {
                      storeName: true
                    });
                  }
                  return;
                case 'define':
                  magicString.overwrite(node.start, node.end, 'undefined', {
                    storeName: true
                  });
                  return;
                default:
                  globals.add(name);
                  return;
              }
            }
            case 'MemberExpression':
              if (!isDynamicRequireModulesEnabled && isModuleRequire(node, scope)) {
                magicString.overwrite(node.start, node.end, `${HELPERS_NAME}.commonjsRequire`, {
                  storeName: true
                });
                skippedNodes.add(node.object);
                skippedNodes.add(node.property);
              }
              return;
            case 'ReturnStatement':
              // if top-level return, we need to wrap it
              if (lexicalDepth === 0) {
                shouldWrap = true;
              }
              return;
            case 'ThisExpression':
              // rewrite top-level `this` as `commonjsHelpers.commonjsGlobal`
              if (lexicalDepth === 0) {
                uses.global = true;
                if (!ignoreGlobal) {
                  magicString.overwrite(node.start, node.end, `${HELPERS_NAME}.commonjsGlobal`, {
                    storeName: true
                  });
                }
              }
              return;
            case 'UnaryExpression':
              // rewrite `typeof module`, `typeof module.exports` and `typeof exports` (https://github.com/rollup/rollup-plugin-commonjs/issues/151)
              if (node.operator === 'typeof') {
                const flattened = getKeypath(node.argument);
                if (!flattened) return;

                if (scope.contains(flattened.name)) return;

                if (
                  flattened.keypath === 'module.exports' ||
                  flattened.keypath === 'module' ||
                  flattened.keypath === 'exports'
                ) {
                  magicString.overwrite(node.start, node.end, `'object'`, {
                    storeName: false
                  });
                }
              }
              return;
            case 'VariableDeclaration':
              if (!scope.parent) {
                topLevelDeclarations.push(node);
              }
          }
        },

        leave(node) {
          programDepth -= 1;
          if (node.scope) scope = scope.parent;
          if (functionType.test(node.type)) lexicalDepth -= 1;
        }
      });

      const nameBase = getName(id);
      const exportsName = deconflict([...exportsAccessScopes], globals, nameBase);
      const moduleName = deconflict([...moduleAccessScopes], globals, `${nameBase}Module`);
      const deconflictedExportNames = Object.create(null);
      for (const [exportName, { scopes }] of exportsAssignmentsByName) {
        deconflictedExportNames[exportName] = deconflict([...scopes], globals, exportName);
      }

      // We cannot wrap ES/mixed modules
      shouldWrap =
        !isEsModule &&
        !disableWrap &&
        (shouldWrap || (uses.exports && moduleExportsAssignments.length > 0));
      const detectWrappedDefault =
        shouldWrap &&
        (topLevelDefineCompiledEsmExpressions.length > 0 || code.indexOf('__esModule') >= 0);

      if (
        !(
          requiredSources.length ||
          dynamicRegisterSources.size ||
          uses.module ||
          uses.exports ||
          uses.require ||
          usesDynamicRequire ||
          hasRemovedRequire ||
          topLevelDefineCompiledEsmExpressions.length > 0
        ) &&
        (ignoreGlobal || !uses.global)
      ) {
        return { meta: { commonjs: { isCommonJS: false } } };
      }

      let leadingComment = '';
      if (code.startsWith('/*')) {
        const commentEnd = code.indexOf('*/', 2) + 2;
        leadingComment = `${code.slice(0, commentEnd)}\n`;
        magicString.remove(0, commentEnd).trim();
      }

      const exportMode = shouldWrap
        ? uses.module
          ? 'module'
          : 'exports'
        : firstTopLevelModuleExportsAssignment
        ? exportsAssignmentsByName.size === 0 && topLevelDefineCompiledEsmExpressions.length === 0
          ? 'replace'
          : 'module'
        : moduleExportsAssignments.length === 0
        ? 'exports'
        : 'module';

      const importBlock = rewriteRequireExpressionsAndGetImportBlock(
        magicString,
        topLevelDeclarations,
        topLevelRequireDeclarators,
        reassignedNames,
        HELPERS_NAME,
        dynamicRegisterSources,
        moduleName,
        exportsName,
        id,
        exportMode
      );

      const exportBlock = isEsModule
        ? ''
        : rewriteExportsAndGetExportsBlock(
            magicString,
            moduleName,
            exportsName,
            shouldWrap,
            moduleExportsAssignments,
            firstTopLevelModuleExportsAssignment,
            exportsAssignmentsByName,
            topLevelAssignments,
            topLevelDefineCompiledEsmExpressions,
            deconflictedExportNames,
            code,
            HELPERS_NAME,
            exportMode,
            detectWrappedDefault,
            defaultIsModuleExports
          );

      if (shouldWrap) {
        wrapCode(magicString, uses, moduleName, exportsName);
      }

      magicString
        .trim()
        .prepend(leadingComment + importBlock)
        .append(exportBlock);

      return {
        code: magicString.toString(),
        map: sourceMap ? magicString.generateMap() : null,
        syntheticNamedExports: isEsModule ? false : '__moduleExports',
        meta: { commonjs: { isCommonJS: !isEsModule } }
      };
    }

    function commonjs(options = {}) {
      const extensions = options.extensions || ['.js'];
      const filter = createFilter(options.include, options.exclude);
      const {
        ignoreGlobal,
        ignoreDynamicRequires,
        requireReturnsDefault: requireReturnsDefaultOption,
        esmExternals
      } = options;
      const getRequireReturnsDefault =
        typeof requireReturnsDefaultOption === 'function'
          ? requireReturnsDefaultOption
          : () => requireReturnsDefaultOption;
      let esmExternalIds;
      const isEsmExternal =
        typeof esmExternals === 'function'
          ? esmExternals
          : Array.isArray(esmExternals)
          ? ((esmExternalIds = new Set(esmExternals)), (id) => esmExternalIds.has(id))
          : () => esmExternals;
      const defaultIsModuleExports =
        typeof options.defaultIsModuleExports === 'boolean' ? options.defaultIsModuleExports : 'auto';

      const { dynamicRequireModuleSet, dynamicRequireModuleDirPaths } = getDynamicRequirePaths(
        options.dynamicRequireTargets
      );
      const isDynamicRequireModulesEnabled = dynamicRequireModuleSet.size > 0;
      const commonDir = isDynamicRequireModulesEnabled
        ? commondir(null, Array.from(dynamicRequireModuleSet).concat(process.cwd()))
        : null;

      const esModulesWithDefaultExport = new Set();
      const esModulesWithNamedExports = new Set();
      const commonJsMetaPromises = new Map();

      const ignoreRequire =
        typeof options.ignore === 'function'
          ? options.ignore
          : Array.isArray(options.ignore)
          ? (id) => options.ignore.includes(id)
          : () => false;

      const getIgnoreTryCatchRequireStatementMode = (id) => {
        const mode =
          typeof options.ignoreTryCatch === 'function'
            ? options.ignoreTryCatch(id)
            : Array.isArray(options.ignoreTryCatch)
            ? options.ignoreTryCatch.includes(id)
            : options.ignoreTryCatch || false;

        return {
          canConvertRequire: mode !== 'remove' && mode !== true,
          shouldRemoveRequireStatement: mode === 'remove'
        };
      };

      const resolveId = getResolveId(extensions);

      const sourceMap = options.sourceMap !== false;

      function transformAndCheckExports(code, id) {
        if (isDynamicRequireModulesEnabled && this.getModuleInfo(id).isEntry) {
          // eslint-disable-next-line no-param-reassign
          code =
            getDynamicPackagesEntryIntro(dynamicRequireModuleDirPaths, dynamicRequireModuleSet) + code;
        }

        const { isEsModule, hasDefaultExport, hasNamedExports, ast } = analyzeTopLevelStatements(
          this.parse,
          code,
          id
        );
        if (hasDefaultExport) {
          esModulesWithDefaultExport.add(id);
        }
        if (hasNamedExports) {
          esModulesWithNamedExports.add(id);
        }

        if (
          !dynamicRequireModuleSet.has(normalizePathSlashes(id)) &&
          (!hasCjsKeywords(code, ignoreGlobal) || (isEsModule && !options.transformMixedEsModules))
        ) {
          return { meta: { commonjs: { isCommonJS: false } } };
        }

        // avoid wrapping as this is a commonjsRegister call
        const disableWrap = isWrappedId(id, DYNAMIC_REGISTER_SUFFIX);
        if (disableWrap) {
          // eslint-disable-next-line no-param-reassign
          id = unwrapId(id, DYNAMIC_REGISTER_SUFFIX);
        }

        return transformCommonjs(
          this.parse,
          code,
          id,
          isEsModule,
          ignoreGlobal || isEsModule,
          ignoreRequire,
          ignoreDynamicRequires && !isDynamicRequireModulesEnabled,
          getIgnoreTryCatchRequireStatementMode,
          sourceMap,
          isDynamicRequireModulesEnabled,
          dynamicRequireModuleSet,
          disableWrap,
          commonDir,
          ast,
          defaultIsModuleExports
        );
      }

      return {
        name: 'commonjs',

        buildStart() {
          validateRollupVersion(this.meta.rollupVersion, peerDependencies.rollup);
          if (options.namedExports != null) {
            this.warn(
              'The namedExports option from "@rollup/plugin-commonjs" is deprecated. Named exports are now handled automatically.'
            );
          }
        },

        resolveId,

        load(id) {
          if (id === HELPERS_ID) {
            return getHelpersModule(isDynamicRequireModulesEnabled, ignoreDynamicRequires);
          }

          if (id.startsWith(HELPERS_ID)) {
            return getSpecificHelperProxy(id);
          }

          if (isWrappedId(id, MODULE_SUFFIX)) {
            const actualId = unwrapId(id, MODULE_SUFFIX);
            let name = getName(actualId);
            let code;
            if (isDynamicRequireModulesEnabled) {
              if (['modulePath', 'commonjsRequire', 'createModule'].includes(name)) {
                name = `${name}_`;
              }
              code =
                `import {commonjsRequire, createModule} from "${HELPERS_ID}";\n` +
                `var ${name} = createModule(${JSON.stringify(
              getVirtualPathForDynamicRequirePath(require$$0$1.dirname(actualId), commonDir)
            )});\n` +
                `export {${name} as __module}`;
            } else {
              code = `var ${name} = {exports: {}}; export {${name} as __module}`;
            }
            return {
              code,
              syntheticNamedExports: '__module',
              meta: { commonjs: { isCommonJS: false } }
            };
          }

          if (isWrappedId(id, EXPORTS_SUFFIX)) {
            const actualId = unwrapId(id, EXPORTS_SUFFIX);
            const name = getName(actualId);
            return {
              code: `var ${name} = {}; export {${name} as __exports}`,
              meta: { commonjs: { isCommonJS: false } }
            };
          }

          if (isWrappedId(id, EXTERNAL_SUFFIX)) {
            const actualId = unwrapId(id, EXTERNAL_SUFFIX);
            return getUnknownRequireProxy(
              actualId,
              isEsmExternal(actualId) ? getRequireReturnsDefault(actualId) : true
            );
          }

          if (id === DYNAMIC_PACKAGES_ID) {
            return getDynamicPackagesModule(dynamicRequireModuleDirPaths, commonDir);
          }

          if (id.startsWith(DYNAMIC_JSON_PREFIX)) {
            return getDynamicJsonProxy(id, commonDir);
          }

          if (isDynamicModuleImport(id, dynamicRequireModuleSet)) {
            return `export default require(${JSON.stringify(normalizePathSlashes(id))});`;
          }

          if (isWrappedId(id, DYNAMIC_REGISTER_SUFFIX)) {
            return getDynamicRequireProxy(
              normalizePathSlashes(unwrapId(id, DYNAMIC_REGISTER_SUFFIX)),
              commonDir
            );
          }

          if (isWrappedId(id, PROXY_SUFFIX)) {
            const actualId = unwrapId(id, PROXY_SUFFIX);
            return getStaticRequireProxy(
              actualId,
              getRequireReturnsDefault(actualId),
              esModulesWithDefaultExport,
              esModulesWithNamedExports,
              commonJsMetaPromises
            );
          }

          return null;
        },

        transform(code, rawId) {
          let id = rawId;

          if (isWrappedId(id, DYNAMIC_REGISTER_SUFFIX)) {
            id = unwrapId(id, DYNAMIC_REGISTER_SUFFIX);
          }

          const extName = require$$0$1.extname(id);
          if (
            extName !== '.cjs' &&
            id !== DYNAMIC_PACKAGES_ID &&
            !id.startsWith(DYNAMIC_JSON_PREFIX) &&
            (!filter(id) || !extensions.includes(extName))
          ) {
            return null;
          }

          try {
            return transformAndCheckExports.call(this, code, rawId);
          } catch (err) {
            return this.error(err, err.loc);
          }
        },

        moduleParsed({ id, meta: { commonjs: commonjsMeta } }) {
          if (commonjsMeta && commonjsMeta.isCommonJS != null) {
            setCommonJSMetaPromise(commonJsMetaPromises, id, commonjsMeta);
            return;
          }
          setCommonJSMetaPromise(commonJsMetaPromises, id, null);
        }
      };
    }

    var config = {
      input: './src/index.js',
      output: {
        // file: 'dist/bundle.js',
        dir: 'dist',
        format: 'amd',
      },
      plugins: [json(), nodeResolve(), commonjs()],
    };

    // import _ from 'lodash-es';

    console.log(lee, config.input);
    // console.log(_.clone(lee));

    Promise.resolve().then(function () { return lee$1; }).then((o) => {
      console.log(o);
    });

});
