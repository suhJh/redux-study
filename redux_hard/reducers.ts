import { combineReducers } from 'redux';

interface Payload {
    page: number;
}

interface Action {
    type: string;
    payload: Payload;
}

const pages = (pages = {}, action: Action) => {
    switch (action.type) {
        case 'REQUEST_TODO_PAGE': return {
            ...pages, 
            [action.payload.page]: {
                ids: [],
                fetching: true
            }
        }
        default: return pages;
    }
}