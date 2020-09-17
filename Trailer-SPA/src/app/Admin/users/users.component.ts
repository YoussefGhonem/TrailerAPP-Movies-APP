import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services/admin.service';
import { User } from 'src/app/_models/user';
import { Users } from 'src/app/_models/users';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(private service: AdminService, private router: Router) { }
  users: Users[];
  num: number;
  ngOnInit(): void {
    this.users = null;
    this.GetAllUsers();
    this.ModaleDessgin();
    this.SelectAll();
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
  GetAllUsers() {
    this.service.GetAllUsers().subscribe((list) => {
      this.users = list;
    }, er => { console.log(er) })
  }
  EditUserURL(id: string) {
    this.router.navigate(['edituser/', id])
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

      this.service.DeleteAll(ids).subscribe(s => {
        this.GetAllUsers();
        $("#btnClose").trigger("click");
      }, ex => console.log(ex));
    }
  }

}
