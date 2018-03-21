import { Component, HostListener, NgZone, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { ContractService } from '../providers/contract/contract.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { OwnerModalComponent } from './owner-modal.component';


@Component({
  selector: 'app-market-place',
  templateUrl: './market-place.component.html',
  styleUrls: ['./market-place.component.scss']
})

export class MarketPlaceComponent implements OnInit {

  public totalParticipant: Observable<number>;
  public participantArray: any[] = [];

  constructor(
    private contractService: ContractService,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal
  ) {
    this.contractService.tokenPurchased.subscribe((value: any) => {
      // console.log('constructer');
      // console.log(value);
    });
    this.contractService.totalParticipant.subscribe((value) => {
      for (let i = 0; i < parseInt(value, 10); i++) {
        this.contractService.getParticipant(i).then(result => {
          const participant: { name: string, price: string, owner: string } = { name: '', price: '', owner: '' };
          participant.name = result[0];
          participant.price = result[1].toString();
          participant.owner = result[2];
          this.participantArray.push(participant);
          this.ref.detectChanges();
          // return participant;
          console.log(result[0] + ' price is: ' + result[1].toString() + ' wei');
        });
      }
      // console.log(this.participantArray);
    });
  }

  ngOnInit() {
    // console.log('inside market place component');
    this.contractService.getUserBalance().then(balance => {
      // console.log(balance);
    });
    this.totalParticipant = this.getTotalSupply();
  }

  showPrice(id: number): any {
    this.contractService.getParticipant(id).then(result => {
      // console.log(result);
      // console.log(result[0] + ' price is: ' + result[1].toString() + ' wei');
    });
  }

  buyParticipant(index: number, price: number) {
    return this.contractService.buyParticipant(index, price).then(result => {
      // console.log(result);
    });
  }

  getTotalSupply(): any {
    return this.contractService.totalSupply().then(result => {
      // console.log('inside getTotalSupply');
      // console.log(result.toString());
      return result;
    });
  }

  public async getParticipant(i: any) {
    this.contractService.getParticipant(i).then(result => {
      const participant: { name: string, price: string, owner: string } = { name: '', price: '', owner: '' };
      participant.name = result[0];
      participant.price = result[1].toString();
      participant.owner = result[2];
      console.log(participant);
      return participant;
      // console.log(result[0] + ' price is: ' + result[1].toString() + ' wei');
    });
  }

  showOwner(owner: string) {
    // OwnerModalComponent
    const modalRef = this.modalService.open(OwnerModalComponent);
    modalRef.componentInstance.address = owner;
  }

  payout(): any {
    // call payout method in contract.
    this.contractService.payout();
  }
}
