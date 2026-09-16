const reduzierteBewegung =
    window.matchMedia("(prefers-reduced-motion: reduce)");


class ProjektAkkordeon {

    constructor(element) {

        this.element = element;

        this.summary =
            element.querySelector("summary");

        this.inhalt =
            element.querySelector(".projekt-inhalt");

        this.animation = null;

        this.schliesstGerade = false;

        this.oeffnetGerade = false;

        this.summary.addEventListener(
            "click",
            (event) => this.klick(event)
        );

    }


    klick(event) {

        event.preventDefault();

        if (reduzierteBewegung.matches) {

            this.element.open =
                !this.element.open;

            return;

        }

        this.element.style.overflow =
            "hidden";

        if (this.schliesstGerade || !this.element.open) {

            this.oeffnen();

        } else if (this.oeffnetGerade || this.element.open) {

            this.schliessen();

        }

    }


    schliessen() {

        this.schliesstGerade = true;

        const startHoehe =
            `${this.element.offsetHeight}px`;

        const endHoehe =
            `${this.summary.offsetHeight}px`;

        if (this.animation) {

            this.animation.cancel();

        }

        this.animation = this.element.animate(
            {
                height: [startHoehe, endHoehe]
            },
            {
                duration: 350,
                easing: "cubic-bezier(0.4, 0, 0.2, 1)"
            }
        );

        this.animation.onfinish =
            () => this.animationEnde(false);

        this.animation.oncancel =
            () => this.schliesstGerade = false;

    }


    oeffnen() {

        this.element.style.height =
            `${this.element.offsetHeight}px`;

        this.element.open = true;

        window.setTimeout(
            () => this.erweitern(),
            20
        );

    }


    erweitern() {

        this.oeffnetGerade = true;

        const startHoehe =
            `${this.element.offsetHeight}px`;

        const endHoehe =
            `${this.summary.offsetHeight + this.inhalt.offsetHeight}px`;

        if (this.animation) {

            this.animation.cancel();

        }

        this.animation = this.element.animate(
            {
                height: [startHoehe, endHoehe]
            },
            {
                duration: 350,
                easing: "cubic-bezier(0.4, 0, 0.2, 1)"
            }
        );

        this.animation.onfinish =
            () => this.animationEnde(true);

        this.animation.oncancel =
            () => this.oeffnetGerade = false;

    }


    animationEnde(offen) {

        this.element.open = offen;

        this.animation = null;

        this.schliesstGerade = false;

        this.oeffnetGerade = false;

        this.element.style.height = "";

        this.element.style.overflow = "";

    }

}


document.querySelectorAll(".projekt").forEach(

    (element) => new ProjektAkkordeon(element)

);


