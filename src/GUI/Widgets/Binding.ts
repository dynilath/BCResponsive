export abstract class Binding<T> {
    abstract get value(): T;
    abstract set value(v: T);
}