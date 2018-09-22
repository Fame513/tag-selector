import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth, firestore} from 'firebase/app';
import {Observable} from 'rxjs';
import {Category} from '../models/category';
import {first, flatMap, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private readonly db: AngularFirestore,
              private readonly afAuth: AngularFireAuth) {
  }

  login() {
    return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  stage() {
    return this.afAuth.authState;
  }

  getCategories(): Observable<Category[]> {
    return this.stage().pipe(
      flatMap(user => user ?
        this.db.collection('users').doc(user.uid).collection('categories').snapshotChanges()
          .pipe(map(snap => snap.map(sn => Category.fromSnap(sn))))
        : [])
    );
  }

  async addTag(collection: string, tag: string) {
    const user = await this.stage().pipe(first()).toPromise();

    if (user) {
      return this.db.collection('users').doc(user.uid)
        .collection('categories').doc(collection)
        .set({tags: {[this.db.createId()]: tag}}, {merge: true})
    }
  }

  async addCategory(name: string) {
    const user = await this.stage().pipe(first()).toPromise();
    if (user) {
      return this.db.collection('users').doc(user.uid)
        .collection('categories').doc(this.db.createId())
        .set({name})
    }
  }

  async removeCategory(categoryId: string) {
    const user = await this.stage().pipe(first()).toPromise();

    if (user) {
      return this.db.collection('users').doc(user.uid)
        .collection('categories').doc(categoryId)
        .delete();
    }
  }

  async remoseTag(collectionId: string, tagId: string) {
    const user = await this.stage().pipe(first()).toPromise();

    if (user) {
      return this.db.collection('users').doc(user.uid)
        .collection('categories').doc(collectionId)
        .set({tags: {[tagId]: firestore.FieldValue.delete()}}, {merge: true})
    }
  }
}
