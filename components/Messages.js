import React from 'react'
import {useState, useEffect } from 'react';
import { Client } from '@xmtp/xmtp-js'
import {useAccount, useSigner} from 'wagmi' 

export default function Message() {


    const {isConnected} = useAccount()
    const { data:signer } = useSigner()
    const [message, setMessage] = useState('')
    const [xmtpClient, setXmtpClient] = useState(null)
  
    
    const createDms = async () => {
      
      if (signer) {
        const xmtp = await Client.create(signer)
        setXmtpClient(xmtp)
        const conversation = await xmtp.conversations.newConversation(
          '0x05F0D0CcC2b00f55ea61684Ae2b9369e5e499F91'
          )
        for await (const message of await conversation.streamMessages()) {  
          console.log(`[${message.senderAddress}]: ${message.content}`)
        }
      }
    }
    
    const sendMessage = async () => {
      if (signer) {
        const conversation = await xmtpClient.conversations.newConversation(
          '0x05F0D0CcC2b00f55ea61684Ae2b9369e5e499F91'
          )
          await conversation.send(message)
          setMessage('')
        }
      }

      const onChange =(e) => {
        e.preventDefault()
        setMessage(e.target.value) 
      }


      const onSubmit = (e) => {
        e.preventDefault()
        sendMessage()

      }
      
      useEffect(() => {
        if (isConnected) {
        createDms()
        }
      }, [isConnected, signer])




    return (
        <div>
            <form onSubmit={onSubmit}>
              <input onChange={onChange} type="text" placeholder="Message" />
              <button type="submit">Send</button>
            </form>
        </div>
    )
}


