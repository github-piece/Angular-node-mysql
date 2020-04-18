import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../../_services/authentication/authentication.service';
import {UserService} from '../../../_services/user/user.service';
import {MatChipInputEvent, MatSnackBar, MatTableDataSource, MatTreeFlatDataSource, MatTreeFlattener, PageEvent} from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';
import {NgxSpinnerService} from 'ngx-spinner';
import {QuestionService} from '../../../_services/question/question.service';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {TodoItemFlatNode, TodoItemNode} from '../business/business.component';
import {FlatTreeControl} from '@angular/cdk/tree';
import {SelectionModel} from '@angular/cdk/collections';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {Router} from '@angular/router';
@Component({
  selector: 'app-scout',
  templateUrl: './scout.component.html',
  styleUrls: ['./scout.component.css']
})
export class ScoutComponent implements OnInit {
  flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();
  nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();
  treeControl: FlatTreeControl<TodoItemFlatNode>;
  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;
  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;
  checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
  userData;
  profileData: any = [];
  onPageShow = false;
  profileQuiz = '';
  onShow = false;
  businessData: any;
  tableDataSource: any;
  tasks: any[];
  pageSize = 5;
  currentPage = 0;
  totalSize = 0;
  onQuiz = false;
  profile = [];
  profileType = [];

  currentStep = 0;
  address: string;
  action =  'insert';
  imgURL = [];
  showImage = [];

  progress = '0';
  questionForm: FormGroup;
  questionData = [];
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
  scoutId: any;
  sectors: any;
  sectorData = '';
  hidden = 1;
  domAddItemFlag = false;
  message: string;
  clickFlag: number;
  currency = {};
  chipsRow = [];
  businessId: any;
  businessCount: number;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  chipsTemp: string[] = [];
  @ViewChild('tagInput', {static: false}) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
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
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private questionService: QuestionService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
    this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }
  ngOnInit() {
    this.userData = this.authenticationService.currentUserSubject.value;
    this.spinner.show();
    this.userService.getScoutProfile(this.userData.userId).subscribe(result => {
      this.spinner.hide();
      this.profileData = result.scoutData;
      if (this.profileData.length) {
        this.onPageShow = true;
        this.businessData = result.businessData;
        this.getTasks();
        this.getProfile();
      }
    });
  }
  getProfile() {
    for (const profile of this.scoutProfile) {
      for (const data of this.profileData) {
        if (data.type === profile.value) {
          this.profileQuiz += profile.title + ', ';
          this.profileType.push(profile.value);
        }
      }
    }
    this.profileQuiz = this.profileQuiz.substr(0, this.profileQuiz.length - 2);
    this.onShow = true;
  }
  getBusiness(id: any) {
    this.businessCount  = this.currentPage * this.pageSize + id;
    this.businessId = this.businessData[this.businessCount].business_id;
    this.spinner.show();
    this.questionService.getCompareQuiz(this.profileType, this.businessId, this.userData.userId).subscribe(result => {
      this.spinner.hide();
      this.questionData = result.data;
      if (result.rememberValue.id !== 0 && result.rememberValue.id !== (this.questionData.length - 1)) {
        this.currentStep = result.rememberValue.id;
        this.action = 'update';
        this.scoutId = result.rememberValue.scoutId;
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
      this.questionStart(this.currentStep);
      this.onQuiz = true;
    }, () => {
      this.snackBar.open('Server Error, please try again a few minutes later!', '', {duration: 2000});
    });
  }
  questionStart(step) {
    this.formData = new FormData();
    let required;
    this.initVar();
    this.rowData = this.questionData[step];
    this.calProgress();
    if (this.rowData.notes === 'Dom manipulation required') {
      this.domPosition = parseInt(this.rowData.domPosition, 10);
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
    this.domPosition = parseInt(this.rowData.domPosition, 10);
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
        const time = Date.now();
        this.scoutId = this.businessId + time;
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
        this.questionStart(this.currentStep);
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
  }
  putAnswerList() {
    if (this.rowData.profile === 'Business_Profile' && this.rowData.questionId === 2) {
      this.formData.append('file', this.file[0]);
    } else if (this.rowData.profile === 'Business_Profile' && this.rowData.questionId === 50) {
      this.formData.append('file', this.file[1]);
    } else {
      if (this.domAddItemFlag) {
        this.formData.append('addItemRowsData', JSON.stringify(this.addItemRowsData));
      }
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
    this.formData.append('profile', this.rowData.profile);
    this.formData.append('userId', this.userData.userId);
    this.formData.append('id', this.rowData.questionId);
    this.formData.append('scoutId', this.scoutId);
    this.formData.append('businessId', this.businessId);
    this.formData.append('action', this.action);
    if (this.questionData.length === this.currentStep + 1) {
      this.formData.append('finish', 'true');
      this.spinner.show();
    }
    this.colValidator = {};
    return this.questionService.setScoutAnswer(this.formData).subscribe(() => {
      if (this.questionData.length === this.currentStep + 1) {
        this.spinner.hide();
        this.router.navigate(['/dashboard/catalogue']);
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
    this.onQuiz = false;
    this.currentStep = 0;
    this.progress = '0';
    this.router.navigate(['/dashboard/scout']);
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
  getTasks() {
    const data = this.businessData;
    this.tableDataSource = new MatTableDataSource<any>(data);
    this.tableDataSource.paginator = this.paginator;
    this.tasks = data;
    this.totalSize = this.tasks.length;
    this.iterator();
  }
  iterator() {
    const end = (this.currentPage + 1) * this.pageSize;
    const start = this.currentPage * this.pageSize;
    const part = this.tasks.slice(start, end);
    this.tableDataSource = part;
  }
  handlePage(event?: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.iterator();
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
