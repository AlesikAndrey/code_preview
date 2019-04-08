import { deserializeParams, IParamsConfig, serializeParams } from './helpers';

export const URL_STATE_STORAGE_SUFFIX = '_urlState';

export class UrlStateStorage<T> {
	constructor(
		private key: string,
		private storage: object,
		private paramsConfig: IParamsConfig<T>,
	) { }

	public set(state: T) {
		this.storage[this.key + URL_STATE_STORAGE_SUFFIX] = serializeParams(this.paramsConfig, state);
	}

	public get(): T {
		return deserializeParams(this.paramsConfig, this.storage[this.key + '_urlState'] || {});
	}
}
