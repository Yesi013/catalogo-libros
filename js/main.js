// Iniciar la variable libros desde el almacenamiento local o como un arreglo vacío si no hay datos guardados
var libros = JSON.parse(localStorage.getItem('libros')) || [];

// Función para guardar los libros en el almacenamiento local
function guardarLibrosEnLocalStorage() {
    localStorage.setItem('libros', JSON.stringify(libros));
}

// Función para agregar un nuevo libro al catálogo
function agregarLibro(titulo, autor, descripcion, archivoPDF) {
    var nuevoLibro = { 
        titulo: titulo, 
        autor: autor, 
        descripcion: descripcion, 
        archivo_pdf: archivoPDF ? archivoPDF.name : "" 
    };
    libros.push(nuevoLibro);

    // Guardar los libros en el almacenamiento local
    guardarLibrosEnLocalStorage();
}

// Función para cargar los libros desde el almacenamiento local al iniciar la aplicación
function cargarLibrosDesdeLocalStorage() {
    var librosGuardados = localStorage.getItem('libros');
    if (librosGuardados) {
        libros = JSON.parse(librosGuardados);
    }
}

// Función para buscar libros utilizando la API de Open Library
function buscarLibro() {
    var input = document.getElementById("searchInput").value.toLowerCase();
    var resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = "";

    // Construir la URL de la solicitud a la API de Open Library
    var url = "https://openlibrary.org/search.json?q=" + encodeURIComponent(input);

    // Realizar la solicitud HTTP utilizando fetch
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Procesar los resultados de la búsqueda
            mostrarResultados(data);
        })
        .catch(error => {
            // Manejar cualquier error en la solicitud
            console.error('Error al buscar libros:', error);
        });
}

// Función para mostrar los resultados de la búsqueda
function mostrarResultados(data) {
    var resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = "";

    // Verificar si hay resultados
    if (data.docs && data.docs.length > 0) {
        // Iterar sobre los resultados y mostrar cada libro
        data.docs.forEach(doc => {
            var titulo = doc.title ? doc.title : "Título desconocido";
            var autor = doc.author_name ? doc.author_name.join(", ") : "Autor desconocido";
            var descripcion = doc.description ? doc.description : "Sin descripción disponible";

            // Crear un elemento de div para mostrar el libro
            var libroDiv = document.createElement("div");
            libroDiv.classList.add("libro");
            libroDiv.innerHTML = "<h3>" + titulo + "</h3>" +
                                "<p>Autor: " + autor + "</p>" +
                                "<p>Descripción: " + descripcion + "</p>";

            // Crear el botón de agregar a favoritos
            var botonAgregarFavorito = document.createElement("button");
            botonAgregarFavorito.textContent = "Agregar a favoritos";
            botonAgregarFavorito.addEventListener("click", function() {
                agregarFavorito(doc); // Pasar el objeto libro en lugar de un índice
            });
            libroDiv.appendChild(botonAgregarFavorito);

            // Agregar el elemento de div al contenedor de resultados
            resultadosDiv.appendChild(libroDiv);
        });
    } else {
        // Si no hay resultados, mostrar un mensaje
        resultadosDiv.innerHTML = "<p>No se encontraron resultados.</p>";
    }
}

// Función para agregar un nuevo libro al catálogo
document.getElementById("nuevoLibroForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var titulo = document.getElementById("titulo").value;
    var autor = document.getElementById("autor").value;
    var descripcion = document.getElementById("descripcion").value;
    var archivoPDF = document.getElementById("archivoPDF").files[0];

    var nuevoLibro = { titulo: titulo, autor: autor, descripcion: descripcion, archivo_pdf: archivoPDF ? archivoPDF.name : "" };
    libros.push(nuevoLibro);

    // Guardar los libros en el almacenamiento local
    guardarLibrosEnLocalStorage();

    // Actualizar catálogo
    mostrarLibros();

    // Subir archivo PDF
    subirPDF(archivoPDF);

    document.getElementById("nuevoLibroForm").reset();
});

// Función para mostrar los libros
function mostrarLibros() {
    var resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = "";

    libros.forEach((libro, index) => {
        var libroDiv = document.createElement("div");
        libroDiv.innerHTML = "<h3>" + libro.titulo + "</h3>" +
                            "<p>Autor: " + libro.autor + "</p>" +
                            "<p>Descripción: " + libro.descripcion + "</p>";

        // Crear el botón de agregar a favoritos
        var botonAgregarFavorito = document.createElement("button");
        botonAgregarFavorito.textContent = "Agregar a favoritos";
        botonAgregarFavorito.addEventListener("click", function() {
            agregarFavorito(index);
        });
        libroDiv.appendChild(botonAgregarFavorito);

        resultadosDiv.appendChild(libroDiv);
    });
}

// Función para agregar un libro a la lista de favoritos
function agregarFavorito(libro) {
    var favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    favoritos.push(libro);
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    mostrarFavoritos();
}

// Función para subir el archivo PDF
function subirPDF(archivoPDF) {}

// Función para eliminar un libro de la lista de favoritos
function eliminarFavorito(index) {
    var favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    favoritos.splice(index, 1); // Elimina el libro en el índice dado
    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    mostrarFavoritos();
}

// Función para mostrar los libros favoritos
function mostrarFavoritos() {
    var favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];
    var favoritosDiv = document.getElementById("favoritos");
    favoritosDiv.innerHTML = "";

    favoritos.forEach((libro, index) => {
        if (libro) { // Verificar si el objeto libro es válido
            var libroDiv = document.createElement("div");
            libroDiv.innerHTML = "<h3>" + libro.titulo + "</h3>" +
                                "<p>Autor: " + libro.autor + "</p>" +
                                "<p>Descripción: " + libro.descripcion + "</p>" +
                                "<button onclick='eliminarFavorito(" + index + ")'>Eliminar de favoritos</button>";
            favoritosDiv.appendChild(libroDiv);
        }
    });
} 

// Llamar a la función para cargar los libros desde el almacenamiento local al iniciar la aplicación
cargarLibrosDesdeLocalStorage();

// Llamar a la función para mostrar los libros favoritos
mostrarFavoritos();