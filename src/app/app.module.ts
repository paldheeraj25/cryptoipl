import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { HomeModule } from './home/home.module';
import { MarketPlaceComponent } from './marketPlace/market-place.component';
// services
import { ContractService } from './providers/contract/contract.service';
import { RegisterService } from './signup/register.service';
import { UtilityService } from './providers/utility.service';

import { OwnerModalComponent } from './marketPlace/owner-modal.component';
import { ModalPopupComponent } from './shared/modalPopup/modalPopup.component';
import { MyTeamsComponent } from './my-teams/my-teams.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LandingComponent,
    ProfileComponent,
    NavbarComponent,
    FooterComponent,
    MarketPlaceComponent,
    OwnerModalComponent,
    ModalPopupComponent,
    MyTeamsComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    HomeModule
  ],
  providers: [ContractService, RegisterService, UtilityService],
  bootstrap: [AppComponent],
  entryComponents: [
    OwnerModalComponent,
    ModalPopupComponent
  ]
})
export class AppModule { }
