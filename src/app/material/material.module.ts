import { NgModule } from '@angular/core';
import {
  MatInputModule,
  MatCardModule,
  MatSortModule,
  MatDialogModule,
  MatTableModule,
  MatIconModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatToolbarModule,
  MatSlideToggleModule,
  MatButtonModule
 } from '@angular/material';

const MaterialComponents = [
  MatInputModule,
  MatCardModule,
  MatSortModule,
  MatDialogModule,
  MatTableModule,
  MatIconModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatToolbarModule,
  MatSlideToggleModule,
  MatButtonModule
];

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule { }
