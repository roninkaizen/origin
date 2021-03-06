// Copyright 2018 Energy Web Foundation
// This file is part of the Origin Application brought to you by the Energy Web Foundation,
// a global non-profit organization focused on accelerating blockchain technology across the energy sector,
// incorporated in Zug, Switzerland.
//
// The Origin Application is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY and without an implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details, at <http://www.gnu.org/licenses/>.
//
// @authors: slock.it GmbH; Heiko Burkhardt, heiko.burkhardt@slock.it; Martin Kuechler, martin.kuchler@slock.it

import { Demand } from '@energyweb/market';
import { Actions } from '../features/actions';

const defaultState = [];

function isDemandDeleted(demand: Demand.Entity) {
    return !demand || !demand.demandOwner;
}

export default function reducer(state = defaultState, action) {
    let demandIndex;

    switch (action.type) {
        case Actions.demandCreated:
            demandIndex = state.findIndex((d: Demand.Entity) => d.id === action.demand.id);

            return demandIndex === -1 && !isDemandDeleted(action.demand)
                ? [...state, action.demand]
                : state;
        case Actions.demandUpdated:
            demandIndex = state.findIndex((d: Demand.Entity) => d.id === action.demand.id);

            return demandIndex === -1
                ? [...state, action.demand]
                : [...state.slice(0, demandIndex), action.demand, ...state.slice(demandIndex + 1)];
        default:
            return state;
    }
}
