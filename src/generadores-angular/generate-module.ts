const fs = require('fs');
const path = require('path');

// 📌 Obtener argumentos de la consola
const args: string[] = process.argv.slice(2);
if (args.length < 1) {
  console.error('Uso: ts-node src/generadores-angular/generate-module.ts <nombreTabla> <campo1 campo2 ...>');
  process.exit(1);
}

const tableName: string = args[0];
const fields: string[] = args.slice(1).join(' ').split(/\s+/); // 🔥 Captura los argumentos aunque vengan sin comas

// 📌 Definir las carpetas y archivos
const baseDir: string = path.join(__dirname, `../app/features/${tableName}s`);
const folders: string[] = ['interfaces', 'models', 'pages/form', 'pages/list', 'services'];
const files: Record<string, string> = {
  [`interfaces/${tableName}.interface.ts`]: generateInterfaceContent(tableName, fields),
  [`models/${tableName}.model.ts`]: generateModelContent(tableName, fields),
  [`pages/form/form.component.html`]: ``,
  [`pages/form/form.component.ts`]: generateFormTsContent(tableName, fields),
  [`pages/list/list.component.html`]:generateListsHtmlContent(tableName, fields),
  [`pages/list/list.component.ts`]:generateListsContent(tableName, fields),
  [`pages/list/list.component.scss`]: ``,
  [`${tableName}s.module.ts`]: generateModuleContent(tableName),
  [`app-routing.module.ts`]: generateRoutingContent(tableName),
  [`services/${tableName}.service.ts`]: generateServiceContent(tableName),
};

