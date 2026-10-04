import React from 'react'
import Layout from '../../componets/layout/Layout'
import { Section } from 'lucide-react'
import Hero from './Hero'
import TotalUser from './TotalUser'

const Home = () => {
  return (
    <Layout>
      {/* <h1>Welcome to Homepage</h1> */}
        <Hero/>
        <TotalUser/>
    </Layout>
  )
}

export default Home