import { Dropdown, Menu, Image, DropdownDivider, Button, Message, Icon } from 'semantic-ui-react';
import React from 'react';
import { SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';

interface Props {
  context: any;
}

// Logout button on click
const logoutUser = async (context): Promise<void> => {
  try {
    const logoutUserRes = await fetch(`${process.env.BACKEND_URL}/api/users/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!logoutUserRes.ok) {
      throw new Error();
    }
    context.setState({ currentUser: {} });
  } catch (e) {
    console.log(e);
  }
};

// Dismiss Message action
const dismissMessage = (context): void => {
  context.setState({ messageVisible: false });
};

// upload avatar
const uploadAvatar = async (event, context): Promise<void> => {
  const file = event.target.files[0];
  try {
    // get base64 from api
    const data = new FormData();
    data.append('avatar', file);
    data.append('name', context.state.currentUser._id);
    data.append('quality', '90');
    const avatarRes = await fetch(process.env.PHOTO_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PHOTO_API_KEY}`,
      },
      body: data,
    });
    if (!avatarRes.ok) {
      throw new Error();
    }
    const avatarResData = await avatarRes.json();
    context.setState({
      currentUser: {
        ...context.state.currentUser,
        avatar: avatarResData.base64,
      },
    });
    // update user in database
    const updates = {
      avatar: avatarResData.base64,
    };
    const userUpdateRes = await fetch(`${process.env.BACKEND_URL}/api/users?id=${context.state.currentUser._id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (!userUpdateRes.ok) {
      throw new Error();
    }
    // update issues to show new avatar
    const issuesRes = await fetch(`${process.env.BACKEND_URL}/api/issues`);
    if (!issuesRes.ok) {
      throw new Error();
    }
    const issuesResData = await issuesRes.json();
    context.setState({
      issues: issuesResData.reverse(),
    });
  } catch (e) {
    console.log(e);
  }
};

// arrow nav on click for mobile
const arrowClick = (context): void => {
  if (context.state.arrowDirection == 'down') {
    window.scroll(0, window.document.body.scrollHeight);
    context.setState({ arrowDirection: 'up' });
  } else {
    window.scroll(0, 0);
    context.setState({ arrowDirection: 'down' });
  }
};

export const NavBar = (props: Props): JSX.Element => (
  <Menu secondary className="navbar">
    <Menu.Item header>Project Pescadero</Menu.Item>
    {props.context.state.messageVisible && (
      <Message
        onDismiss={(): void => dismissMessage(props.context)}
        className="map_tip"
        header="Getting Started"
        content="Click on the map to create a new issue at that location."
        floating
        color="blue"
      />
    )}
    <Icon
      link
      name={`arrow ${props.context.state.arrowDirection}` as SemanticICONS}
      size="big"
      className="down_arrow"
      circular
      onClick={(): void => arrowClick(props.context)}
    />
    {props.context.state.currentUser && (
      <Dropdown
        icon={null}
        simple
        className="right"
        direction="left"
        trigger={
          (props.context.state.currentUser.avatar && <Image avatar src={props.context.state.currentUser.avatar} />) || (
            <Image avatar src="https://via.placeholder.com/100" />
          )
        }
      >
        <Dropdown.Menu>
          <Dropdown.Header>
            {(props.context.state.currentUser.avatar && (
              <Image avatar src={props.context.state.currentUser.avatar} />
            )) || <Image avatar src="https://via.placeholder.com/100" />}
            <div className="right_flex">
              <span>{props.context.state.currentUser.firstName}</span>
              <input
                id="avatar"
                name="avatar"
                type="file"
                className="file"
                accept=".png,.jpg,.jpeg"
                onChange={(e): Promise<void> => uploadAvatar(e, props.context)}
              />
              <label htmlFor="avatar" className="file">
                Change Avatar
              </label>
            </div>
          </Dropdown.Header>
          <DropdownDivider />
          <Button negative onClick={(): Promise<void> => logoutUser(props.context)}>
            Logout
          </Button>
        </Dropdown.Menu>
      </Dropdown>
    )}
  </Menu>
);
