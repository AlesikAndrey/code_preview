import * as _ from 'lodash';

import { ServiceLocator } from '../service';

import { IParamConfig, IParamsConfig } from './helpers';
import { UrlStateLogic } from './logic';
import { URL_STATE_STORAGE_SUFFIX } from './storage';

const configKey = Symbol('urlStateMetadata:config');
const instanceKey = Symbol('urlStateMetadata:instance');

function UrlState() {
	return (componentConstructor) => {
		const wrap = _.partial(wrapMethod, componentConstructor);
		wrap('ngOnInit', onInitWrapper);
		wrap('ngOnDestroy', onDestroyWrapper);
	};
}

namespace UrlState {
	export function forceSetParams (state: string, params: {[key: string]: any}) {
		const storage = ServiceLocator.injector.get('$sessionStorage');
		const targetState = storage[state + URL_STATE_STORAGE_SUFFIX] || {};
		for (const key in params) {
			targetState[key] = params[key];
		}
		storage[state + URL_STATE_STORAGE_SUFFIX] = targetState;
	}
}
export {UrlState};

function wrapMethod(target, methodName, wrapper) {
	const origMethod = target.prototype[methodName];

	target.prototype[methodName] = function(this: any) {
		wrapper(this, origMethod, arguments);
	};
}

function onInitWrapper(component: object, origOnInit, args) {
	if (origOnInit) {
		origOnInit.apply(component, args);
	}

	const config = getConfig(component);

	const urlStateLogic = new UrlStateLogic(
		config.params,
		_.partial(onStateInit, component),
		_.partial(onStateChanges, component),
	);

	setStateInstance(component, urlStateLogic);

	urlStateLogic.init();
}

function onDestroyWrapper(component: object, origOnDestroy, args) {
	if (origOnDestroy) {
		origOnDestroy.apply(component, args);
	}

	const urlStateLogic = getStateLogicInstance(component) as UrlStateLogic<any>;
	urlStateLogic.destroy();
}

function getConfig(componentPrototype): IConfig {
	if (componentPrototype[configKey] == null) {
		componentPrototype[configKey] = { params: {} };
	}

	return componentPrototype[configKey];
}

function onStateInit(component: object): void {
	if (hasInitListener(component)) {
		component.onStateInit();
	}
}

function onStateChanges(component: object, changes): void {
	if (hasChangesListener(component)) {
		component.onStateChanges(changes);
	}
}

export function StateParam<P>(paramConfig: IParamConfig<P>) {
	return <T extends object>(componentPrototype: T, property) => {
		registerParam(componentPrototype, property, paramConfig);

		Object.defineProperty(componentPrototype, property, {
			get: function getter(this: object) {
				const urlStateLogic = getStateLogicInstance(this);

				if (urlStateLogic == null) {
					return void 0;
				}

				return urlStateLogic.get(property);
			},
			set: function setter(this: object, value: any) {
				const urlStateLogic = getStateLogicInstance(this);

				if (urlStateLogic == null) {
					return;
				}

				urlStateLogic.set(property, value);
			},
		});
	};
}

export interface IOnStateInit {
	onStateInit: InitListener;
}

export type InitListener = () => void;

export interface IOnStateChanges<T> {
	onStateChanges: ChangeListener<T>;
}

export type ChangeListener<T> = (changes: StateChanges<Partial<T>>) => void;

export type StateChanges<T> = { [K in keyof T]?: { previous: T[K], current: T[K] } };

function getStateLogicInstance(component): UrlStateLogic<any>|undefined {
	if (component[instanceKey] == null) {
		console.error(
			'There is no urlStateLogic instance on this component!'
			+ '\n- check that the component is decorated by @UrlState.'
			+ '\n- don\'t try to use state params before `onStateInit` handler.'
		);
	}

	return component[instanceKey];
}

function setStateInstance(component, stateInstance) {
	component[instanceKey] = stateInstance;
}

function registerParam(componentPrototype, property, paramsConfig) {
	const config = getConfig(componentPrototype);
	if (!config) {
		return;
	}

	const paramConfigs = config.params;
	paramConfigs[property] = paramsConfig;
}

function hasInitListener(component: object): component is IOnStateInit {
	return !!(component as IOnStateInit).onStateInit;
}

function hasChangesListener(component: object): component is IOnStateChanges<any> {
	return !!(component as IOnStateChanges<any>).onStateChanges;
}

interface IConfig {
	stateName: string;
	params: IParamsConfig<any>;
}