if (!reduzierteBewegung.matches && "IntersectionObserver" in window) {

    const revealBeobachter = new IntersectionObserver(

        (eintraege) => {

            eintraege.forEach((eintrag) => {

                if (eintrag.isIntersecting) {

                    eintrag.target.classList.add(
                        "reveal-sichtbar"
                    );

                    revealBeobachter.unobserve(
                        eintrag.target
                    );

                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -60px 0px"
        }
    );

    document.querySelectorAll(".projekt, .zeitleiste-start").forEach((element) => {

        element.classList.add("reveal");

        revealBeobachter.observe(element);

    });

}


const lightbox =
    document.querySelector("#lightbox");

const lightboxRahmen =
    document.querySelector(".lightbox-rahmen");

const lightboxBild =
    document.querySelector("#lightboxBild");

const lightboxSchliessenButton =
    document.querySelector("#lightboxSchliessen");

const lightboxVerkleinernButton =
    document.querySelector("#lightboxVerkleinern");

const lightboxVergroessernButton =
    document.querySelector("#lightboxVergroessern");

const lightboxZoomstand =
    document.querySelector("#lightboxZoomstand");


const lightboxZoomStufen =
    [1, 1.5, 2];

let lightboxZoomIndex = 0;


function lightboxZoomAnzeigen() {

    const stufe =
        lightboxZoomStufen[lightboxZoomIndex];

    lightboxBild.style.setProperty(
        "--lightbox-zoom",
        stufe
    );

    lightboxZoomstand.textContent =
        Math.round(stufe * 100) + "%";

    lightboxVerkleinernButton.disabled =
        (lightboxZoomIndex === 0);

    lightboxVergroessernButton.disabled =
        (lightboxZoomIndex === lightboxZoomStufen.length - 1);

}


function lightboxUrsprungZuruecksetzen() {

    lightboxBild.style.setProperty(
        "--lightbox-zoom-x",
        "50%"
    );

    lightboxBild.style.setProperty(
        "--lightbox-zoom-y",
        "50%"
    );

}


function lightboxOeffnen(quelle, altText) {

    lightboxBild.src = quelle;

    lightboxBild.alt = altText;

    lightboxZoomIndex = 0;

    lightboxUrsprungZuruecksetzen();

    lightboxZoomAnzeigen();

    lightbox.classList.add("aktiv");

    document.body.style.overflow = "hidden";

}


function lightboxSchliessen() {

    lightbox.classList.remove("aktiv");

    document.body.style.overflow = "";

}


document.querySelectorAll(".zoom-bild").forEach((wrapper) => {

    const bild =
        wrapper.querySelector("img");

    wrapper.addEventListener(
        "click",
        () => lightboxOeffnen(bild.src, bild.alt)
    );

});


lightboxSchliessenButton.addEventListener(
    "click",
    lightboxSchliessen
);


lightboxVerkleinernButton.addEventListener(
    "click",
    function () {

        if (lightboxZoomIndex > 0) {

            lightboxZoomIndex -= 1;

            lightboxZoomAnzeigen();

        }

    }
);


lightboxVergroessernButton.addEventListener(
    "click",
    function () {

        if (lightboxZoomIndex < lightboxZoomStufen.length - 1) {

            lightboxZoomIndex += 1;

            lightboxZoomAnzeigen();

        }

    }
);


lightbox.addEventListener(
    "click",
    function (event) {

        if (event.target === lightbox ||
            event.target === lightboxRahmen) {

            lightboxSchliessen();

        }

    }
);


lightboxBild.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

        const rahmen =
            lightboxBild.getBoundingClientRect();

        const x =
            ((event.clientX - rahmen.left) / rahmen.width) * 100;

        const y =
            ((event.clientY - rahmen.top) / rahmen.height) * 100;

        lightboxBild.style.setProperty(
            "--lightbox-zoom-x",
            x + "%"
        );

        lightboxBild.style.setProperty(
            "--lightbox-zoom-y",
            y + "%"
        );

        if (lightboxZoomIndex < lightboxZoomStufen.length - 1) {

            lightboxZoomIndex += 1;

        } else {

            lightboxZoomIndex = 0;

            lightboxUrsprungZuruecksetzen();

        }

        lightboxZoomAnzeigen();

    }
);


document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape" &&
            lightbox.classList.contains("aktiv")) {

            lightboxSchliessen();

        }

    }
);


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

const broschuereRaum =
    document.querySelector(".broschuere-raum");

const broschFlip =
    document.querySelector("#broschFlip");

const broschFlipVorne =
    broschFlip.querySelector(".flip-vorne img");

const broschFlipHinten =
    broschFlip.querySelector(".flip-hinten img");


let broschSeite = 1;

let broschAnimiertGerade = false;


function broschIstDoppelseite(seite) {

    return seite !== 1 && seite !== 20;

}


function broschBildpfad(seite) {

    return "bilder/brosch/seite-" +
        String(seite).padStart(2, "0") +
        ".png";

}


/* ==================================================
   BROSCHÜRE ANZEIGEN
   ================================================== */

