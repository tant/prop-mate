# PRD: Templated Landing Pages for Properties (MVP)

> **Document Purpose:** This Product Requirements Document (PRD) outlines the goals, scope, workflows, and acceptance criteria for the Templated Landing Page feature.
> **MVP Focus:** The initial release focuses on providing users with a set of hardcoded templates. Template administration and multi-language support are out of scope for this MVP. The application's UI and generated content will be exclusively in Vietnamese.

---

## 1. Terminology

To ensure clarity and consistency, the following terms are defined:

-   **Template:** A system-defined, hardcoded **blueprint** that dictates the layout structure, available section types, and overall design style. Templates are **shared** and available to all users.
-   **Landing Page:** A **specific, generated web page** created *from* a Template. Each Landing Page contains unique data for a single property and is created and managed by an individual user. A Landing Page is the **private asset** of its creator and cannot be accessed or managed by other users.

---

## 2. Goals & Objectives

-   **Empower Users:** Allow users to quickly create, manage, and publish multiple, visually appealing landing pages for each property.
-   **Targeted Marketing:** Enable the creation of different landing page variations to target specific customer audiences.
-   **Streamline Workflow:** Offer two creation flows: a "super-fast" 3-field AI generation and a detailed manual editing mode.
-   **Ensure Quality:** Guarantee that all generated pages are responsive, SEO-friendly, and easily manageable.

---

## 3. Scope

### 3.1. In Scope (MVP)

-   **Hardcoded Templates:** 2-3 predefined templates with clear, unchangeable schemas.
-   **Dual Creation Flows:**
    1.  **Super-Fast AI Flow:** Generate a complete landing page from just 3 input fields (Title, Audience, USP).
    2.  **Detailed Editing Flow:** Manually edit the content of each section after AI generation.
-   **Centralized Management:** A dedicated "Landing Pages" section in the main sidebar for users to manage **their own** pages.
-   **Access Control:** Landing pages can be set to `Public` (discoverable by search engines) or `Unlisted` (accessible only via direct link).
-   **Vietnamese Language Only:** All UI and generated content will be in Vietnamese.

### 3.2. Out of Scope (MVP)

-   **No Template Administration:** No UI for creating, editing, or deleting templates (CRUD).
-   **No Internationalization (i18n):** No support for multiple languages.
-   **No Advanced Features:** No versioning, A/B testing, password protection, or third-party integrations (e.g., CRM, email marketing).
-   **No Complex Workflows:** No multi-step approval/publishing workflows or edit history.

---

## 4. User Workflow (Happy Path)

1.  **Initiate:** User clicks "Create New Landing Page" from the central sidebar or from within a specific property's page.
2.  **Select:** User selects the associated property (if not already in context) and chooses one of the available templates.
3.  **Input:** User provides three core inputs: a **Title**, the target **Audience**, and the key **Unique Selling Proposition (USP)**.
4.  **Generate:** The system calls the AI (Gemini) to generate the full landing page content based on the user's input and the selected template's schema. This is a **one-time generation** process.
5.  **Review & Decide:** After generation, the user previews the page and chooses one of three actions:
    a.  **Publish Immediately.**
    b.  **Edit Manually** before publishing.
    c.  **Delete & Restart** to re-run the AI generation from scratch.
6.  **Publish:** User configures the page's access (`Public`/`Unlisted`) and a unique `slug` is generated. The page goes live.
7.  **Manage:** User can later find, filter, and manage their created landing page from the central management dashboard.

---

## 5. Technical & Functional Requirements

### 5.1. Template & Data Model (Hardcoded)

-   **Template Schema:** Each template is an object defined in the codebase, containing metadata (id, name, thumbnail) and a schema defining its sections, slots, and data types.
-   **Data Storage (Firestore):** A `landingPages` collection will store the generated page data. Each document must include:
    -   `userId`: The ID of the owner. **(Crucial for access control)**
    -   `propertyId`: The associated property.
    -   `templateId`: The ID of the blueprint used.
    -   `status`: `draft` | `published` | `unlisted`.
    -   `slug`: A unique, non-PII identifier for the URL.
    -   `content`: A JSON object containing the page's content, validated against the template's schema.
    -   `seo`: { `title`, `description`, `ogImageUrl` }.
    -   Timestamps (`createdAt`, `updatedAt`).

### 5.2. AI Integration (Gemini)

-   **Prompt Engineering:** The prompt sent to the AI will include the user's three inputs, context from the associated property (if available), and a clear instruction to output a JSON object that strictly follows the template's schema.
-   **One-Time Generation:** The AI is used only for the initial content creation. Re-generating content requires creating a new landing page. This simplifies the workflow and manages user expectations.

### 5.3. Publishing & Rendering

-   **URL Structure:** Public pages will be available at a clean URL, e.g., `/p/[slug]`.
-   **Performance:** Pages will be rendered using SSG/ISR for optimal load times (TTFB < 500ms).
-   **SEO:**
    -   `Public` pages will be included in the sitemap and indexed.
    -   `Unlisted` pages will have a `noindex` meta tag and be excluded from the sitemap.
    -   The Open Graph (OG) image will default to the property's hero image.

### 5.4. Non-Functional Requirements

-   **Performance:** Publish/unpublish actions should complete in < 3 seconds.
-   **Security:** All API endpoints for accessing or modifying landing page data **must** validate that the request is coming from the `userId` who owns the document.
-   **Scalability:** The architecture should be modular, allowing for the potential addition of a template admin system in the future without a major refactor.
-   **Accessibility:** All generated pages should meet WCAG AA standards.

---

## 6. Acceptance Criteria

-   A user can successfully create a landing page using the 3-field "super-fast" flow.
-   A user can edit the AI-generated content of each section before publishing.
-   A user can view and manage **only their own** landing pages from the central dashboard.
-   The `Public` vs. `Unlisted` access control correctly applies `noindex` tags and sitemap inclusion rules.
-   The final public page is fully responsive across mobile, tablet, and desktop devices.
-   The system correctly prevents a user from accessing or managing another user's landing pages.


