import { // dashboardLink,
    whitePaperLink,
    roadmapLink,
    faqLink,
    myProfileLink,
    referralProgramLink,
    navUserIcon,
    navUserSections,
    // whitePaperSection,
    roadmapSection,
    userProfileSection,
    referralProgramSection,
    // marketSection,
    supportSection,
    ticketSection,
    faqSection, } from './refs.js';
import { toggleIsHidden, 
    showSection, 
    hideSection,
    addLinkActive,
    removeLinkActive } from './simple.js';
import { showMarketPiece, hideMarketPiece } from './market.js';

if (navUserIcon) {
    navUserIcon.addEventListener("click", () => {
        toggleIsHidden(navUserSections);
    });
};

export function showMainSections (sectionToShow, linkToActive) {
    hideMainSections();

    addLinkActive(linkToActive);
    showSection(sectionToShow);
};

export function hideMainSections () {
    // removeLinkActive(whitePaperLink);
    // hideSection(whitePaperSection);
    removeLinkActive(roadmapLink);
    hideSection(roadmapSection);
    removeLinkActive(faqLink);
    hideSection(faqSection);
};

// if (dashboardLink) {
//     dashboardLink.addEventListener("click", () => {
//         hideMarketPiece();
//         hideMainSections();
//         hidePersonalSections();
//     });
// };

if (whitePaperLink) {
    whitePaperLink.addEventListener("click", () => {
        // showMainSections(whitePaperSection, whitePaperLink);
        showMarketPiece();
        hideMainSections();
        hidePersonalSections();
    });
};

if (roadmapLink) {
    roadmapLink.addEventListener("click", () => {
        showMainSections(roadmapSection, roadmapLink);
        hideMarketPiece();
        hidePersonalSections();
    });
};

if (faqLink) {
    faqLink.addEventListener("click", () => {
        showMainSections(faqSection, faqLink);
        hideMarketPiece();
        hidePersonalSections();
    });
};

export function showPersonalSections (sectionToShow) {
    hidePersonalSections();

    showSection(sectionToShow);
};

export function hidePersonalSections () {
    hideSection(userProfileSection);
    hideSection(referralProgramSection);
    hideSection(supportSection);
    hideSection(ticketSection);
};

if (myProfileLink) {
    myProfileLink.addEventListener("click", () => {
        hideMarketPiece();
        hideMainSections();
        showPersonalSections(userProfileSection);
        toggleIsHidden(navUserSections);
    });
};

if (referralProgramLink) {
    referralProgramLink.addEventListener("click", () => {
        hideMarketPiece();
        hideMainSections();
        showPersonalSections(referralProgramSection);
        toggleIsHidden(navUserSections);
    });
};