export function Required(target: object, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
        get() {
            throw new Error(`Attribute ${propertyKey} is required`);
        },
        set(value) {
            Object.defineProperty(target, propertyKey, { value, writable: true, configurable: true });
        },
    });
}

export function RequiredConditional(condition: boolean) {
    if (condition) return Required;
}