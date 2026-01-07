import { createElement } from 'lwc';
import UtilityModal from 'c/utilityModal';

describe('c-utility-modal', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('is hidden by default', () => {
        const element = createElement('c-utility-modal', {
            is: UtilityModal
        });
        document.body.appendChild(element);

        const modal = element.shadowRoot.querySelector('.slds-modal');
        expect(modal).toBeNull();
    });

    it('shows modal when isOpen is true', () => {
        const element = createElement('c-utility-modal', {
            is: UtilityModal
        });
        element.isOpen = true;
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const modal = element.shadowRoot.querySelector('.slds-modal');
            expect(modal).not.toBeNull();
        });
    });

    it('displays title', () => {
        const element = createElement('c-utility-modal', {
            is: UtilityModal
        });
        element.title = 'Test Modal';
        element.isOpen = true;
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const title = element.shadowRoot.querySelector('.slds-modal__title');
            expect(title.textContent).toBe('Test Modal');
        });
    });

    it('dispatches modalclose event when close button is clicked', () => {
        const element = createElement('c-utility-modal', {
            is: UtilityModal
        });
        element.isOpen = true;
        document.body.appendChild(element);

        const handler = jest.fn();
        element.addEventListener('modalclose', handler);

        return Promise.resolve().then(() => {
            const closeButton = element.shadowRoot.querySelector('.slds-modal__close');
            closeButton.click();
            expect(handler).toHaveBeenCalled();
        });
    });

    it('dispatches modalsave event when save button is clicked', () => {
        const element = createElement('c-utility-modal', {
            is: UtilityModal
        });
        element.showFooter = true;
        element.isOpen = true;
        document.body.appendChild(element);

        const handler = jest.fn();
        element.addEventListener('modalsave', handler);

        return Promise.resolve().then(() => {
            const saveButton = element.shadowRoot.querySelector('.slds-button_brand');
            saveButton.click();
            expect(handler).toHaveBeenCalled();
        });
    });

    it('can be opened and closed with public methods', () => {
        const element = createElement('c-utility-modal', {
            is: UtilityModal
        });
        document.body.appendChild(element);

        element.show();
        expect(element.isOpen).toBe(true);

        element.hide();
        expect(element.isOpen).toBe(false);
    });

    it('applies correct size class', () => {
        const element = createElement('c-utility-modal', {
            is: UtilityModal
        });
        element.size = 'large';
        element.isOpen = true;
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const container = element.shadowRoot.querySelector('.slds-modal__container');
            expect(container.className).toContain('slds-modal__container_large');
        });
    });
});
