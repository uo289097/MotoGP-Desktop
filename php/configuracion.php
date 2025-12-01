<?php
class Configuracion
{
    private $servername = "localhost";
    private $username = "DBUSER2025";
    private $password = "DBPSWD2025";
    private $database = "UO289097_db";
    private $db;
    private $connection;

    public function __construct()
    {
        $this->db = new mysqli(
            $this->servername,
            $this->username,
            $this->password,
            $this->database
        );
        if ($this->db->connect_errno) {
            $this->connection = false;
        } else {
            $this->connection = true;
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
        } else {
            die("Conexión fallida");
        }
    }

    public function eliminar()
    {
        $this->db->execute_query("DROP DATABASE UO289097_DB");
    }

    public function exportar()
    {

    }

    public function cargarInicial()
    {

    }
}

?>