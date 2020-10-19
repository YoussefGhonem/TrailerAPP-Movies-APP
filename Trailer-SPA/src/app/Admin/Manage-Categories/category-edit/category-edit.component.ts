import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryAdd } from 'src/app/_models/CategoryAddModel';
import { Category } from 'src/app/_models/CategoryModel';
import { EditCategory } from 'src/app/_models/EditCategory';
import { AdminService } from 'src/app/_services/admin.service';
import { AlertifyService } from 'src/app/_services/alertify.service';


@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css']
})
export class CategoryEditComponent implements OnInit {

  constructor(private fp:FormBuilder,private service:AdminService,
    private alertify:AlertifyService,private router:Router, private activatedRouter: ActivatedRoute) { }

  model:EditCategory;
  id: string;
  categoryForm:FormGroup;
  ngOnInit(): void {
    this.model=null;
    this.id='';
    this.model = {
      id:null ,
      categoryName:''
    }
    this.EditCatigory();
    this.CreateForm();
  }
  EditCatigory(){
    this,this.activatedRouter.paramMap.subscribe(param=>{
      const catId=param.get('id');
      
      if(catId){
        this.service.GetCategory(catId).subscribe(s=>{
          this.model=s;
          this.AddCategoryData();
          this.id= catId;
        }, ex => console.log(ex))
      }

    })

  }
  AddCategoryData(){
    if (this.model !== null) {
      this.categoryForm.setValue({     
        categoryName: this.model.categoryName
      });
    }
  }
  
  CreateForm(){
    this.categoryForm = this.fp.group({
      categoryName: ['', Validators.required],
    }, ex => console.log(ex));
  }

  createCategory() {
    if (this.categoryForm.valid) {

        this.model.id = parseInt(this.id);
        this.model.categoryName = this.categoryForm.value.categoryName;
        this.service.EditCategory(this.model, this.model.id).subscribe(x => {
          this.alertify.success('Updated Is Done');
          this.router.navigate(['categorylist']);
        }, ex => console.log(ex));
      }
    }
  }

