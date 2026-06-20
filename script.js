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

// ==========================================
// 4. GESTIONE BACHECA DEDICHE
// ==========================================
const scriptDedicheUrl = "https://script.google.com/macros/s/AKfycbynhGwLrxOk2C1lkpMHIeKZNRrgxD76XdsnU8atB8J0ygpTEqYO__oLjJFpXLU3wNve/exec";

const formDedica = document.getElementById("form-dedica");
const bachecaContainer = document.getElementById("bacheca-container");

// Funzione per caricare i messaggi esistenti
function caricaDediche() {
    if (!bachecaContainer) return; // Esegue solo se siamo in dediche.html

    fetch(scriptDedicheUrl)
        .then(response => response.json())
        .then(data => {
            bachecaContainer.innerHTML = ""; // Pulisce il caricamento
            
            if (data.length === 0) {
                bachecaContainer.innerHTML = "<p style='text-align:center;'>Nessun messaggio ancora. Sii il primo a scriverne uno!</p>";
                return;
            }

            data.forEach(item => {
                const card = `
                    <div style="background: #f9f9f9; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); border-left: 4px solid var(--secondary-color);">
                        <p style="font-family: var(--font-text); font-size: 1.1rem; line-height: 1.6; margin-bottom: 1rem; font-style: italic;">"${item.messaggio}"</p>
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; color: #666;">
                            <span style="font-weight: bold; color: var(--primary-color);">${item.nome}</span>
                            <span>${item.data}</span>
                        </div>
                    </div>
                `;
                bachecaContainer.innerHTML += card;
            });
        })
        .catch(error => {
            console.error("Errore recupero dediche:", error);
            bachecaContainer.innerHTML = "<p style='text-align:center; color: red;'>Impossibile caricare i messaggi al momento.</p>";
        });
}

// Funzione per inviare un nuovo messaggio
if (formDedica) {
    formDedica.addEventListener("submit", function(e) {
        e.preventDefault(); // Evita il ricaricamento della pagina
        
        const btnInvia = document.getElementById("btn-invia");
        const statusText = document.getElementById("form-status");
        const inputNome = document.getElementById("nome").value.trim();
        const inputMessaggio = document.getElementById("messaggio").value.trim();

        // Feedback visivo
        btnInvia.innerText = "Invio in corso...";
        btnInvia.disabled = true;
        statusText.innerText = "";

        // Costruiamo l'URL con i parametri GET
        // encodeURIComponent protegge il link da spazi e caratteri speciali
        const urlParams = `?action=aggiungi&nome=${encodeURIComponent(inputNome)}&messaggio=${encodeURIComponent(inputMessaggio)}`;
        
        fetch(scriptDedicheUrl + urlParams)
            .then(response => response.json())
            .then(result => {
                if(result.result === "success") {
                    statusText.style.color = "green";
                    statusText.innerText = "Dedica pubblicata con successo!";
                    formDedica.reset(); // Pulisce i campi
                    caricaDediche(); // Aggiorna la bacheca per mostrare il nuovo messaggio
                } else {
                    throw new Error("Errore dal server");
                }
            })
            .catch(error => {
                console.error("Errore invio dedica:", error);
                statusText.style.color = "red";
                statusText.innerText = "Si è verificato un errore. Riprova.";
            })
            .finally(() => {
                btnInvia.innerText = "Pubblica Dedica";
                btnInvia.disabled = false;
            });
    });
}

// Avvia il caricamento se siamo sulla pagina giusta
document.addEventListener("DOMContentLoaded", caricaDediche);