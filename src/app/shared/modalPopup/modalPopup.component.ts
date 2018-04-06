import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContractService } from '../../providers/contract/contract.service';

@Component({
  selector: 'modal-popup-content',
  templateUrl: './modal-popup.component.html',
})
export class ModalPopupComponent implements OnInit {
  @Input() header: any;
  @Input() description: any;

  myTeam: any[] = [];

  constructor(public activeModal: NgbActiveModal,
    private contractService: ContractService,
    private ref: ChangeDetectorRef
  ) {

  }

  ngOnInit() { }
}
