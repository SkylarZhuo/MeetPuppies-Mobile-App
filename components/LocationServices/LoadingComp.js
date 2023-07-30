import { Text } from 'react-native'
import React from 'react'

export default function LoadingComp({initialDis}) {
  return (
    <>
        {initialDis<1000?
                <Text>{initialDis} m</Text>:
                <Text>{(initialDis/1000).toFixed(2)} km</Text>
        }
      
    </>
  )
}