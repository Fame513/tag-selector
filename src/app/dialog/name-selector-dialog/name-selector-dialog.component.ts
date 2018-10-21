import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-name-selector-dialog',
  templateUrl: './name-selector-dialog.component.html',
  styleUrls: ['./name-selector-dialog.component.css']
})
export class NameSelectorDialogComponent implements OnInit {
  public categoryName = '';

  constructor() { }

  ngOnInit() {
  }

}
