import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RequeststatusComponent } from './components/requeststatus/requeststatus.component'
import { ActivationstatusComponent } from './components/activationstatus/activationstatus.component'
import { RequestrecordComponent } from './components/requestrecord/requestrecord.component'
import { ActivationrecordsComponent } from './components/activationrecords/activationrecords.component'

const routes: Routes = [
  {
    path: 'estado-solicitud',
    component: RequeststatusComponent
  },
  {
    path: 'estado-activacion',
    component: ActivationstatusComponent
  },
  {
    path: 'historial-solicitud',
    component: RequestrecordComponent
  },
  {
    path: 'historial-activacion',
    component: ActivationrecordsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