// 📌 Crear carpetas
folders.forEach((folder: string) => {
  const dirPath: string = path.join(baseDir, folder);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Carpeta creada: ${dirPath}`);
  }
});

// 📌 Crear archivos
Object.entries(files).forEach(([filePath, content]: [string, string]) => {
  const fullPath: string = path.join(baseDir, filePath);
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`📄 Archivo creado: ${fullPath}`);
  }
});

console.log('🎉 Módulo generado exitosamente.');

// 📌 Función para generar la interfaz con los campos en una sola línea correctamente
function generateInterfaceContent(name: string, fields: string[]): string {
  const className: string = capitalize(name);
  const defaultFields: any[] = ['_id: string','key:number'];
  const fieldLines: string[] = fields.map((field: string) => (field.endsWith('_id'))?`${field.replace('_id', '')}: ${capitalize(field.replace('_id', ''))}`:`${field}: string`);
  const timestamps: string[] = ['created_at: string', 'updated_at: string'];
  const importOtherSchemas : string[] = fields.filter(field => field.endsWith('_id')).map(field =>
    `import { ${capitalize(field.replace('_id', ''))} } from '../../${field.replace('_id', '')}s/interfaces/${field.replace('_id', '')}.interface';`);

  return `${importOtherSchemas.join('\n')}
  export interface ${className} {\n  ${[...defaultFields, ...fieldLines, ...timestamps].join(';\n  ')};\n }`;
}

// 📌 Función para generar el contenido del modelo con los campos dinámicos
function generateModelContent(name: string, fields: string[]): string {
  const className: string = capitalize(name);

  // 🔥 Generar los campos del modelo con valores por defecto
  const fieldLines: string[] = fields.map((field: string) => `  ${field} = '';`);
  const fieldLinesModel: string[] = fields.map((field: string) => (field.endsWith('_id'))?`  ${field.replace('_id', '')}: ${capitalize(field.replace('_id', ''))}= {} as ${capitalize(field.replace('_id', ''))};`:`  ${field}= '';`);

  const timestamps: string[] = ['  created_at = \'\';', '  updated_at = \'\';'];
  const importOtherSchemas : string[] = fields.filter(field => field.endsWith('_id')).map(field =>
    `import { ${capitalize(field.replace('_id', ''))} } from '../../${field.replace('_id', '')}s/interfaces/${field.replace('_id', '')}.interface';`);

  return `${importOtherSchemas.join('\n')}
import { ${className} } from '../interfaces/${name}.interface';

export class ${className}Model implements ${className} {
  _id = '';
  key:number = 0;
${[...fieldLinesModel, ...timestamps].join('\n')}

  constructor(data?: Partial<${className}>) {
    Object.assign(this, data);
  }
}`;
}

// 📌 Función para generar la interfaz con los campos en una sola línea correctamente
function generateServiceContent(name: string): string {
  const className = capitalize(name);
  const interfaceName = className; // Se asume que la interfaz tiene el mismo nombre
  const endpointVar = name.toUpperCase() + '_ENDPOINT';
  const loginService = (name === 'usuario')
    ? `login(data: Usuario): Observable<Usuario> {
  return this.http.post<Usuario>(\`\${this.apiUrl}/login\`, data);
}`
    : '';
  return `import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ${interfaceName} } from '../interfaces/${name}.interface';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ${className}Service {

  private apiUrl = \`\${environment.API_URL}\${environment.${endpointVar}}\`;

  constructor(private http: HttpClient) {}


  getAll(searchTerm: string = '',empresa_id: string = '', page: number = 1, limit: number = 10): Observable<${interfaceName}[]> {
    let url = \`\${this.apiUrl}?&empresa_id=\${empresa_id}&page=\${page}&limit=\${limit}\`;
    if (searchTerm) {
      url += \`&search=\${encodeURIComponent(searchTerm)}\`;
    }
    return this.http.get<any>(url);
  }

  getById(id: string,empresa_id: string): Observable<${interfaceName}> {
    return this.http.get<${interfaceName}>(\`\${this.apiUrl}/\${id}?empresa_id=\${empresa_id}\`);
  }

  create(data: ${interfaceName}): Observable<${interfaceName}> {
    return this.http.post<${interfaceName}>(\`\${this.apiUrl}/\create\`, data);
  }

  ${loginService}

  update(id: string,empresa_id: string, data: ${interfaceName}): Observable<${interfaceName}> {
    return this.http.put<${interfaceName}>(\`\${this.apiUrl}/update/\${id}?empresa_id=\${empresa_id}\`, data);
  }

  delete(id: string,empresa_id: string,): Observable<void> {
    return this.http.delete<void>(\`\${this.apiUrl}/delete/\${id}?empresa_id=\${empresa_id}\`);
  }
}`;
}

// 📌 Función para generar la interfaz con los campos en una sola línea correctamente
function generateRoutingContent(name: string): string {
  const className = capitalize(name);
  return `import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ${className}ListComponent } from './pages/list/list.component';

const routes: Routes = [
  { path: '', component: ${className}ListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ${className}sRoutingModule { }`;
}

// 📌 Función para generar la interfaz con los campos en una sola línea correctamente
function generateModuleContent(name: string): string {
  const className = capitalize(name);
  return `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Componentes
import { ${className}ListComponent } from './pages/list/list.component';
import { FormComponent } from './pages/form/form.component';
import {SharedModule} from "../../shared/shared.module";
// Servicios
import { ${className}Service } from './services/${name}.service';

@NgModule({
  declarations: [
    ${className}ListComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
  ],
  providers: [
    ${className}Service
  ],
  exports: [
    ${className}ListComponent,
    SharedModule,
    FormComponent
  ]
})
export class ${className}sModule {}`;
}

// 📌 Función para generar la interfaz con los campos en una sola línea correctamente
function XgenerateListsContent(name: string, fields: string[]): string {
  const className = capitalize(name);
  const formFields = fields.map((field) => `${field}: ['', Validators.required]`).join(',\n      ');

  const importServiceFields = fields
    .filter(field => field.endsWith('_id')) // Filtra solo los que terminan en "_id"
    .map(field => {
      const cleanField = field.replace('_id', ''); // Elimina el "_id"
      return `import { ${capitalize(cleanField)}Service } from '../../../${cleanField}s/services/${cleanField}.service';`;
    })
    .join('\n');

  const importInterfaceFields = fields
    .filter(field => field.endsWith('_id')) // Filtra solo los que terminan en "_id"
    .map(field => {
      const cleanField = field.replace('_id', ''); // Elimina el "_id"
      return `import { ${capitalize(cleanField)} } from '../../../${cleanField}s/interfaces/${cleanField}.interface';`;
    })
    .join('\n');

  const arrayInterfaceFields = fields
    .filter(field => field.endsWith('_id')) // Filtra solo los que terminan en "_id"
    .map(field => {
      const cleanField = field.replace('_id', ''); // Elimina el "_id"
      return `${cleanField}s: ${capitalize(cleanField)}[]= [];`;
    })
    .join('\n');

  const selectedFields = fields
    .filter(field => field.endsWith('_id')) // Filtra solo los que terminan en "_id"
    .map(field => {
      const cleanField = field.replace('_id', ''); // Elimina el "_id"
      return `selected_${cleanField}:{ label: string; value: string }[]=[];`;
    })
    .join('\n');

  const constructorFields = fields
    .filter(field => field.endsWith('_id')) // Filtra solo los que terminan en "_id"
    .map(field => {
      const cleanField = field.replace('_id', ''); // Elimina el "_id"
      return `private ${cleanField}Service:${capitalize(cleanField)}Service`;
    })
    .join(',\n');

  const onInitFields = fields
    .filter(field => field.endsWith('_id')) // Filtra solo los que terminan en "_id"
    .map(field => {
      const cleanField = field.replace('_id', ''); // Elimina el "_id"
      return `    this.load${capitalize(cleanField)}s();`;
    })
    .join('\n');

  const onChangeFields = fields
    .filter(field => field.endsWith('_id')) // Filtra solo los que terminan en "_id"
    .map(field => {
      const cleanField = field.replace('_id', ''); // Elimina el "_id"
      return `
onChange${capitalize(cleanField)}(e: any) {
  this.${name}Form.patchValue({${cleanField}_id:e.value});
} `;
})
    .join('\n      ');





  const loadInitFields = fields
    .filter(field => field.endsWith('_id')) // Filtra solo los que terminan en "_id"
    .map(field => {
      const cleanField = field.replace('_id', ''); // Elimina el "_id"
      return `
   load${capitalize(cleanField)}s() {
    this.${cleanField}Service.getAll('',this.empresa_id, 1, 1000).subscribe({
      next: (data) => {
        this.${cleanField}s = data;
        this.selected_${cleanField} = this.${cleanField}s.map(${cleanField} => ({
          label: ${cleanField}.descripcion,
          value: ${cleanField}._id
        }));
      },
      error: (err) => {
        console.error('Error al cargar ${cleanField}s:', err);
      }
    });
  }`;
    })
    .join('\n      ');




  const editPatchFields = fields
    .map(field => {
      if(field=='fecha'){
        return `${field}: this.formatDate(${name}.${field})`;
      }else{
        return `${field}: ${name}.${field}`;
      }

    })
    .join(',\n      ');

  const maskColumFields = fields
    .filter(field => field.endsWith('_id')) // Filtra solo los que terminan en "_id"
    .map(field => {
      const cleanField = field.replace('_id', ''); // Elimina el "_id"
      return `${cleanField}_nombre:this.${cleanField}s.find(${cleanField}=>${cleanField}._id==${name}.${cleanField}_id)?.descripcion||'Sin ${capitalize(cleanField)}'`;
    })
    .join('\n      ');

  const selectedCalendarFields = fields
    .filter(field => field.startsWith('fecha')) // Filtra solo los que terminan en "_id"
    .map(field => {
      return `selectedCalendar${capitalize(field)}(event: Date) {
       const formattedDate = this.formatDate(event);
       this.${name}Form.patchValue({
           ${field}: formattedDate
       });
    }`;
    })
    .join('\n      ');


  return `import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ${className}Service } from '../../services/${name}.service';
${importServiceFields}
import { ${className} } from '../../interfaces/${name}.interface';
${importInterfaceFields}

@Component({
  selector: 'app-${name}-list',
  templateUrl: './list.component.html',
  providers: [ConfirmationService, MessageService]
})
export class ${className}ListComponent implements OnInit {
  ${name}s: ${className}[] = [];
  filtered${className}s: ${className}[] = [];
  globalFilter: string = '';
  modalVisible: boolean = false;
  modalTitle: string = '';
  ${arrayInterfaceFields}
  ${selectedFields}
  ${name}Form: FormGroup;
  mode:string='';

  constructor(
  private fb: FormBuilder,
  private ${name}Service: ${className}Service,
  private confirmationService: ConfirmationService,
  private messageService: MessageService
  ${constructorFields}
  ) {
    this.${name}Form = this.fb.group({
      _id: [null],
      ${formFields}
    });
  }

  ngOnInit(): void {
  ${onInitFields}
    this.load${className}s();
  }

  load${className}s() {
    this.${name}Service.getAll().subscribe({
      next: (data:any) => {
        //mi test
        this.${name}s = data.response;
      },
      error: (err) => {
        console.error('Error al cargar ${className}s:', err);
      }
    });
  }

${loadInitFields}

  applyGlobalFilter() {
    const filterValue = this.globalFilter.toLowerCase().trim();
    console.log('Filtrando:', filterValue);

    if (!filterValue) {
      this.filtered${className}s = [...this.${name}s];
      return;
    }

    this.filtered${className}s = this.${name}s.filter((${name}) =>
        Object.values(${name}).some(
            (value) =>
                value &&
                value.toString().toLowerCase().includes(filterValue)
        )
    );
  }

  openModal(mode: 'Nuevo' | 'Editar', ${name}?: ${className}) {
    this.mode=mode;
    console.log(mode);
    this.modalTitle = \`\${mode} ${className}\`;
    this.modalVisible = true;

    if (mode === 'Editar' && ${name}) {
      this.${name}Form.patchValue({empresa_id:this.empresa_id});
      this.${name}Form.patchValue({
       _id: ${name}._id,
      ${editPatchFields}
      });
    } else {
      this.${name}Form.reset();
      this.${name}Form.patchValue({empresa_id:this.empresa_id});
    }
  }

  confirmarEliminacion(${name}: ${className}) {
    console.log("Clic en eliminar:", ${name});
    this.confirmationService.confirm({
      message: \`¿Estás seguro de eliminar el ${className}: \${${name}.${fields[0].replace('_id', '._id')}}?\`,
      header: 'Confirmación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.delete${className}(${name});
      }
    });
  }

delete${className}(${name}: ${className}) {
    this.${name}Service.delete(${name}._id).subscribe({
      next: () => {
        this.load${className}s();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: \`${className} "\${${name}.${fields[0]}}" eliminado correctamente\`
        });
      },
      error: (err) => {
        console.error('Error al eliminar el ${name}:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: \`No se pudo eliminar el ${name} "\${${name}.${fields[0]}}"\`
        });
      }
    });
  }

  saveRegistro() {
    if (this.${name}Form.valid) { // Verifica que el formulario sea válido
      const ${name} = this.${name}Form.value; // Obtener valores del formulario

      console.log(JSON.stringify(${name}));
      ${name}._id === null && delete ${name}._id;
      console.log(JSON.stringify(${name}));

      if (this.mode === 'Nuevo') {
        this.${name}Service.create(${name}).subscribe({
          next: (data) => {
            console.log('${className} guardado con éxito:', data);
            this.${name}s.push(data); // Agregar el nuevo ${name} a la lista
            this.modalVisible = false; // Cerrar modal después de guardar
            this.load${className}s(); // Recargar lista de ${name}s
            this.mensajeConfirmacion(${name},"Registro Actualizado");
          },
          error: (err) => {
            console.error('Error al guardar el ${name}:', err);
          }
        });
      }else{
        this.${name}Service.update(${name}._id, ${name}).subscribe(() => {
          this.modalVisible = false;
          this.load${className}s();
          this.mensajeConfirmacion(${name},"Registro Actualizado");
        });
      }
    }
  }

  ${onChangeFields}

  mensajeConfirmacion(${name}: ${className},mensaje:String){
    this.messageService.add({
      severity: 'success',
      summary: 'Éxito',
      detail: \` ${className} "\${${name}.${fields[0]}}" \${mensaje}\`
    });
  }



}
`;
}

function generateListsContent(name: string, fields: string[]): string {
  const className = capitalize(name);
  const formFields = fields.map((field) => {
    if (field === 'empresa_id') {
      return `${field}: [this.empresa_id, Validators.required]`;
    } else if (field === 'archivo') {
      return `${field}: ['']`;
    } else {
      return `${field}: ['', Validators.required]`;
    }
  }).join(',\n            ');

  const archivo = fields.some(field => field.endsWith('archivo'));

  const importServiceFields = fields
    .filter(field => field.endsWith('_id'))
    .map(field => {
      const cleanField = field.replace('_id', '');
      return `import { ${capitalize(cleanField)}Service } from '../../../${cleanField}s/services/${cleanField}.service,';`;
    })
    .join('\n');

  const importInterfaceFields = fields
    .filter(field => field.endsWith('_id'))
    .map(field => {
      const cleanField = field.replace('_id', '');
      return `import { ${capitalize(cleanField)} } from '../../../${cleanField}s/interfaces/${cleanField}.interface';`;
    })
    .join('\n');

  const arrayInterfaceFields = fields
    .filter(field => field.endsWith('_id'))
    .map(field => {
      const cleanField = field.replace('_id', '');
      return `${cleanField}s: ${capitalize(cleanField)}[] = [];`;
    })
    .join('\n    ');

  const selectedFields = fields
    .filter(field => field.endsWith('_id'))
    .map(field => {
      const cleanField = field.replace('_id', '');
      return `selected_${cleanField}: { label: string; value: string }[] = [];`;
    })
    .join('\n    ');

  const constructorFields = fields
    .filter(field => field.endsWith('_id'))
    .map(field => {
      const cleanField = field.replace('_id', '');
      return `private ${cleanField}Service: ${capitalize(cleanField)}Service,`;
    })
    .join(',\n        ');

  const onInitFields = fields
    .filter(field => field.endsWith('_id'))
    .map(field => {
      const cleanField = field.replace('_id', '');
      return `this.load${capitalize(cleanField)}s();`;
    })
    .join('\n    ');

  const onChangeFields = fields
    .filter(field => field.endsWith('_id'))
    .map(field => {
      const cleanField = field.replace('_id', '');
      return `
    onChange${capitalize(cleanField)}(e: any) {
        this.${name}Form.patchValue({${field}: e.value});
    }`;
    })
    .join('\n');

  const loadInitFields = fields
    .filter(field => field.endsWith('_id'))
    .map(field => {
      const cleanField = field.replace('_id', '');
      return `
    load${capitalize(cleanField)}s() {
        this.${cleanField}Service.getAll().subscribe({
            next: (data:any) => {
                this.${cleanField}s = data.response;
                this.selected_${cleanField} = this.${cleanField}s.map(${cleanField} => ({
                    label: ${cleanField}.descripcion,
                    value: ${cleanField}._id
                }));
            },
            error: (err) => {
                console.error('Error al cargar ${cleanField}s:', err);
            }
        });
    }`;
    })
    .join('\n');

  const editPatchFields = fields
    .map(field => `${field}: ${name}.${field.replace('_id', '._id')}`)
    .join(',\n                ');

  const maskColumFields = fields
    .filter(field => field.endsWith('_id'))
    .map(field => {
      const cleanField = field.replace('_id', '');
      return `${cleanField}_nombre: this.${cleanField}s.find(${cleanField} => ${cleanField}._id == ${name}.${field})?.descripcion || 'Sin ${capitalize(cleanField)}'`;
    })
    .join('\n        ');

  const selectedCalendarFields = fields
    .filter(field => field.startsWith('fecha'))
    .map(field => {
      return `
    selectedCalendar${capitalize(field)}(event: Date) {
        const formattedDate = this.formatDate(event);
        this.${name}Form.patchValue({
            ${field}: formattedDate
        });
    }`;
    })
    .join('\n');

  const functionUploadfile = `private async uploadFile(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!this.uploadedFile) {
      reject('No hay archivo para subir');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.uploadedFile);

    this.http.post(\`${'${this.apiUrl}'}upload\`, formData).subscribe({
      next: (res: any) => {
        resolve(res.url); // Resuelve con la URL de la imagen
      },
      error: (err) => {
        reject(err);
      }
    });
  });
}`;

const functionSaveRegistro = archivo==true?`saveRegistro() {
    if (this.${name}Form.valid) {
      const ${name} = this.${name}Form.value;
      console.log('si valid');
      // Verificar si hay una imagen para subir
      if (this.uploadedFile && !${name}.archivo) {
        // Primero subir la imagen, luego guardar el ${name}
        this.uploadFile().then((imageUrl: string) => {
          ${name}.archivo = imageUrl;
          this.save${capitalize(name)}Data(${name});
        }).catch(error => {
          console.error('Error al subir la imagen:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al subir la imagen del ${name}'
          });
        });
      } else {
        // No hay imagen nueva que subir, guardar directamente
        this.save${capitalize(name)}Data(${name});
      }
    }else{
      console.log('NO valid');
      console.log('NO VALID'+JSON.stringify(this.${name}Form.value,null,2))
    }
  }`:`saveRegistro() {
        if (this.${name}Form.valid) {
          const ${name} = this.${name}Form.value;
          console.log('si valid');
          this.save${capitalize(name)}Data(${name});
        }
    }`;

const functionSaveUsuarioData = archivo==true?`private async  save${capitalize(name)}Data(${name}: any) {
    // Limpiar el ID si es nuevo registro
    ${name}._id === null && delete ${name}._id;
    // Si hay una imagen para subir, procesarla primero
    if (this.uploadedFile) {
      const imageUrl = await this.uploadFile();
      ${name}.archivo = imageUrl;
    }
    let key:number = 1;
    this.${name}s.length===0?key=1:key=this.${name}s[this.${name}s.length - 1].key + 1;
    this.mode === 'Nuevo'? ${name}.key = key:key;
    const saveObservable = this.mode === 'Nuevo'
      ? this.${name}Service.create(${name})
      : this.${name}Service.update(${name}._id,this.empresa_id,${name});

    saveObservable.subscribe({
      next: (data) => {
        console.log('${capitalize(name)} guardado con éxito:', data);
        this.modalVisible = false;
        this.load${capitalize(name)}s();
        this.mensajeConfirmacion(${name}, "Registro Actualizado");
        // Resetear el estado de la imagen
        this.uploadedFile = null;
        this.previewImage = null;
      },
      error: (err) => {
        console.error('Error al guardar el ${name}:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar el ${name}'
        });
      }
    });
  }`:`private async  save${capitalize(name)}Data(${name}: any) {
    // Limpiar el ID si es nuevo registro
    ${name}._id === null && delete ${name}._id;
    let key:number = 1;
    this.${name}s.length===0?key=1:key=this.${name}s[this.${name}s.length - 1].key + 1;
    this.mode === 'Nuevo'? ${name}.key = key:key;
    const saveObservable = this.mode === 'Nuevo'
      ? this.${name}Service.create(${name})
      : this.${name}Service.update(${name}._id,this.empresa_id,${name});

    saveObservable.subscribe({
      next: (data) => {
        console.log('${capitalize(name)} guardado con éxito:', data);
        this.modalVisible = false;
        this.load${capitalize(name)}s();
        this.mensajeConfirmacion(${name}, "Registro Actualizado");
      },
      error: (err) => {
        console.error('Error al guardar el ${name}:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar el ${name}'
        });
      }
    });
  }`;

  return `import { Component, OnInit,ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ${className}Service } from '../../services/${name}.service';
${importServiceFields}
import { ${className} } from '../../interfaces/${name}.interface';
${importInterfaceFields}
/*ACCESO A MODULOS*/
import { HttpClient } from '@angular/common/http';
import {environment} from "../../../../../environments/environment";
import { Router } from '@angular/router';
import {PermissionService} from "../../../../shared/services/permission.service";
@Component({
    selector: 'app-${name}-list',
    templateUrl: './list.component.html',
    providers: [ConfirmationService, MessageService]
})
export class ${className}ListComponent implements OnInit {
    @ViewChild('fileUploadRef') fileUploadRef!: FileUpload;
    ${name}s: ${className}[] = [];
    filtered${className}s: ${className}[] = [];
    globalFilter: string = '';
    modalVisible: boolean = false;
    modalTitle: string = '';
    ${arrayInterfaceFields}
    ${selectedFields}
    ${name}Form: FormGroup;
    mode: string = '';
    pagination: any = {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0
    };
    searchTerm: string = '';
    uploadedFile: File | null = null;
    previewImage: string | ArrayBuffer | null = null;
    file:any;
    apiUrl = \`\${environment.API_URL}\`;
    // ---  DATOS DE SESSION ------
    nombre:string  = sessionStorage.getItem('nombre') || '""';
    apellido:string  = sessionStorage.getItem('apellido') || '""';
    email:string  =  sessionStorage.getItem('email') || '""';
    rol_id: string = sessionStorage.getItem('rol_id') || '""';
    archivo:any  = sessionStorage.getItem('archivo')!=''?sessionStorage.getItem('archivo'):'/uploads/avatar_generico.png';
    empresa_id: string = sessionStorage.getItem('empresa_id') || '""';
    // ---  DATOS DE SESSION ------
    constructor(
        private fb: FormBuilder,
        private ${name}Service: ${className}Service,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        ${constructorFields}
        private permissionService:PermissionService,
        private router: Router,
        private http: HttpClient
    ) {
        this.${name}Form = this.fb.group({
            _id: [null],
            ${formFields}
        });
    }

    ngOnInit(): void {
       this.permiso();
    }

    onInitial(){
       ${onInitFields}
       this.load${className}s(1);
    }

    permiso():void{
      console.log("this.rol_id "+this.rol_id)
      this.permissionService.permiso(this.rol_id).subscribe((tienePermiso) => {
        if (tienePermiso) {
          // acceso permitido
          console.log(tienePermiso+'si')
          this.onInitial();
        } else {
          console.log(tienePermiso+'no')
          // redirigido o sin acceso
          this.router.navigate(['admin/dashboard']);
        }
      });
    }

    load${className}s(page: number = 1) {
        this.${name}Service.getAll(this.searchTerm,this.empresa_id, page, this.pagination.itemsPerPage).subscribe({
            next: (data: any) => {
                this.${name}s = data.response;
                this.pagination = {
                  currentPage: data.pagination.currentPage,
                  itemsPerPage: data.pagination.itemsPerPage,
                  totalItems: data.pagination.totalItems,
                  totalPages: data.pagination.totalPages
                };
            },
            error: (err) => {
                console.error('Error al cargar ${className}s:', err);
            }
        });
    }
${loadInitFields}

    filtrar(e:any) {
      //console.log(JSON.stringify(e));
      this.searchTerm = e;
      this.load${className}s(1);
    }

    onPageChange(page: number) {
      this.pagination.currentPage = page;
      this.load${className}s(page);
    }

    onSearch(searchTerm: string) {
      this.searchTerm = searchTerm;
      this.load${className}s(1); // Resetear a primera página al buscar
    }

    descargar(){

    }

    importar(){

    }
    private resetFileUpload() {
      // 1. Limpiar variables de estado
      this.uploadedFile = null;
      this.previewImage = null;

      // 2. Resetear el componente FileUpload si está disponible
      if (this.fileUploadRef) {
        // Desactivar auto temporalmente
        const wasAuto = this.fileUploadRef.auto;
        this.fileUploadRef.auto = false;

        // Limpiar archivos seleccionados
        this.fileUploadRef.clear();

        // Resetear arrays internos
        this.fileUploadRef.files = [];
        (this.fileUploadRef as any)._files = []; // Usamos 'any' para acceder a propiedad privada

        // Limpiar input file nativo
        if ((this.fileUploadRef as any).basicFileInput?.nativeElement) {
          (this.fileUploadRef as any).basicFileInput.nativeElement.value = '';
        }

        // Restaurar estado auto
        setTimeout(() => {
          this.fileUploadRef.auto = wasAuto;
        }, 100);
      }
    }
    openModal(mode: 'Nuevo' | 'Editar', ${name}?: ${className}) {
        this.mode = mode;
        console.log(mode);
        this.modalTitle = \`\${mode} ${className}\`;
        this.modalVisible = true;
        this.resetFileUpload();
        if (mode === 'Editar' && ${name}) {
            this.${name}Form.patchValue({
                _id: ${name}._id,
                ${editPatchFields}
            });
        } else {
            this.${name}Form.reset();
        }
    }

    confirmarEliminacion(${name}: ${className}) {
        console.log("Clic en eliminar:", ${name});
        this.confirmationService.confirm({
            message: \`¿Estás seguro de eliminar el ${className}: \${${name}.${fields[0].replace('_id', '._id')}}?\`,
            header: 'Confirmación',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: () => {
                this.delete${className}(${name});
            }
        });
    }

    delete${className}(${name}: ${className}) {
        this.${name}Service.delete(${name}._id,this.empresa_id).subscribe({
            next: () => {
                this.load${className}s(1);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: \`${className} "\${${name}.${fields[0].replace('_id', '._id')}}" eliminado correctamente\`
                });
            },
            error: (err) => {
                console.error('Error al eliminar el ${name}:', err);
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: \`No se pudo eliminar el ${name} "\${${name}.${fields[0].replace('_id', '._id')}}"\`
                });
            }
        });
    }

    ${functionSaveRegistro}

    ${functionSaveUsuarioData}

${onChangeFields}
${selectedCalendarFields}

    mensajeConfirmacion(${name}: ${className}, mensaje: String) {
        this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: \`${className} "\${${name}.${fields[0].replace('_id', '._id')}}" \${mensaje}\`
        });
    }

  formatDate(isoString: Date): string {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }



  formatDatePicker(date: Date): string {
    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }

  convertDateToISO(dateInput: string | Date): string {
    let day, month, year;

    if (dateInput instanceof Date) {
      day = dateInput.getDate();
      month = dateInput.getMonth() + 1;
      year = dateInput.getFullYear();
    } else {
      const parts = dateInput.split('/').map(Number);
      if (parts.length !== 3) throw new Error("Formato inválido. Use dd/mm/yyyy");
      [day, month, year] = parts;
    }

    const date = new Date(Date.UTC(year, month - 1, day, 5, 0, 0));
    return date.toISOString();
  }


  onFileSelect(event: any) {
    this.resetFileUpload();
    const file = event.files?.[0] || event.target?.files?.[0];
    if (file) {
      this.uploadedFile = file;

      // Mostrar previsualización
      const reader = new FileReader();
      reader.onload = (e) => this.previewImage = e.target?.result || null;
      reader.readAsDataURL(file);
    }
  }
  // Modificamos uploadFile para que devuelva una Promise
  ${functionUploadfile}
}`;
}

// 📌 Función para generar la interfaz con los campos en una sola línea correctamente
function generateListsHtmlContent(name: string, fields: string[]): string {
  const className = capitalize(name);
  const formFields = fields.map((field) => `${field}: ['', Validators.required]`).join(',\n      ');

  const tableHeaders = fields.map(
    (field) => `<th pSortableColumn="${field.replace('_id', '')}">${capitalize(field.replace('_id', ''))} </th>`
  ).join('\n          ');

  const archivo = fields.some(field => field.endsWith('archivo'));

  const tableRows = fields.map(
    (field) => {
      // Si el campo termina en "_id", lo convertimos a ".rol.descripcion"
      if (field.endsWith('_id')) {
        const fieldWithoutId = field.replace('_id', ''); // "rol_id" → "rol"
        return `<td>{{ ${name}.${fieldWithoutId}.descripcion }}</td>`;
      }
      if (field.endsWith('archivo')) {
        const fieldArchivo = field.replace('archivo',`<img class="myfileUpload" src="{{apiUrl+'..'+${name}.archivo}}" alt="${name}" width="10" height="15">`);
        return `<td>${fieldArchivo}</td>`;
      }
      // Si no, lo dejamos tal cual (nombre, apellido, etc.)
      return `<td>{{ ${name}.${field}${field.includes('fecha') ? `| date: 'dd/MM/yyyy' ` : ``}}}</td>`;
    }
  ).join('\n          ');


  const dropdownpComponentFields = fields
    .filter(field => field.endsWith('_id')) // Filtra solo los que terminan en "_id"
    .map(field => {
      const cleanField = field.replace('_id', ''); // Elimina el "_id"
      return `<div class="p-field">
                      <label for="${cleanField}_id">${capitalize(cleanField)}</label>
                      <p-dropdown
                        id="${cleanField}_id"
                        [options]="selected_${cleanField}"
                        formControlName="${cleanField}_id"
                        optionLabel="label"
                        optionValue="value"
                        (onChange)="onChange${capitalize(cleanField)}($event)"
                        placeholder="Selecciona un ${cleanField}">
                      </p-dropdown>
                    </div>`;
    })
    .join('\n      ');

  const elemenRowsHtml = fields
    .filter(field => !field.endsWith('_id'))
    .map((field) =>{
      if (field.endsWith('archivo')) {
         return ``;
      }
      return  `
                <div class="p-field"><label>${capitalize(field)}</label>
        ${field.includes('fecha') ? `
        <p-calendar formControlName="${field}" dateFormat="dd/mm/yy" [showIcon]="true">
        </p-calendar>` :`        <input pInputText id="${field}Input" formControlName="${field}" />`}
                </div>`
    }).join('\n');

  // Agregar el input oculto solo una vez
  const elemenRows = `${elemenRowsHtml}
                  <input pInputText id="_idInput" formControlName="_id" [hidden]="true"  />`;
  const archivoElementHtml = (archivo == true) ?`<!--Archivo-->
                  <div class="p-field col-12">
                    <label>Archivo</label>
                    <div  class="flex flex-column gap-2">
                      <!-- Input de PrimeNG para subir archivos -->
                      <p-fileUpload
                        #fileUploadRef
                        mode="basic"
                        name="file"
                        chooseLabel="Seleccionar Archivo"
                        accept="image/*"
                        (onSelect)="onFileSelect($event)"
                        [auto]="false"
                        [showUploadButton]="false"
                        [showCancelButton]="false"
                      ></p-fileUpload>
                      <!-- Previsualización de la imagen -->
                      <div *ngIf="previewImage" class="mt-2">
                        <p-image
                          [src]="previewImage"
                          alt="Previsualización"
                          width="70"
                          height="90"
                          [preview]="true"
                          class="shadow-2 border-round"
                        ></p-image>
                      </div>
                      <!-- Mostrar la URL de la imagen guardada -->
                      <div *ngIf="!previewImage" class="mt-2">
                        <img class="myfileUpload" src="{{apiUrl+'..'+${name}Form.get('archivo')?.value}}" alt="${name}" width="70" height="90">
                      </div>
                    </div>
                  </div>
                  <!--Archivo-->`:``;
  return `<p-card class="dashboard">
  <div class="flex grid adminPanel">
    <div class="col-12 top pb-0 pt-3">
      <!--logo-->
      <div class="grid">
        <div class="col-2 box-prime">
          <div class="navbar-logo flex align-items-center justify-content-between pt-2 pb-2 pl-2">
            <img class="logo-empresa" src="assets/images/admin/ecuanticorp-logo.png"  alt="Ecuanticorp" height="25px" >
            <a id="mobile-collapse" href="#" class="mobile-menu">
              <i class="pi pi-bars"></i>
            </a>
          </div>
        </div>
        <div class="col-10 box-prime top-menu">
          <!-- CONTENIDO DE SUPERIOR LOGIN, GLOBITO, ETC -->
          <ul class="user-perfil">
            <li>

            </li>
            <li>

            </li>
            <li>
                <div class="item-perfil img"><img class="user-perfil-img" src="{{apiUrl+'..'+archivo}}"></div>
                <div class="item-perfil text"><menu-perfil  label="{{nombre}} {{apellido}}"></menu-perfil></div>
            </li>
          </ul>
        </div>
      </div>
      <!--logo-->
    </div>
    <!--sidebar-->
    <div class="col-2 sidebar">
      <div class="navbar-menu">
        <div class="col-12 navigation">Navegación</div>
        <div class="col-12 menu-link">
          <menu-sidebar></menu-sidebar>
        </div>
      </div>
    </div>

    <!--sidebar-->
    <div class="col-10 main p-1">
      <div class="grid dashboard card4">
        <div class="col-12 filtro">
          <div class="e-card m-1">
            <!--  filtro-->
            <div class="p-datatable-header">
              <h1>Gestión de ${className}</h1>
              <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <div class="col-3">
                  <span class="p-input-icon-left">
                      <i class="pi pi-search"></i>
                      <input
                        pInputText
                        type="text"
                        placeholder="Búsqueda"
                        class="p-inputtext p-component p-element w-full"
                        [(ngModel)]="globalFilter"
                        (keyup.enter)="filtrar(globalFilter)"
                        (blur)="filtrar(globalFilter)">
                    </span>
                </div>
                <div class="col-2">
                  <button pButton icon="pi pi-user-plus" label="Nuevo ${className}"
                          class="p-button-sm p-button-outlined btn_purple" (click)="openModal('Nuevo')">
                  </button>
                </div>

              </div>
            </div>
            <!--  filtro-->
          </div>
        </div>
        <div class="col-12 data">
           <div class="e-card m-1">
              <p-card>
            <!--contenido-->
            <p-toast></p-toast>
            <p-table #table [value]="${name}s" [paginator]="false" [rows]="10" [rowsPerPageOptions]="[10, 20, 50, 100]"
             [globalFilterFields]="${JSON.stringify(fields).replace(/"/g, "'")}" [responsiveLayout]="'scroll'">
      <ng-template pTemplate="header">
        <tr>
          <th pSortableColumn="key">Id </th>
          ${tableHeaders}
          <th>Acciones</th>
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-${name} let-i="rowIndex">
        <tr>
          <td>{{ ${name}.key }}</td>
          ${tableRows}
          <td>
            <button pButton icon="pi pi-pencil" class="p-button-text p-button-sm p-button-warning" (click)="openModal('Editar', ${name})"></button>
            <button pButton icon="pi pi-trash" class="p-button-text p-button-sm p-button-danger" (click)="confirmarEliminacion(${name})"></button>
          </td>
        </tr>
      </ng-template>
    </p-table>
            <!-- Paginación personalizada -->
            <div class="pagination-container">
  <button (click)="onPageChange(1)" [disabled]="pagination.currentPage === 1" class="pagination-button">
    <i class="pi pi-angle-double-left"></i>
  </button>
  <button (click)="onPageChange(pagination.currentPage - 1)" [disabled]="pagination.currentPage === 1" class="pagination-button">
    <i class="pi pi-angle-left"></i>
  </button>

  <span class="pagination-info">
    Página {{ pagination.currentPage }} de {{ pagination.totalPages }}
  </span>

  <button (click)="onPageChange(pagination.currentPage + 1)" [disabled]="pagination.currentPage === pagination.totalPages" class="pagination-button">
    <i class="pi pi-angle-right"></i>
  </button>
  <button (click)="onPageChange(pagination.totalPages)" [disabled]="pagination.currentPage === pagination.totalPages" class="pagination-button">
    <i class="pi pi-angle-double-right"></i>
  </button>

</div>
            <!-- end Paginación personalizada -->
            <!-- Confirmation -->
            <p-confirmDialog></p-confirmDialog>
            <!-- Confirmation -->
            <!-- Modal -->
            <p-dialog [(visible)]="modalVisible" [header]="modalTitle" [modal]="true" [closable]="true" [style]="{width: '500px'}">
              <form [formGroup]="${name}Form" >
                <div class="p-fluid">
                               ${elemenRows}
                    ${archivoElementHtml}
                    ${dropdownpComponentFields}
                </div>
                <div class="p-dialog-footer">
                  <button pButton type="button" label="Cancelar" class="p-button-text btn_purple" (click)="modalVisible = false"></button>
                  <button pButton type="button" label="Guardar" class="p-button-text btn_purple" (click)="saveRegistro()"></button>
                </div>
              </form>
            </p-dialog>
            <!-- Modal -->
            <!--contenido-->
          </p-card>
            </div>
        </div>
      </div>
    </div>
  </div>
</p-card>
`;
}
// 📌 Función para generar la interfaz con los campos en una sola línea correctamente
function generateFormTsContent(name: string, fields: string[]): string {
  const className = capitalize(name);
  const formFields = fields.map((field) => `${field}: ['', Validators.required]`).join(',\n      ');

  const tableHeaders = fields.map(
    (field) => `<th pSortableColumn="${field}">${capitalize(field)} <p-sortIcon field="${field}"></p-sortIcon></th>`
  ).join('\n          ');

  const tableRows = fields.map(
    (field) => `<td>{{ ${name}.${field} }}</td>`
  ).join('\n          ');

  return `import { Component } from '@angular/core';

@Component({
  selector: 'app-${name}-form',
  templateUrl: './form.component.html'
})
export class FormComponent {}`;
}



// 📌 Función para capitalizar la primera letra
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

