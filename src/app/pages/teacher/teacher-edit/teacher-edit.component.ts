import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TeacherService } from '../../../services/teacher.service';
import { Teacher } from '../../../model/teacher';
import { switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    CommonModule
  ],
  standalone:true,
  templateUrl: './teacher-edit.component.html',
  styleUrl: './teacher-edit.component.css'
})
export class TeacherEditComponent {
form: FormGroup;
  id: number;
  isEdit: boolean;

  constructor(
    private route: ActivatedRoute,
    private teacherService: TeacherService,
    private router: Router
  ){}

  ngOnInit(): void{
    this.form = new FormGroup({
      idTeacher: new FormControl(),
      code: new FormControl(''),
      fatherLastname: new FormControl(''),
      motherLastname: new FormControl(''),
      firstName: new FormControl(''),
      secondName: new FormControl('')
    });

    this.route.params.subscribe(data => {
      this.id = data['id'];
      this.isEdit = data['id'] != null;
      this.initForm();
    });
  }


  initForm(){
    if(this.isEdit){
      this.teacherService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idTeacher: new FormControl(data.idTeacher),
          code: new FormControl(data.code),
          fatherLastname: new FormControl(data.fatherLastname),
          motherLastname: new FormControl(data.motherLastname),
          secondName: new FormControl(data.secondName),
          firstName: new FormControl(data.firstName),
        });
      });
    }
  }

  operate(){
    const teacher: Teacher = new Teacher();
    teacher.idTeacher = this.form.value['idTeacher'];

    teacher.code = this.form.value['code'];
    teacher.fatherLastname = this.form.value['fatherLastname'];
    teacher.motherLastname = this.form.value['motherLastname'];
    teacher.secondName = this.form.value['secondName'];
    teacher.firstName = this.form.value['firstName'];

    if(this.isEdit){
    
      this.teacherService.update(this.id, teacher).subscribe(() => {
        this.teacherService.findAll().subscribe(data => {
          this.teacherService.setTeacherChange(data);
          this.teacherService.setMessageChange('UPDATED!');
        })
      });

    }else{
      this.teacherService.save(teacher)
        .pipe(switchMap(() => this.teacherService.findAll()))
        .subscribe(data => {
          this.teacherService.setTeacherChange(data);
          this.teacherService.setMessageChange('CREATED!');
        });
    }

    this.router.navigate(['pages/teacher']);
  }

}
