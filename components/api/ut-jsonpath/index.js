const JSONPath = require('jsonpath').JSONPath;
// [\w.<>*@$:?-,"=]+
const pathExpressionRegexp = /(\$(\.{1,2}(\*|\w{1,})){0,}(\[[\w.<>*@&:?\s\-,"=()]{1,}\]){0,})/g;
class UtJSONPath extends JSONPath {
    extract(source, template, obj = {}, key) {
        if (Array.isArray(template)) {
            const path = template[0];
            const subpath = template[1];
            const arr = this.query(source, path)[0];
            if (arr.length && subpath) {
                obj = obj[key] = [];
                arr.forEach((record, i) => {
                    this.extract(record, subpath, obj, i);
                });
            } else {
                obj[key] = arr;
            }
        } else if (typeof template === 'object') {
            if (typeof key !== 'undefined') {
                obj = obj[key] = {};
            }
            for (let prop in template) {
                this.extract(source, template[prop], obj, prop);
            }
        } else if (typeof template === 'string') {
            const matches = template.match(pathExpressionRegexp);
            let value;
            if (matches) {
                if (matches.length === 1) {
                    value = this.query(source, matches[0])[0];
                } else {
                    value = matches.reduce((template, match) => {
                        return template.replace(match, (replacement) => {
                            return this.query(source, match)[0] || replacement;
                        });
                    }, template);
                }
            } else {
                value = template;
            }
            if (key) {
                obj[key] = value;
            } else {
                obj = value;
            }
        }
        return obj;
    }
}

const instance = new UtJSONPath();
instance.JSONPath = UtJSONPath;

module.exports = instance;
