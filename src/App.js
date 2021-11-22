import React, { useEffect, useState } from "react"
import { ethers } from "ethers"
import styled from 'styled-components'
import contractABI from './utils/WavePortal.json'

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

const WaveButton = styled.div`
  cursor: pointer;
  margin-top: 16px;
  padding: 8px;
  border: 0;
  border-radius: 5px;
  background-color: #fff;
  color: #121212;
  text-align: center;
`

export default function App() {

  const wavePortalAddress = '0xdC701Ba2A5c9D4CA33046a24Eb7f7769C94Fd55e'
  const wavePortalABI = contractABI.abi

  const [currentAccount, setCurrentAccount] = useState('')
  const [waveNumber, setWaveNumber] = useState(0)
  let provider;
  let wavePortalContract;

  const setNumberOfWaves = async () => {
    if (!wavePortalContract) return 0
    let count = await wavePortalContract.getTotalWaves()
    setWaveNumber(count.toNumber())
  }

  const initPage = (account) => {
    setCurrentAccount(account)
    connectToContract()
    setNumberOfWaves()
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum){
        console.log('Please install Metamask')
        return
      }
      const accounts = await window.ethereum.request({ method: 'eth_accounts' })

      if (accounts.length === 0) {
        console.log('No accounts found')
        return
      }
      const account = accounts[0]
      initPage(account)

    } catch (e) {
      throw(e)
    }
  }

  const connectToContract = () => {
    if (!provider) {
      console.log('coucou')
      provider = new ethers.providers.Web3Provider(window.ethereum)
      wavePortalContract = new ethers.Contract(wavePortalAddress, wavePortalABI, provider.getSigner())
    }
  }

  const wave = async () => {

    if (!window.ethereum){
      console.log('Metamask not installed.')
      return
    }
    try {
      if (!wavePortalContract) connectToContract()
      console.log(wavePortalContract)
      let waveTxn = await wavePortalContract.wave()
      await waveTxn.wait()
      setNumberOfWaves()

    } catch (e) {
      throw e
    }
    
  }

  const loginToMetamask = async () => {

    try {
      if (!window.ethereum){
        console.log('Please install Metamask')
        return
      }
      
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      initPage(accounts[0])
    } catch (e) {
      console.log(e)
      throw e
    }
  }
  
  useEffect(() => {
    checkIfWalletIsConnected()
  }, [])

  return (
    <Container>
      <DataContainer>
        <Header>
        Wow, here's a cool dApp !
        </Header>

        <Bio>
        I'm Matteo, and I really like to know who's been on this page, so you can leave a message by waving at me, that's dope, right?
        <div>So far, I had {waveNumber} waves, impressive!</div>
        </Bio>

        <WaveButton onClick={!currentAccount ? loginToMetamask : wave}>
          {!currentAccount ? 'Login to Metamask' : 'Wave 👋🏻'}
        </WaveButton>
      </DataContainer>
    </Container>
  )
}
