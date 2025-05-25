import { Component, ViewChild } from '@angular/core';
import { Classroom } from '../../model/classroom';
import { ClassroomService } from '../../services/classroom.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { CourseService } from '../../services/course.service';
import { TeacherService } from '../../services/teacher.service';
import { CareerService } from '../../services/career.service';
import { Course } from '../../model/course';
import { Teacher } from '../../model/teacher';
import { Career } from '../../model/career'
import { CommonModule } from '@angular/common';
import { ConfirmationDeleteComponent } from './confirmation-delete/confirmation-delete.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-classroom',
  standalone: true, 
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
    MatButtonModule,
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './classroom.component.html',
  styleUrl: './classroom.component.css'
})
export class ClassroomComponent {
  dataSource: MatTableDataSource<Classroom>;
  
  courses: Course[] = [];
  teachers: Teacher[] = [];
  careers: Career[] = [];
  
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
    private courseService: CourseService,
    private teacherService: TeacherService,
    private careerService: CareerService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadDependencies(); 
    this.classroomService.getClassroomChange().subscribe(data => this.createTable(data));
    this.loadClassrooms();
    
    this.classroomService.getMessageChange().subscribe(
      data => this._snackBar.open(data, 'INFO', { 
        duration: 2000, 
        horizontalPosition: 'right', 
        verticalPosition: 'bottom' 
      })
    );
  }

  loadDependencies() {
  this.courseService.findAll().subscribe(data => this.courses = data);
  this.teacherService.findAll().subscribe(data => this.teachers = data);
  this.careerService.findAll().subscribe(data => this.careers = data);
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

  delete(id: number, name: string) {
    const dialogRef = this.dialog.open(ConfirmationDeleteComponent, {
      data: { name: name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.classroomService.delete(id)
          .pipe(switchMap(() => this.classroomService.findAll()))
          .subscribe(data => {
            this.classroomService.setClassroomChange(data);
            this.classroomService.setMessageChange('Aula eliminada correctamente!');
          });
      }
    });
  }

formatRelation(id: number, type: 'course' | 'teacher' | 'career'): string {
    let entity;
    switch (type) {
      case 'course':
        entity = this.courses.find(c => c.idCourse === id);
        break;
      case 'teacher':
        entity = this.teachers.find(t => t.idTeacher === id);
        if (entity) {
          return `${entity.fatherLastname} ${entity.motherLastname}, ${entity.firstName} ${entity.secondName}`;
        }
        break;
      case 'career':
        entity = this.careers.find(c => c.idCareer === id);
        break;
      default:
        return '';
    }
    return entity ? entity.name : 'No encontrado';
  }

  formatStatus(status: boolean): string {
    return status ? 'Activo' : 'Inactivo';
  }
}