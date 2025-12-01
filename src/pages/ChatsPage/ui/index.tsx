import classNames from 'classnames';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader, Message } from 'rsuite';

import { useAppDispatch, useAppSelector } from '@/redux-rtk/hooks';
import { selectAuthState } from '@/redux-rtk/store/auth/authSlice';
import {
  addMessage,
  clearChatError,
  setCurrentChat,
  setWsConnected,
} from '@/redux-rtk/store/chats/chatsSlice';
import { fetchChatmate, fetchChats, fetchMessages } from '@/redux-rtk/store/chats/chatsThunks';
import { selectChatsState } from '@/redux-rtk/store/chats/selectors';

import './chats.scss';

const formatTime = (date: string) =>
  new Date(date).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

const AvatarCircle = ({
  src,
  name,
  surname,
}: {
  src?: string;
  name?: string;
  surname?: string;
}) => {
  const initials = `${name?.[0] ?? ''}${surname?.[0] ?? ''}`.toUpperCase() || '??';
  if (src) {
    return <img src={src} alt={name} className="chat-avatar" />;
  }
  return <div className="chat-avatar chat-avatar--placeholder">{initials}</div>;
};

export const ChatsPage = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(selectAuthState);
  const { items, messagesByChat, chatmates, currentChatId, status, error, wsConnected } =
    useAppSelector(selectChatsState);

  const [messageText, setMessageText] = useState('');
  const [showDetails, setShowDetails] = useState(true);
  const socketRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  useEffect(() => {
    if (currentChatId) {
      dispatch(fetchMessages({ chatId: currentChatId }));
      dispatch(fetchChatmate({ chatId: currentChatId }));
    }
  }, [currentChatId, dispatch]);

  useEffect(() => {
    if (!currentChatId || !user?.id) {
      return;
    }
    const socket = new WebSocket(
      `wss://hack.kinoko.su/ws/chat?chat=${currentChatId}&uid=${user.id}`,
    );
    socketRef.current = socket;

    socket.onopen = () => dispatch(setWsConnected(true));
    socket.onclose = () => dispatch(setWsConnected(false));
    socket.onerror = () => dispatch(setWsConnected(false));
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data?.chatId && data?.content) {
          dispatch(addMessage(data));
        }
      } catch {
        // ignore parse errors
      }
    };

    return () => {
      socket.close();
      dispatch(setWsConnected(false));
    };
  }, [currentChatId, user?.id, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messagesByChat[currentChatId ?? '']?.length]);

  const currentMessages = useMemo(() => {
    const list = messagesByChat[currentChatId ?? ''] ?? [];
    return [...list].sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
  }, [messagesByChat, currentChatId]);

  const currentChatmate = currentChatId ? chatmates[currentChatId] : undefined;

  const handleSend = () => {
    if (
      !messageText.trim() ||
      !socketRef.current ||
      socketRef.current.readyState !== WebSocket.OPEN
    ) {
      return;
    }
    const payload = {
      senderId: user?.id,
      content: messageText.trim(),
    };
    socketRef.current.send(JSON.stringify(payload));
    setMessageText('');
  };

  const groupedMessages = useMemo(() => {
    const groups: { date: string; items: typeof currentMessages }[] = [];
    currentMessages.forEach((msg) => {
      const dateKey = new Date(msg.sentAt).toDateString();
      const group = groups.find((g) => g.date === dateKey);
      if (group) {
        group.items.push(msg);
      } else {
        groups.push({ date: dateKey, items: [msg] });
      }
    });
    return groups;
  }, [currentMessages]);

  if (status === 'loading' && !items.length) {
    return (
      <div className="chats__loader">
        <Loader size="md" />
      </div>
    );
  }

  return (
    <div className="chats">
      {error ? (
        <Message closable onClose={() => dispatch(clearChatError())} type="error" showIcon>
          {error}
        </Message>
      ) : null}

      <div className="chats__sidebar">
        <div className="chats__sidebar-title">Чаты</div>
        {status === 'loading' && <Loader size="sm" />}
        {!items.length && status === 'succeeded' ? (
          <div className="chats__empty">У вас пока нет чатов</div>
        ) : null}
        <div className="chats__list">
          {items.map((chat) => (
            <button
              key={chat.chatId}
              className={classNames('chats__item', {
                'chats__item--active': chat.chatId === currentChatId,
              })}
              onClick={() => dispatch(setCurrentChat(chat.chatId))}
            >
              <AvatarCircle
                src={chat.chatmateAvatar}
                name={chat.chatmateName}
                surname={chat.chatmateSurname}
              />
              <div className="chats__item-text">
                <div className="chats__item-name">
                  {chat.chatmateName} {chat.chatmateSurname}
                </div>
                <div className="chats__item-last">{chat.lastMessage?.content}</div>
              </div>
              {chat.lastMessage ? (
                <div className="chats__item-time">{formatTime(chat.lastMessage.sentAt)}</div>
              ) : null}
            </button>
          ))}
        </div>
      </div>

      <div className="chats__main">
        <div className="chats__header">
          <div className="chats__header-info">
            {currentChatmate ? (
              <>
                <AvatarCircle
                  src={currentChatmate.avatar}
                  name={currentChatmate.name}
                  surname={currentChatmate.surname}
                />
                <div>
                  <div className="chats__header-name">
                    {currentChatmate.name} {currentChatmate.surname}
                  </div>
                  <div className="chats__header-desc">{currentChatmate.orderName}</div>
                </div>
              </>
            ) : (
              <span>Выберите чат</span>
            )}
          </div>
          <button className="chats__details-toggle" onClick={() => setShowDetails((v) => !v)}>
            {showDetails ? 'Скрыть детали' : 'Показать детали'}
          </button>
        </div>

        {!wsConnected && currentChatId ? (
          <div className="chats__ws-warning">Нет соединения. Попробуйте обновить страницу.</div>
        ) : null}

        <div className="chats__messages">
          {groupedMessages.map((group) => (
            <div key={group.date} className="chats__date-group">
              <div className="chats__date-chip">{formatDate(group.items[0].sentAt)}</div>
              {group.items.map((msg) => {
                const isMine = msg.sender === user?.id;
                return (
                  <div
                    key={`${msg.sentAt}-${msg.sender}-${msg.content}`}
                    className={classNames('chats__message', {
                      'chats__message--mine': isMine,
                    })}
                  >
                    <div className="chats__bubble">{msg.content}</div>
                    <div className="chats__time">{formatTime(msg.sentAt)}</div>
                  </div>
                );
              })}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="chats__input">
          <input
            placeholder="Введите сообщение"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSend();
              }
            }}
          />
          <button onClick={handleSend} disabled={!wsConnected || !messageText.trim()}>
            ➤
          </button>
        </div>
      </div>

      {showDetails && currentChatmate ? (
        <div className="chats__details">
          <AvatarCircle
            src={currentChatmate.avatar}
            name={currentChatmate.name}
            surname={currentChatmate.surname}
          />
          <div className="chats__details-name">
            {currentChatmate.name} {currentChatmate.surname}
          </div>
          <div className="chats__details-desc">{currentChatmate.description}</div>
          <button className="chats__details-profile">Перейти в профиль</button>
        </div>
      ) : null}
    </div>
  );
};