function broschuereAnzeigen() {

    broschuere.classList.remove(
        "single",
        "doppelseite"
    );

    broschFlip.classList.remove(
        "aktiv",
        "dreht",
        "richtung-vor",
        "richtung-zurueck"
    );

    broschFlip.style.width = "";

    broschFlip.style.height = "";

    broschRechtsSeite.style.opacity = "";

    broschRechtsSeite.style.transition = "";


    /*
       TITELSEITE
       Seite 1 steht alleine.
    */

    if (broschSeite === 1) {

        broschuere.classList.add("single");

        broschLinksSeite.style.display =
            "block";

        broschRechtsSeite.style.display =
            "none";

        broschLinksSeite.querySelector("img").src =
            broschBildpfad(1);

        broschLinksSeite.querySelector("img").alt =
            "Broschürenseite 1";

        broschStatus.textContent =
            "Seite 1 von 20";

        return;
    }


    /*
       LETZTE SEITE
       Seite 20 steht alleine.
    */

    if (broschSeite === 20) {

        broschuere.classList.add("single");

        broschLinksSeite.style.display =
            "block";

        broschRechtsSeite.style.display =
            "none";

        broschLinksSeite.querySelector("img").src =
            broschBildpfad(20);

        broschLinksSeite.querySelector("img").alt =
            "Broschürenseite 20";

        broschStatus.textContent =
            "Seite 20 von 20";

        return;
    }


    /*
       DOPPELSEITE
    */

    broschuere.classList.add("doppelseite");

    broschLinksSeite.style.display =
        "block";

    broschRechtsSeite.style.display =
        "block";


    broschLinksSeite.querySelector("img").src =
        broschBildpfad(broschSeite);


    broschRechtsSeite.querySelector("img").src =
        broschBildpfad(broschSeite + 1);


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


function broschuereFlip(richtung, neueSeite) {

    broschAnimiertGerade = true;

    broschLinks.disabled = true;

    broschRechts.disabled = true;


    broschFlip.classList.remove(
        "richtung-vor",
        "richtung-zurueck",
        "dreht"
    );

    broschRechtsSeite.style.opacity = "";

    broschRechtsSeite.style.transition = "";

    void broschFlip.offsetWidth;


    if (richtung === "vor") {

        broschFlipVorne.src =
            broschBildpfad(broschSeite + 1);

        broschFlipHinten.src =
            broschBildpfad(neueSeite);

        broschRechtsSeite.querySelector("img").src =
            broschBildpfad(neueSeite + 1);

        broschFlip.classList.add("richtung-vor");

    } else {

        broschFlipVorne.src =
            broschBildpfad(broschSeite);

        broschFlipHinten.src =
            broschBildpfad(neueSeite + 1);

        broschLinksSeite.querySelector("img").src =
            broschBildpfad(neueSeite);

        broschFlip.classList.add("richtung-zurueck");

    }


    broschFlip.classList.add("aktiv");

    window.setTimeout(() => {

        broschFlip.classList.add("dreht");

    }, 20);


    let flipFertigGelaufen = false;

    const flipFertig = () => {

        if (flipFertigGelaufen) {

            return;

        }

        flipFertigGelaufen = true;

        broschFlip.removeEventListener(
            "transitionend",
            flipFertig
        );

        window.clearTimeout(flipNotfallTimer);

        broschSeite = neueSeite;

        broschLinksSeite.querySelector("img").src =
            broschBildpfad(broschSeite);

        broschRechtsSeite.querySelector("img").src =
            broschBildpfad(broschSeite + 1);

        broschLinksSeite.querySelector("img").alt =
            "Broschürenseite " + broschSeite;

        broschRechtsSeite.querySelector("img").alt =
            "Broschürenseite " + (broschSeite + 1);

        broschStatus.textContent =
            "Seiten " +
            broschSeite +
            "–" +
            (broschSeite + 1) +
            " von 20";

        broschFlip.classList.remove(
            "aktiv",
            "dreht",
            "richtung-vor",
            "richtung-zurueck"
        );

        broschAnimiertGerade = false;

        broschLinks.disabled = false;

        broschRechts.disabled = false;

    };

    broschFlip.addEventListener(
        "transitionend",
        flipFertig
    );

    const flipNotfallTimer = window.setTimeout(
        flipFertig,
        900
    );

}


function broschuereBlaettern(richtung) {

    if (broschAnimiertGerade) {

        return;

    }


    let neueSeite = broschSeite;


    if (richtung === "vor") {

        if (broschSeite === 20) {

            return;

        }

        neueSeite =
            (broschSeite === 1) ? 2 : broschSeite + 2;

    } else {

        if (broschSeite <= 2) {

            neueSeite = 1;

        } else if (broschSeite === 20) {

            neueSeite = 18;

        } else {

            neueSeite = broschSeite - 2;

        }

    }


    const mitFlip =
        broschIstDoppelseite(broschSeite) &&
        broschIstDoppelseite(neueSeite);


    if (mitFlip) {

        broschuereFlip(richtung, neueSeite);

    } else {

        broschSeite = neueSeite;

        broschuereAnzeigen();

    }

}


broschLinks.addEventListener(
    "click",
    () => broschuereBlaettern("zurueck")
);

broschRechts.addEventListener(
    "click",
    () => broschuereBlaettern("vor")
);


let broschTouchStartX = 0;

let broschTouchStartY = 0;


broschuereRaum.addEventListener(
    "touchstart",
    function (event) {

        broschTouchStartX =
            event.touches[0].clientX;

        broschTouchStartY =
            event.touches[0].clientY;

    },
    { passive: true }
);


broschuereRaum.addEventListener(
    "touchend",
    function (event) {

        const bewegungX =
            event.changedTouches[0].clientX -
            broschTouchStartX;

        const bewegungY =
            event.changedTouches[0].clientY -
            broschTouchStartY;


        if (Math.abs(bewegungX) < 40 ||
            Math.abs(bewegungX) < Math.abs(bewegungY)) {

            return;

        }


        if (bewegungX < 0) {

            broschuereBlaettern("vor");

        } else {

            broschuereBlaettern("zurueck");

        }

    },
    { passive: true }
);


/* ==================================================
   START
   ================================================== */

broschuereAnzeigen();