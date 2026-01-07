import { createElement } from 'lwc';
import UtilityButton from 'c/utilityButton';

describe('c-utility-button', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('renders with default properties', () => {
        const element = createElement('c-utility-button', {
            is: UtilityButton
        });
        document.body.appendChild(element);

        const button = element.shadowRoot.querySelector('button');
        expect(button).not.toBeNull();
        expect(button.textContent).toContain('Button');
    });

    it('applies correct variant class', () => {
        const element = createElement('c-utility-button', {
            is: UtilityButton
        });
        element.variant = 'brand';
        document.body.appendChild(element);

        const button = element.shadowRoot.querySelector('button');
        expect(button.className).toContain('slds-button_brand');
    });

    it('dispatches buttonclick event when clicked', () => {
        const element = createElement('c-utility-button', {
            is: UtilityButton
        });
        element.label = 'Test Button';
        document.body.appendChild(element);

        const handler = jest.fn();
        element.addEventListener('buttonclick', handler);

        const button = element.shadowRoot.querySelector('button');
        button.click();

        expect(handler).toHaveBeenCalled();
        expect(handler.mock.calls[0][0].detail.label).toBe('Test Button');
    });

    it('disables button when disabled property is true', () => {
        const element = createElement('c-utility-button', {
            is: UtilityButton
        });
        element.disabled = true;
        document.body.appendChild(element);

        const button = element.shadowRoot.querySelector('button');
        expect(button.disabled).toBe(true);
    });

    it('shows icon when iconName is provided', () => {
        const element = createElement('c-utility-button', {
            is: UtilityButton
        });
        element.iconName = 'utility:add';
        document.body.appendChild(element);

        return Promise.resolve().then(() => {
            const icon = element.shadowRoot.querySelector('lightning-icon');
            expect(icon).not.toBeNull();
        });
    });
});
