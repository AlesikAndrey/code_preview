import * as angular from 'angular';
import { IParamConfig } from '../helpers';

export function stringParam(config: IStringParamConfig = {}): IParamConfig<string|null> {
	const defaultValue = config.defaultValue || null;

	return {
		serialize: serialize,
		deserialize: deserialize,
	};

	//////////

	function deserialize(stateParams, paramName): string|null {
		const rawValue = stateParams[paramName];
		if (! angular.isString(rawValue)) {
			return defaultValue;
		}

		return rawValue;
	}

	function serialize(value: string|null): string|null {
		if (value === defaultValue) {
			return null;
		}

		return value;
	}
}

export interface IStringParamConfig {
	defaultValue?: string|null;
}
