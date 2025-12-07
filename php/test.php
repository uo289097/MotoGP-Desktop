<?php
require_once "configuracion.php";
require_once "cronometro_logic.php";

session_start();
class Test
{

    private $config;
    private $crono;
    private $tiempo;
    private $id;

    public function __construct()
    {
        $this->config = new Configuracion();
        if (!isset($_SESSION["paso"])) {
            $_SESSION["paso"] = 1;
        }
    }

    // --------------------------
    // MÉTODO PRINCIPAL
    // --------------------------
    public function procesar()
    {
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $this->procesarFormulario();
        }

        $this->mostrarFormulario();
    }

    // --------------------------
    // PROCESA EL FORMULARIO RECIBIDO
    // --------------------------
    private function procesarFormulario()
    {
        $paso = $_SESSION["paso"];

        switch ($paso) {

            // PASO 1 → PASO 2
            case 1:
                if (isset($_POST["p1"], $_POST["p2"])) {
                    $profesion = $_POST["p1"];
                    $edad = $_POST["p2"];
                    $genero = $_POST["genero"];
                    $pericia = $_POST["p4"];
                    $_SESSION["dispositivo"] = $_POST["dispositivo"];

                    // Guardar datos en la configuración
                    $this->id = $this->config->guardarDatosUsuario(
                        $profesion,
                        $edad,
                        $genero,
                        $pericia
                    );

                    $_SESSION['id_usuario'] = $this->id;

                    $_SESSION["crono"] = new Cronometro();
                    $_SESSION["crono"]->arrancar();
                    $_SESSION["paso"] = 2;
                }
                break;

            // PASO 2 (Test) → PASO 3
            case 2:
                if (isset($_POST["accion"]) && $_POST["accion"] == "Continuar Test") {
                    $this->crono = $_SESSION["crono"];
                    $this->crono->parar();
                    $_SESSION["tiempo"] = $this->crono->getTiempo();

                    $_SESSION["nota"] = $this->corregirTest($_POST);

                    $_SESSION["paso"] = 3;
                }
                break;

            // PASO 3 → PASO 4
            case 3:
                if (isset($_POST["p13"])) {
                    $comentarios = $_POST["p11"];
                    $propuestas = $_POST["p12"];
                    $valoracion = $_POST["p13"];
                    $idUsuario = $_SESSION['id_usuario'];
                    $this->config->guardarDatosTest(
                        $idUsuario,
                        $_SESSION["dispositivo"],
                        $_SESSION["nota"],
                        $_SESSION["tiempo"],
                        $comentarios,
                        $propuestas,
                        $valoracion
                    );

                    $_SESSION["paso"] = 4;
                }
                break;

            // PASO 4 → PASO 5 (Fin)
            case 4:
                if (isset($_POST["p1"])) {
                    $idUsuario = $_SESSION['id_usuario'];
                    $comentarios = $_POST["p1"];
                    $this->config->guardarDatosObservador(
                        $idUsuario,
                        $comentarios
                    );
                    $_SESSION["paso"] = 5;
                }
                break;
        }
    }

    // --------------------------
    // CORREGIR TEST (OOP)
    // --------------------------
    private function corregirTest($respuestas)
    {
        $correctas = [
            "p1" => "España",
            "p2" => "1997",
            "p3" => "10",
            "baturiti" => "sí",
            "lluvia" => "no",
            "p6" => "F.Aldeguer",
            "p7" => "Marc Márquez",
            "p8" => "545",
            "p9" => "Álex Márquez",
            "p10" => "Pecco Bagnaia"
        ];

        $nota = 0;

        foreach ($correctas as $campo => $ok) {
            if (
                isset($respuestas[$campo]) &&
                strtolower(trim($respuestas[$campo])) === strtolower($ok)
            ) {
                $nota++;
            }
        }

        return $nota;
    }

    // --------------------------
    // PINTAR EL FORMULARIO CORRESPONDIENTE
    // --------------------------
    private function mostrarFormulario()
    {
        $paso = $_SESSION["paso"];

        switch ($paso) {

            case 1:
                $this->formPaso1();
                break;

            case 2:
                $this->formPaso2();
                break;

            case 3:
                $this->formPaso3();
                break;

            case 4:
                $this->formPaso4();
                break;

            case 5:
                echo "<p>✔ Datos guardados correctamente. Gracias.</p>";
                break;
        }
    }

    // --------------------------
    // FORMULARIOS
    // --------------------------

    private function formPaso1()
    {
        echo '
        <form method="post"> 
            <label>Profesión</label> 
            <input type="text" name="p1" required> 
            
            <label>Edad</label> 
            <input type="number" min="3" max="120" name="p2" required> 
            
            <label for="genero">Género</label> 
            <select id="genero" name="genero"> 
                <option value="masculino">Masculino</option> 
                <option value="femenino">Femenino</option> 
            </select> 
            
            <label>Pericia informática</label> 
            <input type="number" min="0" max="10" name="p4" required> 
            
            <label for="dispositivo">Dispositivo</label> 
            <select id="dispositivo" name="dispositivo"> 
                <option value="ordenador">Ordenador</option> 
                <option value="tableta">Tableta</option> 
                <option value="movil">Móvil</option> 
            </select> 
            
            <br><br> 
            <input type="submit" value="Continuar al test"> 
        </form>';
    }

    private function formPaso2()
    {
        echo '
        <form method="post">

            <label>1. País nacimiento</label>
            <input type="text" name="p1" required>

            <label>2. Año nacimiento</label>
            <input type="number" name="p2" required>

            <label>3. Edad minimotos</label>
            <input type="number" name="p3" required>

            <label>4. Baturiti +50k hab?</label>
            <select name="baturiti">
                <option value="sí">Sí</option>
                <option value="no">No</option>
            </select>

            <label>5. Llovió?</label>
            <select name="lluvia">
                <option value="sí">Sí</option>
                <option value="no">No</option>
            </select>

            <label>6. Ganador Mandalika</label>
            <input type="text" name="p6" required>

            <label>7. Líder mundial</label>
            <input type="text" name="p7" required>

            <label>8. Puntos líder</label>
            <input type="number" name="p8" required>

            <label>9. Segundo mundial</label>
            <input type="text" name="p9" required>

            <label>10. Tercero mundial</label>
            <input type="text" name="p10" required>

            <input type="submit" name="accion" value="Continuar Test">
        </form>';
    }

    private function formPaso3()
    {
        echo '
        <form method="post">
            <label>Comentarios</label>
            <input type="text" name="p11">

            <label>Propuestas</label>
            <input type="text" name="p12">

            <label>Valoración</label>
            <input type="number" name="p13" min="0" max="10" required>

            <input type="submit" value="Continuar" required>
        </form>';
    }

    private function formPaso4()
    {
        echo '
        <form method="post">
            <label>Comentarios del facilitador</label>
            <input type="text" name="p1">

            <input type="submit" value="Guardar">
        </form>';
    }
}

?>


<html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>MotoGP-Test</title>

    <meta name="author" content="Gabriel García Martínez" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />

    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />

    <link rel="icon" type="img/ico" href="../multimedia/favicon.ico" />
</head>

<body>
    <header>
        <h1><a href="../index.html" title="MotoGP Desktop">MotoGP Desktop</a></h1>
    </header>

    <main>
        <h2>Test</h2>
        <?php

        $test = new Test();
        $test->procesar();
        ?>
    </main>
</body>

</html>