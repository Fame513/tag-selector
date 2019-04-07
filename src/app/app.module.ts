import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
  MatButtonModule, MatCheckboxModule, MatChipsModule, MatDialogModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule, MatProgressBarModule, MatProgressSpinnerModule,
  MatSelectModule, MatSlideToggleModule,
  MatToolbarModule
} from '@angular/material';
import { MainPageComponent } from './main-page/main-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import {environment} from '../environments/environment';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {FirebaseService} from './services/firebase.service';
import {FormsModule} from '@angular/forms';
import { ClipboardModule } from 'ngx-clipboard';
import { LoadingComponent } from './loading/loading.component';
import { NameSelectorDialogComponent } from './dialog/name-selector-dialog/name-selector-dialog.component';
import { ConfirmDialogComponent } from './dialog/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    LoginPageComponent,
    LoadingComponent,
    NameSelectorDialogComponent,
    ConfirmDialogComponent
  ],
  entryComponents: [
    NameSelectorDialogComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatProgressBarModule,
    MatDialogModule,
    ClipboardModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
