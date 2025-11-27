# xml2altimetria.py
# # -*- coding: utf-8 -*-
""""
Transforma el xml en altimetría

@version 1.0 25/Octubre/2025
@author: Gabriel García Martínez
"""

import xml.etree.ElementTree as ET

class Svg(object):
    """
    Transforma el xml en altimetría

    @version 1.0 25/Octubre/2025
    @author: Gabriel García Martínez
    """
    def __init__(self):
        """
        Crea el elemento raíz, el espacio de nombres y la versión
        """
        self.raiz = ET.Element('svg', xmlns="http://www.w3.org/2000/svg", version="2.0")


    def addRect(self,x,y,width,height,fill, strokeWidth,stroke):
        """
        Añade un elemento rect
        """
        ET.SubElement(self.raiz,'rect',
                      x=x,
                      y=y,
                      width=width,
                      height=height,
                      fill=fill, 
                      strokeWidth=strokeWidth,
                      stroke=stroke)
        
    def addCircle(self,cx,cy,r,fill):
        """
        Añade un elemento circle
        """
        ET.SubElement(self.raiz,'circle',
                      cx=cx,
                      cy=cy,
                      r=r,
                      fill=fill)
        
    def addLine(self,x1,y1,x2,y2,stroke,strokeWith):
        """
        Añade un elemento line
        """
        ET.SubElement(self.raiz,'line',
                      x1=x1,
                      y1=y1,
                      x2=x2,
                      y2=y2,
                      stroke=stroke,
                      strokeWith=strokeWith)

    def addPolyline(self,points,stroke,strokeWith,fill):
        """
        Añade un elemento polyline
        """
        ET.SubElement(self.raiz,'polyline',
                      points=points,
                      stroke=stroke,
                      strokeWith=strokeWith,
                      fill=fill)
        
    def addText(self,texto,x,y,fontFamily,fontSize,style):
        """
        Añade un elemento texto
        """
        ET.SubElement(self.raiz,'text',
                      x=x,
                      y=y,
                      fontFamily=fontFamily,
                      fontSize=fontSize,
                      style=style).text=texto

    def escribir(self,nombreArchivoSVG):
        """ de
        Escribe el archivo SVG con declaración y codificación
        """
        arbol = ET.ElementTree(self.raiz)
        
        """
        Introduce indentacióon y saltos de línea
        para generar XML en modo texto
        """
        ET.indent(arbol)
        
        arbol.write(nombreArchivoSVG, 
                    encoding='utf-8', 
                    xml_declaration=True
                    )
    
    def ver(self):
        """
        Muestra el archivo SVG. Se utiliza para depurar
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

def generaSVG(archivoXML):
    
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
    tramos = root.findall('.//ns:tramo', namespace)
    puntos_svg = []
    distanciaTotal = 0
    escala_x = 0.05
    escala_y = 7
    max_altitud = 20
    puntos_string = ""

    for tramo in tramos:
        distancia_punto = float(tramo.get('distancia', '0').strip())
        distanciaTotal += distancia_punto

        punto = tramo.find('ns:punto', namespace)
        altitudPunto = float(punto.find('ns:altitud', namespace).text.strip()) 
        x = distanciaTotal * escala_x
        y = (max_altitud - altitudPunto) * escala_y   # invertir eje Y del SVG
        puntos_svg.append((x, y))

    for x, y in puntos_svg:
        puntos_string += ("{0},{1} ".format(x, y))
        
    baseAltura = max(y for x, y in puntos_svg) + 7
    xMin = int(puntos_svg[0][0])
    xMax = int(puntos_svg[-1][0])
    puntos_string += f"{xMax},{baseAltura} {xMin},{baseAltura} {xMin},{int(puntos_svg[0][1])}"

    altimetriaSvg = Svg()
    altimetriaSvg.addPolyline(puntos_string.strip(), 
                               stroke="blue", 
                               strokeWith="5", 
                               fill="#FF0000")
    altimetriaSvg.escribir("altimetria.svg")
    print("altimetria.svg generado correctamente")

def main():
    generaSVG("circuitoEsquema.xml")
    
if __name__ == "__main__":
    main()    
