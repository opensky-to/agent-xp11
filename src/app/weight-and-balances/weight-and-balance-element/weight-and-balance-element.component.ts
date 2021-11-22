import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-weight-and-balance-element',
  templateUrl: './weight-and-balance-element.component.html',
  styleUrls: ['./weight-and-balance-element.component.scss'],
})
export class WeightAndBalanceElementComponent implements OnInit {
  @Input() value?: number;

  constructor() {}

  ngOnInit(): void {}
}
