# Curas MVP - Accessibility Statement

**Standard**: WCAG 2.2 Level AA

This document outlines the commitment and approach to making the Curas PWA accessible to people with disabilities. Our goal is to ensure a high-quality, inclusive experience for all users, including those who use assistive technologies.

## 1. Core Principles

We will follow the four core principles of accessibility (POUR):

-   **Perceivable**: Information and user interface components must be presentable to users in ways they can perceive.
-   **Operable**: User interface components and navigation must be operable.
-   **Understandable**: Information and the operation of the user interface must be understandable.
-   **Robust**: Content must be robust enough that it can be interpreted reliably by a wide variety of user agents, including assistive technologies.

## 2. Technical Implementation

To meet the WCAG 2.2 AA standard, we will implement the following technical measures:

### Semantic HTML
-   Use HTML5 elements (`<main>`, `<nav>`, `<header>`, `<footer>`, `<button>`, etc.) correctly to define the structure and meaning of the content.
-   Ensure a logical and consistent heading structure (`<h1>` through `<h6>`) to outline page content.

### ARIA (Accessible Rich Internet Applications)
-   Use ARIA roles, states, and properties to enhance the accessibility of dynamic components provided by `shadcn/ui` and other custom components.
-   Examples: `aria-label` for icon-only buttons, `aria-live` for dynamic announcements (e.g., "Offline"), and `role="alert"` for error messages.

### Keyboard Navigation & Focus Management
-   All interactive elements (links, buttons, form fields) will be reachable and operable using the keyboard alone.
-   The focus order will be logical and predictable, following the visual flow of the page.
-   Visible focus indicators will be styled to be highly noticeable, exceeding the default browser outlines.
-   When modals or dialogs are opened, focus will be trapped within them until they are closed.

### Color & Contrast
-   Text and interactive elements will have a color contrast ratio of at least 4.5:1 against their background, as specified by WCAG AA.
-   Color will not be used as the sole means of conveying information (e.g., error states will also have an icon and text).

### Forms & Inputs
-   All form inputs will have a corresponding `<label>`.
-   Required fields will be clearly marked, both visually and programmatically (e.g., with `aria-required="true"`).
-   Validation errors will be clearly associated with their respective fields and announced to screen readers.

### Images & Media
-   All informative images will have descriptive `alt` text.
-   Decorative images will have an empty `alt=""` attribute to be ignored by screen readers.
-   For user-uploaded photos (e.g., in an Issue), the context will be provided by surrounding text.

## 3. Testing & Validation

Accessibility will be a continuous effort, validated through:

-   **Automated Testing**: We will integrate `axe-core` into our CI/CD pipeline (via Playwright or similar) to automatically scan critical user flows for accessibility violations.
-   **Manual Testing**: Regular manual checks will be performed, focusing on:
    -   Keyboard-only navigation.
    -   Screen reader testing (e.g., VoiceOver on macOS/iOS, NVDA on Windows).
    -   Color contrast checks.
-   **Component Library**: We are using `shadcn/ui`, which is built on top of Radix UI, a library known for its commitment to accessibility. This provides a strong foundation for our components.
