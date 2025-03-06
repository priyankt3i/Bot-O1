import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOpenAIResponse } from '../api/openai'; // Make sure this file exists and contains the OpenAI API logic
import LottieView from 'lottie-react-native';

// Message type for chat items
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [thinking, setThinking] = useState(false);
  const [emotion, setEmotion] = useState<'neutral' | 'happy' | 'curious' | 'thoughtful'>('neutral');

  useEffect(() => {
    loadChatHistory();
  }, []);

  // Load previous conversation from AsyncStorage
  const loadChatHistory = async () => {
    const storedMessages = await AsyncStorage.getItem('chatHistory');
    if (storedMessages) setMessages(JSON.parse(storedMessages));
  };

  // Save updated conversation to AsyncStorage
  const saveChatHistory = async (newMessages: Message[]) => {
    await AsyncStorage.setItem('chatHistory', JSON.stringify(newMessages));
  };

  // Detect AI's emotion based on input text
  const detectEmotion = (text: string): 'neutral' | 'happy' | 'curious' | 'thoughtful' => {
    if (text.includes('love') || text.includes('great')) return 'happy';
    if (text.includes('why') || text.includes('how')) return 'curious';
    if (text.includes('think') || text.includes('believe')) return 'thoughtful';
    return 'neutral';
  };

  // Handle sending message
  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: inputText, sender: 'user' };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setThinking(true);

    // Simulate thought process delay
    setTimeout(async () => {
      const aiResponse = await getOpenAIResponse(inputText); // Use the API to get the response
      const newEmotion = detectEmotion(aiResponse);

      const aiMessage: Message = { id: Date.now().toString(), text: aiResponse, sender: 'ai' };
      const finalMessages = [...updatedMessages, aiMessage];

      setMessages(finalMessages);
      setEmotion(newEmotion);
      setThinking(false);
      saveChatHistory(finalMessages); // Save the updated conversation
    }, 1000); // Delay for simulating the AI thinking process
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sender === 'user' ? styles.userMessage : styles.aiMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={styles.chatContainer}
      />

      {/* Display AI thinking animation when AI is "thinking" */}
      {thinking && (
        <LottieView
          source={require('../assets/thinking.json')} // Path to your Lottie animation file
          autoPlay
          loop
          style={styles.thinkingAnimation}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Type a message..."
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingTop: 40,
    backgroundColor: '#f9f9f9',
  },
  chatContainer: {
    paddingBottom: 80,
  },
  messageContainer: {
    marginBottom: 10,
    marginHorizontal: 15,
    borderRadius: 20,
    padding: 12,
    maxWidth: '75%',
  },
  userMessage: {
    backgroundColor: '#4CAF50',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  aiMessage: {
    backgroundColor: '#007BFF',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  messageText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  inputField: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007BFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  thinkingAnimation: {
    position: 'absolute',
    bottom: 80,
    left: 40,
    right: 40,
    height: 100,
  },
});

export default ChatScreen;
