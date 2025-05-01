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

- **Domain Layer**: Contains business logic, repository interfaces, entities, and dtos
- **Data Layer**: Contains repository implementations
- **DI Layer**: Contains AppModule dependecy injector
- **Infrastructure Layer**: Contains data managers, hooks wrappers for performant netowrk calls, storage service, store and apiClient, queryClient, GoogleClient
- **Presentation Layer**: Contains Atomic Ui components: atoms, molecules, organisms, templates, screens and navigation

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
- **FlashList**: For performant lists
- **React-native-fast-image**: For performant images

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
- `.env` variables

### Installation

1. Clone the repository
2. Install dependencies
```bash
yarn install --frozen-lockfile
```
3. create `.env` file in project root and add environment variables, so firebase initialization can happen properly

4. Start the Metro server
```bash
yarn start
```
5. Run on iOS or Android
```bash
yarn ios #For iOS
yarn android #For Android
```

## Testing

Run the test suite:

```bash
yarn test
```

## API Integration

This application uses the Fake API Platzi for e-commerce data:
- API Base URL: https://fakeapi.platzi.com/api/v1
- For authentication, the app uses Google SignIn
