import { MainLayout } from './Layouts/main';
import './App.css'; 
import { Homepage } from './Layouts/homepage';

const App = () => {
  return (
    <MainLayout> 
      <Homepage></Homepage>
    </MainLayout>
  );
};

export default App;
