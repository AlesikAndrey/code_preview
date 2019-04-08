import * as angular from 'angular';
import * as _ from 'lodash';
import { IParamConfig } from '../helpers';

export function stringArrayParam(config: IStringArrayParamConfig = {}): IParamConfig<string[]> {
	const defaultValue: string[] | null = config.defaultValue || null;

	return {
		serialize: serialize,
		deserialize: deserialize,
	};

	function deserialize(stateParams, paramName): string[] {
		const rawValue = stateParams[paramName];
		if (! angular.isString(rawValue)) {
			if (defaultValue) {
				return defaultValue;
			}
			return [];
		}

		return _.split(rawValue, ',');
	}

	function serialize(groups: string[]) {
		return _.join(groups);
	}
}

export interface IStringArrayParamConfig {
	defaultValue?: string[]|null;
}
