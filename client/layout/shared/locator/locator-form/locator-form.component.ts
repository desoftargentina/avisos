import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { countries, Country, State, City, Gps } from 'api';
import { LocalAuthService } from 'client/services';
import { map } from 'rxjs/operators';

@Component({
  selector: 'locator-form',
  templateUrl: './locator-form.component.html'
})
export class LocatorFormComponent implements OnInit {

  @Input() required: boolean;

  locatorForm = this.fb.group({
    country: [''],
    state: [''],
    city: ['']
  });

  constructor(private fb: FormBuilder, private auth: LocalAuthService) {
    this.locatorForm.get('country').valueChanges
      .pipe(map(() => this.stateKeys))
      .subscribe(states => {
        if (states && states.length == 1) this.locatorForm.get('state').setValue(states[0]);
        else this.locatorForm.get('state').setValue(undefined);
      });

    this.locatorForm.get('state').valueChanges
      .pipe(map(() => this.cityKeys))
      .subscribe(cities => {
        if (cities && cities.length == 1) this.locatorForm.get('city').setValue(cities[0]);
        else this.locatorForm.get('city').setValue(undefined);
      });
  }

  ngOnInit() {
    const gps = this.auth.loggedIn() ? this.auth.getUser().gps : undefined;
    if (gps) {
      const data = Gps.deserialize(gps);
      this.locatorForm.setValue({
        country: data.country,
        state: data.state,
        city: data.city
      });
    } else {
      this.locatorForm.patchValue({
        country: this.countryKeys && this.countryKeys.length < 2 ? this.countryKeys[0] : ''
      });
      this.locatorForm.patchValue({ state: this.stateKeys && this.stateKeys.length < 2 ? this.stateKeys[0] : '' });
      this.locatorForm.patchValue({ city: this.cityKeys && this.cityKeys.length < 2 ? this.cityKeys[0] : '' });
    }

    this.required = this.required || typeof this.required === 'string';
  }

  public get countryKeys(): string[] {
    return Object.keys(countries);
  }

  public get stateKeys(): string[] {
    if (this.country) return Object.keys(this.country.states);
  }

  public get cityKeys(): string[] {
    if (this.state) return Object.keys(this.state.cities);
  }

  getCountry(key: string): Country {
    return countries[key];
  }

  getState(key: string): State {
    if (this.country) return this.country.states[key];
  }

  getCity(key: string): City {
    if (this.state) return this.state.cities[key];
  }

  public get country(): Country {
    return countries[this.locatorForm.get('country').value];
  }

  public get state(): State {
    if (this.country) return this.country.states[this.locatorForm.get('state').value];
  }

  public get city(): City {
    if (this.state) return this.state.cities[this.locatorForm.get('city').value];
  }

  public get gps(): number {
    return Gps.serialize({ country: this.country.id, state: this.state.id, city: this.city.id });
  }
}
