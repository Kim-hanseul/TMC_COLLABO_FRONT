import { AnyAction, CombinedState, combineReducers,  configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'
import logger from 'redux-logger'
import { HYDRATE } from 'next-redux-wrapper';
import { IArticleState } from 'modules/articles';
import { IBoardState } from 'modules/boards';
import { IEventState } from './events';
import { IStyleState } from './styles';
import eventReducer from './events'
import rootSaga from 'sagas';
import createSagaMiddleware from '@redux-saga/core'
const isDev = process.env.NODE_ENV ==='development'
const sagaMiddleware = createSagaMiddleware()

interface RootStates {
	  article: IArticleState;
    board: IBoardState
    event: IEventState
    style: IStyleState
}
const rootReducer = (
	state: RootStates,
    action: AnyAction
) => {
    if(action.type === HYDRATE) {
        return{
            ...state, ...action.payload
        }
    }
    return combineReducers({
        event: eventReducer
        
    })(state,action)
}

const makeStore = () =>{
    const store = configureStore({
        reducer:{ rootReducer },
        middleware: (getDefaultMiddleware) =>
        isDev? getDefaultMiddleware().concat(logger, sagaMiddleware) : getDefaultMiddleware(),
        devTools :isDev
    });
    sagaMiddleware.run(rootSaga)
    return store
}
export const wrapper = createWrapper(makeStore, {
    debug: isDev})

const store = makeStore();
export type RootState = ReturnType<typeof rootReducer>
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;