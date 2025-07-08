import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import hero from '../img/hero.png'; // Make sure this image exists
import { brain, medical, faMap } from '../utils/Icons';

const Home = ({updateActive}) => {
    const navigate = useNavigate();

    return (
        <HomeStyled>
            <HeroSection>
                <div className='hero'>
                    <div className='des'>
                        <h3>Smart symptom :</h3>
                        <h1>Take Charge of Your Health, Mind & Body</h1>
                        <p>Your comprehensive health companion. 
                           Get accurate disease predictions, mental health support, and real-time 
                           health analytics at your fingertips.</p>
                    </div>
                    <div className='des'>
                        <img src={hero} alt='Healthcare illustration'></img>
                    </div>
                </div>
            </HeroSection>

            <CardContainer>
                <Card onClick={() => updateActive(2)}>
                    <div className="icon">{medical}</div>
                    <h2>Predict Disease</h2>
                    <p>Get AI-powered symptom analysis and disease predictions</p>
                </Card>
                
                <Card onClick={() => updateActive(3)}>
                    <div className="icon">{brain}</div>
                    <h2>Talk with AI Bot</h2>
                    <p>Your AI companion for health guidance and mental wellness</p>
                </Card>
                
                <Card onClick={() => updateActive(4)}>
                    <div className="icon">{faMap}</div>
                    <h2>View Health Map</h2>
                    <p>See disease prevalence and health trends in your area</p>
                </Card>
            </CardContainer>
        </HomeStyled>
    );
}

const HomeStyled = styled.div`
    width: 100%;
    padding: 2rem;
`;

const HeroSection = styled.div`
    height: 350px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--primary-color);
    
    .hero {
        height: 300px;
        margin: 50px 80px;
        display: flex;
        justify-content: space-between;
    }
    
    .des {
        flex: 1;
        margin-right: 20px;
        margin-top: 40px;
    }

    .des h3 {
        text-align: center;
        font-size: 26px;
        font-weight: 700;
        color: #4b0082; /* Violet color */
        margin-bottom: 10px;
    }

    .des h1 {
        text-align: center;
        align-items: start;
        font-weight: 700;
        font-size: 40px;
        color: var(--primary-color);
    }

    .des p {
        text-align: center;
        align-items: center;
        color: #222260;
        font-weight: 500;
        margin-top: 1rem;
        line-height: 1.6;
    }

    .des img {
        width: 320px;
        margin-left: 110px;
        margin-top: -45px;
    }

    @media (max-width: 768px) {
        .hero {
            flex-direction: column;
            height: auto;
        }
        
        .des {
            margin-right: 0;
            text-align: center;
        }
        
        .des img {
            margin-left: 0;
            margin-top: 2rem;
            width: 280px;
            margin: 2rem auto 0;
            display: block;
        }
    }
`;

const CardContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 60px 50px;
    gap: 25px;
    
    @media (max-width: 768px) {
        flex-direction: column;
        margin: 60px 20px;
    }
`;

const Card = styled.div`
    background: #fff;
    padding: 30px;
    border-radius: 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    width: calc(33.33% - 20px);
    transition: all 0.3s ease;
    color: var(--primary-color);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    .icon {
        font-size: 2.5rem;
        margin-bottom: 1.5rem;
        color: #4b0082; /* Violet color */
    }

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        cursor: pointer;
    }

    h2 {
        font-weight: 700;
        margin-bottom: 1rem;
        color: #4b0082; /* Violet color */
    }

    p {
        font-size: 17px;
        color: #666;
        line-height: 1.5;
    }
    
    @media (max-width: 768px) {
        width: 100%;
        margin-bottom: 2rem;
    }
`;

export default Home;
