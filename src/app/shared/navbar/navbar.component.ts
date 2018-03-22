import { Component, OnInit, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ContractService } from '../../providers/contract/contract.service';
import { ModalPopupComponent } from '../modalPopup/modalPopup.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  private toggleButton: any;
  private sidebarVisible: boolean;
  title = 'Crypto IPL';
  account: string;

  constructor(public location: Location,
    private element: ElementRef,
    private contractService: ContractService,
    private changeRef: ChangeDetectorRef,
    private modalService: NgbModal) {
    this.sidebarVisible = false;
  }

  ngOnInit() {
    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
    this.getAccount();
  }
  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const html = document.getElementsByTagName('html')[0];
    // console.log(html);
    // console.log(toggleButton, 'toggle');

    setTimeout(function () {
      toggleButton.classList.add('toggled');
    }, 500);
    html.classList.add('nav-open');

    this.sidebarVisible = true;
  };
  sidebarClose() {
    const html = document.getElementsByTagName('html')[0];
    // console.log(html);
    this.toggleButton.classList.remove('toggled');
    this.sidebarVisible = false;
    html.classList.remove('nav-open');
  };
  sidebarToggle() {
    // const toggleButton = this.toggleButton;
    // const body = document.getElementsByTagName('body')[0];
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  };
  isHome() {
    const titlee = this.location.prepareExternalUrl(this.location.path());

    if (titlee === '/home') {
      return true;
    } else {
      return false;
    }
  }
  isDocumentation() {
    const titlee = this.location.prepareExternalUrl(this.location.path());
    if (titlee === '/documentation') {
      return true;
    } else {
      return false;
    }
  }

  getAccount() {
    const _this = this;
    this.contractService.getAccount().then(result => {
      _this.account = result;
    })
  }

  getTokensOfOwner() {
    this.contractService.tokensOfOwner().then(result => {
      const modalRef = this.modalService.open(ModalPopupComponent);
      modalRef.componentInstance.teams = result;
    });
  }
}
