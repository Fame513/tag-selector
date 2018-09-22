import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {Category} from '../models/category';
import {Tag} from '../models/Tag';
import {combineLatest, Observable, Subject} from 'rxjs';
import {first, flatMap, map, withLatestFrom} from 'rxjs/operators';

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

  public isEditMode = false;
  public hasComma = true;
  public hasHashtag = false;
  constructor(private readonly firebaseService: FirebaseService) {
    this.selectedCategory$.subscribe(console.log);
    this.categories$ = this.firebaseService.getCategories();
    this.tags$ = combineLatest(this.categories$, this.selectedCategory$).pipe(this.filterTags());
    this.addCategoryEvent$.pipe(map(newCat => this.firebaseService.addCategory(newCat))).subscribe();
    this.removeCategoryEvent$.pipe(
      withLatestFrom(this.selectedCategory$, (_, category) => category),
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
      for(const key in category.tags$) {
        result.push({id: key, name: category.tags$[key], category: id})
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
    return tags.map(tag => `${this.hasHashtag ? '#' : ''}${tag.name}`).join(hasComma ? ', ' : ' ');
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

  removeSelectedCategory() {
    this.tags$.pipe(first()).subscribe(tags => {
      this.clearAllCategoryTags(tags);
    });
    this.selectedCategory$.pipe(first()).subscribe(categoryId => {
      this.firebaseService.removeCategory(categoryId);
    })
  }

  clearAllCategoryTags(tags: Tag[]) {
    for (const tag of tags) {
      if (this.hasTag(tag.id)) {
        this.clearTag(tag.id);
      }
    }
  }

  removeTag(tag: Tag) {
    if (this.hasTag(tag.id)) {
      this.clearTag(tag.id);
    }
    this.firebaseService.remoseTag(tag.category, tag.id);
  }
}
