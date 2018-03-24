import { Component, OnInit } from '@angular/core';

import { ContractService } from './../providers/contract/contract.service';
import { RegisterService } from './register.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

    user: any = {};
    saveSuccess: boolean;
    saveFailure: boolean;
    constructor(private contractService: ContractService,
    private registerService: RegisterService) { }

    ngOnInit() {
        this.getAccount();
    }

    getAccount() {
        this.contractService.getAccount().then(result => {
            this.user.wallet = result;
            this.getEmail();
        });
    }

    getEmail() {
        this.registerService.getEmail(this.user.wallet).subscribe(result => {
            console.log(result);
            if (result) {
                this.user = result;
            }
        })
    }

    public close() {
        this.saveSuccess = false;
        this.saveFailure = false;
    }

    saveInfo() {
        this.registerService.saveInfo(this.user).subscribe( result => {
            this.saveSuccess = true;
            this.saveFailure = false;
        }, error => {
            this.saveFailure = true;
            this.saveSuccess = false;
        });
    }
}
