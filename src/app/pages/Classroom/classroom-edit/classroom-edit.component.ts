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
    RouterLink
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
      Course: new FormControl(null),
      Teacher: new FormControl(null),
      Career: new FormControl(null),
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
        Course: data.Course,
        Teacher: data.Teacher,
        Career: data.Career,
        semester: data.semester,
        level: data.level,
        status: data.status
      });
    });
  }

  operate() {
    const classroom: Classroom = {
      ...this.form.value
    };

    if(this.isEdit) {
      this.classroomService.update(this.id, classroom).subscribe(() => {
        this.classroomService.findAll().subscribe(data => {
          this.classroomService.setClassroomChange(data);
          this.classroomService.setMessageChange('AULA ACTUALIZADA!');
        });
      });
    } else {
      this.classroomService.save(classroom)
        .pipe(switchMap(() => this.classroomService.findAll()))
        .subscribe(data => {
          this.classroomService.setClassroomChange(data);
          this.classroomService.setMessageChange('AULA CREADA!');
        });
    }

    this.router.navigate(['pages/classroom']);
  }
}