import { faqItems, faqArrows } from "./refs.js";
import { toggleCustomClass, removeCustomClass } from "./simple.js";

const faqItemOpen = "item-open";
const faqArrowUp = "arrow-up";

if (faqArrows) {
    faqArrows.forEach(arrow => {
        arrow.addEventListener("click", () => {
            const faqItem = arrow.closest(".faq__item"); 
            if (faqItem) {
                toggleCustomClass(arrow, faqArrowUp);
                toggleCustomClass(faqItem, faqItemOpen);
            };
            faqItems.forEach(item => {
                if (item !== faqItem && item.classList.contains(faqItemOpen)) {
                    removeCustomClass(item, faqItemOpen)
                    item.querySelector(".faq__item-arrow").classList.remove(faqArrowUp);
                };
            });
        });
    });
};