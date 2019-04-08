import * as angular from 'angular';
import * as _ from 'lodash';

export type IParamsConfig<T> = { [K in keyof T]: IParamConfig<T[K]> };

export interface IParamConfig<T> {
	serialize: SerializeCallback<T>;
	deserialize: DeserializeCallback<T>;
	isEqual?: (value1: T, value2: T) => boolean;
}

export type SerializeCallback<T> = (value: T) => any;
export type DeserializeCallback<T> = (stateParams: any, paramName: string) => T;

export function isParamChanged(paramsConfig, currentState, value, paramName) {
	const paramConfig = paramsConfig[paramName];
	const equals = paramConfig.isEqual || angular.equals;
	return !equals(value, currentState[paramName]);
}

export function serializeParams<T>(paramsConfig: IParamsConfig<T>, paramsToSerialize) {
	return _.transform(paramsToSerialize, (result, value: any, paramName: string) => {
		const paramConfig = paramsConfig[paramName];

		const serialized = paramConfig.serialize(value);

		if (_.isObject(serialized)) {
			Object.assign(result, serialized);
			return;
		}

		result[paramName] = serialized;
	}, {});
}

export function deserializeParams<T>(paramsConfig: IParamsConfig<T>, source): T {
	return _.transform(paramsConfig as any, (result, paramConfig: any, paramName: string) => {
		result[paramName] = paramConfig.deserialize(source, paramName);
	}, {}) as any;
}
