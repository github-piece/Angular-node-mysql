import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthenticationService} from '../../../_services/authentication/authentication.service';
import {Router} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {Server} from '../../../../config/url.service';
import {MessageService} from '../../../_services/message/message.service';

@Component({
  selector: 'app-top-navbar',
  templateUrl: './top-navbar.component.html',
  styleUrls: ['./top-navbar.component.css']
})
export class TopNavbarComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  searchBar = new FormControl();
  options = ['Charts', 'Dashboard', 'Forms', 'Layouts', 'Tables', 'Utils'];
  filterOptions: Observable<Array<string>>;
  userData: any = [];
  private mobileQueryListener: () => void;
  messages = [];
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    private messagesService: MessageService
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this.mobileQueryListener);
  }

  ngOnInit() {
    this.userData = this.authenticationService.currentUserSubject.value;
    if (this.userData == null || this.userData === {}) {
      this.router.navigate(['/login']);
    }
    this.userData.useravatar = Server + '/avatar/' + this.userData.useravatar;
    this.filterOptions = this.searchBar.valueChanges.pipe(map(value => value ? this.filter(value) : this.options.slice()));
    this.getMessage();
  }
  filter(val: string): Array<string> {
    return this.options.filter(option => new RegExp(`^${val}`, 'gi').test(option));
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this.mobileQueryListener);
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
  getMessage() {
    this.messagesService.getMessage(this.userData.userId).subscribe(result => {
      this.messages = result;
      for (const message of this.messages) {
        if (message.avatar.substr(0, 3) !== 'http') {
          message.avatar = Server + '/avatar/' + message.avatar;
        }
      }
    });
  }
  check(id) {
    this.messagesService.setMessage(id, this.userData.userId).subscribe(result => {
      this.messages = result;
      for (const message of this.messages) {
        if (message.avatar.substr(0, 3) !== 'http') {
          message.avatar = Server + '/avatar/' + message.avatar;
        }
      }
    });
  }
  checkAll() {
    this.messagesService.setAllMessage(this.userData.userId).subscribe(result => this.messages = result);
  }
}
