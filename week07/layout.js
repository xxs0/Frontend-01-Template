function getStyle(element) {
    if (!element.style) {
        element.style = {};
    }

    for (let prop in element.computedStyle) {
        element.style[prop] = element.computedStyle[prop].value;

        if (element.style[prop].toString().match(/px$/)) {
            element.style[prop] = parseInt(element.style[prop])
        }
        if (element.style[prop].toString().match(/^[0-9\.]+$/)) {
            element.style[prop] = parseInt(element.style[prop]);
        }
    }
    return element.style;
}

function layout(element) {

    if (!element.computedStyle) {
        return;
    }


    let elementStyle = getStyle(element);
    if (elementStyle.display !== 'flex') {
        return;
    }

    let items = element.children.filter(el => el.type === "element");

    items.sort((a, b) => (a.order || 0) - (b.order || 0));

    let style = elementStyle;

    ['width', 'height'].forEach(size => {
        if (style[size] === "auto" || style[size] === "") {
            style[size] = null;
        }
    })

    if (!style.flexDirection || style.flexDirection === "auto") {
        style.flexDirection = "row";
    }
    if (!style.alignItems || style.alignItems === "auto") {
        style.alignItems = "stretch";
    }
    if (!style.justifyContent || style.justifyContent === "auto") {
        style.justifyContent = "flex-start";
    }
    if (!style.flexWrap || style.flexWrap === "auto") {
        style.flexWrap = "nowrap";
    }
    if (!style.alignContent || style.alignContent === "auto") {
        style.alignContent = "stretch";
    }

    let mainSize, mainStart, mainEnd, mainSign, mainBase, crossSize, crossStart, crossEnd, crossSign, crossBase;
    if (style.flexDirection === "row") {
        mainSize = "width";
        mainStart = "left";
        mainEnd = "right";
        mainSign = +1;
        mainBase = 0;
        crossSize = "height";
        crossStart = "top";
        crossEnd = "bottom";
    }
    if (style.flexDirection === "row-reverse") {
        mainSize = "width";
        mainStart = "right";
        mainEnd = "left";
        mainSign = -1;
        mainBase = style.width;
        crossSize = "height";
        crossStart = "top";
        crossEnd = "bottom"; 
    }
    if (style.flexDirection === "column") {
        mainSize = "height";
        mainStart = "top";
        mainEnd = "bottom";
        mainSign = +1;
        mainBase = 0;
        crossSize = "width";
        crossStart = "left";
        crossEnd = "right"; 
    }
    if (style.flexDirection === "column-reverse") {
        mainSize = "height";
        mainStart = "bottom";
        mainEnd = "top";
        mainSign = -1;
        mainBase = style.width;
        crossSize = "width";
        crossStart = "left";
        crossEnd = "right"; 
    }
    if (style.flexWrap === "wrap-reverse") {
        let tem = crossStart;
        crossStart = crossEnd;
        crossEnd = tmp;
        crossSign = -1;
    } else {
        crossBase = 0;
        crossSign = 1;
    }

    let isAutoMainSize = false;
    if (!style[mainSize]) {
        elementStyle[mainSize] = 0;
        for (let index =  0; index < items.length; index++) {
            let item = array[index], itemStyle = getStyle(item);
            if (itemStyle[mainSize] !== null || itemStyle[mainSize] !== (void 0)) {
                elementStyle[mainSize] = elementStyle[mainSize] + itemStyle[mainSize];
            }
            isAutoMainSize = true;
        }
    }

    let flexLine = [], flexLines = [flexLine];
    let mainSpace = elementStyle[mainSize], crossSpace = 0;
    
    for (let index = 0; index < items.length; index++) {
        let item = items[index], itemStyle = getStyle(item);
        if (itemStyle[mainSize] === null) {
            itemStyle[mainSize] = 0;
        }

        if (itemStyle.flex) {
            flexLine.push(item);
        } else if (style.flexWrap === "nowrap" && isAutoMainSize) {
            mainSize -= itemStyle[mainSize];
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            flexLine.push(item);
        } else {
            if (itemStyle[mainSize] > style[mainSize]) {
                itemStyle[mainSize] = style[mainSize];
            }
            if (mainSpace < itemStyle[mainSize]) {
                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;
                flexLine = [item];
                flexLines.push(flexLine);
                mainSpace = style[mainSize];
                crossSpace = 0;
            } else {
                flexLine.push(item);
            }
            if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
            }
            mainSpace -= itemStyle[mainSize];
        }
    }
    flexLine.mainSpace = mainSpace;

    if (style.flexWrap === "nowrap" || isAutoMainSize) {
        flexLine.crossSpace = (style[crossSize] !== undefined) ? style[crossSize] : crossSpace;
    } else {
        flexLine.crossSpace = crossSpace;
    }

    if (mainSpace < 0) {
        // overflow, scale every item. (only if container is single line)
        let scale = style[mainSize] / (style[mainSize] - mainSpace); 
        let currentMain = mainBase;
        for (let index = 0; index < items.length; index++) {
            let item = items[index], itemStyle = getStyle(item);

            if (itemStyle.flex) {
                itemStyle[mainSize] = 0;
            }

            itemStyle[mainSize] = itemStyle[mainSize] * scale;

            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
        }
    } else {
        // process each flex line
        flexLines.forEach(items => {
            // console.log(10,items)
            let mainSpace = items.mainSpace,
            flexTotal = 0;
            for (let index = 0; index < items.length; index++) {
                let item = items[index], itemStyle = getStyle(item);

                if ((itemStyle.flex !== null) && (itemStyle.flex !== (void 0))) {
                    flexTotal += itemStyle.flex;
                    continue;
                }
            }

            if (flexTotal > 0) { // flexiable flex items
                let currentMain = mainBase;
                for (let index = 0; index < items.length; index++) {
                    let item = array[index], itemStyle = getStyle(item);
                    
                    if (itemStyle.flex) {
                        itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
                    }
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd];
                }
            } else { // *No* flexible flex items. justifyContent should work.
                if (style.justifyContent === "flex-start") {
                    var currentMain = mainBase, step = 0;
                }
                if (style.justifyContent === "flex-end") {
                    var currentMain = mainSpace * mainSign + mainBase, step = 0;
                }
                if (style.justifyContent === "center") {
                    var currentMain = mainSpace / 2 * mainSign + mainBase, step = 0;
                }
                if (style.justifyContent === "space-between") {
                    var currentMain = mainBase, step = mainSpace / (items.length - 1) * mainSign;
                }
                if (style.justifyContent === "space-around") {
                    var step = mainSpace / items.length * mainSign, currentMain = step / 2 + mainBase;
                }

                for (let index = 0; index < items.length; index++) {
                    let item = items[index], itemStyle = getStyle(item);
                    itemStyle[mainStart] = currentMain;
                    itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize];
                    currentMain = itemStyle[mainEnd] + step;
                }
            }
        })
    }

    // compute cross axis sizes. align-items. algin-self.
    // let crossSpace;
    if (!style[crossSize]) {
        crossSpace = 0;
        elementStyle[crossSize] = 0;
        for (let index = 0; index < flexLines.length; index++) {
            elementStyle[crossSize] = elementStyle[crossSize] + flexLines[index].crossSpace;
        }
    } else {
        crossSpace = style[crossSize];
        for (let index = 0; index < flexLines.length; index++) {
            crossSpace -= flexLines[index].crossSpace;
        }
    }

    if (style.flexWrap === "wrap-reverse") {
        crossBase = style[crossSize];
    } else {
        crossBase = 0;
    }

    let lineSize = style[crossSize] / flexLines.length;

    let step;

    if (style.alignContent === "flex-start") {
        crossBase += 0;
        step = 0;
    }
    if (style.alignContent === "flex-end") {
        crossBase += crossSign * crossSpace;
        step = 0;
    }
    if (style.alignContent === "center") {
        crossBase += crossSign * crossSpace / 2;
        step = 0;
    }
    if (style.alignContent === "space-between") {
        crossBase += 0;
        step = crossSpace / (flexLines.length - 1);
    }
    if (style.alignContent === "space-around") {
        step = crossSpace / (flexLines.length);
        crossBase += crossSign * step / 2;
    }
    if (style.alignContent === "stretch") {
        crossBase += 0;
        step = 0;
    }

    flexLines.forEach(items => {
        let lineCrossSize = style.alignContent === "stretch" ? items.crossSpace + crossSpace / flexLines.length : items.crossSpace;
        for (let index = 0; index < items.length; index++) {
            let item = items[index], itemStyle = getStyle(item);
            let algin = itemStyle.alignSelf || style.alginItems;

            if (item === null) {
                itemStyle[crossSize] = (algin === "stretch") ? lineCrossSize : 0;
            }
            if (algin === "flex-start") {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }
            if (algin === "flex-end") {
                itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
                itemStyle[crossStart] = itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
            }
            if (algin === "center") {
                itemStyle[crossStart] = crossBase + crossSign * (lineCrossSize - itemStyle[crossSize]) / 2;
                itemStyle[crossEnd] = itemStyle[crossStart] + crossSign * itemStyle[crossSize];
            }
            if (algin === "stretch") {
                itemStyle[crossStart] = crossBase;
                itemStyle[crossEnd] = crossBase + crossSign * ((itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) ? itemStyle[crossSize] : lineCrossSize);
                itemStyle[crossSize] = crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
            }
            
        }
        crossBase += crossSign * (lineCrossSize + step);
    });
}

module.exports = layout;