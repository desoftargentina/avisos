import { Injectable } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Observable, BehaviorSubject, AsyncSubject, Subject } from 'rxjs';

@Injectable()
export class IconLibrary {

    private icon_list: string[] = [];
    private icons: any;

    private loaded = new BehaviorSubject(false);
    private afterLoad: Subject<void> = new Subject();
    private greenFlag: AsyncSubject<void> = new AsyncSubject();

    constructor(private library: FaIconLibrary) {
        this.greenFlag.next();
        this.greenFlag.complete();
        
        import('@fortawesome/free-solid-svg-icons').then(
            icons => {
                this.icons = icons;
                this.loaded.next(true);
                this.loaded.complete();

                const icon_defs: IconDefinition[] = [];
                this.icon_list.forEach(name => icon_defs.push(icons[name]));
                library.addIcons(...icon_defs);
                
                this.afterLoad.next();
                this.afterLoad.complete();
            }
        );
    }

    onLoad(icon: string): Observable<void> {
        if (!icon.startsWith('fa'))
            icon = this.parse(icon);
        
        if (this.loaded.getValue()) {
            if (!this.icon_list.includes(icon)) {
                this.library.addIcons(this.icons[icon]);
                this.icon_list.push(icon);
            }
            return this.greenFlag;
        } else {
            if (!this.icon_list.includes(icon))
                this.icon_list.push(icon);
            return this.afterLoad;
        }
    }

    parse(name: string): string {
        let icon = 'fa';
        for (const word of name.split('-'))
            icon = icon.concat(word.charAt(0).toUpperCase()).concat(word.substr(1));
        return icon;
    }
}