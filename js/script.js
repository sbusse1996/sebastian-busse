/* ==================================================
   ELEMENTE
   ================================================== */

const kartenBereich =
    document.querySelector(".karten-bereich");

const kartenObjekt =
    document.querySelector(".karten-objekt");

const buttonOeffnen =
    document.querySelector("#karte-oeffnen");

const buttonLinks =
    document.querySelector("#karte-links");

const buttonRechts =
    document.querySelector("#karte-rechts");

const kartenStatus =
    document.querySelector("#karten-status");


/* ==================================================
   VARIABLEN
   ================================================== */

let karteGeoeffnet = false;

let rotationY = 0;

let rotationX = 8;

let mausAktiv = false;

let mausStartX = 0;

let rotationStart = 0;


/* ==================================================
   KARTE DARSTELLEN
   ================================================== */

function karteAnzeigen() {

    kartenObjekt.style.transform =
        "rotateX(" +
        rotationX +
        "deg) rotateY(" +
        rotationY +
        "deg)";

}


/* ==================================================
   STATUS AKTUALISIEREN
   ================================================== */

function statusAktualisieren() {

    let winkel = rotationY % 360;


    if (winkel < 0) {

        winkel += 360;

    }


    /*
       GESCHLOSSEN
    */

    if (!karteGeoeffnet) {

        if (winkel >= 135 && winkel <= 225) {

            kartenStatus.textContent =
                "Rückseite";

        } else {

            kartenStatus.textContent =
                "Vorderseite";

        }

        return;

    }


    /*
       GEÖFFNET
    */

    if (winkel >= 135 && winkel <= 225) {

        kartenStatus.textContent =
            "Außenseite";

    } else {

        kartenStatus.textContent =
            "Innenseite";

    }

}


/* ==================================================
   ÖFFNEN / SCHLIESSEN
   ================================================== */

buttonOeffnen.addEventListener(
    "click",
    function () {


        karteGeoeffnet =
            !karteGeoeffnet;


        /*
           Beim Öffnen immer mit
           der Innenseite beginnen.
        */

        if (karteGeoeffnet) {

            rotationY = 0;

            kartenBereich.classList.add(
                "geoeffnet"
            );

            buttonOeffnen.textContent =
                "Karte schließen";

        } else {

            rotationY = 0;

            kartenBereich.classList.remove(
                "geoeffnet"
            );

            buttonOeffnen.textContent =
                "Karte öffnen";

        }


        karteAnzeigen();

        statusAktualisieren();

    }
);


/* ==================================================
   NACH LINKS DREHEN
   ================================================== */

buttonLinks.addEventListener(
    "click",
    function () {

        rotationY -= 45;

        karteAnzeigen();

        statusAktualisieren();

    }
);


/* ==================================================
   NACH RECHTS DREHEN
   ================================================== */

buttonRechts.addEventListener(
    "click",
    function () {

        rotationY += 45;

        karteAnzeigen();

        statusAktualisieren();

    }
);


/* ==================================================
   MAUS – START
   ================================================== */

kartenObjekt.addEventListener(
    "mousedown",
    function (event) {


        mausAktiv = true;

        mausStartX =
            event.clientX;

        rotationStart =
            rotationY;


        kartenObjekt.style.transition =
            "none";


        event.preventDefault();

    }
);


/* ==================================================
   MAUS – BEWEGEN
   ================================================== */

document.addEventListener(
    "mousemove",
    function (event) {


        if (!mausAktiv) {

            return;

        }


        const bewegung =
            event.clientX - mausStartX;


        rotationY =
            rotationStart +
            bewegung * 0.7;


        karteAnzeigen();

        statusAktualisieren();

    }
);


/* ==================================================
   MAUS – ENDE
   ================================================== */

document.addEventListener(
    "mouseup",
    function () {


        if (!mausAktiv) {

            return;

        }


        mausAktiv = false;


        kartenObjekt.style.transition =
            "transform 0.15s ease";


        karteAnzeigen();

    }
);


/* ==================================================
   TOUCH – START
   ================================================== */

let touchStartX = 0;

let touchRotationStart = 0;


