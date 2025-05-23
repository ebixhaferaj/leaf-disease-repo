import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import FeaturesSection from '../components/FeatureSection';
const MainLayout = () => {
  return <>
    <Navbar/>
    <Outlet/>
    <Footer/>
  </>
}

export default MainLayout