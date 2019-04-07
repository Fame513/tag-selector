import { Component } from '@angular/core';
import {FirebaseService} from './services/firebase.service';
import {map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isUserLogged: Observable<boolean>;
  public hasStatus = false;
  constructor(public readonly firebaseService: FirebaseService){
    this.isUserLogged = this.firebaseService.stage().pipe(
      tap(() => this.hasStatus = true),
      map(user => !!user)
    )
  }
}
