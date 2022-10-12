import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConsultaApiService } from './services/consulta-api.service'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { NavegationComponent } from './components/navegation/navegation.component';
import { FooterComponent } from './components/footer/footer.component';
import { ActivationstatusComponent } from './components/activationstatus/activationstatus.component';
import { RequeststatusComponent } from './components/requeststatus/requeststatus.component';
import { RequestrecordComponent } from './components/requestrecord/requestrecord.component';
import { ActivationrecordsComponent } from './components/activationrecords/activationrecords.component';

@NgModule({
  declarations: [
    AppComponent,
    ActivationrecordsComponent,
    ActivationstatusComponent,
    FooterComponent,
    NavegationComponent,
    RequestrecordComponent,
    RequeststatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatRadioModule,
    MatNativeDateModule,
  ],
  providers: [
    ConsultaApiService,
    {provide: MAT_DATE_LOCALE, useValue: 'es-GB'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
