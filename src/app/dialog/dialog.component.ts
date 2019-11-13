import { Component, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

export interface UsersData {
  data: {
    name: string;
    surname: string;
    birth: string;
    powers: string;
  };
  action: string;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent {

  action: string;
  localData: any;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: UsersData) {
    if (data.data) {
      this.localData = {...data.data};
      this.localData.birth = new Date(data.data.birth);
    } else {
      this.localData = {name: '', surname: '', birth: '', powers: ''};
    }
    this.action = data.action;
  }



  doAction() {
    this.dialogRef.close({event: this.action, data: this.localData});
  }

  closeDialog() {
    this.dialogRef.close({event: 'Cancel'});
  }

  validator() {
    if (
      this.localData.name &&
      this.localData.surname &&
      this.localData.birth &&
      this.localData.powers) {
      return false;
    } else {
      return true;
    }
  }
}
