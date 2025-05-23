import React, { ReactNode, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Collapsible from 'react-native-collapsible';

interface AccordionItemProps {
    title: string;
    children: ReactNode; // Explicitly type children
  }

export const AccordionItem: React.FC<AccordionItemProps> = ({ title, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <View style={styles.item}>
      <TouchableOpacity 
        style={styles.header} 
        onPress={() => setIsCollapsed(!isCollapsed)}
      >
        <Text style={styles.title}>{title}</Text>
        <Text>{isCollapsed ? '▼' : '▲'}</Text>
      </TouchableOpacity>
      
      <Collapsible collapsed={isCollapsed}>
        <View style={styles.content}>
          {children}
        </View>
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
    item: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 20,
      marginBottom: 12,
    //   shadowColor: '#000',
    //   shadowOffset: { width: 0, height: 2 },
    //   shadowOpacity: 0.1,
    //   shadowRadius: 4,
    //   elevation: 3,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: '#2c3e50',
    },
    arrow: {
      fontSize: 14,
      color: '#7f8c8d',
      marginLeft: 10,
    },
    content: {
      padding: 20,
      backgroundColor: '#ffffff',
      borderTopWidth: 1,
      borderTopColor: '#ecf0f1',
      marginTop: 20
    },
  });