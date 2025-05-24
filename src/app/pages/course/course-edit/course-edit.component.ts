import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../../services/course.service';
import { Course } from '../../../model/course';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-course-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './course-edit.component.html',
  styleUrl: './course-edit.component.css'
})
export class CourseEditComponent {
  form: FormGroup;
  id: number;
  isEdit: boolean;

  constructor(
    private route: ActivatedRoute, // ruta activa
    private courseService: CourseService,
    private router: Router //no permite movernos de una página a otra
  ){}

  ngOnInit(): void{
    this.form = new FormGroup({
      idCourse: new FormControl(), // DECIA 0, pero generaba conflicto de transient value
      code: new FormControl(''),
      name: new FormControl('')
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }

  initForm(){
    if(this.isEdit){
      this.courseService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idCourse: new FormControl(data.idCourse),
          code: new FormControl(data.code),
          name: new FormControl(data.name)
        });
      });
    }
  }

  operate(){
    const course: Course = new Course();
    course.idCourse = this.form.value['idCourse'];
    // const x = this.form.controls['idCourse'].value;
    // const y = this.form.get('idCourse').value;
    course.code = this.form.value['code'];
    course.name = this.form.value['name'];

    if(this.isEdit){
      //EDIT
      // this.courseService.update(this.id, course).subscribe();
      // PRACTICA COMUN, NO IDEAL      
      this.courseService.update(this.id, course).subscribe(() => {
        this.courseService.findAll().subscribe(data => {
          this.courseService.setCourseChange(data);
          this.courseService.setMessageChange('UPDATED!');
        })
      });

    }else{
      //SAVE
      // this.courseService.save(course).subscribe();
      // PRACTICA IDEAL
      this.courseService.save(course)
        .pipe(switchMap(() => this.courseService.findAll()))
        .subscribe(data => {
          this.courseService.setCourseChange(data);
          this.courseService.setMessageChange('CREATED!');
        });
    }

    this.router.navigate(['pages/course']);
  }

}
