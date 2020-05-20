// EOF: End of File
const EOF = Symbol('EOF');
let currentToken = null;
let currentAttribute = null;

let stack = [{type: "document", children: []}];
let currentTextNode = null;

function emit(token) {
    let top = stack[stack.length -1];
    if (token.type === 'startTag') {
        let element = {
            type: 'element',
            children: [],
            attributes: []
        }
        element.tagName = token.tagName;

        for (let e in token) {
            if (e !== 'type' || e !== 'tagName') {
                element.attributes.push({
                    name: e,
                    value: token[e]
                })
            }
        }

        top.children.push(element);
        // element.parent = top;

        if (!token.isSelfClosing) {
            stack.push(element);
        }

        currentTextNode =null;
    } else if (token.type === 'endTag') {
        if (top.tagName !== token.tagName) {
            throw new Error("Tag start end doesn't match!");
        } else {
            stack.pop();
        }
        currentTextNode = null;
    } else if (token.type === 'text') {
        if (currentTextNode === null) {
            currentTextNode = {
                type: 'text',
                content: ''
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
    console.log(token)
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
            type: 'startTag',
            tagName: ''
        }
        return tagName(i);
    } else {
        emit({
            type: 'text',
            content: i
        })
        return;
    }
}

function tagName(i) {
    if (i.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (i === '/') {
        return selfClosingStartTag;
    } else if (i.match(/^[a-zA-Z]$/)) {
        currentToken.tagName += i;
        return tagName;
    } else if (i === '>') {
        emit(currentToken);
        return data;
    } else {
        currentToken.tagName += i;
        return tagName;
    }
}

function beforeAttributeName(i) {
    if (i.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (i === '/' || i === '>' || i === EOF) {
        return afterAttributeName(i);
    } else if (i === '=') {

    } else {
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(i);
    }
}


// 5
function attributeName(i) {
    if (i.match(/^[\t\n\f ]$/) || i === '/' || i === '>' || i === EOF) {
        return afterAttributeName(i);
    } else if (i === '=') {
        return beforeAttributeValue;
    } else if (i === '\u0000') {

    } else if (i === '\"' || i === "'" || i === '<') {

    } else {
        currentAttribute.name += i;
        return attributeName;
    }
}

function beforeAttributeValue(i) {
    if (i.match(/^[\t\n\f ]$/) || i === '/' || i === '>' || i === EOF) {
        return beforeAttributeValue;
    } else if (i === '\"') {
        return doubleQuotedAttributeValue;
    } else if (i === '\'') {
        return singleQuoteAttributeValue;
    } else if (i === '>') {

    } else {
        return unquotedAttributeValue(i);
    }
}

function afterAttributeName(i) {
    if (i.match(/^[\t\n\f ]$/)) {
        return afterAttributeName;
    } else if (i === '/') {
        return selfClosingStartTag;
    } else if (i === '=') {
        return beforeAttributeValue;
    } else if (i === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (i === EOF) {

    } else {
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name: '',
            value: ''
        }
        return attributeName(i);
    }
}

// 5
function doubleQuotedAttributeValue(i) {
    if (i === "\"") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (i === "\u0000") {

    } else if (i === EOF) {

    } else {
        currentAttribute.value += i;
        return doubleQuotedAttributeValue;
    }
}

// 5
function singleQuoteAttributeValue(i) {
    if (i === "\'") {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttributeValue;
    } else if (i === "\u0000") {

    } else if (i === EOF) {

    } else {
        currentAttribute.value += i;
        return doubleQuotedAttributeValue;
    }
}

// 5
function afterQuotedAttributeValue(i) {
    if (i.match(/^[\t\n\f ]$/)) {
        return beforeAttributeName;
    } else if (i === '/') {
        return selfClosingStartTag;
    } else if (i === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (i === EOF) {

    } else {
        currentAttribute.value += i;
        return doubleQuotedAttributeValue;
    }
}

// 5
function unquotedAttributeValue(i) {
    if (i.match(/^[\t\n\f ]$/)) {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    } else if (i === '/') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    } else if (i === '>') {
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    } else if (i === '\u0000') {

    } else if (i === '\"' || i === "'" || i === '<' || i === '>' || i === '`') {

    } else if (i === EOF) {

    } else {
        currentAttribute.value += i;
        return unquotedAttributeValue;
    }
}

function selfClosingStartTag(i) {
    if (i === '>') {
        currentToken.isSelfClosing = true;
        emit(currentToken);
        return data;
    } else if (i === 'EOF') {

    } else {

    }
}

function endTagOpen(i) {
    if (i.match(/^[a-zA-Z]$/)) {
        currentToken = {
            type: 'endTag',
            tagName: ''
        }
        return tagName(i);
    } else if (i === '>') {

    } else if (i === EOF) {

    } else {

    }
}

module.exports.parseHTML = function parseHTML(html) {
    console.log(html);

    // 01 创建状态机
    let state = data;
    for (let c of html) {
        state = state(c);
    }
    state = state(EOF);
    return stack[0];
}