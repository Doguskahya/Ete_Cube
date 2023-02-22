import 'antd/dist/reset.css';
import './App.css';
import {Route, Routes, BrowserRouter as Router} from 'react-router-dom';
import LogIn from './pages/LogIn';
import Products from './pages/Products';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Companies from './pages/Companies';
import SignUp from './pages/SignUp.js';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="App">
      <Layout>
        <Router>
          
          <Content>
            <Routes>
              <Route path='/' element={<LogIn/>}/>
              <Route path="/log-in" element={<LogIn />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/home" element={<HomePage />} />
              <Route path='/products' element={<Products/>}/>
              <Route path='/companies' element={<Companies/>}/>
            </Routes>
          </Content>
        </Router>
      </Layout>
    </div>
  );
}

export default App;
