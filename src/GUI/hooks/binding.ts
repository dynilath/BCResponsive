import { useEffect, useState } from "preact/hooks";
import { EventEmitter } from "stream";

export class Binding<T> extends EventEmitter<{
  change: [newValue: T, oldValue: T];
}> {
  private _value: T;
  constructor(init: T) {
    super();
    this._value = init;
  }

  get value(): T {
    return this._value;
  }

  set value(v: T) {
    const old = this._value;
    this._value = v;
    this.emit("change", v, old);
  }

  subscribe(callback: (newValue: T, oldValue: T) => void) {
    this.on("change", callback);
  }

  unsubscribe(callback: (newValue: T, oldValue: T) => void) {
    this.off("change", callback);
  }
}

export function useBinding<T>(binding: Binding<T>) {
  const [state, setState] = useState(binding.value);

  useEffect(() => {
    const handleStateChange = (newValue: T) => setState(newValue);
    binding.subscribe(handleStateChange);
    return () => binding.unsubscribe(handleStateChange);
  }, []);

  return [state, setState] as const;
}
