inFocus = document.getElementById("movable")
elements = document.getElementsByClassName("movable")
buttons = document.getElementsByTagName("button")
// manifest_button_resize = document.getElementById("manifest_resize")
// manifest_button_resize.onclick = resizeWindow


activateWindows(buttons)

for (let index = 0; index < elements.length; index++) {
    const element = elements[index];
    dragElement(element);
}

function activateWindows(buttons) {
    var parents = new Object();
    for (let index = 0; index < buttons.length; index++) {
        if (buttons[index].classList[0] != "close" && buttons[index].classList[0] != "resize") {
            continue
        }
        movableWindow = buttons[index].parentElement.parentElement.parentElement
        if (parents[movableWindow.id] == null) {
            parents[movableWindow.id] = {
                movableWindow: movableWindow,
                resize: null,
                close: null,
                active: false,
                fullscreen: false
            }
        }
        if (buttons[index].classList[0] === "close") {
            parents[movableWindow.id].close = buttons[index]
        } else {
            parents[movableWindow.id].resize = buttons[index]
        }
    }
    for (var key in parents) {
        setHooks(parents[key])
    }

    function setHooks(element) {
        element.close.onclick = closeWindow
        element.resize.onclick = resizeWindow

        function resizeWindow(e) {
            e = e || window.event;
            e.preventDefault();
            el = element.movableWindow
            if (!checkAspectRatio()) {
                return
            }
            if (!element.fullscreen) {
                el.style.top = (0) + "px";
                el.style.left = (0) + "px";
                el.style.maxWidth = (100) + "%";
                el.style.minHeight = (100) + "%";
                element.fullscreen = true
            } else {
                el.style.top = "auto";
                el.style.left = "auto";
                el.style.maxWidth = "70%";
                el.style.minHeight = "auto";
                element.fullscreen = false
            }
        }

        function closeWindow(e) {
            e = e || window.event;
            e.preventDefault();
            el = element.movableWindow
            el.style.display = "none"
        }

    }

}

function openWindow(id) {
    el = document.getElementById(id)
    el.style.display = "flex"
    swapper(el)
}


inFocusLevel = 13
inFocus = document.getElementById("manifest")

function swapper(elmnt) {
    if (inFocus != elmnt) {
        inFocusLevel = inFocusLevel + 1
        elmnt.style.zIndex = inFocusLevel
        inFocus = elmnt
    }
}

function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    window.onresize = resetElement

    if (!checkAspectRatio()) {
        return
    }

    setHooks()

    function swapWindow(e) {
        swapper(elmnt)
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function resetElement(e) {
        e = e || window.event;
        if (!checkAspectRatio()) {
            setHooks(true)
            return
        } else {
            setHooks()
        }
        pos1 = 0;
        pos2 = 0;
        pos3 = 0;
        pos4 = 0;
        elmnt.style.top = (elmnt.parentElement.offsetTop) + "px";
        elmnt.style.left = (elmnt.parentElement.offsetLeft) + "px";
        elementDrag(e)
    }

    function setHooks(reset) {
        document.getElementById(elmnt.id + "header").onmousedown = reset ? null : dragMouseDown;
        elmnt.onmousedown = reset ? null : swapWindow;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;


        if (elmnt.offsetTop - pos2 + elmnt.offsetHeight >= elmnt.parentElement.offsetHeight) {
            elmnt.style.top = (elmnt.parentElement.offsetHeight - elmnt.offsetHeight) + "px";
        } else if (elmnt.offsetTop - pos2 <= 0) {
            elmnt.style.top = (0) + "px";
        } else {
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        }

        if (elmnt.offsetLeft - pos1 + elmnt.offsetWidth >= elmnt.parentElement.offsetWidth) {
            elmnt.style.left = (elmnt.parentElement.offsetWidth - elmnt.offsetWidth) + "px";
        } else if (elmnt.offsetLeft - pos1 <= 0) {
            elmnt.style.left = (0) + "px";
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

function checkAspectRatio() {
    return window.innerWidth / window.innerHeight >= 9 / 8 ? true : false
}