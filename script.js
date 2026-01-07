// Configuration
const API_URL = process.env.API_URL || 'http://localhost:5000/api';

// Fetch hotels from backend API
let hotels = [];
let currentUser = null;

// Static fallback data
const staticHotels = [
    {
        id: 1,
        name: "Hôtel Royal Atlas",
        location: "Agadir",
        category: "Agadir",
        price: 1200,
        badge: "Populaire",
        image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 2,
        name: "Riad Fès Maya",
        location: "Fès",
        category: "Villes Impériales",
        price: 850,
        badge: "Charme",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 3,
        name: "Mamounia Palace",
        location: "Marrakech",
        category: "Marrakech",
        price: 3500,
        badge: "Luxe",
        image: "https://images.unsplash.com/photo-1580835845971-a393b73bf378?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 4,
        name: "Tanger Beach Hotel",
        location: "Tanger",
        category: "Nord",
        price: 900,
        badge: "-15%",
        image: "https://images.unsplash.com/photo-1621293954908-056b532808c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 5,
        name: "Sahara Luxury Camp",
        location: "Merzouga",
        category: "Désert",
        price: 600,
        badge: "Aventure",
        image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 6,
        name: "Kasbah Tamadot",
        location: "Atlas Mountains",
        category: "Marrakech",
        price: 2800,
        badge: "Vue Panoramique",
        image: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 7,
        name: "Blue Pearl Riad",
        location: "Chefchaouen",
        category: "Nord",
        price: 550,
        badge: "Coup de Cœur",
        image: "https://images.unsplash.com/photo-1534008753122-a83774618e05?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 8,
        name: "Sofitel Casablanca",
        location: "Casablanca",
        category: "Business",
        price: 1800,
        badge: "",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 9,
        name: "Villa d'Essaouira",
        location: "Essaouira",
        category: "Agadir",
        price: 750,
        badge: "Bord de mer",
        image: "https://images.unsplash.com/photo-1605537964076-3cb0ea2e356d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 10,
        name: "Dakhla Kite Lodge",
        location: "Dakhla",
        category: "Désert",
        price: 1100,
        badge: "Sport",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 11,
        name: "Mazagan Resort",
        location: "El Jadida",
        category: "Luxe",
        price: 2200,
        badge: "Spa & Golf",
        image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 12,
        name: "Ibis Centre",
        location: "Rabat",
        category: "Economique",
        price: 400,
        badge: "Bon Plan",
        image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
];

// Default images for categories
const defaultImages = {
    'Marrakech': 'https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'Agadir': 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'Fès': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'Tanger': 'https://images.unsplash.com/photo-1621293954908-056b532808c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'Rabat': 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'Casablanca': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'Chefchaouen': 'https://images.unsplash.com/photo-1534008753122-a83774618e05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'Désert': 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'Atlas Mountains': 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'El Jadida': 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'Essaouira': 'https://images.unsplash.com/photo-1605537964076-3cb0ea2e356d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'Dakhla': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'Nord': 'https://images.unsplash.com/photo-1534008753122-a83774618e05?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'Villes Impériales': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'Business': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'Luxe': 'https://images.unsplash.com/photo-1580835845971-a393b73bf378?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80',
    'Economique': 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80'
};

async function fetchHotels(params = {}) {
    try {
        const query = new URLSearchParams(params);
        const response = await fetch(`${API_URL}/hotels?${query}`);
        const data = await response.json();
        if (data.hotels && data.hotels.length > 0) {
            hotels = data.hotels.map(hotel => {
                const imageFromDb = (hotel.images && hotel.images.length > 0 && hotel.images[0]) ? hotel.images[0] : null;
                const defaultImage = defaultImages[hotel.category] || 'https://via.placeholder.com/500x300?text=Hôtel';
                return {
                    id: hotel._id,
                    name: hotel.name,
                    location: hotel.location,
                    category: hotel.category,
                    price: hotel.price,
                    badge: '',
                    image: imageFromDb || defaultImage
                };
            });
        } else {
            // Fallback to filtered static data if API returns empty
            hotels = filterStaticHotels(params);
        }
    } catch (error) {
        console.error('Error fetching hotels:', error);
        // Fallback to filtered static data
        hotels = filterStaticHotels(params);
    }
}

function filterStaticHotels(params) {
    let filtered = [...staticHotels];
    if (params.category && params.category !== 'all') {
        filtered = filtered.filter(hotel => hotel.category === params.category);
    }
    if (params.search) {
        const searchLower = params.search.toLowerCase();
        filtered = filtered.filter(hotel => 
            hotel.name.toLowerCase().includes(searchLower) || 
            hotel.location.toLowerCase().includes(searchLower)
        );
    }
    if (params.minPrice) {
        filtered = filtered.filter(hotel => hotel.price >= parseInt(params.minPrice));
    }
    if (params.maxPrice) {
        filtered = filtered.filter(hotel => hotel.price <= parseInt(params.maxPrice));
    }
    return filtered;
}

// Affichage
function displayHotels(data) {
    const hotelContainer = document.getElementById('hotel-list');
    const messageContainer = document.getElementById('message-container');
    
    if (!hotelContainer) return;

    hotelContainer.innerHTML = ""; 
    messageContainer.innerHTML = ""; 

    if (data.length === 0) {
        messageContainer.innerHTML = `
            <div class="no-result">
                <h3><i class="fa-solid fa-plane-slash"></i> Pas de résultat</h3>
                <p>Essayez une autre destination ou effacez les filtres.</p>
            </div>
        `;
        return;
    }

    data.forEach(hotel => {
        // Logique pour afficher le badge seulement s'il existe
        const badgeHTML = hotel.badge ? `<span class="card-badge">${hotel.badge}</span>` : '';
        
        const card = `
            <div class="card">
                <div class="card-image-wrapper">
                    ${badgeHTML}
                    <img src="${hotel.image}" alt="${hotel.name}" onerror="this.src='https://via.placeholder.com/500x300?text=Image+Indisponible'">
                </div>
                <div class="card-content">
                    <div class="card-header">
                        <h3>${hotel.name}</h3>
                    </div>
                    <p class="location"><i class="fa-solid fa-location-dot"></i> ${hotel.location}</p>
                    <div class="price-row">
                        <div class="price-tag">${hotel.price} MAD <span>/ nuit</span></div>
                        <div class="rating"><i class="fa-solid fa-star"></i> 4.8</div>
                    </div>
                    <a href="details.html?id=${hotel.id}" class="btn-book">Voir disponibilités</a>
                </div>
            </div>
        `;
        hotelContainer.innerHTML += card;
    });
}

// Fonction de Filtrage par Catégorie
async function filterHotels(category) {
    // Gestion des boutons actifs
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    if (category === 'all') {
        await fetchHotels();
        displayHotels(hotels);
    } else {
        await fetchHotels({ category });
        displayHotels(hotels);
    }
}

// Recherche classique par texte
async function searchHotels() {
    const searchInput = document.getElementById('destination').value.toLowerCase();
    await fetchHotels({ search: searchInput });
    displayHotels(hotels);
}

// Menu Burger
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
if(burger) {
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });
}

