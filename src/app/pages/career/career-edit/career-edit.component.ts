import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Career } from '../../../model/career';
import { CareerService } from '../../../services/career.service';
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
  templateUrl: './career-edit.component.html',
  styleUrl: './career-edit.component.css'
})
export class CareerEditComponent {
  form: FormGroup;
  id: number;
  isEdit: boolean;

  constructor(
    private route: ActivatedRoute, 
    private careerService: CareerService,
    private router: Router 
  ){}

  ngOnInit(): void{
    this.form = new FormGroup({
      idCareer: new FormControl(), 
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
      this.careerService.findById(this.id).subscribe((data) => {
        this.form = new FormGroup({
          idCareer: new FormControl(data.idCareer),
          code: new FormControl(data.code),
          name: new FormControl(data.name)
        });
      });
    }
  }

  operate(){
    const career: Career = new Career();
    career.idCareer = this.form.value['idCareer'];
    // const x = this.form.controls['idCourse'].value;
    // const y = this.form.get('idCourse').value;
    career.code = this.form.value['code'];
    career.name = this.form.value['name'];

    if(this.isEdit){   
      this.careerService.update(this.id, career).subscribe(() => {
        this.careerService.findAll().subscribe(data => {
          this.careerService.setCareerChange(data);
          this.careerService.setMessageChange('UPDATED!');
        })
      });

    }else{
      //SAVE
      // this.courseService.save(course).subscribe();
      // PRACTICA IDEAL
      this.careerService.save(career)
        .pipe(switchMap(() => this.careerService.findAll()))
        .subscribe(data => {
          this.careerService.setCareerChange(data);
          this.careerService.setMessageChange('CREATED!');
        });
    }

    this.router.navigate(['pages/career']);
  }

}
