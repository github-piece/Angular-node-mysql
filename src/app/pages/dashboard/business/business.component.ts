import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../../_services/authentication/authentication.service';
import {QuestionService} from '../../../_services/question/question.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent, MatSnackBar, MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material';
import {Router} from '@angular/router';
import {FlatTreeControl} from '@angular/cdk/tree';
import {SelectionModel} from '@angular/cdk/collections';
import * as XLSX from 'xlsx';
import {CatalogueService} from '../../../_services/catalogue/catalogue.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {THIS_EXPR} from '@angular/compiler/src/output/output_ast';

type AOA = any[][];
export class TodoItemNode {
  children: TodoItemNode[];
  item: string;
}
export class TodoItemFlatNode {
  item: string;
  level: number;
  expandable: boolean;
}
@Component({
  selector: 'app-business',
  templateUrl: './business.component.html',
  styleUrls: ['./business.component.css']
})
export class BusinessComponent implements OnInit {
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
  treeControl: FlatTreeControl<TodoItemFlatNode>;
  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);

  currentStep = 0;
  businessAnswers: AOA;
  userData: any;
  showProfile = false;
  address: string;
  action =  'insert';
  profile: string;
  imgURL = [];
  showImage = [];

  progress = '0';
  questionForm: FormGroup;
  questionData = [];
  profileData = [];
  rowData: any = [];
  colValidator: any = {};
  uploadIndex = [];
  formData = new FormData();
  validatorMessage = {  };
  domFlag = false;
  domPositionClick = false;
  country = [];
  selectedCountry: any;
  municipalityIndex = [];
  municipalityZero = false;
  provinces = [];
  province = [[]];
  municipalities = [];
  municipality = [[]];
  file: File[] = [null];
  chips: any = [];

  removable = true;
  muniTemp = [[]];
  instruments = [];
  currencyCode: any;
  currencySymbol: any = '';
  currencyAmount: any = '';
  stakeholder = [];
  goals = [];
  balances = [];
  incomes = [];
  domPosition: number;
  cashFlows = [];
  stakeholderRings = [];
  rings: any = {};
  explainIndex: any;
  addItemFlag = false;
  rangeMain = [];
  rangeExtra = [];
  rangeExtraDomAddItem = [];
  addItemRowsData: any = [];
  addItemColData: any = [];
  questionTypeID: any;
  sectors: any;
  sectorData = '';
  hidden = 1;
  domAddItemFlag = false;
  message: string;
  clickFlag: number;
  businessId = '';
  currency = {};
  chipsRow = [];
  chooseScout = false;
  profileType = 'Scout Profile';
  chooseProfileContent: any;
  profileQuiz = '';
  onExpand = false;
  scoutProfile = [
    {title: 'All', value: 'Scouter_Profile', img: 'assets/lists/list1.jpg'},
    {title: 'Community Profile', value: 'Community_Profile', img: 'assets/lists/list2.jpeg'},
    {title: 'Maritime Profile', value: 'Maritime_Expert', img: 'assets/lists/list3.jpeg'},
    {title: 'Nature Profile', value: 'Nature_Expert_Profile', img: 'assets/lists/list4.jpeg'},
    {title: 'Security Profile', value: 'Security_Profile', img: 'assets/lists/list1.jpg'},
    {title: 'Healthcare Profile', value: 'Healthcare Centre', img: 'assets/lists/list2.jpeg'},
    {title: 'Economic Profile', value: 'Economic_Profile', img: 'assets/lists/list3.jpeg'},
    {title: 'Educational Profile', value: 'Educational Centre', img: 'assets/lists/list4.jpeg'},
    {title: 'SupraNational Profile', value: 'SupraNational_Profile', img: 'assets/lists/list1.jpg'}
  ];
  onScoutProfile = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  chipsTemp: string[] = [];
  @ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>;
  constructor(
    private authenticationService: AuthenticationService,
    private questionService: QuestionService,
    private formBuilder: FormBuilder,
    private router: Router,
    private catalogueService: CatalogueService,
    private spinner: NgxSpinnerService,
    private snackBar: MatSnackBar
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }
  ngOnInit() {
    this.userData = this.authenticationService.currentUserSubject.value;
    this.chooseProfileContent = this.scoutProfile[0];
  }
  getBusinessQuiz(profile) {
    this.spinner.show();
    this.profile = profile;
    if (profile === 'business_profile') {
      this.profileType = 'Business Profile';
    } else {
      this.profileType = 'Scouter Profile';
    }
    this.questionService.getBusinessQuiz(this.userData.userId, profile).subscribe(result => {
      this.spinner.hide();
      if (this.action === 'restart') {
        this.currentStep = 0;
        this.action = 'insert';
      } else {
        if (result.rememberValue !== undefined && result.rememberValue.id_business_quiz !== 134)  {
          this.currentStep = result.rememberValue.id_business_quiz;
          this.businessId = result.rememberValue.business_id;
          this.questionTypeID = this.businessId;
          this.action = 'update';
        }
      }
      if (this.profileType === 'Business Profile') {
        this.onExpand = true;
        this.questionData = result.data;
      } else {
        this.profileData = result.data;
        const indexes = [];
        for (const quizData of this.profileData) {
          if (quizData.type === 'scouter_profile') {
            this.onScoutProfile = [];
            this.profileQuiz = 'All';
            break;
          } else {
            for (let i = 0; i < this.scoutProfile.length; i++) {
              if (this.scoutProfile[i].value === quizData.type) {
                this.profileQuiz += this.scoutProfile[i].title + ', ';
                indexes.push(i);
                break;
              }
            }
          }
        }
        for (let i = 0; i < this.scoutProfile.length; i++) {
          let onExist = true;
          for (const index of indexes) {
            if (i === index) {
              onExist = false;
            }
          }
          if (onExist === true) {
            this.onScoutProfile.push(this.scoutProfile[i]);
          }
        }
        this.profileQuiz = this.profileQuiz.substr(0, this.profileQuiz.length - 2);
      }
      this.country = result.country;
      this.instruments = result.instruments;
      this.currencyCode = result.currency_code;
      this.stakeholder = result.stakeholder;
      this.goals = result.goals;
      this.balances = result.balances;
      this.incomes = result.incomes;
      this.cashFlows = result.cashFlows;
      this.stakeholderRings = result.stakeholderRings;
      this.sectors = this.getTreeStructure(result.sectors);
      this.sectors = this.buildFileTree(this.sectors, 0);
      this.dataSource.data = this.sectors;
      this.provinces = result.provinceList;
      this.municipalities = result.Municipalities;
      this.questionStart(this.currentStep, this.profile);
    });
  }
  questionStart(step, profile) {
    if (profile !== 'scouter') {
      this.formData = new FormData();
      let required;
      this.initVar();
      this.rowData = this.questionData[step];
      this.calProgress();
      if (this.rowData.notes === 'Dom manipulation required') {
        this.domPosition = parseInt(this.rowData.dom_position, 10);
        this.domValidator();
      } else if (this.rowData.notes === 'Add Item Option') {
        this.addItemValidator();
      } else if (this.rowData.notes.includes('Dom manipulation required') && this.rowData.notes.includes('Add Item Option')) {
        this.domAddItemValidator();
      } else {
        for (let m = 0; m < 10; m++) {
          this.rangeMain.push(m);
        }
        if (this.rowData.required) {
          required = 1;
        } else {
          required = 0;
        }
        this.formValidator(required);
      }
      this.showProfile = true;
      this.chooseScout = false;
    } else {
      this.chooseScout = true;
      this.showProfile = false;
    }
  }
  formValidator(required) {
    if (required) {
      for (let i = 0; i < 10; i++) {
        if (this.rowData['col_' + i + '_header']) {
          if (this.rowData['col_' + i] === 'email') {
            this.colValidator['col_' + i + '_header'] = new FormControl('', [Validators.required, Validators.email]);
          } else if (this.rowData['col_' + i] === 'SelectionAndDetails') {
            this.colValidator['col_' + i + '_header'] = new FormControl('');
          } else if (this.rowData['col_' + i].toLowerCase().includes('tag')) {
            this.colValidator['col_' + i + '_header'] = new FormControl('');
          } else {
            this.colValidator['col_' + i + '_header'] = new FormControl('', [Validators.required]);
          }
        }
      }
    } else {
      for (let i = 0; i < 10; i++) {
        if (this.rowData['col_' + i + '_header']) {
          this.colValidator['col_' + i + '_header'] = new FormControl({value: ''});
        }
      }
    }
    this.questionForm = this.formBuilder.group(
      this.colValidator
    );
    this.questionForm.reset();
  }
  domValidator() {
    for (let i = 0; i <= 10; i++) {
      if (this.rowData['col_' + i + '_header']) {
        this.colValidator['col_' + i + '_header'] = new FormControl('');
      }
    }
    this.colValidator.other = this.formBuilder.array([]);
    this.questionForm = this.formBuilder.group(
      this.colValidator
    );
    for (let i = 0; i <= this.domPosition; i++) {
      this.rangeMain.push(i);
    }
    for (let i = this.domPosition + 1; i < 10; i++) {
      this.rangeExtra.push(i);
    }
    this.domFlag = true;
  }
  addItemValidator() {
    let position;
    if (this.rowData.col_0 === 'SelectionAndDetails') {
      position = 0;
      this.colValidator.col_0_header = [''];
    } else {
      position = -1;
    }
    this.colValidator.other = this.formBuilder.array([this.addOtherSkillFormGroup(position)]);
    this.questionForm = this.formBuilder.group(
      this.colValidator
    );
    for (let i = 0; i <= position; i++) {
      this.rangeMain.push(i);
    }
    for (let i = position + 1; i < 10; i++) {
      this.rangeExtra.push(i);
    }
    this.addItemFlag  = true;
  }
  addOtherSkillFormGroup(position): FormGroup {
    for (let i = position + 1; i < 10; i++) {
      if (this.rowData['col_' + i + '_header']) {
        this.colValidator['col_' + i + '_header'] = new FormControl('');
      }
    }
    return this.formBuilder.group(this.colValidator);
  }
  showExtraDom(event) {
    if (event.value === 'Yes') {
      this.domPositionClick = true;
    } else {
      this.domPositionClick = false;
      this.questionForm.controls.col_0_header.setValue('No');
    }
  }
  domAddItemValidator() {
    this.domPosition = parseInt(this.rowData.dom_position, 10);
    this.domAddItemFlag = true;
    this.domValidator();
  }
  initVar() {
    this.domPositionClick = false;
    this.domFlag = false;
    this.domAddItemFlag = false;
    this.rangeMain = [];
    this.rangeExtra = [];
    this.rangeExtraDomAddItem = [];
    this.colValidator = {};
    this.addItemFlag = false;
    this.uploadIndex = [];
    this.addItemRowsData = [];
    this.addItemColData = [];
  }
  explain_content(i, index) {
    this.explainIndex = i;
    if (index) {
      this.clickFlag = index;
    } else {
      if (index === '0') {
        this.clickFlag = 0;
      } else {
        this.clickFlag = undefined;
      }
    }
  }
  changeStep() {
    if (!this.questionForm.valid) {
      for (const control in this.questionForm.controls) {
        if (this.questionForm.controls.hasOwnProperty(control)) {
          this.questionForm.controls[control].markAsTouched();
        }
      }
      return;
    } else {
      if (this.currentStep === 0) {
        const businessName = this.questionForm.get('col_0_header').value;
        const time = Date.now();
        this.questionTypeID = businessName + time;
      }
      if (this.currentStep < this.questionData.length - 1) {
        this.currentStep++;
        this.calProgress();
        if (this.addItemFlag || this.domAddItemFlag) {
          for (const i of this.rangeExtra) {
            if (this.questionForm.get('col_' + i + '_header')) {
              if (!this.municipalityZero && this.rowData['col_' + i].includes('South Africa')) {
                this.addItemColData['col_' + i + '_header'] = '';
              } else {
                this.addItemColData['col_' + i + '_header'] = this.questionForm.get('col_' + i + '_header').value;
              }
            } else {
              this.addItemColData['col_' + i + '_header'] = '';
            }
          }
          if (this.domAddItemFlag) {
            this.addItemColData.col_0_header = 'Yes';
          }
          // tslint:disable-next-line:no-shadowed-variable
          for (const {addItemRowData, index} of this.questionForm.get('other').value.map((addItemRowData, index) => ({
            addItemRowData,
            index
          }))) {
            if (index === 0) {
              const target = {};
              Object.assign(target, this.addItemColData);
              this.addItemRowsData[0] = target;
              if (this.domAddItemFlag) {
                this.addItemRowsData[1] = addItemRowData;
              }
            } else {
              if (this.domAddItemFlag) {
                this.addItemRowsData[index + 1] = addItemRowData;
              } else {
                this.addItemRowsData[index] = addItemRowData;
              }
            }
          }
        }
        this.putAnswerList();
        this.questionStart(this.currentStep, this.profile);
      } else {
        this.spinner.show();
        this.putAnswerList();
      }
    }
  }
  addTag(event: MatChipInputEvent, i): void {
    const value = event.value;
    if ((value || '').trim()) {
      this.chipsTemp.push(value.trim());
    }
    this.questionForm.get('col_' + i + '_header').setValue(null);
  }
  removeTag(fruit: string): void {
    const index = this.chipsTemp.indexOf(fruit);
    if (index >= 0) {
      this.chipsTemp.splice(index, 1);
    }
  }
  getStakeholderRing(ring, i, index) {
    this.rings[index] = ring;
    this.questionForm.get('col_' + i + '_header').setValue(JSON.stringify(this.rings));
  }
  setOtherData(dataA, dataB, index, i) {
    const data = dataA + '!!' + dataB;
    this.muniTemp[index].push(data);
    if (index === 0) {
      this.municipalityZero = true;
    }
    // else {
    //   (this.questionForm.controls.other as FormArray).
    //     controls[index].controls['col_' + i + '_header'].setValue(this.muniTemp[index]);
    // }
  }
  putAnswerList() {
    if (this.rowData.id === 2 && this.profile === 'business_profile') {
      this.formData.append('file', this.file[0]);
      this.formData.append('file', this.file[1]);
      this.formData.append('file', this.file[2]);
    } else if (this.rowData.id === 50 && this.profile === 'business_profile') {
      this.formData.append('file', this.file[1]);
    } else {
      if (this.domAddItemFlag) {
        this.formData.append('addItemRowsData', JSON.stringify(this.addItemRowsData));
      } else {
        for (let i = 0; i < 10; i++) {
          if (this.questionForm.get('col_' + i + '_header')) {
            if (this.uploadIndex[i] === i) {
              this.formData.append('col_' + i + '_header', '');
            } else {
              if (this.rowData['col_' + i].toLowerCase().includes('phone')
                && this.questionForm.get('col_' + i + '_header').value) {
                this.formData.append('col_' + i + '_header', this.questionForm.get('col_' + i + '_header').value);
              } else if (this.rowData['col_' + i].toLowerCase().includes('sector')) {
                this.formData.append('col_' + i + '_header', this.sectorData);
              } else if (this.rowData['col_' + i].toLowerCase().includes('tag')) {
                this.formData.append('col_' + i + '_header', this.chips);
              } else {
                this.formData.append('col_' + i + '_header', this.questionForm.get('col_' + i + '_header').value);
              }
            }
          }
        }
      }
    }
    this.formData.append('userid', this.userData.userId);
    this.formData.append('profile', this.profile);
    this.formData.append('id_business_quiz', this.rowData.id);
    this.formData.append('questionTypeID', this.questionTypeID);
    this.formData.append('businessId', this.businessId);
    this.formData.append('action', this.action);
    this.colValidator = {};
    return this.questionService.setAnswer(this.formData).subscribe(result => {
      this.spinner.hide();
      if (result !== null) {
        if (result !== 1) {
          this.chooseScout = true;
          this.showProfile = false;
          this.profileData = result;
          this.profileQuiz = '';
          for (const quizData of this.profileData) {
            for (const scoutType of this.scoutProfile) {
              if (scoutType.value === quizData.type) {
                this.profileQuiz += scoutType.title + ', ';
                break;
              }
            }
          }
          this.profileQuiz = this.profileQuiz.substr(0, this.profileQuiz.length - 2);
        } else {
          this.router.navigate(['/dashboard/catalogue']);
        }
      }
    });
  }
  getTreeStructure(sectors) {
    const treeData = {};
    for (const rowSector of sectors) {
      const child = [];
      for (let i = 0; i <= 4; i++ ) {
        if (rowSector['sub_sector_' + i]) {
          child.push(rowSector['sub_sector_' + i]);
        }
      }
      if (child.length) {
        treeData[rowSector.sector] = child;
      } else {
        treeData[rowSector.sector] = null;
      }
    }
    return treeData;
  }
  goToStart() {
    this.showProfile = false;
    this.currentStep = 0;
    this.progress = '0';
    this.router.navigate(['/dashboard/business']);
    this.action = 'restart';
  }
  onFileChange(event, i) {
    this.uploadIndex[i] = i;
    const mimeType = event.target.files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => {
      this.imgURL[i] = reader.result;
    };
    this.file[i] = event.target.files.item(0);
    this.showImage[i] = true;
  }
  domAddItem() {
    const position = 0;
    this.colValidator = {};
    this.rangeExtraDomAddItem = [];
    this.clickFlag = undefined;
    (this.questionForm.get('other') as FormArray).push(this.addOtherSkillFormGroup(position));
    for (let i = position + 1; i < 10; i++) {
      this.rangeExtraDomAddItem.push(i);
    }
    this.domAddItemFlag = true;
  }
  handleAddressChange(address: any, i) {
    this.address = address.formatted_address;
    this.questionForm.controls['col_' + i + '_header'].setValue(this.address);
  }
  import(evt: any) {
    const excelAnswers = []; let j = 0;
    const target: DataTransfer = (evt.target) as DataTransfer;
    if (target.files.length !== 1) { throw new Error('Cannot use multiple files'); }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      this.businessAnswers = (XLSX.utils.sheet_to_json(ws, { header: 1 })) as AOA;
      for (let i = 2; i < this.businessAnswers.length; i++) {
        if (this.businessAnswers[i][2] !== undefined) {
          let value = '';
          for (let n = 3; n < this.businessAnswers[i].length; n += 3) {
            if (this.businessAnswers[i][n] !== undefined) {
              if (this.businessAnswers[i][n - 2] === 'Currency') {
                this.businessAnswers[i][n - 3] += this.businessAnswers[i][n];
                const answer = []; let kk = 0;
                for ( let k = 0; k < this.businessAnswers[i].length; k++ ) {
                  if (k !== n - 1 && k !== n - 2 && k !== n) {
                    answer[kk] = this.businessAnswers[i][k];
                    kk++;
                  }
                }
                this.businessAnswers[i] = answer;
                n = n - 3;
              }
              for (let m = 0; m < this.businessAnswers[i][n].length; m++) {
                if (this.businessAnswers[i][n][m] === '\'') {
                  let character = '\'';
                  for (let k = m; k < this.businessAnswers[i][n].length; k++) {
                    character += this.businessAnswers[i][n][k];
                  }
                  for (let ii = 0; ii < m; ii++) {
                    value += this.businessAnswers[i][n][ii];
                  }
                  value += character;
                  this.businessAnswers[i][n] = value;
                  m = this.businessAnswers[i][n].length;
                }
              }
            }
          }
          excelAnswers[j] = {
            no: j + 1,
            type: this.businessAnswers[i][2],
            answer0: this.businessAnswers[i][3],
            answer1: this.businessAnswers[i][6],
            answer2: this.businessAnswers[i][9],
            answer3: this.businessAnswers[i][12],
            answer4: this.businessAnswers[i][15],
            answer5: this.businessAnswers[i][18],
            answer6: this.businessAnswers[i][21],
            answer7: this.businessAnswers[i][24],
            answer8: this.businessAnswers[i][27]
          };
          j++;
        }
      }
      for (let i = 0; i < excelAnswers.length; i++) {
        if (excelAnswers[i].type === undefined && excelAnswers[i + 1].type !== undefined) {
          excelAnswers[i + 1] = {
            no: i + 1,
            answer0: 'Yes',
            answer1: this.businessAnswers[i + 1][3],
            answer2: this.businessAnswers[i + 1][6],
            answer3: this.businessAnswers[i + 1][9],
            answer4: this.businessAnswers[i + 1][12],
            answer5: this.businessAnswers[i + 1][15],
            answer6: this.businessAnswers[i + 1][18],
            answer7: this.businessAnswers[i + 1][21],
            answer8: this.businessAnswers[i + 1][24],
            answer9: this.businessAnswers[i + 1][27]
          };
        }
      }
      this.spinner.show();
      this.questionService.setExcelAnswer(excelAnswers, this.userData.userId).subscribe(() => {
        this.spinner.hide();
        this.snackBar.open('Successfully Created!', '', {duration: 2000});
        this.router.navigate(['/dashboard/catalogue']);
      }, () => {
        this.snackBar.open('Data Incorrect!', '', {duration: 2000});
      });
    };
    reader.readAsBinaryString(target.files[0]);
  }
  getCountryProvince(selectedValue, index, j) {
    const nextValue = this.rowData['col_' + 1 * ( j + 1 )];
    if (nextValue) {
      if (nextValue.toLowerCase().includes('province')) {
        this.province[index] = [];
        this.selectedCountry = selectedValue;
        for (const province of this.provinces) {
          if (province.country === selectedValue) {
            this.province[index].push(province.names);
          }
        }
      } else if (nextValue.toLowerCase().includes('south africa')) {
        this.municipality[index] = [];
        this.municipalityIndex[index] = true;
        for (const municipal of this.municipalities) {
          if (municipal.province === selectedValue) {
            this.municipality[index].push(municipal);
          }
        }
      }
    }
  }
  addCurrencyAmount(event, i): void {
    this.currencyAmount = event.target.value;
  }
  addCurrencySymbol(symbol, index, i): void {
    this.currencySymbol = symbol;
    this.questionForm.controls['col_' + i + '_header'].setValue(this.currencyAmount + this.currencySymbol);
  }
  addItem(index: number) {
    this.colValidator = {};
    this.chipsRow = [[]];
    // @ts-ignore
    this.chipsTemp[parseInt(index + 1, 10)] = [];
    this.municipality[parseInt(String(index + 1), 10)] = [];
    this.muniTemp[parseInt(String(index + 1), 10)] = [];
    this.province[parseInt(String(index + 1), 10)] = [];
    this.clickFlag = undefined;
    let position;
    if (this.rowData.col_0 === 'SelectionAndDetails') {
      position = 0;
    } else {
      position = -1;
    }
    (this.questionForm.get('other') as FormArray).push(this.addOtherSkillFormGroup(position));
    const getAddBtn = document.getElementsByClassName('add-btn_1');
    for (let i = 0; i < getAddBtn.length; i++) {
      const btnDisplay = getAddBtn.item(i) as HTMLElement;
      btnDisplay.style.display = 'none';
    }
  }
  setCurrency(index: number, i) {
    if (this.currency[index]) {
      this.currency[index] = !this.currency[index];
    } else {
      this.currency[index] = true;
    }
    this.questionForm.controls['col_' + i + '_header'].setValue(JSON.stringify(this.currency));
  }
  setValue(x, i) {
    this.questionForm.controls['col_' + i + '_header'].setValue(x);
  }
  chooseScoutProfile() {
    this.profile = this.chooseProfileContent.value;
    if (this.chooseProfileContent.title !== 'All') { this.profileType = this.chooseProfileContent.title; }
    this.questionService.getScoutQuiz(this.userData.userId, this.profile).subscribe(result => {
      this.questionData = result.data;
      // tslint:disable-next-line:max-line-length
      if (result.rememberValue !== undefined && result.rememberValue.id_business_quiz !== this.questionData[this.questionData.length - 1].id) {
        for (let i = 0; i < this.questionData.length; i++) {
          if (result.rememberValue.id_business_quiz === this.questionData[i].id) {
            this.currentStep = i + 1;
            break;
          }
        }
        this.businessId = result.rememberValue.business_id;
        this.questionTypeID = this.businessId;
        this.action = 'update';
      }
      this.questionStart(this.currentStep, this.profile);
    });
  }
  profileContent(index: number) {
    this.chooseProfileContent = this.scoutProfile[index];
  }
  calProgress() {
    this.progress = String(Math.round(this.currentStep * 100 / (this.questionData.length - 1)));
  }
  getLevel = (node: TodoItemFlatNode) => node.level;

  isExpandable = (node: TodoItemFlatNode) => node.expandable;

  getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

  hasChild = (_: number, nodeData: TodoItemFlatNode) => nodeData.expandable;
  /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    return descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    this.checklistSelection.isSelected(node)
      ? this.checklistSelection.select(...descendants)
      : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode, i): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
    if (this.sectorData.includes(node.item)) {
      this.sectorData = this.sectorData.replace(node.item + ',', '');
    } else {
      this.sectorData += node.item + ',';
    }
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.every(child =>
      this.checklistSelection.isSelected(child)
    );
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

  /* Get the parent node of a node */
  getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }
  buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
    return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
      const value = obj[key];
      const node = new TodoItemNode();
      node.item = key;

      if (value != null) {
        if (typeof value === 'object') {
          node.children = this.buildFileTree(value, level + 1);
        } else {
          node.item = value;
        }
      }

      return accumulator.concat(node);
    }, []);
  }
  transformer = (node: TodoItemNode, level: number) => {
    const existingNode = this.nestedNodeMap.get(node);
    const flatNode = existingNode && existingNode.item === node.item
      ? existingNode
      : new TodoItemFlatNode();
    flatNode.item = node.item;
    flatNode.level = level;
    flatNode.expandable = !!node.children;
    this.flatNodeMap.set(flatNode, node);
    this.nestedNodeMap.set(node, flatNode);
    return flatNode;
  }

}
