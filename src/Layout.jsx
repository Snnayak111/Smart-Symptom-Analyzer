import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import bg from './img/bg.png'
import { MainLayout } from './styles/Layout'
import Navigation from './components/Navigation'
import Home from './components/Home'
import Medical from './components/PredictDisease/'
import Mental from './components/Mental'
import Doctor from './components/Doctor'
import { useNavigate } from 'react-router-dom'
import { ProfileContext } from './context/ProfileContext'
function LoginLayout() {
  const [active, setActive] = useState(1)
  const updateActive = (activeState) => {
    setActive(activeState)
  }
  const navigate = useNavigate()
  const {isAuth} = useContext(ProfileContext)
  useEffect(() => {
    if (!isAuth) {
      navigate('/')
    }
  },[isAuth])
  const displayData = () => {
    switch (active) {
      case 1:
        return <Home updateActive={updateActive} />
      case 2:
        return <Medical updateActive={updateActive} />
      case 3:
        return <Mental updateActive={updateActive} />
      case 4:
        return <Doctor updateActive={updateActive} />
      default:
        return <Home updateActive={updateActive}/>
    }
  }

  return (
    <AppStyled
      bg={bg}
      className='App'>
      <MainLayout>
        <Navigation
          active={active}
          setActive={setActive}
          mode={'home'}
        />
        <main>{displayData()}</main>
      </MainLayout>
    </AppStyled>
  )
}

const AppStyled = styled.div`
  height: 100vh;
  background-image: url(${(props) => props.bg});
  position: relative;
  main {
    flex: 1;
    background: rgba(252, 246, 249, 0.78);
    border: 3px solid #ffffff;
    backdrop-filter: blur(4.5px);
    border-radius: 32px;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
`
export default LoginLayout
