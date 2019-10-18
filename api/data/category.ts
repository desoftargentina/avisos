import { IconName } from '../utils/icons';

export interface Subcategory {id: number; name: string; category: number; }
export interface Category {id: number; name: string; icon: IconName; childs: number[]; }
export const category_list: {[key: number]: Category} = {1: {'id': 1, 'name': 'Automotor', 'icon': 'car', 'childs': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}, 2: {'id': 2, 'name': 'Inmuebles', 'icon': 'home', 'childs': [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]}, 3: {'id': 3, 'name': 'Empleos', 'icon': 'briefcase', 'childs': [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44]}, 4: {'id': 4, 'name': 'Servicios', 'icon': 'tools', 'childs': [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62]}, 5: {'id': 5, 'name': 'Alimentos y Bebidas', 'icon': 'cocktail', 'childs': [63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73]}, 6: {'id': 6, 'name': 'Animales y Mascotas', 'icon': 'paw', 'childs': [74, 75, 76, 77, 78, 79, 80, 81, 82, 83]}, 7: {'id': 7, 'name': 'Arte y Artesanías', 'icon': 'pencil-ruler', 'childs': [84, 85, 86, 87, 88, 89]}, 8: {'id': 8, 'name': 'Bebés', 'icon': 'baby', 'childs': [90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108]}, 9: {'id': 9, 'name': 'Cámaras y Accesorios', 'icon': 'camera', 'childs': [109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120]}, 10: {'id': 10, 'name': 'Celulares y Teléfonos', 'icon': 'mobile-alt', 'childs': [121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133]}, 11: {'id': 11, 'name': 'Coleccionables y Entretenimiento', 'icon': 'cubes', 'childs': [134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150]}, 12: {'id': 12, 'name': 'Computación', 'icon': 'desktop', 'childs': [151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172]}, 13: {'id': 13, 'name': 'Consolas y Videojuegos', 'icon': 'gamepad', 'childs': [173, 174, 175, 176, 177, 178, 179, 180]}, 14: {'id': 14, 'name': 'Construcción', 'icon': 'hard-hat', 'childs': [181, 182, 183, 184]}, 15: {'id': 15, 'name': 'Deportes y Fitness', 'icon': 'dumbbell', 'childs': [185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215]}, 16: {'id': 16, 'name': 'Electrónica', 'icon': 'microchip', 'childs': [216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246]}, 17: {'id': 17, 'name': 'Entradas para Eventos', 'icon': 'ticket-alt', 'childs': [247, 248, 249, 250, 251]}, 18: {'id': 18, 'name': 'Hogar, Muebles y Jardín', 'icon': 'chair', 'childs': [252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263]}, 19: {'id': 19, 'name': 'Industrias y Oficinas', 'icon': 'building', 'childs': [264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277]}, 20: {'id': 20, 'name': 'Instrumentos Musicales', 'icon': 'guitar', 'childs': [278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290]}, 21: {'id': 21, 'name': 'Joyas y Relojes', 'icon': 'gem', 'childs': [291, 292, 293, 294, 295, 296, 297, 298, 299, 300]}, 22: {'id': 22, 'name': 'Juegos y Juguetes', 'icon': 'chess', 'childs': [301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314, 315, 316, 317, 318]}, 23: {'id': 23, 'name': 'Libros, Revistas y Comics', 'icon': 'book', 'childs': [319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342, 343]}, 24: {'id': 24, 'name': 'Música, Películas y Series', 'icon': 'film', 'childs': [344, 345, 346, 347, 348]}, 25: {'id': 25, 'name': 'Reliquias Antiguas', 'icon': 'hourglass', 'childs': [349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370, 371, 372, 373, 374, 375, 376, 377, 378]}, 26: {'id': 26, 'name': 'Ropa y Accesorios', 'icon': 'tshirt', 'childs': [379, 380, 381, 382, 383, 384, 385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 396, 397]}, 27: {'id': 27, 'name': 'Salud y Belleza', 'icon': 'heartbeat', 'childs': [398, 399, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409]}, 28: {'id': 28, 'name': 'Otras Categorías', 'icon': 'th-large', 'childs': [410, 411]}};
export const subcategory_list: {[key: number]: Subcategory} = {1: {'id': 1, 'name': 'Autos de Colección', 'category': 1}, 2: {'id': 2, 'name': 'Autos y Camionetas', 'category': 1}, 3: {'id': 3, 'name': 'Camiones', 'category': 1}, 4: {'id': 4, 'name': 'Colectivos', 'category': 1}, 5: {'id': 5, 'name': 'GPS', 'category': 1}, 6: {'id': 6, 'name': 'Motorhomes', 'category': 1}, 7: {'id': 7, 'name': 'Motos', 'category': 1}, 8: {'id': 8, 'name': 'Náutica', 'category': 1}, 9: {'id': 9, 'name': 'Otros', 'category': 1}, 10: {'id': 10, 'name': 'Planes de Ahorro', 'category': 1}, 11: {'id': 11, 'name': 'Semirremolques', 'category': 1}, 12: {'id': 12, 'name': 'Vehiculos Pesados', 'category': 1}, 13: {'id': 13, 'name': 'Camas Náuticas', 'category': 2}, 14: {'id': 14, 'name': 'Campos', 'category': 2}, 15: {'id': 15, 'name': 'Casas', 'category': 2}, 16: {'id': 16, 'name': 'Cocheras', 'category': 2}, 17: {'id': 17, 'name': 'Departamentos', 'category': 2}, 18: {'id': 18, 'name': 'Galpones y Depósitos', 'category': 2}, 19: {'id': 19, 'name': 'Locales comerciales', 'category': 2}, 20: {'id': 20, 'name': 'Oficinas y Consultorios', 'category': 2}, 21: {'id': 21, 'name': 'Parcelas, Nichos y Bóvedas', 'category': 2}, 22: {'id': 22, 'name': 'Quintas y Casas de fin de semana', 'category': 2}, 23: {'id': 23, 'name': 'Terrenos y Lotes', 'category': 2}, 24: {'id': 24, 'name': 'Administración/Contabilidad', 'category': 3}, 25: {'id': 25, 'name': 'Agropecuarios', 'category': 3}, 26: {'id': 26, 'name': 'Arquitectura/Construcción', 'category': 3}, 27: {'id': 27, 'name': 'Deportes', 'category': 3}, 28: {'id': 28, 'name': 'Educación', 'category': 3}, 29: {'id': 29, 'name': 'Emprendedores', 'category': 3}, 30: {'id': 30, 'name': 'Estética', 'category': 3}, 31: {'id': 31, 'name': 'Gastronomía', 'category': 3}, 32: {'id': 32, 'name': 'Informática / Telecomunicaciones', 'category': 3}, 33: {'id': 33, 'name': 'Ingeniería', 'category': 3}, 34: {'id': 34, 'name': 'Manufactura', 'category': 3}, 35: {'id': 35, 'name': 'Marketing', 'category': 3}, 36: {'id': 36, 'name': 'Oficios', 'category': 3}, 37: {'id': 37, 'name': 'Otros', 'category': 3}, 38: {'id': 38, 'name': 'Recursos humanos', 'category': 3}, 39: {'id': 39, 'name': 'Salud', 'category': 3}, 40: {'id': 40, 'name': 'Seguridad', 'category': 3}, 41: {'id': 41, 'name': 'Servicios', 'category': 3}, 42: {'id': 42, 'name': 'Tecnología', 'category': 3}, 43: {'id': 43, 'name': 'Transporte', 'category': 3}, 44: {'id': 44, 'name': 'Turismo', 'category': 3}, 45: {'id': 45, 'name': 'Arte, Música y Cine', 'category': 4}, 46: {'id': 46, 'name': 'Belleza y Cuidado Personal', 'category': 4}, 47: {'id': 47, 'name': 'Cursos y Clases', 'category': 4}, 48: {'id': 48, 'name': 'Delivery', 'category': 4}, 49: {'id': 49, 'name': 'Fiestas y Eventos', 'category': 4}, 50: {'id': 50, 'name': 'Hogar', 'category': 4}, 51: {'id': 51, 'name': 'Imprenta', 'category': 4}, 52: {'id': 52, 'name': 'Mantenimiento de Vehículos', 'category': 4}, 53: {'id': 53, 'name': 'Medicina y Salud', 'category': 4}, 54: {'id': 54, 'name': 'Oficios', 'category': 4}, 55: {'id': 55, 'name': 'Otros Servicios', 'category': 4}, 56: {'id': 56, 'name': 'Profesionales', 'category': 4}, 57: {'id': 57, 'name': 'Ropa y Moda', 'category': 4}, 58: {'id': 58, 'name': 'Servicio Técnico', 'category': 4}, 59: {'id': 59, 'name': 'Servicios para Mascotas', 'category': 4}, 60: {'id': 60, 'name': 'Servicios para Oficinas', 'category': 4}, 61: {'id': 61, 'name': 'Transporte', 'category': 4}, 62: {'id': 62, 'name': 'Viajes y Turismo', 'category': 4}, 63: {'id': 63, 'name': 'Accesorios', 'category': 5}, 64: {'id': 64, 'name': 'Bebidas Aperitivos', 'category': 5}, 65: {'id': 65, 'name': 'Bebidas Blancas', 'category': 5}, 66: {'id': 66, 'name': 'Bebidas sin Alcohol', 'category': 5}, 67: {'id': 67, 'name': 'Cervezas', 'category': 5}, 68: {'id': 68, 'name': 'Champagnes', 'category': 5}, 69: {'id': 69, 'name': 'Comestibles', 'category': 5}, 70: {'id': 70, 'name': 'Licores', 'category': 5}, 71: {'id': 71, 'name': 'Otros', 'category': 5}, 72: {'id': 72, 'name': 'Vinos', 'category': 5}, 73: {'id': 73, 'name': 'Whiskies', 'category': 5}, 74: {'id': 74, 'name': 'Aves', 'category': 6}, 75: {'id': 75, 'name': 'Caballos', 'category': 6}, 76: {'id': 76, 'name': 'Conejos', 'category': 6}, 77: {'id': 77, 'name': 'Gatos', 'category': 6}, 78: {'id': 78, 'name': 'Libro de Animales', 'category': 6}, 79: {'id': 79, 'name': 'Otros', 'category': 6}, 80: {'id': 80, 'name': 'Peces', 'category': 6}, 81: {'id': 81, 'name': 'Perros', 'category': 6}, 82: {'id': 82, 'name': 'Reptiles y Anfibios', 'category': 6}, 83: {'id': 83, 'name': 'Roedores', 'category': 6}, 84: {'id': 84, 'name': 'Arte', 'category': 7}, 85: {'id': 85, 'name': 'Artesanías', 'category': 7}, 86: {'id': 86, 'name': 'Esculturas', 'category': 7}, 87: {'id': 87, 'name': 'Materiales para Tatuajes', 'category': 7}, 88: {'id': 88, 'name': 'Otros', 'category': 7}, 89: {'id': 89, 'name': 'Souvenirs', 'category': 7}, 90: {'id': 90, 'name': 'Alimentación para Bebés', 'category': 8}, 91: {'id': 91, 'name': 'Andadores y Caminadores', 'category': 8}, 92: {'id': 92, 'name': 'Arneses para Autos', 'category': 8}, 93: {'id': 93, 'name': 'Artículos de Bebés para Baño', 'category': 8}, 94: {'id': 94, 'name': 'Artículos para Embarazadas', 'category': 8}, 95: {'id': 95, 'name': 'Artículos para Embarazadas', 'category': 8}, 96: {'id': 96, 'name': 'Artículos para la Salud', 'category': 8}, 97: {'id': 97, 'name': 'Cochecitos para Bebés', 'category': 8}, 98: {'id': 98, 'name': 'Corralitos', 'category': 8}, 99: {'id': 99, 'name': 'Cuarto de Bebé', 'category': 8}, 100: {'id': 100, 'name': 'Huevitos y Sillitas para Autos', 'category': 8}, 101: {'id': 101, 'name': 'Juguetes para Bebés', 'category': 8}, 102: {'id': 102, 'name': 'Pañales y Pañaleras', 'category': 8}, 103: {'id': 103, 'name': 'Pañales y Pañaleras', 'category': 8}, 104: {'id': 104, 'name': 'Recuerdos', 'category': 8}, 105: {'id': 105, 'name': 'Ropa para Bebés', 'category': 8}, 106: {'id': 106, 'name': 'Seguridad para Bebés', 'category': 8}, 107: {'id': 107, 'name': 'Sillas de Comer', 'category': 8}, 108: {'id': 108, 'name': 'Triciclos y Kartings', 'category': 8}, 109: {'id': 109, 'name': 'Accesorios para Cámaras', 'category': 9}, 110: {'id': 110, 'name': 'Accesorios para Cámaras', 'category': 9}, 111: {'id': 111, 'name': 'Baterías, Pilas y Cargadores', 'category': 9}, 112: {'id': 112, 'name': 'Cámaras Analógicas y Polaroid', 'category': 9}, 113: {'id': 113, 'name': 'Cámaras Digitales', 'category': 9}, 114: {'id': 114, 'name': 'Filmadoras', 'category': 9}, 115: {'id': 115, 'name': 'Laboratorios y Mini Labs', 'category': 9}, 116: {'id': 116, 'name': 'Lentes', 'category': 9}, 117: {'id': 117, 'name': 'Memorias', 'category': 9}, 118: {'id': 118, 'name': 'Otros', 'category': 9}, 119: {'id': 119, 'name': 'Portarretratos y Álbumes', 'category': 9}, 120: {'id': 120, 'name': 'Telescopios y Binoculares', 'category': 9}, 121: {'id': 121, 'name': 'Accesorios para Celulares', 'category': 10}, 122: {'id': 122, 'name': 'Cámaras y Accesorios', 'category': 10}, 123: {'id': 123, 'name': 'Celulares y Smartphones', 'category': 10}, 124: {'id': 124, 'name': 'Centrales Telefónicas', 'category': 10}, 125: {'id': 125, 'name': 'Fax', 'category': 10}, 126: {'id': 126, 'name': 'Handies', 'category': 10}, 127: {'id': 127, 'name': 'Nextel', 'category': 10}, 128: {'id': 128, 'name': 'Otros', 'category': 10}, 129: {'id': 129, 'name': 'Radiofrecuencia', 'category': 10}, 130: {'id': 130, 'name': 'Repuestos de Celulares', 'category': 10}, 131: {'id': 131, 'name': 'Tarifadores y Cabinas', 'category': 10}, 132: {'id': 132, 'name': 'Telefonía Fija e Inalámbrica', 'category': 10}, 133: {'id': 133, 'name': 'Telefonía IP', 'category': 10}, 134: {'id': 134, 'name': 'Cartas - R.P.G.', 'category': 11}, 135: {'id': 135, 'name': 'Cigarrillos y Afines', 'category': 11}, 136: {'id': 136, 'name': 'Coleccionables de Coca-Cola', 'category': 11}, 137: {'id': 137, 'name': 'Colecciones Diversas', 'category': 11}, 138: {'id': 138, 'name': 'Comics', 'category': 11}, 139: {'id': 139, 'name': 'Figuritas, Álbumes y Cromos', 'category': 11}, 140: {'id': 140, 'name': 'Filatelia', 'category': 11}, 141: {'id': 141, 'name': 'Lapiceras, Plumas y Bolígrafos', 'category': 11}, 142: {'id': 142, 'name': 'Latas, Botellas y Afines', 'category': 11}, 143: {'id': 143, 'name': 'Militaría y Afines', 'category': 11}, 144: {'id': 144, 'name': 'Modelismo', 'category': 11}, 145: {'id': 145, 'name': 'Monedas y Billetes', 'category': 11}, 146: {'id': 146, 'name': 'Muñecos', 'category': 11}, 147: {'id': 147, 'name': 'Otros', 'category': 11}, 148: {'id': 148, 'name': 'Posters, Carteles y Fotos', 'category': 11}, 149: {'id': 149, 'name': 'Tarjetas Coleccionables', 'category': 11}, 150: {'id': 150, 'name': 'Vehículos en Miniatura', 'category': 11}, 151: {'id': 151, 'name': 'All In One', 'category': 12}, 152: {'id': 152, 'name': 'Apple', 'category': 12}, 153: {'id': 153, 'name': 'CDs y DVDs Vírgenes', 'category': 12}, 154: {'id': 154, 'name': 'Componentes de PC', 'category': 12}, 155: {'id': 155, 'name': 'Fuentes, UPS y Estabilizadores', 'category': 12}, 156: {'id': 156, 'name': 'Impresoras y Accesorios', 'category': 12}, 157: {'id': 157, 'name': 'Lectores y Scanners', 'category': 12}, 158: {'id': 158, 'name': 'Memorias RAM', 'category': 12}, 159: {'id': 159, 'name': 'Monitores', 'category': 12}, 160: {'id': 160, 'name': 'Netbooks y Accesorios', 'category': 12}, 161: {'id': 161, 'name': 'Notebooks y Accesorios', 'category': 12}, 162: {'id': 162, 'name': 'Otros', 'category': 12}, 163: {'id': 163, 'name': 'Palms y Handhelds', 'category': 12}, 164: {'id': 164, 'name': 'PC', 'category': 12}, 165: {'id': 165, 'name': 'Pen Drives', 'category': 12}, 166: {'id': 166, 'name': 'Periféricos de PC', 'category': 12}, 167: {'id': 167, 'name': 'Procesadores', 'category': 12}, 168: {'id': 168, 'name': 'Proyectores y Pantallas', 'category': 12}, 169: {'id': 169, 'name': 'Redes', 'category': 12}, 170: {'id': 170, 'name': 'Software', 'category': 12}, 171: {'id': 171, 'name': 'Tablets y Accesorios', 'category': 12}, 172: {'id': 172, 'name': 'Ultrabooks', 'category': 12}, 173: {'id': 173, 'name': 'Disney Infinity', 'category': 13}, 174: {'id': 174, 'name': 'Flippers y Arcade', 'category': 13}, 175: {'id': 175, 'name': 'Nintendo', 'category': 13}, 176: {'id': 176, 'name': 'Otras Marcas', 'category': 13}, 177: {'id': 177, 'name': 'PlayStation', 'category': 13}, 178: {'id': 178, 'name': 'SEGA', 'category': 13}, 179: {'id': 179, 'name': 'Videojuegos', 'category': 13}, 180: {'id': 180, 'name': 'Xbox', 'category': 13}, 181: {'id': 181, 'name': 'Componentes Eléctricos', 'category': 14}, 182: {'id': 182, 'name': 'Construcción', 'category': 14}, 183: {'id': 183, 'name': 'Herramientas', 'category': 14}, 184: {'id': 184, 'name': 'Otros', 'category': 14}, 185: {'id': 185, 'name': 'Aerobics y Fitness', 'category': 15}, 186: {'id': 186, 'name': 'Artes Marciales y Boxeo', 'category': 15}, 187: {'id': 187, 'name': 'Básquet', 'category': 15}, 188: {'id': 188, 'name': 'Bicicletas y Ciclismo', 'category': 15}, 189: {'id': 189, 'name': 'Camping', 'category': 15}, 190: {'id': 190, 'name': 'Deportes Acuáticos', 'category': 15}, 191: {'id': 191, 'name': 'Deportes Extremos', 'category': 15}, 192: {'id': 192, 'name': 'Entradas a Eventos Deportivos', 'category': 15}, 193: {'id': 193, 'name': 'Equitación y Polo', 'category': 15}, 194: {'id': 194, 'name': 'Fútbol', 'category': 15}, 195: {'id': 195, 'name': 'Fútbol Americano', 'category': 15}, 196: {'id': 196, 'name': 'Golf', 'category': 15}, 197: {'id': 197, 'name': 'Handball', 'category': 15}, 198: {'id': 198, 'name': 'Hockey', 'category': 15}, 199: {'id': 199, 'name': 'Juegos de Mesa', 'category': 15}, 200: {'id': 200, 'name': 'Juegos de Salón', 'category': 15}, 201: {'id': 201, 'name': 'Libros y Revistas de Deportes', 'category': 15}, 202: {'id': 202, 'name': 'Montañismo y Trekking', 'category': 15}, 203: {'id': 203, 'name': 'Natación', 'category': 15}, 204: {'id': 204, 'name': 'Otros', 'category': 15}, 205: {'id': 205, 'name': 'Patín, Gimnasia y Danza', 'category': 15}, 206: {'id': 206, 'name': 'Pesca', 'category': 15}, 207: {'id': 207, 'name': 'Pilates y Yoga', 'category': 15}, 208: {'id': 208, 'name': 'Pulsómetros y Cronómetros', 'category': 15}, 209: {'id': 209, 'name': 'Rugby', 'category': 15}, 210: {'id': 210, 'name': 'Ski y Snowboard', 'category': 15}, 211: {'id': 211, 'name': 'Softball y Beisbol', 'category': 15}, 212: {'id': 212, 'name': 'Suplementos Alimenticios', 'category': 15}, 213: {'id': 213, 'name': 'Tenis, Padel y Squash', 'category': 15}, 214: {'id': 214, 'name': 'Voley', 'category': 15}, 215: {'id': 215, 'name': 'Zapatillas', 'category': 15}, 216: {'id': 216, 'name': 'Accesorios para Audio y Video', 'category': 16}, 217: {'id': 217, 'name': 'Artefactos de Cuidado Personal', 'category': 16}, 218: {'id': 218, 'name': 'Artefactos para el Hogar', 'category': 16}, 219: {'id': 219, 'name': 'Audio / Video Profesional y DJ', 'category': 16}, 220: {'id': 220, 'name': 'Audio para el Hogar', 'category': 16}, 221: {'id': 221, 'name': 'Audio Portátil y Radios', 'category': 16}, 222: {'id': 222, 'name': 'Calculadoras y Agendas', 'category': 16}, 223: {'id': 223, 'name': 'Climatización', 'category': 16}, 224: {'id': 224, 'name': 'Cocción', 'category': 16}, 225: {'id': 225, 'name': 'Componentes Electrónicos', 'category': 16}, 226: {'id': 226, 'name': 'Dispensadores y Purificadores', 'category': 16}, 227: {'id': 227, 'name': 'Drones', 'category': 16}, 228: {'id': 228, 'name': 'Electrodomésticos de Cocina', 'category': 16}, 229: {'id': 229, 'name': 'Electrodomésticos y Aires Acondicionados', 'category': 16}, 230: {'id': 230, 'name': 'Electrónica, Audio y Video', 'category': 16}, 231: {'id': 231, 'name': 'Fotocopiadoras y Accesorios', 'category': 16}, 232: {'id': 232, 'name': 'GPS', 'category': 16}, 233: {'id': 233, 'name': 'Heladeras y Freezers', 'category': 16}, 234: {'id': 234, 'name': 'iPod', 'category': 16}, 235: {'id': 235, 'name': 'Lavarropas y Secarropas', 'category': 16}, 236: {'id': 236, 'name': 'MP3, MP4 y MP5 Players', 'category': 16}, 237: {'id': 237, 'name': 'Otros', 'category': 16}, 238: {'id': 238, 'name': 'Pilas, Cargadores y Baterías', 'category': 16}, 239: {'id': 239, 'name': 'Portarretratos Digitales', 'category': 16}, 240: {'id': 240, 'name': 'Proyectores y Pantallas', 'category': 16}, 241: {'id': 241, 'name': 'Reproductores de DVD y Video', 'category': 16}, 242: {'id': 242, 'name': 'Seguridad y Vigilancia - Hogar', 'category': 16}, 243: {'id': 243, 'name': 'Soportes', 'category': 16}, 244: {'id': 244, 'name': 'Tablets y Accesorios', 'category': 16}, 245: {'id': 245, 'name': 'Televisores', 'category': 16}, 246: {'id': 246, 'name': 'Termotanques y Calefones', 'category': 16}, 247: {'id': 247, 'name': 'Entradas de Colección', 'category': 17}, 248: {'id': 248, 'name': 'Eventos Deportivos', 'category': 17}, 249: {'id': 249, 'name': 'Otras Entradas', 'category': 17}, 250: {'id': 250, 'name': 'Recitales', 'category': 17}, 251: {'id': 251, 'name': 'Teatro', 'category': 17}, 252: {'id': 252, 'name': 'Baños', 'category': 18}, 253: {'id': 253, 'name': 'Cocina', 'category': 18}, 254: {'id': 254, 'name': 'Decoración para el Hogar', 'category': 18}, 255: {'id': 255, 'name': 'Dormitorio', 'category': 18}, 256: {'id': 256, 'name': 'Iluminación para el Hogar', 'category': 18}, 257: {'id': 257, 'name': 'Jardines y Exteriores', 'category': 18}, 258: {'id': 258, 'name': 'Lavadero y Limpieza', 'category': 18}, 259: {'id': 259, 'name': 'Muebles para Oficinas', 'category': 18}, 260: {'id': 260, 'name': 'Otros', 'category': 18}, 261: {'id': 261, 'name': 'Pisos, Paredes y Aberturas', 'category': 18}, 262: {'id': 262, 'name': 'Sala de Estar y Comedor', 'category': 18}, 263: {'id': 263, 'name': 'Seguridad para el Hogar', 'category': 18}, 264: {'id': 264, 'name': 'Agro', 'category': 19}, 265: {'id': 265, 'name': 'Arquitectura y Diseño', 'category': 19}, 266: {'id': 266, 'name': 'Balanzas', 'category': 19}, 267: {'id': 267, 'name': 'Embalajes', 'category': 19}, 268: {'id': 268, 'name': 'Equipamiento Comercial', 'category': 19}, 269: {'id': 269, 'name': 'Equipamiento Médico', 'category': 19}, 270: {'id': 270, 'name': 'Equipamiento para Oficinas', 'category': 19}, 271: {'id': 271, 'name': 'Industria Gastronómica', 'category': 19}, 272: {'id': 272, 'name': 'Industria Textil', 'category': 19}, 273: {'id': 273, 'name': 'Librería', 'category': 19}, 274: {'id': 274, 'name': 'Material de Promoción', 'category': 19}, 275: {'id': 275, 'name': 'Otros', 'category': 19}, 276: {'id': 276, 'name': 'Seguridad Industrial', 'category': 19}, 277: {'id': 277, 'name': 'Uniformes', 'category': 19}, 278: {'id': 278, 'name': 'Amplificadores', 'category': 20}, 279: {'id': 279, 'name': 'Bajos y Accesorios', 'category': 20}, 280: {'id': 280, 'name': 'Baterías y Percusión', 'category': 20}, 281: {'id': 281, 'name': 'Consolas de Sonido', 'category': 20}, 282: {'id': 282, 'name': 'Efectos de Sonido', 'category': 20}, 283: {'id': 283, 'name': 'Guitarras', 'category': 20}, 284: {'id': 284, 'name': 'Instrumentos de Cuerdas', 'category': 20}, 285: {'id': 285, 'name': 'Instrumentos de Viento', 'category': 20}, 286: {'id': 286, 'name': 'Micrófonos, Pies y Preamp', 'category': 20}, 287: {'id': 287, 'name': 'Otros', 'category': 20}, 288: {'id': 288, 'name': 'Parlantes', 'category': 20}, 289: {'id': 289, 'name': 'Partituras y Letras', 'category': 20}, 290: {'id': 290, 'name': 'Teclados y Pianos', 'category': 20}, 291: {'id': 291, 'name': 'Bijouterie', 'category': 21}, 292: {'id': 292, 'name': 'Insumos para Joyería', 'category': 21}, 293: {'id': 293, 'name': 'Joyas', 'category': 21}, 294: {'id': 294, 'name': 'Joyas Antiguas', 'category': 21}, 295: {'id': 295, 'name': 'Otros', 'category': 21}, 296: {'id': 296, 'name': 'Pulsómetros y Cronómetros', 'category': 21}, 297: {'id': 297, 'name': 'Relojes Antiguos', 'category': 21}, 298: {'id': 298, 'name': 'Relojes para el Hogar', 'category': 21}, 299: {'id': 299, 'name': 'Relojes Pulsera', 'category': 21}, 300: {'id': 300, 'name': 'Smartwatch', 'category': 21}, 301: {'id': 301, 'name': 'Armas de Juguete', 'category': 22}, 302: {'id': 302, 'name': 'Autos de Juguete', 'category': 22}, 303: {'id': 303, 'name': 'Cartas y Naipes', 'category': 22}, 304: {'id': 304, 'name': 'Disfraces y Cotillón', 'category': 22}, 305: {'id': 305, 'name': 'Figuras de Acción', 'category': 22}, 306: {'id': 306, 'name': 'Juegos', 'category': 22}, 307: {'id': 307, 'name': 'Juegos de Aire Libre y Agua', 'category': 22}, 308: {'id': 308, 'name': 'Juegos de Mesa', 'category': 22}, 309: {'id': 309, 'name': 'Juguetes', 'category': 22}, 310: {'id': 310, 'name': 'Modelismo', 'category': 22}, 311: {'id': 311, 'name': 'Muñecas', 'category': 22}, 312: {'id': 312, 'name': 'Muñecos y Accesorios', 'category': 22}, 313: {'id': 313, 'name': 'Otros', 'category': 22}, 314: {'id': 314, 'name': 'Películas Infantiles', 'category': 22}, 315: {'id': 315, 'name': 'Peloteros y Castillos', 'category': 22}, 316: {'id': 316, 'name': 'Soldados de Plomo', 'category': 22}, 317: {'id': 317, 'name': 'Vehículos en Miniatura', 'category': 22}, 318: {'id': 318, 'name': 'Vehículos para Niños', 'category': 22}, 319: {'id': 319, 'name': 'Biografías', 'category': 23}, 320: {'id': 320, 'name': 'Comics e Historietas', 'category': 23}, 321: {'id': 321, 'name': 'Diccionarios y Enciclopedias', 'category': 23}, 322: {'id': 322, 'name': 'Ensayos', 'category': 23}, 323: {'id': 323, 'name': 'Libros Antiguos', 'category': 23}, 324: {'id': 324, 'name': 'Libros de Aquitectura y Diseño', 'category': 23}, 325: {'id': 325, 'name': 'Libros de Arte', 'category': 23}, 326: {'id': 326, 'name': 'Libros de Autoayuda', 'category': 23}, 327: {'id': 327, 'name': 'Libros de Ciencias Económicas', 'category': 23}, 328: {'id': 328, 'name': 'Libros de Ciencias Exactas', 'category': 23}, 329: {'id': 329, 'name': 'Libros de Ciencias Sociales', 'category': 23}, 330: {'id': 330, 'name': 'Libros de Computación/Internet', 'category': 23}, 331: {'id': 331, 'name': 'Libros de Cs Humanísticas', 'category': 23}, 332: {'id': 332, 'name': 'Libros de Cs Médicas/Naturales', 'category': 23}, 333: {'id': 333, 'name': 'Libros de Derecho', 'category': 23}, 334: {'id': 334, 'name': 'Libros de Ficción', 'category': 23}, 335: {'id': 335, 'name': 'Libros de Idiomas', 'category': 23}, 336: {'id': 336, 'name': 'Libros de Ingeniería', 'category': 23}, 337: {'id': 337, 'name': 'Libros de Recreación y Hobbies', 'category': 23}, 338: {'id': 338, 'name': 'Libros de Religión', 'category': 23}, 339: {'id': 339, 'name': 'Libros de Texto y Escolares', 'category': 23}, 340: {'id': 340, 'name': 'Libros Esotéricos/Paranormales', 'category': 23}, 341: {'id': 341, 'name': 'Libros Técnicos', 'category': 23}, 342: {'id': 342, 'name': 'Otros', 'category': 23}, 343: {'id': 343, 'name': 'Revistas', 'category': 23}, 344: {'id': 344, 'name': 'Merchandising', 'category': 24}, 345: {'id': 345, 'name': 'Música', 'category': 24}, 346: {'id': 346, 'name': 'Otros', 'category': 24}, 347: {'id': 347, 'name': 'Películas', 'category': 24}, 348: {'id': 348, 'name': 'Series de TV', 'category': 24}, 349: {'id': 349, 'name': 'Artículos Marítimos Antiguos', 'category': 25}, 350: {'id': 350, 'name': 'Audio Antiguo', 'category': 25}, 351: {'id': 351, 'name': 'Balanzas Antiguas', 'category': 25}, 352: {'id': 352, 'name': 'Bolsos y Valijas Antiguas', 'category': 25}, 353: {'id': 353, 'name': 'Cámaras Fotográficas Antiguas', 'category': 25}, 354: {'id': 354, 'name': 'Carteles Antiguos', 'category': 25}, 355: {'id': 355, 'name': 'Cristalería Antigua', 'category': 25}, 356: {'id': 356, 'name': 'Decoración Antigua', 'category': 25}, 357: {'id': 357, 'name': 'Electrodomésticos Antiguos', 'category': 25}, 358: {'id': 358, 'name': 'Equipos Científicos Antiguos', 'category': 25}, 359: {'id': 359, 'name': 'Herramientas Antiguas', 'category': 25}, 360: {'id': 360, 'name': 'Iluminación Antigua', 'category': 25}, 361: {'id': 361, 'name': 'Indumentaria Antigua', 'category': 25}, 362: {'id': 362, 'name': 'Instrumentos Musicales Antig.', 'category': 25}, 363: {'id': 363, 'name': 'Joyas y Relojes Antiguos', 'category': 25}, 364: {'id': 364, 'name': 'Juguetes Antiguos', 'category': 25}, 365: {'id': 365, 'name': 'Libros Antiguos', 'category': 25}, 366: {'id': 366, 'name': 'Llaves y Candados Antiguos', 'category': 25}, 367: {'id': 367, 'name': 'Máquinas de Coser', 'category': 25}, 368: {'id': 368, 'name': 'Máquinas de Escribir Antiguas', 'category': 25}, 369: {'id': 369, 'name': 'Muebles Antiguos', 'category': 25}, 370: {'id': 370, 'name': 'Otras Antigüedades', 'category': 25}, 371: {'id': 371, 'name': 'Platería Antigua', 'category': 25}, 372: {'id': 372, 'name': 'Registradoras Antiguas', 'category': 25}, 373: {'id': 373, 'name': 'Rejas y Portones Antiguos', 'category': 25}, 374: {'id': 374, 'name': 'Ropa de Cama Antigua', 'category': 25}, 375: {'id': 375, 'name': 'Sifones Antiguos', 'category': 25}, 376: {'id': 376, 'name': 'Sulkys y Carros Antiguos', 'category': 25}, 377: {'id': 377, 'name': 'Teléfonos Antiguos', 'category': 25}, 378: {'id': 378, 'name': 'Vajilla Antigua', 'category': 25}, 379: {'id': 379, 'name': 'Accesorios de moda mujer', 'category': 26}, 380: {'id': 380, 'name': 'Bermudas y Shorts', 'category': 26}, 381: {'id': 381, 'name': 'Buzos y Hoodies', 'category': 26}, 382: {'id': 382, 'name': 'Camisas Chombas y Blusas', 'category': 26}, 383: {'id': 383, 'name': 'Camperas, Tapados y Trenchs', 'category': 26}, 384: {'id': 384, 'name': 'Carteras y bolsos y billeteras', 'category': 26}, 385: {'id': 385, 'name': 'Enteritos', 'category': 26}, 386: {'id': 386, 'name': 'Lentes', 'category': 26}, 387: {'id': 387, 'name': 'Otros', 'category': 26}, 388: {'id': 388, 'name': 'Pantalones , Jeans y Calzas', 'category': 26}, 389: {'id': 389, 'name': 'Polleras', 'category': 26}, 390: {'id': 390, 'name': 'Remeras', 'category': 26}, 391: {'id': 391, 'name': 'Ropa interior y de dormir', 'category': 26}, 392: {'id': 392, 'name': 'Saquitos ,Sweaters y Chalecos', 'category': 26}, 393: {'id': 393, 'name': 'Trajes', 'category': 26}, 394: {'id': 394, 'name': 'Trajes de Baño', 'category': 26}, 395: {'id': 395, 'name': 'Vestidos', 'category': 26}, 396: {'id': 396, 'name': 'Zapatillas', 'category': 26}, 397: {'id': 397, 'name': 'Zapatos', 'category': 26}, 398: {'id': 398, 'name': 'Cuidado Bucal', 'category': 27}, 399: {'id': 399, 'name': 'Cuidado de la Piel', 'category': 27}, 400: {'id': 400, 'name': 'Cuidado de la Salud', 'category': 27}, 401: {'id': 401, 'name': 'Cuidado del Cabello', 'category': 27}, 402: {'id': 402, 'name': 'Cuidado para Manos', 'category': 27}, 403: {'id': 403, 'name': 'Cuidado Personal', 'category': 27}, 404: {'id': 404, 'name': 'Equipamiento Médico', 'category': 27}, 405: {'id': 405, 'name': 'Maquillaje', 'category': 27}, 406: {'id': 406, 'name': 'Otros', 'category': 27}, 407: {'id': 407, 'name': 'Perfumes', 'category': 27}, 408: {'id': 408, 'name': 'Suplementos Alimenticios', 'category': 27}, 409: {'id': 409, 'name': 'Terapias Naturales', 'category': 27}, 410: {'id': 410, 'name': 'Consolas y Videojuegos', 'category': 28}, 411: {'id': 411, 'name': 'Electrónica, Audio y Video', 'category': 28}};
export default category_list;