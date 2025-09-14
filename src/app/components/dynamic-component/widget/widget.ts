import { Component, computed, input, model, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-widget',
  imports: [MatButtonModule],
  template: `
  <div class="widget">
    <div class="widget-header">
        <div class="flex-row">
          <img class="widget-icon" src="assets/weather.png" alt="Weather Icon" />
          <button mat-flat-button class="accent" (click)="closed.emit()">Close</button>
        </div>    
        <div class="widget-title">{{title()}}</div>
        <div class="widget-subtitle">{{description()}}</div>
    </div>
    <div class="widget-body">
        <div class="widget-action">
            <button mat-flat-button class="accent" (click)="collapsed.set(!collapsed())">{{btnText()}}</button>
        </div>       
        <div class="widget-content">
          @if (!collapsed()) { 
            <ng-content></ng-content> 
          } @else {
            <p class="no-content">No content...</p>
          }
        </div>            
    </div>
</div>`,
  styleUrl: './widget.scss'
})
export class Widget {
  title = input.required<string>();
  description = input.required<string>();

  collapsed = model(false);// two-way binding
  closed = output<void>(); // Event emitter to notify parent component when the widget is closed

  btnText = computed(() => this.collapsed() ? 'Expand' : 'Collapse');

  ngOnDestroy() {
    console.log('Weather widget is destroyed...');
  }
}
