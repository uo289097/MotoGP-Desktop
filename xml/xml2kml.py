# xml2kml.py
# # -*- coding: utf-8 -*-
""""
Crea archivos KML con puntos y líneas

@version 1.0 25/Octubre/2025
@author: Gabriel García Martínez
"""

import xml.etree.ElementTree as ET

class Kml(object):
    """
    Genera archivo KML con puntos y líneas
    @version 1.0 25/Octubre/2025
    @author: Gabriel García Martínez
    """
    def __init__(self):
        """
        Crea el elemento raíz y el espacio de nombres
        """
        self.raiz = ET.Element('kml', xmlns="http://www.opengis.net/kml/2.2")
        self.doc = ET.SubElement(self.raiz,'Document')

    def addPlacemark(self,nombre,descripcion,long,lat,alt, modoAltitud):
        """
        Añade un elemento <Placemark> con puntos <Point>
        """
        pm = ET.SubElement(self.doc,'Placemark')
        ET.SubElement(pm,'name').text = nombre
        ET.SubElement(pm,'description').text = descripcion
        punto = ET.SubElement(pm,'Point')
        ET.SubElement(punto,'coordinates').text = '{},{},{}'.format(long,lat,alt)
        ET.SubElement(punto,'altitudeMode').text = modoAltitud

    def addLineString(self,nombre,extrude,tesela, listaCoordenadas, modoAltitud, color, ancho):
        """
        Añade un elemento <Placemark> con líneas <LineString>
        """
        ET.SubElement(self.doc,'name').text = nombre
        pm = ET.SubElement(self.doc,'Placemark')
        ls = ET.SubElement(pm, 'LineString')
        ET.SubElement(ls,'extrude').text = extrude
        ET.SubElement(ls,'tessellation').text = tesela
        ET.SubElement(ls,'coordinates').text = listaCoordenadas
        ET.SubElement(ls,'altitudeMode').text = modoAltitud

        estilo = ET.SubElement(pm, 'Style')
        linea = ET.SubElement(estilo, 'LineStyle')
        ET.SubElement (linea, 'color').text = color
        ET.SubElement (linea, 'width').text = ancho

    def escribir(self,nombreArchivoKML):
        """
        Escribe el archivo KML con declaración y codificación
        """
        arbol = ET.ElementTree(self.raiz)
        """
        Introduce indentacióon y saltos de línea
        para generar XML en modo texto
        """
        ET.indent(arbol)
        arbol.write(nombreArchivoKML, encoding='utf-8', xml_declaration=True)

    def ver(self):
        """
        Muestra el archivo KML. Se utiliza para depurar
        """
        print("\nElemento raiz = ", self.raiz.tag)

        if self.raiz.text != None:
            print("Contenido = "    , self.raiz.text.strip('\n')) #strip() elimina los '\n' del string
        else:
            print("Contenido = "    , self.raiz.text)

        print("Atributos = "    , self.raiz.attrib)

        # Recorrido de los elementos del árbol
        for hijo in self.raiz.findall('.//'): # Expresión XPath
            print("\nElemento = " , hijo.tag)
            if hijo.text != None:
                print("Contenido = ", hijo.text.strip('\n')) #strip() elimina los '\n' del string
            else:
                print("Contenido = ", hijo.text)    
            print("Atributos = ", hijo.attrib)

def generaKML(archivoXML):

    try:
        tree = ET.parse(archivoXML)
    except IOError:
        print ("Archivo {} no encontrado".format(archivoXML))
        exit()
    except ET.ParseError:
        print("Error procesando el archivo: ", archivoXML)
        exit()

    root = tree.getroot()
    namespace = {'ns': 'http://www.uniovi.es'}
    puntos = root.findall('.//ns:punto', namespace)
    kml_coordenadas = ''

    for punto in puntos:
        latitud = punto.find('ns:latitud', namespace).text
        longitud = punto.find('ns:longitud', namespace).text
        altitud = punto.find('ns:altitud', namespace).text
        kml_coordenadas += ("{0},{1},{2}\n".format(longitud, latitud, altitud))
    
    kml = Kml()
    kml.addLineString(
        nombre='Mandalika',
        extrude='1',
        tesela='1',
        listaCoordenadas = kml_coordenadas.strip(),
        modoAltitud='absolute',
        color='ff0000ff',
        ancho='5')
    
    kml.escribir('circuito.kml')
    print('circuito.kml generado correctamente')

def main():
    generaKML('circuitoEsquema.xml')

if __name__ == "__main__":
    main()
