import { Component, ComponentRef, effect, inputBinding, outputBinding, signal, TemplateRef, twoWayBinding, viewChild, ViewContainerRef } from '@angular/core';
import { Widget } from './widget/widget';
import { MatButtonModule } from '@angular/material/button';
import { WeatherContent } from './widget/weather-content';

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
    console.log('Creating component');
    const content = this.vcr()?.createEmbeddedView(this.weatherContent()!);
    //create the widget component with the embedded view of content
    this.#componentRef = this.vcr()?.createComponent(Widget, {
      projectableNodes: [
        content?.rootNodes!
      ]
    });
    //handle the inputs for the dynamically created component
    this.#componentRef?.setInput('title', 'Weather Widget');
    this.#componentRef?.setInput('description', 'Current weather condition in Ottawa, Ontario');


    //handle the output event from the dynamically created component
    this.#componentRef?.setInput('collapsed', this.compactMode());
    this.#componentRef?.instance.closed.subscribe(() => {
      console.log('Component closed');
      this.#componentRef?.destroy(); // Destroy the component when the closed event is emitted
    })
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

