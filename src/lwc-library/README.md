# LWC Library Package

A collection of reusable Lightning Web Components that can be used across your Salesforce applications.

## Components

### Utility Button (`c-utility-button`)

A customizable button component with multiple variants and icon support.

**Properties:**
- `label` (String): The text to display on the button (default: "Button")
- `variant` (String): The button style - neutral, brand, destructive, success (default: "neutral")
- `iconName` (String): Lightning Design System icon name (e.g., "utility:add")
- `iconPosition` (String): Icon position - left, right (default: "left")
- `disabled` (Boolean): Whether the button is disabled (default: false)
- `title` (String): Tooltip text for the button

**Events:**
- `buttonclick`: Fired when the button is clicked. Detail contains `{label, variant}`

**Example Usage:**
```html
<c-utility-button
    label="Save"
    variant="brand"
    icon-name="utility:save"
    onbuttonclick={handleSave}
></c-utility-button>
```

### Utility Card (`c-utility-card`)

A card component for displaying content with optional header, icon, and actions.

**Properties:**
- `title` (String): The title displayed in the card header
- `iconName` (String): Lightning Design System icon name for the header
- `variant` (String): Card style - base, narrow (default: "base")
- `showActions` (Boolean): Whether to display the actions slot (default: false)

**Slots:**
- Default slot: Main content of the card
- `actions`: Actions to display in the header (when `showActions` is true)
- `footer`: Content for the card footer

**Events:**
- `cardaction`: Fired when an action is triggered. Detail contains `{title}`

**Example Usage:**
```html
<c-utility-card
    title="Customer Information"
    icon-name="standard:account"
    show-actions={true}
>
    <div slot="actions">
        <c-utility-button label="Edit" variant="neutral"></c-utility-button>
    </div>
    
    <p>Main card content goes here</p>
    
    <div slot="footer">
        <p>Footer content</p>
    </div>
</c-utility-card>
```

### Utility Modal (`c-utility-modal`)

A modal dialog component with configurable size and custom content support.

**Properties:**
- `title` (String): The title displayed in the modal header (default: "Modal")
- `size` (String): Modal size - small, medium, large (default: "medium")
- `showFooter` (Boolean): Whether to display the footer with default buttons (default: false)
- `isOpen` (Boolean): Controls the visibility of the modal (default: false)

**Methods:**
- `show()`: Opens the modal
- `hide()`: Closes the modal

**Slots:**
- Default slot: Main content of the modal
- `footer`: Custom footer content (replaces default Cancel/Save buttons)

**Events:**
- `modalclose`: Fired when the modal is closed. Detail contains `{title}`
- `modalsave`: Fired when the default Save button is clicked. Detail contains `{title}`

**Example Usage:**
```html
<template>
    <c-utility-button label="Open Modal" onclick={openModal}></c-utility-button>
    
    <c-utility-modal
        title="Confirm Action"
        size="small"
        is-open={modalOpen}
        onmodalclose={handleModalClose}
        onmodalsave={handleModalSave}
    >
        <p>Are you sure you want to proceed?</p>
    </c-utility-modal>
</template>
```

```javascript
import { LightningElement, track } from 'lwc';

export default class MyComponent extends LightningElement {
    @track modalOpen = false;
    
    openModal() {
        this.modalOpen = true;
    }
    
    handleModalClose() {
        this.modalOpen = false;
    }
    
    handleModalSave() {
        // Perform save action
        this.modalOpen = false;
    }
}
```

## Testing

All components include comprehensive Jest unit tests. Run tests with:

```bash
npm run test:unit
```

## Installation

This package is designed to be deployed as part of a Salesforce DX project. Include it in your `sfdx-project.json` and deploy using Salesforce CLI or your preferred deployment tool.

## Contributing

When adding new components to this library:

1. Follow the existing component structure
2. Include comprehensive JSDoc comments
3. Add unit tests with good coverage
4. Update this README with component documentation
5. Ensure components follow Salesforce Lightning Design System (SLDS) guidelines
