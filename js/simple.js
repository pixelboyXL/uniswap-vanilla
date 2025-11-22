document.querySelector('a').addEventListener('click', function(e) {
    e.preventDefault();
});

const visuallyHidden = "visually_hidden";
const isHidden = "is_hidden";
const displayBlock = "block";
const displayNone = "none";
const currentClass = "current";
const linkActive = "link-active";

export function toggleVisuallyHidden (elemShow, elemHide) {
    elemShow.classList.toggle(visuallyHidden);
    elemHide.classList.toggle(visuallyHidden);
};

export function addVisuallyHidden (elem) {
    elem.classList.add(visuallyHidden);
};

export function removeVisuallyHidden (elem) {
    elem.classList.remove(visuallyHidden);
};

export function toggleIsHidden (elem) {
    elem.classList.toggle(isHidden);
};

export function showSection (elem) {
    elem.style.display = displayBlock;
};

export function hideSection (elem) {
    elem.style.display = displayNone;
};

export function addCurrentClass (elem) {
    elem.classList.add(currentClass);
};

export function removeCurrentClass (elem) {
    elem.classList.remove(currentClass);
};

export function toggleCustomClass (elem, customClass) {
    elem.classList.toggle(customClass);
};

export function removeCustomClass (elem, customClass) {
    elem.classList.remove(customClass);
};

export function addLinkActive (elem) {
    elem.classList.add(linkActive);
};

export function removeLinkActive (elem) {
    elem.classList.remove(linkActive);
};

export function getViewWidth () {
    return window.innerWidth;
};