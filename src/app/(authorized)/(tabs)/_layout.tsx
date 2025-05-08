import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen 
        name="vincularcoletas"
        options={{
          title:  "Vincula Coletas",
          //headerTitle: `Vincula Coletas: ${loginInUi}`,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="truck" color={color} />,
        }}
      />
      <Tabs.Screen
        name="acessarcoletas"
        options={{
          title: 'Acessar Coletas',
          //headerTitle: `Acessar Coletas: ${loginInUi}`,
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="truck" color={color} />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: 'Config',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  )
}



