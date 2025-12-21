<?php
class Cronometro
{

    private $tiempo;
    private $inicio;

    public function __construct()
    {
        $this->tiempo = 0;
    }

    public function arrancar()
    {
        $this->inicio = microtime(true);
    }

    public function parar()
    {
        $actual = microtime(true);
        $this->tiempo = $actual - $this->inicio;
    }

    public function mostrar()
    {
        $totalSegundos = $this->tiempo;

        $minutos = floor($totalSegundos / 60);

        $segundos = $totalSegundos - ($minutos * 60);

        return sprintf("%02d:%04.1f", $minutos, $segundos);
    }

    public function getTiempo()
    {
        return $this->tiempo;
    }
}
?>