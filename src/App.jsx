import { useState, useEffect } from 'react'
import { 
  useLaunchParams, 
  retrieveLaunchParams,
  backButton,
  mainButton,
  useSignal 
} from '@telegram-apps/sdk-react'
import { AppRoot, Section, Cell, List, Placeholder } from '@telegram-apps/telegram-ui'


import './App.css'
function App() {
  const [count, setCount] = useState(0)
  const [initData, setInitData] = useState(null)
  const launchParams = useLaunchParams()
  const themeParams = { isDark: false, colorScheme: 'light' } // Temporary fallback

  const isBackButtonVisible = useSignal(backButton.isVisible)
  
  useEffect(() => {
    try {
      const { initData: initDataParsed } = retrieveLaunchParams()
      console.log('Init data:', initDataParsed,"SS")
      setInitData(initDataParsed)
    } catch (error) {
      console.log('Init data not available:', error)
    }
  }, [])
  
  useEffect(() => {
    backButton.mount()
    mainButton.mount()
    
    mainButton.setText('Click me!')
    mainButton.show()
    mainButton.enable()
    
    const unsubscribe = mainButton.onClick(() => {
      setCount(prev => prev + 1)
    })
    
    return () => {
      unsubscribe()
      backButton.unmount()
      mainButton.unmount()
    }
  }, [])
  
  useEffect(() => {
    if (count > 0) {
      backButton.show()
    }
    
    if (count > 5) {
      mainButton.setText(`Wow! ${count} clicks`)
    } else if (count > 0) {
      mainButton.setText(`Clicked ${count} times`)
    }
  }, [count])
  
  useEffect(() => {
    if (isBackButtonVisible) {
      const unsubscribe = backButton.onClick(() => {
        setCount(0)
        backButton.hide()
        mainButton.setText('Click me!')
      })
      return unsubscribe
    }
  }, [isBackButtonVisible])
  console.log(launchParams, 'Launch params')
  return (
    <AppRoot
      appearance={themeParams.isDark ? 'dark' : 'light'}
      platform="ios"
    >
      <List>
        <Section header="Telegram Mini App SDK Demo">
          <Cell subtitle="SDK muvaffaqiyatli ulandi">
            Welcome to your Telegram Mini App!
          </Cell>
          
          {initData?.user && (
            <Cell 
              subtitle={`ID: ${initData.user.id}`}
              description={initData.user.languageCode ? `Language: ${initData.user.languageCode}` : undefined}
            >
              Hello, {initData.user.firstName || 'User'}!
            </Cell>
          )}
          
          <Cell subtitle="Bosilgan marta">
            Main Button Clicks: {count}
          </Cell>
          
          {count === 0 && (
            <Placeholder 
              description="Main Button tugmasini bosing"
            >
              Get started
            </Placeholder>
          )}
          
          {themeParams && (
            <Cell subtitle={themeParams.isDark ? 'Dark mode' : 'Light mode'}>
              Theme: {themeParams.colorScheme}
            </Cell>
          )}
          
          {launchParams && (
            <Cell subtitle="Platform ma'lumotlari">
              Platform: {launchParams.platform}, Version: {launchParams.version}
            </Cell>
          )}
        </Section>
      </List>
    </AppRoot>
  )
}

export default App
