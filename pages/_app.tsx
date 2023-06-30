import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import cookies from 'react-cookies'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import userService from '@/services/userService'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!cookies.load('token')) {
      setLoading(true)
      router.push("/login")
    }
    else {
      const fetchData = async () => {
        let userResponse = await userService.getProfile()
        setUser(userResponse.data)
      }

      fetchData()
      setLoading(false)
    }
  }, [router.asPath])

  return (
    <>
      <Head>
        <link rel="icon" sizes='16x16' href='/static/favicon.svg' />
        <title>SkillAssist</title>
      </Head>
      {
        (!loading || router.pathname == '/login') && <Component {...pageProps } {...user}/>
      }
    </>
  )
}
