/* =====================================================
   FOCUSNEST ENVIRONMENTS JAVASCRIPT
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const backBtn =
    document.getElementById("backBtn");

const categories =
    document.querySelectorAll(".category");

const environmentCards =
    document.querySelectorAll(".environment-card");

const uploadBackground =
    document.getElementById("uploadBackground");

const addBackground =
    document.getElementById("addBackground");

const backgroundInput =
    document.getElementById("backgroundInput");

const myBackgroundGrid =
    document.getElementById("myBackgroundGrid");


/* =====================================================
   DEFAULT ENVIRONMENT
===================================================== */

const defaultEnvironment = {

    name: "Forest",

    background: "../images/forest.jpg"

};


/* =====================================================
   GET SAVED ENVIRONMENT
===================================================== */

let savedEnvironment =
    JSON.parse(
        localStorage.getItem("focusnestEnvironment")
    );


/* =====================================================
   APPLY SAVED SELECTION
===================================================== */

function loadSelectedEnvironment() {

    if (!savedEnvironment) {

        savedEnvironment =
            defaultEnvironment;

    }


    environmentCards.forEach(card => {

        const cardName =
            card.dataset.name;


        if (
            cardName ===
            savedEnvironment.name
        ) {

            selectCard(card);

        }

    });

}


/* =====================================================
   SELECT ENVIRONMENT
===================================================== */

function selectCard(card) {

    /* Remove previous selection */

    environmentCards.forEach(item => {

        item.classList.remove("selected");

        const icon =
            item.querySelector(".selected-icon");

        if (icon) {

            icon.remove();

        }

    });


    /* Add selection */

    card.classList.add("selected");


    /* Create check icon */

    const check =
        document.createElement("span");

    check.className =
        "selected-icon";

    check.textContent = "✓";


    card.appendChild(check);


    /* Get environment information */

    const environment = {

        name: card.dataset.name,

        background: card.dataset.background

    };


    /* Save to localStorage */

    localStorage.setItem(

        "focusnestEnvironment",

        JSON.stringify(environment)

    );


    savedEnvironment =
        environment;

}


/* =====================================================
   CARD CLICK
===================================================== */

environmentCards.forEach(card => {

    card.addEventListener(
        "click",
        () => {

            selectCard(card);

        }
    );

});


/* =====================================================
   CATEGORY FILTER
===================================================== */

categories.forEach(category => {

    category.addEventListener(
        "click",
        () => {

            /* Remove active */

            categories.forEach(item => {

                item.classList.remove("active");

            });


            /* Add active */

            category.classList.add("active");


            const selectedCategory =
                category.dataset.category;


            environmentCards.forEach(card => {

                const cardCategory =
                    card.dataset.category;


                if (
                    selectedCategory ===
                    "nature"
                ) {

                    card.style.display =
                        cardCategory === "nature"
                        ? "block"
                        : "none";

                }

                else {

                    card.style.display =
                        cardCategory ===
                        selectedCategory
                        ? "block"
                        : "none";

                }

            });


            /* Upload card always remains visible */

            uploadBackground.style.display =
                "flex";

        }
    );

});


/* =====================================================
   BACK BUTTON
===================================================== */

backBtn.addEventListener(
    "click",
    () => {

        /*
         * Change this path if your
         * Focus Session file is somewhere else.
         */

        window.location.href =
            "../focus_session/focus_session.html";

    }
);


/* =====================================================
   UPLOAD BACKGROUND
===================================================== */

uploadBackground.addEventListener(
    "click",
    () => {

        backgroundInput.click();

    }
);


addBackground.addEventListener(
    "click",
    () => {

        backgroundInput.click();

    }
);


/* =====================================================
   HANDLE UPLOAD
===================================================== */

backgroundInput.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];


        if (!file) {

            return;

        }


        /* Check image */

        if (
            !file.type.startsWith("image/")
        ) {

            alert(
                "Please select an image file."
            );

            return;

        }


        const reader =
            new FileReader();


        reader.onload = function(e) {

            const imageURL =
                e.target.result;


            createCustomBackground(
                imageURL
            );


            /* Save custom image */

            saveCustomBackground(
                imageURL
            );

        };


        reader.readAsDataURL(file);

    }
);


/* =====================================================
   CREATE CUSTOM BACKGROUND
===================================================== */

function createCustomBackground(
    imageURL
) {

    const container =
        document.createElement("div");

    container.className =
        "custom-background";


    const image =
        document.createElement("img");

    image.src =
        imageURL;

    image.alt =
        "Custom Background";


    container.appendChild(image);


    /*
     * Insert before +
     * button.
     */

    myBackgroundGrid.insertBefore(
        container,
        addBackground
    );


    /* Select custom background */

    container.addEventListener(
        "click",
        () => {

            const environment = {

                name: "Custom Background",

                background: imageURL

            };


            localStorage.setItem(

                "focusnestEnvironment",

                JSON.stringify(environment)

            );


            alert(
                "Background selected!"
            );

        }
    );

}


/* =====================================================
   SAVE CUSTOM BACKGROUND
===================================================== */

function saveCustomBackground(
    imageURL
) {

    let customBackgrounds =
        JSON.parse(
            localStorage.getItem(
                "focusnestCustomBackgrounds"
            )
        ) || [];


    customBackgrounds.push(
        imageURL
    );


    localStorage.setItem(

        "focusnestCustomBackgrounds",

        JSON.stringify(
            customBackgrounds
        )

    );

}


/* =====================================================
   LOAD CUSTOM BACKGROUNDS
===================================================== */

function loadCustomBackgrounds() {

    const customBackgrounds =
        JSON.parse(
            localStorage.getItem(
                "focusnestCustomBackgrounds"
            )
        ) || [];


    customBackgrounds.forEach(
        imageURL => {

            createCustomBackground(
                imageURL
            );

        }
    );

}


/* =====================================================
   INITIALIZE
===================================================== */

loadSelectedEnvironment();

loadCustomBackgrounds();