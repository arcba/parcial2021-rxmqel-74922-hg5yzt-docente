import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Articulo } from '../../models/articulo';
import { ArticuloFamilia } from '../../models/articulo-familia';
import { MockArticulosService } from '../../services/mock-articulos.service';
import { MockArticulosFamiliasService } from '../../services/mock-articulos-familias.service';
import { ArticulosFamiliasService } from '../../services/articulos-familias.service';
import { ArticulosService } from '../../services/articulos.service';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { Deudor } from '../../models/deudor';
import { DeudoresService } from '../../services/deudores.service';

@Component({
  selector: 'app-deudores',
  templateUrl: './deudores.component.html',
  styleUrls: ['./deudores.component.css']
})
export class DeudoresComponent implements OnInit {
  Titulo = 'Deudores';
  TituloAccionABMC = {
    A: '(Agregar)',
    B: '(Eliminar)',
    M: '(Modificar)',
    C: '(Consultar)',
    L: '(Listado)'
  };
  AccionABMC = 'L'; // inicialmente inicia en el listado de articulos (buscar con parametros)
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...'
  };

  Items: Deudor[] = null;
  submitted: boolean = false;

  // opciones del combo activo
  OpcionesActivo = [
    { Id: null, Nombre: '' },
    { Id: true, Nombre: 'SI' },
    { Id: false, Nombre: 'NO' }
  ];

  FormRegistro: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private deudoresService: DeudoresService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.FormRegistro = this.formBuilder.group({
      DeudorId: [0],
      DeudorApeNom: [
        null,
        [Validators.required, Validators.minLength(5), Validators.maxLength(50)]
      ],
      DeudorMonto: [null, [Validators.required, Validators.pattern('^\\d{1,7}$')]],
      DeudorIncobrable: [false]
    });

    this.GetDeudores();
  }



  Agregar() {
    this.AccionABMC = 'A';
    this.FormRegistro.reset({DeudorId: 0 });
    this.submitted = false;
    this.FormRegistro.markAsUntouched();
  }
  GetDeudores() {
    this.deudoresService.get().subscribe((res: any) => {
      this.Items = res;
    });
  }

  Grabar() {
    this.submitted = true;
    if (this.FormRegistro.invalid) {
      return;
    }

    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormRegistro.value };

    
    // agregar post
    this.deudoresService.post(itemCopy).subscribe((res: any) => {
      this.Volver();
      this.modalDialogService.Alert('Registro agregado correctamente.');
      this.GetDeudores();
    });
  }
  // Volver desde Agregar/Modificar
  Volver() {
    this.AccionABMC = 'L';
  }

  ImprimirListado() {
    this.modalDialogService.Alert('Sin desarrollar...');
  }
}
