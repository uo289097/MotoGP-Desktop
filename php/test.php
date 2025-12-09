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


    public function procesar()
    {
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $this->procesarFormulario();
        }

        $this->mostrarFormulario();
    }

    private function procesarFormulario()
    {
        $paso = $_SESSION["paso"];

        switch ($paso) {

            case 1:
                if (isset($_POST["p1"], $_POST["p2"])) {
                    $profesion = $_POST["p1"];
                    $edad = $_POST["p2"];
                    $genero = $_POST["genero"];
                    $pericia = $_POST["p4"];
                    $_SESSION["dispositivo"] = $_POST["dispositivo"];

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

            case 2:
                if (isset($_POST["accion"]) && $_POST["accion"] == "Continuar Test") {
                    $this->crono = $_SESSION["crono"];
                    $this->crono->parar();
                    $_SESSION["tiempo"] = $this->crono->getTiempo();

                    $_SESSION["nota"] = $this->corregirTest($_POST);

                    $_SESSION["paso"] = 3;
                }
                break;

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
                echo "<p>✔ Test respondido correctamente. Gracias.</p>";
                break;
        }
    }


    private function formPaso1()
    {
        echo '
        <form method="post"> 
            <label for="p1">Profesión</label> 
            <input type="text" name="p1" id="p1" required> 
            
            <label for="p2">Edad</label> 
            <input type="number" min="3" max="120" name="p2" id="p2" required> 
            
            <label for="genero">Género</label> 
            <input type="text" name="genero" id="genero" required> 
            
            <label for="p4">Pericia informática</label> 
            <input type="number" min="0" max="10" name="p4" id="p4" required> 
            
            <label for="dispositivo">Dispositivo</label> 
            <select id="dispositivo" name="dispositivo" id="dispositivo"> 
                <option value="ordenador">Ordenador</option> 
                <option value="tableta">Tableta</option> 
                <option value="movil">Móvil</option> 
            </select> 
            
            <input type="submit" name="accion" value="Continuar al test"> 
        </form>';
    }

    private function formPaso2()
    {
        echo '
        <form method="post">
            <label for="p1">1. ¿Cuál es el país de nacimiento de Joan Mir?</label>
            <input type="text" id="p1" name="p1" required>

            <label for="p2">2. ¿Cuál es el año de nacimiento de Joan Mir?</label>
            <input type="number" id="p2" name="p2" required>

            <label for="p3">3. ¿Con qué edad empezó a correr en minimotos?</label>
            <input type="number" id="p3" name="p3" required>

            <label for="baturiti">4. ¿Tiene Baturiti más de 50 mil habitantes?</label>
            <input type="text" name="baturiti" id="baturiti" required>

            <label for="lluvia">5. ¿Llovió en Mandalika el día de la carrera?</label>
            <input type="text" name="lluvia" id="lluvia" required>

            <label for="p6">6. ¿Quién ganó la carrera de Mandalika de MotoGP?</label>
            <input type="text" id="p6" name="p6" required>

            <label for="p7">7. ¿Quién era el líder del mundial de MotoGP tras la carrera de Mandalika?</label>
            <input type="text" id="p7" name="p7" required>

            <label for="p8">8. ¿Cuántos puntos tenía el líder del mundial tras la carrera de Mandalika?</label>
            <input type="number" id="p8" name="p8" required>

            <label for="p9">9. ¿Quién era el segundo del mundial tras la carrera de Mandalika?</label>
            <input type="text" id="p9" name="p9" required>

            <label for="p10">10. ¿Quién era el tercero del mundial tras la carrera de Mandalika?</label>
            <input type="text" id="p10" name="p10" required>

            <input type="submit" name="accion" value="Continuar Test">
        </form';
    }

    private function formPaso3()
    {
        echo '
        <form method="post">
            <label for="p11">Comentarios</label>
            <textarea name="p11" id="p11" rows="5" cols="40">
            </textarea>

            <label for="p12">Propuestas de mejora</label>
            <textarea name="p12" id="p12" rows="5" cols="40">
            </textarea>

            <label for="p12">Valoración de la aplicación</label>
            <input type="number" name="p13" id="p13" min="0" max="10" required>

            <input type="submit" name="accion" value="Continuar">
        </form>';
    }

    private function formPaso4()
    {
        echo '
        <form method="post">
            <label for="p1">Comentarios del facilitador</label>
            <textarea name="p1" id="p1" rows="5" cols="40">
            </textarea>

            <input type="submit" name="accion" value="Guardar">
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