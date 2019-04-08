import * as angular from 'angular';
import { IPromise, IQService, IRootScopeService } from 'angular';
import * as _ from 'lodash';

import { ServiceLocator } from '../service';

import { deserializeParams, IParamsConfig, isParamChanged, serializeParams } from './helpers';
import { UrlStateStorage } from './storage';

export class UrlStateLogic<T extends object> {
	private readonly $state = ServiceLocator.injector.get<angular.ui.IStateService>('$state');
	private readonly $stateParams = ServiceLocator.injector.get<angular.ui.IStateParamsService>('$stateParams');
	private readonly $rootScope = ServiceLocator.injector.get<IRootScopeService>('$rootScope');
	private readonly $q = ServiceLocator.injector.get<IQService>('$q');
	private readonly storage: UrlStateStorage<T>;

	private readonly stateName: string;
	private stopListenState: () => void;
	private state: T;

	constructor(
		private paramsConfig: IParamsConfig<T>,
		private initListener: () => void,
		private changeListener: ChangeListener<T>,
	) {
		this.stateName = this.getCurrentStateName();
		this.stopListenState = this.startListenState();
		this.state = this.getRealState();

		this.storage = new UrlStateStorage(
			this.stateName,
			ServiceLocator.injector.get('$sessionStorage'),
			paramsConfig,
		);
	}

	public init() {
		if (this.isEmptyUrl()) {
			const saved = this.storage.get();
			this.state = saved;
			this
				.load(saved)
				.catch((e) => { console.error('UrlState: Failed to load saved state', e); })
				.finally(this.initListener);
			return;
		}

		this.storage.set(this.state);
		this.initListener();
	}

	public get<K extends keyof T>(paramName: K): T[K] {
		return this.state[paramName];
	}

	public set<K extends keyof T>(paramName: K, value: T[K]): void {
		if (_.isUndefined(value)) {
			return;
		}

		if (! isParamChanged(this.paramsConfig, this.state, value, paramName)) {
			return;
		}

		this.state = _.assign({}, this.state, {[paramName as string]: value});
		this.storage.set(this.state);

		// we use `notify: false` to prevent reloading of component
		this
			.$state
			.go(this.stateName, serializeParams(this.paramsConfig, this.state), { notify: false })
		;
	}

	public destroy(): void {
		this.stopListenState();
	}

	private load(params: Partial<T>): IPromise<any> {
		const _isParamChanged = _.partial(isParamChanged, this.paramsConfig, this.getRealState());

		const paramsToUpdate =
			_(params)
				.omitBy(_.isUndefined)
				.pickBy(_isParamChanged)
				.value();

		if (Object.keys(paramsToUpdate).length < 1) {
			return this.$q.resolve();
		}

		// we use `notify: false` to prevent reloading of component
		return this
			.$state
			.go(this.stateName, serializeParams(this.paramsConfig, paramsToUpdate), { notify: false })
		;
	}

	private getCurrentStateName(): string {
		const name = this.$state.current.name;
		if (name == null) {
			console.error('Unknown state name!');
		}

		return name as string;
	}

	private isEmptyUrl(): boolean {
		const stateServiceConfig = this.$state.$current as any;

		for (const paramName in this.$stateParams) {
			if (!this.$stateParams.hasOwnProperty(paramName)) {
				continue;
			}

			const paramConfig = stateServiceConfig.params[paramName];

			if (this.$stateParams[paramName] !== paramConfig.config.value) {
				return false;
			}
		}

		return true;
	}

	private areThereParamsToUpdate(params: object) {
		return Object.keys(params).length > 0;
	}

	private handleChanges(): void {
		const previous = this.state;
		this.state = this.getRealState();
		const changes = this.getStateChanges(this.state, previous);
		this.storage.set(this.state);
		this.emitChanges(changes);
	}

	private getRealState(): T {
		return deserializeParams(this.paramsConfig, this.$stateParams);
	}

	private getStateChanges(current, previous): Partial<T> {
		return _.transform(current, (result, value, paramName: string) => {
			if (! angular.equals(previous[paramName], value)) {
				result[paramName] = {
					current: value,
					previous: previous[paramName],
				};
			}
		}, {}) as any;
	}

	private emitChanges(changes: Partial<T>): void {
		this.changeListener(changes);
	}

	private startListenState() {
		return this
			.$rootScope
			.$on('$stateChangeSuccess', () => {
				if (!this.$state.includes(this.stateName)) {
					return;
				}

				this.handleChanges();
			});
	}
}

export type ChangeListener<T> = (changes: Partial<T>) => void;
