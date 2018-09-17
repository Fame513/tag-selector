import { Component, OnInit } from '@angular/core';
import {FirebaseService} from '../services/firebase.service';
import {Category} from '../models/category';
import {Tag} from '../models/Tag';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {
  public selectedTags: Tag[] = [];
  public categories: Category[] = [];
  public selectedCategory: string;
  public hasComma = true;
  public hasHashtag = false;
  constructor(private readonly firebaseService: FirebaseService) {
    this.firebaseService.getCategories().subscribe(cats => {
      this.categories = cats;
    })
  }

  ngOnInit() {
  }

  addTags(tags: string) {
    const tagAdrray = tags.split(',').map(v => v.trim()).filter(v => !!v);
    for (const tag of tagAdrray) {
      this.firebaseService.addTag(this.selectedCategory, tag);
    }
  }

  addCategory(name: string) {
    this.firebaseService.addCategory(name);
  }

  getTags(id: string): Tag[] {
    const category = this.categories.find(cat => cat.id === id);
    if (!category) {
      return [];
    }
    const result: Tag[] = [];
    for(const key in category.tags) {
      result.push({id: key, name: category.tags[key], category: id})
    }
    return result;
  }

  selectTag(tag: Tag) {
    if (this.hasTag(tag)) {
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

  hasTag(tag: Tag): boolean {
    return !!(this.selectedTags.find(t => t.id === tag.id));
  }

  addAll(tags: Tag[]) {
    for (const tag of tags) {
      if (!this.hasTag(tag)) {
        this.selectedTags.push(tag);
      }
    }
  }

  isEmpty(val: string): boolean {
    return !(val || val.trim());
  }
  logout() {
    this.firebaseService.logout();
  }

  removeCategory(categoryId: string) {
    this.clearAllCategoryTags(this.getTags(categoryId));
    this.firebaseService.removeCategory(categoryId);
  }

  clearAllCategoryTags(tags: Tag[]) {
    for (const tag of tags) {
      if (this.hasTag(tag)) {
        this.clearTag(tag.id);
      }
    }
  }

  removeTag(tag: Tag) {
    if (this.hasTag(tag)) {
      this.clearTag(tag.id);
    }
    this.firebaseService.remoseTag(tag.category, tag.id);
  }
}
