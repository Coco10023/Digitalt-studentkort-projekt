/* Lösning av laboration 4, av Francisco De Leon 2025. */

const generateButton = document.getElementById("generate");
const clearButton = document.getElementById("clear");

document.addEventListener("DOMContentLoaded", () => {
    generateButton.addEventListener("click", generateCard);
    clearButton.addEventListener("click", clearForm);
    getHistory();
});
    
// Hämtar input elementen och element för knapp 
const fullnameInput = document.getElementById("fullname");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const fontSelect = document.getElementById("font"); 

// Hämtar output elementen och element för historik
const previewName = document.getElementById("previewfullname"); 
const previewEmail = document.getElementById("previewemail"); 
const previewPhone = document.getElementById("previewphone");
const history = document.getElementById("history"); 

// Insåg att jag även kommer behöva hämta elementet för errorlist då felmeddelande ska skrivas ut i en ul lista. 
const errorList = document.getElementById("errorlist"); 

// Validering av input elementen 
function validateInputs() { 
    const errors = []; 

    if (fullnameInput.value.trim() === "") { /* value() hämtar det som användaren har skrivit. Villkoret är att
        om användaren inte har skrivit något triggas fel meddelandet. trim() tar bort alla mellanslag i början 
        och slutet av texten för att det användaren skriver inte ska räknas som tomt*/
        errors.push("Du behöver ange ditt namn");
    }
    if (emailInput.value.trim() === "") {
        errors.push("Du behöver ange en epostadress");
    } else if (!emailInput.value.includes("@") || !emailInput.value.includes(".")) { // Om emailInput "inte" innehåller en @ eller . visas felet
        errors.push("Epostadressen behöver innehålla en @ och en punkt");
    } 

    if (phoneInput.value.trim() === "") {
        errors.push("Du behöver ange ett telefonnummer"); 
    } else if (isNaN(phoneInput.value)) { // Använder isNan() för att kolla om värdet inte är ett tal
        errors.push("Telefonnummret behöver innehålla siffror"); 
    } else if (phoneInput.value.length < 7 || phoneInput.value.length > 15) {
        errors.push("Telefonnummret behöver vara mellan 7 och 15 siffror"); 
    }

    return errors; // returnerar errors arrayen så att jag kan använda det utanför funktionen
}


function clearErrors() { // funktion som rensar gamla fel meddelanden
    errorList.innerHTML = ""; /* Använder innerHTML för att manipulera textinnehållet på ul elementet då 
    felmeddelandena hamnar där, därav är det ingen text utan bara citattecken. */
}

function showErrors(errors) { // Funktion som visar felmeddelanden om input från användare är felaktigt
    clearErrors(); // Kallar på funktionen om att rensa tidigare felmeddelanden så att listan blir nollställd

    if (!errors || errors.length === 0) // Om det är inte någon error från arrayen och antalet element är 0 ska resultatet returneras
        return;


    errors.forEach(function(error) { // Jag avänder forEach loopen som kör en funktion på varje element från arrayen
        const li = document.createElement("li"); // Funktionen skapar ett <li> element som är barn till "ul" elementet
        li.textContent = error; // Text innehållet till <li> elementet är samma som arrayens som innehåller eventuella felmeddelanden
        errorList.appendChild(li); // errorList som är variabeln som innehåller <ul> elementet får tilldelat barnet <li>
    });
}

function generateCard() { // Denna funktion genererar studentkortet när du trycker på knappen för att generera
    const errors = validateInputs(); // Kallar på funktionen om att validera inputen när användaren trycker på knappen
    if (errors.length > 0) {
        showErrors(errors);
        return;
    }
    clearErrors(); // Kallar på funktion om att ta bort gamla felmeddelanden 

    // Lägger till det som användaren har skrivit på studentkortet
    previewName.textContent = fullnameInput.value; 
    previewEmail.textContent = emailInput.value;
    previewPhone.textContent = phoneInput.value;

    const selectFont = fontSelect.value; // Hämtar det valda alternativet i <select> elementet från användaren och sparar det på selectFont variabeln
    // Tilldelar alla tre preview elementen CSS egenskapen fontFamily som styr vilket typsnitt som det kommer bli
    previewName.style.fontFamily = selectFont; 
    previewEmail.style.fontFamily = selectFont;
    previewPhone.style.fontFamily = selectFont; 

    saveToHistory(); // Kallar på funktionen som sparar historiken varenda gång som studentkortet genereras
}

function clearForm() { // Funktion som rensar/nollställer allt
    fullnameInput.value = ""; // Nollställer input elementen
    emailInput.value = "";
    phoneInput.value = "";
    fontSelect.value = "Arial"; // Sätter default typsnittet till Arial när texten rensas. 

// Nollställer/Rensar texten på studentkortet 
    previewName.textContent = ""; 
    previewEmail.textContent = "";
    previewPhone.textContent = ""; 
    errorList.innerHTML = ""; 
}

function saveToHistory() { // Skapar en funktion som sparar historiken från input elementen
    const inputs = { // Skapar ett objekt som innehåller datan/värdet från input elementen beroende på vad användaren har skrivit
        name: fullnameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        font: fontSelect.value
    };
    let historyInputs = JSON.parse(localStorage.getItem("userInputs")) || []; /*Localstorage är en del av webb 
    storage API i webbläsare som låter mig spara data i användarens webbläsare så att det finns kvar även
    om användaren stänger ner sidan eller startar om sin dator. JSON.parse konverterar JSON strängar till objekt
    eller arrays. getItem() hämtar den sparade datan från localStorage om det inte finns någon data sedan tidigare
    blir värdet null och då används istället den tomma arrayen.*/
    historyInputs.push(inputs); // Lägger till datan från objektet på den tomma arrayen
    localStorage.setItem("userInputs", JSON.stringify(historyInputs)); /* setItem() sparar den nya arrayen i localStorage
    så att nästa gång som användaren öppnar sidan igen kan getItem hämta den sparade datan igen. 
    hittar getItem()  */

    getHistory(); // Hämtar den tidigare historiken ifall det redan finns
}

function getHistory() { // Denna funktion hämtar hela historiken från localStorage så att användaren kan se den
    let historyData = JSON.parse(localStorage.getItem("userInputs")) || []; 
    history.innerHTML = "<h3>Historik</h3>"; // Tömmer historiken/listan från elementet så att det inte dupliceras varje gång det hämtas
    // Behåller även rubriken för Historik annars skulle den tas bort och inte fungera som det ska. 
    historyData.forEach(item => { // Loopar igenom arrayen och kör en funktion på varje element
        const p = document.createElement("p"); /* Skapar ett p element för varje kort som 
        användaren skapat. */
        p.textContent = `${item.name}, ${item.email}, ${item.phone}`; /* Ändrar på text innehållet för paragrafen
        och lägger till datan från arrayen eftersom variabeln item loopar igenom */
        history.appendChild(p); // Lägger till paragrafen på history elementet från HTML filen
    }); 
}






