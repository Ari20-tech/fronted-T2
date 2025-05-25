import { Component, ViewChild } from '@angular/core';
import { TeacherService } from '../../services/teacher.service';
import { Teacher } from '../../model/teacher';
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
import { CommonModule } from '@angular/common';
import { ConfirmationDeleteComponent } from './confirmation-delete/confirmation-delete.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-teacher',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    RouterOutlet,
    RouterLink,
    MatSnackBarModule,
    MatButtonModule,
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.css']
})
export class TeacherComponent {
  dataSource: MatTableDataSource<Teacher>;
  
  columnsDefinitions = [
    { def: 'idTeacher', label: 'ID', hide: false },
    { def: 'code', label: 'Código', hide: false },
    { def: 'fullName', label: 'Nombre Completo', hide: false },
    { def: 'actions', label: 'Acciones', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private teacherService: TeacherService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadTeachers();
    
    this.teacherService.getTeacherChange().subscribe(data => this.createTable(data));
    
    this.teacherService.getMessageChange().subscribe(
      data => this._snackBar.open(data, 'INFO', { 
        duration: 2000, 
        horizontalPosition: 'right', 
        verticalPosition: 'bottom' 
      })
    );
  }

  loadTeachers() {
    this.teacherService.findAll().subscribe(data => this.createTable(data));
  }

  createTable(data: Teacher[]) {
    const teachersWithFullName = data.map(teacher => ({
      ...teacher,
      fullName: `${teacher.fatherLastname} ${teacher.motherLastname}, ${teacher.firstName} ${teacher.secondName}`
    }));
    
    this.dataSource = new MatTableDataSource(teachersWithFullName);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns(): string[] {
    return this.columnsDefinitions.filter(cd => !cd.hide).map(cd => cd.def);
  }

  applyFilter(e: Event) {
    const filterValue = (e.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  delete(id: number, fullName: string) {
    const dialogRef = this.dialog.open(ConfirmationDeleteComponent, {
      data: { name: fullName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.teacherService.delete(id)
          .pipe(switchMap(() => this.teacherService.findAll()))
          .subscribe(data => {
            this.teacherService.setTeacherChange(data);
            this.teacherService.setMessageChange('¡Profesor eliminado correctamente!');
          });
      }
    });
  }
}