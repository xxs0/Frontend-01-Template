const EOF = Symbol("EOF");  // EOF: Enf Of File; 文本节点的结束在文件结束时自然结束。没遇到特殊标签前分析器保持等待字符补全的状态，可能无法将文件挂上。
let currentToken = null;
function emit(token) {
    // if (token.type != 'text') {
        console.log(token);
    // }
}

function data(i) {
    if (i === '<') {
        return tagOpen;
    } else if (i === EOF) {
        emit({
            type: 'EOF'
        })
        return;
    } else {
        emit({
            type: 'text',
            content: i
        })
        return data;
    }
}

function tagOpen(i) {
    if (i === '/') {
        return endTagOpen;
    } else if (i.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: "startTag",
            tagName: ""
        }
        return tagName(i);
    } else {
        return;
    }
}

function endTagOpen(i) {
    if (i === '>') {

    } else if (i.match(/^[a-zA-Z]+$/)) {
        currentToken = {
            type: "endTag",
            tagName: ""
        }
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
        return selfClosingStartTag;
    } else if (i.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += i.toLowerCase();
        return tagName;
    } else if (i === '>') {
        emit(currentToken);
        return data;
    } else {
        // currentToken.tagName += i.toLowerCase();
        return tagName;
    }
}

function beforeAttributeName(i) {
    // console.log(JSON.stringify(i))
    if (i.match(/^[\r\n\f ]$/)) {
        return beforeAttributeName;
    } else if (i === '/' || i === '>' || i === EOF) {
        return beforeAttributeName;
    } else if (i === '=') {
        return beforeAttributeName;
    } else {
        return beforeAttributeName;
    }
}

function selfClosingStartTag(i) {
    if (i === '>') {
        currentToken.isSelfClosing = true;
        return data;
    } else if (i === EOF ) {

    } else  {
        
    }
}

module.exports.parseHTML = function parseHTML(html) {
    // console.log(html);
    let state = data;
    for (let i of html) {
        state = state(i);
    }
    state = state(EOF);
}