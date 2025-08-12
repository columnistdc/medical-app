# Medical App

Full-stack medical application with **automatic type generation** for frontend, built with NestJS (backend) and React (frontend).

## ✨ Features

- **🔧 Backend**: NestJS with Swagger/OpenAPI documentation
- **⚛️ Frontend**: React + Vite with TypeScript
- **📝 Auto-generated Types**: TypeScript types automatically generated from OpenAPI specification
- **🎯 Type Safety**: Full type safety between frontend and backend
- **📚 API Documentation**: Interactive Swagger UI
- **🧪 Testing**: Comprehensive test suite for both frontend and backend
- **🎨 Code Quality**: ESLint + Prettier configuration
- **🚀 Development**: Automated development environment setup

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm

### Installation
```bash
# Install dependencies
npm install

# Install Husky hooks
npm run prepare
```

## 🔧 Development

### 🎯 **NEW: One-Command Development Setup**
```bash
# Start everything with one command (recommended for development)
npm run dev
```

This will:
- Start NestJS server
- Generate OpenAPI specification
- Generate frontend types
- Start React development server

### Manual Development Setup

#### Backend (NestJS)
```bash
cd server

# Start development server
npm run start:dev

# Run tests
npm run test:unit
npm run test:api

# Lint and format
npm run lint:check
npm run format
```

#### Frontend (React + Vite)
```bash
cd client

# Start development server
npm run dev

# Run tests
npm run test

# Lint and format
npm run lint:check
npm run format
```

## 📝 **NEW: Automatic Type Generation**

### 🎯 What It Does
- **Automatically generates** TypeScript types from your NestJS API
- **Eliminates manual type definitions** - types are always in sync with your API
- **Provides type-safe API calls** with auto-completion and error checking

### 🚀 Generate Types
```bash
# Generate OpenAPI + Frontend Types (recommended)
npm run generate:types

# Generate only OpenAPI specification
npm run generate:openapi

# Watch mode for automatic regeneration
npm run generate:types:watch
```

### 📁 Generated Files
```
client/src/types/api/
├── models/          # TypeScript interfaces (ClinicDto, PatientDto, etc.)
├── services/        # API client services (ClinicsService, PatientsService, etc.)
└── core/            # Core utilities and configuration
```

### 💡 Usage Example
```typescript
import { ClinicsService, ClinicDto } from '../types/api';

// Type-safe API call with auto-completion
const clinics: ClinicDto[] = await ClinicsService.clinicsControllerFindAll();

// Full type safety - TypeScript will catch errors
clinics.forEach(clinic => {
    console.log(clinic.name); // ✅ Type-safe
    // console.log(clinic.invalid); // ❌ TypeScript error
});
```

## 📁 Project Structure

```
medical-app/
├── server/                 # NestJS backend
│   ├── src/
│   │   ├── clinics/       # Clinic management
│   │   ├── patients/      # Patient management
│   │   ├── medical/       # Combined medical data
│   │   └── main.ts        # Application entry point
│   ├── scripts/
│   │   └── generate-openapi.js  # OpenAPI generator
│   └── package.json
├── client/                 # React frontend
│   ├── src/
│   │   ├── types/         # Generated API types
│   │   ├── examples/      # Type usage examples
│   │   └── ...
│   └── package.json
├── scripts/                # Development scripts
│   └── dev.sh             # One-command development setup
├── docs/                   # Documentation
│   └── API_INTEGRATION.md # API integration guide
├── openapi.json           # Generated OpenAPI spec (gitignored)
└── package.json           # Root package.json
```

## 🔄 **NEW: Development Workflow**

### 1. **API-First Development**
```bash
# 1. Develop API endpoints in NestJS with Swagger decorators
# 2. Generate OpenAPI specification
npm run generate:openapi

# 3. Generate frontend types
npm run generate:types

# 4. Use generated types in React components
```

### 2. **Automatic Development Environment**
```bash
# Start everything with one command
npm run dev

# This automatically:
# - Starts backend server
# - Generates OpenAPI spec
# - Generates frontend types
# - Starts frontend dev server
```

### 3. **Type Safety Benefits**
- ✅ **No more manual type definitions**
- ✅ **Types always match your API**
- ✅ **Compile-time error checking**
- ✅ **Auto-completion in your IDE**
- ✅ **Refactoring safety**

## 📚 API Documentation

- **Swagger UI**: http://localhost:4000/api
- **OpenAPI JSON**: http://localhost:4000/api-json

## 🧪 Testing

```bash
# Backend tests
cd server
npm run test:unit      # Unit tests
npm run test:api       # API tests
npm run test:all       # All tests

# Frontend tests
cd client
npm run test           # Run tests
npm run test:run       # Run tests once
```

## 🎯 Code Quality

```bash
# Check code quality
npm run code:check

# Fix code issues
npm run code:fix

# Format code
npm run format
```

## 🚀 Production

```bash
# Build backend
cd server && npm run build

# Build frontend
cd client && npm run build

# Start production server
cd server && npm run start:prod
```

## 📖 **NEW: Documentation**

- **[API Integration Guide](docs/API_INTEGRATION.md)** - Complete guide to using generated types
- **[Type Usage Examples](client/src/examples/TypeUsageExamples.ts)** - Practical examples
- **[Generated Types](client/src/types/api/)** - Auto-generated TypeScript definitions

## 🎯 **Key Benefits of Auto-Generated Types**

1. **🚀 Productivity**: No more manual type definitions
2. **🔒 Type Safety**: Compile-time error checking
3. **🔄 Sync**: Types always match your API
4. **📚 Documentation**: Types serve as living documentation
5. **🧪 Testing**: Easy mocking with generated services
6. **🔄 Refactoring**: Safe refactoring with type checking

## 📝 Notes

- **OpenAPI specification** is automatically generated when starting the server
- **Frontend types** are generated from the OpenAPI specification
- **Generated files** are gitignored to avoid conflicts
- **Use `npm run dev`** for the best development experience
- **Types regenerate automatically** when you change your API

## 🤝 Contributing

1. **Develop API endpoints** in NestJS with proper Swagger decorators
2. **Run `npm run generate:types`** to update frontend types
3. **Use generated types** in your React components
4. **Enjoy full type safety** between frontend and backend!

---

**🎉 Welcome to the future of type-safe full-stack development!**
