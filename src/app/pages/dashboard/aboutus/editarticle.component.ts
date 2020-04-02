import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {DialogData} from './aboutus.component';
import {ArticleService} from '../../../_services/article/article.service';

@Component({
  selector: 'app-edit-article',
  templateUrl: './editarticle.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class EditArticleComponent implements OnInit {
  editServiceForm: FormGroup;
  constructor(
    private dialogRef: MatDialogRef<EditArticleComponent>,
    private dialog: MatDialog,
    private formBuilder: FormBuilder,
    private articleService: ArticleService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) private data: DialogData
  ) {}
  get f() { return this.editServiceForm.controls; }
  ngOnInit() {
    this.editServiceForm = this.formBuilder.group({
      headline: ['', Validators.required],
      section1: ['', Validators.required],
      section2: ['', Validators.required],
    });
    this.editServiceForm.disable();
  }
  updateCard() {
    const newCardData = {
    };
  }
  enableEdit() {
    this.editServiceForm.enable();
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
