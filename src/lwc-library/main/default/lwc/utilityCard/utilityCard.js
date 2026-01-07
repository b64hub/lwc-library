import { LightningElement, api } from 'lwc';

/**
 * A reusable utility card component for displaying content in a card layout
 */
export default class UtilityCard extends LightningElement {
    @api title;
    @api iconName;
    @api showActions = false;
    @api variant = 'base'; // base, narrow

    get computedClass() {
        let baseClass = 'slds-card';
        if (this.variant === 'narrow') {
            baseClass += ' slds-card_narrow';
        }
        return baseClass;
    }

    get hasIcon() {
        return !!this.iconName;
    }

    get hasTitle() {
        return !!this.title;
    }

    handleActionClick(event) {
        const actionEvent = new CustomEvent('cardaction', {
            detail: {
                title: this.title
            }
        });
        this.dispatchEvent(actionEvent);
    }
}
