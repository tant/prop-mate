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
1.  The user must be able to create, view, edit, and delete a "Property Profile".
2.  The "Property Profile" must include the defined mandatory and optional fields.
3.  The user must be able to create, view, edit, and delete a "Client Profile".
4.  The user must be able to create an "Appointment", linking one client to one or more properties.
5.  The user must be able to review created appointments.
6.  The application must have an offline mode, allowing the user to view, create, and edit data.
7.  Data modified while offline must be automatically synchronized with the server when a network connection is re-established.
8.  The user must be able to log in to the application using the pre-configured account (email/password) in the system.
9.  A logged-in user must be able to log out of their account.
10. The application must provide a responsive and accessible user interface.
11. The application must support basic search and filter for property and client lists.
12. The application must provide clear error messages and loading indicators for all major actions.

### 2.2. Non-Functional Requirements (NFR)
1.  The application must be a Responsive Web App, working well on both mobile phones and desktop computers.
2.  The user interface must be simple, intuitive, and easy to use for non-tech-savvy users.
3.  The response time for basic actions (viewing, saving) must be fast, under 2 seconds under normal network conditions.
4.  As the application is initially for a single user, the system does not need to handle complex permission issues or concurrent data conflicts.
5.  The system only supports a single user account, and login credentials cannot be changed from the application interface.
6.  The application must comply with accessibility standards (WCAG) where possible.
7.  The application must be maintainable and easy to extend for future features.

---
## 3. User Interface Design Goals

### 3.1. Overall UX Vision
To create a clean, fast, and responsive user interface (UI) that prioritizes loading speed and usability. Minimize unnecessary steps so the user can complete tasks (adding a property, creating an appointment) as quickly as possible.

### 3.2. Key Interaction Paradigms
* Focus on simple data entry forms, easy-to-filter-and-search lists, and buttons with clear functions. Limit complex animations that could slow down the application.
* On the mobile interface, the main navigation menu will be a **Bottom Navigation** bar to provide a native app-like experience, instead of a hamburger menu.
* All UI components should be accessible and keyboard-friendly.
* Loading states and error messages should be clear and consistent across the app.

### 3.3. Core Screens
* Login Screen
* Main Dashboard
* Property List Screen
* Property Map Screen
* Property Details (Add/Edit) Screen
* Client List Screen
* Client Details (Add/Edit) Screen
* Appointments Screen

### 3.4. Target Platforms
A responsive web app with a mobile-first priority.

---
## 4. User Flow

### 4.1. Đăng nhập & Khởi động ứng dụng

```
┌────────────┐
│   Start    │
└─────┬──────┘
      │
      v
┌──────────────┐
│  Open App    │
└─────┬────────┘
      │
      v
┌──────────────┐
│ Login Screen │
└─────┬────────┘
      │
      ├─[Đúng email/password]──▶┌────────────────────┐
      │                         │ Dashboard/Main Menu │
      │                         └────────────────────┘
      └─[Sai thông tin]────────▶[Hiển thị lỗi - thử lại]
```

### 4.2. Quản lý Bất động sản (BĐS)

```
┌──────────────┐
│  Dashboard   │
└─────┬────────┘
      │
      v
┌──────────────┐
│ Property List│
└─┬────┬────┬──┘
  │    │    │
  │    │    └─────────────┐
  │    │                  │
  │    └──[Xem chi tiết]──┼─▶┌────────────────┐
  │                       │  │Property Details│
  │                       │  └─────┬──────────┘
  │                       │        │
  │                       │   [Chỉnh sửa/Xóa]
  │                       │        │
  │                       │   [Cập nhật/Xóa thành công]
  │                       │
  └──[Thêm mới]────────────┘
       │
       v
   [Form BĐS]
       │
   [Lưu/Quay lại]
```

### 4.3. Quản lý Khách hàng

```
┌──────────────┐
│  Dashboard   │
└─────┬────────┘
      │
      v
┌──────────────┐
│  Client List │
└─┬────┬────┬──┘
  │    │    │
  │    │    └─────────────┐
  │    │                  │
  │    └──[Xem chi tiết]──┼─▶┌────────────────┐
  │                       │  │Client Details  │
  │                       │  └─────┬──────────┘
  │                       │        │
  │                       │   [Chỉnh sửa/Xóa]
  │                       │        │
  │                       │   [Cập nhật/Xóa thành công]
  │                       │
  └──[Thêm mới]────────────┘
       │
       v
   [Form KH]
       │
   [Lưu/Quay lại]
```

### 4.4. Tạo & Quản lý Lịch hẹn

