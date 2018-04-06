import { Component, HostListener, NgZone, OnInit, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { ContractService } from '../providers/contract/contract.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { OwnerModalComponent } from './owner-modal.component';
import { UtilityService } from '../providers/utility.service';

@Component({
  selector: 'app-market-place',
  templateUrl: './market-place.component.html',
  styleUrls: ['./market-place.component.scss']
})

export class MarketPlaceComponent implements OnInit, OnDestroy {

  public totalParticipant: Observable<number>;
  public participantArray: any[] = [];
  public comingsoonColl: any[] = [];
  public alerts: Array<IAlert> = [];
  private backup: Array<IAlert>;
  public purchaseSuccess: boolean;
  public purchaseFailure: boolean;
  public newOwner: string;
  public newPrice: string;
  public etherScan: string;
  timeInterval: any;
  countDown: string;

  constructor(
    private contractService: ContractService,
    private ref: ChangeDetectorRef,
    private modalService: NgbModal,
    private userService: UtilityService,
  ) {
    this.purchaseSuccess = true;
    this.purchaseFailure = true;
    this.loadTeams();
  }

  ngOnInit() {
    // console.log('inside market place component');
    this.contractService.getUserBalance().then(balance => {
      // console.log(balance);
    });
    this.totalParticipant = this.getTotalSupply();
    this.alerts.push({
      id: 1,
      type: 'success',
      message: 'This is an success alert',
    }, {
        id: 2,
        type: 'danger',
        message: 'This is a failure alert',
        icon: 'nc-bell-55'
      });
    this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));

    // event for token purchased need to be configured.
    this.contractService.tokenPurchased.subscribe((value: any) => {
      if (value != null) {
        this.newOwner = value.name;
        this.newPrice = value.newPrice.toString();
        if (!this.ref['destroyed']) {
          this.ref.detectChanges();
        }
      }
    });
  }

  ngOnDestroy() { }

  loadTeams() {
    this.contractService.totalParticipant.subscribe((value) => {
      this.participantArray = [];
      for (let i = 0; i <= parseInt(value, 10); i++) {
        this.contractService.getParticipant(i).then(result => {
          const participant: { name: string, price: string, owner: string } = { name: '', price: '', owner: '' };
          participant.name = result[0];
          participant.price = result[1].toString();
          participant.owner = result[2];
          this.participantArray.push(participant);
          this.timer();
          if (!this.ref['destroyed']) {
            this.ref.detectChanges();
          }
          this.comingsoonColl[0] = this.participantArray[0];
        }).catch(error => {
          console.log(error);
        });
      }
    });
  }

  showPrice(id: number): any {
    this.contractService.getParticipant(id).then(result => {
      // console.log(result);
      // console.log(result[0] + ' price is: ' + result[1].toString() + ' wei');
    });
  }

  buyParticipant(index: number, price: number) {
    return this.contractService.buyParticipant(index, price).then(result => {
      console.log(result);
      this.etherScan = 'https://etherscan.io/address/' + result;
      this.purchaseSuccess = false;
    }).catch(error => {
      console.log(error);
      this.purchaseFailure = false;
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

  public closeSuccessAlert() {
    this.purchaseSuccess = true;
  }
  public closeFailureAlert() {
    this.purchaseFailure = true;
  }

  timer() {
    const countDownDate = new Date('04/13/2018').getTime();
    const timeInterval = setInterval( () => {
      const now = new Date().getTime();
      const distance = countDownDate - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      const element = document.getElementById('0');
      if (element) {
        element.innerHTML = days + 'D ' + hours + 'H '
          + minutes + 'M ' + seconds + 'S ';
      }

      const element2 = document.getElementById('1');
      if (element2) {
        element2.innerHTML = days + 'D ' + hours + 'H '
          + minutes + 'M ' + seconds + 'S ';
      }

      if (distance === 0) {
        clearInterval(timeInterval);
        // this.participantArray[this.participantArray.length] = this.comingsoonColl[0];
        this.comingsoonColl = [];
      }
    }, 1000);
  }
}

export interface IAlert {
  id: number;
  type: string;
  message: string;
  icon?: string;
}

