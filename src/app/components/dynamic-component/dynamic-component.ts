import { Component, ComponentRef, effect, signal, viewChild, ViewContainerRef } from '@angular/core';
import { Widget } from './widget/widget';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'dynamic-component',
  imports: [MatButtonModule],
  template: `
    <main id="content">
      <h1>Dynamic Component in Angular 20</h1>
      <label class="toggle">
        <input type="checkbox" [checked]="compactMode()" (change)="toggleCompactMode()" />
          Compact Mode
      </label>

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

  constructor() {
    effect(() => {
      const isCompact = this.compactMode();
      this.#componentRef?.setInput('collapsed', isCompact);
    });
  }

  createComponent() {
    this.vcr()?.clear();
    this.#componentRef = this.vcr()?.createComponent(Widget);

    this.#componentRef?.setInput('title', 'Weather Widget');
    this.#componentRef?.setInput('description', 'Current weather condition in Ottawa, Ontario');

    this.#componentRef?.setInput('collapsed', this.compactMode());
    this.#componentRef?.instance.collapsed.subscribe((isCollapsed) => {
      this.compactMode.set(isCollapsed);
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
