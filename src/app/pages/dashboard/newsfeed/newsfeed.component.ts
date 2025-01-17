import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../_services/authentication/authentication.service';
import {Server} from '../../../../config/url.service';
import {ArticleService} from '../../../_services/article/article.service';

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
  show = false;
  constructor(
    private authenticationService: AuthenticationService,
    private articleService: ArticleService
  ) { }

  ngOnInit() {
    this.userData = this.authenticationService.currentUserSubject.value;
    this.getArticleList(this.userData.userId, this.userData.useraccounttype);
  }
  getArticleList(id, type) {
    this.articleService.getArticle(id, type)
      .subscribe(data => {
        this.articles = data;
        this.articlePic();
      });
  }
  articlePic() {
    for (const article of this.articles) {
      article.imgurl1 = Server + '/article/' + article.imgurl1;
      article.imgurl2 = Server + '/article/' + article.imgurl2;
      article.u_avatar = Server + '/avatar/' + article.u_avatar;
    }
    this.thisArticle = this.articles[0];
    this.show = true;
  }
  viewArticle(id) {
    this.thisArticle = this.articles[id];
  }
}
