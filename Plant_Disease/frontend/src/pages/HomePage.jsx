import React from 'react'
import Hero from '../components/Hero'
import HomeCards from '../components/HomeCards'
import FeaturesSection from '../components/FeatureSection'
import Header from '../components/Header'
import Footer from '../components/Footer'

const HomePage = () => {
  return (
    <>
    <Header/>
    <Hero title="The Model will be here" subtitle="Hello Guest!"/>
    <HomeCards/>
    <FeaturesSection/>
    <Footer/>
    </>
  )
}

export default HomePage