import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observer, Subject } from 'rxjs';
import { Country } from '../../interfaces/country-interface';
import { Department } from '../../interfaces/department-interface';
import { User } from '../../interfaces/user-interface';
import { SkillService } from '../../services/skills.service';
import { UsersLibService } from '../../services/users-lib.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'lib-user-detail',
  templateUrl: './user-detail.component.html',
  styles: [],
})
export class UsersDetailComponent implements OnInit {
  skills: any = [];
  editMode = false;
  isFormReady = false;
  userDetailForm!: FormGroup;
  user!: User;
  countries: Array<Country> = [];
  departments: Array<Department> = [];
  typeSubject = new Subject();
  constructor(
    private fb: FormBuilder,
    private _userLibService: UsersLibService,
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private _skillService: SkillService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const idUser = this.route.snapshot.params['id'];

    this._userLibService
      .getUserInfos(idUser)
      .subscribe(
        (data: {
          user: User;
          departments: Array<Department>;
          countries: Array<Country>;
        }) => {
          this.user = data.user;
          this.countries = data.countries;
          this.departments = data.departments;
          this.isFormReady = true;
          this.initForm();
        }
      ),
      (error: any) => console.log(error);

    this.typeSubject.subscribe((text: any) => {
      this._skillService
        .getSkillsbyName(text)
        .subscribe((skills: Array<any>) => {
          this.skills = skills;
        });
    });
  }

  initForm(): void {
    this.userDetailForm = this.fb.group({
      firstname: [this.user.firstname, Validators.required],
      lastname: [this.user.lastname, Validators.required],
      birthdate: [this.datepipe.transform(this.user.birthdate, 'YYYY/MM/dd')],
      skills: this.fb.array([]),
      department: this.fb.group({
        id: [this.user.department.id, Validators.required],
        name: [this.user.department.name, Validators.required],
      }),
      country: this.fb.group({
        id: [this.user.country.id, Validators.required],
        name: [this.user.country.name, Validators.required],
      }),
      profileCompletion: [this.user.profileCompletion],
      lastConnectionDate: [
        this.datepipe.transform(
          this.user.lastConnectionDate,
          'YYYY/MM/dd HH:mm'
        ),
      ],
    });

    this.user.skillsId.forEach((skill) => {
      this.addNewSkill(skill);
    });
  }

  getSkills(): FormArray {
    return this.userDetailForm.get('skills') as FormArray;
  }

  addNewSkill(skill: any = null) {
    const skillForm = this.fb.group({
      id: [skill ? skill.id : null, Validators.required],
      name: [skill ? skill.name : null, Validators.required],
    });

    this.getSkills().push(skillForm);
  }

  removeSkill(index: number) {
    this.getSkills().removeAt(index);
  }

  onSubmit(): void {
    if (!this.userDetailForm.valid) {
      return;
    }

    const formValue = this.userDetailForm.getRawValue();
    const dataToSend  = {
        id : this.route.snapshot.params['id'],
        firstname :  formValue.firstname,
        lastname :  formValue.lastname,
        birthdate : formValue.birthdate,
        skillsId : formValue.skills.map((skill : any) => skill.id),
        departmentId : formValue.department.id,
        countryId : formValue.country.id
    }

    const observer : Observer<any> = {
        next : (success) => {this.toastr.success('user updated with success')},
        error : (error) => {
            if(error.status === 400){
                let errorString = '';

                error.error.forEach((error : any) => {
                    errorString += error.value + ' ';
                })
                this.toastr.error(errorString);
                return;
            }

            this.toastr.error('something went wrong');

        },
        complete : () => {}
    }

    this._userLibService.updateUsers(dataToSend).subscribe(observer)

  }

  onActiveEdit(): void {
    this.editMode = true;
  }

  onTap(event: any, i: any) {
    const name = this.getSkills().at(i).get('name')?.value;

    const correctSkill = this.skills.find((skill: any) => skill.name === name);

    if (correctSkill === undefined) {
      this.getSkills().at(i).get('name')?.setValue(null);
      this.getSkills().at(i).get('id')?.setValue(null);
      return;
    }

    this.getSkills().at(i).get('id')?.setValue(correctSkill.id);
  }

  onAddSkill() {
    this.addNewSkill();
  }

  onRemoveSkill(index: number) {
    this.removeSkill(index);
  }

  onSearchChange(event: any) {
    this.typeSubject.next(event.target.value);
  }
}
