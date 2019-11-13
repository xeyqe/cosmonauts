import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatSort, MatDialog, MatPaginator } from '@angular/material';

import { Apollo } from 'apollo-angular';

import gql from 'graphql-tag';
import { Subscription } from 'rxjs';

import { Cosmonaut, Query } from '../types';
import { DialogComponent } from '../dialog/dialog.component';

export interface Cosmonaut {
  id: string;
  name: string;
  surname: string;
  birth: string;
  powers: string;
}

const removeCosmonaut = gql`
  mutation removeCosmonaut($idecko: String!) {
    removeCosmonaut(id: $idecko) {
      id
    }
  }`;

const addCosmonaut = gql`
  mutation addCosmonaut($name: String!, $surname: String!, $birth: String!, $powers: String!) {
    addCosmonaut(name: $name, surname: $surname, birth: $birth, powers: $powers) {
      id
    }
  }`;

const updateCosmonaut = gql`
  mutation updateCosmonaut($id: String!, $name: String!, $surname: String!, $birth: String!, $powers: String!) {
    updateCosmonaut(id: $id, name: $name, surname: $surname, birth: $birth, powers: $powers) {
      name
    }
  }`;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['name', 'surname', 'birth', 'powers', 'action'];

  sortedData: Cosmonaut[];
  dataSource = new MatTableDataSource(this.sortedData);

  private querySubscription: Subscription;

  constructor(private apollo: Apollo, public dialog: MatDialog) {
  }

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  ngOnInit() {
    this.querySubscription = this.apollo.watchQuery<any>({
      query: gql`
        query {
          cosmonauts {
            id
            name
            surname
            birth
            powers
          }
        }
      `
    })
      .valueChanges
      .subscribe(({ data }) => {
        this.dataSource = new MatTableDataSource(data.cosmonauts);
        if (this.sort) {
          this.dataSource.sort = this.sort;
        }
        this.dataSource.paginator = this.paginator;
      });
  }

  removeCosmonaut(idecko: string) {
    this.apollo.mutate({
      mutation: removeCosmonaut,
      variables: { idecko }
    }).subscribe(({ data }) => {
      const newData = this.dataSource.data.filter((el) => el.id !== idecko );
      this.dataSource.data = newData;
    },(error) => {
      console.log('there was an error sending the query', error);
    });
  }

  addCosmonaut(name: string, surname: string, birth: string, powers: string) {
    this.apollo.mutate({
      mutation: addCosmonaut,
      variables: { name, surname, birth, powers }
    }).subscribe(({ data }) => {
      const id = data['addCosmonaut'].id;
      const newCosmonaut: Cosmonaut = { id, name, surname, birth, powers };
      const newData = this.dataSource.data;
      newData.push(newCosmonaut);

      this.dataSource.data = newData;
    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

  updateCosmonaut(id: string, name: string, surname: string, birth: string, powers: string) {
    this.apollo.mutate({
      mutation: updateCosmonaut,
      variables: { id, name, surname, birth, powers },

    }).subscribe(({ data }) => {
      const myArray = this.dataSource.data;

      const old = myArray.find((el) => el.id === id);
      const index = myArray.indexOf(old);
      myArray[index] = { id, name, surname, birth, powers };

      this.dataSource.data = myArray;

    }, (error) => {
      console.log('there was an error sending the query', error);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(action: string, data: Cosmonaut) {
    const dialogRef = this.dialog.open(DialogComponent, {data: {data, action}});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newDate = new Date(result.data.birth);
        const month = newDate.getUTCMonth() + 1;
        const day = newDate.getUTCDate();
        const year = newDate.getUTCFullYear();

        const dateString = year + '/' + month + '/' + day;
        if (result.event === 'Add') {
          this.addCosmonaut(result.data.name, result.data.surname, dateString, result.data.powers);
        } else if (result.event === 'Update') {
          this.updateCosmonaut(result.data.id, result.data.name, result.data.surname, dateString, result.data.powers);
        }
      }
    });
  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
