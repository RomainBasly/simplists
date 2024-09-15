import React from 'react'
import Link from 'next/link'
import Layout from '@/components/Elements/Layout'
// import SocketConnector from '@/components/Materials/SocketConnector'

export default function Profile() {
  return (
    <Layout pageType="default">
      <Link href="/">Lien</Link>
      {/* <SocketConnector /> */}
    </Layout>
  )
}
