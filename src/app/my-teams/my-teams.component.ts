import { Component, OnInit } from '@angular/core';
import { ContractService } from './../providers/contract/contract.service';

import { UtilityService } from './../providers/utility.service';

@Component({
  selector: 'app-my-teams',
  templateUrl: './my-teams.component.html',
  styleUrls: ['./my-teams.component.scss']
})
export class MyTeamsComponent implements OnInit {

  teams = [];
  currentTotalWorth = 0;
  constructor(
    private contractService: ContractService,
    private utilityService: UtilityService
  ) {
    this.getTokensOfOwner();
  }

  ngOnInit() {
    this.getAccount()
  }

  getAccount() {
    const _this = this;
    this.contractService.getAccount().then(result => {
      // _this.account = result;
    })
  }

  getTokensOfOwner() {
    this.contractService.tokensOfOwner().then(result => {
      for (const item of result) {
        this.contractService.getParticipant(item).then(respose => {
          const team: { name: string, price: any, owner: string, usdPrice: any } = { name: '', price: '', owner: '', usdPrice: '' };
          team.name = respose[0];
          team.price = respose[1].toString();
          team.owner = respose[2];
          this.teams.push(team);
          this.utilityService.etherToCurrency().subscribe(response => {
            team.usdPrice = (Number((Number(team.price) / 1) * Number(response.USD))).toString();
            this.currentTotalWorth = this.currentTotalWorth + team.usdPrice;
          });
        });
      }
    });
  }

}
