
// Variable global para almacenar los datos de las películas
let peliculas = [];

// Función para cargar el listado de películas
async function cargarPeliculas() {
    const respuesta = await fetch('https://japceibal.github.io/japflix_api/movies-data.json');
    peliculas = await respuesta.json();
}

// Función para mostrar las películas filtradas
function mostrarPeliculas(filtradas) {
    const listaPeliculas = document.getElementById('listaPeliculas');
    listaPeliculas.innerHTML = ''; // Limpiar la lista

    if (filtradas.length === 0) {
        listaPeliculas.innerHTML = '<li class="list-group-item">No se encontraron películas.</li>';
        return;
    }

    filtradas.forEach(pelicula => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        const tagline = pelicula.tagline ? pelicula.tagline : "No hay descripción disponible";

        li.innerHTML = `
            <div>
                <strong>${pelicula.title}</strong>
                <p>${tagline}</p>
                <div>${getStarRating(pelicula.vote_average)}</div>
            </div>
        `;

        li.onclick = () => mostrarEnOffcanvas(pelicula);
        listaPeliculas.appendChild(li);
    });
}

// Función para convertir la calificación de la película en estrellas
function getStarRating(vote) {
    const stars = Math.round(vote / 2);
    let starHtml = "";
    for (let i = 0; i < 5; i++) {
        starHtml += i < stars ? '<i class="fa fa-star text-warning"></i>' : '<i class="fa fa-star-o text-secondary"></i>';
    }
    return starHtml;
}

// Función para filtrar las películas según la búsqueda
function buscarPeliculas() {
    const inputBuscar = document.getElementById('inputBuscar').value.trim().toLowerCase(); // Obtener valor del campo de búsqueda
    if (!inputBuscar) { // Si no hay valor, no hacer nada
        alert("Por favor, ingresa un valor para buscar.");
        return;
    }

    const peliculasFiltradas = peliculas.filter(pelicula => {
        return (
            pelicula.title.toLowerCase().includes(inputBuscar) ||
            (pelicula.genres && pelicula.genres.some(genre => genre.name.toLowerCase().includes(inputBuscar))) ||
            (pelicula.tagline && pelicula.tagline.toLowerCase().includes(inputBuscar)) ||
            (pelicula.overview && pelicula.overview.toLowerCase().includes(inputBuscar))
        );
    });

    mostrarPeliculas(peliculasFiltradas);
}

// Evento de carga de la página
window.onload = async () => {
    await cargarPeliculas();
    document.getElementById('btnBuscar').onclick = buscarPeliculas;
};

// Función para mostrar los detalles de la película en el contenedor
function mostrarEnOffcanvas(pelicula) {
    document.getElementById('offcanvasTitle').textContent = pelicula.title;
    document.getElementById('offcanvasOverview').textContent = pelicula.overview || "Sin descripción disponible";

    const offcanvasGenres = document.getElementById('offcanvasGenres');
    offcanvasGenres.innerHTML = pelicula.genres ? pelicula.genres.map(genre => `<li>${genre.name}</li>`).join("") : "<li>No hay géneros disponibles</li>";

    document.getElementById('offcanvasDetails').innerHTML = `
        <ul>
            <li>Año de lanzamiento: ${pelicula.release_date.split('-')[0]}</li>
            <li>Duración: ${pelicula.runtime} minutos</li>
            <li>Presupuesto: $${pelicula.budget.toLocaleString()}</li>
            <li>Ganancias: $${pelicula.revenue.toLocaleString()}</li>
        </ul>
    `;

    const offcanvasElement = new bootstrap.Offcanvas(document.getElementById("offcanvasTop"));
    offcanvasElement.show();
}
