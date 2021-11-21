import * as React from "react"
import { ethers } from "ethers"
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 64px;
`

const DataContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 600px;
`

const Header = styled.div`
  text-align: center;
  font-size: 32px;
  font-weight: 600;
  color: #fff;
`

const Bio = styled.div`
  text-align: center;
  color: gray;
  margin-top: 16px;
  color: rgba(255, 255, 255, 0.7);
`

const WaveButton = styled.button`
  cursor: pointer;
  margin-top: 16px;
  padding: 8px;
  border: 0;
  border-radius: 5px;
  background-color: #fff;
  color: #121212;
`

export default function App() {

  const wave = () => {
    
  }
  
  return (
    <Container>
      <DataContainer>
        <Header>
        Wow, here's a cool dApp !
        </Header>

        <Bio>
        I'm Matteo, and I really like to know who's been on this page, so you can leave a message by waving at me, that's dope, right?
        </Bio>

        <WaveButton onClick={wave}>
          Wave 👋🏻
        </WaveButton>
      </DataContainer>
    </Container>
  );
}
