import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-grid-element',
  templateUrl: './main-grid-element.component.html',
  styleUrls: ['./main-grid-element.component.scss']
})
export class MainGridElementComponent implements OnInit {

  @Input() title?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
