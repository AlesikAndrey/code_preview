import * as angular from 'angular';
import { IParamConfig } from '../helpers';

export function lfmxDateParam(config: IDateParamConfig = {}): IParamConfig<string|null> {
	const defaultValue = config.defaultValue || null;

	return {
		serialize: serialize,
		deserialize: deserialize,
	};

	//////////

	function deserialize(stateParams, paramName): string|null {
		const rawValue = stateParams[paramName];
		if (rawValue === null) {
			return null;
		}

		if (! angular.isString(rawValue)) {
			return defaultValue;
		}

		if (! rawValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
			return defaultValue;
		}

		return rawValue;
	}

	function serialize(value: string|null): string|null|undefined {
		if (value === defaultValue) {
			return undefined;
		}

		return value;
	}
}

export interface IDateParamConfig {
	defaultValue?: string|null;
}
