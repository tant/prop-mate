# Architecture Document: Real Estate Management App

## 1. Introduction
This document outlines the comprehensive technical architecture for the "Real Estate Management App" project. It serves as the technical blueprint, ensuring consistency and providing direction for the development process.

* **Primary Reference:** Product Requirements Document (PRD) v1.0.
* **Platform Decision:** The project will be built from scratch to leverage the latest features of Next.js and to ensure full control over the architecture.

### 1.1. Change Log
| Date       | Version | Description                             | Author             |
| :--------- | :------ | :-------------------------------------- | :----------------- |
| 2025-07-18 | 1.0     | Initial draft of the architecture document. | Winston (Architect)|

---
## 2. High-Level Architecture

### 2.1. Technical Summary
The project will be built on a modern full-stack architecture, utilizing Next.js as the primary platform for both the frontend and the backend (via API Routes). The Firebase ecosystem will provide backend services (database, authentication, file storage), simplifying and accelerating development. This architecture prioritizes performance, offline capability, and a mobile-first user experience.

### 2.2. Architecture Diagram

```
+-----------------------------+
|        User (Browser)       |
+-------------+---------------+
              |
              v
+-----------------------------+
|   Hosting Platform (Vercel) |
|        Next.js App          |
+-------------+---------------+
      |       |        |      |
      v       v        v      v
+---------+ +---------+ +---------+ +-------------------+
|Firebase | |Firestore| |Cloud    | |Map Services       |
|Auth     | |Database | |Storage  | |OpenStreetMap/Leaf.|
+---------+ +---------+ +---------+ +-------------------+
      |
      v
+-----------------------------+
|  Offline Mode (IndexedDB)   |
+-----------------------------+
```

### 2.3. Architectural Patterns
* **Jamstack Architecture:** The frontend will be built as static or server-rendered pages using Next.js, communicating with backend services (Firebase) via APIs.
* **Backend for Frontend (BFF):** The Next.js API Routes will act as an intermediary backend layer, serving the specific needs of our frontend.
* **Serverless Functions:** Backend logic will be executed in serverless functions (Next.js API Routes), eliminating the need for a 24/7 running server.
* **Component-Based Architecture:** The interface will be divided into independent and reusable React components.
* **Repository Pattern (Data Service Layer):** A service layer will abstract all calls to Firestore, decoupling business logic from data access logic.

---
## 3. Tech Stack
| Category          | Technology                 | Version / Platform |
| :---------------- | :------------------------- | :----------------- |
| **Language** | TypeScript                 | 5.x                |
| **Frontend** | Next.js                    | 15.x               |
| **UI Framework** | React                      | 19                 |
| **Styling** | Tailwind CSS               | 3.x                |
| **UI Components** | Shadcn/ui                  | Latest             |
| **Backend** | Next.js API Routes         | 15.x               |
| **Database** | Firebase Firestore         | GCP                |
| **Authentication** | Firebase Authentication    | GCP                |
| **File Storage** | Cloud Storage for Firebase | GCP                |
| **Maps** | Leaflet.js / OpenStreetMap | Latest             |
| **Testing** | Jest / React Testing Library | Latest             |
| **Deployment** | Vercel                     | N/A                |
| **CI/CD** | GitHub Actions             | N/A                |

## 4. Data Models
### 4.1. Property
```typescript
import { Timestamp } from "firebase/firestore";

interface Property {
  id: string;
  memorableName: string; // Tên gợi nhớ
  price: number; // Giá bán
  imageUrls: string[]; // Danh sách URL hình ảnh
  address?: string;
  gps?: { lat: number; lng: number };
  area?: number;
  legalStatus?: string;
  frontage?: number;
  direction?: string;
  bedrooms?: number;
  bathrooms?: number;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 4.2. Client

```typescript
import { Timestamp } from "firebase/firestore";

interface Client {
  id: string;
  name: string; // Tên khách hàng
  phone: string; // SĐT
  email?: string;
  notes?: string;
  searchCriteria?: {
    propertyType?: string;
    locations?: string[];
    priceMin?: number;
    priceMax?: number;
  };
  source?: string; // Nguồn khách hàng
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 4.3. Appointment

```typescript
import { Timestamp } from "firebase/firestore";

interface Appointment {
  id: string;
  clientId: string;
  propertyIds: string[];
  appointmentTime: Timestamp; // Thời gian hẹn
  meetingPoint: string; // Nơi gặp
  status?: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
  clientFeedback?: string; // Phản hồi của khách
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## 5. API Specification

### 5.1. Property APIs
* `GET /api/properties`
* `GET /api/properties/[id]`
* `POST /api/properties`
* `PUT /api/properties/[id]`
* `DELETE /api/properties/[id]`

### 5.2. Client APIs
* `GET /api/clients`
* `GET /api/clients/[id]`
* `POST /api/clients`
* `PUT /api/clients/[id]`
* `DELETE /api/clients/[id]`

### 5.3. Appointment APIs
* `GET /api/appointments`
* `POST /api/appointments`
* `PUT /api/appointments/[id]`
* `DELETE /api/appointments/[id]`