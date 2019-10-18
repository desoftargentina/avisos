import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { currencies, durations, Currency, durationHelper } from 'api';
import { LocalAuthService, PublicationService, NotificationService } from 'client/services';
import { CategorySelectorComponent, LocatorFormComponent } from 'client/layout/shared';
import { FileEvent, FileEventType } from 'client/layout/shared/image-uploader/image-uploader.component';

@Component({
  selector: 'publish',
  templateUrl: './publish.component.html'
})
export class PublishComponent implements OnInit, AfterViewInit {
  @ViewChild(CategorySelectorComponent, { static: false })
  categorySelector: CategorySelectorComponent;

  @ViewChild(LocatorFormComponent, { static: false })
  locatorSelector: LocatorFormComponent;

  publishForm = this.fb.group({
    title: [''],
    currency: [''],
    price: [''],
    contents: [''],
    condition: [''],
    duration: ['', [Validators.required]],
  });

  durations: { duration: number, text: string }[] = [];

  images: string[] = [];

  editMode = false; // @TODO editMode

  public editorOptions: any = {
    language: 'es',
    theme: 'gray',
    charCounterMax: 2500,
    toolbarSticky: false,
    scrollableContainer: '#scroller',
    toolbarButtons: {
      moreText: {
        buttons: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor'],
        buttonsVisible: 7
      },

      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'alignJustify',
          'formatOL',
          'formatUL',
          'alignRight',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote'
        ],
        buttonsVisible: 5
      },

      moreRich: {
        buttons: ['emoticons', 'fontAwesome', 'insertLink', 'insertTable'],
        buttonsVisible: 4
      },

      moreMisc: {
        buttons: ['undo', 'redo'],
        align: 'right',
        buttonsVisible: 2
      }
    },

    toolbarButtonsMD: {
      moreText: {
        buttons: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor'],
        buttonsVisible: 5
      },

      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'alignJustify',
          'formatOL',
          'formatUL',
          'alignRight',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote'
        ],
        buttonsVisible: 3
      },

      moreRich: {
        buttons: ['emoticons', 'fontAwesome', 'insertLink', 'insertTable'],
        buttonsVisible: 4
      },

      moreMisc: {
        buttons: ['undo', 'redo'],
        align: 'right',
        buttonsVisible: 2
      }
    },

    toolbarButtonsSM: {
      moreText: {
        buttons: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor'],
        buttonsVisible: 3
      },

      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'alignJustify',
          'formatOL',
          'formatUL',
          'alignRight',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote'
        ],
        buttonsVisible: 3
      },

      moreRich: {
        buttons: ['emoticons', 'fontAwesome', 'insertLink', 'insertTable'],
        buttonsVisible: 2
      },

      moreMisc: {
        buttons: ['undo', 'redo'],
        align: 'right',
        buttonsVisible: 2
      }
    },

    toolbarButtonsXS: {
      moreText: {
        buttons: ['bold', 'italic', 'underline', 'fontFamily', 'fontSize', 'textColor', 'backgroundColor'],
        buttonsVisible: 2
      },

      moreParagraph: {
        buttons: [
          'alignLeft',
          'alignCenter',
          'alignJustify',
          'formatOL',
          'formatUL',
          'alignRight',
          'paragraphFormat',
          'paragraphStyle',
          'lineHeight',
          'outdent',
          'indent',
          'quote'
        ],
        buttonsVisible: 2
      },

      moreRich: {
        buttons: ['emoticons', 'fontAwesome', 'insertLink', 'insertTable'],
        buttonsVisible: 0
      },

      moreMisc: {
        buttons: ['undo', 'redo'],
        align: 'right',
        buttonsVisible: 2
      }
    },

    pluginsEnabled: [
      'align',
      'charCounter',
      'colors',
      'emoticons',
      'fontAwesome',
      'fontFamily',
      'fontSize',
      'lineHeight',
      'link',
      'lists',
      'paragraphFormat',
      'paragraphStyle',
      'quote',
      'table',
      'url',
      'wordPaste'
    ]
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private auth: LocalAuthService,
    private notification: NotificationService,
    private publishService: PublicationService
  ) {
    durations.forEach(duration => this.durations.push({ duration, text: durationHelper(duration) }));
  }

  ngOnInit() {
    if (this.currencyKeys.length > 0) this.publishForm.patchValue({ currency: this.currencyKeys[0] });
  }

  ngAfterViewInit() {
    this.publishForm.addControl('category', this.categorySelector.categoryForm);
    this.publishForm.addControl('locator', this.locatorSelector.locatorForm);
  }

  get currencyKeys(): string[] {
    return Object.keys(currencies);
  }

  get email(): string {
    return this.auth.loggedIn() ? this.auth.getUser().email || '' : '';
  }

  get countryCode(): string {
    return this.auth.loggedIn() ? this.auth.getUser().country_code || '' : '';
  }

  get areaCode(): string {
    return this.auth.loggedIn() ? this.auth.getUser().area_code || '' : '';
  }

  get cellphone(): string {
    return this.auth.loggedIn() ? this.auth.getUser().cellphone || '' : '';
  }

  get formatCellphone(): string {
    if (!this.auth.loggedIn()) return '';
    const cellphone = this.cellphone;
    let str = cellphone.substr(cellphone.length - 3, 3);
    if (cellphone.length > 3)
      if (cellphone.length > 6)
        str = cellphone.substr(0, cellphone.length - 6) + ' ' + cellphone.substr(cellphone.length - 6, 3) + ' - ' + str;
      else str = cellphone.substr(0, cellphone.length - 3) + ' ' + str;
    return str;
  }

  get controls() {
    return this.publishForm.controls;
  }

  onSubmit() {
    this.publishForm.markAllAsTouched();
    if (this.publishForm.invalid) return;

    const contents = this.controls['contents'].value;

    if (!contents || contents.length === 0 || !contents.trim())
      this.notification.popup("La descripción de la publicación no pede estar vacía.");
    else
      this.publishService
        .savePublication({
          name: this.controls['title'].value,
          condition: this.controls['condition'].value,
          duration: this.controls['duration'].value,
          description: this.controls['contents'].value,
          price: this.controls['price'].value,
          currency: this.controls['currency'].value,
          category: this.categorySelector.category.id,
          subcategory: this.categorySelector.subcategory.id,
          gps: this.locatorSelector.gps,
          images: this.images
        })
        .subscribe(url => this.router.navigate([url]));
  }

  getCurrency(key: string): Currency {
    return currencies[key];
  }

  fileEvent(event: FileEvent) {
    switch (event.type) {
      case FileEventType.Upload:
        this.images.push(event.serial);
        if (this.editMode) {
          this.notification.notify('La imagen se guardará tras confirmar los cambios');
        }
        break;
      case FileEventType.Delete:
        const index: number = this.images.indexOf(event.serial);
        if (index !== -1) this.images.splice(index, 1);
        this.notification.notify('La imagen se eliminará tras confirmar los cambios');
        break;
    }
  }

  onlyNumberKey(event: KeyboardEvent) {
    let charCode = event.key.charCodeAt(0);

    if (charCode < 32 || (charCode > 47 && charCode < 58)) return true;
    else if (charCode == 44) {
      const value = this.publishForm.get('price').value;
      return value === null || !('' + value).includes('.');
    }
    return false;
  }
}
