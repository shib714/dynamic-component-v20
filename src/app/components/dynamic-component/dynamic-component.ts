import { Component, ComponentRef, effect, signal, TemplateRef, viewChild, ViewContainerRef } from '@angular/core';
import { Widget } from './widget/widget';
import { MatButtonModule } from '@angular/material/button';
import { WeatherContent } from './widget/weather-content';

@Component({
  selector: 'dynamic-component',
  imports: [MatButtonModule, WeatherContent],
  template: `
    <main id="content">
      <h1>Dynamic Component in Angular 20</h1>
      <label class="toggle">
        <input type="checkbox" [checked]="compactMode()" (change)="toggleCompactMode()" />
          Compact Mode
      </label>
    <ng-template #weatherContent>
        <weather-content />
    </ng-template>
      <section class="toolbar ">
          <p>Click the button to create the widget dynamically.</p>
          <button mat-flat-button (click)="createComponent()">Create widget</button>
          
      </section>
      <!-- Place holder where Widget component will be projected -->
      <ng-container #container></ng-container>
      <button mat-flat-button (click)="destroyComponent()" class="warn">Destroy widget</button>
  </main>
`,
  styleUrl: './dynamic-component.scss'
})
export class DynamicComponent {
  vcr = viewChild('container', { read: ViewContainerRef });
  compactMode = signal(false);
  #componentRef?: ComponentRef<Widget>;
  weatherContent = viewChild<TemplateRef<unknown>>('weatherContent');



  createComponent() {
    // Clear any existing component before creating a new one
    this.vcr()?.clear();
    console.log('Creating component');
    const content = this.vcr()?.createEmbeddedView(this.weatherContent()!);

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

    console.log('Widget Component Created');
  }

  toggleCompactMode() {
    this.compactMode.set(!this.compactMode());
    console.log('Compact mode toggled:', this.compactMode());

  }
  destroyComponent() {
    console.log('Destroying the widget component');
    this.vcr()?.clear();
  }

}
