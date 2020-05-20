const css = require('css');

let rules = [];

module.exports.addCSSRules =function addCSSRules(text) {
    let ast = css.parse(text);
    console.log(JSON.stringify(ast, null, "   "));
    rules.push(...ast.stylesheet.rules);
}

function match(element, selector) {
    if (!selector || !element.attributes) {
        return false;
    }

    if (selector.charAt(0) === '#') {
        let attr = element.attributes.filter(attr => attr.name === 'id')[0]
        if (attr && attr.value === selector.replace('#', '')) {
            return true;
        }
    } else if (selector.charAt(0) === '.') {
        let attr = element.attributes.filter(attr => attr.name === 'class')[0]
        if (attr && attr.value === selector.replace('.', '')) {
            return true;
        }
    } else {
        if (element.tagName === selector) {
            return true;
        }
    }
}

function specificity(selector) {
    let p = [0, 0, 0, 0],
        selectorParts = selector.split(" ");
    for (var part of selectorParts) {
        if (part.charAt(0) === "#") {
            p[1] += 1;
        } else if (part.charAt[0] === '.') {
            p[2] += 1;
        } else {
            p[3] += 1;
        }
    }
    return p;
}

function compare(sp1, sp2) {
    if (sp1[0] - sp2[0]) {
        return sp1[0] - sp2[0];
    }
    if (sp1[1] = sp2[1]) {
        return sp1[1] - sp2[1];
    }
    if (sp1[2] - sp2[2]) {
        return sp1[2] - sp2[2];
    }
    return sp1[3] - sp2[3];
}

module.exports.computeCSS = function computeCSS(element, stack) {
    let elements = stack.slice().reverse();
    if (!element.computedStyle) {
        element.computedStyle = {};
    }

    for (let rule of rules) {
        let selectorParts = rule.selectors[0].split(" ").reverse();

        if (!match(element, selectorParts[0])) {
            continue;
        }

        let j = 1, matched = false;
        for(let i = 0; i < elements.length; i++) {
            if (match(elements[i], selectorParts[j])) {
                j++;
            }
        }
        
        if (j >= selectorParts.length) {
            matched = true;
        }

        if (matched) {
            let sp = specificity(rule.selectors[0]),
            computedStyle = element.computedStyle;
            for (let declaration of rule.declarations) {
                if (!computedStyle[declaration.porperty]) {
                    computedStyle[declaration.porperty] = {}
                }

                if (!computedStyle[declaration.porperty].specificity) {
                    computedStyle[declaration.porperty].value = declaration.value;
                    computedStyle[declaration.porperty].specificity = sp;
                } else if (compare(computedStyle[declaration.porperty].specificity, sp) < 0) {
                    computedStyle[declaration.porperty].value = declaration.value;
                    computedStyle[declaration.porperty].specificity = sp;
                }
            }
        }
    }
}