---
description: "Coding conventions for Lightning Web Components (LWC)."
applyTo: "**/lwc/**/*.ts, **/lwc/**/*.js, **/lwc/**/*.scss, **/lwc/**/*.css, **/lwc/**/*.html"
---

# LWC Code Conventions

> Checklist defaults: TypeScript, properties-down/events-up, LDS before Apex,
> cacheable Apex, progressive disclosure.

## TypeScript

- Use TypeScript for all new code
- Use `const` and `let` — never `var`
- Prefix private fields and methods with underscore (`_privateMethod`)
- Use interfaces for data structures and type definitions
- Prefer immutable data (`const`, `readonly`)
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Use `async/await` for asynchronous code
- Do not use blanket `// @ts-ignore` on LWC decorators (`@api`, `@track`, `@wire`); prefer correct typings and, if a suppression is unavoidable, use `// @ts-expect-error` with a short justification

## Naming & Structure

- Folder/tag naming: `kebab-case` — folder name = component tag
- Keep public API minimal; expose only with `@api`
- Group imports: platform features (Apex, labels, static resources) together

## Components

- Prefer `lightning-*` base components for SLDS and platform optimizations
- Use `lwc:if={}` for conditional rendering (not `if:true`)
- Use `lwc:ref` for element references (access via `this.refs`)

## Styling

- Prefer data attributes for styling hooks over dynamic class assignment
- Follow SLDS guidelines unless Telenor branding is required

## Data Access

- **LDS/UI API before Apex** — fetch only required fields
- Avoid `getRecordUi` unless metadata is needed (payload 100-1000x larger)
- Use `@AuraEnabled(cacheable=true)` on idempotent Apex
- Share data via service components; avoid re-querying
- Always set `LIMIT` and use pagination for large datasets

## Performance

- **Progressive disclosure**: lazy-instantiate heavy content with `lwc:if`
- **Lists**: always provide stable `key`; paginate — no unbounded lists
- **Events**: keep handlers minimal; each has overhead
- Optimize images; avoid oversized static assets

## State & Mutations

- Model components as state machines; derive state with getters
- Never mutate `@api` or `@wire` data — shallow-copy with spread/`Object.assign`
- Avoid `JSON.parse(JSON.stringify(...))` for cloning
- Avoid manual DOM manipulation — use template bindings

## Communication

- **Parent -> Child**: set `@api` props or call `@api` methods
- **Child -> Parent**: dispatch `CustomEvent`
- **Cross-DOM**: use Lightning Message Service — no ad-hoc pub/sub
- Sanitize dynamic HTML with `lightning-formatted-rich-text`

## Third-Party Libraries

- Challenge the need first — modern JS may suffice
- Prefer ESM modules; load UMD via `platformResourceLoader`
- Size guardrail: avoid libs > 30 KB min+gzip
- Test Locker compatibility in Locker Console

## Testing

- Write black-box Jest tests — don't add `@api` just for testing
- Test via inputs (props/events) and observable outputs (DOM)

---

## Quick Patterns

**Wire LDS with minimal fields**

```js
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import NAME_FIELD from '@salesforce/schema/Account.Name';

@wire(getRecord, { recordId: '$recordId', fields: [NAME_FIELD] })
account;

get name() { return getFieldValue(this.account.data, NAME_FIELD); }
```

**Cacheable Apex**

```apex
public with sharing class AccountController {
  @AuraEnabled(cacheable=true)
  public static List<Account> top(Integer limitSize) {
    return [SELECT Id, Name FROM Account LIMIT :limitSize];
  }
}
```

```js
import top from '@salesforce/apex/AccountController.top';
@wire(top, { limitSize: 50 }) accounts;
```

**Lazy instantiate heavy tab**

```html
<lightning-tabset>
  <lightning-tab label="Details">...</lightning-tab>
  <lightning-tab label="Charts" lwc:if="{showCharts}">...</lightning-tab>
</lightning-tabset>
```

**Stable keyed list**

```html
<template for:each="{rows}" for:item="r">
  <c-row key="{r.id}" row="{r}"></c-row>
</template>
```

**Child -> Parent event**

```js
// child.js
this.dispatchEvent(new CustomEvent("select", { detail: { id } }));
```

```html
<!-- parent.html -->
<c-child onselect="{handleSelect}"></c-child>
```

---

## References

- [Developer Best Practices Checklist](https://developer.salesforce.com/blogs/2022/01/drive-consistency-and-grow-developer-skills-with-a-developer-best-practices-checklist)
- [LWC Performance Best Practices](https://developer.salesforce.com/blogs/2020/06/lightning-web-components-performance-best-practices)
- [Step Up Your LWC Skills - Part 1](https://developer.salesforce.com/blogs/2020/10/step-up-your-lwc-skills-part-1)
- [Step Up Your LWC Skills - Part 2](https://developer.salesforce.com/blogs/2020/10/step-up-your-lwc-skills-part-2)
