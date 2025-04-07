import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownlod from '../../components/AppDownlod/AppDownlod';
import TopDishes from '../../components/TopDishes/TopDishes';
import Offer from '../../components/Offer/Offer';
const Home = () => {
  const[category,setCategory] = useState("All");
  return (
    <div>
      <Header/>
      <TopDishes/>
      <ExploreMenu category={category} setCategory={setCategory}/>
      <FoodDisplay category={category}/>
      <Offer/>
      <AppDownlod/>
    </div>
  )
}

export default Home;
