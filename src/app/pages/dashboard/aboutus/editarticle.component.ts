import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogData} from './aboutus.component';
import {ArticleService} from '../../../_services/article/article.service';
import {AuthenticationService} from '../../../_services/authentication/authentication.service';

@Component({
  selector: 'app-edit-article',
  templateUrl: './editarticle.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class EditArticleComponent implements OnInit {
  editServiceForm: FormGroup;
  fSectionImage: any;
  sSectionImage: any;
  enable = false;
  file: File[] = [];
  onfile = [false, false];
  constructor(
    private dialogRef: MatDialogRef<EditArticleComponent>,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private articleService: ArticleService,
    private snackBar: MatSnackBar,
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) private data: DialogData
  ) {}
  get f() { return this.editServiceForm.controls; }
  ngOnInit() {
    this.fSectionImage = this.data.cardData.imgurl1;
    this.sSectionImage = this.data.cardData.imgurl2;
    this.editServiceForm = this.formBuilder.group({
      headline: [this.data.cardData.headline, Validators.required],
      section1: [this.data.cardData.section1, Validators.required],
      section2: [this.data.cardData.section2, Validators.required],
    });
    this.editServiceForm.disable();
    this.file[0] = null; this.file[1] = null;
  }
  updateCard() {
    const userId = this.authenticationService.currentUserSubject.value.userId;
    const updateData = new FormData();
    updateData.append('id', this.data.cardData.id);
    updateData.append('headline', this.editServiceForm.value.headline);
    updateData.append('section1', this.editServiceForm.value.section1);
    updateData.append('section2', this.editServiceForm.value.section2);
    updateData.append('file', this.file[0]);
    updateData.append('file', this.file[1]);
    updateData.append('userId', userId);
    updateData.append('onFile', JSON.stringify(this.onfile));
    this.articleService.updateArticle(updateData).subscribe(() => {
      this.snackBar.open('Successfully Changed', '', {duration: 2000});
      this.dialogRef.close();
    }, () => {
      this.snackBar.open('Server Error', '', {duration: 2000});
    });
  }
  enableEdit() {
    this.editServiceForm.enable();
    this.enable = true;
  }
  deleteArticle() {
    const dialogRef = this.dialog.open(AlertArticleComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.articleService.deleteArticle(this.data.cardData.id).subscribe(() => {
          this.snackBar.open('Successfully Deleted!', '', {
            duration: 2000
          });
        }, () => {
          this.snackBar.open('Server Error!', '', {
            duration: 2000
          });
        });
        this.dialogRef.close();
      }
    });
  }
  onNoClick() {
    this.dialogRef.close();
  }
  preview(event, index) {
    const mimeType = event.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.snackBar.open('Only Images are supported', '', {duration: 2000});
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.files[0]);
    reader.onload = () => {
      if (!index) {
        this.fSectionImage = reader.result;
      } else {
        this.sSectionImage = reader.result;
      }
      this.file[index] = event.files.item(0);
    };
    this.onfile[index] = true;
  }
}
@Component({
  selector: 'app-edit-article',
  template: '<mat-card-header>Are you sure?</mat-card-header>' +
    '<mat-card-content><p>If you delete this, you can\'t see this article anymore!</p></mat-card-content>' +
    '<mat-card-actions class="text-center"><button mat-raised-button color="primary" (click)="delete()">Delete</button>' +
    '<button mat-raised-button (click)="onNoClick()">Cancel</button></mat-card-actions>',
  styleUrls: ['./aboutus.component.css']
})
export class AlertArticleComponent {
  constructor(private dialogRef: MatDialogRef<AlertArticleComponent>) {
  }
  onNoClick() { this.dialogRef.close(0); }
  delete() { this.dialogRef.close(1); }
}
