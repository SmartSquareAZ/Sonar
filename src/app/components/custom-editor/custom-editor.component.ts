import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CustomEditorComponent),
  multi: true
};

@Component({
  selector: 'app-custom-editor',
  templateUrl: './custom-editor.component.html',
  styleUrls: ['./custom-editor.component.css'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class CustomEditorComponent implements ControlValueAccessor {

  @Input() text = '';
  @Input() public form: any = null;

  /**
   * The internal data model
   */
  private innerValue: any = '';

  /**
   * get accessor
   */
  get value(): any {
    return this.innerValue;
  };

  /**
   * set accessor including call the onchange callback
   */
  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCallback(v);
    }
  }

  /**
   * Placeholders for the callbacks which are later provided
   * by the Control Value Accessor
   */
  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  constructor() { }

  writeValue(obj: any): void {
    if (obj != null) {
      this.value = obj;
    }
  }
  registerOnChange(fn: any): void {
    this.onChangeCallback = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCallback = fn;
  }

  /**
   * Set touched on blur
   */
  onBlur() {
    this.onTouchedCallback();
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: '',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['undo', 'redo', 'subscript', 'superscript', 'heading', 'fontName'],
      ['indent', 'outdent', 'link', 'unlink', 'insertImage', 'insertVideo', 'insertHorizontalRule', 'toggleEditorMode']
    ]
  };
}
