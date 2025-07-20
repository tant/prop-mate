# Project Brief: Real Estate Agent Management App

### 1. Executive Summary
This is a mobile-first responsive web application designed for real estate agents to efficiently manage their property listings, client information, and work schedule directly from their mobile phones, while also ensuring a good experience on desktop. It solves the inefficiency of manual, fragmented information management by centralizing all critical data (properties, clients, appointments) in a single place, accessible seamlessly across devices, even when offline. The target market is independent real estate agents and those in small teams in Vietnam.

### 2. Problem Statement
Real estate agents are frequently on the move and require immediate access to information. However, their current management methods (notebooks, Excel, Zalo, scattered notes) are fragmented and inefficient. This leads to time-consuming information retrieval, difficulty in matching properties with potential clients, and a reduction in professionalism when they cannot provide fast and accurate information to clients.

### 3. Proposed Solution
We propose building a responsive web app with offline-first capabilities. The solution will be built on the Next.js platform and the Firebase ecosystem to accelerate development. The solution focuses on simplicity and efficiency, comprising the following core functional modules:
* Property Management
* Client Management
* Appointment Scheduling
* Deal Tracking

### 4. Target Users
* **Segment:** Independent real estate agents or those working in small teams in Vietnam.
* **Behavior:** Dynamic, constantly moving, and primarily working on their mobile devices.
* **"Pain Points":** Wasted time on manual information management, fragmented data, and difficulty retrieving information instantly.

### 5. Goals & Success Metrics
* **Goals:** To provide a stable, easy-to-use tool that helps real estate agents manage their daily work more efficiently and professionally.
* **KPIs:** To be defined after the product launch, based on feedback and real user data.

### 6. MVP (Minimum Viable Product) Scope
* **Core Features:** Property Management, Client Management, Appointment Scheduling, Offline Mode, Map Visualization.
* **Out of Scope:** Advanced reporting, advanced map features (e.g., search by drawing area, data layers), automatic property suggestions, detailed contract and financial management.

### 7. Post-MVP Vision
The long-term development roadmap will be built based on real user feedback after the initial version is launched.

### 8. Technical Considerations
* **Platform & Framework:** The frontend and backend will be developed uniformly on the **Next.js 15.4** and **React 19** platform.
* **Backend Ecosystem:** The **Firebase** suite of services will be used for backend needs, including Firestore (Database), Authentication, and Cloud Storage (Image Storage).
* **Maps:** Use **OpenStreetMap** as the data source and the **Leaflet.js** library for map rendering.
* **General Architecture:**
    * The product is a **Responsive Web App**, with a mobile-first priority.
    * The application must have **offline mode** capability.
    * The system is designed for a **single user**, and real-time data synchronization is not a hard requirement.

### 9. Constraints & Assumptions
* **Constraints:** Flexible budget and timeline; initial phase serves only a single user; does not handle complex legal contracts.
* **Assumptions:** The target user is familiar with smartphones; a centralized, simple solution will improve their work efficiency.

### 10. Risks & Open Questions
* **Risks:** Adoption risk (users changing habits); technical risk (offline complexity); scalability risk (difficulty expanding for teams in the future).
* **Open Questions:** What is the most intuitive and user-friendly interface for a busy real estate agent?