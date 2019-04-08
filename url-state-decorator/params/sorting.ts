import * as angular from 'angular';
import { IParamConfig } from '../helpers';

function sortingParam(config: ISortingParamConfig = {}): IParamConfig<ISorting|null> {
	let defaultSortBy: any;
	let defaultSortOrder: any;

	if(angular.isObject(config.defaultValue)) {
		defaultSortBy = Object.keys(config.defaultValue)[0] || null;
		defaultSortOrder = defaultSortBy ? config.defaultValue[defaultSortBy] : null;
	}

	return {
		serialize: serialize,
		deserialize: deserialize,
	};

	////////////

	function deserialize(stateParams): ISorting|null {
		const sortBy = stateParams.sortBy;
		const sortOrder = stateParams.sortOrder;

		if (angular.isString(sortBy) && (['asc', 'desc'].indexOf(sortOrder) >= 0)) {
			return {[sortBy]: sortOrder};
		}

		if (angular.isString(defaultSortBy) && (['asc', 'desc'].indexOf(defaultSortOrder) >= 0)) {
			return {[defaultSortBy]: defaultSortOrder};
		}

		return null;
	}

	function serialize(sorting: ISorting|null) {
		if (angular.isObject(sorting)) {
			const sortBy = Object.keys(sorting)[0] || null;
			const sortOrder = sortBy ? sorting[sortBy] : null;

			if(sortBy !== defaultSortBy && sortOrder !== defaultSortOrder) {
				return {
					sortBy: sortBy,
					sortOrder: sortOrder,
				};
			}
		}

		return {
			sortBy: null,
			sortOrder: null,
		};
	}
}

export interface ISortingParamConfig {
	defaultValue?: ISorting|null;
}

export interface ISorting { [index: string]: 'asc'|'desc'; }

export { sortingParam }
