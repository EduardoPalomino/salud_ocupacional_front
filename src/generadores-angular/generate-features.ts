import * as fs from 'fs';
import * as path from 'path';

// 📌 Obtener argumentos de la consola
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Uso: ts-node scripts/generate-interface.ts <nombreTabla> <campo1,campo2,campo3,...>');
  process.exit(1);
}

const tableName = args[0]; // Nombre de la tabla
const fields = args[1].split(','); // Lista de campos separados por comas

// 📌 Convertir el primer carácter a mayúscula (Ej: "user" -> "User")
const interfaceName = tableName.charAt(0).toUpperCase() + tableName.slice(1);

// 📌 Generar el contenido de la interfaz (asumiendo `string` como tipo por defecto)
const interfaceContent = `export interface ${interfaceName} {\n` +
  fields.map(field => `  ${field}: string;`).join('\n') +
  '\n}\n';

// 📌 Ruta donde se guardará el archivo
const outputDir = path.join(__dirname, `../src/app/features/${tableName}s/interfaces`);
const outputPath = path.join(outputDir, `${tableName}.interface.ts`);

// 📌 Crear el directorio si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 📌 Escribir el archivo
fs.writeFileSync(outputPath, interfaceContent, 'utf8');

console.log(`✅ Interfaz generada: ${outputPath}`);
