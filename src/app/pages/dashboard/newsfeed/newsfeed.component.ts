import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../_services/authentication/authentication.service';
import {NewsfeedService} from '../../../_services/newsfeed/newsfeed.service';
import {Server} from '../../../../config/url.service';

@Component({
  selector: 'app-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.css']
})
export class NewsfeedComponent implements OnInit {
  userData: any = [];
  articles = [];
  thisArticle = [];
  p = 1;
  constructor(
    private authenticationService: AuthenticationService,
    private newsfeedService: NewsfeedService
  ) { }

  ngOnInit() {
    this.userData = this.authenticationService.currentUserSubject.value;
    this.getArticleList(this.userData.userId, this.userData.useraccounttype);
  }
  getArticleList(id, type) {
    this.newsfeedService.getArticleList(id, type)
      .subscribe(data => {
        this.articles = data;
        this.articlePic();
      });
  }
  articlePic() {
    // tslint:disable-next-line:prefer-for-of
    for ( let i = 0; i < this.articles.length; i++) {
      this.articles[i].imgurl1 = Server + '/article/' + this.articles[i].imgurl1;
      this.articles[i].imgurl2 = Server + '/article/' + this.articles[i].imgurl2;
      this.articles[i].u_avatar = Server + '/avatar/' + this.articles[i].u_avatar;
    }
    this.thisArticle = this.articles[0];
  }
  viewArticle(id) {
    this.thisArticle = this.articles[id];
  }
}
