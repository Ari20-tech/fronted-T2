import { Component, inject, ViewChild } from '@angular/core';
import { CourseService } from '../../services/course.service';
import { Course} from '../../model/course';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { RouterLink, RouterOutlet } from '@angular/router';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { switchMap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-course',
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
  templateUrl: './course.component.html',
  styleUrl: './course.component.css'
})
export class CourseComponent {
  //displayedColumns: string[] = ['idCourse', 'code', 'name'];
  dataSource: MatTableDataSource<Course>;
  // publishers: Publisher[];
  columnsDefinitions = [
    { def: 'idCourse', label: 'idCourse', hide: true },
    { def: 'code', label: 'code', hide: false },
    { def: 'name', label: 'name', hide: false },
    { def: 'actions', label: 'actions', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private courseService: CourseService,
    private _snackBar: MatSnackBar
  ){}
  //courseService = inject(CourseService);

  ngOnInit(): void {
    // this.courseService.findAll().subscribe(data => console.log(data));
    // this.courseService.findAll().subscribe(data => this.courses = data);
    this.courseService.findAll().subscribe((data) => {
      this.createTable(data);
    });

    this.courseService.getCourseChange().subscribe(data => this.createTable(data))
  
   // this._snackBar.open('sample message','INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition:'bottom'});
   this.courseService.getMessageChange().subscribe(
    data => this._snackBar.open(data,'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition:'bottom'})
   );
  }

  createTable(data: Course[]){
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDisplayedColumns() {
    return this.columnsDefinitions.filter((cd) => !cd.hide).map((cd) => cd.def);
  }

  applyFilter(e: any) {
    this.dataSource.filter = e.target.value.trim();
  }

  delete(id: number){
    this.courseService.delete(id)
      .pipe(switchMap( () => this.courseService.findAll()))
      .subscribe( data => {
        this.courseService.setCourseChange(data);
        this.courseService.setMessageChange('DELETED!');
      });
  }
}
