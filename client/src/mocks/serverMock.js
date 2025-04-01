/**
 * Mock Server for Testing
 * 
 * This mock server simulates API responses for testing the application
 * without needing to connect to a real backend server.
 */

// Sample mock review result data
const mockReviewResult = {
  appName: "Test App",
  issues: [
    {
      severity: "high",
      message: "Missing privacy policy link",
      details: "Apple requires all apps that collect user data to have a privacy policy link in the app metadata."
    },
    {
      severity: "medium",
      message: "Insecure HTTP connections detected",
      details: "Your app may use insecure HTTP connections. Apple requires all network connections to use HTTPS."
    },
    {
      severity: "low",
      message: "Vague camera usage description",
      details: "The camera usage description should clearly explain why your app needs access to the camera."
    }
  ],
  recommendations: [
    "Add a privacy policy link in your app metadata",
    "Ensure all network connections use HTTPS",
    "Provide clear and specific usage descriptions for all permission requests",
    "Add appropriate age restrictions based on your app content"
  ],
  passedRules: 15,
  totalRules: 20
};

/**
 * Mock API function to simulate file upload and review process
 * @param {FormData} formData - Form data containing app information
 * @param {string} lang - Language code (en/zh)
 * @returns {Promise} - Promise resolving to mock review result
 */
export const mockReviewApi = (formData, lang) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Check if we want to simulate an error (20% chance)
      const shouldError = Math.random() < 0.2;
      
      if (shouldError) {
        // Simulate different error scenarios
        const errorType = Math.floor(Math.random() * 3);
        switch (errorType) {
          case 0:
            reject({
              response: {
                status: 400,
                data: { message: "Invalid file format. Please upload a valid IPA file." }
              }
            });
            break;
          case 1:
            reject({
              response: {
                status: 500,
                data: { message: "Server processing error" }
              }
            });
            break;
          case 2:
            // Network error without response
            reject(new Error("Network Error"));
            break;
        }
      } else {
        // Extract app name from form data or use default
        let appName = "Test App";
        if (formData.get('name')) {
          appName = formData.get('name');
        }
        
        // Create a copy of mock data and customize it
        const result = JSON.parse(JSON.stringify(mockReviewResult));
        result.appName = appName;
        
        // Adjust review based on form data
        const hasPrivacyPolicy = formData.get('privacyPolicy') === 'true';
        const usesHttps = formData.get('usesHttps') === 'true';
        
        // If privacy policy is included, remove that issue
        if (hasPrivacyPolicy) {
          result.issues = result.issues.filter(issue => !issue.message.includes("privacy policy"));
          result.passedRules += 1;
        }
        
        // If HTTPS is used, remove that issue
        if (usesHttps) {
          result.issues = result.issues.filter(issue => !issue.message.includes("HTTP connections"));
          result.passedRules += 1;
        }
        
        // Update pass rate
        if (hasPrivacyPolicy && usesHttps) {
          result.recommendations.push("Your app is in good standing with privacy and security requirements");
        }
        
        resolve(result);
      }
    }, 2000); // 2 second delay to simulate network latency
  });
};

export default mockReviewApi; 