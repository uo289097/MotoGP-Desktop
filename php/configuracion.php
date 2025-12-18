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

        $this->db->set_charset("utf8mb4");

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
        if (!$this->connection) {
            return;
        }

        $filename = "exportUsabilidad_" . date("Ymd_His") . ".csv";
        $dir = __DIR__ . "/csv/";

        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }

        $filepath = $dir . $filename;
        $file = fopen($filepath, "w");
        fwrite($file, "\xEF\xBB\xBF"); // BOM UTF-8

        $headers = [
            "id",
            "profesion",
            "edad",
            "genero",
            "pericia_informatica",
            "dispositivo",
            "tiempo",
            "completada",
            "comentarios",
            "propuestas",
            "valoracion",
            "nota",
            "observaciones"
        ];

        fputcsv($file, $headers);

        // Consulta unificada
        $sql = "SELECT 
            u.id,
            u.profesion,
            u.edad,
            u.genero,
            u.pericia_informatica,
            r.dispositivo,
            r.tiempo,
            r.completada,
            r.comentarios,
            r.propuestas,
            r.valoracion,
            r.nota,
            o.comentarios AS observaciones
            FROM usuario u
            LEFT JOIN resultado r ON u.id = r.id_usuario
            LEFT JOIN observacion o ON u.id = o.id_usuario
            ORDER BY u.id";

        $result = $this->db->query($sql);

        while ($row = $result->fetch_assoc()) {
            fputcsv($file, $row);
        }

        fclose($file);

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

    public function importarCSV($rutaArchivo)
    {
        if (!$this->connection || !file_exists($rutaArchivo)) {
            return false;
        }

        $file = fopen($rutaArchivo, "r");

        $cabecera = fgetcsv($file);
        if ($cabecera === false) {
            fclose($file);
            return false;
        }

        while (($fila = fgetcsv($file)) !== false) {

            [
                $id,
                $profesion,
                $edad,
                $genero,
                $pericia,
                $dispositivo,
                $tiempo,
                $completada,
                $comentariosResultado,
                $propuestas,
                $valoracion,
                $nota,
                $observaciones
            ] = $fila;

            $sqlUsuario = "
            INSERT INTO usuario (id, profesion, edad, genero, pericia_informatica)
            VALUES (?, ?, ?, ?, ?)";

            $stmt = $this->db->prepare($sqlUsuario);
            $stmt->bind_param("isisi", $id, $profesion, $edad, $genero, $pericia);
            $stmt->execute();
            $stmt->close();

            $sqlResultado = "
            INSERT INTO resultado 
            (id_usuario, dispositivo, tiempo, completada, comentarios, propuestas, valoracion, nota)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

            $stmt = $this->db->prepare($sqlResultado);
            $stmt->bind_param(
                "isiissii",
                $id,
                $dispositivo,
                $tiempo,
                $completada,
                $comentariosResultado,
                $propuestas,
                $valoracion,
                $nota
            );
            $stmt->execute();
            $stmt->close();

            if (!empty($observaciones)) {
                $sqlObs = "
                INSERT INTO observacion (id_usuario, comentarios)
                VALUES (?, ?)";
                $stmt = $this->db->prepare($sqlObs);
                $stmt->bind_param("is", $id, $observaciones);
                $stmt->execute();
                $stmt->close();
            }
        }

        fclose($file);
        return true;
    }

}

?>