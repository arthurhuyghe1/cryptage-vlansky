const SECRET_KEY = "VLSK-SEC-7X9Q-2M4P-8V1N";

document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const btnEncode = document.getElementById('btnEncode');
    const btnExtract = document.getElementById('btnExtract');
    const btnCopy = document.getElementById('btnCopy');
    const notification = document.getElementById('notification');

    // Typewriter effect for placeholder
    const inputPlaceholder = "Entrez les données brutes à encoder ou décoder...";
    let i = 0;
    inputText.placeholder = "";
    function typeWriter() {
        if (i < inputPlaceholder.length) {
            inputText.placeholder += inputPlaceholder.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    setTimeout(typeWriter, 500);

    function showNotification(message, isError = false) {
        notification.textContent = "> " + message;
        if (isError) {
            notification.classList.add('error');
        } else {
            notification.classList.remove('error');
        }
        notification.classList.remove('hidden');
        
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }

    btnEncode.addEventListener('click', () => {
        const text = inputText.value.trim();
        if (!text) {
            showNotification('Erreur: Entrée invalide ou vide', true);
            return;
        }

        try {
            // CryptoJS AES encryption Native text
            const encrypted = CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
            outputText.value = encrypted;
            showNotification('Processus d\'encodage réussi: AES-256');
        } catch (error) {
            showNotification('Erreur critique système lors de l\'encodage', true);
            console.error(error);
        }
    });

    btnExtract.addEventListener('click', () => {
        const text = inputText.value.trim();
        if (!text) {
            showNotification('Erreur: Entrée invalide ou vide', true);
            return;
        }

        try {
            const decryptedBytes = CryptoJS.AES.decrypt(text, SECRET_KEY);
            const decrypted = decryptedBytes.toString(CryptoJS.enc.Utf8);
            
            if (!decrypted) {
                throw new Error("Déchiffrement échoué");
            }
            
            outputText.value = decrypted;
            showNotification('Processus d\'extraction réussi');
        } catch (error) {
            showNotification('Erreur globale: Clé de hachage invalide ou données corrompues', true);
            outputText.value = "ERROR: ACCESS DENIED or INVALID PAYLOAD";
            console.error(error);
        }
    });

    btnCopy.addEventListener('click', () => {
        const text = outputText.value;
        if (!text) return;

        navigator.clipboard.writeText(text).then(() => {
            showNotification('Payload copié dans le presse-papier');
        }).catch(err => {
            showNotification('Erreur de copie système', true);
            console.error('Copy error:', err);
        });
    });
});
