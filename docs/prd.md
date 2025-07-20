# Product Requirements Document (PRD): Real Estate Management App

## 1. Goals and Background Context

### 1.1. Goals
* To provide a stable, efficient, and easy-to-use tool for real estate agents.
* To prioritize a mobile-first experience and include offline mode capabilities.
* To centralize property, client, and appointment management functionalities into a single place.

### 1.2. Background Context
This project was initiated to solve the workflow challenges faced by independent real estate agents and small teams. Currently, the management of client information, property details, and appointments is often done manually across multiple disconnected tools (notebooks, Excel, Zalo), leading to fragmented, hard-to-retrieve, and time-consuming data management. This application aims to become a central work tool, simplifying daily operations and helping agents improve their efficiency and professionalism, especially given their need to work continuously on mobile devices while on the go.

### 1.3. Change Log
| Date       | Version | Description                  | Author      |
| :--------- | :------ | :--------------------------- | :---------- |
| 2025-07-18 | 1.0     | Initial draft of the PRD.    | John (PM)   |

---
## 2. Requirements

### 2.1. Functional Requirements (FR)
1.  The user must be able to create, view, edit, and delete a "Hồ sơ Bất động sản" (Property Profile).
2.  The "Hồ sơ Bất động sản" must include the defined mandatory and optional fields.
3.  The user must be able to create, view, edit, and delete a "Hồ sơ Khách hàng" (Client Profile).
4.  The user must be able to create a "Lịch hẹn" (Appointment), linking one client to one or more properties.
5.  The user must be able to review created appointments.
6.  The application must have an offline mode, allowing the user to view, create, and edit data.
7.  Data modified while offline must be automatically synchronized with the server when a network connection is re-established.
8.  The user must be able to log in to the application using the pre-configured account (email/password) in the system.
9.  A logged-in user must be able to log out of their account.

### 2.2. Non-Functional Requirements (NFR)
1.  The application must be a Responsive Web App, working well on both mobile phones and desktop computers.
2.  The user interface must be simple, intuitive, and easy to use for non-tech-savvy users.
3.  The response time for basic actions (viewing, saving) must be fast, under 2 seconds under normal network conditions.
4.  As the application is initially for a single user, the system does not need to handle complex permission issues or concurrent data conflicts.
5.  The system only supports a single user account, and login credentials cannot be changed from the application interface.

---
## 3. User Interface Design Goals

### 3.1. Overall UX Vision
To create a clean user interface (UI) that prioritizes loading speed and responsiveness. Minimize unnecessary steps so the user can complete tasks (adding a property, creating an appointment) as quickly as possible.

### 3.2. Key Interaction Paradigms
* Focus on simple data entry forms, easy-to-filter-and-search lists, and buttons with clear functions. Limit complex animations that could slow down the application.
* On the mobile interface, the main navigation menu will be a **Bottom Navigation** bar to provide a native app-like experience, instead of a hamburger menu.

### 3.3. Core Screens
* Màn hình Đăng nhập (Login Screen)
* Bảng điều khiển chính (Dashboard)
* Danh sách Bất động sản (Property List Screen)
* Màn hình Bản đồ Bất động sản (Property Map Screen)
* Chi tiết Bất động sản (Thêm/Sửa) (Property Details - Add/Edit Screen)
* Danh sách Khách hàng (Client List Screen)
* Chi tiết Khách hàng (Thêm/Sửa) (Client Details - Add/Edit Screen)
* Lịch hẹn (Appointments Screen)

### 3.4. Target Platforms
A responsive web app with a mobile-first priority.

---
## 4. Technical Assumptions
* **Platform & Framework:** The frontend and backend will be developed uniformly on the **Next.js 15.4** and **React 19** platform.
* **Backend Ecosystem:** The **Firebase** suite of services will be used for backend needs, including Firestore (Database), Authentication, and Cloud Storage (Image Storage).
* **Maps:** Use **OpenStreetMap** as the data source and the **Leaflet.js** library for map rendering.
* **General Architecture:**
    * The product is a **Responsive Web App**, with a mobile-first priority.
    * The application must have **offline mode** capability.
    * The system is designed for a **single user**, and real-time data synchronization is not a hard requirement.

---
## 5. Epic List
The project will be structured into 3 main Epics, arranged in a logical development order:
* **Epic 1: Foundation & Core Property Management**
    * **Goal:** To set up the project, the user authentication system, and provide the central functionality of creating and managing the property list.
* **Epic 2: Customer & Appointment Management**
    * **Goal:** To build the customer management and appointment creation features, connecting properties with potential clients.
* **Epic 3: Map Visualization & Offline Capability**
    * **Goal:** To enhance the user experience with the feature to view properties on a map and ensure the application can work without a network connection.

---
## 6. Epic Details

### **Epic 1: Foundation & Core Property Management**
* **Story 1.1: Project Setup & Firebase Integration**
    * **Description:** Includes creating the Next.js project structure and connecting to the selected Firebase services.
    * **AC:** 1. Next.js project is initialized. 2. Firebase connection configuration is set up. 3. A simple homepage exists to confirm the project runs successfully.
