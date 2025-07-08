import React, { useContext } from 'react'
import styled from 'styled-components'
import avatar from '../img/avatar.png'
import { loginItems } from '../utils/loginItems'
import { menuItems } from '../utils/menuItems'
import { ProfileContext } from '../context/ProfileContext'
import { signout } from '../utils/Icons'
import { useNavigate } from 'react-router-dom'

function Navigation({ active, setActive, mode }) {
  // Get auth and profile functions from context
  const { setIsAuth, setProfile, profile, isAuth } = useContext(ProfileContext)
  const navigate = useNavigate()

  // Logout handler
  const handleLogout = () => {
    setIsAuth(false)
    setProfile({})
    navigate('/')
  }

  return (
    <NavStyled>
      <div className='user-con'>
        <img
          src={avatar}
          alt='loading'
        />
        <div className='text'>
          <p>Smart symptom</p>
        </div>
      </div>

      {/* User greeting section moved here, above the menu tabs */}
      {mode === 'home' && isAuth && profile?.name && (
        <div className='greeting-container'>
          <div className='greeting-content'>
            <span className='greeting-text'>Welcome,</span>
            <span className='user-name'>{profile.name}</span>
          </div>
          <div className='greeting-divider'></div>
        </div>
      )}

      <ul className='menu-items'>
        {mode === 'login' &&
          loginItems.map((item) => {
            return (
              <li
                key={item.id}
                onClick={() => setActive(item.id)}
                className={active === item.id ? 'active' : ''}>
                {item.icon}
                <span>{item.title}</span>
              </li>
            )
          })}
        {mode === 'home' &&
          menuItems.map((item) => {
            return (
              <li
                key={item.id}
                onClick={() => setActive(item.id)}
                className={active === item.id ? 'active' : ''}>
                {item.icon}
                <span>{item.title}</span>
              </li>
            )
          })}
      </ul>
      <div className='bottom-nav'>
        {mode === 'home' && (
          <button
            className='logout-btn'
            onClick={handleLogout}>
            {signout}
            <span>Logout</span>
          </button>
        )}
      </div>
    </NavStyled>
  )
}

const NavStyled = styled.nav`
  padding: 2rem 1.5rem;
  width: 336px;
  height: 100%;
  background: rgba(252, 246, 249, 0.78);
  border: 3px solid #ffffff;
  backdrop-filter: blur(4.5px);
  border-radius: 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;

  .user-con {
    height: 80px;
    display: flex;
    align-items: center;
    gap: 1rem;

    img {
      margin-right: -2px;
      width: 60px;
      height: 60px;
      border-radius: 40%;
      object-fit: cover;
      background: #fcf6f9;
      border: 0.3px solid #ffffff;
      padding: 0.15rem;
      box-shadow: 0px 1px 17px rgba(0, 0, 0, 0.06);
    }

    .text {
      display: flex;
      flex-direction: column;

      p {
        color: var(--primary-color, darkViolet);
        font-weight: 900;
        font-size: 37px;
        margin-bottom: 0.2rem;
        line-height: 1.2;
      }
    }
  }

  /* New greeting container styling */
  .greeting-container {
    background: rgba(75, 0, 130, 0.1);
    border-radius: 16px;
    padding: 1rem 1.2rem;
    margin-bottom: 0.5rem;
    box-shadow: 0 2px 8px rgba(75, 0, 130, 0.08);

    .greeting-content {
      display: flex;
      flex-direction: column;

      .greeting-text {
        font-size: 0.9rem;
        color: rgba(34, 34, 96, 0.7);
        margin-bottom: 0.2rem;
      }

      .user-name {
        font-size: 1.2rem;
        font-weight: 700;
        color: var(--primary-color, darkViolet);
        line-height: 1.4;
      }
    }

    .greeting-divider {
      height: 3px;
      width: 40px;
      background: var(--primary-color, darkViolet);
      margin-top: 0.5rem;
      border-radius: 2px;
    }
  }

  .menu-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    li {
      display: grid;
      grid-template-columns: 40px auto;
      align-items: center;
      margin: 0.6rem 0;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.4s ease-in-out;
      color: rgba(34, 34, 96, 0.6);
      padding-left: 1rem;
      position: relative;
      i {
        color: rgba(34, 34, 96, 0.6);
        font-size: 1.4rem;
        transition: all 0.4s ease-in-out;
      }
    }
  }

  .active {
    color: rgba(34, 34, 96, 1) !important;
    i {
      color: rgba(34, 34, 96, 1) !important;
    }
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 100%;
      background: #222260;
      border-radius: 0 10px 10px 0;
    }
  }

  .bottom-nav {
    margin-top: auto;

    .logout-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: none;
      border: none;
      font-size: 1rem;
      font-weight: 500;
      color: rgba(34, 34, 96, 0.6);
      cursor: pointer;
      padding: 0.8rem 1rem;
      border-radius: 10px;
      transition: all 0.3s ease-in-out;
      width: 100%;

      &:hover {
        background-color: rgba(252, 246, 249, 0.9);
        color: rgba(34, 34, 96, 1);
      }

      svg {
        color: inherit;
        font-size: 1.4rem;
      }
    }
  }
`

export default Navigation
