import { combineReducers } from 'redux';
import { user, usersHasErrored, usersIsLoading } from './users';
import { issues, issuesHasErrored, issuesIsLoading } from './issues';

export default combineReducers({
    user,
    usersHasErrored,
    usersIsLoading,
    issues,
    issuesHasErrored,
    issuesIsLoading
});