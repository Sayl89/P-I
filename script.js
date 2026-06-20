// 1. GESTIONE DEL CONTO ALLA ROVESCIA
// Data: Anno, Mese (Luglio è 6), Giorno, Ora, Minuti, Secondi
const weddingDate = new Date(2026, 6, 4, 16, 30, 0).getTime();
const countdownElement = document.getElementById("countdown");

const updateCountdown = setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (distance > 0) {
        countdownElement.innerHTML = `${days}g ${hours}h ${minutes}m ${seconds}s`;
    } else {
        clearInterval(updateCountdown);
        countdownElement.innerHTML = "Oggi è il grande giorno!";
    }
}, 1000);


// 2. EFFETTO NAVBAR ALLO SCROLL
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.padding = '0.5rem 5%';
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    } else {
        if (window.innerWidth > 768) {
            navbar.style.padding = '1rem 5%';
        } else {
            navbar.style.padding = '1rem';
        }
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    }
});


// 3. FETCH E GESTIONE GALLERIA CON LIGHTBOX
const appsScriptUrl = "https://script.google.com/macros/s/AKfycbzEHPEpXZyG65ZWVCzgbhitQ6hWo3kDpYFLqSdozcX1DfxSU0uyTiJYY0SUIJrWwWD0/exec";

function caricaGalleria() {
    const gridContenitore = document.getElementById("grid-galleria");
    const loadingText = document.getElementById("loading-text");

    // Esegue la chiamata solo se ci troviamo nella pagina foto.html
    if (!gridContenitore) return; 

    fetch(appsScriptUrl)
        .then(response => response.json())
        .then(data => {
            if(loadingText) loadingText.remove();
            
            if (data.length === 0) {
                gridContenitore.innerHTML = "<p style='grid-column: 1 / -1;'>Nessuna foto ancora caricata. Inizia tu!</p>";
                return;
            }

            gridContenitore.innerHTML = "";
            data.forEach(foto => {
                // Miniatura (piccola e veloce)
                const thumbUrl = "https://drive.google.com/thumbnail?id=" + foto.id + "&sz=w400";
                
                // IMMAGINE GRANDE: Questo endpoint è l'unico che Google non blocca quasi mai
                // Cambiamo &sz=w1600 (massima dimensione permessa per thumbnail)
                const fullUrl = "https://drive.google.com/thumbnail?id=" + foto.id + "&sz=w1600";

                const itemHtml = `
                    <div class="gallery-item" onclick="apriLightbox('${fullUrl}')">
                        <img src="${thumbUrl}" alt="${foto.name}" loading="lazy">
                    </div>
                `;
                gridContenitore.innerHTML += itemHtml;
            });
        })
        .catch(error => {
            console.error("Errore:", error);
            if(loadingText) loadingText.innerHTML = "Impossibile caricare la galleria. Riprova più tardi.";
        });
}

function apriLightbox(urlAltaRisoluzione) {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    console.log("URL:", urlAltaRisoluzione);

    lightboxImg.onload = () => {
        console.log("IMG CARICATA");
    };

    lightboxImg.onerror = (e) => {
        console.error("ERRORE IMG", e);
    };

    lightboxImg.src = urlAltaRisoluzione;
    lightbox.style.display = "block";
}

function chiudiLightbox() {
    const lightbox = document.getElementById("lightbox");
    lightbox.style.display = "none";
}

// Chiude la foto anche se clicchi nello sfondo nero fuori dalla foto
window.onclick = function(event) {
    const lightbox = document.getElementById("lightbox");
    if (event.target === lightbox) {
        chiudiLightbox();
    }
}

document.addEventListener("DOMContentLoaded", caricaGalleria);