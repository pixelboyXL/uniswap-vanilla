import { supportLink,
    navUserSections,
    supportSection,
    supportBtnArchive,
    supportBtnNewTicket,
    archiveList,
    ticketList,
    createTicketCloseBtn,
    createTicketBackdrop,
    createTicket,
    ticketSection,
    ticketItem,
    ticketArrow, } from "./refs.js";
import { toggleVisuallyHidden,
    toggleIsHidden, 
    showSection, 
    hideSection, 
    toggleCustomClass } from './simple.js';
import { hideMarketPiece } from './market.js';
import { hideMainSections, showPersonalSections } from './switching.js';

if (supportLink) {
    supportLink.addEventListener("click", () => {
        hideMarketPiece();
        hideMainSections();
        showPersonalSections(supportSection);
        toggleIsHidden(navUserSections);
    });
};

function toggleCreateTicket () {
    const createTicketVisible = "create-ticket-visible";
    toggleIsHidden(createTicketBackdrop);
    toggleCustomClass(createTicket, createTicketVisible);
};

if (supportBtnNewTicket) {
    supportBtnNewTicket.addEventListener("click", toggleCreateTicket);
};

if (createTicketCloseBtn) {
    createTicketCloseBtn.addEventListener("click", toggleCreateTicket);
};

if (ticketItem) {
    ticketItem.addEventListener("click", () => {
        showSection(ticketSection);
        hideSection(supportSection);
    });
};

if (ticketArrow) {
    ticketArrow.addEventListener("click", () => {
        showSection(supportSection);
        hideSection(ticketSection);
    });
};

if (supportBtnArchive) {
    supportBtnArchive.addEventListener("click", () => {
        toggleVisuallyHidden(archiveList, ticketList);
    });
};