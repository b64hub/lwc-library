import { createElement } from 'lwc';
import UtilityCard from 'c/utilityCard';

describe('c-utility-card', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders with default properties', () => {
        const element = createElement('c-utility-card', {
            is: UtilityCard
        });
        document.body.appendChild(element);

        const card = element.shadowRoot.querySelector('article');
        expect(card).not.toBeNull();
        expect(card.className).toContain('slds-card');
    });

    it('displays title when provided', () => {
        const element = createElement('c-utility-card', {
            is: UtilityCard
        });
        element.title = 'Test Card';
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const title = element.shadowRoot.querySelector('.slds-card__header-title');
            expect(title).not.toBeNull();
            expect(title.textContent).toBe('Test Card');
        });
    });

    it('applies narrow variant class', () => {
        const element = createElement('c-utility-card', {
            is: UtilityCard
        });
        element.variant = 'narrow';
        document.body.appendChild(element);

        const card = element.shadowRoot.querySelector('article');
        expect(card.className).toContain('slds-card_narrow');
    });

    it('shows icon when iconName is provided', () => {
        const element = createElement('c-utility-card', {
            is: UtilityCard
        });
        element.title = 'Test Card';
        element.iconName = 'utility:info';
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const icon = element.shadowRoot.querySelector('lightning-icon');
            expect(icon).not.toBeNull();
        });
    });

    it('shows actions slot when showActions is true', () => {
        const element = createElement('c-utility-card', {
            is: UtilityCard
        });
        element.title = 'Test Card';
        element.showActions = true;
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const actionsSlot = element.shadowRoot.querySelector('slot[name="actions"]');
            expect(actionsSlot).not.toBeNull();
        });
    });
});
