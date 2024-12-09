// Combined script.js with admin.js functionality
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, collection, onSnapshot, query, orderBy, addDoc } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Initialize Firebase services
const auth = getAuth();
const db = getFirestore();

// Modal elements
const modal = document.getElementById('adminModal');
const adminLink = document.getElementById('adminLink');
const closeBtn = document.querySelector('.close');
const loginForm = document.getElementById('loginForm');
const adminDashboard = document.getElementById('adminDashboard');

// Modal controls
adminLink.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";
window.onclick = (e) => {
    if (e.target == modal) modal.style.display = "none";
}

// Handle admin login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPassword').value;
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        modal.style.display = "none";
        loginForm.reset();
    } catch (error) {
        console.error('Login error:', error.message);
        alert('Login failed: ' + error.message);
    }
});

// Handle auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        adminDashboard.style.display = "block";
        adminLink.textContent = "Logout";
        adminLink.onclick = () => signOut(auth);
        loadQuotes();
    } else {
        adminDashboard.style.display = "none";
        adminLink.textContent = "Admin";
        adminLink.onclick = () => modal.style.display = "block";
    }
});

// Load quotes from Firestore
function loadQuotes() {
    const quotesQuery = query(collection(db, 'quotes'), orderBy('timestamp', 'desc'));
    
    onSnapshot(quotesQuery, (snapshot) => {
        const quotesList = document.getElementById('quotesList');
        quotesList.innerHTML = '';
        
        snapshot.forEach((doc) => {
            const quoteData = doc.data();
            const quoteElement = document.createElement('div');
            quoteElement.className = 'quote-item';
            quoteElement.innerHTML = `
                <h3>${quoteData.companyName}</h3>
                <p>Contact: ${quoteData.contactName}</p>
                <p>Email: ${quoteData.email}</p>
                <p>Phone: ${quoteData.phone}</p>
                <p>Project Details: ${quoteData.projectDetails}</p>
                <p>Date: ${quoteData.timestamp.toDate().toLocaleString()}</p>
            `;
            quotesList.appendChild(quoteElement);
        });
    });
}

// Handle quote form submission
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        try {
            const formData = {
                companyName: quoteForm.elements['companyName'].value,
                contactName: quoteForm.elements['contactName'].value,
                email: quoteForm.elements['email'].value,
                phone: quoteForm.elements['phone'].value,
                projectDetails: quoteForm.elements['projectDetails'].value,
                timestamp: new Date()
            };

            await addDoc(collection(db, 'quotes'), formData);
            quoteForm.reset();
            alert('Quote request submitted successfully!');
        } catch (error) {
            console.error('Error submitting quote:', error);
            alert('Error submitting quote. Please try again.');
        }
    });
}

// Add customer reviews
const reviews = [
    {
        name: "John Doe",
        company: "Tech Corp",
        rating: 5,
        text: "Excellent precision and quick turnaround time!"
    },
    // Add more reviews
];

const reviewCarousel = document.querySelector('.review-carousel');
reviews.forEach(review => {
    const reviewCard = document.createElement('div');
    reviewCard.className = 'review-card';
    reviewCard.innerHTML = `
        <h3>${review.name}</h3>
        <p>${review.company}</p>
        <div class="stars">${'★'.repeat(review.rating)}</div>
        <p>${review.text}</p>
    `;
    reviewCarousel.appendChild(reviewCard);
}); 