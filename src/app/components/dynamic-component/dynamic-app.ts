import { Component, ComponentRef, effect, inputBinding, outputBinding, signal, TemplateRef, twoWayBinding, viewChild, ViewContainerRef } from '@angular/core';
import { Widget } from './widget/widget';
import { MatButtonModule } from '@angular/material/button';
import { WeatherContent } from './widget/weather-content';
import { HoverEffectDirective } from './widget/hover-effect.directive';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'dynamic-app',
  imports: [MatButtonModule, WeatherContent],
  template: `    
    <h1>Dynamic Component in Angular 20</h1>
    <main id="content">
      <label class="toggle">
        <input type="checkbox" [checked]="compactMode()" (change)="toggleCompactMode()"/>Compact Mode
      </label>
      <ng-template #weatherContent><weather-content/></ng-template>
      <section class="toolbar ">
          <p>Click the button to create the widget dynamically.</p>
          <button mat-flat-button (click)="createComponent()">Create widget</button>  
          <button mat-flat-button (click)="destroyComponent()" class="warn">Destroy widget</button>        
      </section>
      <!-- Place holder where Widget component will be projected -->
      <ng-container #container/>      
  </main>
`,
  styleUrl: './dynamic-app.scss'
})
export class DynamicApp {
  compactMode = signal(false);

  vcr= viewChild('container', { read: ViewContainerRef});
  #componentRef?: ComponentRef<Widget>;  
  weatherContent = viewChild<TemplateRef<unknown>>('weatherContent');

  createComponent() {
    // Clear any existing component before creating a new one
    this.vcr()?.clear();
    const content = this.vcr()?.createEmbeddedView(this.weatherContent()!);
    //create the widget component with the embedded view of the content
    this.#componentRef = this.vcr()?.createComponent(
      Widget, {
      bindings: [
        inputBinding('title', () => 'Weather Widget'),
        inputBinding('description', () => 'Current weather condition in Ottawa, Ontario'),
        inputBinding('collapsed', () => this.compactMode),  
        twoWayBinding('collapsed', this.compactMode),
        outputBinding('closed', () => {
          this.#componentRef?.destroy();
          this.#componentRef = undefined;
        })      
      ],
      projectableNodes: [
        content?.rootNodes!
      ],
      directives: [
        HoverEffectDirective,
        {
          type: MatTooltip,
          bindings: [
            inputBinding('matTooltip', () => 'Please subscribe'),
            inputBinding('matTooltipPosition', () => 'above')
          ]
        }
      ]
    });

  
  }
  destroyComponent() {
    console.log('Destroying the widget component');
    this.vcr()?.clear();
  }
  toggleCompactMode() {
    this.compactMode.set(!this.compactMode());
    console.log('Compact mode toggled:', this.compactMode());
  }
}

