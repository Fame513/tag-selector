import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {Category} from '../models/category';
import {Tag} from '../models/Tag';
import {combineLatest, Observable, Subject} from 'rxjs';
import {first, flatMap, map, tap, withLatestFrom} from 'rxjs/operators';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  public tags$: Observable<Tag[]>;
  public selectedTags: Tag[] = [];
  public categories$: Observable<Category[]>;
  public selectedCategory$: Subject<string> = new Subject<string>();
  public addCategoryEvent$: Subject<string> = new Subject<string>();
  public addTagEvent$: Subject<string> = new Subject<string>();
  public addAllEvent$: Subject<void> = new Subject();
  public removeCategoryEvent$: Subject<string> = new Subject<string>();
  public isLoading = true;

  public isEditMode = false;
  public hasComma = true;
  public hasHashtag = false;
  constructor(private readonly firebaseService: FirebaseService) {
    this.categories$ = this.firebaseService.getCategories().pipe(
      tap(() => this.isLoading = false),
      map(cats => this.sortByString(cats, 'title'))
    );
    this.tags$ = combineLatest(this.categories$, this.selectedCategory$).pipe(
      this.filterTags(),
      map(tags => this.sortByString(tags, 'name'))
    );
    this.addCategoryEvent$.pipe(map(newCat => this.firebaseService.addCategory(newCat))).subscribe();

    this.removeCategoryEvent$.pipe(
      withLatestFrom(this.categories$, (categoryId, categories) => categories.find(cat => cat.id === categoryId)),
      tap(category => {
        this.clearAllCategoryTags(category);
      }),
      map(cat => cat.id)
    ).subscribe(id => this.firebaseService.removeCategory(id));

    this.addTagEvent$.pipe(
      flatMap(tags => tags.split(',').map(v => v.trim()).filter(v => !!v)),
      withLatestFrom(this.selectedCategory$),
    ).subscribe(([id, tag]) => this.firebaseService.addTag(tag, id));
    this.addAllEvent$.pipe(
      withLatestFrom(this.tags$, (_, tags) => tags)
    ).subscribe(tags => {
      for (const tag of tags) {
        if (!this.hasTag(tag.id)) {
          this.selectedTags.push(tag);
        }
      }
    })
  }

  ngOnInit() {
  }

  filterTags() {
    return map(([categories, id]) => {
      const  category = categories.find(cat => cat.id === id);
      if (!category) {
        return [];
      }
      const result: Tag[] = [];
      for(const key in category.tags) {
        result.push({id: key, name: category.tags[key], category: id})
      }
      return result;
    });
  }

  selectTag(tag: Tag) {
    if (this.hasTag(tag.id)) {
     this.clearTag(tag.id);
    } else {
      this.selectedTags.push(tag);
    }
  }

  clearTag(tagId: string) {
    this.selectedTags.splice(this.selectedTags.findIndex(t => t.id === tagId), 1)
  }

  getTagsText(tags: Tag[], hasComma, hasHashtag): string {
    return this.sortByString(tags, 'name').map(tag => `${this.hasHashtag ? '#' : ''}${tag.name}`).join(hasComma ? ', ' : ' ');
  }

  hasTag(tagId: string): boolean {
    return !!(this.selectedTags.find(t => t.id === tagId));
  }

  isEmpty(val: string): boolean {
    return !(val || val.trim());
  }
  logout() {
    this.firebaseService.logout();
  }

  clearAllCategoryTags(category: Category) {
    for (const id in category.tags) {
      if (this.hasTag(id)) {
        this.clearTag(id);
      }
    }
  }

  removeTag(tag: Tag) {
    if (this.hasTag(tag.id)) {
      this.clearTag(tag.id);
    }
    this.firebaseService.remoseTag(tag.category, tag.id);
  }

  trackByFn(a, b) {
    return a.id === b.id;
  }

  sortByString(arr: any[], row: string) {
    return arr.sort((a, b) => {
      const al = a[row].toLowerCase();
      const bl = b[row].toLowerCase();
      if(al > bl) {
       return 1;
      } else if (al < bl) {
       return -1;
      } else {
       return 0;
      }
    })
  }

  clearAll() {
    this.selectedTags = [];
  }
}
