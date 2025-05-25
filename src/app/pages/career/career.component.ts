import { Component, ViewChild } from '@angular/core';
import { Career } from '../../model/career';
import { CareerService } from '../../services/career.service';
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
  selector: 'app-career',
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
    MatDialogModule,
  ],
  templateUrl: './career.component.html',
  styleUrl: './career.component.css'
})
export class CareerComponent {
  dataSource: MatTableDataSource<Career>;

  columnsDefinitions = [
    { def: 'idCareer', label: 'ID', hide: true },
    { def: 'code', label: 'CODE', hide: false },
    { def: 'name', label: 'NAME', hide: false },
    { def: 'actions', label: 'Actions', hide: false },
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private careerService: CareerService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadCareers();
    
    this.careerService.getCareerChange().subscribe(data => this.createTable(data));
    
    this.careerService.getMessageChange().subscribe(
      data => this._snackBar.open(data, 'INFO', { 
        duration: 2000, 
        horizontalPosition: 'right', 
        verticalPosition: 'bottom' 
      })
    );
  }

  loadCareers() {
    this.careerService.findAll().subscribe(data => {
      this.createTable(data);
    });
  }

  createTable(data: Career[]) {
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
        this.careerService.delete(id)
          .pipe(switchMap(() => this.careerService.findAll()))
          .subscribe(data => {
            this.careerService.setCareerChange(data);
            this.careerService.setMessageChange('Career deleted successfully!');
          });
      }
    });
  }
}