// Login Modal Functions
function openLoginModal() {
    document.getElementById('login-modal').style.display = 'block';
}

function closeLoginModal() {
    document.getElementById('login-modal').style.display = 'none';
}

function openRegisterModal() {
    document.getElementById('register-modal').style.display = 'block';
}

function closeRegisterModal() {
    document.getElementById('register-modal').style.display = 'none';
}

function openOtpModal() {
    document.getElementById('otp-modal').style.display = 'block';
}

function closeOtpModal() {
    document.getElementById('otp-modal').style.display = 'none';
}

function switchToRegister() {
    closeLoginModal();
    openRegisterModal();
}

function switchToLogin() {
    closeRegisterModal();
    openLoginModal();
}

// Auth Functions
async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            alert('Connexion réussie !');
            closeLoginModal();
            updateNavbar();
        } else {
            alert(data.message || 'Erreur de connexion');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur');
    }
}

async function register(name, email, phone, password) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, phone, password }),
        });
        const data = await response.json();
        if (response.ok) {
            alert('Inscription réussie ! Vérifiez votre téléphone pour l\'OTP.');
            closeRegisterModal();
            openOtpModal();
        } else {
            alert(data.message || 'Erreur d\'inscription');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur');
    }
}

async function verifyOtp(email, otp) {
    try {
        const response = await fetch(`${API_URL}/auth/verify-otp`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, otp }),
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            currentUser = data.user;
            alert('Vérification réussie !');
            closeOtpModal();
            updateNavbar();
        } else {
            alert(data.message || 'OTP invalide');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur de connexion au serveur');
    }
}

function updateNavbar() {
    const loginBtn = document.querySelector('.btn-login');
    if (currentUser) {
        loginBtn.innerHTML = `<i class="fa-solid fa-user"></i> ${currentUser.name}`;
        loginBtn.onclick = () => alert('Déconnexion à implémenter');
    } else {
        loginBtn.innerHTML = `<i class="fa-regular fa-user"></i> Connexion`;
        loginBtn.onclick = openLoginModal;
    }
}

// Event Listeners
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    await login(email, password);
});

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const phone = document.getElementById('register-phone').value;
    const password = document.getElementById('register-password').value;
    await register(name, email, phone, password);
});

document.getElementById('otp-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const otp = document.getElementById('otp-code').value;
    const email = document.getElementById('register-email').value;
    await verifyOtp(email, otp);
});

// Close modals when clicking outside
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}

// Reservation function
async function startReservation(hotelId, hotelName) {
    if (!currentUser) {
        openLoginModal();
        return;
    }

    const checkIn = prompt('Date d\'arrivée (YYYY-MM-DD):');
    const checkOut = prompt('Date de départ (YYYY-MM-DD):');
    const guests = prompt('Nombre de personnes:', '1');

    if (!checkIn || !checkOut || !guests) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                hotelId,
                checkIn,
                checkOut,
                guests: parseInt(guests)
            })
        });

        const data = await response.json();
        
        if (response.ok) {
            // Redirect to payment
            window.location.href = `payment.html?reservationId=${data.reservation._id}`;
        } else {
            alert(data.message || 'Erreur lors de la réservation');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Erreur de connexion au serveur');
    }
}

// Init
document.addEventListener('DOMContentLoaded', async () => {
    await fetchHotels();
    displayHotels(hotels);
});