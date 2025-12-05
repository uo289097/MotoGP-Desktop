<?php

require_once "configuracion.php";

$config = new Configuracion();


// -------------- 1) Si se pulsa “Iniciar prueba” --------------------
if (isset($_POST["iniciar"])) {
    $_SESSION["prueba_iniciada"] = true;
}


// -------------- 2) Si se envía el formulario con respuestas --------
if (isset($_POST["terminar"])) {

    /*if (!isset($_SESSION["cronometro"])) {
        die("Error: no se inició el cronómetro.");
    }

    $c = $_SESSION["cronometro"];
    $c->detener();
    $tiempo = $c->getTiempo();


    // GUARDAR USUARIO (ficticio si no lo tienes en tu lógica)
    $db->query("INSERT INTO usuario (profesion, edad, genero, pericia_informatica)
                VALUES ('', 0, 'masculino', 0)");
    $idUsuario = $db->insert_id;


    // GUARDAR RESULTADO
    $stmt = $db->prepare("INSERT INTO resultado 
            (id_usuario, dispositivo, tiempo, completada, comentarios, propuestas, valoracion)
            VALUES (?, 'ordenador', ?, 1, '', '', 0)");
    $stmt->bind_param("id", $idUsuario, $tiempo);
    $stmt->execute();

    $_SESSION["idResultado"] = $db->insert_id;

    // Guardamos las respuestas en la sesión (opcional si luego las necesitas)
    $_SESSION["respuestas"] = $_POST;

    // Redirigimos a la página de comentarios del observador
    header("Location: observador.php");
    exit;*/
}

?>

<html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>MotoGP-Test</title>

    <meta name="author" content="Gabriel García Martínez" />
    <meta name="description" content="" />
    <meta name="keywords" content="" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />

    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />

    <link rel="icon" type="img/ico" href="multimedia/favicon.ico" />
</head>

<body>
    <header>
        <h1><a href="../index.html" title="MotoGP Desktop">MotoGP Desktop</a></h1>
    </header>

    <main>
        <h2>Test</h2>
        <?php
        if (!isset($_SESSION["prueba_iniciada"])) {
            ?>

            <form method="post">
                <input type="submit" name="iniciar" value="Iniciar prueba">
            </form>

            <?php
            exit;
        }
        ?>
        <form action="#" method="post" name="test">
            <label for="p1">1. ¿En qué país nació Joan Mir?</label>
            <input type="text" id="p1" name="p1" required>

            <label for="p2">2. ¿En qué año nació Joan Mir?</label>
            <input type="number" id="p2" name="p2" required>

            <label for="p3">3. ¿Con qué edad empezó a correr Joan Mir en minimotos?</label>
            <input type="number" id="p3" name="p3" required>

            <label for="p4">4. ¿Tiene más de 50 mil habitantes Baturiti? (Sí/No)</label>
            <input type="text" id="p4" name="p4" required>

            <label>5. ¿Llovió el día de la carrera? (Sí/No)</label>
            <input type="text" name="p5" required>

            <label>6. ¿Quién ganó la carrera de Mandalika?</label>
            <input type="text" name="p6" required>

            <label>7. ¿Quién era el líder del mundial de MotoGP tras la carrera de Mandalika?</label>
            <input type="text" name="p7" required>

            <label>8. ¿Cuántos puntos tenía el líder del mundial de MotoGP tras la carrera de Mandalika?</label>
            <input type="number" name="p8" required>

            <label>9. ¿Quién era el segundo del mundial de MotoGP tras la carrera de Mandalika?</label>
            <input type="text" name="p9" required>

            <label>10. ¿Quién era el tercero del mundial de MotoGP tras la carrera de Mandalika?</label>
            <input type="text" name="p10" required>

            <br><br>
            <input type="submit" value="Terminar prueba">
        </form>
    </main>

</body>

</html>