# Biometric Staff Attendance Management System

A comprehensive attendance tracking solution with biometric fingerprint authentication, featuring a Spring Boot backend, Angular web dashboard, and React Native mobile application.

## 📋 Project Overview

This system provides automated staff attendance management using biometric fingerprint recognition.  It tracks arrival and departure times, manages staff records, departments, and generates attendance reports.

### Key Features

- **Biometric Authentication**: Fingerprint-based attendance recording
- **Multi-Platform Support**: Web dashboard and mobile app
- **Real-time Tracking**: Monitor staff arrivals, departures, and absences
- **Department Management**: Organize staff by departments
- **Comprehensive Reporting**:  Attendance statistics and analytics
- **Contract Management**: Track staff contracts and status

## 🏗️ Architecture

This monorepo contains three main components:

- **Back-end/**:  Spring Boot REST API with MySQL
- **Agile-Web/**: Angular web application for administrators
- **Agile_Mobile/**:  Expo/React Native mobile app for staff

## 🚀 Getting Started

### Prerequisites

- **Backend**: Java 17+, Maven, MySQL
- **Web**:  Node.js 18+, Angular CLI 20. 3. 8+
- **Mobile**: Node.js 18+, Expo CLI

### Backend Setup

```bash
cd Back-end/Fingerprint-management

# Configure database connection in application.properties
# Start PostgreSQL and create database

# Build and run
mvn clean install
mvn spring-boot:run
```

The API will be available at `http://localhost:8080`

### Web Application Setup

```bash
cd Agile-Web

# Install dependencies
npm install

# Start development server
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload on file changes.

### Mobile Application Setup

```bash
cd Agile_Mobile

# Install dependencies
npm install

# Start Expo development server
npx expo start
```

Scan the QR code with Expo Go app or run on an emulator.

## 📚 API Documentation

Detailed API documentation is available in the Back-end directory: 

- [Attendance API Documentation](Back-end/Fingerprint-management/ATTENDANCE_API_DOCUMENTATION.md)
- [Staff API Documentation](Back-end/Fingerprint-management/STAFF_API_DOCUMENTATION.md)
- [Department API Documentation](Back-end/Fingerprint-management/DEPARTMENT_API_DOCUMENTATION.md)

### Core API Endpoints

**Attendance Management**
- `POST /api/attendance/record` - Record arrival/departure
- `GET /api/attendance/staff/{staffId}` - Get staff attendance history
- `GET /api/attendance/department/{deptId}` - Get department attendance

**Staff Management**
- `POST /api/staff` - Create new staff member
- `GET /api/staff/{id}` - Get staff details
- `PUT /api/staff/{id}` - Update staff information
- `GET /api/staff` - List all staff members

**Department Management**
- `POST /api/departments` - Create department
- `GET /api/departments` - List all departments
- `GET /api/departments/{id}/details` - Get department with staff list

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Database**: MySQL
- **Security**: Spring Security with BCrypt
- **ORM**: JPA/Hibernate
- **Build Tool**: Maven

### Web Frontend
- **Framework**: Angular 20.3.8
- **Language**: TypeScript
- **Testing**:  Karma, Jasmine
- **CLI**: Angular CLI

### Mobile App
- **Framework**: Expo / React Native
- **Language**: TypeScript/JavaScript
- **Platform**: iOS & Android

## 📱 Features by Platform

### Web Dashboard (Admin)
- Staff management (CRUD operations)
- Department organization
- Attendance reports and analytics
- Contract management
- Real-time attendance monitoring

### Mobile App (Staff)
- Biometric attendance check-in/check-out
- View personal attendance history
- Check attendance status
- Profile management

## 🧪 Testing

### Backend Tests
```bash
cd Back-end/Fingerprint-management
mvn test
```

### Web Application Tests
```bash
cd Agile-Web
ng test          # Unit tests
ng e2e           # End-to-end tests
```

## 📦 Building for Production

### Backend
```bash
cd Back-end/Fingerprint-management
mvn clean package
java -jar target/fingerprint-management-*. jar
```
NB: The backend is automatically deployed on a VPS on every change made in the backend directory through GitHub Actions. The production build is available at `https://simsyann.dev/fingerprint`

### Web Application
```bash
cd Agile-Web
ng build --configuration production
ng deploy --base-href=/biometric-staff-attendance-mgt/

# This command builds the project using the production configuration, which includes optimizations for performance and speed.
# This command deploys the built project to a hosting service, setting the base URL for the application to `/biometric-staff-attendance-mgt/`.
```
NB: The Front end web app is automatically deployed on github pages on every change made in the backend directory through GitHub Actions. The production build is available at `https://ahmad-amine2005.github.io/biometric-staff-attendance-mgt/`

### User Admin Credentials

- **email**: johnass.admin@company.com
- **Password**: admin123456

### Mobile App
```bash
cd Agile_Mobile
# For Android
npx expo build:android

# For iOS
npx expo build:ios
```

## 📄 Database Schema

Main entities:
- **User**: Base user information
- **Staff**:  Extends User with staff-specific data
- **Department**: Organizational units
- **Attendance**: Check-in/check-out records
- **Contract**: Staff employment contracts
- **Fingerprint**: Biometric authentication data

## 🤝 Contributing
- [Kouetche Simo Yann Jefferson](https://sims-yann.me)
- Ahmad-amine
- Foning Luc Xavier
- Kengne Gloria
- Makuetche Nwetom Patricia
- Kana Elsa


