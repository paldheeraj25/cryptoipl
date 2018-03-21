import { Component, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-owner-modal-content',
  templateUrl: './owner-modal.component.html',
})
export class OwnerModalComponent {
  @Input() address;

  constructor(public activeModal: NgbActiveModal) {
  }

}