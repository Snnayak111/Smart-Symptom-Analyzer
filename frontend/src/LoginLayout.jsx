import React, { useContext, useState } from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import styled from 'styled-components'
import bg from './img/bg.png'
import { MainLayout } from './styles/Layout'
import Navigation from './components/Navigation'
import { useNavigate } from 'react-router-dom'
import { ProfileContext } from './context/ProfileContext'
import { useEffect } from 'react'
function LoginLayout() {
  const [active, setActive] = useState(1)
  const updateActive = (activeState) => {
    setActive(activeState)
  }
  const navigate = useNavigate();
  const {isAuth} = useContext(ProfileContext)
  useEffect(() => {
    if (isAuth) {
      navigate('/home')
    }
  },[isAuth])
  const displayData = () => {
    switch (active) {
      case 1:
        return <Login updateActive={updateActive} />
      case 2:
        return <Signup updateActive={updateActive} />
      case 3:
        return <AdminLogin updateActive={updateActive} />
      default:
        return <Login />
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
          mode={'login'}
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
