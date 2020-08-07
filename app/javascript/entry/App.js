import React, {useState} from 'react';
import loadable from '@loadable/component';

const ExampleComponent = loadable(() => import('../components/ExampleComponent'));

const App = () => {
  const [shouldShowComponent, setShowComponent] = useState(false);

  return (
    <div>
      <h1>Hello from React!</h1>
      <button onClick={() => setShowComponent(true)}>Show example component</button>
      {shouldShowComponent && <ExampleComponent />}
    </div>
  );
};

export default App;
