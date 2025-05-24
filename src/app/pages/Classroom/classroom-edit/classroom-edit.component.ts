import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Classroom } from '../../../model/classroom';
import { ClassroomService } from '../../../services/classroom.service';
import { CourseService } from '../../../services/course.service';
import { TeacherService } from '../../../services/teacher.service';
import { CareerService } from '../../../services/career.service';
import { switchMap } from 'rxjs';
import { Course } from '../../../model/course';
import { Teacher } from '../../../model/teacher';
import { Career } from '../../../model/career';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-classroom-edit',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    RouterLink,
    MatCheckboxModule,
    CommonModule
  ],
  templateUrl: './classroom-edit.component.html',
  styleUrls: ['./classroom-edit.component.css']
})
export class ClassroomEditComponent {
  form: FormGroup;
  id: number;
  isEdit: boolean;
  courses: Course[] = [];
  teachers: Teacher[] = [];
  careers: Career[] = [];

  constructor(
    private route: ActivatedRoute,
    private classroomService: ClassroomService,
    private courseService: CourseService,
    private teacherService: TeacherService,
    private careerService: CareerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDependencies();
    this.initForm();

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      if(this.isEdit) {
        this.loadClassroomData();
      }
    });
  }

  loadDependencies() {
    this.courseService.findAll().subscribe(data => this.courses = data);
    this.teacherService.findAll().subscribe(data => this.teachers = data);
    this.careerService.findAll().subscribe(data => this.careers = data);
  }

  initForm() {
      this.form = new FormGroup({
          idClassroom: new FormControl(),
          nrc: new FormControl(''),
          idCourse: new FormControl(null), // <-- Cambiar de "course" a "idCourse"
          idTeacher: new FormControl(null), // <-- Cambiar de "teacher" a "idTeacher"
          idCareer: new FormControl(null), // <-- Cambiar de "career" a "idCareer"
          semester: new FormControl(''),
          level: new FormControl(''),
          status: new FormControl(true)
      });
  }

  loadClassroomData() {
    this.classroomService.findById(this.id).subscribe((data) => {
      this.form.patchValue({
        idClassroom: data.idClassroom,
        nrc: data.nrc,
        idCourse: data.idCourse.idCourse, // <-- Asignar el ID del curso
        idTeacher: data.idTeacher.idTeacher, // <-- Asignar el ID del profesor
        idCareer: data.idCareer.idCareer,
        semester: data.semester,
        level: data.level,
        status: data.status
      });
    });
  }

operate() {
    if (this.form.invalid) {
        return; // No operar si el formulario es inválido
    }

    // Crear el objeto classroom asegurando que las propiedades coincidan con el backend
    const classroom: Classroom = {
        idClassroom: this.form.value.idClassroom,
        nrc: this.form.value.nrc,
        idCourse: this.form.value.idCourse, // <-- Usar idCourse
        idTeacher: this.form.value.idTeacher, // <-- Usar idTeacher
        idCareer: this.form.value.idCareer,
        semester: this.form.value.semester,
        level: this.form.value.level,
        status: this.form.value.status
    };

    if (this.isEdit) {
        this.classroomService.update(this.id, classroom).subscribe({
            next: () => {
                this.classroomService.findAll().subscribe({
                    next: (data) => {
                        this.classroomService.setClassroomChange(data);
                        this.classroomService.setMessageChange('AULA ACTUALIZADA!');
                        this.router.navigate(['pages/classroom']);
                    },
                    error: (err) => {
                        console.error('Error al cargar aulas:', err);
                        // Puedes mostrar un mensaje de error al usuario
                    }
                });
            },
            error: (err) => {
                console.error('Error al actualizar aula:', err);
                // Puedes mostrar un mensaje de error al usuario
            }
        });
    } else {
        this.classroomService.save(classroom).pipe(
            switchMap(() => this.classroomService.findAll())
        ).subscribe({
            next: (data) => {
                this.classroomService.setClassroomChange(data);
                this.classroomService.setMessageChange('AULA CREADA!');
                this.router.navigate(['pages/classroom']);
            },
            error: (err) => {
                console.error('Error al crear aula:', err);
                // Puedes mostrar un mensaje de error al usuario
            }
        });
    }
}
}