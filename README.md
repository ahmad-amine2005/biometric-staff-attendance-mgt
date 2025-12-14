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

### Web Application
```bash
cd Agile-Web
ng build
# Build artifacts will be in the dist/ directory
```

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

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Check existing API documentation
- Review error handling guides in API docs

## 📝 License

This project is part of an academic assignment for ISJ Group 4.

## 👥 Team

ISJ Group 4 - Biometric Staff Attendance Management System

---

**Note**:  Make sure to configure your database connection and update the CORS settings in production environments.