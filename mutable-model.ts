import * as angular from 'angular';

export abstract class MutableModel<T> {
	public model: T;
	private listeners: Array<(changes: any) => void> = [];

	constructor(params: Partial<T>) {
		this.model = angular.copy(this.defaultParams());

		angular.forEach(params, (value, key) => {
			this[key] = value;
		});
	}

	public get<K extends keyof T>(paramName: K): T[K] {
		return this.model[paramName];
	}

	public merge(params: Partial<T>): void {
		const changes = {};

		angular.forEach(params, (value, paramName) => {
			if (angular.isUndefined(value)) {
				return;
			}

			if (this.model[paramName] === value) {
				return;
			}

			this.model[paramName] = changes[paramName] = value;
		}, this);

		if (Object.keys(changes).length > 0) {
			this.emit(changes);
		}
	}

	public onChange(listener: (changes: any) => void): () => void {
		this.listeners.push(listener);

		return () => { this.removeListener(listener); };
	}

	protected abstract defaultParams(): T;

	private removeListener(listener) {
		const index = this.listeners.indexOf(listener);
		if (index < 0) {
			return;
		}

		this.listeners.splice(index, 1);
	}

	private emit(changes) {
		angular.forEach(this.listeners, (listener) => { listener(changes); });
	}
}

export function listen <P, T extends MutableModel<P>, K extends keyof P>(targetPrototype: T, property) {
	Object.defineProperty(targetPrototype, property, {
		get: function getter(this: T): P[K] {
			return this.get(property) as any;
		},
		set: function setter(this: T, value) {
			this.merge({[property as string]: value} as any);
		},
	});
}
