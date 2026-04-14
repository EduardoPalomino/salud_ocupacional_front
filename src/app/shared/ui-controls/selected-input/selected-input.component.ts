import {  Component, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'selected-input',
  templateUrl: './selected-input.component.html',
  styleUrls: ['./selected-input.component.scss']
})
export class SelectedInputComponent {
  @Input() label: string = '';
  @Input() options: string[] = [];
  selected: { label: string; value: string }[] = [];
  @Input() selectedValue: string = '';
  @Output() selectedValueChange = new EventEmitter<string>();

  onSelectChange(event: any) {
    this.selectedValue = event.target.value;
    this.selectedValueChange.emit(this.selectedValue);
  }
}
