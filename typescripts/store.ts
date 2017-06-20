import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';


function logger({ getState }) {
  return (next) => (action) => {
    //console.log(action);
    //console.log('will dispatch', action.type)

    let returnValue = next(action)

    //console.log('state after dispatch------------------------------------------------------\n', getState())

    return returnValue
  }
}

const rootReducer = combineReducers(reducers);
//const store = createStore(rootReducer, applyMiddleware(logger, thunk));

export default createStore(rootReducer, applyMiddleware(logger, thunk));
