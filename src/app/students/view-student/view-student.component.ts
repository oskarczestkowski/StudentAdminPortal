import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Student } from 'src/app/models/ui-models/student.model';
import { GenderService } from 'src/app/services/gender.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Gender } from 'src/app/models/ui-models/gender.model';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent implements OnInit {
  studentId: string | null | undefined;
  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    genderId: '',
    profileImageUrl: '',
    gender: {
      id: '',
      description: ''
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: ''
    }
  };

  isNewStudent = false;
  header = '';
  displayProfileImageUrl = '';

  genderList: Gender[] = [];

  constructor(private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private snackbar: MatSnackBar,
    private router: Router) { }


  ngOnInit(): void {
    this.route.paramMap.subscribe(
    (params) => {
      this.studentId = params.get('id')

      if(this.studentId) {


        if(this.studentId.toLowerCase() == 'Add'.toLowerCase()){
        this.isNewStudent = true;
        this.header = 'Add new student';
        this.setImage();
        }
        else {
          this.isNewStudent = false;
          this.header = 'Edit student'

          this.studentService.getStudent(this.studentId)
          .subscribe({
            next: (successResponse) => {
              console.log(successResponse)
              this.student = successResponse;
              this.setImage();

            },
            error: (errorResponse) => {
              this.setImage();
            }
        });
        }

        this.genderService.getGenderList()
        .subscribe(
          (successResponse) => {
            this.genderList = successResponse;
          }
        );
      }
    });
  }

  onUpdate(): void {
    this.studentService.updateStudent(this.student.id, this.student)
    .subscribe({
      next: (successResponse) => {
        this.snackbar.open('Student updated successfully', undefined, {
          duration: 2000
        });

        setTimeout(() => {
          this.router.navigateByUrl('students');
        },100);
      },
      error: (errorResponse) => {
        console.log(errorResponse)
      }
  });

  }

  onDelete(): void{
    this.studentService.deleteStudent(this.student.id)
    .subscribe({
      next: (successResponse) => {
        this.snackbar.open('Student deleted successfully', undefined, {
          duration: 2000
        });

        setTimeout(() => {
          this.router.navigateByUrl('students');
        },100);

      },
      error: (errorResponse) => {

      }
  });
  }
  onAdd(): void {
    this.studentService.addStudent(this.student)
    .subscribe({
      next: (successResponse) => {
        this.snackbar.open('Student added successfully', undefined, {
          duration: 2000
        });

        setTimeout(() => {
          this.router.navigateByUrl('students');
        },100);
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      }
  });
  }

  private setImage(): void {
    if(this.student.profileImageUrl) {
      this.displayProfileImageUrl = this.studentService.getImagePath(this.student.profileImageUrl);

    }
    else {
      this.displayProfileImageUrl = '/assets/default.jpg';
    }
  }

  uploadImage(event: any): void {
    if(this.studentId) {
      const file: File = event.target.files[0];
      this.studentService.uploadImage(this.student.id, file)
      .subscribe({
        next: (successResponse) => {
          this.student.profileImageUrl = successResponse;
          this.setImage();

          this.snackbar.open('Profile image updated', undefined, {
            duration: 2000
          });
        },
        error: (errorResponse) => {

        }
    });

    }


  }
}
