import { BrowserRouter, Routes, Route  } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard/index';
import MapView from './components/MapView';


const App = () => (
    <BrowserRouter>
        <Routes>
        <Route path="/" element={<Login />} /> {/* Default route */}
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/map' element={<MapView />} />

        </Routes>
    </BrowserRouter>
);
export default App;
