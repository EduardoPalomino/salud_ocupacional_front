const fs = require('fs');
const path = require('path');

const args: string[] = process.argv.slice(2);
if (args.length < 1) {
  console.error('Uso: ts-node src/generadores-angular/generate-config.ts <nombreTabla>');
  console.error('Ejemplos:');
  console.error('  ts-node src/generadores-angular/generate-config.ts empresa');
  console.error('  ts-node src/generadores-angular/generate-config.ts empleado_archivo');
  process.exit(1);
}

const tableName: string = args[0];
const configPath: string = path.join(__dirname, '../config');
const configFile: string = path.join(configPath, 'app.module.txt');
const componentsFile: string = path.join(configPath, 'app-routing.module.txt');
const environmentFile: string = path.join(configPath, 'environment.txt');

// Solo la primera letra de toda la cadena en mayúscula, el resto minúscula
function toCapitalizedFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function getModuleName(tableName: string): string {
  const capitalized = toCapitalizedFirstLetter(tableName);
  return `${capitalized}sModule`;
}

function getModulePath(tableName: string): string {
  return `./features/${tableName.toLowerCase()}s/${tableName.toLowerCase()}s.module`;
}

// Mantener guiones bajos, solo primera letra mayúscula
function getComponentName(tableName: string): string {
  const capitalized = toCapitalizedFirstLetter(tableName);
  return `${capitalized}ListComponent`;
}

function getComponentPath(tableName: string): string {
  return `./features/${tableName.toLowerCase()}s/pages/list/list.component`;
}

// Obtener el nombre del endpoint (mantiene guiones bajos, primera letra mayúscula)
function getEndpointName(tableName: string): string {
  const capitalized = toCapitalizedFirstLetter(tableName);
  return `${capitalized}s`;
}

// Crear carpeta config si no existe
if (!fs.existsSync(configPath)) {
  fs.mkdirSync(configPath, { recursive: true });
  console.log(`✅ Carpeta creada: ${configPath}`);
}

// Leer módulos existentes
let existingModules: string[] = [];
if (fs.existsSync(configFile)) {
  const content: string = fs.readFileSync(configFile, 'utf8');
  existingModules = content.split('\n')
    .filter((line: string) => line.includes('import {'))
    .map((line: string) => {
      const match = line.match(/import { (.*?) } from/);
      return match ? match[1] : null;
    })
    .filter((moduleName: string | null): moduleName is string => moduleName !== null);
}

const newModuleName: string = getModuleName(tableName);

if (!existingModules.includes(newModuleName)) {
  existingModules.push(newModuleName);
  existingModules.sort();

  const imports: string = existingModules.map((moduleName: string) => {
    let tableForPath: string = moduleName.replace('sModule', '');
    tableForPath = tableForPath.toLowerCase();
    return `import { ${moduleName} } from "${getModulePath(tableForPath)}";`;
  }).join('\n');

  fs.writeFileSync(configFile, `${imports}\n`, 'utf8');
  console.log(`✅ Módulo ${newModuleName} agregado correctamente`);
  console.log(`📁 Archivo: ${configFile}`);
  console.log(`\n📄 Contenido del archivo de módulos:\n${imports}`);
} else {
  console.log(`⚠️ El módulo ${newModuleName} ya existe en la configuración`);
  console.log(`📁 Archivo: ${configFile}`);
}

// Leer componentes existentes
let existingComponents: string[] = [];
if (fs.existsSync(componentsFile)) {
  const content: string = fs.readFileSync(componentsFile, 'utf8');
  existingComponents = content.split('\n')
    .filter((line: string) => line.includes('import {'))
    .map((line: string) => {
      const match = line.match(/import { (.*?) } from/);
      return match ? match[1] : null;
    })
    .filter((componentName: string | null): componentName is string => componentName !== null);
}

const newComponentName: string = getComponentName(tableName);

// Actualizar archivo de componentes
if (!existingComponents.includes(newComponentName)) {
  existingComponents.push(newComponentName);
  existingComponents.sort();

  const componentImports: string = existingComponents.map((componentName: string) => {
    let tableForPath: string = componentName.replace('ListComponent', '');
    tableForPath = tableForPath.toLowerCase();
    return `import { ${componentName} } from "${getComponentPath(tableForPath)}";`;
  }).join('\n');

  fs.writeFileSync(componentsFile, `${componentImports}\n`, 'utf8');
  console.log(`✅ Componente ${newComponentName} agregado correctamente`);
  console.log(`📁 Archivo: ${componentsFile}`);
  console.log(`\n📄 Contenido del archivo de componentes:\n${componentImports}`);
} else {
  console.log(`⚠️ El componente ${newComponentName} ya existe`);
  console.log(`📁 Archivo: ${componentsFile}`);
}

// Leer endpoints existentes
let existingEndpoints: { name: string; value: string }[] = [];
if (fs.existsSync(environmentFile)) {
  const content: string = fs.readFileSync(environmentFile, 'utf8');
  const lines = content.split('\n');
  existingEndpoints = lines
    .filter((line: string) => line.includes('_ENDPOINT:'))
    .map((line: string) => {
      const match = line.match(/([A-Z_]+)_ENDPOINT:\s*'([^']+)'/);
      return match ? { name: match[1], value: match[2] } : null;
    })
    .filter((item: any): item is { name: string; value: string } => item !== null);
}

const newEndpointName: string = tableName.toUpperCase();
const newEndpointValue: string = getEndpointName(tableName);

// Actualizar archivo de environment
if (!existingEndpoints.some(e => e.name === newEndpointName)) {
  existingEndpoints.push({ name: newEndpointName, value: newEndpointValue });
  existingEndpoints.sort((a, b) => a.name.localeCompare(b.name));

  const endpointsContent: string = existingEndpoints.map((endpoint) => {
    return `  ${endpoint.name}_ENDPOINT: '${endpoint.value}',`;
  }).join('\n');

  fs.writeFileSync(environmentFile, `${endpointsContent}\n`, 'utf8');
  console.log(`✅ Endpoint ${newEndpointName}_ENDPOINT agregado correctamente`);
  console.log(`📁 Archivo: ${environmentFile}`);
} else {
  console.log(`⚠️ El endpoint ${newEndpointName}_ENDPOINT ya existe`);
  console.log(`📁 Archivo: ${environmentFile}`);
}
