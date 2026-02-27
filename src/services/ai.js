import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import app from '../firebase'; // Import the initialized firebase app

// Initialize Firebase Functions
const functions = getFunctions(app);

// Connect to the local emulator in development mode
if (import.meta.env.DEV) {
    connectFunctionsEmulator(functions, "127.0.0.1", 5001);
}

export const generateCybersecurityResponse = async (messageHistory) => {
    try {
        // Create a reference to the Cloud Function
        const chatWithWFD = httpsCallable(functions, 'chatWithWFD');

        // Execute the function securely on the backend
        const result = await chatWithWFD({ messageHistory });

        return {
            content: result.data.content,
            isWarning: result.data.isWarning || false
        };
    } catch (error) {
        console.error("Error generating AI response via backend:", error);
        return {
            content: "I'm having trouble connecting to my secure neural network right now. Please try again later.",
            isWarning: false
        };
    }
};