```
┌──────────────┐
│  Dashboard   │
└─────┬────────┘
      │
      v
┌─────────────────┐
│ Appointment List│
└─┬────┬────┬─────┘
  │    │    │
  │    │    └─────────────┐
  │    │                  │
  │    └──[Xem chi tiết]──┼─▶┌────────────────────┐
  │                       │  │Appointment Details │
  │                       │  └─────┬──────────────┘
  │                       │        │
  │                       │   [Chỉnh sửa/Xóa]
  │                       │        │
  │                       │   [Cập nhật/Xóa thành công]
  │                       │
  └──[Thêm mới]────────────┘
       │
       v
   [Form Lịch hẹn]
       │
   [Lưu/Quay lại]
```

### 4.5. Sử dụng Offline & Đồng bộ

```
┌──────────────┐
│ App Offline  │
└─────┬────────┘
      │
      v
[Người dùng thao tác CRUD]
      │
      v
[Dữ liệu lưu local]
      │
      v
[Khi có mạng lại]
      │
      v
[Đồng bộ dữ liệu lên server]
```

---
## 5. Epic List
The project will be structured into 5 main Epics, arranged in a logical development order:
* **Epic 1: Project Setup & Authentication**
    * **Goal:** To set up the project, configure global styles, connect to Firebase, and implement user authentication (login/logout).
* **Epic 2: Property Management**
    * **Goal:** To provide the core functionality for creating, viewing, editing, and deleting property profiles.
* **Epic 3: Client Management**
    * **Goal:** To provide the core functionality for managing client profiles.
* **Epic 4: Appointment Scheduling**
    * **Goal:** To enable users to create, view, edit, and delete appointments linking clients and properties.
* **Epic 5: Map & Offline Features**
    * **Goal:** To provide map visualization, offline data caching, and synchronization features.

---
## 6. Epic Details

### Epic 1: Project Setup & Authentication
* **Story 1.1: Project Initialization, Global Styles & Firebase Integration**
    * **Description:** Initialize the Next.js project, set up global styles (CSS, fonts, color palette, default UI elements), and connect to Firebase services (Firestore, Auth, Storage).
    * **AC:**
        - Next.js project is initialized.
        - Global CSS, fonts, and color palette are configured.
        - (Optional) UI framework is integrated if needed.
        - Firebase connection configuration is set up.
        - A simple homepage exists to confirm the project runs successfully.
* **Story 1.2: Implement Login/Logout Functionality**
    * **Description:** Create the login screen and integrate with Firebase Authentication (email/password). Implement logout. UI labels and messages must be in Vietnamese (e.g., "Đăng nhập", "Đăng xuất").
    * **AC:**
        - A login page with email/password fields exists (fields labeled in Vietnamese).
        - Successful login with a Firebase Console account redirects to the main page.
        - Failed login displays a user-friendly error (in Vietnamese).
        - Logged-in users can log out (button labeled "Đăng xuất").
* **Story 1.3: Create Navigation Menu & Basic Pages**
    * **Description:** Design and implement the main navigation menu (sidebar for desktop, bottom navigation for mobile) and create basic pages (Dashboard, Bất động sản, Khách hàng, Lịch hẹn) with placeholder content. All menu labels and navigation must be in Vietnamese.
    * **AC:**
        - The main navigation menu appears on all pages after login.
        - Menu items: "Dashboard", "Bất động sản", "Khách hàng", "Lịch hẹn".
        - Clicking each menu item navigates to the corresponding page with a title and placeholder content.
        - All menu labels, page titles, and navigation are in Vietnamese.
        - The navigation menu works well on both desktop and mobile.

### Epic 2: Property Management
* **Story 2.1: Display Property List**
    * **Description:** Display the list of properties ("Tên", "Giá", "Ảnh") with a prominent "Thêm BĐS mới" button. All UI labels must be in Vietnamese.
    * **AC:**
        - After login, the user sees a Dashboard.
        - The page displays a list of properties ("Tên", "Giá", "Ảnh").
        - A prominent button labeled "Thêm BĐS mới" is visible.
* **Story 2.2: Add a New Property**
    * **Description:** Provide a form to add a new property. All form fields and buttons must be in Vietnamese.
    * **AC:**
        - The "Thêm BĐS mới" button opens a form.
        - The form includes all defined data fields (labeled in Vietnamese).
        - The user can upload multiple images.
        - After saving, the new property appears in the list.
* **Story 2.3: View & Edit Property Details**
    * **Description:** Allow users to view and edit property details. All UI labels and buttons must be in Vietnamese.
    * **AC:**
        - Clicking a property navigates to its detail page.
        - The detail page displays all information.
        - An "Chỉnh sửa" button allows for updates.
