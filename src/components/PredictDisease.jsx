import React, { useState } from 'react'
import styled from 'styled-components'
import { medical } from '../utils/Icons'
import Form from './Form'

const PredictDisease = () => {
  const [activeTab, setActiveTab] = useState(1)

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex)
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return <Form disease='Diabetes' />
      case 2:
        return <Form disease='Heart Disease' />
      case 3:
        return <Form disease="Parkinson's Disease" />
      case 4:
        return <Form disease='Breast Cancer' />
      default:
        return null
    }
  }

  return (
    <PredictDiseaseStyled>
      <HeaderSection>
        <TitleWrapper>
          <IconWrapper>{medical}</IconWrapper>
          <h2>Disease Predictor</h2>
        </TitleWrapper>
        <p>
          Use our AI-powered tools to predict potential health risks based on
          your parameters
        </p>
      </HeaderSection>

      <TabsContainer>
        <TabButton
          active={activeTab === 1}
          onClick={() => handleTabClick(1)}>
          Diabetes
        </TabButton>
        <TabButton
          active={activeTab === 2}
          onClick={() => handleTabClick(2)}>
          Heart Disease
        </TabButton>
        <TabButton
          active={activeTab === 3}
          onClick={() => handleTabClick(3)}>
          Parkinson's Disease
        </TabButton>
        <TabButton
          active={activeTab === 4}
          onClick={() => handleTabClick(4)}>
          Breast Cancer
        </TabButton>
      </TabsContainer>

      <ContentContainer>
        <FormWrapper>{renderTabContent()}</FormWrapper>
      </ContentContainer>
    </PredictDiseaseStyled>
  )
}

const PredictDiseaseStyled = styled.div`
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px); /* Adjust based on your navbar height */
`

const HeaderSection = styled.div`
  margin-bottom: 2rem;
  text-align: center;

  h2 {
    color: #4b0082;
    font-size: 28px;
    margin-bottom: 0.5rem;
  }

  p {
    color: #666;
    font-size: 16px;
  }
`

const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`

const IconWrapper = styled.span`
  font-size: 24px;
  margin-right: 10px;
  color: #4b0082;
`

const TabsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`

const TabButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${(props) => (props.active ? '#4b0082' : '#f5f5f5')};
  color: ${(props) => (props.active ? 'white' : '#333')};
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: ${(props) => (props.active ? '600' : '500')};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.active ? '0 4px 8px rgba(75, 0, 130, 0.2)' : 'none'};

  &:hover {
    background: ${(props) => (props.active ? '#4b0082' : '#e9e9e9')};
  }

  @media (max-width: 768px) {
    width: 80%;
  }
`

const ContentContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Hide overflow at container level */
`

const FormWrapper = styled.div`
  overflow-y: auto; /* Enable vertical scrolling for the form content */
  flex: 1;
  padding-right: 10px; /* Add space for scrollbar */

  /* Customizing scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c0c0c0;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a0a0a0;
  }
`

export default PredictDisease
