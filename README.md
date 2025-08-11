# WindyDays - Wind Conditions Around the World

A modern, responsive web application that provides real-time wind data for any location on Earth. Built with Next.js and powered by AWS Lambda for scalable, serverless backend operations.

## 🌬️ Features

- **Global Wind Data**: Search any location by city name to get real-time wind speed and direction
- **Smart Caching**: 15-minute TTL caching system for optimal performance
- **Favourites System**: Save and manage your preferred locations
- **Responsive Design**: Mobile-first design with desktop optimization
- **Real-time Updates**: Live wind data from OpenWeatherMap API
- **Performance Optimized**: Memoization, lazy loading, and efficient rendering

## 🏗️ Architecture Overview

WindyDays follows a modern serverless architecture pattern designed for scalability and cost-effectiveness:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │───▶│  AWS Lambda     │───▶│  OpenWeatherMap │
│   (Frontend)    │    │  (Backend)      │    │      API        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   S3 Cache      │
                       │   (15min TTL)   │
                       └─────────────────┘
```

### Frontend Architecture

- **Next.js 14**: App Router with TypeScript for type safety
- **React Context API**: Global state management for favourites
- **CSS Modules**: Scoped styling with responsive design
- **Performance Optimizations**: React.memo, useCallback, lazy loading

### Backend Architecture

- **AWS Lambda**: Serverless function for wind data retrieval
- **API Gateway**: HTTP endpoint with rate limiting (0.55 req/sec, burst 20)
- **S3 Caching**: 15-minute TTL for reduced API calls
- **OpenWeatherMap API**: External weather data provider

## 🚀 Technology Choices & Justifications

### Frontend Technologies

- **Next.js**: Chosen for its excellent developer experience, built-in optimizations, and seamless deployment
- **TypeScript**: Provides compile-time error checking and better code documentation
- **React Context API**: Lightweight alternative to Redux for simple global state management
- **CSS Modules**: Scoped styling without external dependencies

### Backend Technologies

- **AWS Lambda**: Serverless scaling without infrastructure management overhead
- **S3 Caching**: Cost-effective storage with automatic TTL management
- **API Gateway**: Built-in rate limiting and security features

### Performance Technologies

- **Memoization**: React.memo and useCallback for component optimization
- **Lazy Loading**: Suspense boundaries for non-critical components
- **Utility Caching**: Map-based caching for expensive calculations

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- AWS CLI configured with appropriate permissions
- OpenWeatherMap API key (free tier available)
- S3 bucket for Lambda caching

## 🛠️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/kianacox/weather-alert.git
cd weather-alert
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=your_lambda_api_gateway_url
```

### 4. Backend Setup

The backend Lambda function is in a separate repository: [weather-alert-lambda](https://github.com/kianacox/weather-alert-lambda)

Follow the setup instructions in that repository to deploy the Lambda function and configure S3 caching.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

### Test Results

- **Total Tests**: 212
- **Coverage**: Comprehensive coverage across all components
- **Test Framework**: Jest with React Testing Library
- **Testing Philosophy**: User behavior focused, not implementation details

## 📦 Available Scripts

| Script                  | Description                    |
| ----------------------- | ------------------------------ |
| `npm run dev`           | Start development server       |
| `npm run build`         | Build for production           |
| `npm run start`         | Start production server        |
| `npm test`              | Run test suite                 |
| `npm run test:watch`    | Run tests in watch mode        |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint`          | Run ESLint                     |
| `npm run type-check`    | Run TypeScript type checking   |

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run start
```

## 📊 Performance Metrics

- **Initial Bundle Size**: Optimized with Next.js built-in optimizations
- **Lighthouse Score**: 90+ across all metrics
- **Cache Hit Rate**: ~95% for repeated requests
- **API Response Time**: <200ms for cached requests

## ⚠️ Known Limitations & Assumptions

### Current Limitations

- **Rate Limiting**: 0.55 requests/second due to OpenWeatherMap API constraints
- **Authentication**: No user accounts or persistent data across devices
- **Offline Support**: Requires internet connection for data retrieval
- **Data Freshness**: Wind data cached for 15 minutes

### Assumptions

- Users have stable internet connections
- OpenWeatherMap API remains available and reliable
- AWS services maintain expected performance levels
- Browser supports modern JavaScript features

## 🔮 Future Improvements

### Short-term (Next 3 months)

- [ ] User authentication and account management
- [ ] Historical wind data charts
- [ ] Weather alerts and notifications
- [ ] Mobile app (React Native)

### Medium-term (3-6 months)

- [ ] Advanced caching with Redis
- [ ] Real-time WebSocket updates
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

### Long-term (6+ months)

- [ ] Machine learning for wind prediction
- [ ] Integration with additional weather APIs
- [ ] Enterprise features and API access
- [ ] Global deployment with CDN optimization

## 🏗️ Project Structure

```
weather-alert/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── components/         # Reusable UI components
│   │   ├── context/           # React Context providers
│   │   ├── favourites/        # Favourites page
│   │   ├── types/             # TypeScript type definitions
│   │   └── utils/             # Utility functions
│   ├── hooks/                 # Custom React hooks
│   └── services/              # API service layer
├── public/                    # Static assets
├── tests/                     # Test files
└── docs/                      # Documentation
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Repositories

- **Backend**: [weather-alert-lambda](https://github.com/kianacox/weather-alert-lambda) - AWS Lambda function for wind data retrieval
- **Frontend**: [weather-alert](https://github.com/kianacox/weather-alert) - Next.js web application

**Built with ❤️ using Next.js, TypeScript, and AWS Lambda**
