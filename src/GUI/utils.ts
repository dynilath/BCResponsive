type NotFunction<T> = T extends Function ? never : T;
export type Calculate<T> = NotFunction<T> | (() => NotFunction<T>);
export function Result<T>(cal: Calculate<T>): NotFunction<T> {
    return cal instanceof Function ? cal() : cal;
}