import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../../_services/authentication/authentication.service';
import {ArticleService} from '../../../_services/article/article.service';
import {ImageCroppedEvent} from 'ngx-image-cropper';
import {Server} from '../../../../config/url.service';
import {MatDialog} from '@angular/material';
import {EditArticleComponent} from './editarticle.component';
export interface DialogData {
  cardData: any;
}
@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {
  myData: any = [];
  step = 0;
  userId: any;
  userParentId: any;
  userAccountType: any;
  showCrud = false;
  rowSelection;
  imageChangedEvent: any;
  croppedImage: any;
  imageSelected: boolean;
  imageChanged: boolean;
  showCropper = false;
  rowData = [];
  imgUrl: any;
  submitted = false;
  rowSelectId: any;
  aboutForm: FormGroup;
  p = 1;
  @ViewChild('fileInput', {static: true}) fileInput: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private articleService: ArticleService,
    private dialog: MatDialog
  ) {
    this.aboutForm = this.formBuilder.group({
      headline: ['', Validators.required],
      section1: ['', Validators.required],
      section2: ['', Validators.required],
      imgUrl: [''],
      file1: [''],
      file2: ['']
    });
  }
  get f() { return this.aboutForm.controls; }
  ngOnInit() {
    this.myData = this.authenticationService.currentUserSubject.value;
    this.userParentId = this.myData.userparentid;
    this.userAccountType = this.myData.useraccounttype;
    this.showCrud = this.userAccountType === 'Super Admin';
    this.rowSelection = 'single';
    this.getArticleList();
    this.imageChanged = false;
    this.imageSelected = false;
    this.croppedImage = Server + '/avatar/default.png';
    this.rowData = [];
  }
  getArticleList() {
    const formData = new FormData();
    formData.append('userId', this.myData.userId);
    formData.append('userParentId', this.userParentId);
    formData.append('userAccountType', this.userAccountType);
    this.articleService.getArticleList(formData).subscribe(result => {
      this.rowData = result;
      for (const data of this.rowData) {
        data.imgurl1 = Server + '/article/' + data.imgurl1;
        data.imgurl2 = Server + '/article/' + data.imgurl2;
      }
    });
  }
  updateCard(cardData) {
    const dialogRef = this.dialog.open(EditArticleComponent, {
      autoFocus: false,
      data: {cardData}
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getArticleList();
    });
  }
  setStep(index: number) {
    this.step = index;
  }
  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }
  fileChangeEvent(event) {
    if (event.srcElement.files.length > 0) {
      this.imageSelected = true;
      this.imageChangedEvent = event;
    }
  }
  submitArticle() {
    this.submitted = true;
    if (this.aboutForm.invalid) {
      return;
    }
    const formData = new FormData();
    this.imgUrl = this.croppedImage;
    formData.append('userId', this.userId);
    formData.append('userParentId', this.userParentId);
    formData.append('userAccountType', this.userAccountType);
    formData.append('id', this.rowSelectId);
    formData.append('imgUrl', this.imgUrl);
    formData.append('section1', this.aboutForm.get('section1').value);
    formData.append('section2', this.aboutForm.get('section2').value);
    formData.append('section2', this.aboutForm.get('section2').value);
    formData.append('headline', this.aboutForm.get('headline').value);
    this.articleService.setArticle(formData).subscribe(result => {
      this.rowData = result;
      for (const data of this.rowData) {
        data.imgurl1 = Server + '/article/' + data.imgurl1;
        data.imgurl2 = Server + '/article/' + data.imgurl2;
      }
    });
  }
  chooseImage() {
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    this.showCropper = true;
  }
}
