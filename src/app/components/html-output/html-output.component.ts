import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-html-output',
  templateUrl: './html-output.component.html',
  styleUrls: ['./html-output.component.css']
})
export class HtmlOutputComponent implements OnInit {

  @Input() text = '';

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  renderText(){
    return this.sanitizer.bypassSecurityTrustHtml(this.text);
  }

}
