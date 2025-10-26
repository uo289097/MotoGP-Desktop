
import xml.etree.ElementTree as ET

class Html():
    """
    Genera archivo HTML con encabezados, párrafos
    @version 1.0 26/Octubre/2025
    @autor: Gabriel García Martínez
    """
    def __init__(self, title, css):
        self.raiz = ET.Element('html')
        self.head = ET.SubElement(self.raiz, 'head')
        ET.SubElement(self.head, 'meta', charset="utf-8")
        ET.SubElement(self.head, 'title').text = title     
        ET.SubElement(self.head, 'link', rel="stylesheet", href=css)
        self.body = ET.SubElement(self.raiz, 'body')

    def addHeading(self, texto, nivel=1):
        """
        Añade un encabezado <h1>, <h2>, etc.
        """
        if nivel < 1:
            nivel = 1
        if nivel > 6:
            nivel = 6
        ET.SubElement(self.body, f'h{nivel}').text = texto
    
    def addParagraph(self, texto):
        """
        Añade un párrafo <p>
        """
        ET.SubElement(self.body, 'p').text = texto

    def addImage(self, src, alt):
        ET.SubElement(self.body, 'img', attrib={'src': src, 'alt': alt, 'style': 'max-width:100%; height:auto;'})

    def addVideo(self, src, alt):
        figura = ET.SubElement(self.body, 'figure')
        video = ET.SubElement(figura, 'video', attrib={
            'src': src,
            'controls': 'controls',
            'style': 'max-width:100%; height:auto;'
        })
        ET.SubElement(figura, 'figcaption').text = alt

    def addLink(self, texto, url):
        """
        Añade un enlace <a>
        """
        enlace = ET.SubElement(self.body, 'a', href=url)
        enlace.text = texto
    
    def ver(self):
        """
        Muestra la estructura del archivo HTML (para depurar)
        """
        print("\nElemento raíz =", self.raiz.tag)

        if self.raiz.text:
            print("Contenido =", self.raiz.text.strip('\n'))
        else:
            print("Contenido =", self.raiz.text)

        print("Atributos =", self.raiz.attrib)

        for hijo in self.raiz.findall('.//'):
            print("\nElemento =", hijo.tag)
            if hijo.text:
                print("Contenido =", hijo.text.strip('\n'))
            else:
                print("Contenido =", hijo.text)
            print("Atributos =", hijo.attrib)

    def escribir(self, nombreArchivoHTML):
        """
        Escribe el archivo HTML con indentación
        """
        arbol = ET.ElementTree(self.raiz)
        ET.indent(arbol)
        arbol.write(nombreArchivoHTML, encoding='utf-8', method='html')

    def ver(self):
        """
        Muestra la estructura del archivo HTML (para depurar)
        """
        print("\nElemento raíz =", self.raiz.tag)

        if self.raiz.text:
            print("Contenido =", self.raiz.text.strip('\n'))
        else:
            print("Contenido =", self.raiz.text)

        print("Atributos =", self.raiz.attrib)

        for hijo in self.raiz.findall('.//'):
            print("\nElemento =", hijo.tag)
            if hijo.text:
                print("Contenido =", hijo.text.strip('\n'))
            else:
                print("Contenido =", hijo.text)
            print("Atributos =", hijo.attrib)

def generaHTML(archivoXML):
    try:
        tree = ET.parse(archivoXML)
    except IOError:
        print(f"Archivo {archivoXML} no encontrado.")
        exit()
    except ET.ParseError:
        print(f"Error procesando el archivo: {archivoXML}")
        exit()

    root = tree.getroot()
    ns = {'ns': 'http://www.uniovi.es'}

    # Crear objeto HTML
    html = Html("Información del Circuito", "estilo.css")

    # Extraer información con XPath
    nombre = root.find('.//ns:nombre', ns).text
    longitud = root.find('.//ns:longitudTotal', ns).text
    unidad_long = root.find('.//ns:longitudTotal', ns).get('unidad')
    anchura = root.find('.//ns:anchura', ns).text
    unidad_anch = root.find('.//ns:anchura', ns).get('unidad')
    fecha = root.find('.//ns:fecha', ns).text
    vueltas = root.find('.//ns:vueltas', ns).text
    localidad = root.find('.//ns:localidad', ns).text
    pais = root.find('.//ns:pais', ns).text
    patrocinador = root.find('.//ns:patrocinador', ns).text
    vencedor = root.find('.//ns:vencedor', ns).text
    duracion = root.find('.//ns:vencedor', ns).get('duracion')

    html.addHeading(nombre, 1)
    html.addParagraph(f"Ubicación: {localidad}, {pais}")
    html.addParagraph(f"Longitud total: {longitud} {unidad_long}")
    html.addParagraph(f"Anchura: {anchura} {unidad_anch}")
    html.addParagraph(f"Número de vueltas: {vueltas}")
    html.addParagraph(f"Patrocinador: {patrocinador}")
    html.addParagraph(f"Fecha del evento: {fecha}")
    html.addParagraph(f"Vencedor: {vencedor} (Duración: {duracion})")

    # Referencias (enlaces)
    html.addHeading("Referencias", 2)
    referencias = root.findall('.//ns:referencia', ns)
    for ref in referencias:
        html.addLink(ref.text.strip(), ref.get('alt'))
        html.addParagraph("")  # salto visual

    # Fotografías
    html.addHeading("Galería de imágenes", 2)
    fotos = root.findall('.//ns:fotografia', ns)
    for f in fotos:
        html.addImage(f.text.strip(), f.get('alt'))

    # Videos
    html.addHeading("Videos del circuito", 2)
    videos = root.findall('.//ns:video', ns)
    for v in videos:
        html.addVideo(v.text.strip(), v.get('alt'))

    # Clasificación
    html.addHeading("Clasificación", 2)
    pilotos = root.findall('.//ns:piloto', ns)
    for p in pilotos:
        pos = p.get('posicion')
        puntos = p.get('puntos')
        nombre_piloto = p.text
        html.addParagraph(f"{pos}º - {nombre_piloto} ({puntos} puntos)")

    html.escribir("InfoCircuito.html")
    print("infoCircuito.html generado correctamente")

def main():
    generaHTML("circuitoEsquema.xml")
    
if __name__ == "__main__":
    main()   