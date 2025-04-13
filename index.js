document.addEventListener("DOMContentLoaded", function () {
    const loadingScreen = document.getElementById("loading-screen");

    // Mantén la pantalla de carga visible durante 5 segundos
    setTimeout(() => {
        // Oculta la pantalla de carga con una transición suave
        loadingScreen.classList.add("hidden");

        // Elimina el elemento del DOM después de la transición
        setTimeout(() => {
            loadingScreen.remove();
        }, 500); // Coincide con la duración de la transición en el CSS
    }, 5000); // Duración de la pantalla de carga (5 segundos)
});

document.addEventListener("DOMContentLoaded", function () {
    const iconos = document.querySelectorAll(".icono");
    const ventanas = document.querySelectorAll(".ventana");
    const programas = [
        document.getElementById("programa1"),
        document.getElementById("programa2"),
        document.getElementById("programa3"),
        document.getElementById("programa4")
    ];
    const ventanasAbiertas = [];

    function cerrarVentana(ventana) {
        ventana.style.opacity = "0";
        ventana.style.zIndex = "";

        const programaIndex = programas.findIndex(p => p.innerHTML === ventana.id.charAt(0).toUpperCase() + ventana.id.slice(1));
        if (programaIndex !== -1) {
            programas[programaIndex].innerHTML = "";
            programas[programaIndex].style.opacity = "0";
        }

        const index = ventanasAbiertas.indexOf(ventana);
        if (index !== -1) {
            ventanasAbiertas.splice(index, 1);
        }

        ventana.dataset.left = ventana.style.left;
        ventana.dataset.top = ventana.style.top;

        reorganizarProgramas();
    }

    function minimizarVentana(ventana) {
        ventana.style.opacity = "0";
        ventana.style.zIndex = "";

        ventana.dataset.left = ventana.style.left;
        ventana.dataset.top = ventana.style.top;
    }

    function restaurarVentana(ventana) {
        ventana.style.opacity = "1";
        ventana.style.zIndex = 9999;

        if (ventana.dataset.left && ventana.dataset.top) {
            ventana.style.left = ventana.dataset.left;
            ventana.style.top = ventana.dataset.top;
        }

        if (!ventanasAbiertas.includes(ventana)) {
            ventanasAbiertas.push(ventana);
        }
    }

    function reorganizarProgramas() {
        const programasActivos = programas.filter(p => p.innerHTML !== "");
        programas.forEach((programa, index) => {
            if (programasActivos[index]) {
                programa.innerHTML = programasActivos[index].innerHTML;
                programa.style.opacity = "1";
            } else {
                programa.innerHTML = "";
                programa.style.opacity = "0";
            }
        });
    }

    function asignarEventos(ventana) {
        const closeButton = ventana.querySelector(".close-minimize img[alt='Cerrar']");
        const minimizeButton = ventana.querySelector(".close-minimize img[alt='Minimizar']");

        if (closeButton) {
            closeButton.addEventListener("click", function () {
                cerrarVentana(ventana);
            });
        } else {
            console.warn(`No se encontró el botón de cerrar en la ventana: ${ventana.id}`);
        }

        if (minimizeButton) {
            minimizeButton.addEventListener("click", function () {
                minimizarVentana(ventana);
            });
        } else {
            console.warn(`No se encontró el botón de minimizar en la ventana: ${ventana.id}`);
        }
    }

    ventanas.forEach(ventana => {
        console.log(`Asignando eventos a la ventana: ${ventana.id}`);
        asignarEventos(ventana);
    });

    programas.forEach(programa => {
        programa.addEventListener("click", function () {
            const ventanaId = programa.innerHTML.toLowerCase();
            const ventana = document.getElementById(ventanaId);

            if (ventana) {
                restaurarVentana(ventana);
            }
        });
    });

    iconos.forEach(icono => {
        icono.addEventListener("click", function () {
            const ventanaId = icono.getAttribute("data-ventana");
            console.log(`Icono clicado: ${ventanaId}`);
            const ventana = document.getElementById(ventanaId);

            if (ventana) {
                console.log(`Ventana encontrada: ${ventanaId}`);
                if (!ventanasAbiertas.includes(ventana)) {
                    ventana.style.opacity = "1";
                    ventana.style.zIndex = ventanasAbiertas.length + 1;
                    ventanasAbiertas.push(ventana);

                    const programaDisponible = programas.find(p => !p.innerHTML);
                    if (programaDisponible) {
                        programaDisponible.innerHTML = ventanaId.charAt(0).toUpperCase() + ventanaId.slice(1);
                        programaDisponible.style.opacity = "1";
                    }

                    asignarEventos(ventana);
                } else {
                    restaurarVentana(ventana);
                }
            } else {
                console.error(`Ventana no encontrada: ${ventanaId}`);
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const ventanas = document.querySelectorAll(".ventana");

    // Función para habilitar el movimiento de una ventana
    function habilitarMovimiento(ventana) {
        const navbar = ventana.querySelector(".navbar");

        if (!navbar) {
            console.warn(`No se encontró la barra de navegación en la ventana: ${ventana.id}`);
            return;
        }

        let isDragging = false; // Bandera para saber si estamos moviendo
        let inicioX, inicioY, offsetX, offsetY;

        // Evento mousedown: Inicia el movimiento
        navbar.addEventListener("mousedown", function (e) {
            e.preventDefault();
            isDragging = true;

            // Guarda las posiciones iniciales del ratón y la ventana
            inicioX = e.clientX;
            inicioY = e.clientY;
            offsetX = ventana.offsetLeft;
            offsetY = ventana.offsetTop;

            // Agrega eventos para el movimiento y la finalización
            document.addEventListener("mousemove", moverVentana);
            document.addEventListener("mouseup", detenerMovimiento);
        });

        // Evento mousemove: Mueve la ventana
        function moverVentana(e) {
            if (!isDragging) return;

            // Calcula la nueva posición de la ventana
            const nuevoLeft = offsetX + (e.clientX - inicioX);
            const nuevoTop = offsetY + (e.clientY - inicioY);

            // Aplica las nuevas posiciones a la ventana
            ventana.style.left = `${nuevoLeft}px`;
            ventana.style.top = `${nuevoTop}px`;
        }

        // Evento mouseup: Finaliza el movimiento
        function detenerMovimiento() {
            isDragging = false;

            // Elimina los eventos de movimiento y finalización
            document.removeEventListener("mousemove", moverVentana);
            document.removeEventListener("mouseup", detenerMovimiento);
        }
    }

    // Función para habilitar el redimensionamiento de una ventana
    function habilitarRedimensionamiento(ventana) {
        const handles = ventana.querySelectorAll(".resize-handle");
        const desktop = document.querySelector(".desktop"); // Contenedor principal

        handles.forEach(handle => {
            let isResizing = false;
            let inicioX, inicioY, inicioAncho, inicioAlto;

            handle.addEventListener("mousedown", function (e) {
                e.preventDefault();
                isResizing = true;

                inicioX = e.clientX;
                inicioY = e.clientY;
                inicioAncho = ventana.offsetWidth;
                inicioAlto = ventana.offsetHeight;

                document.addEventListener("mousemove", redimensionar);
                document.addEventListener("mouseup", detenerRedimensionamiento);
            });

            function redimensionar(e) {
                if (!isResizing) return;

                const handleClass = handle.classList;
                const desktopRect = desktop.getBoundingClientRect(); // Límites del contenedor
                const ventanaRect = ventana.getBoundingClientRect(); // Límites de la ventana

                let nuevoAncho = inicioAncho;
                let nuevoAlto = inicioAlto;
                let nuevoLeft = ventana.offsetLeft;
                let nuevoTop = ventana.offsetTop;

                // Calcula el nuevo tamaño y posición según el handle
                if (handleClass.contains("top-left")) {
                    nuevoAncho = inicioAncho - (e.clientX - inicioX);
                    nuevoAlto = inicioAlto - (e.clientY - inicioY);
                    nuevoLeft = ventana.offsetLeft + (e.clientX - inicioX);
                    nuevoTop = ventana.offsetTop + (e.clientY - inicioY);
                } else if (handleClass.contains("top-right")) {
                    nuevoAncho = inicioAncho + (e.clientX - inicioX);
                    nuevoAlto = inicioAlto - (e.clientY - inicioY);
                    nuevoTop = ventana.offsetTop + (e.clientY - inicioY);
                } else if (handleClass.contains("bottom-left")) {
                    nuevoAncho = inicioAncho - (e.clientX - inicioX);
                    nuevoAlto = inicioAlto + (e.clientY - inicioY);
                    nuevoLeft = ventana.offsetLeft + (e.clientX - inicioX);
                } else if (handleClass.contains("bottom-right")) {
                    nuevoAncho = inicioAncho + (e.clientX - inicioX);
                    nuevoAlto = inicioAlto + (e.clientY - inicioY);
                } else if (handleClass.contains("top")) {
                    nuevoAlto = inicioAlto - (e.clientY - inicioY);
                    nuevoTop = ventana.offsetTop + (e.clientY - inicioY);
                } else if (handleClass.contains("bottom")) {
                    nuevoAlto = inicioAlto + (e.clientY - inicioY);
                } else if (handleClass.contains("left")) {
                    nuevoAncho = inicioAncho - (e.clientX - inicioX);
                    nuevoLeft = ventana.offsetLeft + (e.clientX - inicioX);
                } else if (handleClass.contains("right")) {
                    nuevoAncho = inicioAncho + (e.clientX - inicioX);
                }

                // Restringe el tamaño mínimo de la ventana
                const minWidth = 150;
                const minHeight = 100;
                nuevoAncho = Math.max(nuevoAncho, minWidth);
                nuevoAlto = Math.max(nuevoAlto, minHeight);

                // Restringe la ventana dentro del contenedor
                if (nuevoLeft < desktopRect.left) {
                    nuevoLeft = desktopRect.left;
                    nuevoAncho = ventanaRect.right - desktopRect.left;
                }
                if (nuevoTop < desktopRect.top) {
                    nuevoTop = desktopRect.top;
                    nuevoAlto = ventanaRect.bottom - desktopRect.top;
                }
                if (nuevoLeft + nuevoAncho > desktopRect.right) {
                    nuevoAncho = desktopRect.right - nuevoLeft;
                }
                if (nuevoTop + nuevoAlto > desktopRect.bottom) {
                    nuevoAlto = desktopRect.bottom - nuevoTop;
                }

                // Aplica los nuevos tamaños y posiciones
                ventana.style.width = `${nuevoAncho}px`;
                ventana.style.height = `${nuevoAlto}px`;
                ventana.style.left = `${nuevoLeft}px`;
                ventana.style.top = `${nuevoTop}px`;
            }

            function detenerRedimensionamiento() {
                isResizing = false;
                document.removeEventListener("mousemove", redimensionar);
                document.removeEventListener("mouseup", detenerRedimensionamiento);
            }
        });
    }

    // Habilita el movimiento y el redimensionamiento para todas las ventanas
    ventanas.forEach(ventana => {
        habilitarMovimiento(ventana);
        habilitarRedimensionamiento(ventana);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const madeLink = document.getElementById("made-link");
    const menuRedes = document.getElementById("menu-redes");

    // Alternar la visibilidad del menú al hacer clic en el enlace
    madeLink.addEventListener("click", function (e) {
        e.preventDefault(); // Evita que el enlace recargue la página
        menuRedes.style.display = menuRedes.style.display === "block" ? "none" : "block";
    });

    // Cerrar el menú si se hace clic fuera de él
    document.addEventListener("click", function (e) {
        if (!menuRedes.contains(e.target) && e.target !== madeLink) {
            menuRedes.style.display = "none";
        }
    });
});