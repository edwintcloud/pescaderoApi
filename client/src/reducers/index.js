import { combineReducers } from 'redux';
import { user, usersHasErrored, usersIsLoading } from './users';

export default combineReducers({
    user,
    usersHasErrored,
    usersIsLoading
});