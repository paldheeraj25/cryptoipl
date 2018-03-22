import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContractService } from '../../providers/contract/contract.service';

@Component({
  selector: 'modal-popup-content',
  templateUrl: './modal-popup.component.html',
})
export class ModalPopupComponent implements OnInit {
  @Input() teams: any;

  myTeam: any[] = [];

  constructor(public activeModal: NgbActiveModal,
    private contractService: ContractService,
    private ref: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    for (let i of this.teams) {
      this.contractService.getParticipant(i).then(result => {
        const participant: { name: string, price: string, owner: string } = { name: '', price: '', owner: '' };
        participant.name = result[0];
        participant.price = result[1].toString();
        participant.owner = result[2];
        this.myTeam.push(participant);
        this.ref.detectChanges();
        // console.log(result[0] + ' price is: ' + result[1].toString() + ' wei');
      });
    }
  }
}