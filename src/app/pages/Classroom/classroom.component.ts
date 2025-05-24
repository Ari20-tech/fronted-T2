import { Component, ViewChild } from '@angular/core';
import { Classroom } from '../../model/classroom';
import { ClassroomService } from '../../services/classroom.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-classroom',
  imports: [
    MatTableModule,
    MatIconModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    RouterOutlet,
    RouterLink,
    MatSnackBarModule,
    MatButtonModule
  ],
  templateUrl: './classroom.component.html',
  styleUrl: './classroom.component.css'
})
export class ClassroomComponent {
  dataSource: MatTableDataSource<Classroom>;
  
  columnsDefinitions = [
    { def: 'nrc', label: 'NRC', hide: false },
    { def: 'course', label: 'Curso', hide: false },
    { def: 'teacher', label: 'Profesor', hide: false },
    { def: 'career', label: 'Carrera', hide: false },
    { def: 'semester', label: 'Semestre', hide: false },
    { def: 'level', label: 'Nivel', hide: false },
    { def: 'status', label: 'Estado', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private classroomService: ClassroomService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadClassrooms();
    
    this.classroomService.getClassroomChange().subscribe(data => this.createTable(data));
  
    this.classroomService.getMessageChange().subscribe(
      data => this._snackBar.open(data, 'INFO', { 
        duration: 2000, 
        horizontalPosition: 'right', 
        verticalPosition: 'bottom' 
      })
    );
  }

  loadClassrooms() {
    this.classroomService.findAll().subscribe(data => {
      this.createTable(data);
    });
  }

  createTable(data: Classroom[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
  return this.columnsDefinitions
    .filter(cd => !cd.hide)
    .map(cd => cd.def);
}

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  delete(id: number) {
    this.classroomService.delete(id)
      .pipe(switchMap(() => this.classroomService.findAll()))
      .subscribe(data => {
        this.classroomService.setClassroomChange(data);
        this.classroomService.setMessageChange('Aula eliminada correctamente!');
      });
  }

  formatRelation(obj: any): string {
    return obj ? `${obj.name || obj.code || obj.nrc}` : '';
  }

  formatStatus(status: boolean): string {
    return status ? 'Activo' : 'Inactivo';
  }
}