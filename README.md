# iOS App Pre-Review System

A web-based tool to check iOS apps for potential App Store review issues before submission.

## Features

- Upload and analyze IPA files
- Complete pre-review checklist
- Receive detailed feedback on potential issues
- Get recommendations for fixing problems
- Supports English and Chinese languages

## Getting Started

### Prerequisites

- Node.js 14.x or higher
- npm 6.x or higher

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/ios-review-checker.git
   cd ios-review-checker
   ```

2. Install dependencies
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies (if applicable)
   cd ../server
   npm install
   ```

3. Configure environment variables
   ```bash
   # In client directory, create .env file
   REACT_APP_API_URL=http://localhost:3001
   REACT_APP_USE_MOCK_API=true  # Set to true for testing without a backend server
   ```

4. Start the development server
   ```bash
   # Start client
   cd client
   npm start
   
   # Start server (in another terminal, if applicable)
   cd server
   npm start
   ```

## Testing the Application

### Using the Mock API

For testing purposes, you can enable the mock API which simulates server responses:

1. Set the environment variable `REACT_APP_USE_MOCK_API=true`
2. Run the client application
3. Fill out the form and test the submission

The mock API will:
- Simulate API responses with realistic data
- Occasionally generate random errors to test error handling (20% chance)
- Customize the response based on form inputs
- Add a 2-second delay to simulate network latency

### Manual Testing

A set of test cases is available in `client/src/tests/AppReviewFormTest.js` to guide manual testing. These test cases cover:

1. Basic form submission without an IPA file
2. Form submission with an IPA file
3. Form validation
4. Language switching
5. Review results display
6. Error handling
7. Mobile responsiveness

Follow the steps in each test case to verify application functionality.

### Testing with Real Data

To test with a real backend server:

1. Set `REACT_APP_USE_MOCK_API=false`
2. Configure `REACT_APP_API_URL` to point to your backend server
3. Start the backend server
4. Submit the form with real IPA files

## Project Structure

```
ios-review-checker/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── contexts/       # Context providers
│   │   ├── mocks/          # Mock server for testing
│   │   ├── tests/          # Test cases
│   │   ├── App.js          # Main App component
│   │   ├── config.js       # Application configuration
│   │   ├── translations.js # i18n translations
│   │   └── index.js        # Entry point
├── server/                 # Backend server (if applicable)
└── README.md               # This file
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License
This project is licensed under the Proprietary License - see the LICENSE file for details. All rights reserved. Unauthorized copying, use, or distribution is prohibited. 