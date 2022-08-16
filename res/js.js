elements = document.getElementsByClassName("movable")
buttons = document.getElementsByTagName("button")
inFocusLevel = 13
inFocus = document.getElementById("manifest")

activateWindows(buttons)

for (let index = 0; index < elements.length; index++) {
    const element = elements[index];
    dragElement(element);
}

function subscribe() {
    console.log("subscribe on, ", document.getElementById('email_field').value)
    document.getElementById("stayintouch").style.cursor = "progress";
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "email": document.getElementById('email_field').value
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("https://notfellowsbackend.herokuapp.com", requestOptions)
        .then(response => response.text())
        .then(result => updateEmailForm(result))
        .catch(error => handleEmailError(error))
}

function handleEmailError(error) {
    console.log('error', error)
    window.location.replace("https://notfellows.substack.com/subscribe");
}

function updateEmailForm(result) {
    console.log(result)
    if (result == "Bad Request") {
        document.getElementById("email_label").innerHTML = "Email format is invalid！"
    } else if (result == "OK") {
        document.getElementById("success_form").style.display = "inline"
        document.getElementById("email_form").style.display = "none"
    }
    else {
        document.getElementById("email_label").innerHTML = "Email already subscribed！"
        document.getElementById("email_label").style.color = "red"
    }
    document.getElementById("stayintouch").style.cursor = "auto";
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

    initialPositions()

    function initialPositions() {
        manifest = document.getElementById("manifest")
        manifest.style.display = "flex"
        manifest.style.left = (manifest.parentElement.offsetWidth - manifest.offsetWidth) + "px";
        stayintouch = document.getElementById("stayintouch")
        stayintouch.style.display = "flex"
        stayintouch.style.top = (stayintouch.parentElement.offsetHeight - stayintouch.offsetHeight) + "px";
        if (!checkAspectRatio()) {
            return
        }
        swapper(stayintouch)
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
            closeWindowUtil(el)
        }

    }

}

function closeWindowUtil(element) {
    if (element != null) {
        element.style.display = "none"
    }
}

function openWindow(id) {
    el = document.getElementById(id)
    el.style.display = "flex"
    swapper(el)
}

document.addEventListener('keydown', closeWindowOnEscape);


function closeWindowOnEscape(e) {
    e = e || window.event;
    if (e.keyCode === 27) {
        closeWindowUtil(inFocus)
    }
};

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