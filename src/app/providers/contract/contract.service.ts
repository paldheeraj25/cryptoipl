import { Injectable, OnInit } from '@angular/core';

import * as Web3 from 'web3';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UtilityService } from '../utility.service';

declare let require: any;
declare let window: any;

const contractAbi = require('./contract.api.json');
const contractAddress = '0x358533a2873f63a4ad64d1148ec362e5b1956e7c';

@Injectable()
export class ContractService implements OnInit {

  private _account: string = null;
  private _web3: any;
  private _contract: any;
  private _contractAddress: string;

  public tokenPurchased: any = new BehaviorSubject(null);
  public totalParticipant: any = new BehaviorSubject(null);

  constructor(private utilityService: UtilityService) {
    this.initializeWeb3();
  }

  ngOnInit() {
  }

  initializeWeb3() {
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      console.log('provider: Metamask')
      this._web3 = new Web3(window.web3.currentProvider);
    } else {
      console.warn('No Provider found trying to connect local provider');
      this._web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    }

    this._contract = this._web3.eth.contract(contractAbi).at(contractAddress);
  }

  public watcTokenSold() {
    // event handeling
    const tokenPurchased = this.tokenPurchased
    const _this = this;
    this._contract.TokenSold().watch(function (error, result) {
      if (!error) {
        // console.log('new owner:', result.args);
        result.args.newPrice = _this._web3.fromWei(result.args.newPrice, 'ether');
        tokenPurchased.next(result.args);
        _this.utilityService.sendEmail(result.args).subscribe(mailResult => {
          console.log(mailResult);
        });
      } else {
        // console.error('error: ' + error);
      }
    });
  }

  public async getAccount(): Promise<string> {
    if (this._account == null) {
      this._account = await new Promise((resolve, reject) => {
        this._web3.eth.getAccounts((err, accs) => {
          if (err != null) {
            // console.log('There was an error fetching your accounts.');
            return;
          }
          if (accs.length === 0) {
            alert(
              'Couldn\'t get any accounts! Make sure your Ethereum client or Metamask is configured correctly.'
            );
            return;
          }
          return resolve(accs[0]);
        })
      }) as string;
      this._web3.eth.defaultAccount = this._account;
    }
    // console.log(Promise.resolve(this._account));
    return Promise.resolve(this._account);
  }

  public async getUserBalance(): Promise<number> {
    const account = await this.getAccount();
    return new Promise((resolve, reject) => {
      const _web3 = this._web3;
      this._contract.balanceOf.call(account, function (err, result) {
        if (err != null) {
          return reject(err);
        }
        return resolve(_web3.fromWei(result));
      });
    }) as Promise<number>;
  }

  public async getParticipant(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const _web3 = this._web3;
      this._contract.getParticipant.call(id, function (err, result) {
        if (err != null) {
          return reject(err);
        }
        result[1] = _web3.fromWei(result[1].toString(), 'ether');
        return resolve(result);
      })
    }) as Promise<any>;
  }

  public async buyParticipant(id: number, price: number): Promise<any> {
    const _web3 = this._web3;
    const account = await this.getAccount();
    // console.log(this._web3.toWei(1, 'ether'));
    return new Promise((resolve, reject) => {
      this._contract.purchase(
        id,
        // to-do: get from and value dynamically.
        { from: this._web3.eth.defaultAccount, gas: 300000, value: this._web3.toWei(price, 'ether') },
        (err, result) => {
          if (err != null) {
            return reject(err);
          }
          this.watcTokenSold();
          return resolve(result);
        });
    }) as Promise<any>;
  }

  public async totalSupply(): Promise<number> {
    const totalParticipant = this.totalParticipant;
    return new Promise((resolve, reject) => {
      this._contract.totalSupply((err, result) => {
        if (err != null) {
          return reject(err);
        }
        totalParticipant.next(result.toString());
        return resolve(result);
      });
    }) as Promise<number>;
  }

  payout(): void {
    this._contract.payout(
      '0x3d4079B588630918f8966460CdB0908d71A551a3',
      { from: this._web3.eth.defaultAccount, gas: 300000 },
      (err, result) => {
        if (err != null) {
          console.log('err' + err);
        }
        console.log('result for transfer' + result);
      });
  }

  public async tokensOfOwner(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._contract.tokensOfOwner(this._web3.eth.defaultAccount,
        { from: this._web3.eth.defaultAccount, gas: 300000 },
        (err, result) => {
          if (err != null) {
            return reject(err);
          }
          return resolve(result);
        });
    }) as Promise<any>;
  }
}
