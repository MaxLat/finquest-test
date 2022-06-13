import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbdSortableHeader } from '../../directives/sort-header-directive';
import { User } from '../../interfaces/user-interface';
import { UsersLibService } from '../../services/users-lib.service';

@Component({
  selector: 'lib-users-lib',
  templateUrl: './users-lib.component.html',
  styleUrls: ['./users-lib.component.css'],
})
export class UsersLibComponent implements OnInit {
  filterForm!: FormGroup;
  users: Array<any> = [];
  defaultUsers : Array<any> = [];
  constructor(
    private fb: FormBuilder,
    private _userLibService: UsersLibService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this._userLibService.getUsers().subscribe((users: Array<User>) => {
       this.users = [...users].sort((a, b) => {
        return this.compare(a['lastname'], b['lastname']);
      })
      this.defaultUsers = users;
    });
    this.filterForm.valueChanges.subscribe((form: any) => {

      this._userLibService
        .getUsersFiltered(form)
        .subscribe((users: Array<User>) => {
          this.users = users;
          this.defaultUsers = users;
        });
    });

    this._userLibService.getUsers();
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      firstname: [],
      lastname: [],
      isAlreadyConnected: [null],
    });
  }

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  onSort({ column, direction }: any) {
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (direction === '' || column === '') {
      this.users = this.defaultUsers;
    } else {
      this.users = [...this.users].sort((a, b) => {
        if (column === 'lastname') {
          const res = this.compare(a['lastname'],b['lastname']);
          return direction === 'asc' ? res : -res;
        }

        if(column === 'lastConnectionDate'){
           const lastConnectionDateA =  new Date(a['lastConnectionDate']).getTime();
           const lastConnectionDateB =  new Date(b['lastConnectionDate']).getTime();
            
            const res = this.compare(lastConnectionDateA, lastConnectionDateB);
            return direction === 'asc' ? res : -res;
        }

        const res = this.compare(a[column], b[column]);
        return direction === 'asc' ? res : -res;
      });
    }
  }

  compare = (v1: any, v2: any) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);
}
