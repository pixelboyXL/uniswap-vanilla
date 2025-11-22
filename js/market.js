import { uniswapMarketBtnCreateStake,
    uniswapMarketExmark,
    uniswapMarketInfoWrap,
    uniswapBackdropWarning,
    uniswapMessageWarning,
    uniswapMessageBtnWarning,
    uniswapBackdropErrorValidate,
    uniswapMessageErrorValidate,
    uniswapMessageBtnErrorValidate,
    uniswapBackdropErrorCreate,
    uniswapMessageErrorCreate,
    uniswapMessageBtnErrorCreate,
    uniswapBackdropSuccess,
    uniswapMessageSuccess,
    uniswapMessageBtnSuccess,
    linkToMarket,
    linkToStake,
    linkToMyPositions,
    whitePaperMobLink,
    stakeMobLink,
    myPositionsMobLink,
    // dashboardLink,
    whitePaperLink,
    // whitePaperSection,
    marketSection,
    TokensListItemWarning,
    TokensListItemMobWarning,
    marketTokensGrid,
    marketStakeForm,
    stakeFormSelectPair,
    stakeFormPairWrap,
    stakeFormPairText,
    stakeFormAmount,
    stakeFormLockPeriod,
    stakeFormLockPeriodWrap,
    stakeFormLockPeriodText,
    marketMyPositions,
    headerMobMenu,
    mobMenuBackdrop,
    mobMenu, } from './refs.js';
import { toggleIsHidden, 
    showSection, 
    hideSection, 
    addCurrentClass, 
    removeCurrentClass,
    toggleCustomClass,
    addLinkActive,
    removeLinkActive } from './simple.js';
import { showMainSections, hideMainSections, hidePersonalSections } from './switching.js';
import { toggleUniswapMessage } from './authorization.js';

export function showMarketPiece (pieceToShow = marketTokensGrid, linkToCurrent = linkToMarket) {
    hideMarketPiece();

    addLinkActive(whitePaperLink);
    // addLinkActive(dashboardLink);
    showSection(marketSection);
    addCurrentClass(linkToCurrent);
    showSection(pieceToShow);
};

export function hideMarketPiece () {
    removeLinkActive(whitePaperLink);
    // removeLinkActive(dashboardLink);
    hideSection(marketSection);
    removeCurrentClass(linkToMarket);
    hideSection(marketTokensGrid);
    removeCurrentClass(linkToStake);
    hideSection(marketStakeForm);
    marketStakeForm.reset();
    removeCurrentClass(linkToMyPositions);
    hideSection(marketMyPositions);
};

if (linkToMarket) {
    linkToMarket.addEventListener("click", () => {
        showMarketPiece();
    });
};

if (linkToStake) {
    linkToStake.addEventListener("click", () => {
        showMarketPiece(marketStakeForm, linkToStake);
    });
};

function getStakeFormValue (objectOptionsText, elemToOverrite) {
    objectOptionsText.forEach(objectText => {
        objectText.addEventListener("click", () => {
            const neddedValue = objectText.innerHTML;
            elemToOverrite.value = neddedValue;
        });
    });
};

if (stakeFormSelectPair) {
    stakeFormSelectPair.addEventListener("click", () => {
        toggleIsHidden(stakeFormPairWrap);
        getStakeFormValue(stakeFormPairText, stakeFormSelectPair);
    });
};

if (stakeFormLockPeriod) {
    stakeFormLockPeriod.addEventListener("click", () => {
        toggleIsHidden(stakeFormLockPeriodWrap);
        getStakeFormValue(stakeFormLockPeriodText, stakeFormLockPeriod);
    });
};

if (linkToMyPositions) {
    linkToMyPositions.addEventListener("click", () => {
        showMarketPiece(marketMyPositions, linkToMyPositions);
    });
};

if (uniswapMarketExmark) {
    uniswapMarketExmark.addEventListener ("click", () => {
        toggleIsHidden(uniswapMarketInfoWrap);
        setTimeout(() => {
            toggleIsHidden(uniswapMarketInfoWrap);
        }, 5000);
    });
};

function toggleMobMenu () {
    const mobMenuVisible = "mob-menu-visible";
    toggleIsHidden(mobMenuBackdrop);
    toggleCustomClass(mobMenu, mobMenuVisible);
};

if (headerMobMenu) {
    headerMobMenu.addEventListener("click", toggleMobMenu);
};

if (whitePaperMobLink) {
    whitePaperMobLink.addEventListener("click", () => {        
        toggleMobMenu();
        showMarketPiece();
        hideMainSections();
        // showMainSections(whitePaperSection, whitePaperLink);
        // hideMarketPiece();
        hidePersonalSections();
    });
};

if (stakeMobLink) {
    stakeMobLink.addEventListener("click", () => {        
        toggleMobMenu();
        showMarketPiece(marketStakeForm, linkToStake);
        hideMainSections();
        hidePersonalSections();
    });
};

if (myPositionsMobLink) {
    myPositionsMobLink.addEventListener("click", () => {        
        toggleMobMenu();
        showMarketPiece(marketMyPositions, linkToMyPositions);
        hideMainSections();
        hidePersonalSections();
    });
};

const warningVisible = "uniswap-message-warning-visible";
const errorValidateVisible = "uniswap-message-error-validate-visible";
const errorCreateVisible = "uniswap-message-error-create-visible";
const successVisible = "uniswap-message-success-visible";

if (TokensListItemWarning) {
    TokensListItemWarning.forEach(itemWarning => {
        itemWarning.addEventListener("click", () => {
            toggleUniswapMessage(uniswapBackdropWarning, uniswapMessageWarning, warningVisible);
        });
    });
};

if (TokensListItemMobWarning) {
    TokensListItemMobWarning.forEach(itemMobWarning => {
        itemMobWarning.addEventListener("click", () => {
            toggleUniswapMessage(uniswapBackdropWarning, uniswapMessageWarning, warningVisible);
        });
    });
};

if (uniswapMessageBtnWarning) {
    uniswapMessageBtnWarning.addEventListener("click", () => { 
        toggleUniswapMessage(uniswapBackdropWarning, uniswapMessageWarning, warningVisible);
    });
};

if (uniswapMarketBtnCreateStake) {
    uniswapMarketBtnCreateStake.addEventListener("click", () => {
        if (stakeFormSelectPair.value === "") {
            toggleUniswapMessage(uniswapBackdropErrorValidate, uniswapMessageErrorValidate, errorValidateVisible);
            return;
        } else if (stakeFormLockPeriod.value === "" || stakeFormAmount.value === "") {
            toggleUniswapMessage(uniswapBackdropErrorCreate, uniswapMessageErrorCreate, errorCreateVisible);
            return;
        } else {
            toggleUniswapMessage(uniswapBackdropSuccess, uniswapMessageSuccess, successVisible);
        };
    });
};

if (uniswapMessageBtnErrorValidate) {
    uniswapMessageBtnErrorValidate.addEventListener("click", () => {
        toggleUniswapMessage(uniswapBackdropErrorValidate, uniswapMessageErrorValidate, errorValidateVisible);
    });
};

if (uniswapMessageBtnErrorCreate) {
    uniswapMessageBtnErrorCreate.addEventListener("click", () => {
        toggleUniswapMessage(uniswapBackdropErrorCreate, uniswapMessageErrorCreate, errorCreateVisible);
    });
};

if (uniswapMessageBtnSuccess) {
    uniswapMessageBtnSuccess.addEventListener("click", () => {
        toggleUniswapMessage(uniswapBackdropSuccess, uniswapMessageSuccess, successVisible);
        marketStakeForm.reset();
    });
};