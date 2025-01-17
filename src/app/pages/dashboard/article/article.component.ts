import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../../_services/authentication/authentication.service';
import {ArticleService} from '../../../_services/article/article.service';
import {MatPaginator, MatSnackBar, MatTableDataSource, PageEvent} from '@angular/material';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  userData: any = [];
  articleData = [];
  articleForm: FormGroup;
  submitted = false;
  showImage: any = [];
  imgURL: any = [];
  message: string;
  file: File[] = [];
  dataSource: any;
  tasks: any[];
  pageSize = 4;
  currentPage = 0;
  totalSize = 0;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  get f() { return this.articleForm.controls; }
  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private articleService: ArticleService,
    private snackBar: MatSnackBar
  ) {
    this.articleForm = this.formBuilder.group({
      headline: ['', Validators.required],
      section0: ['', Validators.required],
      section1: ['', Validators.required],
    });
  }
  ngOnInit() {
    this.showImage[0] = false; this.showImage[1] = false;
    this.file[0] = null; this.file[1] = null;
    this.userData = this.authenticationService.currentUserSubject.value;
    this.getArticleList();
  }
  getArticleList() {
    this.articleService.getArticle(this.userData.useraccounttype, this.userData.userId).subscribe(result => {
      this.articleData = result;
      this.getTask();
    });
  }
  previewImage(target, index) {
    if (target.files.length === 0) {
      return;
    }
    const mimeType = target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Only images are supported.';
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(target.files[0]);
    reader.onload = () => {
      this.imgURL[index] = reader.result;
    };
    this.file[index] = target.files.item(0);
    this.showImage[index] = true;
  }
  submitArticle() {
    this.submitted = true;
    if (this.articleForm.invalid || this.file[0] === null) {
      return;
    }
    const formData = new FormData();
    formData.append('userId', this.userData.userId);
    formData.append('accountType', this.userData.useraccounttype);
    formData.append('file', this.file[0]);
    formData.append('file', this.file[1]);
    formData.append('section1', this.articleForm.get('section0').value);
    formData.append('section2', this.articleForm.get('section1').value);
    formData.append('headline', this.articleForm.get('headline').value);
    this.articleService.setArticle(formData).subscribe(result => {
      this.articleData = result;
      this.getTask();
      this.snackBar.open('Successfully Saved!', '', {
        duration: 2000
      });
    }, () => {
      this.snackBar.open('Server error', '', {
        duration: 2000
      });
    });
  }
  getTask() {
    const data = this.articleData;
    this.dataSource = new MatTableDataSource<any>(data);
    this.dataSource.paginator = this.paginator;
    this.tasks = data;
    this.totalSize = this.tasks.length;
    this.iterator();
  }
  iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.tasks.slice(start, end);
    this.dataSource = part;
  }
  handlePage(event?: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.iterator();
  }
  hasError = (controlName: string, errorName: string) => {
    return this.articleForm.controls[controlName].hasError(errorName);
  }
}
