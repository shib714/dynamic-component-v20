import { Component, input, model, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-widget',
  imports: [MatButtonModule],
  template: `
  <div class="widget">
    <div class="flex-row">
        <img class="widget-icon" src="assets/weather.png" alt="Weather Icon" />
        <button mat-flat-button class="accent action" (click)="closed.emit()">close</button>
    </div>
    <div class="widget-header">
        <div class="widget-title">{{title()}}</div>
        <div class="widget-subtitle">{{description()}}</div>
    </div>
    <div class="widget-body">
        <ng-content><p class="no-content">No content...</p></ng-content>        
    </div>
</div>`,
  styleUrl: './widget.scss'
})
export class Widget {
  title = input.required<string>();
  description = input.required<string>();

  collapsed = model(false);
  closed = output<void>();

   ngOnDestroy() {
    console.log('Weather widget is destroyed...');
  }

}
