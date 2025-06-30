import React from 'react'
import  Navbar  from './components/Navbar';
import {Routes,Route, useLocation} from 'react-router-dom'
import Home from './pages/Home';
import Footer from './components/Footer';
import AllRooms from './pages/AllRooms';
import RoomsDetails from './pages/RoomsDetails';
import MyBookings from './pages/MyBookings';

const App = () => {

  const isOwnerpath = useLocation().pathname.includes("owner")
  return (
    <div>
      {!isOwnerpath && <Navbar />}
      <div className='min-h-[70vh]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/rooms' element={<AllRooms />} />
          <Route path='/rooms/:id' element={<RoomsDetails />} />
          <Route path='/my-bookings' element={<MyBookings />} />

        </Routes>

      </div>
      <Footer/>
    </div>
  )
}

export default App