* **Story 2.4: Delete a Property**
    * **Description:** Allow users to delete a property. All confirmation dialogs and buttons must be in Vietnamese.
    * **AC:**
        - A delete function is available.
        - A confirmation dialog (in Vietnamese) is required before deletion.
        - The deleted property is removed from the list.

### Epic 3: Client Management
* **Story 3.1: Display Client List**
    * **Description:** Display the list of clients ("Tên", "Số điện thoại") with a prominent "Thêm Khách hàng mới" button. All UI labels must be in Vietnamese.
    * **AC:**
        - Navigation to the "Khách hàng" page exists.
        - The page lists clients ("Tên", "Số điện thoại").
        - An "Thêm Khách hàng mới" button exists.
* **Story 3.2: Add and Edit a Client**
    * **Description:** Provide a form to add or edit client information. All form fields and buttons must be in Vietnamese.
    * **AC:**
        - The "Thêm Khách hàng mới" button opens a form.
        - The form includes all defined data fields (labeled in Vietnamese).
        - Users can view and edit details from the list.
        - Information is updated upon saving.
* **Story 3.3: Delete a Client**
    * **Description:** Allow users to delete a client. All confirmation dialogs and buttons must be in Vietnamese.
    * **AC:**
        - A delete function exists on the detail page.
        - Confirmation is required (dialog in Vietnamese).
        - The client is removed from the list upon deletion.

### Epic 4: Appointment Scheduling
* **Story 4.1: Display Appointment List**
    * **Description:** Display the list of appointments ("Thời gian", "Khách hàng", "BĐS") with a prominent "Tạo Lịch hẹn mới" button. All UI labels must be in Vietnamese.
    * **AC:**
        - Navigation to the "Lịch hẹn" page exists.
        - The page lists appointments ("Thời gian", "Khách hàng", "BĐS").
        - A "Tạo Lịch hẹn mới" button exists.
* **Story 4.2: Create a New Appointment**
    * **Description:** Provide a form to create a new appointment. All form fields and buttons must be in Vietnamese.
    * **AC:**
        - The "Tạo Lịch hẹn mới" button opens a form.
        - The form allows selecting one client.
        - The form allows selecting one or more properties.
        - The form allows entering a time and meeting point.
        - The new appointment appears in the list after saving.
* **Story 4.3: Edit and Delete an Appointment**
    * **Description:** Allow users to view, edit, or delete an appointment. All UI labels and dialogs must be in Vietnamese.
    * **AC:**
        - Users can view appointment details.
        - Options for "Chỉnh sửa" and "Xóa" (with confirmation in Vietnamese) are available.

### Epic 5: Map & Offline Features
* **Story 5.1: Map Visualization**
    * **Description:** Display properties with GPS data as pins on a map. All map UI labels must be in Vietnamese.
    * **AC:**
        - Properties with GPS data are shown as pins on a map.
        - Clicking a pin shows a pop-up with summary info (in Vietnamese) and link to detail page.
* **Story 5.2: Offline Data Caching**
    * **Description:** Cache data locally for offline use.
    * **AC:**
        - Data from Firestore is downloaded and saved to local storage when online.
        - All saved data remains viewable when offline.
* **Story 5.3: Offline CRUD & Sync**
    * **Description:** Allow CRUD operations on data while offline and synchronize changes when reconnected.
    * **AC:**
        - CRUD operations work on the local data copy when offline.
        - These changes are saved to a sync queue.
        - The app automatically sends the sync queue to Firestore upon reconnecting.
        - The queue is cleared on successful sync.
* **Story 5.4: Connection Status Indicator**
    * **Description:** Show clear indicators for online/offline status and data synchronization. All indicators must be in Vietnamese.
    * **AC:**
        - A clear indicator is shown when the network connection is lost (in Vietnamese).
        - An indicator shows when data is being synchronized (in Vietnamese).

---
## 7. Checklist Results Report
* **Summary:** The requirements and scope are 99% complete. The MVP scope is appropriate and ready for the Architecture phase. All major features and technical assumptions have been clearly defined.
* **Final Decision:** READY FOR ARCHITECT.

## 8. Next Steps
### 8.1. Architect Prompt
"Hello Winston, The Product Requirements Document (PRD) for the Real Estate Management App project is complete. This document includes detailed requirements, technical assumptions (Next.js, Firebase, Tailwind CSS 4, shadcn/ui, Leaflet), and a clear epic/story breakdown. Please review this document and begin building the detailed Architecture Document, including system architecture, directory structure, and data models. Thank you."