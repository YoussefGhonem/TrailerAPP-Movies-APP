import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryAdd } from 'src/app/_models/CategoryAddModel';
import { Category } from 'src/app/_models/CategoryModel';
import { AdminService } from 'src/app/_services/admin.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-categories-add',
  templateUrl: './categories-add.component.html',
  styleUrls: ['./categories-add.component.css']
})
export class CategoriesAddComponent implements OnInit {
  categoryForm:FormGroup;
  category:CategoryAdd;
  constructor(private fp:FormBuilder,private service:AdminService,private alertify:AlertifyService,private router:Router) { }

  ngOnInit(): void {
    this.CreateForm();
  }
  CreateForm(){
    this.categoryForm = this.fp.group({
      categoryName: ['', Validators.required],
    }, ex => console.log(ex));
  }
  createCategory(){
    if(this.categoryForm.valid){
      this.category=Object.assign({},this.categoryForm.value);
      this.service.AddCategory(this.category).subscribe(s=>{
        this.alertify.success('Category Is Aded')
        this.router.navigate(['categorylist']);
      })
    }
  }
}
