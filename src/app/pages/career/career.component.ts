import { Component, inject, ViewChild } from '@angular/core';
import { Career } from '../../model/career';
import { CareerService } from '../../services/career.service';
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
  templateUrl: './career.component.html',
  styleUrl: './career.component.css'
})
export class CareerComponent {
  dataSource: MatTableDataSource<Career>;

  columnsDefinitions = [
    { def: 'idCourse', label: 'idCourse', hide: true },
    { def: 'code', label: 'code', hide: false },
    { def: 'name', label: 'name', hide: false },
    { def: 'actions', label: 'actions', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private careerService: CareerService,
    private _snackBar: MatSnackBar
  ){}

  ngOnInit(): void {

    this.careerService.findAll().subscribe((data) => {
      this.createTable(data);
    });

    this.careerService.getCareerChange().subscribe(data => this.createTable(data))
  
   this.careerService.getMessageChange().subscribe(
    data => this._snackBar.open(data,'INFO', {duration: 2000, horizontalPosition: 'right', verticalPosition:'bottom'})
   );
  }

  createTable(data: Career[]){
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
    this.careerService.delete(id)
      .pipe(switchMap( () => this.careerService.findAll()))
      .subscribe( data => {
        this.careerService.setCareerChange(data);
        this.careerService.setMessageChange('DELETED!');
      });
  }
}
