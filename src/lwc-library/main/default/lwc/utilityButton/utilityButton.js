import { LightningElement, api } from 'lwc';

/**
 * A reusable utility button component with configurable variants and actions
 */
export default class UtilityButton extends LightningElement {
    @api label = 'Button';
    @api variant = 'neutral'; // neutral, brand, destructive, success
    @api iconName;
    @api iconPosition = 'left'; // left, right
    @api disabled = false;
    @api title;

    get computedClass() {
        let baseClass = 'slds-button';
        switch (this.variant) {
            case 'brand':
                baseClass += ' slds-button_brand';
                break;
            case 'destructive':
                baseClass += ' slds-button_destructive';
                break;
            case 'success':
                baseClass += ' slds-button_success';
                break;
            default:
                baseClass += ' slds-button_neutral';
        }
        return baseClass;
    }

    get hasIcon() {
        return !!this.iconName;
    }

    get showIconLeft() {
        return this.hasIcon && this.iconPosition === 'left';
    }

    get showIconRight() {
        return this.hasIcon && this.iconPosition === 'right';
    }

    handleClick(event) {
        // Dispatch custom event for parent components to handle
        const clickEvent = new CustomEvent('buttonclick', {
            detail: {
                label: this.label,
                variant: this.variant
            }
        });
        this.dispatchEvent(clickEvent);
    }
}
