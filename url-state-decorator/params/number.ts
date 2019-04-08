import { IParamConfig } from '../helpers';

export function numberParam(config: INumberParamConfig): IParamConfig<number|null> {
	const defaultValue = config.defaultValue || null;
	const min = config.min || null;
	const max = config.max || null;

	return {
		serialize: serialize,
		deserialize: deserialize,
	};

	//////////

	function deserialize(stateParams, paramName): number|null {
		const value = +(stateParams[paramName]);

		if (! isFinite(value)) {
			return defaultValue;
		}

		if (min != null && value < min) {
			return defaultValue;
		}

		if (max != null && value > max) {
			return defaultValue;
		}

		return value;
	}

	function serialize(value: number|null): number|null {
		if (value === defaultValue) {
			return null;
		}

		if (min != null && value != null && value < min) {
			return null;
		}

		if (max != null && value != null && value > max) {
			return null;
		}

		return value;
	}
}

export interface INumberParamConfig {
	defaultValue?: number|null;
	min?: number;
	max?: number;
}
