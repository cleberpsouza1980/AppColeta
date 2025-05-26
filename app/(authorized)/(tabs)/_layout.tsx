import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { ReactNode } from 'react';

export default function TabLayout(): ReactNode {

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="vincularcoletas"
        options={{
          title: "Vincular Coletas",
          //headerTitle: `Vincula Coletas: ${loginInUi}`,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="plus" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Acessar Coletas',
          //headerTitle: `Acessar Coletas: ${loginInUi}`,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="truck" color={color} />,
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: 'Config',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />

    </Tabs>
  )
}



