inFocus = document.getElementById("movable")
elements = document.getElementsByClassName("movable")
for (let index = 0; index < elements.length; index++) {
    const element = elements[index];
    dragElement(element);
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        if (inFocus != elmnt) {
            newZ = getStyle(elmnt.id, "z-index") || getStyle(elmnt.id, "zIndex");
            elmnt.style.zIndex = parseInt(newZ) + 2
            inFocus = elmnt
        }
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        if (elmnt.offsetTop - pos2 + elmnt.offsetHeight >= elmnt.parentElement.offsetTop + elmnt.parentElement.offsetHeight) {
            elmnt.style.top = (elmnt.parentElement.offsetTop + elmnt.parentElement.offsetHeight - elmnt.offsetHeight) + "px";
        } else if (elmnt.offsetTop - pos2 <= elmnt.parentElement.offsetTop) {
            elmnt.style.top = (elmnt.parentElement.offsetTop) + "px";
        } else {
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        }

        if (elmnt.offsetLeft - pos1 + elmnt.offsetWidth >= elmnt.parentElement.offsetLeft + elmnt.parentElement.offsetWidth) {
            elmnt.style.left = (elmnt.parentElement.offsetLeft + elmnt.parentElement.offsetWidth - elmnt.offsetWidth) + "px";
        } else if (elmnt.offsetLeft - pos1 <= elmnt.parentElement.offsetLeft) {
            elmnt.style.left = (elmnt.parentElement.offsetLeft) + "px";
        } else {
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
    function getStyle(el, styleProp) {
        var x = document.getElementById(el);

        if (window.getComputedStyle) {
            var y = document.defaultView.getComputedStyle(x, null).getPropertyValue(styleProp);
        }
        else if (x.currentStyle) {
            var y = x.currentStyle[styleProp];
        }

        return y;
    }
}