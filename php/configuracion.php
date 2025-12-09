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
            $dir = __DIR__ . "/csv/";

            // Crear la carpeta si no existe
            if (!is_dir($dir)) {
                mkdir($dir, 0777, true); // true = crear recursivamente si hiciera falta
            }

            $filepath = $dir . $filename;

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

    public function guardarDatosUsuario($profesion, $edad, $genero, $pericia)
    {
        if (!$this->connection) {
            return false;
        }

        // Sentencia preparada para evitar SQL Injection
        $stmt = $this->db->prepare("
            INSERT INTO usuario (profesion, edad, genero, pericia_informatica)
            VALUES (?, ?, ?, ?)");

        if (!$stmt) {
            die("Error preparando sentencia: " . $this->db->error);
        }

        $stmt->bind_param("sisi", $profesion, $edad, $genero, $pericia);

        $exito = $stmt->execute();

        if (!$exito) {
            die("Error ejecutando INSERT: " . $stmt->error);
        }

        $idUsuario = $this->db->insert_id;

        $stmt->close();

        return $idUsuario;
    }

    public function guardarDatosTest(
        $idUsuario,
        $dispositivo,
        $nota,
        $tiempo,
        $comentarios,
        $propuestas,
        $valoracion,
        $completada
    ) {
        if (!$this->connection) {
            return false;
        }

        $stmt = $this->db->prepare("
        INSERT INTO resultado (
            id_usuario, dispositivo, tiempo, completada,
            comentarios, propuestas, valoracion, nota
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");

        if (!$stmt) {
            die("Error preparando sentencia: " . $this->db->error);
        }

        // Tipos: i = int, s = string, d = double

        $stmt->bind_param(
            "isidssii",
            $idUsuario,
            $dispositivo,
            $tiempo,
            $completada,
            $comentarios,
            $propuestas,
            $valoracion,
            $nota
        );

        $exito = $stmt->execute();

        if (!$exito) {
            die("Error ejecutando INSERT: " . $stmt->error);
        }

        $stmt->close();

        return true;
    }

    public function guardarDatosObservador(
        $idUsuario,
        $comentarios
    ) {
        if (!$this->connection) {
            return false;
        }

        $stmt = $this->db->prepare("
        INSERT INTO observacion (
            id_usuario, comentarios
        )
        VALUES (?, ?)
    ");

        if (!$stmt) {
            die("Error preparando sentencia: " . $this->db->error);
        }

        $stmt->bind_param(
            "is",
            $idUsuario,
            $comentarios
        );

        $exito = $stmt->execute();

        if (!$exito) {
            die("Error ejecutando INSERT: " . $stmt->error);
        }

        $stmt->close();

        return true;
    }

}

?>