## Features

- **Product Listing**: Display a list of products with searchbar and filtering
- **Product Details**: View detailed product information with image carousel
- **Related Products**: View related products in the same category
- **Search**: Search for products by title or description
- **Authentication**: OAuth login with Google Sign-in via Firebase
- **Offline Support**: Data caching for offline access

## Technical Implementation

### Architecture

The application follows Clean Architecture principles, with the following layers:

- **Domain Layer**: Contains business logic, entities, and interfaces
- **Data Layer**: Implements repositories, handles API calls and local storage
- **Presentation Layer**: Contains UI components, screens, and state management

### Technologies and Libraries

- **React Native**: For cross-platform mobile development
- **TypeScript**: For type safety
- **React Navigation**: For screen navigation
- **React Query**: For server-state management and caching
- **Zustand**: For client-state management
- **MMKV**: For high-performance data persistence
- **Axios**: For API requests
- **Firebase Auth**: For OAuth authentication and Google Sign-in
- **Jest**: For testing

### Design Patterns

- **Clean Architecture**: Separation of concerns with domain-driven design
- **Repository Pattern**: Abstraction over data sources
- **Atomic Design**: Component structure (atoms, molecules, organisms, templates)
- **Container/Presentation Pattern**: Separation of UI and logic
## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- React Native development environment setup

### Installation

1. Clone the repository
2. Install dependencies
```bash
yarn install --frozen-lockfile
```
1. Start the Metro server
```bash
yarn start
```
2. Run on iOS or Android
   ```bash
npm run ios #For iOS
npm run android #For Android
   ```

## Testing

Run the test suite:

```bash
npm test
```

## API Integration

This application uses the Fake API Platzi for e-commerce data:
- API Base URL: https://fakeapi.platzi.com/api/v1
- For authentication, the app uses Google SignIn
