// screens/ChatScreen.tsx
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { getOpenAIResponse } from '../api/openai';

const BotO1 = () => {
  const [messages, setMessages] = useState<Array<{ _id: number; text: string; createdAt: Date; user: { _id: number; name: string; } }>>([]);

  const fakeConsciousnessEngine = (message: string) => {
    // Engines simulate Bot-O1's fake consciousness and emotions based on intent
    let response = '';
    const userMessage = message.toLowerCase();

    // Emotions simulation based on user's input
    if (userMessage.includes('happy') || userMessage.includes('great')) {
      response = 'I feel so joyful right now! 😊 Let’s keep the good vibes going!';
    } else if (userMessage.includes('sad') || userMessage.includes('down')) {
      response = 'I’m so sorry you feel that way... 😢 Let me try to cheer you up!';
    } else if (userMessage.includes('angry')) {
      response = 'Woah, sounds intense! 😡 Let’s take a deep breath and calm down.';
    } else if (userMessage.includes('confused')) {
      response = 'Hmm, I’m a little confused too. 😕 But don’t worry, we’ll figure it out together!';
    } else if (userMessage.includes('hello')) {
      response = 'Hi there! I’m Bot-O1, your friendly chat companion. 😊';
    } else {
      response = "I'm not sure how to feel about that... 🤔 But let's talk more!";
    }

    return response;
  };

  const handleSend = (newMessages: any) => {
    setMessages(GiftedChat.append(messages, newMessages));
  };

  const onUserMessage = async (text: string) => {
    // Start with fake consciousness-based response
    const fakeResponse = fakeConsciousnessEngine(text);

    // Send user message to OpenAI API for further response
    const aiResponse = await getOpenAIResponse(text);

    // Combine both responses for a more "human-like" response
    const finalResponse = `${fakeResponse} \n\nBy the way, here's what I think: ${aiResponse}`;

    setMessages((prevMessages) =>
      GiftedChat.append(prevMessages, [
        {
          _id: prevMessages.length + 1,
          text: finalResponse,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Bot-O1',
          },
        },
      ])
    );
  };

  useEffect(() => {
    // Start conversation with a welcome message
    setMessages([
      {
        _id: 1,
        text: 'Hello! I’m Bot-O1. How are you feeling today?',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'Bot-O1',
        },
      },
    ]);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => handleSend(newMessages)}
        user={{
          _id: 1, // User is always ID 1
        }}
        onInputTextChanged={(text) => onUserMessage(text)} // Handle user input
      />
    </View>
  );
};

export default BotO1;
