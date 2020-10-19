import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Category } from 'src/app/_models/CategoryModel';
import { AdminService } from 'src/app/_services/admin.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
// import { threadId } from 'worker_threads';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {

  constructor(private service: AdminService, private route: Router,private alertifyService:AlertifyService) { }
  categories: Category[];
  num: number;

  ngOnInit(): void {
    this.categories = null;
    this.GetAllCategories();
    this.ModaleDessgin();
    this.SelectAll();
  }
  GetAllCategories() {
    this.service.GetAllCategories().subscribe((s) => {
      this.categories = s;
    }, e => console.log(e));
  }
  EditCategoryURL(id: number) {
    this.route.navigate(['editcategory/', id])
  }
  ModaleDessgin() {
    $("#btn").click(function() {
      $(this).fadeOut(300, function() {
        $("#content").slideDown(500);
        $("#content").css("display", "flex");
      });
    });
    
    $("#content").click(function() {
      $(this).css("display", "none");
      $("#btn").css("display", "flex");
    });
  }
   // Delete Check Box
   SelectAll() {
    var tbl = $('#tbl');
    var $header = tbl.find('thead .ckheader');
    var item = tbl.find('tbody .ckitem');

    $(function () {
      item.on('change', function () {
        if ($(this).is(':checked')) {
          $(this).closest('tr').addClass('NewRowColor');
        }
        else {
          $(this).closest('tr').removeClass('NewRowColor');
        }
      });
      $header.change(function () {
        var c = this.checked;
        item.prop("checked", c);
        item.trigger('check');
        if ($(this).is(':checked')) {
          $(item).closest('tr').addClass('NewRowColor');
        }
        else {
          $(item).closest('tr').removeClass('NewRowColor');
        }
      });
    });
  }

  IsDelete() {
    var checkboxes = document.getElementsByClassName('ckitem');
    if (checkboxes.length > 0) {
      for (let i = 0; i < checkboxes.length; i++) {
        if ($(checkboxes[i]).is(":checked")) {
          return true;
        }
      }
    }
    return false;
  }

  DeleteCount() {
    var count = $(".ckitem:checked").length;
    this.num = count;

  }

  DeleteConfirm() {
    var checkboxes = document.getElementsByClassName('ckitem');
    if (checkboxes.length > 0) {
      var ids = [];
      for (let i = 0; i < checkboxes.length; i++) {
        if ($(checkboxes[i]).is(":checked")) {
          var id = $(checkboxes[i]).val();
          ids.push(id);
        }
      }
      this.service.DeleteAllCategory(ids).subscribe(s => {
        this.GetAllCategories();
        $("#btnClose").trigger("click");
      }, ex => console.log(ex));
    }
  }

}
