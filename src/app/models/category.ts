import {DocumentChangeAction, DocumentData} from '@angular/fire/firestore';

export class Category {
  id: string;
  title: string;
  tags: {[name: string]: string};


  static fromSnap(snap: DocumentChangeAction<DocumentData>): Category {
    const category = new Category();
    const data = snap.payload.doc.data();
    category.id = snap.payload.doc.id;
    category.title = data.name;
    category.tags$ = data.tags;
    return category;
  }

}
