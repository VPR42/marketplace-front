import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'rsuite';
import './not-found-page.scss';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="NotFoundPage">
      <div className="NotFoundPage__header">
        <h1 className="NotFoundPage__title">404</h1>
      </div>
      <div className="NotFoundPage__content">
        <p className="NotFoundPage__message">Страница не найдена</p>
        <div className="NotFoundPage__buttons">
          <Button className="NotFoundPage__button" appearance="primary" onClick={goBack}>
            Назад
          </Button>
          <Button className="NotFoundPage__button" appearance="primary" onClick={goHome}>
            На главную
          </Button>
        </div>
      </div>
    </div>
  );
};
