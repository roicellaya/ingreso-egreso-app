import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AppState } from '../app.reducer';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import * as iEActions from '../ingreso-egreso/ingreso-egreso.actions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs: Subscription;
  ingresosSubs: Subscription;

  constructor(
    private store: Store<AppState>,
    private iEService: IngresoEgresoService,
  ) { }

  ngOnInit(): void {

    this.userSubs = this.store.select('user')
      .pipe(
        filter(auth => auth.user !== null)
      )
      .subscribe(({ user }) => {
        // console.log('user', user);
        this.ingresosSubs = this.iEService.initIngresosEgresosListener(user.uid)
          .subscribe(ingresosEgresosFB => {
            // console.log(ingresosEgresosFB);
            this.store.dispatch(iEActions.setItems({ items: ingresosEgresosFB }));
          });
      });

  }

  ngOnDestroy(): void {
    this.ingresosSubs.unsubscribe();
    this.userSubs.unsubscribe();
  }

}
