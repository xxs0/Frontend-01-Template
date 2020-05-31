const EOF = Symbol("EOF");  // EOF: Enf Of File; 文本节点的结束在文件结束时自然结束。没遇到特殊标签前分析器保持等待字符补全的状态，可能无法将文件挂上。

function data(i) {
    if (i === '<') {
        return tagOpen;
    } else if (i === EOF) {
        return;
    } else {
        return data;
    }
}

function tagOpen(i) {
    if (i === '/') {
        return endTagOpen;
    } else if (i.match(/^[a-zA-Z]$/)) {
        return tagName(i);
    } else {
        return;
    }
}

function endTagOpen(i) {
    if (i === '>') {

    } else if (i.match(/^[a-zA-Z]+$/)) {
        return tagName(i);
    } else if (i === EOF) {

    } else {
        return;
    }
}

function tagName(i) {
    if (i.match(/^[\r\n\f ]$/)) {
        return beforeAttributeName;
    } else if (i === '/') {
        return selfClosingstartTag;
    } else if (i === '>') {
        return data;
    } else if (i.match(/^[a-zA-Z]$/)) {
        return tagName;
    } else {
        return tagName;
    }
}

function beforeAttributeName(i) {
    if (i.match(/^[\r\n\f ]$/)) {

    } else if (i === '/' || i === '>' || i === EOF) {
        return beforeAttributeName;
    } else if (i === '=') {
        return beforeAttributeName;
    } else {
        return beforeAttributeName;
    }
}

function selfClosingstartTag(i) {
    if (i === '>') {
        return data;
    } else if (i === EOF ) {

    } else  {
        
    }
}

module.exports.parseHTML = function parseHTML(html) {
    console.log(html);
    let state = data;
    for (let i of html) {
        state = state(i);
    }
    state = state(EOF);
}