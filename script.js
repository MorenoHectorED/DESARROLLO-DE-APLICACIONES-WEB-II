/* =========================================================
   MENTE EN EQUILIBRIO — V2.2
   JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       DATOS Y CUENTAS
    ====================================================== */

    const USERS_KEY = "menteEquilibrioUsers";
    const CURRENT_KEY = "menteEquilibrioCurrentUser";

    let users = JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    let currentUser = localStorage.getItem(CURRENT_KEY) || null;

    function saveUsers() {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function getUser() {
        if (!currentUser || !users[currentUser]) {
            return null;
        }

        return users[currentUser];
    }

    function saveCurrentUser() {

        if (!currentUser || !users[currentUser]) {
            return;
        }

        localStorage.setItem(
            CURRENT_KEY,
            currentUser
        );

        saveUsers();
    }


    /* =====================================================
       ESTRUCTURA DE USUARIO
    ====================================================== */

    function createUserData(name, username, email, password) {

        return {
            name: name,
            username: username,
            email: email,
            password: password,

            createdAt: new Date().toISOString(),

            mood: "",

            habits: [
                false,
                false,
                false,
                false,
                false
            ],

            activities: 0,

            reflections: 0,

            diary: "",

            mentalReflection: "",

            chosenHabit: "",

            darkMode: false
        };
    }


    /* =====================================================
       ELEMENTOS PRINCIPALES
    ====================================================== */

    const authScreen =
        document.getElementById("authScreen");

    const app =
        document.getElementById("app");

    const loginPanel =
        document.getElementById("loginPanel");

    const registerPanel =
        document.getElementById("registerPanel");

    const loginForm =
        document.getElementById("loginForm");

    const registerForm =
        document.getElementById("registerForm");

    const loginError =
        document.getElementById("loginError");

    const registerMessage =
        document.getElementById("registerMessage");


    /* =====================================================
       MOSTRAR LOGIN / REGISTRO
    ====================================================== */

    const showRegister =
        document.getElementById("showRegister");

    const showLogin =
        document.getElementById("showLogin");


    if (showRegister) {

        showRegister.addEventListener("click", () => {

            loginPanel.classList.add("hidden");

            registerPanel.classList.remove("hidden");

            loginError.textContent = "";
            registerMessage.textContent = "";

        });

    }


    if (showLogin) {

        showLogin.addEventListener("click", () => {

            registerPanel.classList.add("hidden");

            loginPanel.classList.remove("hidden");

            loginError.textContent = "";
            registerMessage.textContent = "";

        });

    }


    /* =====================================================
       MOSTRAR / OCULTAR CONTRASEÑA
    ====================================================== */

    function passwordToggle(buttonId, inputId) {

        const button =
            document.getElementById(buttonId);

        const input =
            document.getElementById(inputId);

        if (!button || !input) {
            return;
        }

        button.addEventListener("click", () => {

            if (input.type === "password") {

                input.type = "text";

                button.textContent = "🙈";

            } else {

                input.type = "password";

                button.textContent = "👁";

            }

        });

    }


    passwordToggle(
        "showLoginPassword",
        "loginPassword"
    );

    passwordToggle(
        "showRegisterPassword",
        "registerPassword"
    );


    /* =====================================================
       CREAR CUENTA
    ====================================================== */

    if (registerForm) {

        registerForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const name =
                document.getElementById("registerName")
                .value
                .trim();

            const username =
                document.getElementById("registerUser")
                .value
                .trim()
                .toLowerCase();

            const email =
                document.getElementById("registerEmail")
                .value
                .trim()
                .toLowerCase();

            const password =
                document.getElementById("registerPassword")
                .value;

            const password2 =
                document.getElementById("registerPassword2")
                .value;


            registerMessage.className =
                "auth-message";

            registerMessage.textContent = "";


            /* VALIDACIONES */

            if (!name || !username || !email || !password || !password2) {

                registerMessage.classList.add("error");

                registerMessage.textContent =
                    "Completa todos los campos.";

                return;
            }


            if (username.length < 3) {

                registerMessage.classList.add("error");

                registerMessage.textContent =
                    "El usuario debe tener al menos 3 caracteres.";

                return;
            }


            if (password.length < 6) {

                registerMessage.classList.add("error");

                registerMessage.textContent =
                    "La contraseña debe tener al menos 6 caracteres.";

                return;
            }


            if (password !== password2) {

                registerMessage.classList.add("error");

                registerMessage.textContent =
                    "Las contraseñas no coinciden.";

                return;
            }


            /* COMPROBAR USUARIO */

            if (users[username]) {

                registerMessage.classList.add("error");

                registerMessage.textContent =
                    "Ese usuario ya existe.";

                return;
            }


            /* COMPROBAR CORREO */

            const emailExists =
                Object.values(users).some(
                    user => user.email === email
                );


            if (emailExists) {

                registerMessage.classList.add("error");

                registerMessage.textContent =
                    "Ese correo ya está registrado.";

                return;
            }


            /* CREAR */

            users[username] =
                createUserData(
                    name,
                    username,
                    email,
                    password
                );


            saveUsers();


            registerMessage.classList.add("success");

            registerMessage.textContent =
                "✓ Cuenta creada correctamente. Ahora puedes iniciar sesión.";


            registerForm.reset();


            setTimeout(() => {

                registerPanel.classList.add("hidden");

                loginPanel.classList.remove("hidden");

                document.getElementById("loginUser").value =
                    username;

                document.getElementById("loginPassword").focus();

                registerMessage.textContent = "";

            }, 1200);

        });

    }


    /* =====================================================
       INICIAR SESIÓN
    ====================================================== */

    if (loginForm) {

        loginForm.addEventListener("submit", (event) => {

            event.preventDefault();

            const login =
                document.getElementById("loginUser")
                .value
                .trim()
                .toLowerCase();

            const password =
                document.getElementById("loginPassword")
                .value;


            loginError.className =
                "auth-message error";

            loginError.textContent = "";


            if (!login || !password) {

                loginError.textContent =
                    "Escribe tu usuario y contraseña.";

                return;
            }


            let foundUser = null;
            let foundKey = null;


            Object.entries(users).forEach(
                ([key, user]) => {

                    if (
                        key === login ||
                        user.email === login
                    ) {

                        foundUser = user;

                        foundKey = key;

                    }

                }
            );


            if (!foundUser) {

                loginError.textContent =
                    "La cuenta no existe. Primero debes crear una cuenta.";

                return;
            }


            if (foundUser.password !== password) {

                loginError.textContent =
                    "La contraseña es incorrecta.";

                return;
            }


            currentUser = foundKey;

            localStorage.setItem(
                CURRENT_KEY,
                currentUser
            );


            loginForm.reset();

            loginError.textContent = "";

            openApp();

        });

    }


    /* =====================================================
       ABRIR APLICACIÓN
    ====================================================== */

    function openApp() {

        const user = getUser();

        if (!user) {
            return;
        }


        authScreen.classList.add("hidden");

        app.classList.remove("hidden");


        updateUserInterface();

        loadUserData();

        applyTheme();

    }


    /* =====================================================
       CERRAR SESIÓN
    ====================================================== */

    const logout =
        document.getElementById("logout");


    if (logout) {

        logout.addEventListener("click", () => {

            currentUser = null;

            localStorage.removeItem(
                CURRENT_KEY
            );


            app.classList.add("hidden");

            authScreen.classList.remove("hidden");


            loginPanel.classList.remove("hidden");

            registerPanel.classList.add("hidden");


            document.getElementById(
                "loginUser"
            ).value = "";

            document.getElementById(
                "loginPassword"
            ).value = "";

        });

    }


    /* =====================================================
       DATOS DEL USUARIO EN LA INTERFAZ
    ====================================================== */

    function updateUserInterface() {

        const user = getUser();

        if (!user) {
            return;
        }


        const nameElement =
            document.getElementById("usuarioNombre");

        const avatar =
            document.getElementById("avatar");


        if (nameElement) {

            nameElement.textContent =
                user.name;

        }


        if (avatar) {

            avatar.textContent =
                user.name
                    .charAt(0)
                    .toUpperCase();

        }

    }


    /* =====================================================
       NAVEGACIÓN
    ====================================================== */

    const pageButtons =
        document.querySelectorAll(
            "[data-page]"
        );


    function showPage(pageId) {

        const pages =
            document.querySelectorAll(".page");

        const navLinks =
            document.querySelectorAll(".nav-link");


        pages.forEach(page => {

            page.classList.remove("active");

        });


        navLinks.forEach(link => {

            link.classList.remove("active");

        });


        const target =
            document.getElementById(pageId);


        if (target) {

            target.classList.add("active");

        }


        navLinks.forEach(link => {

            if (
                link.dataset.page === pageId
            ) {

                link.classList.add("active");

            }

        });


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    pageButtons.forEach(button => {

        button.addEventListener("click", (event) => {

            const page =
                button.dataset.page;

            if (!page) {
                return;
            }


            event.preventDefault();

            showPage(page);

        });

    });


    /* =====================================================
       CONSEJOS
    ====================================================== */

    const consejos = [

        "Haz una pausa de unos minutos y aléjate por un momento de aquello que te está saturando.",

        "No necesitas hacer todo al mismo tiempo. Divide una tarea grande en pasos pequeños.",

        "Respirar lentamente puede ayudarte a hacer una pausa antes de reaccionar.",

        "Dormir y descansar también forman parte de ser productivo.",

        "Hablar con alguien de confianza puede ayudarte a sentirte acompañado.",

        "Dedica unos minutos del día a hacer algo que realmente disfrutes.",

        "No compares tu proceso con el de otras personas. Cada persona avanza a su propio ritmo."

    ];


    const consejoButton =
        document.getElementById("consejo");

    const consejoBox =
        document.getElementById("consejoBox");

    const textoConsejo =
        document.getElementById("textoConsejo");

    const cerrarConsejo =
        document.getElementById("cerrarConsejo");


    if (consejoButton) {

        consejoButton.addEventListener("click", () => {

            const random =
                Math.floor(
                    Math.random() *
                    consejos.length
                );


            textoConsejo.textContent =
                consejos[random];


            consejoBox.classList.remove(
                "hidden"
            );

        });

    }


    if (cerrarConsejo) {

        cerrarConsejo.addEventListener(
            "click",
            () => {

                consejoBox.classList.add(
                    "hidden"
                );

            }
        );

    }


    /* =====================================================
       CHECK-IN EMOCIONAL
    ====================================================== */

    const moods =
        document.querySelectorAll(
            "[data-mood]"
        );

    const moodResult =
        document.getElementById(
            "moodResult"
        );


    const moodMessages = {

        feliz:
            "Qué bueno saberlo. Disfruta este momento y reconoce qué cosas contribuyeron a sentirte así.",

        tranquilo:
            "Aprovecha esta sensación de calma. Puedes utilizarla para hacer algo que te haga bien.",

        cansado:
            "Escucha a tu cuerpo. Tal vez necesitas una pausa, descansar o reducir algunas actividades.",

        estresado:
            "Haz una pausa. Prueba la respiración 4 · 4 o visita la sección de técnicas.",

        preocupado:
            "Es normal preocuparse. Intenta identificar qué puedes controlar y qué puedes dejar para después."

    };


    moods.forEach(button => {

        button.addEventListener("click", () => {

            const mood =
                button.dataset.mood;

            const user =
                getUser();


            if (!user) {
                return;
            }


            user.mood = mood;

            saveCurrentUser();


            moodResult.textContent =
                moodMessages[mood] ||
                "Gracias por compartir cómo te sientes.";

        });

    });


    /* =====================================================
       MODALES
    ====================================================== */

    const modalButtons =
        document.querySelectorAll(
            "[data-modal]"
        );


    modalButtons.forEach(card => {

        card.addEventListener("click", () => {

            const modalId =
                card.dataset.modal;

            const modal =
                document.getElementById(
                    modalId
                );


            if (modal) {

                modal.classList.remove(
                    "hidden"
                );

            }

        });

    });


    const closeModalButtons =
        document.querySelectorAll(
            "[data-close-modal]"
        );


    closeModalButtons.forEach(button => {

        button.addEventListener("click", () => {

            const modal =
                button.closest(
                    ".modal-overlay"
                );

            if (modal) {

                modal.classList.add(
                    "hidden"
                );

            }

        });

    });


    document.querySelectorAll(
        ".modal-overlay"
    ).forEach(modal => {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    modal.classList.add(
                        "hidden"
                    );

                }

            }
        );

    });


    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }


            document.querySelectorAll(
                ".modal-overlay"
            ).forEach(modal => {

                modal.classList.add(
                    "hidden"
                );

            });

        }
    );


    /* =====================================================
       ACTIVIDAD SALUD MENTAL
    ====================================================== */

    const saveMental =
        document.getElementById(
            "saveMental"
        );


    if (saveMental) {

        saveMental.addEventListener(
            "click",
            () => {

                const input =
                    document.getElementById(
                        "mentalReflection"
                    );

                const result =
                    document.getElementById(
                        "mentalResult"
                    );

                const text =
                    input.value.trim();


                if (!text) {

                    result.textContent =
                        "Escribe cómo te sientes para completar la actividad.";

                    return;
                }


                const user =
                    getUser();


                user.mentalReflection =
                    text;

                user.activities += 1;

                saveCurrentUser();

                updateStats();


                result.textContent =
                    "✓ Actividad guardada. Reconocer lo que sientes es un buen primer paso.";

            }
        );

    }


    /* =====================================================
       ACTIVIDAD DESCANSO
    ====================================================== */

    const completeSleep =
        document.getElementById(
            "completeSleepActivity"
        );


    if (completeSleep) {

        completeSleep.addEventListener(
            "click",
            () => {

                const checks =
                    document.querySelectorAll(
                        ".modal-sleep-check"
                    );

                const completed =
                    [...checks]
                        .filter(check => check.checked)
                        .length;

                const result =
                    document.getElementById(
                        "sleepActivityResult"
                    );


                if (completed === 0) {

                    result.textContent =
                        "Marca al menos una actividad para continuar.";

                    return;
                }


                const user =
                    getUser();

                user.activities += 1;

                saveCurrentUser();

                updateStats();


                result.textContent =
                    `✓ Completaste ${completed} de ${checks.length} acciones de tu rutina.`;

            }
        );

    }


    /* =====================================================
       ACTIVIDAD RELAJACIÓN
    ====================================================== */

    const oneMinuteRelax =
        document.getElementById(
            "oneMinuteRelax"
        );


    if (oneMinuteRelax) {

        oneMinuteRelax.addEventListener(
            "click",
            () => {

                const result =
                    document.getElementById(
                        "relaxResult"
                    );

                let seconds = 60;

                result.textContent =
                    `🧘 Comenzamos. Respira lentamente durante ${seconds} segundos.`;

                oneMinuteRelax.disabled = true;


                const timer =
                    setInterval(() => {

                        seconds--;

                        result.textContent =
                            `🧘 Respira con calma... ${seconds} segundos restantes.`;


                        if (seconds <= 0) {

                            clearInterval(timer);

                            oneMinuteRelax.disabled =
                                false;

                            result.textContent =
                                "✓ Pausa completada. Tómate unos segundos para notar cómo te sientes.";

                            const user =
                                getUser();

                            if (user) {

                                user.activities += 1;

                                saveCurrentUser();

                                updateStats();

                            }

                        }

                    }, 1000);

            }
        );

    }


    /* =====================================================
       OPCIONES DE HABITOS
    ====================================================== */

    const habitChoices =
        document.querySelectorAll(
            "[data-habit-choice]"
        );


    habitChoices.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const choice =
                    button.dataset.habitChoice;

                const user =
                    getUser();


                if (!user) {
                    return;
                }


                user.chosenHabit =
                    choice;

                user.activities += 1;

                saveCurrentUser();

                updateStats();


                const result =
                    document.getElementById(
                        "habitChoiceResult"
                    );


                result.textContent =
                    `✓ Tu pequeño objetivo de hoy será: ${choice}.`;

            }
        );

    });


    /* =====================================================
       ANALIZAR ESTRÉS
    ====================================================== */

    const analyzeStress =
        document.getElementById(
            "analizarStress"
        );


    if (analyzeStress) {

        analyzeStress.addEventListener(
            "click",
            () => {

                const signals =
                    document.querySelectorAll(
                        ".stress-signal:checked"
                    );

                const total =
                    signals.length;

                const result =
                    document.getElementById(
                        "stressResult"
                    );


                if (total === 0) {

                    result.textContent =
                        "No seleccionaste ninguna señal. Eso también es información útil.";

                    return;
                }


                if (total <= 2) {

                    result.textContent =
                        `Marcaste ${total} señal(es). Parece que identificas pocas señales de estrés. Sigue observando cómo te sientes.`;

                } else if (total <= 4) {

                    result.textContent =
                        `Marcaste ${total} señales. Puede ser un buen momento para hacer una pausa y cuidar tu descanso.`;

                } else {

                    result.textContent =
                        `Marcaste ${total} señales. Intenta detenerte un momento, respirar y hablar con alguien de confianza si lo necesitas.`;

                }


                const user =
                    getUser();

                if (user) {

                    user.activities += 1;

                    saveCurrentUser();

                    updateStats();

                }

            }
        );

    }


    /* =====================================================
       DESCANSO — HORAS DE SUEÑO
    ====================================================== */

    const analyzeSleep =
        document.getElementById(
            "analizarSueno"
        );


    if (analyzeSleep) {

        analyzeSleep.addEventListener(
            "click",
            () => {

                const input =
                    document.getElementById(
                        "horasSueno"
                    );

                const result =
                    document.getElementById(
                        "resultadoSueno"
                    );

                const hours =
                    Number(input.value);


                if (
                    !hours ||
                    hours < 0 ||
                    hours > 24
                ) {

                    result.textContent =
                        "Introduce una cantidad válida de horas.";

                    return;
                }


                if (hours < 6) {

                    result.textContent =
                        "Parece que estás durmiendo poco. Intenta priorizar el descanso y mantener una rutina de sueño.";

                } else if (hours < 7) {

                    result.textContent =
                        "Tu descanso podría mejorar. Observa cómo te sientes durante el día y procura mantener horarios constantes.";

                } else if (hours <= 9) {

                    result.textContent =
                        "Tu cantidad de sueño está dentro de un rango habitual para muchos adultos. La calidad y regularidad también importan.";

                } else {

                    result.textContent =
                        "Estás registrando bastantes horas de sueño. Si esto es frecuente y sigues sintiéndote cansado, considera comentarlo con un profesional.";

                }

            }
        );

    }


    /* =====================================================
       RUTINA NOCTURNA
    ====================================================== */

    const nightItems =
        document.querySelectorAll(
            ".night-item"
        );

    const nightResult =
        document.getElementById(
            "nightResult"
        );


    nightItems.forEach(item => {

        item.addEventListener(
            "change",
            () => {

                const completed =
                    [...nightItems]
                        .filter(
                            item => item.checked
                        )
                        .length;


                nightResult.textContent =
                    `${completed} de ${nightItems.length} acciones completadas.`;

            }
        );

    });


    /* =====================================================
       RESPIRACIÓN 4-4
    ====================================================== */

    const startBreathing =
        document.getElementById(
            "iniciarRespiracion"
        );

    const stopBreathing =
        document.getElementById(
            "detenerRespiracion"
        );

    const breathingCircle =
        document.getElementById(
            "circuloRespiracion"
        );

    const breathingPhase =
        document.getElementById(
            "faseRespiracion"
        );

    const breathingCounter =
        document.getElementById(
            "contadorRespiracion"
        );


    let breathingTimer = null;
    let breathingRunning = false;


    function stopBreathingExercise() {

        clearInterval(
            breathingTimer
        );

        breathingTimer = null;

        breathingRunning = false;


        if (breathingCircle) {

            breathingCircle.classList.remove(
                "breathe-in",
                "breathe-out"
            );

        }


        if (breathingPhase) {

            breathingPhase.textContent =
                "LISTO";

        }


        if (breathingCounter) {

            breathingCounter.textContent =
                "4";

        }


        if (startBreathing) {

            startBreathing.classList.remove(
                "hidden"
            );

        }


        if (stopBreathing) {

            stopBreathing.classList.add(
                "hidden"
            );

        }

    }


    if (startBreathing) {

        startBreathing.addEventListener(
            "click",
            () => {

                if (breathingRunning) {
                    return;
                }


                breathingRunning = true;


                startBreathing.classList.add(
                    "hidden"
                );

                stopBreathing.classList.remove(
                    "hidden"
                );


                let phase = "in";

                let count = 4;


                function updateBreathing() {

                    if (!breathingRunning) {
                        return;
                    }


                    breathingCircle.classList.remove(
                        "breathe-in",
                        "breathe-out"
                    );


                    void breathingCircle.offsetWidth;


                    if (phase === "in") {

                        breathingPhase.textContent =
                            "INHALA";

                        breathingCircle.classList.add(
                            "breathe-in"
                        );

                    } else {

                        breathingPhase.textContent =
                            "EXHALA";

                        breathingCircle.classList.add(
                            "breathe-out"
                        );

                    }


                    count = 4;

                    breathingCounter.textContent =
                        count;


                    const countdown =
                        setInterval(() => {

                            if (!breathingRunning) {

                                clearInterval(
                                    countdown
                                );

                                return;

                            }


                            count--;

                            breathingCounter.textContent =
                                count;


                            if (count <= 0) {

                                clearInterval(
                                    countdown
                                );

                                phase =
                                    phase === "in"
                                        ? "out"
                                        : "in";

                                updateBreathing();

                            }

                        }, 1000);

                }


                updateBreathing();

            }
        );

    }


    if (stopBreathing) {

        stopBreathing.addEventListener(
            "click",
            () => {

                stopBreathingExercise();

            }
        );

    }


    /* =====================================================
       TECNICA 5-4-3-2-1
    ====================================================== */

    const groundingButtons =
        document.querySelectorAll(
            "[data-ground]"
        );

    const groundResult =
        document.getElementById(
            "groundResult"
        );


    const groundingMessages = {

        "5":
            "Mira a tu alrededor y encuentra 5 cosas que puedas ver. Nómbralas lentamente.",

        "4":
            "Busca 4 cosas que puedas tocar. Presta atención a su textura y temperatura.",

        "3":
            "Identifica 3 sonidos que puedas escuchar en este momento.",

        "2":
            "Piensa en 2 aromas que puedas percibir.",

        "1":
            "Identifica 1 sabor que puedas notar ahora mismo."

    };


    groundingButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const number =
                    button.dataset.ground;

                groundResult.textContent =
                    groundingMessages[number];

            }
        );

    });


    /* =====================================================
       HABITOS DIARIOS
    ====================================================== */

    const habitChecks =
        document.querySelectorAll(
            ".habit-checks input"
        );

    const progressBar =
        document.getElementById(
            "progressBar"
        );

    const habitProgress =
        document.getElementById(
            "habitProgress"
        );


    function updateHabitProgress() {

        const user =
            getUser();

        if (!user) {
            return;
        }


        const completed =
            [...habitChecks]
                .filter(
                    checkbox => checkbox.checked
                )
                .length;


        const total =
            habitChecks.length;


        const percentage =
            total
                ? Math.round(
                    (completed / total) * 100
                )
                : 0;


        if (progressBar) {

            progressBar.style.width =
                percentage + "%";

        }


        if (habitProgress) {

            habitProgress.textContent =
                percentage + "%";

        }


        user.habits =
            [...habitChecks]
                .map(
                    checkbox => checkbox.checked
                );


        saveCurrentUser();

        updateStats();

    }


    habitChecks.forEach(checkbox => {

        checkbox.addEventListener(
            "change",
            updateHabitProgress
        );

    });


    /* =====================================================
       RETOS
    ====================================================== */

    const retos = [

        "Haz una pausa de 5 minutos y respira con calma.",

        "Toma un vaso de agua y aléjate un momento de la pantalla.",

        "Escribe una cosa por la que te sientas agradecido hoy.",

        "Camina unos minutos y presta atención a tu entorno.",

        "Durante un minuto, deja el teléfono y concéntrate en tu respiración.",

        "Ordena una pequeña parte de tu espacio.",

        "Escribe algo que hayas logrado recientemente.",

        "Dedica 10 minutos a una actividad que disfrutes."

    ];


    const newChallenge =
        document.getElementById(
            "nuevoReto"
        );

    const challengeText =
        document.getElementById(
            "reto"
        );


    if (newChallenge) {

        newChallenge.addEventListener(
            "click",
            () => {

                const random =
                    Math.floor(
                        Math.random() *
                        retos.length
                    );


                challengeText.textContent =
                    retos[random];

            }
        );

    }


    /* =====================================================
       DIARIO
    ====================================================== */

    const diaryText =
        document.getElementById(
            "diaryText"
        );

    const saveDiary =
        document.getElementById(
            "saveDiary"
        );

    const clearDiary =
        document.getElementById(
            "clearDiary"
        );

    const diaryMessage =
        document.getElementById(
            "diaryMessage"
        );

    const diaryDate =
        document.getElementById(
            "diaryDate"
        );


    if (diaryDate) {

        diaryDate.textContent =
            new Date().toLocaleDateString(
                "es-MX",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                }
            );

    }


    if (saveDiary) {

        saveDiary.addEventListener(
            "click",
            () => {

                const user =
                    getUser();

                if (!user) {
                    return;
                }


                const text =
                    diaryText.value.trim();


                if (!text) {

                    diaryMessage.textContent =
                        "Escribe algo antes de guardar.";

                    return;
                }


                if (
                    !user.diary ||
                    user.diary.trim() === ""
                ) {

                    user.reflections += 1;

                }


                user.diary =
                    text;


                saveCurrentUser();

                updateStats();


                diaryMessage.textContent =
                    "✓ Tu reflexión fue guardada correctamente.";

            }
        );

    }


    if (clearDiary) {

        clearDiary.addEventListener(
            "click",
            () => {

                diaryText.value = "";

                diaryMessage.textContent =
                    "El texto fue limpiado. Recuerda guardar si quieres conservarlo.";

            }
        );

    }


    /* =====================================================
       PROMPTS DEL DIARIO
    ====================================================== */

    const prompts =
        document.querySelectorAll(
            "[data-prompt]"
        );


    prompts.forEach(prompt => {

        prompt.addEventListener(
            "click",
            () => {

                const text =
                    prompt.dataset.prompt;

                diaryText.focus();


                if (
                    diaryText.value.trim() === ""
                ) {

                    diaryText.value =
                        text + " ";

                } else {

                    diaryText.value +=
                        "\n\n" + text + " ";

                }

            }
        );

    });


    /* =====================================================
       ESTADÍSTICAS
    ====================================================== */

    function updateStats() {

        const user =
            getUser();

        if (!user) {
            return;
        }


        const habits =
            user.habits || [];


        const completed =
            habits.filter(
                value => value === true
            ).length;


        const percentage =
            habits.length
                ? Math.round(
                    (completed / habits.length) * 100
                )
                : 0;


        const statHabits =
            document.getElementById(
                "statHabits"
            );

        const statActivities =
            document.getElementById(
                "statActivities"
            );

        const statReflections =
            document.getElementById(
                "statReflections"
            );


        if (statHabits) {

            statHabits.textContent =
                percentage + "%";

        }


        if (statActivities) {

            statActivities.textContent =
                user.activities || 0;

        }


        if (statReflections) {

            statReflections.textContent =
                user.reflections || 0;

        }

    }


    /* =====================================================
       CARGAR DATOS DEL USUARIO
    ====================================================== */

    function loadUserData() {

        const user =
            getUser();

        if (!user) {
            return;
        }


        /* HABITOS */

        if (user.habits) {

            habitChecks.forEach(
                (checkbox, index) => {

                    checkbox.checked =
                        Boolean(
                            user.habits[index]
                        );

                }
            );

        }


        updateHabitProgress();


        /* DIARIO */

        if (diaryText) {

            diaryText.value =
                user.diary || "";

        }


        /* REFLEXIÓN */

        const mentalReflection =
            document.getElementById(
                "mentalReflection"
            );


        if (mentalReflection) {

            mentalReflection.value =
                user.mentalReflection || "";

        }


        /* HABITO ELEGIDO */

        const habitChoiceResult =
            document.getElementById(
                "habitChoiceResult"
            );


        if (
            habitChoiceResult &&
            user.chosenHabit
        ) {

            habitChoiceResult.textContent =
                `Tu objetivo guardado: ${user.chosenHabit}.`;

        }


        updateStats();

    }


    /* =====================================================
       TEMA OSCURO / CLARO
    ====================================================== */

    const themeButton =
        document.getElementById(
            "themeButton"
        );


    function applyTheme() {

        const user =
            getUser();

        if (!user) {
            return;
        }


        if (user.darkMode) {

            document.body.classList.add(
                "dark"
            );

            themeButton.textContent =
                "☀";

        } else {

            document.body.classList.remove(
                "dark"
            );

            themeButton.textContent =
                "☾";

        }

    }


    if (themeButton) {

        themeButton.addEventListener(
            "click",
            () => {

                const user =
                    getUser();

                if (!user) {
                    return;
                }


                user.darkMode =
                    !user.darkMode;


                saveCurrentUser();

                applyTheme();

            }
        );

    }


    /* =====================================================
       BOTONES DE RELAJACIÓN QUE CAMBIAN DE PÁGINA
    ====================================================== */

    document.querySelectorAll(
        '.relax-options [data-page]'
    ).forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const modal =
                    button.closest(
                        ".modal-overlay"
                    );

                if (modal) {

                    modal.classList.add(
                        "hidden"
                    );

                }


                showPage(
                    button.dataset.page
                );

            }
        );

    });


    /* =====================================================
       INICIAR SESIÓN AUTOMÁTICAMENTE SI YA HAY SESIÓN
    ====================================================== */

    if (
        currentUser &&
        users[currentUser]
    ) {

        openApp();

    } else {

        authScreen.classList.remove(
            "hidden"
        );

        app.classList.add(
            "hidden"
        );

    }


});