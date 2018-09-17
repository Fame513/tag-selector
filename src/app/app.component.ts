import { Component } from '@angular/core';
import {FirebaseService} from './services/firebase.service';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isUserLogged: Observable<boolean>;
  constructor(public readonly filrebaseService: FirebaseService){
    this.isUserLogged = this.filrebaseService.stage().pipe(
      map(user => !!user)
    )
  }
}
