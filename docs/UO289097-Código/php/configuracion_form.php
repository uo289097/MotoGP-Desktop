<?php
require_once "configuracion.php";

$c = new Configuracion();

if (count($_POST) > 0) {
    if (isset($_POST['botonReiniciar']))
        $c->reiniciar();
    if (isset($_POST['botonEliminar']))
        $c->eliminar();
    if (isset($_POST['botonExportar']))
        $c->exportar();
    if (isset($_POST['botonInicializar']))
        $c->inicializar();
    if (isset($_POST['botonImportar']) && isset($_FILES['archivoCSV'])) {
        $rutaTemp = $_FILES['archivoCSV']['tmp_name'];
        $c->importarCSV($rutaTemp);
    }
}
?>

<!DOCTYPE HTML>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>MotoGP-Configuración</title>
    <link rel="stylesheet" href="../estilo/estilo.css">
    <link rel="stylesheet" href="../estilo/layout.css">
    <link rel="icon" type="img/ico" href="../multimedia/favicon.ico" />
</head>

<body>
    <main>
        <header>
            <h1><a href="../index.html" title="MotoGP Desktop">MotoGP Desktop</a></h1>
        </header>
        <h2>Configuración</h2>
        <form action="#" method="post" name="configuración">
            <label for="botonReiniciar">Reiniciar base de datos</label>
            <input type="submit" id="botonReiniciar" name="botonReiniciar" value="Reiniciar BD" />

            <label for="botonEliminar">Eliminar base de datos</label>
            <input type="submit" id="botonEliminar" name="botonEliminar" value="Eliminar BD" />

            <label for="botonExportar">Exportar base de datos</label>
            <input type="submit" id="botonExportar" name="botonExportar" value="Exportar BD" />

            <label for="botonInicializar">Inicializar base de datos</label>
            <input type="submit" id="botonInicializar" name="botonInicializar" value="Inicializar BD" />
        </form>
        <form action="#" method="post" enctype="multipart/form-data">
            <label for="archivoCSV">Seleccionar archivo CSV</label>
            <input type="file" id="archivoCSV" name="archivoCSV" accept=".csv">

            <label for="botonImportar">Importar datos desde CSV</label>
            <input type="submit" id="botonImportar" name="botonImportar" value="Importar CSV">
        </form>
    </main>
</body>

</html>