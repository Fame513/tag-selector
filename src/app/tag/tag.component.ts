import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tag} from '../models/Tag';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {

  @Input()
  tag: Tag;

  @Output()
  remove: EventEmitter<void> = new EventEmitter();

  @Input()
  isSelected: boolean;

  constructor() {
  }

  ngOnInit() {
  }

  removeEvent(event) {
    event.stopPropagation();
    this.remove.emit();
  }
}
