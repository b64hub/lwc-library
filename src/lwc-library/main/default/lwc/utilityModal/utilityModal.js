import { LightningElement, api } from 'lwc';

/**
 * A reusable utility modal component for displaying content in a modal dialog
 */
export default class UtilityModal extends LightningElement {
    @api title = 'Modal';
    @api size = 'medium'; // small, medium, large
    @api showFooter = false;
    
    _isOpen = false;

    @api
    get isOpen() {
        return this._isOpen;
    }

    set isOpen(value) {
        this._isOpen = value;
    }

    @api
    show() {
        this._isOpen = true;
    }

    @api
    hide() {
        this._isOpen = false;
    }

    get computedClass() {
        let sizeClass = 'slds-modal__container';
        switch (this.size) {
            case 'small':
                sizeClass = 'slds-modal__container slds-modal__container_small';
                break;
            case 'large':
                sizeClass = 'slds-modal__container slds-modal__container_large';
                break;
            default:
                sizeClass = 'slds-modal__container slds-modal__container_medium';
        }
        return sizeClass;
    }

    handleClose() {
        this._isOpen = false;
        const closeEvent = new CustomEvent('modalclose', {
            detail: {
                title: this.title
            }
        });
        this.dispatchEvent(closeEvent);
    }

    handleBackdropClick(event) {
        // Close modal when clicking backdrop
        if (event.target.classList.contains('slds-backdrop')) {
            this.handleClose();
        }
    }

    handleSave() {
        const saveEvent = new CustomEvent('modalsave', {
            detail: {
                title: this.title
            }
        });
        this.dispatchEvent(saveEvent);
    }
}
