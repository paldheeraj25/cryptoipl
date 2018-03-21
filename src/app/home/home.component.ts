import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
    model = {
        left: true,
        middle: false,
        right: false
    };

    staticMock: any = {};
    constructor() { }

    ngOnInit() {
        this.staticMock = {
            title: 'Crypto IPL',
            presentors: 'PRESENTED BY CRYPTO IPL TEAM'
        }
    }
}
