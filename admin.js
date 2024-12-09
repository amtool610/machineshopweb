// Import Firebase modules
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

// Get the auth instance
const auth = getAuth();

// Add event listener to the login form
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        // Sign in with email and password
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // If login successful
        console.log('Logged in successfully:', user.email);
        // Redirect to admin dashboard or show success message
        window.location.href = 'dashboard.html';
    } catch (error) {
        // Handle errors
        console.error('Login error:', error.message);
        alert('Login failed: ' + error.message);
    }
});

// Load quotes from Firebase
function loadQuotes() {
    const quotesList = document.getElementById('quotesList');
    
    database.ref('quotes').on('value', (snapshot) => {
        quotesList.innerHTML = '';
        snapshot.forEach((quote) => {
            const quoteData = quote.val();
            const quoteElement = document.createElement('div');
            quoteElement.className = 'quote-item';
            quoteElement.innerHTML = `
                <h3>${quoteData.companyName}</h3>
                <p>Contact: ${quoteData.contactName}</p>
                <p>Email: ${quoteData.email}</p>
                <p>Phone: ${quoteData.phone}</p>
                <p>Project Details: ${quoteData.projectDetails}</p>
                <p>Date: ${new Date(quoteData.timestamp).toLocaleString()}</p>
            `;
            quotesList.appendChild(quoteElement);
        });
    });
} 