* **Story 1.2: Build Login/Logout Functionality**
    * **Description:** Create the login screen and integrate with Firebase Authentication.
    * **AC:** 1. A login page with email/password fields exists. 2. Successful login with the manually created Firebase Console account redirects to the main page. 3. Failed login displays a user-friendly error. 4. Logged-in users can log out.
* **Story 1.3: Display Property List**
    * **Description:** Create the main interface for displaying the list of managed properties.
    * **AC:** 1. After login, the user sees a Dashboard. 2. This page displays a list of properties (name, price, photo). 3. A prominent button labeled "Thêm BĐS mới" (Add New Property) is visible.
* **Story 1.4: Add a New Property**
    * **Description:** Build the form to create a new property profile.
    * **AC:** 1. The "Thêm BĐS mới" button opens a form. 2. The form includes all defined data fields. 3. The user can upload multiple images. 4. After saving, the new property appears in the list.
* **Story 1.5: View & Edit Property Details**
    * **Description:** Allow users to view details and update information for an existing property.
    * **AC:** 1. Clicking a property navigates to its detail page. 2. The detail page displays all information. 3. An "Chỉnh sửa" (Edit) button allows for updates.
* **Story 1.6: Delete a Property**
    * **Description:** Allow users to delete a property.
    * **AC:** 1. A delete function is available. 2. A confirmation dialog is required before deletion. 3. The deleted property is removed from the list.

### **Epic 2: Customer & Appointment Management**
* **Story 2.1: Display Client List**
    * **Description:** Create a screen to display the list of all clients.
    * **AC:** 1. Navigation to the "Khách hàng" (Clients) page exists. 2. The page lists clients (name, phone). 3. A "Thêm Khách hàng mới" (Add New Client) button exists.
* **Story 2.2: Add and Edit a Client**
    * **Description:** Build the form to create or update client information.
    * **AC:** 1. The "Thêm Khách hàng mới" button opens a form. 2. The form includes all defined data fields. 3. Users can view and edit details from the list. 4. Information is updated upon saving.
* **Story 2.3: Delete a Client**
    * **Description:** Allow users to delete a client.
    * **AC:** 1. A delete function exists on the detail page. 2. Confirmation is required. 3. The client is removed from the list upon deletion.
* **Story 2.4: Display Appointment List**
    * **Description:** Create a screen to view created appointments.
    * **AC:** 1. Navigation to the "Lịch hẹn" (Appointments) page exists. 2. The page lists appointments (time, client, property). 3. A "Tạo Lịch hẹn mới" (Create New Appointment) button exists.
* **Story 2.5: Create a New Appointment**
    * **Description:** Build the core functionality to schedule a property viewing.
    * **AC:** 1. The "Tạo Lịch hẹn mới" button opens a form. 2. The form allows selecting one client. 3. The form allows selecting one or more properties. 4. The form allows entering a time and meeting point. 5. The new appointment appears in the list after saving.
* **Story 2.6: Edit and Delete an Appointment**
    * **Description:** Allow users to update or cancel an appointment.
    * **AC:** 1. Users can view appointment details. 2. Options for "Chỉnh sửa" (Edit) and "Xóa" (Delete) (with confirmation) are available.

### **Epic 3: Map Visualization & Offline Capability**
* **Story 3.1: Display Properties on a Map**
    * **Description:** Create a map screen that displays all properties with GPS coordinates as pins.
    * **AC:** 1. Navigation to the "Bản đồ" (Map) page exists. 2. The screen displays a map. 3. All properties with GPS data are shown as pins.
* **Story 3.2: Interact with Map Pins**
    * **Description:** Allow users to interact with property pins on the map for quick info.
    * **AC:** 1. Clicking a pin shows a pop-up. 2. The pop-up contains summary info (name, price, photo). 3. The pop-up has a link to the property's detail page.
* **Story 3.3: Cache Data for Offline Use**
    * **Description:** Set up a mechanism to save a local copy of data on the user's device.
    * **AC:** 1. Data from Firestore is downloaded and saved to local storage when online. 2. All saved data remains viewable when offline.
* **Story 3.4: Edit Data While Offline**
    * **Description:** Allow users to perform CRUD operations on data even without an internet connection.
    * **AC:** 1. CRUD operations work on the local data copy when offline. 2. These changes are saved to a sync queue.
* **Story 3.5: Synchronize Data**
    * **Description:** Build a mechanism to automatically sync offline changes to the server.
    * **AC:** 1. The app automatically sends the sync queue to Firestore upon reconnecting. 2. The queue is cleared on successful sync. 3. The app also fetches the latest changes from the server.
* **Story 3.6: Display Connection Status**
    * **Description:** Provide visual indicators so the user knows if they are online or offline.
    * **AC:** 1. A clear indicator is shown when the network connection is lost. 2. An indicator shows when data is being synchronized.

## 7. Checklist Results Report
* **Summary:** 99% completeness, MVP scope is appropriate, ready for the Architecture phase.
* **Final Decision:** READY FOR ARCHITECT.

## 8. Next Steps
### 8.1. Architect Prompt
"Hello Winston, The Product Requirements Document (PRD) for the Real Estate Management App project is complete. This document includes detailed requirements and the agreed-upon technical assumptions (Next.js, Firebase, Leaflet). Please review this document and begin building the detailed Architecture Document, including system architecture, directory structure, and data models. Thank you."