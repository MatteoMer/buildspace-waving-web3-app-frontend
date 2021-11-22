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

const WaveButton = styled.button`
  cursor: pointer;
  margin-top: 16px;
  padding: 8px;
  border: 0;
  border-radius: 5px;
  background-color: #fff;
  color: #121212;
  text-align: center;
`

const WaveList = styled.div`
  background-color: #fff;
  margin-top: 16px;
  padding: 8px;
  border-radius: 5px;
  span {
    font-weight: 600;
  }
`

const MessageInput = styled.input`
    width: 83%;
    margin-right: 12px;
    padding: 11px;
    border-radius: 5px;
    border: 0px;
    padding-bottom: 9px;
`

export default function App() {

  const wavePortalAddress = '0xF9e923E2957594082B6Ad4C84D7d58801cd17a66'
  const wavePortalABI = contractABI.abi

  const [currentAccount, setCurrentAccount] = useState('')
  const [waveNumber, setWaveNumber] = useState(0)
  const [allWaves, setAllWaves] = useState([])
  const [waveMessage, setWaveMessage] = useState('')

  let provider;
  let wavePortalContract;

  const getNumberOfWaves = async () => {
    if (!wavePortalContract) return 0
    let count = await wavePortalContract.getTotalWaves()
    setWaveNumber(count.toNumber())
  }

  const initPage = (account) => {
    setCurrentAccount(account)
    connectToContract()
    getNumberOfWaves()
    getAllWaves()
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
      provider = new ethers.providers.Web3Provider(window.ethereum)
      wavePortalContract = new ethers.Contract(wavePortalAddress, wavePortalABI, provider.getSigner())
    }
  }

  const getAllWaves = async () => {
    if (!window.ethereum){
      console.log('Metamask not installed.')
      return
    }
    if (!wavePortalContract) connectToContract()

    const waves = await wavePortalContract.getAllWaves()

    let cleanWaves = []
    waves.forEach(wave => {
      cleanWaves.push({
        'address': wave.addr,
        'message': wave.message,
        'timestamp': new Date(wave.timestamp *1000)
      })
    })

    setAllWaves(cleanWaves.reverse())
  }

  const wave = async () => {

    if (!window.ethereum){
      console.log('Metamask not installed.')
      return
    }
    try {
      if (!wavePortalContract) connectToContract()
      console.log(wavePortalContract)
      let waveTxn = await wavePortalContract.wave(waveMessage, { gasLimit: 300000 })
      setWaveMessage('')
      await waveTxn.wait()
      getNumberOfWaves()
      getAllWaves()

    } catch (e) {
      throw e
    }
    
  }

  const changeMessage = (event) => {
    setWaveMessage(event.target.value)
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
    const onNewWave = (from, timestamp, message) => {
      console.log('NewWave', from, timestamp, message)
      getAllWaves()
    }
  
    if (window.ethereum) {
      if (!provider) connectToContract()
      wavePortalContract.on('NewWave', onNewWave)
    }
  
    return () => {
      if (wavePortalContract) {
        wavePortalContract.off('NewWave', onNewWave)
      }
    }
  }, [])

  return (
    <Container>
      <DataContainer>
        <Header>
        Wow, here's a cool dApp ! 🎉
        </Header>

        <Bio>
        I'm Matteo, and I really like to know who's been on this page, so you can leave a message by waving at me, that's dope, right?
        <div>So far, I had {waveNumber} waves, impressive!</div>
        </Bio>
        <div>
          {currentAccount && 
          <MessageInput type='textbox' placeholder='Your message' value={waveMessage} onChange={changeMessage}></MessageInput>
          }
          <WaveButton onClick={!currentAccount ? loginToMetamask : wave}>
            {!currentAccount ? 'Login to Metamask' : 'Wave 👋🏻'}
          </WaveButton>
        </div>
 

        {allWaves.map((wave, index) => {
          return (
            <WaveList key={index}>
              <div><span>Address:</span> {wave.address}</div>
              <div><span>Time:</span> {wave.timestamp.toString()}</div>
              <div><span>Message:</span> {wave.message}</div>
            </WaveList>
          )
        })}
      </DataContainer>
    </Container>
  )
}
