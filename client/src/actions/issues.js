// dispatch functions
export function issuesHasErrored(bool) {
  return {
    type: "ISSUES_HAS_ERRORED",
    hasErrored: bool
  };
}

export function issuesIsLoading(bool) {
  return {
    type: "ISSUES_IS_LOADING",
    isLoading: bool
  };
}

export function getIssuesSuccess(issues) {
  return {
    type: "ISSUES_GET_SUCCESS",
    issues
  };
}

export function removeIssueSuccess(index) {
  return {
    type: "ISSUES_DELETE_SUCCESS",
    index
  };
}

export function addIssueSuccess(issue) {
  return {
    type: "ISSUES_POST_SUCCESS",
    issue
  };
}

// actions
export function getIssues(url) {
  return dispatch => {
    dispatch(issuesIsLoading(true));

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }

        dispatch(issuesIsLoading(false));
        return response;
      })
      .then(response => response.json())
      .then(issues => dispatch(getIssuesSuccess(issues)))
      .catch(e => {
        console.log(e);
        dispatch(issuesHasErrored(true));
      });
  };
}

export function addIssue(issue) {
  return dispatch => {
    fetch(`/api/issues`, {
      method: "post",
      body: JSON.stringify(issue)
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then(res => {
        if (res.hasOwnProperty("error")) {
          throw Error(res.error);
        }
        dispatch(addIssueSuccess(issue));
      })
      .catch(e => {
        console.log(e);
        dispatch(issuesHasErrored(true));
      });
  };
}

export function removeIssue(index, id) {
  return dispatch => {
    fetch(`/api/issues?id=${id}`, {
      method: "delete"
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response;
      })
      .then(response => response.json())
      .then(res => {
        if (res.hasOwnProperty("error")) {
          throw Error(res.error);
        }
        dispatch(removeIssueSuccess(index));
      })
      .catch(e => {
        console.log(e);
        dispatch(issuesHasErrored(true));
      });
  };
}