kartenObjekt.addEventListener(
    "touchstart",
    function (event) {


        touchStartX =
            event.touches[0].clientX;

        touchRotationStart =
            rotationY;


        kartenObjekt.style.transition =
            "none";

    },
    {
        passive: true
    }
);


/* ==================================================
   TOUCH – BEWEGEN
   ================================================== */

kartenObjekt.addEventListener(
    "touchmove",
    function (event) {


        const bewegung =
            event.touches[0].clientX -
            touchStartX;


        rotationY =
            touchRotationStart +
            bewegung * 0.7;


        karteAnzeigen();

        statusAktualisieren();

    },
    {
        passive: true
    }
);


/* ==================================================
   TOUCH – ENDE
   ================================================== */

kartenObjekt.addEventListener(
    "touchend",
    function () {


        kartenObjekt.style.transition =
            "transform 0.15s ease";


        karteAnzeigen();

    }
);


/* ==================================================
   START
   ================================================== */

karteAnzeigen();

statusAktualisieren();

/* ==================================================
   DTP-BROSCHÜRE
   ================================================== */

const broschuere =
    document.querySelector(".broschuere");

const broschLinks =
    document.querySelector("#brosch-links");

const broschRechts =
    document.querySelector("#brosch-rechts");

const broschLinksSeite =
    document.querySelector(".broschuere-links");

const broschRechtsSeite =
    document.querySelector(".broschuere-rechts");

const broschStatus =
    document.querySelector("#brosch-status");

let broschSeite = 1;


/* ==================================================
   BROSCHÜRE ANZEIGEN
   ================================================== */

function broschuereAnzeigen() {

    broschuere.classList.remove(
        "single",
        "doppelseite"
    );


    if (broschSeite === 1) {

        broschuere.classList.add("single");

        broschLinksSeite.style.display =
            "block";

        broschRechtsSeite.style.display =
            "none";

        broschLinksSeite.querySelector("img").src =
            "bilder/brosch/seite-01.png";

        broschLinksSeite.querySelector("img").alt =
            "Broschürenseite 1";

        broschStatus.textContent =
            "Seite 1 von 20";

        return;
    }


    if (broschSeite === 20) {

        broschuere.classList.add("single");

        broschLinksSeite.style.display =
            "block";

        broschRechtsSeite.style.display =
            "none";

        broschLinksSeite.querySelector("img").src =
            "bilder/brosch/seite-20.png";

        broschLinksSeite.querySelector("img").alt =
            "Broschürenseite 20";

        broschStatus.textContent =
            "Seite 20 von 20";

        return;
    }


    broschuere.classList.add("doppelseite");

    broschLinksSeite.style.display =
        "block";

    broschRechtsSeite.style.display =
        "block";


    broschLinksSeite.querySelector("img").src =
        "bilder/brosch/seite-" +
        String(broschSeite).padStart(2, "0") +
        ".png";


    broschRechtsSeite.querySelector("img").src =
        "bilder/brosch/seite-" +
        String(broschSeite + 1).padStart(2, "0") +
        ".png";


    broschLinksSeite.querySelector("img").alt =
        "Broschürenseite " + broschSeite;


    broschRechtsSeite.querySelector("img").alt =
        "Broschürenseite " +
        (broschSeite + 1);


    broschStatus.textContent =
        "Seiten " +
        broschSeite +
        "–" +
        (broschSeite + 1) +
        " von 20";
}


/* ==================================================
   ZURÜCK
   ================================================== */

broschLinks.addEventListener(
    "click",
    function () {

        if (broschSeite <= 2) {

            broschSeite = 1;

        } else if (broschSeite === 20) {

            broschSeite = 18;

        } else {

            broschSeite -= 2;

        }

        broschuereAnzeigen();

    }
);


/* ==================================================
   WEITER
   ================================================== */

broschRechts.addEventListener(
    "click",
    function () {

        if (broschSeite === 20) {
            return;
        }


        if (broschSeite === 1) {

            broschSeite = 2;

        } else {

            broschSeite += 2;

        }

        broschuereAnzeigen();

    }
);


/* ==================================================
   START
   ================================================== */

broschuereAnzeigen();

