# Weather API Integration Service

A refactored, production-ready weather API integration service built with Express.js, featuring JWT authentication and OpenWeatherMap API integration.

**Course:** Web Services Integration and Security - Assignment 2

## 👥 Team Members

| Name            | ID Number |
| --------------- | --------- |
| Dawit Tamiru    | RU0718/14 |
| Daniel Diriba   | RU0719/14 |
| Jamal Aman      | RU1584/14 |
| Fuad Hassen     | RU0233/14 |
| Abdurehim Kedir | RU0208/14 |

**Repository:** [dawe014/web-service-integration-assignment](https://github.com/dawe014/web-service-integration-assignment)

## 🚀 Features

- **Clean Architecture**: Organized folder structure with separation of concerns
- **JWT Authentication**: Secure token-based authentication
- **Error Handling**: Centralized error handling with custom error classes
- **Logging**: Winston-based logging with file rotation
- **Configuration Management**: Environment-based configuration with validation
- **Input Validation**: Request validation utilities
- **Weather Data**: Integration with OpenWeatherMap API
- **Multiple Cities**: Support for fetching weather data for multiple cities

## 📁 Project Structure

```
src/
├── config/           # Configuration and constants
│   ├── index.js      # Main configuration with env validation
│   └── constants.js  # Application constants
├── middleware/       # Express middleware
│   ├── auth.js       # JWT authentication middleware
│   └── errorHandler.js # Global error handling
├── routes/           # API routes
│   ├── index.js      # Route aggregator
│   ├── authRoutes.js # Authentication routes
│   └── weatherRoutes.js # Weather data routes
├── services/         # Business logic
│   └── weatherService.js # Weather API service
├── utils/            # Utility functions
│   ├── errors.js     # Custom error classes
│   ├── logger.js     # Winston logger setup
│   └── validation.js # Input validation utilities
├── app.js            # Express app configuration
└── server.js         # Server entry point
```

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd web-service-integration-assignment
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration:

   - `JWT_SECRET`: Your JWT secret key
   - `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key (get it from https://openweathermap.org/api)

4. **Start the server**

   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Health Check

- **GET** `/api/health`
  - Public endpoint to check API status

### Authentication

- **GET** `/api/auth/token`
  - Generate JWT token for API access
  - Returns: `{ success: true, token: "...", expires_in: "1h" }`

### Weather Data

#### Get Weather for Single City

- **GET** `/api/weather/:city`
  - Protected endpoint (requires JWT token)
  - **Headers**: `Authorization: Bearer <token>`
  - **Response**:
    ```json
    {
      "success": true,
      "data": {
        "city": "London",
        "country": "GB",
        "temperature": {
          "current": "15.23",
          "feels_like": "14.12",
          "min": "13.45",
          "max": "17.89",
          "unit": "celsius"
        },
        "weather": {
          "main": "Clouds",
          "description": "scattered clouds"
        },
        "wind": {
          "speed": 5.5,
          "unit": "m/s"
        }
      }
    }
    ```

#### Get Weather for Multiple Cities

- **POST** `/api/weather/multiple`
  - Protected endpoint (requires JWT token)
  - **Headers**: `Authorization: Bearer <token>`
  - **Body**:
    ```json
    {
      "cities": ["London", "Paris", "Tokyo"]
    }
    ```
  - **Response**:
    ```json
    {
      "success": true,
      "count": 3,
      "results": [
        {
          "city": "London",
          "success": true,
          "data": { ... }
        },
        {
          "city": "Paris",
          "success": true,
          "data": { ... }
        }
      ]
    }
    ```

## 🔐 Authentication Flow

1. **Get Token**

   ```bash
   curl http://localhost:3000/api/auth/token
   ```

2. **Use Token in Requests**
   ```bash
   curl -H "Authorization: Bearer <your-token>" \
        http://localhost:3000/api/weather/London
   ```

## 🧪 Testing

### Using Postman (Recommended)

Import the included Postman collection for comprehensive testing:

1. Import `weather_api_postman_collection.json` into Postman
2. Run "Get Token" to authenticate
3. Test all endpoints with automated tests

📖 **See [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md) for detailed instructions**

### Using cURL

```bash
# Get authentication token
TOKEN=$(curl -s http://localhost:3000/api/auth/token | jq -r '.token')

# Get weather for a single city
curl -H "Authorization: Bearer $TOKEN" \
     http://localhost:3000/api/weather/London

# Get weather for multiple cities
curl -X POST \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"cities": ["London", "Paris", "Tokyo"]}' \
     http://localhost:3000/api/weather/multiple
```

## 📊 Logging

Logs are stored in the `logs/` directory:

- `combined.log` - All logs
- `errors.log` - Error logs only
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

## 🔧 Configuration Options

All configuration is managed through environment variables:

| Variable              | Description                          | Default       |
| --------------------- | ------------------------------------ | ------------- |
| `PORT`                | Server port                          | `3000`        |
| `NODE_ENV`            | Environment (development/production) | `development` |
| `JWT_SECRET`          | Secret key for JWT signing           | _required_    |
| `JWT_EXPIRES_IN`      | JWT expiration time                  | `1h`          |
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key               | _required_    |
| `API_TIMEOUT`         | API request timeout (ms)             | `8000`        |
| `LOG_LEVEL`           | Logging level                        | `info`        |

## 🏗️ Architecture Highlights

### Clean Code Principles

- **Single Responsibility**: Each module has a single, well-defined purpose
- **Dependency Injection**: Services are injected, not instantiated
- **Error Handling**: Centralized error handling with custom error classes
- **Configuration**: Environment-based configuration with validation

### Error Handling

- Custom error classes (`AppError`, `BadRequestError`, `UnauthorizedError`, etc.)
- Async error wrapper to eliminate try-catch boilerplate
- Centralized error handler middleware
- Proper error logging with Winston

### Security

- JWT-based authentication
- Environment variable validation
- Input sanitization and validation
- Secure error messages (no stack traces in production)

## 📝 Notes

- The API uses OpenWeatherMap's free tier, which has rate limits
- Temperature values are automatically converted from Kelvin to Celsius
- All timestamps are in ISO 8601 format
- The server implements graceful shutdown on SIGTERM/SIGINT

## 🤝 Contributing

This is a group project for Web Services Integration and Security course.

For questions or suggestions, please contact any of the team members listed above.

## 📄 License

ISC

---

**Developed by:** Group 9 - Web Services Integration and Security  
**Academic Year:** 2024/2025
