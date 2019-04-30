import React, { useContext } from 'react';
import { NextStatelessComponent } from 'next';
import { Context, Landing } from '../components';

interface Props {
  context?: any;
  router?: any;
}

const IndexPage: NextStatelessComponent<Props> = (props: Props): JSX.Element => {
  const context = useContext(Context);
  console.log(context);
  return (
    <Landing
      title="Project Pescadero"
      subtitle="Changing the world, one small act of kindness at a time."
      router={props.router}
    />
  );
};

export default IndexPage;
