<?php
class Configuracion
{
    private $servername = "localhost";
    private $username = "DBUSER2025";
    private $password = "DBPSWD2025";
    private $database = "uo289097_db";
    private $db;
    private $connection;

    public function __construct()
    {
        $this->connect();
    }

    private function connect()
    {
        $this->db = new mysqli(
            $this->servername,
            $this->username,
            $this->password
        );

        if ($this->db->connect_errno) {
            $this->connection = false;
            die("Conexión fallida al servidor MySQL");
        }

        try {
            $this->db->select_db($this->database);
            $this->connection = true;
        } catch (mysqli_sql_exception) {
            $this->connection = false;
        }
    }
    public function reiniciar()
    {
        if ($this->connection) {
            $this->db->begin_transaction();

            $this->db->execute_query("DELETE FROM observacion");
            $this->db->execute_query("DELETE FROM resultado");
            $this->db->execute_query("DELETE FROM usuario");

            $this->db->commit();
        }
    }

    public function eliminar()
    {
        if (!$this->connection) {
            $this->connect();
        }
        $this->db->execute_query("DROP DATABASE IF EXISTS UO289097_DB");
        $this->db->close();
        $this->connection = false;
    }

    public function exportar()
    {
        if ($this->connection) {
            $tablas = ["usuario", "resultado", "observacion"];

            $filename = "exportUsabilidad_" . date("Ymd_His") . ".csv";
            $filepath = __DIR__ . "/" . $filename;

            $file = fopen($filepath, "w");

            foreach ($tablas as $tabla) {

                fwrite($file, "### Tabla: $tabla\n");

                $result = $this->db->query("SELECT * FROM $tabla");

                $headers = [];
                while ($finfo = $result->fetch_field()) {
                    $headers[] = $finfo->name;
                }
                fputcsv($file, $headers);

                while ($row = $result->fetch_assoc()) {
                    fputcsv($file, $row);
                }

                fwrite($file, "\n");
            }

            fclose($file);
        }

    }

    public function inicializar()
    {
        $this->connect();
        $sqlFile = __DIR__ . "/uo289097_db.sql";

        if (!file_exists($sqlFile)) {
            die("No se encuentra el archivo SQL.");
        }

        $sql = file_get_contents($sqlFile);

        if ($this->db->multi_query($sql)) {
            do {

            } while ($this->db->next_result());
        } else {
            die("Error ejecutando SQL: " . $this->db->error);
        }
    }
}

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
}

?>

<!DOCTYPE HTML>

<html lang="es">

<head>
    <meta charset="UTF-8" />
    <title>MotoGP-Configuración</title>

    <meta name="author" content="Gabriel García Martínez" />
    <meta name="description" content="" />
    <meta name="keywords" content="" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />

    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css" />

    <link rel="icon" type="img/ico" href="multimedia/favicon.ico" />
</head>

<body>
    <main>
        <h2>Configuración</h2>
        <form action="#" method="post" name="configuración">
            <input type="submit" name="botonReiniciar" value="Reiniciar BD" />
            <input type="submit" name="botonEliminar" value="Eliminar BD" />
            <input type="submit" name="botonExportar" value="Exportar BD" />
            <input type="submit" name="botonInicializar" value="Inicializar BD" />
        </form>
    </main>

</body>

</html>